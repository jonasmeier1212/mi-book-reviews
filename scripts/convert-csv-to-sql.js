const fs = require("fs");
const CsvReader = require("csv-reader");

const args = process.argv.slice(2);

if (args.length !== 2) {
  console.error("usage: node convert-csv-to-sql.js nameofinput.csv nameofoutput.sql");
  process.exit(1);
}

const inputStream = fs.createReadStream(args[0], "utf8");
let output = `DELETE FROM books;
INSERT INTO books (isbn, title, author, year) VALUES \n`;

inputStream
  .pipe(CsvReader({ parseNumbers: true, parseBooleans: true, trim: true, skipHeader: true }))
  .on("data", row => {
    // console.log("Row arrived", row);
    const isbn = row[0];
    // Escape single quotes
    // Use regex with global flag to replace more then one singlequote in a string
    const title = row[1].replace(/'/g, "''");
    const author = row[2].replace(/'/g, "''");
    const year = row[3];
    output += `('${isbn}','${title}','${author}',${year}),\n`;
  })
  .on("end", data => {
    console.log("Finished reading");
    output = output.substr(0, output.length - 2);
    output += ";\n";
    fs.writeFileSync(args[1], output);
    console.log("Finished writing");
  });
