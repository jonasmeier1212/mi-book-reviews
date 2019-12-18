const express = require("express");
const { check, validationResult, sanitizeBody } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

class UsersController {
  constructor() {
    this.router = express.Router();

    // Login
    this.router.get("/login", (req, res) => {
      res.render("login");
    });
    this.router.post(
      "/login",
      [
        check("username")
          .isString()
          .not()
          .isEmpty(),
        check("password").isLength({ min: 7, max: 72 }),
        sanitizeBody("username")
          .trim()
          .escape()
      ],
      this.login
    );

    // Signup
    this.router.get("/signup", (req, res) => {
      res.render("signup");
    });
    this.router.post(
      "/signup",
      [
        check("username")
          .isString()
          .not()
          .isEmpty(),
        check("email").isEmail(),
        check("password").isLength({ min: 7, max: 72 }),
        sanitizeBody("username")
          .trim()
          .escape(),
        sanitizeBody("email").trim()
      ],
      this.signup
    );
  }

  async login(req, res) {
    try {
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        console.log("Found validation errors", validationErrors);
        return res.render("login", {
          errors: validationErrors.array().map(err => err.msg)
        });
      }

      const user = await User.findByUsername(req.body.username);

      if (!user) {
        return res.status(404).render("login", {
          errors: ["Benutzer nicht gefunden!"]
        });
      }

      if (!(await bcrypt.compare(req.body.password, user.password))) {
        return res.status(400).render("login", {
          errors: ["Passwort ist ungültig!"]
        });
      }

      req.session.user_id = user.id;
      req.session.cookie.maxAge = 31556952000; // One year

      return res.redirect("/");
    } catch (e) {
      return res.status(500).send(e.message);
    }
  }

  async signup(req, res) {
    try {
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        return res.render("signup", {
          errors: validationErrors.array().map(err => err.msg)
        });
      }

      const password = req.body.password;
      const confirmPassword = req.body.confirmPassword;

      if (password !== confirmPassword) {
        return res.render("signup", {
          errors: ["Passwörter stimmen nicht überein!"]
        });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 12);

      try {
        let user = await User.findByUsername(req.body.username);
        if (user) {
          throw new Error("Username already taken!");
        }

        user = await User.create({
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword
        });

        req.session.user_id = user.id;
        req.session.cookie.maxAge = 31556952000; // One year
      } catch (e) {
        return res.render("signup", {
          errors: [e.message]
        });
      }

      return res.redirect("/");
    } catch (e) {
      return res.status(500).send(e.message);
    }
  }
}

module.exports = UsersController;
