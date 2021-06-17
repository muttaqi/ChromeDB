"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChromeDB = void 0;
const loader = require("../../node_modules/assemblyscript/lib/loader/index");
class Config {
    constructor() {
        this.collections = new Map();
    }
}
var DatabaseType;
(function (DatabaseType) {
    DatabaseType[DatabaseType["Local"] = 0] = "Local";
    DatabaseType[DatabaseType["Datastore"] = 1] = "Datastore";
    DatabaseType[DatabaseType["Bigtable"] = 2] = "Bigtable";
})(DatabaseType || (DatabaseType = {}));
//TODO: WASM all
class FieldCondition {
    constructor(field, action) {
        this.field = field;
        this.action = action;
    }
    is(value) {
        var cacheRep = {
            collection: this.action.collection,
            action: "Get",
            values: "",
            field: this.field,
            op: "is",
            value: value
        };
        for (var cache of this.action.db.cache) {
            if (cache == cacheRep) {
                this.action.databaseType = DatabaseType.Local;
                break;
            }
        }
        if (this.action.databaseType == DatabaseType.Datastore) {
            return this.datastoreRequest(value, "EQUAL");
        }
        if (this.action.databaseType == DatabaseType.Bigtable) {
            if (this.action instanceof Get) {
                return new Promise((resolve, reject) => {
                });
            }
            else {
                var set = this.action;
                return new Promise((resolve, reject) => {
                });
            }
        }
        return this.wasmQuery(value, this.action.db.wasmIs);
    }
    isnt(value) {
        if (this.action.databaseType == DatabaseType.Datastore) {
            throw Error("Inequality is currently not supported by Datastore");
        }
        return this.wasmQuery(value, this.action.db.wasmIsnt);
    }
    greaterThan(value) {
        var cacheRep = {
            collection: this.action.collection,
            action: "Get",
            values: "",
            field: this.field,
            op: "greaterThan",
            value: value.toString()
        };
        for (var cache of this.action.db.cache) {
            if (cache == cacheRep) {
                this.action.databaseType = DatabaseType.Local;
                break;
            }
        }
        if (this.action.databaseType == DatabaseType.Datastore) {
            return this.datastoreRequest(value, "GREATER_THAN");
        }
        return this.wasmQuery(value, this.action.db.wasmGt);
    }
    lessThan(value) {
        var cacheRep = {
            collection: this.action.collection,
            action: "Get",
            values: "",
            field: this.field,
            op: "lessThan",
            value: value.toString()
        };
        for (var cache of this.action.db.cache) {
            if (cache == cacheRep) {
                this.action.databaseType = DatabaseType.Local;
                break;
            }
        }
        if (this.action.databaseType == DatabaseType.Datastore) {
            return this.datastoreRequest(value, "LESS_THAN");
        }
        return this.wasmQuery(value, this.action.db.wasmLt);
    }
    greaterThanOrEqualTo(value) {
        var cacheRep = {
            collection: this.action.collection,
            action: "Get",
            values: "",
            field: this.field,
            op: "greaterThanOrEqualTo",
            value: value.toString()
        };
        for (var cache of this.action.db.cache) {
            if (cache == cacheRep) {
                this.action.databaseType = DatabaseType.Local;
                break;
            }
        }
        if (this.action.databaseType == DatabaseType.Datastore) {
            return this.datastoreRequest(value, "GREATER_THAN_OR_EQUAL");
        }
        return this.wasmQuery(value, this.action.db.wasmGte);
    }
    lessThanOrEqualTo(value) {
        var cacheRep = {
            collection: this.action.collection,
            action: "Get",
            values: "",
            field: this.field,
            op: "lessThanOrEqualTo",
            value: value.toString()
        };
        for (var cache of this.action.db.cache) {
            if (cache == cacheRep) {
                this.action.databaseType = DatabaseType.Local;
                break;
            }
        }
        if (this.action.databaseType == DatabaseType.Datastore) {
            return this.datastoreRequest(value, "LESS_THAN_OR_EQUAL");
        }
        return this.wasmQuery(value, this.action.db.wasmLte);
    }
    isTrue() {
        return this.action.where((obj) => { return obj[this.field]; });
    }
    isFalse() {
        return this.action.where((obj) => { return obj[this.field]; });
    }
    has(value) {
        if (this.action.databaseType == DatabaseType.Datastore) {
            throw Error("'IN' is currently not supported by Datastore");
        }
        return this.wasmQuery(value, this.action.db.wasmHas);
    }
    length() {
        return new LengthFieldCondition(this);
    }
    datastoreRequest(value, comparator) {
        if (this.action instanceof Get) {
            return new Promise((resolve, reject) => {
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "https://datastore.googleapis.com/v1/projects/" + this.action.projectID + ":runQuery", true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Authorization', 'Bearer ' + this.action.db.token);
                const body = JSON.stringify({
                    query: {
                        filter: {
                            propertyFilter: {
                                property: {
                                    name: this.field
                                },
                                op: comparator,
                                value: {
                                    stringValue: value
                                }
                            }
                        }
                    }
                });
                var field = this.field;
                var action = this.action;
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        var res = JSON.parse(xhr.responseText);
                        console.log(res);
                        var d = res.data;
                        var entities = [];
                        for (var entRes of d.batch.entityResults) {
                            entities.push(entRes.entity);
                        }
                        action.db.makeCollection(action.collection);
                        var coll = action.db.collection(action.collection);
                        coll.addLocal(entities)
                            .then(res => {
                            action.db.cache.push({
                                collection: action.collection,
                                action: "Get",
                                values: "",
                                field: field,
                                op: comparator,
                                value: value
                            });
                            resolve(entities);
                        });
                    }
                    else {
                        console.log("Datastore query failed.");
                    }
                };
                xhr.send(body);
            });
        }
        else if (this.action instanceof Set) {
            var set = this.action;
            return new Promise((resolve, reject) => {
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "https://datastore.googleapis.com/v1/projects/" + this.action.projectID + ":runQuery", true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Authorization', 'Bearer ' + this.action.db.token);
                const body = JSON.stringify({
                    query: {
                        filter: {
                            propertyFilter: {
                                property: {
                                    name: this.field
                                },
                                op: comparator,
                                value: {
                                    stringValue: value
                                }
                            }
                        }
                    }
                });
                var action = this.action;
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        var res = JSON.parse(xhr.responseText);
                        res.on('data', d => {
                            var upserts = [];
                            for (var entRes of d.batch.entityResults) {
                                upserts.push({
                                    upsert: {
                                        key: entRes.entity.key,
                                        properties: set.values
                                    }
                                });
                            }
                            var xhr2 = new XMLHttpRequest();
                            xhr2.open("POST", "https://datastore.googleapis.com/v1/projects/" + action.projectID + ":commit", true);
                            xhr2.setRequestHeader('Content-Type', 'application/json');
                            xhr2.setRequestHeader('Authorization', 'Bearer ' + action.db.token);
                            const body2 = JSON.stringify({
                                mutations: upserts
                            });
                            xhr.onreadystatechange = function () {
                                if (xhr.readyState == 4) {
                                    var res2 = JSON.parse(xhr.responseText);
                                    res2.on('data', d2 => {
                                        action.db.cache = [];
                                        action.db.deleteCollection(action.collection);
                                        resolve(true);
                                    });
                                }
                                else {
                                    console.log("Datastore commit failed.");
                                }
                            };
                            xhr2.send(body2);
                        });
                    }
                    else {
                        console.log("Datastore query failed.");
                    }
                };
                xhr.send(body);
            });
        }
        else {
            return new Promise((resolve, reject) => {
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "https://datastore.googleapis.com/v1/projects/" + this.action.projectID + ":runQuery", true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Authorization', 'Bearer ' + this.action.db.token);
                const body = JSON.stringify({
                    query: {
                        filter: {
                            propertyFilter: {
                                property: {
                                    name: this.field
                                },
                                op: comparator,
                                value: {
                                    stringValue: value
                                }
                            }
                        }
                    }
                });
                var action = this.action;
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        var res = JSON.parse(xhr.responseText);
                        res.on('data', d => {
                            var deletes = [];
                            for (var entRes of d.batch.entityResults) {
                                deletes.push({
                                    delete: entRes.entity.key
                                });
                            }
                            var xhr2 = new XMLHttpRequest();
                            xhr2.open("POST", "https://datastore.googleapis.com/v1/projects/" + action.projectID + ":commit", true);
                            xhr2.setRequestHeader('Content-Type', 'application/json');
                            xhr2.setRequestHeader('Authorization', 'Bearer ' + action.db.token);
                            const body2 = JSON.stringify({
                                mutations: deletes
                            });
                            xhr.onreadystatechange = function () {
                                if (xhr.readyState == 4) {
                                    var res2 = JSON.parse(xhr.responseText);
                                    res2.on('data', d2 => {
                                        action.db.cache = [];
                                        action.db.deleteCollection(action.collection);
                                        resolve(true);
                                    });
                                }
                                else {
                                    console.log("Datastore commit failed.");
                                }
                            };
                            xhr2.send(body2);
                        });
                    }
                    else {
                        console.log("Datastore query failed.");
                    }
                };
                xhr.send(body);
            });
        }
    }
    wasmQuery(value, moduleFunction) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(this.action.collection, (res) => {
                if (res[this.action.collection] != undefined) {
                    this.action.db.store = res[this.action.collection];
                    var keyPtr = this.action.db.__pin(this.action.db.__newString(this.field));
                    var valPtr = this.action.db.__pin(this.action.db.__newString(JSON.stringify(value)));
                    var aPtr = moduleFunction(res[this.action.collection].length, keyPtr, valPtr);
                    var a = this.action.db.__getArray(aPtr);
                    this.action.db.__unpin(keyPtr);
                    this.action.db.__unpin(valPtr);
                    if (this.action instanceof Get) {
                        var out = [];
                        for (let i of a) {
                            var obj = res[this.action.collection][i];
                            for (var key in obj) {
                                obj[key] = JSON.parse(obj[key]);
                            }
                            out.push(obj);
                        }
                        resolve(out);
                    }
                    else if (this.action instanceof Set) {
                        for (let i of a) {
                            var object = res[this.action.collection][i];
                            for (var key in object) {
                                object[key] = JSON.parse(object[key]);
                            }
                            this.action.values.forEach((val, key) => {
                                res[this.action.collection][i][key] = JSON.stringify(val);
                            });
                        }
                        chrome.storage.sync.set({ [this.action.collection]: res[this.action.collection] }, () => {
                            resolve(true);
                        });
                    }
                    else {
                        var indices = new Map();
                        for (let i of a) {
                            indices.set(i, true);
                        }
                        var out = [];
                        for (let i = 0; i < res[this.action.collection].length; i++) {
                            if (indices.has(i)) {
                                out.push(res[this.action.collection][i]);
                            }
                        }
                        chrome.storage.sync.set({ [this.action.collection]: out }, () => {
                            resolve(true);
                        });
                    }
                }
                else {
                    reject(`Error finding collection ${this.action.collection}`);
                }
            });
        });
    }
}
class LengthFieldCondition extends FieldCondition {
    constructor(fc) {
        super(fc.field, fc.action);
    }
    is(value) {
        return this.action.where((obj) => { return obj[this.field].length === value; });
    }
    isnt(value) {
        return this.action.where((obj) => { return obj[this.field].length != value; });
    }
    greaterThan(value) {
        return this.action.where((obj) => { return obj[this.field].length > value; });
    }
    lessThan(value) {
        return this.action.where((obj) => { return obj[this.field].length < value; });
    }
    greaterThanOrEqualTo(value) {
        return this.action.where((obj) => { return obj[this.field].length >= value; });
    }
    lessThanOrEqualTo(value) {
        return this.action.where((obj) => { return obj[this.field].length <= value; });
    }
    isTrue() {
        throw Error("You can't evaluate length as a boolean");
    }
    isFalse() {
        throw Error("You can't evaluate length as a boolean");
    }
    has(value) {
        throw Error("You can't evaluate length as an array");
    }
    length() {
        throw Error("You can't take the length of a length");
    }
}
class Get {
    constructor(db, collection, databaseType, projectID) {
        this.db = db;
        this.collection = collection;
        this.databaseType = databaseType;
        if (projectID) {
            this.projectID = projectID;
        }
    }
    where(conditionOrField) {
        if (typeof conditionOrField === "string") {
            return new FieldCondition(conditionOrField, this);
        }
        else {
            if (this.databaseType != DatabaseType.Local) {
                throw Error("Can't use javascript condition for a cloud database");
            }
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get(this.collection, (res) => {
                    if (res[this.collection] != undefined) {
                        var out = [];
                        for (var object of res[this.collection]) {
                            for (var key in object) {
                                object[key] = JSON.parse(object[key]);
                            }
                            if (conditionOrField(object)) {
                                out.push(object);
                            }
                        }
                        resolve(out);
                    }
                    else {
                        reject(`Error finding collection ${this.collection}`);
                    }
                });
            });
        }
    }
    all() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(this.collection, (res) => {
                if (res[this.collection] != undefined) {
                    for (var i = 0; i < res[this.collection].length; i++) {
                        var object = res[this.collection][i];
                        for (var key in object) {
                            object[key] = JSON.parse(object[key]);
                        }
                        res[this.collection][i] = object;
                    }
                    resolve(res[this.collection]);
                }
                else {
                    reject(`Error finding collection ${this.collection}`);
                }
            });
        });
    }
}
class Set {
    constructor(db, collection, values, databaseType, projectID) {
        this.db = db;
        this.collection = collection;
        this.values = values;
        this.databaseType = databaseType;
        if (projectID) {
            this.projectID = projectID;
        }
    }
    where(conditionOrField) {
        if (typeof conditionOrField === "string") {
            return new FieldCondition(conditionOrField, this);
        }
        else {
            if (this.databaseType != DatabaseType.Local) {
                throw Error("Can't use javascript condition for a cloud database");
            }
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get(this.collection, (res) => {
                    if (res[this.collection] != undefined) {
                        for (var i = 0; i < res[this.collection].length; i++) {
                            var object = res[this.collection][i];
                            for (var key in object) {
                                object[key] = JSON.parse(object[key]);
                            }
                            if (conditionOrField(object)) {
                                this.values.forEach((val, key) => {
                                    res[this.collection][i][key] = JSON.stringify(val);
                                });
                            }
                        }
                        chrome.storage.sync.set({ [this.collection]: res[this.collection] }, () => {
                            resolve(true);
                        });
                    }
                    else {
                        reject(`Error finding collection ${this.collection}`);
                    }
                });
            });
        }
    }
    //TODO: WASM
    all() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(this.collection, (res) => {
                if (res[this.collection] != undefined) {
                    for (var i = 0; i < res[this.collection].length; i++) {
                        this.values.forEach((val, key) => {
                            res[this.collection][i][key] = JSON.stringify(val);
                        });
                    }
                    chrome.storage.sync.set({ [this.collection]: res }, () => {
                        resolve(true);
                    });
                }
                else {
                    reject(`Error finding collection ${this.collection}`);
                }
            });
        });
    }
}
class Delete {
    constructor(db, collection, values, databaseType, projectID) {
        this.db = db;
        this.collection = collection;
        this.values = values;
        this.databaseType = databaseType;
        if (projectID) {
            this.projectID = projectID;
        }
    }
    where(conditionOrField) {
        if (typeof conditionOrField === "string") {
            return new FieldCondition(conditionOrField, this);
        }
        else {
            if (this.databaseType != DatabaseType.Local) {
                throw Error("Can't use javascript function for a cloud database");
            }
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get(this.collection, (res) => {
                    if (res[this.collection] != undefined) {
                        var newCollection = [];
                        for (var i = 0; i < res[this.collection].length; i++) {
                            var object = res[this.collection][i];
                            var testObject = {};
                            for (var key in object) {
                                testObject[key] = JSON.parse(object[key]);
                            }
                            if (!conditionOrField(testObject)) {
                                newCollection.push(object);
                            }
                        }
                        chrome.storage.sync.set({ [this.collection]: newCollection }, () => {
                            resolve(true);
                        });
                    }
                    else {
                        reject(`Error finding collection ${this.collection}`);
                    }
                });
            });
        }
    }
    //TODO: WASM
    all() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.set({ [this.collection]: [] }, () => {
                resolve(true);
            });
        });
    }
}
class Collection {
    constructor(db, name) {
        this.db = db;
        this.name = name;
    }
    get() {
        return new Get(this.db, this.name, this.db.databaseType);
    }
    set(values) {
        return new Set(this.db, this.name, values, this.db.databaseType);
    }
    add(object) {
        if (this.db.databaseType == DatabaseType.Local) {
            return this.addLocal(object);
        }
        else if (this.db.databaseType == DatabaseType.Datastore) {
            this.datastoreInsert([object]);
        }
    }
    addLocal(object) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(this.name, (res) => {
                for (var key in object) {
                    object[key] = JSON.stringify(object[key]);
                }
                if (res[this.name] != undefined) {
                    res[this.name].push(object);
                    chrome.storage.sync.set({ [this.name]: res[this.name] }, () => {
                        resolve(true);
                    });
                }
                else {
                    reject(`Error finding collection ${this.name}`);
                }
            });
        });
    }
    addAll(objects) {
        if (this.db.databaseType == DatabaseType.Local) {
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get(this.name, (res) => {
                    for (var object of objects) {
                        for (var key in object) {
                            object[key] = JSON.stringify(object[key]);
                        }
                    }
                    if (res[this.name] != undefined) {
                        res[this.name].addAll(objects);
                        chrome.storage.sync.set({ [this.name]: res }, () => {
                            resolve(true);
                        });
                    }
                    else {
                        reject(`Error finding collection ${this.name}`);
                    }
                });
            });
        }
        else if (this.db.databaseType == DatabaseType.Datastore) {
            this.datastoreInsert(objects);
        }
    }
    datastoreInsert(objects) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "https://datastore.googleapis.com/v1/projects/" + this.db.projectID + ":runQuery", true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + this.db.token);
            var inserts = [];
            for (var object in objects) {
                var key = object["key"];
                delete object["key"];
                inserts.push({
                    insert: {
                        key: key,
                        properties: object
                    }
                });
            }
            const body = JSON.stringify({
                mutations: inserts
            });
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    resolve(true);
                }
                else {
                    console.log("Datastore query failed.");
                }
            };
            xhr.send(body);
        });
    }
}
class ChromeDB {
    static init(database) {
        var db = new ChromeDB();
        db.database = database;
        db.databaseType = DatabaseType.Local;
        db.cache = [];
        db.initWASM();
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get('chromedb_config', (res) => {
                db.config = new Config();
                if (res.chromedb_config != undefined) {
                    db.config.collections = res.chromedb_config;
                    if (!(database in db.config.collections)) {
                        db.config.collections[database] = [];
                    }
                }
                else {
                    db.config.collections[database] = [];
                }
                resolve(db);
            });
        });
    }
    useDatastore(projectID, accessToken) {
        this.databaseType = DatabaseType.Datastore;
        this.projectID = projectID;
        this.token = accessToken;
    }
    useBigtable() {
    }
    initWASM() {
        const imports = {
            query: {
                log: (msgPtr) => {
                    // at the time of call, wasmExample will be initialized
                    console.log('WASM is talking', this.__getString(msgPtr));
                },
                access: (i, keyPtr) => {
                    this.ptrStore = this.__pin(this.__newString(this.store[i][this.__getString(keyPtr)]));
                    return this.ptrStore;
                },
                accessList: (i, j, keyPtr) => {
                    this.ptrStore = this.__pin(this.__newString(this.store[i][this.__getString(keyPtr)][j]));
                    return this.ptrStore;
                },
                accessListLength: (i, keyPtr) => {
                    return this.store[i][this.__getString(keyPtr)].length;
                },
                free: () => {
                    this.__unpin(this.ptrStore);
                }
            },
            env: {
                memory: new WebAssembly.Memory({ initial: 1024 }),
                table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' })
            }
        };
        loader.instantiate(fetch("query.wasm"), imports)
            .then((module) => {
            this.wasmIs = module.exports.is;
            this.wasmIsnt = module.exports.isnt;
            this.wasmGt = module.exports.greaterThan;
            this.wasmLt = module.exports.lessThan;
            this.wasmGte = module.exports.greaterThanOrEqualTo;
            this.wasmLte = module.exports.lessThanOrEqualTo;
            this.wasmHas = module.exports.has;
            this.__getString = module.exports.__getString;
            this.__newString = module.exports.__newString;
            this.__getArray = module.exports.__getArray;
            this.__newArray = module.exports.__newArray;
            this.__pin = module.exports.__pin;
            this.__unpin = module.exports.__unpin;
        });
    }
    collection(name) {
        if (this.config.collections[this.database].includes(name)) {
            return new Collection(this, name);
        }
        throw Error(`Collection ${name} doesn't belong to database ${this.database}`);
    }
    makeCollection(name) {
        if (this.config.collections[this.database].includes(name)) {
            return new Promise((resolve, reject) => {
                resolve(false);
            });
        }
        return new Promise((resolve, reject) => {
            chrome.storage.sync.set({ [name]: [] }, () => {
                this.config.collections[this.database].push(name);
                resolve(true);
            });
        });
    }
    deleteCollection(name) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.remove(name, () => {
                this.config.collections[this.database].splice(this.config.collections[this.database].indexOf(name), 1);
                resolve(true);
            });
        });
    }
}
exports.ChromeDB = ChromeDB;
//# sourceMappingURL=chromedb.js.map