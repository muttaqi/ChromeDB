import {ChromeDB} from "./chromedb"

const main = async () => {
    let client: ChromeDB = await ChromeDB.init("MyDB");
    await client.makeCollection("MyCollection");
    
    await client.collection("MyCollection").add({"id": 0, "content": "hello"});
    
    var obj = await client.collection("MyCollection").get().where("id").is(0);
    console.log(obj);
}

main();