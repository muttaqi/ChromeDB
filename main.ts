import {ChromeDB} from "./chromedb"

const main = async () => {
    let client: ChromeDB = await ChromeDB.init("myDB");
    await client.makeDoc("MyDoc");
    await client.doc("MyDoc").add({"id": 0, "content": "hello"});
    
    var obj = await client.doc("MyDoc").get().where("id").is(1);
    console.log(obj);
}

main();