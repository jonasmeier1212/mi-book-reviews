require("dotenv").config();
const DBService = require("./app/services/database-service");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const pg = require("pg");
const PgSession = require("connect-pg-simple")(session);
const morgan = require("morgan");
const path = require("path");
const UserController = require("./app/controllers/users-controller");
const BooksController = require("./app/controllers/books-controller");
const RatingsController = require("./app/controllers/ratings-controller");
const { authenticated } = require("./app/middlewares/authenticated");

const app = express();

const pgPool = new pg.Pool({
  connectionString: process.env.DB_CON_STRING,
  ssl: process.env.DB_USE_SSL
});

app.use(
  session({
    store: new PgSession({
      pool: pgPool
    }),
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

// Serve public assets
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", new UserController().router);
app.use("/books", authenticated, new BooksController().router);
app.use("/", authenticated, new RatingsController().router);

app.get("/", authenticated, function(req, res) {
  res.render("index", {
    username: req.session.username
  });
});

// Wait for database initialization before starting listener
DBService.initDB(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
  });
});
