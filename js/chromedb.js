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
    static promiseFromPromiseOrFieldCondition(value) {
        if (value instanceof FieldCondition) {
            throw Error(`Promise should never be created from a field condition!`);
        }
        else {
            return value;
        }
    }
    is(value) {
        return FieldCondition.promiseFromPromiseOrFieldCondition(this.action.where((obj) => { return obj[this.field] == value; }));
    }
    isnt(value) {
        return FieldCondition.promiseFromPromiseOrFieldCondition(this.action.where((obj) => { return obj[this.field] != value; }));
    }
    greaterThan(value) {
        return FieldCondition.promiseFromPromiseOrFieldCondition(this.action.where((obj) => { return obj[this.field] > value; }));
    }
    lesserThan(value) {
        return FieldCondition.promiseFromPromiseOrFieldCondition(this.action.where((obj) => { return obj[this.field] < value; }));
    }
    greaterThanOrEqualTo(value) {
        return FieldCondition.promiseFromPromiseOrFieldCondition(this.action.where((obj) => { return obj[this.field] >= value; }));
    }
    lesserThanOrEqualTo(value) {
        return FieldCondition.promiseFromPromiseOrFieldCondition(this.action.where((obj) => { return obj[this.field] <= value; }));
    }
    isTrue() {
        return FieldCondition.promiseFromPromiseOrFieldCondition(this.action.where((obj) => { return obj[this.field]; }));
    }
    isFalse() {
        return FieldCondition.promiseFromPromiseOrFieldCondition(this.action.where((obj) => { return obj[this.field]; }));
    }
    has(value) {
        return FieldCondition.promiseFromPromiseOrFieldCondition(this.action.where((obj) => { return obj[this.field].includes(value); }));
    }
    length() {
        return new LengthFieldCondition(this);
    }
}
class LengthFieldCondition extends FieldCondition {
    constructor(fc) {
        super(fc.field, fc.action);
    }
    static promiseFromPromiseOrFieldCondition(value) {
        if (value instanceof FieldCondition) {
            throw Error(`Promise should never be created from a field condition!`);
        }
        else {
            return value;
        }
    }
    is(value) {
        return FieldCondition.promiseFromPromiseOrFieldCondition(this.action.where((obj) => { return obj[this.field].length == value; }));
    }
    isnt(value) {
        return FieldCondition.promiseFromPromiseOrFieldCondition(this.action.where((obj) => { return obj[this.field].length != value; }));
    }
    greaterThan(value) {
        return FieldCondition.promiseFromPromiseOrFieldCondition(this.action.where((obj) => { return obj[this.field].length > value; }));
    }
    lesserThan(value) {
        return FieldCondition.promiseFromPromiseOrFieldCondition(this.action.where((obj) => { return obj[this.field].length < value; }));
    }
    greaterThanOrEqualTo(value) {
        return FieldCondition.promiseFromPromiseOrFieldCondition(this.action.where((obj) => { return obj[this.field].length >= value; }));
    }
    lesserThanOrEqualTo(value) {
        return FieldCondition.promiseFromPromiseOrFieldCondition(this.action.where((obj) => { return obj[this.field].length <= value; }));
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
            throw new Error("Method not implemented.");
        }
        else {
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get(document, (res) => {
                    if (res.document != undefined) {
                        var out = [];
                        for (var obj in res.document) {
                            if (conditionOrField(obj)) {
                                out.push(obj);
                            }
                        }
                        resolve(out);
                    }
                    reject(`Error finding document ${document}`);
                });
            });
        }
    }
    all() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(document, (res) => {
                if (res.document != undefined) {
                    resolve(res.document);
                }
                reject(`Error finding document ${document}`);
            });
        });
    }
}
class Set {
    constructor(document) { this.document = document; }
    where(conditionOrField) {
        if (typeof conditionOrField === "string") {
            throw new Error("Method not implemented.");
        }
        else {
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get(document, (res) => {
                    if (res.document != undefined) {
                        for (var i = 0; i < res.document.length; i++) {
                            if (conditionOrField(res.document[i])) {
                                this.values.forEach((val, key) => {
                                    res.document[i][key] = val;
                                });
                            }
                        }
                        chrome.storage.sync.set({ [this.document]: res.document }, () => {
                            resolve(true);
                        });
                    }
                    reject("Error finding document");
                });
            });
        }
    }
    //TODO: WASM
    all() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(document, (res) => {
                if (res.document != undefined) {
                    for (var i = 0; i < res.document.length; i++) {
                        this.values.forEach((val, key) => {
                            res.document[i][key] = val;
                        });
                    }
                    chrome.storage.sync.set({ [this.document]: res.document }, () => {
                        resolve(true);
                    });
                }
                reject(`Error finding document ${document}`);
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
    add(objects) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(document, (res) => {
                if (res.document != undefined) {
                    res.addAll(objects);
                    chrome.storage.sync.set({ [this.name]: objects }, () => {
                        resolve(true);
                    });
                }
                reject(`Error finding document ${document}`);
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
        if (name in this.config.documents[this.database]) {
            return new Document(name);
        }
        throw Error(`Document ${name} doesn't belong to database ${this.database}`);
    }
    makeDoc(name) {
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