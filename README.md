# Nedb for modern javascript
Nedb with promises and typescript definitions

for plain Nedb typings see [ramiroaisen/nedb-types](https://github.com.ar/ramiroaisen/nedb-types)

---

### install
```sh
npm i nedb-promises-ts
```

### Usage
```ts
import Nedb from "nedb-promises-ts";
const collection = new Nedb<MyTypeHere>({autoload: true});

const documents = await collection.find({some: "query"})
                .sort({some: 1})
                .skip(5)
                .limit(10)
                .projection({_id: 0, some: 1}))

// OR
const cursor = collection.find(...);
cursor.skip(5);
cursor.then(documents =>  ... )
// same as 
cursor.exec().then(documents => ... )
```

Everything is this repo works as expected and has a typescript definition

Note: update queries resolves to an object with this props
```ts
numAffected: number
upsert: boolean
document: Document<T> // if options.returnUpdatedDocs set to true and options.multi set to falsy value
documents: Document<T>[] // if options.returnUpdatedDocs set to true and options.multi set to truthly value
```