import {ChromeDB} from "./chromedb"

const main = async () => {
    let client: ChromeDB = await ChromeDB.init("myDB");
}

main();