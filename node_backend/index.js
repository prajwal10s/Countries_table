const express = require("express");
const PORT = 3000;

const app = express();
const csv = require("csv-parser");
const fs = require("fs");
const results = [];

function readCountries() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream("countries.csv")
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
}

function sortCountries(countries, order, field) {
  return countries.sort((a, b) => {
    try {
      if (order === "asc") {
        return a[field] - b[field];
      } else if (order === "desc") {
        return b[field] - a[field];
      } else {
        throw Error;
      }
    } catch (error) {
      res.status(500).json({ message: "Order incorrect" });
    }
  });
}

app.get("/api/countries", async (req, res) => {
  try {
    const countries = await readCountries();
    const countriesToShow = countries.slice(0, 10);
    const sortedCountries = sortCountries(
      countriesToShow,
      "desc",
      "Population"
    );
    res.json({
      total: countries.length,
      data: countriesToShow,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port : ${PORT}`);
});
