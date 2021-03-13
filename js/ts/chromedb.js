"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChromeDB = void 0;
const loader = require("../../node_modules/assemblyscript/lib/loader/index");
var wasmIs, wasmIsnt, wasmGt, wasmLt, wasmGte, wasmLte, wasmHas;
var __getString;
var __newString;
var __getArray;
var __newArray;
var MapArray_id;
const imports = {
    query: {
        log: (msgPtr) => {
            // at the time of call, wasmExample will be initialized
            console.log('WASM is talking', __getString(msgPtr));
        }
    },
    env: {
        memory: new WebAssembly.Memory({ initial: 256 }),
        table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' })
    }
};
loader.instantiate(fetch("query.wasm"), imports)
    .then((module) => {
    wasmIs = module.exports.is;
    wasmIsnt = module.exports.isnt;
    wasmGt = module.exports.greaterThan;
    wasmLt = module.exports.lessThan;
    wasmGte = module.exports.greaterThanOrEqualTo;
    wasmLte = module.exports.lessThanOrEqualTo;
    wasmHas = module.exports.has;
    __getString = module.exports.__getString;
    __newString = module.exports.__newString;
    __getArray = module.exports.__getArray;
    __newArray = module.exports.__newArray;
    MapArray_id = module.exports.MapArray_id;
});
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
                        console.log(res[this.action.document], this.field, JSON.stringify(value));
                        var arrPtr = wasmIs(__newArray(MapArray_id, res[this.action.document]), __newString(this.field), __newString(JSON.stringify(value)));
                        var arr = __getArray(arrPtr);
                        resolve(arr);
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
    isnt(value) {
        if (this.action instanceof Get) {
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get(this.action.document, (res) => {
                    if (res[this.action.document] != undefined) {
                        resolve(__getArray(wasmIsnt(__newArray(MapArray_id, res[this.action.document]), __newString(this.field), __newString(JSON.stringify(value)))));
                    }
                    else {
                        reject(`Error finding document ${this.action.document}`);
                    }
                });
            });
        }
        else {
            return this.action.where((obj) => { return obj[this.field] != value; });
        }
    }
    greaterThan(value) {
        if (this.action instanceof Get) {
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get(this.action.document, (res) => {
                    if (res[this.action.document] != undefined) {
                        resolve(__getArray(wasmGt(__newArray(MapArray_id, res[this.action.document]), __newString(this.field), __newString(JSON.stringify(value)))));
                    }
                    else {
                        reject(`Error finding document ${this.action.document}`);
                    }
                });
            });
        }
        else {
            return this.action.where((obj) => { return obj[this.field] > value; });
        }
    }
    lessThan(value) {
        if (this.action instanceof Get) {
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get(this.action.document, (res) => {
                    if (res[this.action.document] != undefined) {
                        resolve(__getArray(wasmLt(__newArray(MapArray_id, res[this.action.document]), __newString(this.field), __newString(JSON.stringify(value)))));
                    }
                    else {
                        reject(`Error finding document ${this.action.document}`);
                    }
                });
            });
        }
        else {
            return this.action.where((obj) => { return obj[this.field] < value; });
        }
    }
    greaterThanOrEqualTo(value) {
        if (this.action instanceof Get) {
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get(this.action.document, (res) => {
                    if (res[this.action.document] != undefined) {
                        resolve(__getArray(wasmGte(__newArray(MapArray_id, res[this.action.document]), __newString(this.field), __newString(JSON.stringify(value)))));
                    }
                    else {
                        reject(`Error finding document ${this.action.document}`);
                    }
                });
            });
        }
        else {
            return this.action.where((obj) => { return obj[this.field] >= value; });
        }
    }
    lessThanOrEqualTo(value) {
        if (this.action instanceof Get) {
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get(this.action.document, (res) => {
                    if (res[this.action.document] != undefined) {
                        resolve(__getArray(wasmLte(__newArray(MapArray_id, res[this.action.document]), __newString(this.field), __newString(JSON.stringify(value)))));
                    }
                    else {
                        reject(`Error finding document ${this.action.document}`);
                    }
                });
            });
        }
        else {
            return this.action.where((obj) => { return obj[this.field] <= value; });
        }
    }
    isTrue() {
        return this.action.where((obj) => { return obj[this.field]; });
    }
    isFalse() {
        return this.action.where((obj) => { return obj[this.field]; });
    }
    has(value) {
        if (this.action instanceof Get) {
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get(this.action.document, (res) => {
                    if (res[this.action.document] != undefined) {
                        resolve(__getArray(wasmHas(__newArray(MapArray_id, res[this.action.document]), __newString(this.field), __newString(JSON.stringify(value)))));
                    }
                    else {
                        reject(`Error finding document ${this.action.document}`);
                    }
                });
            });
        }
        else {
            return this.action.where((obj) => { return obj[this.field].includes(value); });
        }
    }
    length() {
        return new LengthFieldCondition(this);
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
    constructor(document) { this.document = document; }
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
    constructor(document, values) {
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
    constructor(name) {
        this.name = name;
    }
    get() {
        return new Get(this.name);
    }
    set(values) {
        return new Set(this.name, values);
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
    doc(name) {
        if (this.config.documents[this.database].includes(name)) {
            return new Document(name);
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