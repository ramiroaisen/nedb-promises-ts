"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nedb_1 = __importDefault(require("nedb"));
const noop = () => { };
class Cursor {
    constructor(cursor) {
        this.cursor = cursor;
    }
    skip(n) {
        this.cursor.skip(n);
        return this;
    }
    limit(n) {
        this.cursor.limit(n);
        return this;
    }
    sort(sort) {
        this.cursor.sort(sort);
        return this;
    }
    projection(projection) {
        this.cursor.projection(projection);
        return this;
    }
    then(resolve, reject) {
        return this.exec().then(resolve, reject);
    }
    catch(reject) {
        return this.exec().catch(reject);
    }
    exec() {
        return new Promise((resolve, reject) => {
            this.cursor.exec((err, ...args) => {
                if (err)
                    reject(err);
                else
                    resolve(...args);
            });
        });
    }
}
exports.Cursor = Cursor;
class Datastore {
    constructor(opts) {
        this.nedb = new nedb_1.default(opts);
    }
    findOne(filter, projection) {
        return new Promise((resolve, reject) => {
            this.nedb.findOne(filter, projection, (err, ...args) => {
                if (err)
                    reject(err);
                else
                    resolve(...args);
            });
        });
    }
    find(filter, projection) {
        return new Cursor(this.nedb.find(filter, projection));
    }
    count(filter) {
        return new Promise((resolve, reject) => {
            this.nedb.count(filter, (err, ...args) => {
                if (err)
                    reject(err);
                else
                    resolve(...args);
            });
        });
    }
    update(filter, update, options) {
        options = options || {};
        return new Promise((resolve, reject) => {
            // the unknowns here is because ts cant infer types right but is okay
            this.nedb.update(filter, update, options, (err, numAffected, result, upsert) => {
                if (err)
                    reject(err);
                else if (!options?.returnUpdatedDocs) {
                    resolve({ numAffected, upsert });
                }
                else if (options.multi) {
                    resolve({ numAffected, upsert, documents: result });
                }
                else {
                    resolve({ numAffected, upsert, document: result });
                }
            });
        });
    }
    remove(filter, options) {
        return new Promise((resolve, reject) => {
            this.nedb.remove(filter, options || {}, (err, n) => {
                if (err)
                    reject(err);
                else
                    resolve(n);
            });
        });
    }
    insert(insert) {
        return new Promise((resolve, reject) => {
            // here too is ts fault
            this.nedb.insert(insert, (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    loadDatabase() {
        return new Promise((resolve, reject) => {
            this.nedb.loadDatabase(err => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
    ensureIndex(options) {
        return new Promise((resolve, reject) => {
            this.nedb.ensureIndex(options, (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
    removeIndex(fieldName) {
        return new Promise((resolve, reject) => {
            this.nedb.removeIndex(fieldName, (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
}
exports.Datastore = Datastore;
exports.default = Datastore;
//# sourceMappingURL=index.js.map