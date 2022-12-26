import { MongoClient } from 'mongodb';
import { env } from '../config/config.js';

let _db;

//self execute function

(async () => {
  const client = new MongoClient(env.DB_URL, {
    socketTimeoutMS: 500,
    maxPoolSize: 100,
  });

  try {
    // Connect to the MongoDB cluster
    const mongoClient = await client.connect();
    _db = mongoClient.db(env.DB_NAME);
    console.log('Connected successfully to database server');
  } catch (e) {
    console.error(e);
    // if error occurs, exit process, meaning no more application/server(service) runs
    process.exit(1);
  }
})();

// get database, this is only decleared and exported so can be called from other files
const get = () => {
  //console.log(_db)
  if (!_db) {
    throw Error('Db not initialized');
  }
  return _db;
};

//close db connection, this is only decleared and exported so can be called from other files
const closeClient = () => {
  if (_db) {
    _db.close();
  }
};

export { get, closeClient };
