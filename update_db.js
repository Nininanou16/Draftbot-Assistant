import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig.js';

console.log("Updating database...");

const db = new JsonDB(new Config("db", true, true, '/'));

for (let user in db.getData("/users")) {
    db.push(`/users/${user}/tracking`, []);
}

console.log("Done");