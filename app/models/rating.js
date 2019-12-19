const DB = require("../services/database-service").DB;

class Rating {
  constructor(id, userId, bookId, rating, ratingText) {
    this.id = id;
    this.userId = userId;
    this.bookId = bookId;
    this.rating = rating;
    this.ratingText = ratingText;
  }

  /**
   * List all ratings for a book with pagination
   *
   * @param {number} bookId ID of the book
   * @param {number} limit Number of results to be returned
   * @param {number} offset Offset for pagination to be used
   *
   * @return {Promise<Rating[]>} List of all books limited by pagination parameters
   */
  static async listForBook(bookId, limit = 10, offset = 0) {
    const res = await DB.query(`
      SELECT id, user_id, book_id, rating, rating_text FROM ratings WHERE book_id=${bookId}
    `);

    return res.rows.map(rating => {
      return new Rating(rating.id, rating.user_id, rating.book_id, rating.rating, rating.rating_text);
    });
  }

  static async create(userId, bookId, rating, ratingText) {
    const res = await DB.query(`
      INSERT INTO ratings (user_id, book_id, rating, rating_text) VALUES
      (${userId}, ${bookId}, ${rating}, '${ratingText}')
      RETURNING id
    `);

    if (res.rowCount !== 1) {
      throw new Error("Failed to created rating! Rows count unequal to 1");
    }

    return new Rating(res.rows[0].id, userId, bookId, rating, ratingText);
  }

  static async getRatingsForUser(userId, bookId = null) {
    let whereClause = `WHERE user_id=${userId}`;
    if (bookId !== null) {
      whereClause += ` AND book_id=${bookId}`;
    }
    const res = await DB.query(`
      SELECT id, user_id, book_id, rating, rating_text FROM ratings ${whereClause}
    `);

    return res.rows.map(rating => {
      return new Rating(rating.id, rating.user_id, rating.book_id, rating.rating, rating.rating_text);
    });
  }
}

module.exports = Rating;
