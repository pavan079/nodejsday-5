const {MongoClient} = require('mongodb');

async function showDatabases(client){
    const dblist = await client.db().admin().listDatabases();
    connsole.log("dbs",dblist);
    dblist.databases.forEach(db => console.log(` - ${db.name}`));
}

module.exports =  async function connectToMongoDb(){
const url = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(url);
await client.connect();
await showDatabases(client);
await client.close();

}