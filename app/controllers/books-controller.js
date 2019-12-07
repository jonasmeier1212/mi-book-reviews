const express = require("express");
const Book = require("../models/book");

class BooksController {
  constructor() {
    this.router = express.Router();

    this.router.get("/", this.list);
  }

  async list(req, res) {
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
  }
}

module.exports = BooksController;
