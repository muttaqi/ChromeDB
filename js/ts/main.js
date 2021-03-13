"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chromedb_1 = require("./chromedb");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    let client = yield chromedb_1.ChromeDB.init("MyDB");
    yield client.makeDoc("MyDoc");
    for (var i = 0; i < 100; i++) {
        yield client.doc("MyDoc").add({ "id": i, "content": "hello${i}" });
    }
    var t0 = performance.now();
    for (var i = 0; i < 100; i++) {
        yield client.doc("MyDoc").get().where("id").is(0);
    }
    var t1 = performance.now();
    console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
    //without WASM: 156.01999999489635 milliseconds.
    //actual demo
    /*
    await client.doc("MyDoc").add({"id": 0, "content": "hello"});
    
    var obj = await client.doc("MyDoc").get().where("id").is(0);
    console.log(obj);
    */
});
main();
//# sourceMappingURL=main.js.map