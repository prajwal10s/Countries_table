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
function filterByCondition(data, condition) {
  const filters = condition.split(" "); //as we can have multiple filters
  filters.forEach((filter) => {
    const [filterCond, value] = filter.split(":");
    const [field, condn] = filterCond.split("."); //this is for countryName.lt:100 type of conditions
    const regexValue = new RegExp(value, "i");
    let fieldName = "";
    //our regex is case insensitive
    if (field === "CountryName") fieldName = "Country Name";
    else if (field === "Capital") fieldName = "Capital City";
    else if (field === "TimeZone") fieldName = "Time Zone";
    else if (field === "population") fieldName = "Population";
    switch (condn) {
      case "regex":
        data = data.filter((country) => regexValue.test(country[fieldName]));
        break;
      case "gt":
        data = data.filter(
          (country) => parseInt(country[fieldName], 10) > parseInt(value, 10)
        );
        break;
      case "lt":
        data = data.filter(
          (country) => parseInt(country[fieldName], 10) < parseInt(value, 10)
        );
        break;
      case "eq":
        data = data.filter((country) => country[fieldName] == value);
        break;
      default:
        data = data.filter((country) => country[fieldName] == value);
    }
  });
  return data;
}

module.exports = {
  readCountries,
  sortCountries,
  filterByCondition,
};
