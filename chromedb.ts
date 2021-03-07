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

    is(value: any): Promise<Array<any>> | Promise<boolean> {
        return this.action.where((obj) => {return obj[this.field] == value;});
    }

    isnt(value: any): Promise<Array<any>> | Promise<boolean> {
        return this.action.where((obj) => {return obj[this.field] != value;});
    }

    greaterThan(value: number): Promise<Array<any>> | Promise<boolean> {
        return this.action.where((obj) => {return obj[this.field] > value;});
    }

    lesserThan(value: number): Promise<Array<any>> | Promise<boolean> {
        return this.action.where((obj) => {return obj[this.field] < value;});
    }

    greaterThanOrEqualTo(value: number): Promise<Array<any>> | Promise<boolean> {
        return this.action.where((obj) => {return obj[this.field] >= value;});
    }

    lesserThanOrEqualTo(value: number): Promise<Array<any>> | Promise<boolean> {
        return this.action.where((obj) => {return obj[this.field] <= value;});
    }

    isTrue(): Promise<Array<any>> | Promise<boolean> {
        return this.action.where((obj) => {return obj[this.field];});
    }

    isFalse(): Promise<Array<any>> | Promise<boolean> {
        return this.action.where((obj) => {return obj[this.field];});
    }

    has(value: any): Promise<Array<any>> | Promise<boolean> {
        return this.action.where((obj) => {return obj[this.field].includes(value);});
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

    is(value: any): Promise<Array<any>> | Promise<boolean> {
        return this.action.where((obj) => {return obj[this.field].length == value;});
    }

    isnt(value: any): Promise<Array<any>> | Promise<boolean> {
        return this.action.where((obj) => {return obj[this.field].length != value;});
    }

    greaterThan(value: number): Promise<Array<any>> | Promise<boolean> {
        return this.action.where((obj) => {return obj[this.field].length > value;});
    }

    lesserThan(value: number): Promise<Array<any>> | Promise<boolean> {
        return this.action.where((obj) => {return obj[this.field].length < value;});
    }

    greaterThanOrEqualTo(value: number): Promise<Array<any>> | Promise<boolean> {
        return this.action.where((obj) => {return obj[this.field].length >= value;});
    }

    lesserThanOrEqualTo(value: number): Promise<Array<any>> | Promise<boolean> {
        return this.action.where((obj) => {return obj[this.field].length <= value;});
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

    where(condition: (object: any) => boolean): Promise<Array<any>>;
    where(field: string): FieldCondition;
    where(conditionOrField: any): any {
        if (typeof conditionOrField === "string") {
            return new FieldCondition(conditionOrField, this);
        }

        else {
            return new Promise<Array<any>>((resolve, reject) => {
                chrome.storage.sync.get(this.document, (res) => {
                    if (res[this.document] != undefined) {
                        var out: Array<any> = [];
                        for (var obj of res[this.document]) {
                            if (conditionOrField(obj)) {
                                out.push(obj);
                            }
                        }
                        resolve(out);
                    }
    
                    reject(`Error finding document ${this.document}`);
                });
            });
        }
    }

    all(): Promise<Array<any>> {
        return new Promise<Array<any>>((resolve, reject) => {
            chrome.storage.sync.get(this.document, (res) => {
                if (res[this.document] != undefined) {
                    resolve(res[this.document]);
                }

                reject(`Error finding document ${this.document}`);
            });
        });
    }
}

class Set {
    values: Map<string, any>;
    document: string;

    constructor(document: string, values: Map<string, any>) {
        this.document = document;
        this.values = values;
    }

    where(condition: (object: any) => boolean): Promise<boolean>;
    where(field: string): FieldCondition;
    where(conditionOrField: any): any {
        if (typeof conditionOrField === "string") {
            return new FieldCondition(conditionOrField, this);
        }

        else {
            return new Promise<boolean>((resolve, reject) => {
                chrome.storage.sync.get(this.document, (res) => {
                    if (res[this.document] != undefined) {
                        for (var i = 0; i < res[this.document].length; i ++) {
                            if (conditionOrField(res[this.document][i])) {
                                this.values.forEach((val: string, key: string) => {
                                    res[this.document][i][key] = val;
                                });
                            }
                        }

                        chrome.storage.sync.set({[this.document]: res[this.document]}, () => {
                            resolve(true);
                        });
                    }
    
                    reject(`Error finding document ${this.document}`);
                });
            });
        }
    }

    //TODO: WASM
    all(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            chrome.storage.sync.get(this.document, (res) => {
                if (res[this.document] != undefined) {
                    for (var i = 0; i < res[this.document].length; i ++) {
                        this.values.forEach((val: string, key: string) => {
                            res[this.document][i][key] = val;
                        });
                    }

                    chrome.storage.sync.set({[this.document]: res[this.document]}, () => {
                        resolve(true);
                    });
                }

                reject(`Error finding document ${this.document}`);
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

    set(values: Map<string, any>) {
        return new Set(this.name, values);
    }

    add(object: any): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            chrome.storage.sync.get(this.name, (res) => {
                if (res[this.name] != undefined) {
                    res[this.name].push(object);
                    chrome.storage.sync.set({[this.name]: res[this.name]}, () => {
                        resolve(true);
                    });
                }
                
                else {
                    reject(`Error finding document ${this.name}`);
                }
            });
        });
    }

    addAll(objects: Array<any>): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            chrome.storage.sync.get(this.name, (res) => {
                if (res[this.name] != undefined) {
                    res.addAll(objects);
                    chrome.storage.sync.set({[this.name]: res}, () => {
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
        if (this.config.documents[this.database].includes(name)) {
            return new Document(name);
        }
        throw Error(`Document ${name} doesn't belong to database ${this.database}`);
    }

    makeDoc(name: string): Promise<boolean> {
        if (this.config.documents[this.database].includes(name)) {
            return new Promise<boolean>((resolve, reject) => {
                resolve(false);
            });
        }

        return new Promise<boolean>((resolve, reject) => {
            chrome.storage.sync.set({[name]: []}, () => {
                this.config.documents[this.database].push(name);
                console.log(`Added document: ${this.config.documents[this.database]}`)
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