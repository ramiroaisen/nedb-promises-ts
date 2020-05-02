import Nedb, { UpdateQuery, SortQuery, Cursor as NedbCursor, DatastoreOptions, Document, FilterQuery, Projection, RemoveOptions, InsertDoc, IndexOptions } from "nedb";
export declare class Cursor<T> implements PromiseLike<Document<T>[]> {
    cursor: NedbCursor<T>;
    constructor(cursor: NedbCursor<T>);
    skip(n: number): Cursor<T>;
    limit(n: number): Cursor<T>;
    sort(sort: SortQuery<Document<T>>): Cursor<T>;
    projection(projection: Projection<Document<T>>): Cursor<T>;
    then(resolve: (docs: T[]) => any, reject?: (err: Error) => any): Promise<any>;
    catch(reject: (err: Error) => any): Promise<any>;
    exec(): Promise<T[]>;
}
export declare class Datastore<T> {
    nedb: Nedb<T>;
    constructor(opts?: string | DatastoreOptions);
    findOne(filter: FilterQuery<Document<T>>, projection?: Projection<Document<T>>): Promise<Document<T>>;
    find(filter: FilterQuery<Document<T>>, projection?: Projection<Document<T>>): Cursor<T>;
    count(filter: FilterQuery<Document<T>>): Promise<number>;
    update(filter: FilterQuery<Document<T>>, update: UpdateQuery<Document<T>>, options?: {
        multi?: boolean;
        returnUpdatedDocs?: false;
        upsert?: boolean;
    }): Promise<{
        numAffected: number;
        upsert: boolean;
    }>;
    update(filter: FilterQuery<Document<T>>, update: UpdateQuery<Document<T>>, options: {
        multi?: false;
        returnUpdatedDocs: true;
        upsert?: boolean;
    }): Promise<{
        numAffected: number;
        document: Document<T>;
        upsert: boolean;
    }>;
    update(filter: FilterQuery<Document<T>>, update: UpdateQuery<Document<T>>, options: {
        multi: true;
        returnUpdatedDocs: true;
        upsert?: boolean;
    }): Promise<{
        numAffected: number;
        documents: Document<T>[];
        upsert: boolean;
    }>;
    remove(filter: FilterQuery<Document<T>>, options?: RemoveOptions): Promise<number>;
    insert(newDoc: InsertDoc<Document<T>>): Promise<Document<T>>;
    insert(newDocs: InsertDoc<Document<T>>[]): Promise<Document<T>[]>;
    loadDatabase(): Promise<void>;
    ensureIndex(options: IndexOptions<T>): Promise<void>;
    removeIndex(fieldName: keyof Document<T>): Promise<void>;
}
export default Datastore;
//# sourceMappingURL=index.d.ts.map