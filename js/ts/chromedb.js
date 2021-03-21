"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChromeDB = void 0;
const https = require('https');
const loader = require("../../node_modules/assemblyscript/lib/loader/index");
class Config {
    constructor() {
        this.collections = new Map();
    }
}
var DatabaseType;
(function (DatabaseType) {
    DatabaseType[DatabaseType["Local"] = 0] = "Local";
    DatabaseType[DatabaseType["Datastore"] = 1] = "Datastore";
    DatabaseType[DatabaseType["Bigtable"] = 2] = "Bigtable";
})(DatabaseType || (DatabaseType = {}));
//TODO: WASM all
class FieldCondition {
    constructor(field, action) {
        this.field = field;
        this.action = action;
    }
    is(value) {
        if (this.action.databaseType == DatabaseType.Datastore) {
            if (this.action instanceof Get) {
                return new Promise((resolve, reject) => {
                    const opt = {
                        hostname: 'datastore.googleapis.com',
                        port: 443,
                        path: '/v1/projects/' + this.action.projectID + ':runQuery',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                    const body = {
                        query: {
                            filter: {
                                propertyFilter: {
                                    property: {
                                        name: this.field
                                    },
                                    op: "EQUAL",
                                    value: {
                                        stringValue: value
                                    }
                                }
                            }
                        }
                    };
                    const req = https.request(opt, res => {
                        res.on('data', d => {
                            var entities = [];
                            for (var entRes of d.batch.entityResults) {
                                entities.push(entRes.entity);
                            }
                            resolve(entities);
                        });
                    });
                    req.write(body);
                    req.end();
                });
            }
            else {
                var set = this.action;
                return new Promise((resolve, reject) => {
                    const opt = {
                        hostname: 'datastore.googleapis.com',
                        port: 443,
                        path: '/v1/projects/' + this.action.projectID + ':runQuery',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                    const body = {
                        query: {
                            filter: {
                                propertyFilter: {
                                    property: {
                                        name: this.field
                                    },
                                    op: "EQUAL",
                                    value: {
                                        stringValue: value
                                    }
                                }
                            }
                        }
                    };
                    const req = https.request(opt, res => {
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
                            const opt2 = {
                                hostname: 'datastore.googleapis.com',
                                port: 443,
                                path: '/v1/projects/' + this.action.projectID + ':commit',
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            };
                            const body2 = {
                                mutations: [
                                    upserts
                                ]
                            };
                            const req2 = https.request(opt2, res2 => {
                                res2.on('data', d2 => {
                                    resolve(true);
                                });
                            });
                            req2.write(body2);
                            req2.end();
                        });
                    });
                    req.write(body);
                    req.end();
                });
            }
        }
        if (this.action.databaseType == DatabaseType.Bigtable) {
            if (this.action instanceof Get) {
                return new Promise((resolve, reject) => {
                });
            }
            else {
                var set = this.action;
                return new Promise((resolve, reject) => {
                });
            }
        }
        if (this.action instanceof Get) {
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get(this.action.collection, (res) => {
                    if (res[this.action.collection] != undefined) {
                        this.action.db.store = res[this.action.collection];
                        var keyPtr = this.action.db.__pin(this.action.db.__newString(this.field));
                        var valPtr = this.action.db.__pin(this.action.db.__newString(JSON.stringify(value)));
                        var aPtr = this.action.db.wasmIs(res[this.action.collection].length, keyPtr, valPtr);
                        var a = this.action.db.__getArray(aPtr);
                        this.action.db.__unpin(keyPtr);
                        this.action.db.__unpin(valPtr);
                        var out = [];
                        for (var i of a) {
                            out.push(res[this.action.collection][i]);
                        }
                        resolve(out);
                    }
                    else {
                        reject(`Error finding collection ${this.action.collection}`);
                    }
                });
            });
        }
        else {
            return this.action.where((obj) => { return obj[this.field] === value; });
        }
    }
    isnt(value) {
        if (this.action.databaseType == DatabaseType.Datastore) {
            throw Error("!= is currently not supported by Datastore");
        }
        if (this.action instanceof Get) {
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get(this.action.collection, (res) => {
                    if (res[this.action.collection] != undefined) {
                        this.action.db.store = res[this.action.collection];
                        var keyPtr = this.action.db.__pin(this.action.db.__newString(this.field));
                        var valPtr = this.action.db.__pin(this.action.db.__newString(JSON.stringify(value)));
                        var aPtr = this.action.db.wasmIsnt(res[this.action.collection].length, keyPtr, valPtr);
                        var a = this.action.db.__getArray(aPtr);
                        this.action.db.__unpin(keyPtr);
                        this.action.db.__unpin(valPtr);
                        var out = [];
                        for (var i of a) {
                            out.push(res[this.action.collection][i]);
                        }
                        resolve(out);
                    }
                    else {
                        reject(`Error finding collection ${this.action.collection}`);
                    }
                });
            });
        }
        else {
            return this.action.where((obj) => { return obj[this.field] != value; });
        }
    }
    greaterThan(value) {
        if (this.action.databaseType == DatabaseType.Datastore) {
            if (this.action instanceof Get) {
                return new Promise((resolve, reject) => {
                    const opt = {
                        hostname: 'datastore.googleapis.com',
                        port: 443,
                        path: '/v1/projects/' + this.action.projectID + ':runQuery',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                    const body = {
                        query: {
                            filter: {
                                propertyFilter: {
                                    property: {
                                        name: this.field
                                    },
                                    op: "GREATER_THAN",
                                    value: {
                                        stringValue: value
                                    }
                                }
                            }
                        }
                    };
                    const req = https.request(opt, res => {
                        res.on('data', d => {
                            var entities = [];
                            for (var entRes of d.batch.entityResults) {
                                entities.push(entRes.entity);
                            }
                            resolve(entities);
                        });
                    });
                    req.write(body);
                    req.end();
                });
            }
            else {
                var set = this.action;
                return new Promise((resolve, reject) => {
                    const opt = {
                        hostname: 'datastore.googleapis.com',
                        port: 443,
                        path: '/v1/projects/' + this.action.projectID + ':runQuery',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                    const body = {
                        query: {
                            filter: {
                                propertyFilter: {
                                    property: {
                                        name: this.field
                                    },
                                    op: "GREATER_THAN",
                                    value: {
                                        stringValue: value
                                    }
                                }
                            }
                        }
                    };
                    const req = https.request(opt, res => {
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
                            const opt2 = {
                                hostname: 'datastore.googleapis.com',
                                port: 443,
                                path: '/v1/projects/' + this.action.projectID + ':commit',
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            };
                            const body2 = {
                                mutations: [
                                    upserts
                                ]
                            };
                            const req2 = https.request(opt2, res2 => {
                                res2.on('data', d2 => {
                                    resolve(true);
                                });
                            });
                            req2.write(body2);
                            req2.end();
                        });
                    });
                    req.write(body);
                    req.end();
                });
            }
        }
        if (this.action instanceof Get) {
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get(this.action.collection, (res) => {
                    if (res[this.action.collection] != undefined) {
                        this.action.db.store = res[this.action.collection];
                        var keyPtr = this.action.db.__pin(this.action.db.__newString(this.field));
                        var valPtr = this.action.db.__pin(this.action.db.__newString(JSON.stringify(value)));
                        var aPtr = this.action.db.wasmGt(res[this.action.collection].length, keyPtr, valPtr);
                        var a = this.action.db.__getArray(aPtr);
                        this.action.db.__unpin(keyPtr);
                        this.action.db.__unpin(valPtr);
                        var out = [];
                        for (var i of a) {
                            out.push(res[this.action.collection][i]);
                        }
                        resolve(out);
                    }
                    else {
                        reject(`Error finding collection ${this.action.collection}`);
                    }
                });
            });
        }
        else {
            return this.action.where((obj) => { return obj[this.field] > value; });
        }
    }
    lessThan(value) {
        if (this.action.databaseType == DatabaseType.Datastore) {
            if (this.action instanceof Get) {
                return new Promise((resolve, reject) => {
                    const opt = {
                        hostname: 'datastore.googleapis.com',
                        port: 443,
                        path: '/v1/projects/' + this.action.projectID + ':runQuery',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                    const body = {
                        query: {
                            filter: {
                                propertyFilter: {
                                    property: {
                                        name: this.field
                                    },
                                    op: "LESS_THAN",
                                    value: {
                                        stringValue: value
                                    }
                                }
                            }
                        }
                    };
                    const req = https.request(opt, res => {
                        res.on('data', d => {
                            var entities = [];
                            for (var entRes of d.batch.entityResults) {
                                entities.push(entRes.entity);
                            }
                            resolve(entities);
                        });
                    });
                    req.write(body);
                    req.end();
                });
            }
            else {
                var set = this.action;
                return new Promise((resolve, reject) => {
                    const opt = {
                        hostname: 'datastore.googleapis.com',
                        port: 443,
                        path: '/v1/projects/' + this.action.projectID + ':runQuery',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                    const body = {
                        query: {
                            filter: {
                                propertyFilter: {
                                    property: {
                                        name: this.field
                                    },
                                    op: "LESS_THAN",
                                    value: {
                                        stringValue: value
                                    }
                                }
                            }
                        }
                    };
                    const req = https.request(opt, res => {
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
                            const opt2 = {
                                hostname: 'datastore.googleapis.com',
                                port: 443,
                                path: '/v1/projects/' + this.action.projectID + ':commit',
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            };
                            const body2 = {
                                mutations: [
                                    upserts
                                ]
                            };
                            const req2 = https.request(opt2, res2 => {
                                res2.on('data', d2 => {
                                    resolve(true);
                                });
                            });
                            req2.write(body2);
                            req2.end();
                        });
                    });
                    req.write(body);
                    req.end();
                });
            }
        }
        if (this.action instanceof Get) {
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get(this.action.collection, (res) => {
                    if (res[this.action.collection] != undefined) {
                        this.action.db.store = res[this.action.collection];
                        var keyPtr = this.action.db.__pin(this.action.db.__newString(this.field));
                        var valPtr = this.action.db.__pin(this.action.db.__newString(JSON.stringify(value)));
                        var aPtr = this.action.db.wasmLt(res[this.action.collection].length, keyPtr, valPtr);
                        var a = this.action.db.__getArray(aPtr);
                        this.action.db.__unpin(keyPtr);
                        this.action.db.__unpin(valPtr);
                        var out = [];
                        for (var i of a) {
                            out.push(res[this.action.collection][i]);
                        }
                        resolve(out);
                    }
                    else {
                        reject(`Error finding collection ${this.action.collection}`);
                    }
                });
            });
        }
        else {
            return this.action.where((obj) => { return obj[this.field] < value; });
        }
    }
    greaterThanOrEqualTo(value) {
        if (this.action.databaseType == DatabaseType.Datastore) {
            if (this.action instanceof Get) {
                return new Promise((resolve, reject) => {
                    const opt = {
                        hostname: 'datastore.googleapis.com',
                        port: 443,
                        path: '/v1/projects/' + this.action.projectID + ':runQuery',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                    const body = {
                        query: {
                            filter: {
                                propertyFilter: {
                                    property: {
                                        name: this.field
                                    },
                                    op: "GREATER_THAN_OR_EQUAL",
                                    value: {
                                        stringValue: value
                                    }
                                }
                            }
                        }
                    };
                    const req = https.request(opt, res => {
                        res.on('data', d => {
                            var entities = [];
                            for (var entRes of d.batch.entityResults) {
                                entities.push(entRes.entity);
                            }
                            resolve(entities);
                        });
                    });
                    req.write(body);
                    req.end();
                });
            }
            else {
                var set = this.action;
                return new Promise((resolve, reject) => {
                    const opt = {
                        hostname: 'datastore.googleapis.com',
                        port: 443,
                        path: '/v1/projects/' + this.action.projectID + ':runQuery',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                    const body = {
                        query: {
                            filter: {
                                propertyFilter: {
                                    property: {
                                        name: this.field
                                    },
                                    op: "GREATER_THAN_OR_EQUAL",
                                    value: {
                                        stringValue: value
                                    }
                                }
                            }
                        }
                    };
                    const req = https.request(opt, res => {
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
                            const opt2 = {
                                hostname: 'datastore.googleapis.com',
                                port: 443,
                                path: '/v1/projects/' + this.action.projectID + ':commit',
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            };
                            const body2 = {
                                mutations: [
                                    upserts
                                ]
                            };
                            const req2 = https.request(opt2, res2 => {
                                res2.on('data', d2 => {
                                    resolve(true);
                                });
                            });
                            req2.write(body2);
                            req2.end();
                        });
                    });
                    req.write(body);
                    req.end();
                });
            }
        }
        if (this.action instanceof Get) {
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get(this.action.collection, (res) => {
                    if (res[this.action.collection] != undefined) {
                        this.action.db.store = res[this.action.collection];
                        var keyPtr = this.action.db.__pin(this.action.db.__newString(this.field));
                        var valPtr = this.action.db.__pin(this.action.db.__newString(JSON.stringify(value)));
                        var aPtr = this.action.db.wasmGte(res[this.action.collection].length, keyPtr, valPtr);
                        var a = this.action.db.__getArray(aPtr);
                        this.action.db.__unpin(keyPtr);
                        this.action.db.__unpin(valPtr);
                        var out = [];
                        for (var i of a) {
                            out.push(res[this.action.collection][i]);
                        }
                        resolve(out);
                    }
                    else {
                        reject(`Error finding collection ${this.action.collection}`);
                    }
                });
            });
        }
        else {
            return this.action.where((obj) => { return obj[this.field] >= value; });
        }
    }
    lessThanOrEqualTo(value) {
        if (this.action.databaseType == DatabaseType.Datastore) {
            if (this.action instanceof Get) {
                return new Promise((resolve, reject) => {
                    const opt = {
                        hostname: 'datastore.googleapis.com',
                        port: 443,
                        path: '/v1/projects/' + this.action.projectID + ':runQuery',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                    const body = {
                        query: {
                            filter: {
                                propertyFilter: {
                                    property: {
                                        name: this.field
                                    },
                                    op: "LESS_THAN_OR_EQUAL",
                                    value: {
                                        stringValue: value
                                    }
                                }
                            }
                        }
                    };
                    const req = https.request(opt, res => {
                        res.on('data', d => {
                            var entities = [];
                            for (var entRes of d.batch.entityResults) {
                                entities.push(entRes.entity);
                            }
                            resolve(entities);
                        });
                    });
                    req.write(body);
                    req.end();
                });
            }
            else {
                var set = this.action;
                return new Promise((resolve, reject) => {
                    const opt = {
                        hostname: 'datastore.googleapis.com',
                        port: 443,
                        path: '/v1/projects/' + this.action.projectID + ':runQuery',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                    const body = {
                        query: {
                            filter: {
                                propertyFilter: {
                                    property: {
                                        name: this.field
                                    },
                                    op: "LESS_THAN_OR_EQUAL",
                                    value: {
                                        stringValue: value
                                    }
                                }
                            }
                        }
                    };
                    const req = https.request(opt, res => {
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
                            const opt2 = {
                                hostname: 'datastore.googleapis.com',
                                port: 443,
                                path: '/v1/projects/' + this.action.projectID + ':commit',
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            };
                            const body2 = {
                                mutations: [
                                    upserts
                                ]
                            };
                            const req2 = https.request(opt2, res2 => {
                                res2.on('data', d2 => {
                                    resolve(true);
                                });
                            });
                            req2.write(body2);
                            req2.end();
                        });
                    });
                    req.write(body);
                    req.end();
                });
            }
        }
        if (this.action instanceof Get) {
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get(this.action.collection, (res) => {
                    if (res[this.action.collection] != undefined) {
                        this.action.db.store = res[this.action.collection];
                        var keyPtr = this.action.db.__pin(this.action.db.__newString(this.field));
                        var valPtr = this.action.db.__pin(this.action.db.__newString(JSON.stringify(value)));
                        var aPtr = this.action.db.wasmLte(res[this.action.collection].length, keyPtr, valPtr);
                        var a = this.action.db.__getArray(aPtr);
                        this.action.db.__unpin(keyPtr);
                        this.action.db.__unpin(valPtr);
                        var out = [];
                        for (var i of a) {
                            out.push(res[this.action.collection][i]);
                        }
                        resolve(out);
                    }
                    else {
                        reject(`Error finding collection ${this.action.collection}`);
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
        if (this.action.databaseType == DatabaseType.Datastore) {
            throw Error("'IN' is currently not supported by Datastore");
        }
        if (this.action instanceof Get) {
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get(this.action.collection, (res) => {
                    if (res[this.action.collection] != undefined) {
                        this.action.db.store = res[this.action.collection];
                        var keyPtr = this.action.db.__pin(this.action.db.__newString(this.field));
                        var valPtr = this.action.db.__pin(this.action.db.__newString(JSON.stringify(value)));
                        var aPtr = this.action.db.wasmHas(res[this.action.collection].length, keyPtr, valPtr);
                        var a = this.action.db.__getArray(aPtr);
                        this.action.db.__unpin(keyPtr);
                        this.action.db.__unpin(valPtr);
                        var out = [];
                        for (var i of a) {
                            out.push(res[this.action.collection][i]);
                        }
                        resolve(out);
                    }
                    else {
                        reject(`Error finding collection ${this.action.collection}`);
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
    constructor(db, collection, databaseType, projectID) {
        this.db = db;
        this.collection = collection;
        this.databaseType = databaseType;
        if (projectID) {
            this.projectID = projectID;
        }
    }
    where(conditionOrField) {
        if (typeof conditionOrField === "string") {
            return new FieldCondition(conditionOrField, this);
        }
        else {
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get(this.collection, (res) => {
                    if (res[this.collection] != undefined) {
                        var out = [];
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
    all() {
        return new Promise((resolve, reject) => {
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
class Set {
    constructor(db, collection, values, databaseType, projectID) {
        this.db = db;
        this.collection = collection;
        this.values = values;
        this.databaseType = databaseType;
        if (projectID) {
            this.projectID = projectID;
        }
    }
    where(conditionOrField) {
        if (typeof conditionOrField === "string") {
            return new FieldCondition(conditionOrField, this);
        }
        else {
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get(this.collection, (res) => {
                    if (res[this.collection] != undefined) {
                        for (var i = 0; i < res[this.collection].length; i++) {
                            var object = res[this.collection][i];
                            for (var key in object) {
                                object[key] = JSON.parse(object[key]);
                            }
                            if (conditionOrField(object)) {
                                this.values.forEach((val, key) => {
                                    res[this.collection][i][key] = JSON.stringify(val);
                                });
                            }
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
    //TODO: WASM
    all() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(this.collection, (res) => {
                if (res[this.collection] != undefined) {
                    for (var i = 0; i < res[this.collection].length; i++) {
                        this.values.forEach((val, key) => {
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
class Collection {
    constructor(db, name) {
        this.db = db;
        this.name = name;
    }
    get() {
        return new Get(this.db, this.name, DatabaseType.Local);
    }
    set(values) {
        return new Set(this.db, this.name, values, DatabaseType.Local);
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
                    reject(`Error finding collection ${this.name}`);
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
                    reject(`Error finding collection ${this.name}`);
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
        });
    }
    useDatastore(projectID) {
        this.databaseType = DatabaseType.Datastore;
        this.projectID = projectID;
    }
    useBigtable() {
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
    collection(name) {
        if (this.config.collections[this.database].includes(name)) {
            return new Collection(this, name);
        }
        throw Error(`Collection ${name} doesn't belong to database ${this.database}`);
    }
    makeCollection(name) {
        if (this.config.collections[this.database].includes(name)) {
            return new Promise((resolve, reject) => {
                resolve(false);
            });
        }
        return new Promise((resolve, reject) => {
            chrome.storage.sync.set({ [name]: [] }, () => {
                this.config.collections[this.database].push(name);
                resolve(true);
            });
        });
    }
    deleteDoc(name) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.remove(name, () => {
                this.config.collections[this.database].splice(this.config.collections[this.database].indexOf(name), 1);
                resolve(true);
            });
        });
    }
}
exports.ChromeDB = ChromeDB;
//# sourceMappingURL=chromedb.js.map