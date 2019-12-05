var express = require("express");
var pg = require("pg");
var bodyParser = require("body-parser");
var session = require("express-session");
require("dotenv").config();

var CON_STRING = process.env.DB_CON_STRING;
if (CON_STRING === undefined) {
  console.log("Error: Environment variable DB_CON_STRING not set!");
  process.exit(1);
}

// pg.defaults.ssl = true;
var dbClient = new pg.Client(CON_STRING);
dbClient.connect();

var app = express();

app.use(
  session({
    secret: "This is a secret!",
    resave: true,
    saveUninitialized: false
  })
);
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.set("views", "app/views");
app.set("view engine", "pug");

app.get("/", function(req, res) {
  res.render("index");
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
