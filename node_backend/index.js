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
    let condition = req.query.condition || "";

    let countries = await readCountries();
    condition = condition.trim();
    if (condition) {
      countries = filterByCondition(countries, condition);
      if (!countries.length) {
        return res.json({
          page,
          rowsPerPage,
          total: 0,
          totalPages: 1,
          data: [],
        });
      }
    }
    let sortedCountries = sortCountries(countries, sortOrder, sortField);
    const startInd = (page - 1) * rowsPerPage;
    const endInd = page * rowsPerPage;

    const countriesToShow = sortedCountries.slice(startInd, endInd);
    res.json({
      page,
      rowsPerPage,
      total: sortedCountries.length,
      totalPages: Math.ceil(sortedCountries.length / rowsPerPage),
      data: countriesToShow,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port : ${PORT}`);
});
