const loader = require("../../node_modules/assemblyscript/lib/loader/index");

class Config {
    documents: Map<string, Array<string>> = new Map<string, Array<string>>();
}

//TODO: WASM all
class FieldCondition {
    field: string;
    action: Get | Set;

    constructor(field: string, action: Get | Set) {
        this.field = field;
        this.action = action;
    }

    is(value: any): Promise<Array<any>> | Promise<boolean> {
        if (this.action instanceof Get) {
            return new Promise<Array<any>>((resolve, reject) => {
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

    /*
    isnt(value: any): Promise<Array<any>> | Promise<boolean> {
        if (this.action instanceof Get) {
            return new Promise<Array<any>>((resolve, reject) => {
                chrome.storage.sync.get(this.action.document, (res) => {
                    if (res[this.action.document] != undefined) {
                        resolve(__getArray(wasmIsnt(__newArray(ObjectArray_id, res[this.action.document]), __newString(this.field), __newString(JSON.stringify(value)))))
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

    greaterThan(value: number): Promise<Array<any>> | Promise<boolean> {
        if (this.action instanceof Get) {
            return new Promise<Array<any>>((resolve, reject) => {
                chrome.storage.sync.get(this.action.document, (res) => {
                    if (res[this.action.document] != undefined) {
                        resolve(__getArray(wasmGt(__newArray(ObjectArray_id, res[this.action.document]), __newString(this.field), __newString(JSON.stringify(value)))))
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

    lessThan(value: number): Promise<Array<any>> | Promise<boolean> {
        if (this.action instanceof Get) {
            return new Promise<Array<any>>((resolve, reject) => {
                chrome.storage.sync.get(this.action.document, (res) => {
                    if (res[this.action.document] != undefined) {
                        resolve(__getArray(wasmLt(__newArray(ObjectArray_id, res[this.action.document]), __newString(this.field), __newString(JSON.stringify(value)))))
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

    greaterThanOrEqualTo(value: number): Promise<Array<any>> | Promise<boolean> {
        if (this.action instanceof Get) {
            return new Promise<Array<any>>((resolve, reject) => {
                chrome.storage.sync.get(this.action.document, (res) => {
                    if (res[this.action.document] != undefined) {
                        resolve(__getArray(wasmGte(__newArray(ObjectArray_id, res[this.action.document]), __newString(this.field), __newString(JSON.stringify(value)))))
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

    lessThanOrEqualTo(value: number): Promise<Array<any>> | Promise<boolean> {
        if (this.action instanceof Get) {
            return new Promise<Array<any>>((resolve, reject) => {
                chrome.storage.sync.get(this.action.document, (res) => {
                    if (res[this.action.document] != undefined) {
                        resolve(__getArray(wasmLte(__newArray(ObjectArray_id, res[this.action.document]), __newString(this.field), __newString(JSON.stringify(value)))))
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

    isTrue(): Promise<Array<any>> | Promise<boolean> {
        return this.action.where((obj) => { return obj[this.field]; });
    }

    isFalse(): Promise<Array<any>> | Promise<boolean> {
        return this.action.where((obj) => { return obj[this.field]; });
    }

    has(value: any): Promise<Array<any>> | Promise<boolean> {
        if (this.action instanceof Get) {
            return new Promise<Array<any>>((resolve, reject) => {
                chrome.storage.sync.get(this.action.document, (res) => {
                    if (res[this.action.document] != undefined) {
                        resolve(__getArray(wasmHas(__newArray(ObjectArray_id, res[this.action.document]), __newString(this.field), __newString(JSON.stringify(value)))))
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

    length(): LengthFieldCondition {
        return new LengthFieldCondition(this);
    }
    */
}

class LengthFieldCondition extends FieldCondition {
    field: string;
    action: Get | Set;

    constructor(fc: FieldCondition) {
        super(fc.field, fc.action);
    }

    is(value: any): Promise<Array<any>> | Promise<boolean> {
        return this.action.where((obj) => { return obj[this.field].length === value; });
    }

    isnt(value: any): Promise<Array<any>> | Promise<boolean> {
        return this.action.where((obj) => { return obj[this.field].length != value; });
    }

    greaterThan(value: number): Promise<Array<any>> | Promise<boolean> {
        return this.action.where((obj) => { return obj[this.field].length > value; });
    }

    lessThan(value: number): Promise<Array<any>> | Promise<boolean> {
        return this.action.where((obj) => { return obj[this.field].length < value; });
    }

    greaterThanOrEqualTo(value: number): Promise<Array<any>> | Promise<boolean> {
        return this.action.where((obj) => { return obj[this.field].length >= value; });
    }

    lessThanOrEqualTo(value: number): Promise<Array<any>> | Promise<boolean> {
        return this.action.where((obj) => { return obj[this.field].length <= value; });
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
    db: ChromeDB;

    constructor(db: ChromeDB, document: string) {
        this.db = db;
        this.document = document;
    }

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

    all(): Promise<Array<any>> {
        return new Promise<Array<any>>((resolve, reject) => {
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
    values: Map<string, any>;
    document: string;
    db: ChromeDB;

    constructor(db: ChromeDB, document: string, values: Map<string, any>) {
        this.db = db;
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
                        for (var i = 0; i < res[this.document].length; i++) {
                            var object = res[this.document][i];
                            for (var key in object) {
                                object[key] = JSON.parse(object[key]);
                            }

                            if (conditionOrField(object)) {
                                this.values.forEach((val: any, key: string) => {
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
    all(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            chrome.storage.sync.get(this.document, (res) => {
                if (res[this.document] != undefined) {
                    for (var i = 0; i < res[this.document].length; i++) {
                        this.values.forEach((val: any, key: string) => {
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
    name: string;
    db: ChromeDB;

    constructor(db: ChromeDB, name: string) {
        this.db = db
        this.name = name;
    }

    get(): Get {
        return new Get(this.db, this.name);
    }

    set(values: Map<string, any>) {
        return new Set(this.db, this.name, values);
    }

    add(object: any): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
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

    addAll(objects: Array<any>): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
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

export class ChromeDB {
    config: Config;
    database: string;

    wasmIs: Function;
    wasmIsnt: Function;
    wasmGt: Function;
    wasmLt: Function;
    wasmGte: Function;
    wasmLte: Function;
    wasmHas: Function;
    __getString: Function;
    __newString: Function;
    __getArray: Function;
    __newArray: Function;
    __pin: Function;
    __unpin: Function;

    store: object;
    ptrStore;

    static init(database: string): Promise<ChromeDB> {
        var db = new ChromeDB();
        db.database = database;
        db.initWASM();

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

    doc(name: string): Document {
        if (this.config.documents[this.database].includes(name)) {
            return new Document(this, name);
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
            chrome.storage.sync.set({ [name]: [] }, () => {
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