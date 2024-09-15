const express = require("express");
const PORT = 3000;
const app = express();
const {
  sortCountries,
  readCountries,
  filterByCondition,
} = require("./Controllers/countries");
const cors = require("cors");

app.use(cors());
app.get("/api/countries", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const rowsPerPage = parseInt(req.query.rowsPerPage) || 10;

    const sortField = req.query.sortField || "Country Name";
    const sortOrder = req.query.sortOrder || "asc";
    const condition = req.query.condition || "";
    const startInd = (page - 1) * rowsPerPage;
    const endInd = page * rowsPerPage;

    const countries = await readCountries();

    let sortedCountries = sortCountries(countries, sortOrder, sortField);
    console.log(sortedCountries);
    if (condition) {
      sortedCountries = filterByCondition(sortedCountries, condition);
      if (!sortedCountries)
        throw new Error(
          "There was an error while filtering data using condition"
        );
    }
    console.log(sortedCountries);
    const countriesToShow = sortedCountries.slice(startInd, endInd);

    res.json({
      page,
      rowsPerPage,
      total: countries.length,
      totalPages: Math.ceil(countries.length / rowsPerPage),
      data: countriesToShow,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port : ${PORT}`);
});
