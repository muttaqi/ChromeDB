class Config {
    documents: Map<string, Array<string>>;
}

//TODO: WASM all
class FieldCondition {
    field: string;
    action: Get | Set ;

    constructor(field: string, action: Get | Set) {
        this.field = field;
        this.action = action;
    }

    static promiseFromPromiseOrFieldCondition(value: Promise<Array<any>> | Promise<boolean> | FieldCondition) {
        if (value instanceof FieldCondition) {
            throw Error(`Promise should never be created from a field condition!`);
        } else {
            return value;
        }
    }

    is(value: any): Promise<Array<any>> | Promise<boolean> {
        return FieldCondition.promiseFromPromiseOrFieldCondition(this.action.where((obj) => {return obj[this.field] == value;}));
    }

    isnt(value: any): Promise<Array<any>> | Promise<boolean> {
        return FieldCondition.promiseFromPromiseOrFieldCondition(this.action.where((obj) => {return obj[this.field] != value;}));
    }

    greaterThan(value: number): Promise<Array<any>> | Promise<boolean> {
        return FieldCondition.promiseFromPromiseOrFieldCondition(this.action.where((obj) => {return obj[this.field] > value;}));
    }

    lesserThan(value: number): Promise<Array<any>> | Promise<boolean> {
        return FieldCondition.promiseFromPromiseOrFieldCondition(this.action.where((obj) => {return obj[this.field] < value;}));
    }

    greaterThanOrEqualTo(value: number): Promise<Array<any>> | Promise<boolean> {
        return FieldCondition.promiseFromPromiseOrFieldCondition(this.action.where((obj) => {return obj[this.field] >= value;}));
    }

    lesserThanOrEqualTo(value: number): Promise<Array<any>> | Promise<boolean> {
        return FieldCondition.promiseFromPromiseOrFieldCondition(this.action.where((obj) => {return obj[this.field] <= value;}));
    }

    isTrue(): Promise<Array<any>> | Promise<boolean> {
        return FieldCondition.promiseFromPromiseOrFieldCondition(this.action.where((obj) => {return obj[this.field];}));
    }

    isFalse(): Promise<Array<any>> | Promise<boolean> {
        return FieldCondition.promiseFromPromiseOrFieldCondition(this.action.where((obj) => {return obj[this.field];}));
    }

    has(value: any): Promise<Array<any>> | Promise<boolean> {
        return FieldCondition.promiseFromPromiseOrFieldCondition(this.action.where((obj) => {return obj[this.field].includes(value);}));
    }

    length(): LengthFieldCondition {
        return new LengthFieldCondition(this);
    }
}

class LengthFieldCondition extends FieldCondition {
    field: string;
    action: Get | Set ;

    constructor(fc: FieldCondition) {
        super(fc.field, fc.action);
    }

    static promiseFromPromiseOrFieldCondition(value: Promise<Array<any>> | Promise<boolean> | FieldCondition) {
        if (value instanceof FieldCondition) {
            throw Error(`Promise should never be created from a field condition!`);
        } else {
            return value;
        }
    }

    is(value: any): Promise<Array<any>> | Promise<boolean> {
        return FieldCondition.promiseFromPromiseOrFieldCondition(this.action.where((obj) => {return obj[this.field].length == value;}));
    }

    isnt(value: any): Promise<Array<any>> | Promise<boolean> {
        return FieldCondition.promiseFromPromiseOrFieldCondition(this.action.where((obj) => {return obj[this.field].length != value;}));
    }

    greaterThan(value: number): Promise<Array<any>> | Promise<boolean> {
        return FieldCondition.promiseFromPromiseOrFieldCondition(this.action.where((obj) => {return obj[this.field].length > value;}));
    }

    lesserThan(value: number): Promise<Array<any>> | Promise<boolean> {
        return FieldCondition.promiseFromPromiseOrFieldCondition(this.action.where((obj) => {return obj[this.field].length < value;}));
    }

    greaterThanOrEqualTo(value: number): Promise<Array<any>> | Promise<boolean> {
        return FieldCondition.promiseFromPromiseOrFieldCondition(this.action.where((obj) => {return obj[this.field].length >= value;}));
    }

    lesserThanOrEqualTo(value: number): Promise<Array<any>> | Promise<boolean> {
        return FieldCondition.promiseFromPromiseOrFieldCondition(this.action.where((obj) => {return obj[this.field].length <= value;}));
    }

    isTrue(): Promise<Array<any>> | Promise<boolean> {
        throw Error("You can't evaluate length as a boolean");
    }

    isFalse(): Promise<Array<any>> | Promise<boolean> {
        throw Error("You can't evaluate length as a boolean");
    }

    has(value: any): Promise<Array<any>> | Promise<boolean> {
        throw Error("You can't evaluate length as an array");
    }

    length(): LengthFieldCondition {
        throw Error("You can't take the length of a length");
    }
}

class Get {
    document: string;

    constructor(document: string) {this.document = document;}

    where(conditionOrField: ((object: any) => boolean) | string): Promise<Array<any>> | FieldCondition {
        if (typeof conditionOrField === "string") {
            throw new Error("Method not implemented.");
        }

        else {
            return new Promise<Array<any>>((resolve, reject) => {
                chrome.storage.sync.get(document, (res) => {
                    if (res.document != undefined) {
                        var out: Array<any> = [];
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

    all(): Promise<Array<any>> {
        return new Promise<Array<any>>((resolve, reject) => {
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
    values: Map<string, any>;
    document: string;

    constructor(document: string) {this.document = document;}
    where(conditionOrField: ((object: any) => boolean) | string): Promise<boolean> | FieldCondition {
        if (typeof conditionOrField === "string") {
            throw new Error("Method not implemented.");
        }

        else {
            return new Promise<boolean>((resolve, reject) => {
                chrome.storage.sync.get(document, (res) => {
                    if (res.document != undefined) {
                        for (var i = 0; i < res.document.length; i ++) {
                            if (conditionOrField(res.document[i])) {
                                this.values.forEach((val: string, key: string) => {
                                    res.document[i][key] = val;
                                });
                            }
                        }

                        chrome.storage.sync.set({[this.document]: res.document}, () => {
                            resolve(true);
                        });
                    }
    
                    reject("Error finding document");
                });
            });
        }
    }

    //TODO: WASM
    all(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            chrome.storage.sync.get(document, (res) => {
                if (res.document != undefined) {
                    for (var i = 0; i < res.document.length; i ++) {
                        this.values.forEach((val: string, key: string) => {
                            res.document[i][key] = val;
                        });
                    }

                    chrome.storage.sync.set({[this.document]: res.document}, () => {
                        resolve(true);
                    });
                }

                reject(`Error finding document ${document}`);
            });
        });
    }
}

class Document {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    get(): Get {
        return new Get(this.name);
    }

    add(objects: Array<any>): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            chrome.storage.sync.get(document, (res) => {
                if (res.document != undefined) {
                    res.addAll(objects);
                    chrome.storage.sync.set({[this.name]: objects}, () => {
                        resolve(true);
                    });
                }
    
                reject(`Error finding document ${document}`);
            });
        });
    }
}

export class ChromeDB {
    config: Config;
    database: string;

    static init(database: string): Promise<ChromeDB> {
        var db = new ChromeDB();
        db.database = database;
        return new Promise<ChromeDB>((resolve, reject) => {
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
        })
    }

    doc(name: string): Document {
        if (name in this.config.documents[this.database]) {
            return new Document(name);
        }
        throw Error(`Document ${name} doesn't belong to database ${this.database}`);
    }

    makeDoc(name: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            chrome.storage.sync.set({[name]: []}, () => {
                this.config.documents[this.database].push(name);
                resolve(true);
            });
        });
    }

    deleteDoc(name: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            chrome.storage.sync.remove(name, () => {
                this.config.documents[this.database].splice(this.config.documents[this.database].indexOf(name), 1);
                resolve(true);
            });
        });
    }
}