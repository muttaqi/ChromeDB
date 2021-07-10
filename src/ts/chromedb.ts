const loader = require("../../node_modules/assemblyscript/lib/loader/index");

class Config {
    collections: Map<string, Array<string>> = new Map<string, Array<string>>();
}

enum DatabaseType {
    Local,
    Datastore,
    Firestore
}

interface CachedAction {
    collection: string,
    action: string;
    values: string;
    field: string;
    op: string;
    value: string;
}

// field condition will perform an operation when the field is specified
class FieldCondition {
    field: string;
    action: Get | Set | Delete;

    constructor(field: string, action: Get | Set | Delete) {
        this.field = field;
        this.action = action;
    }

    is(value: any): Promise<Array<any> | boolean> {
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
    isnt(value: any): Promise<Array<any> | boolean> {

        if (this.action.databaseType == DatabaseType.Datastore) {
            throw Error("Inequality is currently not supported by Datastore")
        }

        if (this.action.databaseType == DatabaseType.Firestore) {
            throw Error("Inequality is currently not supported by Firestore")
        }

        return this.wasmQuery(value, this.action.db.wasmIsnt);
    }

    greaterThan(value: number): Promise<Array<any> | boolean> {
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

    lessThan(value: number): Promise<Array<any> | boolean> {
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

    greaterThanOrEqualTo(value: number): Promise<Array<any> | boolean> {
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

    lessThanOrEqualTo(value: number): Promise<Array<any> | boolean> {
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

    isTrue(): Promise<Array<any> | boolean> {
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

    isFalse(): Promise<Array<any> | boolean> {
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

    has(value: any): Promise<Array<any> | boolean> {

        if (this.action.databaseType == DatabaseType.Datastore) {
            throw Error("Array membership is currently not supported by Datastore");
        }

        if (this.action.databaseType == DatabaseType.Firestore) {
            throw Error("Array membership is currently not supported by Firestore");
        }

        return this.wasmQuery(value, this.action.db.wasmHas);
    }

    length(): LengthFieldCondition {
        return new LengthFieldCondition(this);
    }

    datastoreRequest(value: any, comparator: string): Promise<Array<any> | boolean> {
        if (this.action instanceof Get) {
            // query based on filter
            return new Promise<Array<any>>((resolve, reject) => {
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
                xhr.onreadystatechange = function()  {
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
                    } else {
                        console.log("Datastore query failed.");
                    }
                };

                xhr.send(body);
            });
        }
        else if (this.action instanceof Set) {
            var set: Set = this.action;
            // query based on filters similar to Get
            return new Promise<boolean>((resolve, reject) => {
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "https://datastore.googleapis.com/v1/projects/" + this.action.projectID + ":runQuery", true);
                xhr.setRequestHeader('Content-Type', 'application/json')
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
                xhr.onreadystatechange = function()  {
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
                            xhr2.setRequestHeader('Content-Type', 'application/json')
                            xhr2.setRequestHeader('Authorization', 'Bearer ' + action.db.token);

                            const body2 = JSON.stringify({
                                mutations: upserts
                            });

                            xhr.onreadystatechange = function()  {
                                if (xhr.readyState == 4) {
                                    var res2 = JSON.parse(xhr.responseText);
                                    
                                    // clear cache
                                    res2.on('data', d2 => {
                                        action.db.cache = [];
                                        action.db.deleteCollection(action.collection);
                                        resolve(true);
                                    });
                                } else {
                                    console.log("Datastore commit failed.");
                                }
                            };

                            xhr2.send(body2);
                        });
                    } else {
                        console.log("Datastore query failed.");
                    }
                };

                xhr.send(body);
            });
        } else {
            return new Promise<boolean>((resolve, reject) => {
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "https://datastore.googleapis.com/v1/projects/" + this.action.projectID + ":runQuery", true);
                xhr.setRequestHeader('Content-Type', 'application/json')
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
                xhr.onreadystatechange = function()  {
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
                            xhr2.setRequestHeader('Content-Type', 'application/json')
                            xhr2.setRequestHeader('Authorization', 'Bearer ' + action.db.token);

                            const body2 = JSON.stringify({
                                mutations: deletes
                            });

                            xhr.onreadystatechange = function()  {
                                if (xhr.readyState == 4) {
                                    var res2 = JSON.parse(xhr.responseText);
        
                                    // update cache
                                    res2.on('data', d2 => {
                                        action.db.cache = [];
                                        action.db.deleteCollection(action.collection);
                                        resolve(true);
                                    });
                                } else {
                                    console.log("Datastore commit failed.");
                                }
                            };

                            xhr2.send(body2);
                        });
                    } else {
                        console.log("Datastore query failed.");
                    }
                };

                xhr.send(body);
            });
        }
    }

    // similar structure to datastore requests
    firestoreRequest(value: any, comparator: string): Promise<Array<any> | boolean> {
        if (this.action instanceof Get) {
            return new Promise<Array<any>>((resolve, reject) => {
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "https://firestore.googleapis.com/v1beta1/projects" + this.action.projectID + "/databases/" + this.action.databaseID + ":runQuery", true);
                xhr.setRequestHeader('Content-Type', 'application/json')
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
                xhr.onreadystatechange = function()  {
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
                    } else {
                        console.log("Firestore query failed.");
                    }
                };

                xhr.send(body);
            });
        }
        else if (this.action instanceof Set) {
            var set: Set = this.action;
            return new Promise<boolean>((resolve, reject) => {
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "https://firestore.googleapis.com/v1beta1/" + this.action.projectID + "/" + this.action.databaseID + ":runQuery", true);
                xhr.setRequestHeader('Content-Type', 'application/json')
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
                xhr.onreadystatechange = function()  {
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
                        xhr2.setRequestHeader('Content-Type', 'application/json')
                        xhr2.setRequestHeader('Authorization', 'Bearer ' + action.db.token);

                        const body2 = JSON.stringify({
                            writes: [
                                {
                                    update: document
                                }
                            ]
                        });

                        xhr.onreadystatechange = function() {
                            if (xhr.readyState == 4) {
                                action.db.cache = [];
                                action.db.deleteCollection(action.collection);
                                resolve(true);
                            } else {
                                console.log("Firestore commit failed.");
                            }
                        };

                        xhr2.send(body2);
                    } else {
                        console.log("Firestore query failed.");
                    }
                };

                xhr.send(body);
            });
        } else {
            return new Promise<boolean>((resolve, reject) => {
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "https://firestore.googleapis.com/v1beta1/" + this.action.projectID + "/" + this.action.databaseID + ":runQuery", true);
                xhr.setRequestHeader('Content-Type', 'application/json')
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
                xhr.onreadystatechange = function()  {
                    if (xhr.readyState == 4) {
                        var res = JSON.parse(xhr.responseText);
                        var d = res.data;

                        var document = d.document;
                            
                        var xhr2 = new XMLHttpRequest();
                        xhr2.open("POST", "https://firestore.googleapis.com/v1beta1/projects/" + action.projectID + "/databases/" + action.databaseID + ":commit", true);
                        xhr2.setRequestHeader('Content-Type', 'application/json')
                        xhr2.setRequestHeader('Authorization', 'Bearer ' + action.db.token);

                        const body2 = JSON.stringify({
                            writes: [
                                {
                                    delete: document.name
                                }
                            ]
                        });

                        xhr.onreadystatechange = function() {
                            if (xhr.readyState == 4) {
                                action.db.cache = [];
                                action.db.deleteCollection(action.collection);
                                resolve(true);
                            } else {
                                console.log("Firestore commit failed.");
                            }
                        };

                        xhr2.send(body2);
                    } else {
                        console.log("Firestore query failed.");
                    }
                };

                xhr.send(body);
            });
        }
    }

    wasmQuery(value: any, moduleFunction: Function): Promise<Array<any> | boolean> {
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
                    } else if (this.action instanceof Set) {
                        for (let i of a) {
                            var object = res[this.action.collection][i];
                            for (var key in object) {
                                object[key] = JSON.parse(object[key]);
                            }

                            this.action.values.forEach((val: any, key: string) => {
                                res[this.action.collection][i][key] = JSON.stringify(val);
                            });
                        }

                        chrome.storage.sync.set({ [this.action.collection]: res[this.action.collection] }, () => {
                            resolve(true);
                        });
                    } else {
                        var indices = new Map();
                        for (let i of a) {
                            indices.set(i, true);
                        }

                        var out = [];
                        for (let i = 0; i < res[this.action.collection].length; i ++) {
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
}

// class to handle queries on a collection
class Get {
    collection: string;
    db: ChromeDB;
    databaseType: DatabaseType;
    projectID: string;
    databaseID: string;

    constructor(db: ChromeDB, collection: string, databaseType: DatabaseType, projectID?: string, databaseID?: string) {
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

    // filter based on a javascript function
    where(condition: (object: any) => boolean): Promise<Array<any>>;
    // or on a field
    where(field: string): FieldCondition;
    where(conditionOrField: any): any {
        // for a field generate a new field condition
        if (typeof conditionOrField === "string") {
            return new FieldCondition(conditionOrField, this);
        }
        // else perform the query using the javascript function
        else {

            if (this.databaseType != DatabaseType.Local) {
                throw Error("Can't use javascript condition for a cloud database")
            }

            return new Promise<Array<any>>((resolve, reject) => {
                chrome.storage.sync.get(this.collection, (res) => {
                    if (res[this.collection] != undefined) {
                        var out: Array<any> = [];
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
    all(): Promise<Array<any>> {
        return new Promise<Array<any>>((resolve, reject) => {
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
    values: Map<string, any>;
    collection: string;
    db: ChromeDB;
    databaseType: DatabaseType;
    projectID: string;
    databaseID: string;

    constructor(db: ChromeDB, collection: string, values: Map<string, any>, databaseType: DatabaseType, projectID?: string, databaseID?: string) {
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

    where(condition: (object: any) => boolean): Promise<boolean>;
    where(field: string): FieldCondition;
    where(conditionOrField: any): any {

        if (typeof conditionOrField === "string") {
            return new FieldCondition(conditionOrField, this);
        }

        else {

            if (this.databaseType != DatabaseType.Local) {
                throw Error("Can't use javascript condition for a cloud database")
            }

            return new Promise<boolean>((resolve, reject) => {
                chrome.storage.sync.get(this.collection, (res) => {
                    if (res[this.collection] != undefined) {
                        for (var i = 0; i < res[this.collection].length; i++) {
                            var object = res[this.collection][i];
                            for (var key in object) {
                                object[key] = JSON.parse(object[key]);
                            }

                            if (conditionOrField(object)) {
                                this.values.forEach((val: any, key: string) => {
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

    all(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            chrome.storage.sync.get(this.collection, (res) => {
                if (res[this.collection] != undefined) {
                    for (var i = 0; i < res[this.collection].length; i++) {
                        this.values.forEach((val: any, key: string) => {
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
    collection: string;
    db: ChromeDB;
    databaseType: DatabaseType;
    projectID: string;
    databaseID: string;

    constructor(db: ChromeDB, collection: string, databaseType: DatabaseType, projectID?: string, databaseID?: string) {
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

    where(condition: (object: any) => boolean): Promise<boolean>;
    where(field: string): FieldCondition;
    where(conditionOrField: any): any {

        if (typeof conditionOrField === "string") {
            return new FieldCondition(conditionOrField, this);
        }

        else {

            if (this.databaseType != DatabaseType.Local) {
                throw Error("Can't use javascript function for a cloud database")
            }

            return new Promise<boolean>((resolve, reject) => {
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
    all(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            chrome.storage.sync.set({ [this.collection]: [] }, () => {
                resolve(true);
            });
        });
    }
}

// class through which queries or mutations can be made
class Collection {
    name: string;
    db: ChromeDB;

    constructor(db: ChromeDB, name: string) {
        this.db = db
        this.name = name;
    }

    get(): Get {
        if (this.db.databaseType == DatabaseType.Local) {
            return new Get(this.db, this.name, this.db.databaseType);
        } else if (this.db.databaseType == DatabaseType.Datastore) {
            return new Get(this.db, this.name, this.db.databaseType, this.db.projectID);
        } else {
            return new Get(this.db, this.name, this.db.databaseType, this.db.projectID, this.db.databaseID);
        }
    }

    set(values: Map<string, any>) {
        if (this.db.databaseType == DatabaseType.Local) {
            return new Set(this.db, this.name, values, this.db.databaseType);
        } else if (this.db.databaseType == DatabaseType.Datastore) {
            return new Set(this.db, this.name, values, this.db.databaseType, this.db.projectID);
        } else {
            return new Set(this.db, this.name, values, this.db.databaseType, this.db.projectID, this.db.databaseID);
        }
    }

    delete(): Delete {
        if (this.db.databaseType == DatabaseType.Local) {
            return new Delete(this.db, this.name, this.db.databaseType);
        } else if (this.db.databaseType == DatabaseType.Datastore) {
            return new Delete(this.db, this.name, this.db.databaseType, this.db.projectID);
        } else {
            return new Delete(this.db, this.name, this.db.databaseType, this.db.projectID, this.db.databaseID);
        }
    }

    add(object: any): Promise<boolean> {
        if (this.db.databaseType == DatabaseType.Local) {
            return this.addLocal(object);
        } else if (this.db.databaseType == DatabaseType.Datastore) {
            this.datastoreInsert([object]);
        }
    }

    // force insertion to be local only
    addLocal(object: any): Promise<boolean> {
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
                    reject(`Error finding collection ${this.name}`);
                }
            });
        });
    }

    // add multiple objects
    addAll(objects: Array<any>): Promise<boolean> {
        if (this.db.databaseType == DatabaseType.Local) {
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
                        reject(`Error finding collection ${this.name}`);
                    }
                });
            });
        } else if (this.db.databaseType == DatabaseType.Datastore) {
            this.datastoreInsert(objects);
        }
    }

    datastoreInsert(objects: any): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "https://datastore.googleapis.com/v1/projects/" + this.db.projectID + ":runQuery", true);
            xhr.setRequestHeader('Content-Type', 'application/json')
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
                })
            }

            const body = JSON.stringify({
                mutations: inserts
            });

            xhr.onreadystatechange = function()  {
                if (xhr.readyState == 4) {
                    resolve(true);
                } else {
                    console.log("Datastore query failed.");
                }
            };

            xhr.send(body);
        });
    }
}

export class ChromeDB {
    config: Config;
    database: string;
    databaseType: DatabaseType;
    projectID: string;
    databaseID: string;
    token: string;
    cache: CachedAction[];

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
        db.databaseType = DatabaseType.Local;
        db.cache = [];
        db.initWASM();

        return new Promise<ChromeDB>((resolve, reject) => {
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
        })
    }

    useDatastore(projectID: string, accessToken: string) {
        this.databaseType = DatabaseType.Datastore;
        this.projectID = projectID;
        this.token = accessToken;
    }
    
    useFirestore(projectID: string, databaseID: string, accessToken: string) {
        this.databaseType = DatabaseType.Firestore;
        this.projectID = projectID;
        this.databaseID = databaseID;
        this.token = accessToken;
    }

    initWASM() {
        // specify functions that wasm will import and use for queries
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
    collection(name: string): Collection {
        if (this.config.collections[this.database].includes(name)) {
            return new Collection(this, name);
        }
        throw Error(`Collection ${name} doesn't belong to database ${this.database}`);
    }

    // add a new collection to the config
    makeCollection(name: string): Promise<boolean> {
        if (this.config.collections[this.database].includes(name)) {
            return new Promise<boolean>((resolve, reject) => {
                resolve(false);
            });
        }

        return new Promise<boolean>((resolve, reject) => {
            chrome.storage.sync.set({ [name]: [] }, () => {
                this.config.collections[this.database].push(name);
                resolve(true);
            });
        });
    }

    // delete a collection from the config
    deleteCollection(name: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            chrome.storage.sync.remove(name, () => {
                this.config.collections[this.database].splice(this.config.collections[this.database].indexOf(name), 1);
                resolve(true);
            });
        });
    }
}