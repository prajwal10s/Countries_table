const results = [];
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../countries.csv");
function readCountries() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
}

function sortCountries(countries, order, field) {
  return countries.sort((a, b) => {
    if (order === "asc") {
      if (!isNaN(a[field]) && !isNaN(b[field])) return a[field] - b[field];
      else return a[field].localeCompare(b[field]);
    } else {
      if (!isNaN(a[field]) && !isNaN(b[field])) return b[field] - a[field];
      else return b[field].localeCompare(a[field]);
    }
  });
}

module.exports = {
  readCountries,
  sortCountries,
};
