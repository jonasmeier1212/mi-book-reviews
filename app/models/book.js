const DB = require("../services/database-service").DB;

class Book {
  constructor(id, isbn, title, author, year) {
    this.id = id;
    this.isbn = isbn;
    this.title = title;
    this.author = author;
    this.year = year;
  }

  /**
   * Searches for books by ISBN, title and author
   * @param {string} searchTerm
   * @param {number} limit Number of results to be returned
   * @param {number} offset Offset for pagination to be used
   *
   * @returns {Promise<Book[]>} List of books that match the search term limited by pagination parameters
   */
  static async search(searchTerm, limit = 10, offset = 0) {
    console.log("[Model/Book] Search for books with search term " + searchTerm);
    /*
      Match title or author if search term is contained.
      Match ISBN only if it starts with searchterm.
     */
    const res = await DB.query(`SELECT id, isbn, title, author, year FROM books WHERE
      isbn LIKE '${searchTerm}%' OR
      LOWER(title) LIKE LOWER('%${searchTerm}%') OR
      LOWER(author) LIKE LOWER('%${searchTerm}%')
      LIMIT ${limit}
      OFFSET ${offset}
    ;`);

    console.log(`[Model/Book] Found ${res.rowCount} results`);

    return res.rows.map(row => {
      return new Book(row.id, row.isbn, row.title, row.author, row.year);
    });
  }

  /**
   * List all books with pagination
   *
   * @param {number} limit Number of results to be returned
   * @param {number} offset Offset for pagination to be used
   *
   * @return {Promise<Book[]>} List of all books limited by pagination parameters
   */
  static async list(limit = 10, offset = 0) {
    const res = await DB.query(
      `SELECT id, isbn, title, author, year FROM books LIMIT ${limit} OFFSET ${offset};`
    );

    return res.rows.map(row => {
      return new Book(row.id, row.isbn, row.title, row.author, row.year);
    });
  }
}

module.exports = Book;
