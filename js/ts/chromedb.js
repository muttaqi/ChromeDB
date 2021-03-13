"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChromeDB = void 0;
const loader = require("../../node_modules/assemblyscript/lib/loader/index");
class Config {
    constructor() {
        this.documents = new Map();
    }
}
//TODO: WASM all
class FieldCondition {
    constructor(field, action) {
        this.field = field;
        this.action = action;
    }
    is(value) {
        if (this.action instanceof Get) {
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get(this.action.document, (res) => {
                    if (res[this.action.document] != undefined) {
                        this.action.db.store = res[this.action.document];
                        var keyPtr = this.action.db.__pin(this.action.db.__newString(this.field));
                        var valPtr = this.action.db.__pin(this.action.db.__newString(JSON.stringify(value)));
                        var aPtr = this.action.db.wasmIs(res[this.action.document].length, keyPtr, valPtr);
                        var a = this.action.db.__getArray(aPtr);
                        this.action.db.__unpin(keyPtr);
                        this.action.db.__unpin(valPtr);
                        var out = [];
                        for (var i of a) {
                            out.push(res[this.action.document][i]);
                        }
                        resolve(out);
                    }
                    else {
                        reject(`Error finding document ${this.action.document}`);
                    }
                });
            });
        }
        else {
            return this.action.where((obj) => { return obj[this.field] === value; });
        }
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
    constructor(db, document) {
        this.db = db;
        this.document = document;
    }
    where(conditionOrField) {
        if (typeof conditionOrField === "string") {
            return new FieldCondition(conditionOrField, this);
        }
        else {
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get(this.document, (res) => {
                    if (res[this.document] != undefined) {
                        var out = [];
                        for (var object of res[this.document]) {
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
                        reject(`Error finding document ${this.document}`);
                    }
                });
            });
        }
    }
    all() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(this.document, (res) => {
                if (res[this.document] != undefined) {
                    for (var i = 0; i < res[this.document].length; i++) {
                        var object = res[this.document][i];
                        for (var key in object) {
                            object[key] = JSON.parse(object[key]);
                        }
                        res[this.document][i] = object;
                    }
                    resolve(res[this.document]);
                }
                else {
                    reject(`Error finding document ${this.document}`);
                }
            });
        });
    }
}
class Set {
    constructor(db, document, values) {
        this.db = db;
        this.document = document;
        this.values = values;
    }
    where(conditionOrField) {
        if (typeof conditionOrField === "string") {
            return new FieldCondition(conditionOrField, this);
        }
        else {
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get(this.document, (res) => {
                    if (res[this.document] != undefined) {
                        for (var i = 0; i < res[this.document].length; i++) {
                            var object = res[this.document][i];
                            for (var key in object) {
                                object[key] = JSON.parse(object[key]);
                            }
                            if (conditionOrField(object)) {
                                this.values.forEach((val, key) => {
                                    res[this.document][i][key] = JSON.stringify(val);
                                });
                            }
                        }
                        chrome.storage.sync.set({ [this.document]: res }, () => {
                            resolve(true);
                        });
                    }
                    else {
                        reject(`Error finding document ${this.document}`);
                    }
                });
            });
        }
    }
    //TODO: WASM
    all() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(this.document, (res) => {
                if (res[this.document] != undefined) {
                    for (var i = 0; i < res[this.document].length; i++) {
                        this.values.forEach((val, key) => {
                            res[this.document][i][key] = JSON.stringify(val);
                        });
                    }
                    chrome.storage.sync.set({ [this.document]: res }, () => {
                        resolve(true);
                    });
                }
                else {
                    reject(`Error finding document ${this.document}`);
                }
            });
        });
    }
}
class Document {
    constructor(db, name) {
        this.db = db;
        this.name = name;
    }
    get() {
        return new Get(this.db, this.name);
    }
    set(values) {
        return new Set(this.db, this.name, values);
    }
    add(object) {
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
                    reject(`Error finding document ${this.name}`);
                }
            });
        });
    }
    addAll(objects) {
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
                    reject(`Error finding document ${this.name}`);
                }
            });
        });
    }
}
class ChromeDB {
    static init(database) {
        var db = new ChromeDB();
        db.database = database;
        db.initWASM();
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get('chromedb_config', (res) => {
                db.config = new Config();
                if (res.chromedb_config != undefined) {
                    db.config.documents = res.chromedb_config;
                    if (!(database in db.config.documents)) {
                        db.config.documents[database] = [];
                    }
                }
                else {
                    db.config.documents[database] = [];
                }
                resolve(db);
            });
        });
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
    doc(name) {
        if (this.config.documents[this.database].includes(name)) {
            return new Document(this, name);
        }
        throw Error(`Document ${name} doesn't belong to database ${this.database}`);
    }
    makeDoc(name) {
        if (this.config.documents[this.database].includes(name)) {
            return new Promise((resolve, reject) => {
                resolve(false);
            });
        }
        return new Promise((resolve, reject) => {
            chrome.storage.sync.set({ [name]: [] }, () => {
                this.config.documents[this.database].push(name);
                resolve(true);
            });
        });
    }
    deleteDoc(name) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.remove(name, () => {
                this.config.documents[this.database].splice(this.config.documents[this.database].indexOf(name), 1);
                resolve(true);
            });
        });
    }
}
exports.ChromeDB = ChromeDB;
//# sourceMappingURL=chromedb.js.map