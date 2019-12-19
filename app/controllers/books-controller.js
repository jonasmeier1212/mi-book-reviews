const express = require("express");
const Book = require("../models/book");
const Rating = require("../models/rating");

class BooksController {
  constructor() {
    this.router = express.Router();

    this.router.get("/", this.list);
    this.router.get("/:id", this.show);
  }

  async list(req, res) {
    try {
      const offset = req.query.offset;
      const limit = req.query.limit;
      let books = [];
      if (!req.query.query || req.query.query === "") {
        books = await Book.list(limit, offset);
      } else {
        books = await Book.search(req.query.query, limit, offset);
      }

      res.render("books_search_result", {
        query: req.query.query || "",
        results: books
      });
    } catch (e) {
      res.status(500).send(e.message);
    }
  }

  async show(req, res) {
    try {
      const bookId = req.params.id;

      const book = await Book.findById(bookId);
      const ratings = await Rating.listForBook(bookId);

      res.render("book_detail", {
        book,
        ratings,
        username: req.session.username
      });
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
}

module.exports = BooksController;
