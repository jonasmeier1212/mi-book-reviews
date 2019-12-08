DROP TABLE IF EXISTS books;
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
	isbn VARCHAR(10) NOT NULL UNIQUE,
	title VARCHAR NOT NULL,
	author VARCHAR NOT NULL,
	year SMALLINT NOT NULL
);

DROP TABLE IF EXISTS users;
CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	username TEXT NOT NULL UNIQUE,
	email TEXT NOT NULL UNIQUE,
	password_hash TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- TODO: Create index on username!

DROP TABLE IF EXISTS session;
CREATE TABLE session (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

DROP TABLE IF EXISTS ratings;
CREATE TABLE ratings (
	id SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(id),
	book_id INTEGER REFERENCES books(id),
	rating SMALLINT NOT NULL,
	rating_text TEXT NOT NULL DEFAULT ''
);
