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

// or load after
await collection.loadDatabase();

// find
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

// findOne
const doc = await collection.findOne(filter: FilterQuery<Document<T>>, projection: Projection<Document<T>>);

// update
const res = await collection.update(filter: FilterQuery<Document<T>>, update: UpdateQuery<Document<T>>, options?: UpdateOptions);

// remove
const numAffected = await collection.remove(filter: FilterQuery<Document<T>>) 

// index
await collection.ensureIndex(fieldName: keyof Document<T>, options: IndexOptions);

// and so on...

```

Everything is this repo works as expected and has a typescript definition

The functions have the same name as in the original nedb

Note: update queries resolves to an object with this props
```ts
numAffected: number
upsert: boolean
document: Document<T> // if options.returnUpdatedDocs set to true and options.multi set to falsy value
documents: Document<T>[] // if options.returnUpdatedDocs set to true and options.multi set to truthly value
```

---
More Notes

`Cursor` objects has a `.cursor` prop that points to the original nedb cursor

`Datastore` objects has a `.nedb` prop that points to the original nedb datastore

So if you must you can do `collection.nedb.someOp((err, result) => ()}`


If you have a comment open an issue in this repo :)