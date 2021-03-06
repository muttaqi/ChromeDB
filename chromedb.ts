class Config {
    documents: Map<string, Array<string>>;
}

interface FieldCondition {
    is(value: any): Promise<Array<any>>;
    isnt(value: any): Promise<Array<any>>;
    greaterThan(value: number): Promise<Array<any>>;
    lesserThan(value: number): Promise<Array<any>>;
    greaterThanOrEqualTo(value: number): Promise<Array<any>>;
    lesserThanOrEqualTo(value: number): Promise<Array<any>>;
    isTrue(): Promise<Array<any>>;
    isFalse(): Promise<Array<any>>;
    has(value: any): Promise<Array<any>>;
    length(): FieldCondition;
}

interface Request {
    where(conditionOrField: (object: any) => boolean | string): Promise<Array<any>> | FieldCondition;
    all(): Promise<Array<any>>;
}

class Get implements Request {
    document: string;

    constructor(document: string) {this.document = document;}

    where(conditionOrField: (object: any) => boolean | string): Promise<Array<any>> | FieldCondition {
        if (typeof conditionOrField === "string") {
            throw new Error("Method not implemented.");
        }

        else {
            return new Promise<Array<any>>(function (resolve, reject) {
                chrome.storage.sync.get(document, function(res) {
                    if (res.document != undefined) {
                        var out: Array<any> = [];
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

class Document {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    get(): Get {
        return new Get(this.name);
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
            chrome.storage.sync.set({name: []}, () => {
                this.config.documents[this.database].push(name);
            });
        });
    }

    deleteDoc(name: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            chrome.storage.sync.remove(name, () => {
                this.config.documents[this.database].splice(this.config.documents[this.database].indexOf(name), 1);
            });
        });
    }
}