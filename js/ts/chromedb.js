"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Config {
}
//TODO: WASM all
class FieldCondition {
    constructor(field, action) {
        this.field = field;
        this.action = action;
    }
    is(value) {
        return this.action.where((obj) => { return obj[this.field] == value; });
    }
    isnt(value) {
        return this.action.where((obj) => { return obj[this.field] != value; });
    }
    greaterThan(value) {
        return this.action.where((obj) => { return obj[this.field] > value; });
    }
    lesserThan(value) {
        return this.action.where((obj) => { return obj[this.field] < value; });
    }
    greaterThanOrEqualTo(value) {
        return this.action.where((obj) => { return obj[this.field] >= value; });
    }
    lesserThanOrEqualTo(value) {
        return this.action.where((obj) => { return obj[this.field] <= value; });
    }
    isTrue() {
        return this.action.where((obj) => { return obj[this.field]; });
    }
    isFalse() {
        return this.action.where((obj) => { return obj[this.field]; });
    }
    has(value) {
        return this.action.where((obj) => { return obj[this.field].includes(value); });
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
        return this.action.where((obj) => { return obj[this.field].length == value; });
    }
    isnt(value) {
        return this.action.where((obj) => { return obj[this.field].length != value; });
    }
    greaterThan(value) {
        return this.action.where((obj) => { return obj[this.field].length > value; });
    }
    lesserThan(value) {
        return this.action.where((obj) => { return obj[this.field].length < value; });
    }
    greaterThanOrEqualTo(value) {
        return this.action.where((obj) => { return obj[this.field].length >= value; });
    }
    lesserThanOrEqualTo(value) {
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
                console.log("created config");
                if (res.chromedb_config != undefined) {
                    db.config.documents = res.chromedb_config;
                    if (!(database in db.config.documents)) {
                        db.config.documents[database] = [];
                    }
                }
                else {
                    console.log("setting empty");
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
                console.log(`Added document: ${this.config.documents[this.database]}`);
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