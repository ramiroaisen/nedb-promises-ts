import Nedb, {
    UpdateQuery,
    SortQuery,
    Cursor as NedbCursor,
    DatastoreOptions,
    Document,
    FilterQuery,
    Projection,
    RemoveOptions, InsertDoc, IndexOptions
} from "nedb";

const noop = () => {};

export class Cursor<T> implements PromiseLike<Document<T>[]> {
    
    cursor: NedbCursor<T>;
    
    constructor(cursor: NedbCursor<T>) {
        this.cursor = cursor;
    }

    skip(n: number): Cursor<T> {
        this.cursor.skip(n);
        return this;
    }

    limit(n: number): Cursor<T> {
        this.cursor.limit(n);
        return this;
    }

    sort(sort: SortQuery<Document<T>>): Cursor<T>{
        this.cursor.sort(sort);
        return this;
    }

    projection(projection: Projection<Document<T>>): Cursor<T> {
        this.cursor.projection(projection);
        return this;
    }

    then(resolve: (docs: T[]) => any, reject?: (err: Error) => any): Promise<any> {
        return this.exec().then(resolve, reject);
    }

    catch(reject: (err: Error) => any): Promise<any> {
        return this.exec().catch(reject);
    }

    exec() {
        return new Promise<T[]>((resolve, reject) => {
            this.cursor.exec((err, ...args) => {
                if(err) reject(err);
                else resolve(...args);
            })
        })
    }


}

export class Datastore<T> {
    nedb: Nedb<T>;
    constructor(opts?: string | DatastoreOptions) {
        this.nedb = new Nedb<T>(opts);
    }
    
    findOne(filter: FilterQuery<Document<T>>, projection?: Projection<Document<T>>): Promise<Document<T>> {
        return new Promise((resolve, reject) => {
            this.nedb.findOne(filter, projection, (err, ...args) => {
                if(err) reject(err);
                else resolve(...args);
            })
        })
    }

    find(filter: FilterQuery<Document<T>>, projection?: Projection<Document<T>>): Cursor<T> {
        return new Cursor(this.nedb.find(filter, projection))
    }

    count(filter: FilterQuery<Document<T>>): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            this.nedb.count(filter, (err, ...args) => {
                if(err) reject(err);
                else resolve(...args);
            })
        })
    }

    update(
        filter: FilterQuery<Document<T>>,
        update: UpdateQuery<Document<T>>,
        options?: {multi?: boolean, returnUpdatedDocs?: false, upsert?: boolean},
    ): Promise<{numAffected: number, upsert: boolean}>;

    update(
        filter: FilterQuery<Document<T>>,
        update: UpdateQuery<Document<T>>,
        options: {multi?: false, returnUpdatedDocs: true, upsert?: boolean},
    ): Promise<{numAffected: number, document: Document<T>, upsert: boolean}>;

    update(
        filter: FilterQuery<Document<T>>,
        update: UpdateQuery<Document<T>>,
        options: {multi: true, returnUpdatedDocs: true, upsert?: boolean},
    ): Promise<{numAffected: number, documents: Document<T>[], upsert: boolean}>;

    update(
        filter: FilterQuery<Document<T>>,
        update: UpdateQuery<Document<T>>,
        options?: {multi?: boolean, returnUpdatedDocs?: boolean, upsert?: boolean}
        ): Promise<{numAffected: number, document?: Document<T>, documents?: Document<T>[], upsert: boolean}> {
        options = options || {};
        return new Promise((resolve, reject) => {
            // the unknowns here is because ts cant infer types right but is okay
            this.nedb.update(filter, update, options as any, (err, numAffected, result, upsert) => {
                if (err) reject(err);
                else if (!options?.returnUpdatedDocs) {
                    resolve({numAffected, upsert});
                } else if (options.multi) {
                    resolve({numAffected, upsert, documents: result as unknown as Document<T>[]})
                } else {
                    resolve({numAffected, upsert, document: result as unknown as Document<T>})
                }
            })
        })
    }

    remove(filter: FilterQuery<Document<T>>, options?: RemoveOptions): Promise<number> {
        return new Promise((resolve, reject) => {
            this.nedb.remove(filter, options || {}, (err, n) => {
                if(err) reject(err);
                else resolve(n);
            })
        })
    }

    insert(newDoc: InsertDoc<Document<T>>): Promise<Document<T>>;
    insert(newDocs: InsertDoc<Document<T>>[]): Promise<Document<T>[]>;
    insert(insert: InsertDoc<Document<T>> | InsertDoc<Document<T>>[]): Promise<Document<T> | Document<T>[]> {
        return new Promise((resolve, reject) => {
            // here too is ts fault
            this.nedb.insert(insert as any, (err, res) => {
                if(err) reject(err);
                else resolve(res);
            })
        })
    }

    loadDatabase(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.nedb.loadDatabase(err => {
                if(err) reject(err);
                else resolve();
            })
        })
    }

    ensureIndex(options: IndexOptions<T>): Promise<void> {
        return new Promise((resolve, reject) => {
            this.nedb.ensureIndex(options, (err) => {
                if(err) reject(err);
                else resolve();
            })
        })
    }

    removeIndex(fieldName: keyof Document<T>): Promise<void> {
        return new Promise((resolve, reject) => {
            this.nedb.removeIndex(fieldName, (err) => {
                if(err) reject(err);
                else resolve();
            })
        })
    }
}

export default Datastore;