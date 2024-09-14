const express = require("express");
const PORT = 3000;
const app = express();
const { sortCountries, readCountries } = require("./Controllers/countries");

app.get("/api/countries", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const rows = parseInt(req.query.rows) || 10;

    const sortField = req.query.sortField || "Country Name";
    const sortOrder = req.query.sortOrder || "asc";

    const startInd = (page - 1) * rows;
    const endInd = page * rows;

    const countries = await readCountries();
    const sortedCountries = sortCountries(countries, sortOrder, sortField);

    const countriesToShow = sortedCountries.slice(startInd, endInd);

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
