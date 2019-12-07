const DB = require("../services/database-service").DB;

class User {
  constructor(username, email, password) {
    this.username = username.toLowerCase();
    this.email = email.toLowerCase();
    this.password = password;
  }

  static async create({ username, email, password }) {
    await DB.query(`INSERT INTO users (username, email, password_hash, created_at, updated_at)
      VALUES ('${username.toLowerCase()}', '${email.toLowerCase()}', '${password}', '${new Date().toISOString()}', '${new Date().toISOString()}')`);
    return new User(username, email, password);
  }

  static async findByUsername(username) {
    const res = await DB.query(`SELECT * FROM users WHERE username LIKE '${username}'`);
    if (res.rowCount === 0) return null;

    if (res.rowCount > 1) {
      console.warn("[Model/User] Found database invalidity! More than one user with username " + username);
    }

    return new User(res.rows[0].username, res.rows[0].email, res.rows[0].password_hash);
  }
}

module.exports = User;
