import {ChromeDB} from "./chromedb"

declare var process: any;
var Buffer = require('buffer/').Buffer

const main = async () => {
    let client: ChromeDB = await ChromeDB.init("MyDB");
    await client.makeCollection("MyCollection");

    /*
    for (var i = 0; i < 100; i ++) {
        await client.collection("MyCollection").add({"id": i, "content": "hello${i}"});
    }
    
    var t0 = performance.now()

    for (var i = 0; i < 100; i ++) {
        await client.collection("MyCollection").get().where("id").is(0);
    }
    
    var t1 = performance.now()
    console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")

    //without WASM: 156.01999999489635 milliseconds.
    //with WASM: 155.6750000163447 miliseconds
    */
    
    await client.collection("MyCollection").add({"id": 0, "content": "hello"});
    
    var obj = await client.collection("MyCollection").get().where("id").is(0);
    console.log(obj);
}

main();