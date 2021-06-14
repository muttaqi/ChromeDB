![ChromeDB](assets/chromedb.png)

# Background

ChromeDB has two main motivations. Firstly it is meant as a powerful NoSQL wrapper for Chrome's sync and local storage APIs. Secondly, it is meant to integrate with HTTP database APIs as a caching mechanism.

# Usage

```javascript
import ChromeDB from "./chromedb/js/ts/chromedb"

const main = async () => {
    let client: ChromeDB = await ChromeDB.init("MyDB");
    await client.makeCollection("MyCollection");
    
    await client.collection("MyCollection").add({"id": 0, "content": "hello"});
    
    var obj = await client.collection("MyCollection").get().where("id").is(0);
    console.log(obj);
}

main();
```

# Building

Use Webpack with a 'web' target to build your app. See the repository webpack.config.js for an example Webpack config. Your npm build script should include

```bash
npx webpack && cp ./chromedb/src/ts/query.wasm dist && cp manifest.json ./dist
```

In other words, Webpack your javascript, copy the query.wasm to the dist folder (or wherever your Webpack output is), and copy the manifest.json to the same folder

# Using GCP Datastore

ChromeDB is compatible with any RESTful database API. GCP in particular offers out-of-the-box HTTP APIs for Datastore and BigTable. An experimental backend for GCP Datastore has been implemented, and can be used by calling the following function in your ChromeDB client before retrieving a collection:

```javascript
client.useDatastore(projectID, accessToken);
```

Access tokens should be generated using Google's auth API. See [here](https://developers.google.com/identity/protocols/oauth2/web-server#httprest) for more details.

# Why GCP?

GCP was the most viable cloud integration option because of its well-documented, fully supported HTTP REST API that is usable without any additional legwork.

# Benchmarks
Type (10 query requests) | Latency
------------------ | -------
Datastore                 | 32.65 ms
ChromeDB w/o WebAssembly  | 16.50 ms
ChromeDB w/ WebAssembly   | 15.56 ms

Note: ChromeDB w/o WebAssembly refers to a primitive version of ChromeDB, and its trial was included only for completeness. Currently, WebAssembly is used for most queries by default.

# Future plans

* Integrate Bigtable's HTTP API