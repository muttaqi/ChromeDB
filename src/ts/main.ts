import {ChromeDB} from "./chromedb"

const main = async () => {
    let client: ChromeDB = await ChromeDB.init("MyDB");
    await client.makeDoc("MyDoc");
    await client.doc("MyDoc").add({"id": 0, "content": "hello"});
    
    var obj = await client.doc("MyDoc").get().where("id").is(0);
    console.log(obj);
}

main();