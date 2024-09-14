const express = require("express");
const PORT = 3000;

const app = express();
const csv = require("csv-parser");
const fs = require("fs");
const results = [];

fs.createReadStream("countries.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", () => {
    console.log(results);
  });

app.listen(PORT, () => {
  console.log(`Server listening on port : ${PORT}`);
});
