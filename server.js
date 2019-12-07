const DBService = require("./app/services/database-service");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const morgan = require("morgan");
const UserController = require("./app/controllers/users-controller");
const { authenticated } = require("./app/middlewares/authenticated");
require("dotenv").config();

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET || "sessionsecret",
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

app.get("/", authenticated, function(req, res) {
  res.render("index");
});

// Wait for database initialization before starting listener
DBService.initDB(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
  });
});
