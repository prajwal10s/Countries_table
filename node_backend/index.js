const express = require("express");
const PORT = 3000;
const app = express();
const { sortCountries, readCountries } = require("./Controllers/countries");

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
