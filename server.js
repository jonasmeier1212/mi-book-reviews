const DBService = require("./app/services/database-service");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const morgan = require("morgan");
const UserController = require("./app/controllers/users-controller");
require("dotenv").config();

const app = express();

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
app.use(morgan("combined"));

app.set("views", "app/views");
app.set("view engine", "pug");

app.use("/user", new UserController().router);

app.get("/", function(req, res) {
  res.render("index");
});

// TODO: Add global error handler middleware

// Wait for database initialization before starting listener
DBService.initDB(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
  });
});
