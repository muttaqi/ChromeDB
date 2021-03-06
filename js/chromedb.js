"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Config {
}
class ChromeDB {
    constructor(database) {
        chrome.storage.sync.get('chromedb_config', function (res) {
            if (res.chromedb_config != undefined) {
                this.config = new Config();
                this.config.documents = res.chromedb_config;
                if (!(database in this.config.documents)) {
                    this.config.documents[database] = [];
                }
            }
            else {
                this.config = new Config();
                this.config.documents[database] = [];
            }
        });
    }
}
exports.ChromeDB = ChromeDB;
//# sourceMappingURL=chromedb.js.map