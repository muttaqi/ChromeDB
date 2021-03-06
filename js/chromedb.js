"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Config {
}
class Get {
    constructor(document) { this.document = document; }
    where(conditionOrField) {
        if (typeof conditionOrField === "string") {
            throw new Error("Method not implemented.");
        }
        else {
            return new Promise(function (resolve, reject) {
                chrome.storage.sync.get(document, function (res) {
                    if (res.document != undefined) {
                        var out = [];
                        for (var obj in res.document) {
                            if (conditionOrField(obj)) {
                                out.push(obj);
                            }
                        }
                        resolve(out);
                    }
                    reject("Error finding document");
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
class Document {
    constructor(name) {
        this.name = name;
    }
    get() {
        return new Get(this.name);
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
            chrome.storage.sync.set({ name: [] }, () => {
                this.config.documents[this.database].push(name);
            });
        });
    }
    deleteDoc(name) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.remove(name, () => {
                this.config.documents[this.database].splice(this.config.documents[this.database].indexOf(name), 1);
            });
        });
    }
}
exports.ChromeDB = ChromeDB;
//# sourceMappingURL=chromedb.js.map