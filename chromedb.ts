class Config {
    documents: Map<string, Array<string>>;
}

interface FieldCondition {
    is(value: any): any;
    isnt(value: any): any;
    greaterThan(value: number): any;
    lesserThan(value: number): any;
    greaterThanOrEqualTo(value: number): any;
    lesserThanOrEqualTo(value: number): any;
    isTrue(): any;
    isFalse(): any;
    has(value: any): any;
    length(): FieldCondition;
}

interface Request {
    where(condition: (object: any) => boolean): any;
    where(key: string): any;
}

class Document {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}

export class ChromeDB {
    config: Config;

    constructor(database: string) {
        chrome.storage.sync.get('chromedb_config', function(res) {
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

    document
}