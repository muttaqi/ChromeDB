"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Config = /** @class */ (function () {
    function Config() {
        this.documents = new Map();
    }
    return Config;
}());
//TODO: WASM all
var FieldCondition = /** @class */ (function () {
    function FieldCondition(field, action) {
        this.field = field;
        this.action = action;
    }
    FieldCondition.prototype.is = function (value) {
        var _this = this;
        return this.action.where(function (obj) { return obj[_this.field] == value; });
    };
    FieldCondition.prototype.isnt = function (value) {
        var _this = this;
        return this.action.where(function (obj) { return obj[_this.field] != value; });
    };
    FieldCondition.prototype.greaterThan = function (value) {
        var _this = this;
        return this.action.where(function (obj) { return obj[_this.field] > value; });
    };
    FieldCondition.prototype.lesserThan = function (value) {
        var _this = this;
        return this.action.where(function (obj) { return obj[_this.field] < value; });
    };
    FieldCondition.prototype.greaterThanOrEqualTo = function (value) {
        var _this = this;
        return this.action.where(function (obj) { return obj[_this.field] >= value; });
    };
    FieldCondition.prototype.lesserThanOrEqualTo = function (value) {
        var _this = this;
        return this.action.where(function (obj) { return obj[_this.field] <= value; });
    };
    FieldCondition.prototype.isTrue = function () {
        var _this = this;
        return this.action.where(function (obj) { return obj[_this.field]; });
    };
    FieldCondition.prototype.isFalse = function () {
        var _this = this;
        return this.action.where(function (obj) { return obj[_this.field]; });
    };
    FieldCondition.prototype.has = function (value) {
        var _this = this;
        return this.action.where(function (obj) { return obj[_this.field].includes(value); });
    };
    FieldCondition.prototype.length = function () {
        return new LengthFieldCondition(this);
    };
    return FieldCondition;
}());
var LengthFieldCondition = /** @class */ (function (_super) {
    __extends(LengthFieldCondition, _super);
    function LengthFieldCondition(fc) {
        return _super.call(this, fc.field, fc.action) || this;
    }
    LengthFieldCondition.prototype.is = function (value) {
        var _this = this;
        return this.action.where(function (obj) { return obj[_this.field].length == value; });
    };
    LengthFieldCondition.prototype.isnt = function (value) {
        var _this = this;
        return this.action.where(function (obj) { return obj[_this.field].length != value; });
    };
    LengthFieldCondition.prototype.greaterThan = function (value) {
        var _this = this;
        return this.action.where(function (obj) { return obj[_this.field].length > value; });
    };
    LengthFieldCondition.prototype.lesserThan = function (value) {
        var _this = this;
        return this.action.where(function (obj) { return obj[_this.field].length < value; });
    };
    LengthFieldCondition.prototype.greaterThanOrEqualTo = function (value) {
        var _this = this;
        return this.action.where(function (obj) { return obj[_this.field].length >= value; });
    };
    LengthFieldCondition.prototype.lesserThanOrEqualTo = function (value) {
        var _this = this;
        return this.action.where(function (obj) { return obj[_this.field].length <= value; });
    };
    LengthFieldCondition.prototype.isTrue = function () {
        throw Error("You can't evaluate length as a boolean");
    };
    LengthFieldCondition.prototype.isFalse = function () {
        throw Error("You can't evaluate length as a boolean");
    };
    LengthFieldCondition.prototype.has = function (value) {
        throw Error("You can't evaluate length as an array");
    };
    LengthFieldCondition.prototype.length = function () {
        throw Error("You can't take the length of a length");
    };
    return LengthFieldCondition;
}(FieldCondition));
var Get = /** @class */ (function () {
    function Get(document) {
        this.document = document;
    }
    Get.prototype.where = function (conditionOrField) {
        var _this = this;
        if (typeof conditionOrField === "string") {
            return new FieldCondition(conditionOrField, this);
        }
        else {
            return new Promise(function (resolve, reject) {
                chrome.storage.sync.get(_this.document, function (res) {
                    if (res[_this.document] != undefined) {
                        var out = [];
                        for (var _i = 0, _a = res[_this.document]; _i < _a.length; _i++) {
                            var object = _a[_i];
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
                        reject("Error finding document " + _this.document);
                    }
                });
            });
        }
    };
    Get.prototype.all = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.get(_this.document, function (res) {
                if (res[_this.document] != undefined) {
                    for (var i = 0; i < res[_this.document].length; i++) {
                        var object = res[_this.document][i];
                        for (var key in object) {
                            object[key] = JSON.parse(object[key]);
                        }
                        res[_this.document][i] = object;
                    }
                    resolve(res[_this.document]);
                }
                else {
                    reject("Error finding document " + _this.document);
                }
            });
        });
    };
    return Get;
}());
var Set = /** @class */ (function () {
    function Set(document, values) {
        this.document = document;
        this.values = values;
    }
    Set.prototype.where = function (conditionOrField) {
        var _this = this;
        if (typeof conditionOrField === "string") {
            return new FieldCondition(conditionOrField, this);
        }
        else {
            return new Promise(function (resolve, reject) {
                chrome.storage.sync.get(_this.document, function (res) {
                    var _a;
                    if (res[_this.document] != undefined) {
                        for (var i = 0; i < res[_this.document].length; i++) {
                            var object = res[_this.document][i];
                            for (var key in object) {
                                object[key] = JSON.parse(object[key]);
                            }
                            if (conditionOrField(object)) {
                                _this.values.forEach(function (val, key) {
                                    res[_this.document][i][key] = JSON.stringify(val);
                                });
                            }
                        }
                        chrome.storage.sync.set((_a = {}, _a[_this.document] = res, _a), function () {
                            resolve(true);
                        });
                    }
                    else {
                        reject("Error finding document " + _this.document);
                    }
                });
            });
        }
    };
    //TODO: WASM
    Set.prototype.all = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.get(_this.document, function (res) {
                var _a;
                if (res[_this.document] != undefined) {
                    for (var i = 0; i < res[_this.document].length; i++) {
                        _this.values.forEach(function (val, key) {
                            res[_this.document][i][key] = JSON.stringify(val);
                        });
                    }
                    chrome.storage.sync.set((_a = {}, _a[_this.document] = res, _a), function () {
                        resolve(true);
                    });
                }
                else {
                    reject("Error finding document " + _this.document);
                }
            });
        });
    };
    return Set;
}());
var Document = /** @class */ (function () {
    function Document(name) {
        this.name = name;
    }
    Document.prototype.get = function () {
        return new Get(this.name);
    };
    Document.prototype.set = function (values) {
        return new Set(this.name, values);
    };
    Document.prototype.add = function (object) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.get(_this.name, function (res) {
                var _a;
                for (var key in object) {
                    object[key] = JSON.stringify(object[key]);
                }
                if (res[_this.name] != undefined) {
                    res[_this.name].push(object);
                    chrome.storage.sync.set((_a = {}, _a[_this.name] = res[_this.name], _a), function () {
                        resolve(true);
                    });
                }
                else {
                    reject("Error finding document " + _this.name);
                }
            });
        });
    };
    Document.prototype.addAll = function (objects) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.get(_this.name, function (res) {
                var _a;
                for (var _i = 0, objects_1 = objects; _i < objects_1.length; _i++) {
                    var object = objects_1[_i];
                    for (var key in object) {
                        object[key] = JSON.stringify(object[key]);
                    }
                }
                if (res[_this.name] != undefined) {
                    res[_this.name].addAll(objects);
                    chrome.storage.sync.set((_a = {}, _a[_this.name] = res, _a), function () {
                        resolve(true);
                    });
                }
                else {
                    reject("Error finding document " + _this.name);
                }
            });
        });
    };
    return Document;
}());
var ChromeDB = /** @class */ (function () {
    function ChromeDB() {
    }
    ChromeDB.init = function (database) {
        var db = new ChromeDB();
        db.database = database;
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.get('chromedb_config', function (res) {
                db.config = new Config();
                db.config.documents;
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
                    console.log("setting empty");
                }
                resolve(db);
            });
        });
    };
    ChromeDB.prototype.doc = function (name) {
        if (this.config.documents[this.database].includes(name)) {
            return new Document(name);
        }
        throw Error("Document " + name + " doesn't belong to database " + this.database);
    };
    ChromeDB.prototype.makeDoc = function (name) {
        var _this = this;
        if (this.config.documents[this.database].includes(name)) {
            return new Promise(function (resolve, reject) {
                resolve(false);
            });
        }
        return new Promise(function (resolve, reject) {
            var _a;
            chrome.storage.sync.set((_a = {}, _a[name] = [], _a), function () {
                _this.config.documents[_this.database].push(name);
                console.log("Added document: " + _this.config.documents[_this.database]);
                resolve(true);
            });
        });
    };
    ChromeDB.prototype.deleteDoc = function (name) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.remove(name, function () {
                _this.config.documents[_this.database].splice(_this.config.documents[_this.database].indexOf(name), 1);
                resolve(true);
            });
        });
    };
    return ChromeDB;
}());
exports.ChromeDB = ChromeDB;
