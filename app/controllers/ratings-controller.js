const express = require("express");
const { check, validationResult } = require("express-validator");
const Rating = require("../models/rating");

class RatingsController {
  constructor() {
    this.router = express.Router();

    this.router.post(
      "/books/:bookId/ratings",
      [
        check("rating").isInt(),
        check("rating_text")
          .isString()
          .not()
          .isEmpty()
      ],
      this.store
    );
  }

  async store(req, res) {
    try {
      const bookId = req.params.bookId;

      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        return res.status(422).send("Validation error");
      }

      // Check if there is already a rating for this user
      const userId = req.session.user_id;
      const userRatings = await Rating.getRatingsForUser(userId, bookId);
      if (userRatings.length !== 0) {
        return res.status(400).send("Pro Buch ist nur eine Bewertung pro Benutzer möglich!");
      }

      await Rating.create(userId, bookId, req.body.rating, req.body.rating_text);

      res.redirect("/books/" + bookId);
    } catch (e) {
      console.error(e);
      res.status(500).send(e.message);
    }
  }
}

module.exports = RatingsController;
