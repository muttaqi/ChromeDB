/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./js/ts/chromedb.js":
/*!***************************!*\
  !*** ./js/ts/chromedb.js ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChromeDB = void 0;
const loader = __webpack_require__(/*! ../../node_modules/assemblyscript/lib/loader/index */ "./node_modules/assemblyscript/lib/loader/index.js");
class Config {
    constructor() {
        this.collections = new Map();
    }
}
var DatabaseType;
(function (DatabaseType) {
    DatabaseType[DatabaseType["Local"] = 0] = "Local";
    DatabaseType[DatabaseType["Datastore"] = 1] = "Datastore";
    DatabaseType[DatabaseType["Firestore"] = 2] = "Firestore";
})(DatabaseType || (DatabaseType = {}));
// field condition will perform an operation when the field is specified
class FieldCondition {
    constructor(field, action) {
        this.field = field;
        this.action = action;
    }
    is(value) {
        if (this.action instanceof Get) {
            // check cache for operation, and force query to be local if found
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
        }
        // perform operation based on database type
        if (this.action.databaseType == DatabaseType.Datastore) {
            return this.datastoreRequest(value, "EQUAL");
        }
        if (this.action.databaseType == DatabaseType.Firestore) {
            return this.firestoreRequest(value, "EQUAL");
        }
        return this.wasmQuery(value, this.action.db.wasmIs);
    }
    // repeat for other field conditions
    isnt(value) {
        if (this.action.databaseType == DatabaseType.Datastore) {
            throw Error("Inequality is currently not supported by Datastore");
        }
        if (this.action.databaseType == DatabaseType.Firestore) {
            throw Error("Inequality is currently not supported by Firestore");
        }
        return this.wasmQuery(value, this.action.db.wasmIsnt);
    }
    greaterThan(value) {
        if (this.action instanceof Get) {
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
        }
        if (this.action.databaseType == DatabaseType.Datastore) {
            return this.datastoreRequest(value, "GREATER_THAN");
        }
        if (this.action.databaseType == DatabaseType.Firestore) {
            return this.firestoreRequest(value, "GREATER_THAN");
        }
        return this.wasmQuery(value, this.action.db.wasmGt);
    }
    lessThan(value) {
        if (this.action instanceof Get) {
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
        }
        if (this.action.databaseType == DatabaseType.Datastore) {
            return this.datastoreRequest(value, "LESS_THAN");
        }
        if (this.action.databaseType == DatabaseType.Firestore) {
            return this.firestoreRequest(value, "LESS_THAN");
        }
        return this.wasmQuery(value, this.action.db.wasmLt);
    }
    greaterThanOrEqualTo(value) {
        if (this.action instanceof Get) {
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
        }
        if (this.action.databaseType == DatabaseType.Datastore) {
            return this.datastoreRequest(value, "GREATER_THAN_OR_EQUAL");
        }
        if (this.action.databaseType == DatabaseType.Firestore) {
            return this.firestoreRequest(value, "GREATER_THAN_OR_EQUAL");
        }
        return this.wasmQuery(value, this.action.db.wasmGte);
    }
    lessThanOrEqualTo(value) {
        if (this.action instanceof Get) {
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
        }
        if (this.action.databaseType == DatabaseType.Datastore) {
            return this.datastoreRequest(value, "LESS_THAN_OR_EQUAL");
        }
        if (this.action.databaseType == DatabaseType.Firestore) {
            return this.firestoreRequest(value, "LESS_THAN_OR_EQUAL");
        }
        return this.wasmQuery(value, this.action.db.wasmLte);
    }
    isTrue() {
        if (this.action instanceof Get) {
            var cacheRep = {
                collection: this.action.collection,
                action: "Get",
                values: "",
                field: this.field,
                op: "isTrue",
                value: "true"
            };
            for (var cache of this.action.db.cache) {
                if (cache == cacheRep) {
                    this.action.databaseType = DatabaseType.Local;
                    break;
                }
            }
        }
        if (this.action.databaseType == DatabaseType.Datastore) {
            this.datastoreRequest("true", "EQUAL");
        }
        if (this.action.databaseType == DatabaseType.Firestore) {
            this.firestoreRequest("true", "EQUAL");
        }
        return this.action.where((obj) => { return obj[this.field]; });
    }
    isFalse() {
        if (this.action instanceof Get) {
            var cacheRep = {
                collection: this.action.collection,
                action: "Get",
                values: "",
                field: this.field,
                op: "isFalse",
                value: "false"
            };
            for (var cache of this.action.db.cache) {
                if (cache == cacheRep) {
                    this.action.databaseType = DatabaseType.Local;
                    break;
                }
            }
        }
        if (this.action.databaseType == DatabaseType.Datastore) {
            this.datastoreRequest("false", "EQUAL");
        }
        if (this.action.databaseType == DatabaseType.Firestore) {
            this.firestoreRequest("false", "EQUAL");
        }
        return this.action.where((obj) => { return obj[this.field]; });
    }
    has(value) {
        if (this.action.databaseType == DatabaseType.Datastore) {
            throw Error("Array membership is currently not supported by Datastore");
        }
        if (this.action.databaseType == DatabaseType.Firestore) {
            throw Error("Array membership is currently not supported by Firestore");
        }
        return this.wasmQuery(value, this.action.db.wasmHas);
    }
    length() {
        return new LengthFieldCondition(this);
    }
    datastoreRequest(value, comparator) {
        if (this.action instanceof Get) {
            // query based on filter
            return new Promise((resolve, reject) => {
                // request setup
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "https://datastore.googleapis.com/v1/projects/" + this.action.projectID + ":runQuery", true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Authorization', 'Bearer ' + this.action.db.token);
                // datastore filter body
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
                // wait for query
                xhr.onreadystatechange = function () {
                    // if query ok
                    if (xhr.readyState == 4) {
                        // parse the result
                        var res = JSON.parse(xhr.responseText);
                        var d = res.data;
                        // add entities to local storage
                        var entities = [];
                        for (var entRes of d.batch.entityResults) {
                            entities.push(entRes.entity);
                        }
                        action.db.makeCollection(action.collection);
                        var coll = action.db.collection(action.collection);
                        // update cache reference
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
            // query based on filters similar to Get
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
                            // second request to mutate entities
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
                                    // clear cache
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
                            // perform delete mutation
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
                                    // update cache
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
    // similar structure to datastore requests
    firestoreRequest(value, comparator) {
        if (this.action instanceof Get) {
            return new Promise((resolve, reject) => {
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "https://firestore.googleapis.com/v1beta1/projects" + this.action.projectID + "/databases/" + this.action.databaseID + ":runQuery", true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Authorization', 'Bearer ' + this.action.db.token);
                // firestore filter body
                const body = JSON.stringify({
                    structuredQuery: {
                        select: {
                            fields: []
                        },
                        where: {
                            fieldFilter: {
                                field: {
                                    fieldPath: this.field
                                },
                                op: comparator,
                                value: {
                                    stringValue: value
                                }
                            }
                        },
                    }
                });
                var field = this.field;
                var action = this.action;
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        var res = JSON.parse(xhr.responseText);
                        var d = res.data;
                        // update local storage and cache with retrieved documents
                        var documents = [d.document];
                        action.db.makeCollection(action.collection);
                        var coll = action.db.collection(action.collection);
                        coll.addLocal(documents)
                            .then(res => {
                            action.db.cache.push({
                                collection: action.collection,
                                action: "Get",
                                values: "",
                                field: field,
                                op: comparator,
                                value: value
                            });
                            resolve(documents);
                        });
                    }
                    else {
                        console.log("Firestore query failed.");
                    }
                };
                xhr.send(body);
            });
        }
        else if (this.action instanceof Set) {
            var set = this.action;
            return new Promise((resolve, reject) => {
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "https://firestore.googleapis.com/v1beta1/" + this.action.projectID + "/" + this.action.databaseID + ":runQuery", true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Authorization', 'Bearer ' + this.action.db.token);
                const body = JSON.stringify({
                    structuredQuery: {
                        select: {
                            fields: []
                        },
                        where: {
                            fieldFilter: {
                                field: {
                                    fieldPath: this.field
                                },
                                op: comparator,
                                value: {
                                    stringValue: value
                                }
                            }
                        },
                    }
                });
                var action = this.action;
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        var res = JSON.parse(xhr.responseText);
                        var d = res.data;
                        var document = d.document;
                        for (var field in document.fields) {
                            if (set.values.has(field)) {
                                for (var valueType in document.fields[field]) {
                                    document.fields[field][valueType] = set.values.get(field);
                                }
                            }
                        }
                        var xhr2 = new XMLHttpRequest();
                        xhr2.open("POST", "https://firestore.googleapis.com/v1beta1/projects/" + action.projectID + "/databases/" + action.databaseID + ":commit", true);
                        xhr2.setRequestHeader('Content-Type', 'application/json');
                        xhr2.setRequestHeader('Authorization', 'Bearer ' + action.db.token);
                        const body2 = JSON.stringify({
                            writes: [
                                {
                                    update: document
                                }
                            ]
                        });
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState == 4) {
                                action.db.cache = [];
                                action.db.deleteCollection(action.collection);
                                resolve(true);
                            }
                            else {
                                console.log("Firestore commit failed.");
                            }
                        };
                        xhr2.send(body2);
                    }
                    else {
                        console.log("Firestore query failed.");
                    }
                };
                xhr.send(body);
            });
        }
        else {
            return new Promise((resolve, reject) => {
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "https://firestore.googleapis.com/v1beta1/" + this.action.projectID + "/" + this.action.databaseID + ":runQuery", true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Authorization', 'Bearer ' + this.action.db.token);
                const body = JSON.stringify({
                    structuredQuery: {
                        select: {
                            fields: []
                        },
                        where: {
                            fieldFilter: {
                                field: {
                                    fieldPath: this.field
                                },
                                op: comparator,
                                value: {
                                    stringValue: value
                                }
                            }
                        },
                    }
                });
                var action = this.action;
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        var res = JSON.parse(xhr.responseText);
                        var d = res.data;
                        var document = d.document;
                        var xhr2 = new XMLHttpRequest();
                        xhr2.open("POST", "https://firestore.googleapis.com/v1beta1/projects/" + action.projectID + "/databases/" + action.databaseID + ":commit", true);
                        xhr2.setRequestHeader('Content-Type', 'application/json');
                        xhr2.setRequestHeader('Authorization', 'Bearer ' + action.db.token);
                        const body2 = JSON.stringify({
                            writes: [
                                {
                                    delete: document.name
                                }
                            ]
                        });
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState == 4) {
                                action.db.cache = [];
                                action.db.deleteCollection(action.collection);
                                resolve(true);
                            }
                            else {
                                console.log("Firestore commit failed.");
                            }
                        };
                        xhr2.send(body2);
                    }
                    else {
                        console.log("Firestore query failed.");
                    }
                };
                xhr.send(body);
            });
        }
    }
    wasmQuery(value, moduleFunction) {
        return new Promise((resolve, reject) => {
            // get collection from local storage
            chrome.storage.sync.get(this.action.collection, (res) => {
                if (res[this.action.collection] != undefined) {
                    // filter using wasm module
                    this.action.db.store = res[this.action.collection];
                    // references to filter key and value
                    var keyPtr = this.action.db.__pin(this.action.db.__newString(this.field));
                    var valPtr = this.action.db.__pin(this.action.db.__newString(JSON.stringify(value)));
                    // perform wasm function and get reference to return array
                    var aPtr = moduleFunction(res[this.action.collection].length, keyPtr, valPtr);
                    var a = this.action.db.__getArray(aPtr);
                    // free the references
                    this.action.db.__unpin(keyPtr);
                    this.action.db.__unpin(valPtr);
                    // return the objects if a Get
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
                        // else mutate
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
// evaluates a local query for the length of an array field
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
}
// class to handle queries on a collection
class Get {
    constructor(db, collection, databaseType, projectID, databaseID) {
        this.db = db;
        this.collection = collection;
        this.databaseType = databaseType;
        if (projectID) {
            this.projectID = projectID;
        }
        if (databaseID) {
            this.databaseID = databaseID;
        }
    }
    where(conditionOrField) {
        // for a field generate a new field condition
        if (typeof conditionOrField === "string") {
            return new FieldCondition(conditionOrField, this);
        }
        // else perform the query using the javascript function
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
    // return full collection
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
// similar to Get, for mutation
class Set {
    constructor(db, collection, values, databaseType, projectID, databaseID) {
        this.db = db;
        this.collection = collection;
        this.values = values;
        this.databaseType = databaseType;
        if (projectID) {
            this.projectID = projectID;
        }
        if (databaseID) {
            this.databaseID = databaseID;
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
// similar to Get, for deletion
class Delete {
    constructor(db, collection, databaseType, projectID, databaseID) {
        this.db = db;
        this.collection = collection;
        this.databaseType = databaseType;
        if (projectID) {
            this.projectID = projectID;
        }
        if (databaseID) {
            this.databaseID = databaseID;
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
// class through which queries or mutations can be made
class Collection {
    constructor(db, name) {
        this.db = db;
        this.name = name;
    }
    get() {
        if (this.db.databaseType == DatabaseType.Local) {
            return new Get(this.db, this.name, this.db.databaseType);
        }
        else if (this.db.databaseType == DatabaseType.Datastore) {
            return new Get(this.db, this.name, this.db.databaseType, this.db.projectID);
        }
        else {
            return new Get(this.db, this.name, this.db.databaseType, this.db.projectID, this.db.databaseID);
        }
    }
    set(values) {
        if (this.db.databaseType == DatabaseType.Local) {
            return new Set(this.db, this.name, values, this.db.databaseType);
        }
        else if (this.db.databaseType == DatabaseType.Datastore) {
            return new Set(this.db, this.name, values, this.db.databaseType, this.db.projectID);
        }
        else {
            return new Set(this.db, this.name, values, this.db.databaseType, this.db.projectID, this.db.databaseID);
        }
    }
    delete() {
        if (this.db.databaseType == DatabaseType.Local) {
            return new Delete(this.db, this.name, this.db.databaseType);
        }
        else if (this.db.databaseType == DatabaseType.Datastore) {
            return new Delete(this.db, this.name, this.db.databaseType, this.db.projectID);
        }
        else {
            return new Delete(this.db, this.name, this.db.databaseType, this.db.projectID, this.db.databaseID);
        }
    }
    add(object) {
        if (this.db.databaseType == DatabaseType.Local) {
            return this.addLocal(object);
        }
        else if (this.db.databaseType == DatabaseType.Datastore) {
            this.datastoreInsert([object]);
        }
    }
    // force insertion to be local only
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
    // add multiple objects
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
            // insertion mutation body
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
            // get list of available collections for the specified database, else initialize as empty database
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
    useFirestore(projectID, databaseID, accessToken) {
        this.databaseType = DatabaseType.Firestore;
        this.projectID = projectID;
        this.databaseID = databaseID;
        this.token = accessToken;
    }
    initWASM() {
        // specify wasm imports
        const imports = {
            query: {
                log: (msgPtr) => {
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
            // memory specs
            env: {
                memory: new WebAssembly.Memory({ initial: 1024 }),
                table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' })
            }
        };
        // fetch wasm file and obtain all available module functions
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
    // return a collection if it exists
    collection(name) {
        if (this.config.collections[this.database].includes(name)) {
            return new Collection(this, name);
        }
        throw Error(`Collection ${name} doesn't belong to database ${this.database}`);
    }
    // add a new collection to the config
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
    // delete a collection from the config
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

/***/ }),

/***/ "./js/ts/main.js":
/*!***********************!*\
  !*** ./js/ts/main.js ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const chromedb_1 = __webpack_require__(/*! ./chromedb */ "./js/ts/chromedb.js");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    let client = yield chromedb_1.ChromeDB.init("MyDB");
    yield client.makeCollection("MyCollection");
    yield client.collection("MyCollection").add({ "id": 0, "content": "hello" });
    var obj = yield client.collection("MyCollection").get().where("id").is(0);
    console.log(obj);
});
main();
//# sourceMappingURL=main.js.map

/***/ }),

/***/ "./node_modules/assemblyscript/lib/loader/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/assemblyscript/lib/loader/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "instantiate": () => (/* binding */ instantiate),
/* harmony export */   "instantiateSync": () => (/* binding */ instantiateSync),
/* harmony export */   "instantiateStreaming": () => (/* binding */ instantiateStreaming),
/* harmony export */   "demangle": () => (/* binding */ demangle),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Runtime header offsets
const ID_OFFSET = -8;
const SIZE_OFFSET = -4;

// Runtime ids
const ARRAYBUFFER_ID = 0;
const STRING_ID = 1;
// const ARRAYBUFFERVIEW_ID = 2;

// Runtime type information
const ARRAYBUFFERVIEW = 1 << 0;
const ARRAY = 1 << 1;
const STATICARRAY = 1 << 2;
// const SET = 1 << 3;
// const MAP = 1 << 4;
const VAL_ALIGN_OFFSET = 6;
// const VAL_ALIGN = 1 << VAL_ALIGN_OFFSET;
const VAL_SIGNED = 1 << 11;
const VAL_FLOAT = 1 << 12;
// const VAL_NULLABLE = 1 << 13;
const VAL_MANAGED = 1 << 14;
// const KEY_ALIGN_OFFSET = 15;
// const KEY_ALIGN = 1 << KEY_ALIGN_OFFSET;
// const KEY_SIGNED = 1 << 20;
// const KEY_FLOAT = 1 << 21;
// const KEY_NULLABLE = 1 << 22;
// const KEY_MANAGED = 1 << 23;

// Array(BufferView) layout
const ARRAYBUFFERVIEW_BUFFER_OFFSET = 0;
const ARRAYBUFFERVIEW_DATASTART_OFFSET = 4;
const ARRAYBUFFERVIEW_DATALENGTH_OFFSET = 8;
const ARRAYBUFFERVIEW_SIZE = 12;
const ARRAY_LENGTH_OFFSET = 12;
const ARRAY_SIZE = 16;

const BIGINT = typeof BigUint64Array !== "undefined";
const THIS = Symbol();

const STRING_DECODE_THRESHOLD = 32;
const decoder = new TextDecoder("utf-16le");

/** Gets a string from an U32 and an U16 view on a memory. */
function getStringImpl(buffer, ptr) {
  const len = new Uint32Array(buffer)[ptr + SIZE_OFFSET >>> 2] >>> 1;
  const arr = new Uint16Array(buffer, ptr, len);
  if (len <= STRING_DECODE_THRESHOLD) {
    return String.fromCharCode.apply(String, arr);
  }
  return decoder.decode(arr);
}

/** Prepares the base module prior to instantiation. */
function preInstantiate(imports) {
  const extendedExports = {};

  function getString(memory, ptr) {
    if (!memory) return "<yet unknown>";
    return getStringImpl(memory.buffer, ptr);
  }

  // add common imports used by stdlib for convenience
  const env = (imports.env = imports.env || {});
  env.abort = env.abort || function abort(msg, file, line, colm) {
    const memory = extendedExports.memory || env.memory; // prefer exported, otherwise try imported
    throw Error(`abort: ${getString(memory, msg)} at ${getString(memory, file)}:${line}:${colm}`);
  };
  env.trace = env.trace || function trace(msg, n, ...args) {
    const memory = extendedExports.memory || env.memory;
    console.log(`trace: ${getString(memory, msg)}${n ? " " : ""}${args.slice(0, n).join(", ")}`);
  };
  env.seed = env.seed || Date.now;
  imports.Math = imports.Math || Math;
  imports.Date = imports.Date || Date;

  return extendedExports;
}

const E_NOEXPORTRUNTIME = "Operation requires compiling with --exportRuntime";
const F_NOEXPORTRUNTIME = function() { throw Error(E_NOEXPORTRUNTIME); };

/** Prepares the final module once instantiation is complete. */
function postInstantiate(extendedExports, instance) {
  const exports = instance.exports;
  const memory = exports.memory;
  const table = exports.table;
  const __new = exports.__new || F_NOEXPORTRUNTIME;
  const __pin = exports.__pin || F_NOEXPORTRUNTIME;
  const __unpin = exports.__unpin || F_NOEXPORTRUNTIME;
  const __collect = exports.__collect || F_NOEXPORTRUNTIME;
  const __rtti_base = exports.__rtti_base || ~0; // oob if not present

  extendedExports.__new = __new;
  extendedExports.__pin = __pin;
  extendedExports.__unpin = __unpin;
  extendedExports.__collect = __collect;

  /** Gets the runtime type info for the given id. */
  function getInfo(id) {
    const U32 = new Uint32Array(memory.buffer);
    const count = U32[__rtti_base >>> 2];
    if ((id >>>= 0) >= count) throw Error(`invalid id: ${id}`);
    return U32[(__rtti_base + 4 >>> 2) + id * 2];
  }

  /** Gets and validate runtime type info for the given id for array like objects */
  function getArrayInfo(id) {
    const info = getInfo(id);
    if (!(info & (ARRAYBUFFERVIEW | ARRAY | STATICARRAY))) throw Error(`not an array: ${id}, flags=${info}`);
    return info;
  }

  /** Gets the runtime base id for the given id. */
  function getBase(id) {
    const U32 = new Uint32Array(memory.buffer);
    const count = U32[__rtti_base >>> 2];
    if ((id >>>= 0) >= count) throw Error(`invalid id: ${id}`);
    return U32[(__rtti_base + 4 >>> 2) + id * 2 + 1];
  }

  /** Gets the runtime alignment of a collection's values. */
  function getValueAlign(info) {
    return 31 - Math.clz32((info >>> VAL_ALIGN_OFFSET) & 31); // -1 if none
  }

  /** Gets the runtime alignment of a collection's keys. */
  // function getKeyAlign(info) {
  //   return 31 - Math.clz32((info >>> KEY_ALIGN_OFFSET) & 31); // -1 if none
  // }

  /** Allocates a new string in the module's memory and returns its pointer. */
  function __newString(str) {
    if (str == null) return 0;
    const length = str.length;
    const ptr = __new(length << 1, STRING_ID);
    const U16 = new Uint16Array(memory.buffer);
    for (var i = 0, p = ptr >>> 1; i < length; ++i) U16[p + i] = str.charCodeAt(i);
    return ptr;
  }

  extendedExports.__newString = __newString;

  /** Reads a string from the module's memory by its pointer. */
  function __getString(ptr) {
    if (!ptr) return null;
    const buffer = memory.buffer;
    const id = new Uint32Array(buffer)[ptr + ID_OFFSET >>> 2];
    if (id !== STRING_ID) throw Error(`not a string: ${ptr}`);
    return getStringImpl(buffer, ptr);
  }

  extendedExports.__getString = __getString;

  /** Gets the view matching the specified alignment, signedness and floatness. */
  function getView(alignLog2, signed, float) {
    const buffer = memory.buffer;
    if (float) {
      switch (alignLog2) {
        case 2: return new Float32Array(buffer);
        case 3: return new Float64Array(buffer);
      }
    } else {
      switch (alignLog2) {
        case 0: return new (signed ? Int8Array : Uint8Array)(buffer);
        case 1: return new (signed ? Int16Array : Uint16Array)(buffer);
        case 2: return new (signed ? Int32Array : Uint32Array)(buffer);
        case 3: return new (signed ? BigInt64Array : BigUint64Array)(buffer);
      }
    }
    throw Error(`unsupported align: ${alignLog2}`);
  }

  /** Allocates a new array in the module's memory and returns its pointer. */
  function __newArray(id, values) {
    const info = getArrayInfo(id);
    const align = getValueAlign(info);
    const length = values.length;
    const buf = __new(length << align, info & STATICARRAY ? id : ARRAYBUFFER_ID);
    let result;
    if (info & STATICARRAY) {
      result = buf;
    } else {
      __pin(buf);
      const arr = __new(info & ARRAY ? ARRAY_SIZE : ARRAYBUFFERVIEW_SIZE, id);
      __unpin(buf);
      const U32 = new Uint32Array(memory.buffer);
      U32[arr + ARRAYBUFFERVIEW_BUFFER_OFFSET >>> 2] = buf;
      U32[arr + ARRAYBUFFERVIEW_DATASTART_OFFSET >>> 2] = buf;
      U32[arr + ARRAYBUFFERVIEW_DATALENGTH_OFFSET >>> 2] = length << align;
      if (info & ARRAY) U32[arr + ARRAY_LENGTH_OFFSET >>> 2] = length;
      result = arr;
    }
    const view = getView(align, info & VAL_SIGNED, info & VAL_FLOAT);
    if (info & VAL_MANAGED) {
      for (let i = 0; i < length; ++i) {
        const value = values[i];
        view[(buf >>> align) + i] = value;
      }
    } else {
      view.set(values, buf >>> align);
    }
    return result;
  }

  extendedExports.__newArray = __newArray;

  /** Gets a live view on an array's values in the module's memory. Infers the array type from RTTI. */
  function __getArrayView(arr) {
    const U32 = new Uint32Array(memory.buffer);
    const id = U32[arr + ID_OFFSET >>> 2];
    const info = getArrayInfo(id);
    const align = getValueAlign(info);
    let buf = info & STATICARRAY
      ? arr
      : U32[arr + ARRAYBUFFERVIEW_DATASTART_OFFSET >>> 2];
    const length = info & ARRAY
      ? U32[arr + ARRAY_LENGTH_OFFSET >>> 2]
      : U32[buf + SIZE_OFFSET >>> 2] >>> align;
    return getView(align, info & VAL_SIGNED, info & VAL_FLOAT).subarray(buf >>>= align, buf + length);
  }

  extendedExports.__getArrayView = __getArrayView;

  /** Copies an array's values from the module's memory. Infers the array type from RTTI. */
  function __getArray(arr) {
    const input = __getArrayView(arr);
    const len = input.length;
    const out = new Array(len);
    for (let i = 0; i < len; i++) out[i] = input[i];
    return out;
  }

  extendedExports.__getArray = __getArray;

  /** Copies an ArrayBuffer's value from the module's memory. */
  function __getArrayBuffer(ptr) {
    const buffer = memory.buffer;
    const length = new Uint32Array(buffer)[ptr + SIZE_OFFSET >>> 2];
    return buffer.slice(ptr, ptr + length);
  }

  extendedExports.__getArrayBuffer = __getArrayBuffer;

  /** Copies a typed array's values from the module's memory. */
  function getTypedArray(Type, alignLog2, ptr) {
    return new Type(getTypedArrayView(Type, alignLog2, ptr));
  }

  /** Gets a live view on a typed array's values in the module's memory. */
  function getTypedArrayView(Type, alignLog2, ptr) {
    const buffer = memory.buffer;
    const U32 = new Uint32Array(buffer);
    const bufPtr = U32[ptr + ARRAYBUFFERVIEW_DATASTART_OFFSET >>> 2];
    return new Type(buffer, bufPtr, U32[bufPtr + SIZE_OFFSET >>> 2] >>> alignLog2);
  }

  /** Attach a set of get TypedArray and View functions to the exports. */
  function attachTypedArrayFunctions(ctor, name, align) {
    extendedExports[`__get${name}`] = getTypedArray.bind(null, ctor, align);
    extendedExports[`__get${name}View`] = getTypedArrayView.bind(null, ctor, align);
  }

  [
    Int8Array,
    Uint8Array,
    Uint8ClampedArray,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array
  ].forEach(ctor => {
    attachTypedArrayFunctions(ctor, ctor.name, 31 - Math.clz32(ctor.BYTES_PER_ELEMENT));
  });

  if (BIGINT) {
    [BigUint64Array, BigInt64Array].forEach(ctor => {
      attachTypedArrayFunctions(ctor, ctor.name.slice(3), 3);
    });
  }

  /** Tests whether an object is an instance of the class represented by the specified base id. */
  function __instanceof(ptr, baseId) {
    const U32 = new Uint32Array(memory.buffer);
    let id = U32[ptr + ID_OFFSET >>> 2];
    if (id <= U32[__rtti_base >>> 2]) {
      do {
        if (id == baseId) return true;
        id = getBase(id);
      } while (id);
    }
    return false;
  }

  extendedExports.__instanceof = __instanceof;

  // Pull basic exports to extendedExports so code in preInstantiate can use them
  extendedExports.memory = extendedExports.memory || memory;
  extendedExports.table  = extendedExports.table  || table;

  // Demangle exports and provide the usual utility on the prototype
  return demangle(exports, extendedExports);
}

function isResponse(src) {
  return typeof Response !== "undefined" && src instanceof Response;
}

function isModule(src) {
  return src instanceof WebAssembly.Module;
}

/** Asynchronously instantiates an AssemblyScript module from anything that can be instantiated. */
async function instantiate(source, imports = {}) {
  if (isResponse(source = await source)) return instantiateStreaming(source, imports);
  const module = isModule(source) ? source : await WebAssembly.compile(source);
  const extended = preInstantiate(imports);
  const instance = await WebAssembly.instantiate(module, imports);
  const exports = postInstantiate(extended, instance);
  return { module, instance, exports };
}

/** Synchronously instantiates an AssemblyScript module from a WebAssembly.Module or binary buffer. */
function instantiateSync(source, imports = {}) {
  const module = isModule(source) ? source : new WebAssembly.Module(source);
  const extended = preInstantiate(imports);
  const instance = new WebAssembly.Instance(module, imports);
  const exports = postInstantiate(extended, instance);
  return { module, instance, exports };
}

/** Asynchronously instantiates an AssemblyScript module from a response, i.e. as obtained by `fetch`. */
async function instantiateStreaming(source, imports = {}) {
  if (!WebAssembly.instantiateStreaming) {
    return instantiate(
      isResponse(source = await source)
        ? source.arrayBuffer()
        : source,
      imports
    );
  }
  const extended = preInstantiate(imports);
  const result = await WebAssembly.instantiateStreaming(source, imports);
  const exports = postInstantiate(extended, result.instance);
  return { ...result, exports };
}

/** Demangles an AssemblyScript module's exports to a friendly object structure. */
function demangle(exports, extendedExports = {}) {
  const setArgumentsLength = exports["__argumentsLength"]
    ? length => { exports["__argumentsLength"].value = length; }
    : exports["__setArgumentsLength"] || exports["__setargc"] || (() => { /* nop */ });
  for (let internalName in exports) {
    if (!Object.prototype.hasOwnProperty.call(exports, internalName)) continue;
    const elem = exports[internalName];
    let parts = internalName.split(".");
    let curr = extendedExports;
    while (parts.length > 1) {
      let part = parts.shift();
      if (!Object.prototype.hasOwnProperty.call(curr, part)) curr[part] = {};
      curr = curr[part];
    }
    let name = parts[0];
    let hash = name.indexOf("#");
    if (hash >= 0) {
      const className = name.substring(0, hash);
      const classElem = curr[className];
      if (typeof classElem === "undefined" || !classElem.prototype) {
        const ctor = function(...args) {
          return ctor.wrap(ctor.prototype.constructor(0, ...args));
        };
        ctor.prototype = {
          valueOf() { return this[THIS]; }
        };
        ctor.wrap = function(thisValue) {
          return Object.create(ctor.prototype, { [THIS]: { value: thisValue, writable: false } });
        };
        if (classElem) Object.getOwnPropertyNames(classElem).forEach(name =>
          Object.defineProperty(ctor, name, Object.getOwnPropertyDescriptor(classElem, name))
        );
        curr[className] = ctor;
      }
      name = name.substring(hash + 1);
      curr = curr[className].prototype;
      if (/^(get|set):/.test(name)) {
        if (!Object.prototype.hasOwnProperty.call(curr, name = name.substring(4))) {
          let getter = exports[internalName.replace("set:", "get:")];
          let setter = exports[internalName.replace("get:", "set:")];
          Object.defineProperty(curr, name, {
            get() { return getter(this[THIS]); },
            set(value) { setter(this[THIS], value); },
            enumerable: true
          });
        }
      } else {
        if (name === 'constructor') {
          (curr[name] = (...args) => {
            setArgumentsLength(args.length);
            return elem(...args);
          }).original = elem;
        } else { // instance method
          (curr[name] = function(...args) { // !
            setArgumentsLength(args.length);
            return elem(this[THIS], ...args);
          }).original = elem;
        }
      }
    } else {
      if (/^(get|set):/.test(name)) {
        if (!Object.prototype.hasOwnProperty.call(curr, name = name.substring(4))) {
          Object.defineProperty(curr, name, {
            get: exports[internalName.replace("set:", "get:")],
            set: exports[internalName.replace("get:", "set:")],
            enumerable: true
          });
        }
      } else if (typeof elem === "function" && elem !== setArgumentsLength) {
        (curr[name] = (...args) => {
          setArgumentsLength(args.length);
          return elem(...args);
        }).original = elem;
      } else {
        curr[name] = elem;
      }
    }
  }
  return extendedExports;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  instantiate,
  instantiateSync,
  instantiateStreaming,
  demangle
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./js/ts/main.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=main.js.map