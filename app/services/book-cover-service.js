const googleBooks = require("google-books-search");

async function getCoverForBook(title) {
  return new Promise((resolve, reject) => {
    googleBooks.search(title, (error, results) => {
      if (error) reject(error);
      if (results.length > 0) {
        resolve(results[0].thumbnail);
      } else {
        resolve(null);
      }
    });
  });
}

exports.getCoverForBook = getCoverForBook;
