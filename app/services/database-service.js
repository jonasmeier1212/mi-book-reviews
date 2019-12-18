const pg = require("pg");

const CON_STRING = process.env.DB_CON_STRING;
if (CON_STRING === undefined) {
  console.log("Error: Environment variable DB_CON_STRING not set!");
  process.exit(1);
}

const DB = new pg.Client({
  connectionString: CON_STRING,
  ssl: process.env.DB_USE_SSL || false
});

async function initDB(done) {
  await DB.connect();
  console.log("Database connection established");
  done();
}

exports.DB = DB;
exports.initDB = initDB;
