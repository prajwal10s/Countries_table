let currentPage = 1;
let totalPages = 1;
let currentSortField = "name";
let currentSortOrder = "asc";
const apiUrl = "http://localhost:3000/api/countries";

// This function is used to pull parameters from our query
//to avoid reuse
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Function to update our URL without reloading the page
function updateUrl(page, sortField, sortOrder) {
  const url = new URL(window.location.href);
  url.searchParams.set("page", page);
  url.searchParams.set("sortField", sortField);
  url.searchParams.set("sortOrder", sortOrder);
  window.history.pushState({}, "", url);
}

// get countries from our API using the params mentioned in our query or from the form
//we have to get data from the query
function fetchCountries(page = 1) {
  currSortField =
    getQueryParam("sortField") || document.getElementById("sortField").value;

  currSortOrder =
    getQueryParam("sortOrder") || document.getElementById("sortOrder").value;

  currPage = page;

  currRowsPerPage =
    getQueryParam("rowsPerPage") ||
    document.getElementById("rowsPerPage").value;

  // Make the API call with current page, sort field, and sort order
  fetch(
    `${apiUrl}?page=${page}&rowsPerPage=${currRowsPerPage}&sortField=${currSortField}&sortOrder=${currSortOrder}`
  )
    .then((response) => response.json())
    .then((data) => {
      currPage = data.page;
      totalPages = data.totalPages;
      console.log(data);

      // Add the list of countries to the page
      const countriesList = document.getElementById("countries-list");
      let countriesHtml = '<ul class="list-group">';
      data.data.forEach((country) => {
        let countryName = country["Country name"];
        let capCity = country["Capital City"];
        let timeZone = country["Time Zome"];
        let populatn = country["Population"];
        countriesHtml += `<li class="list-group-item">${countryName} (Code: ${country.code}, Population: ${country.population})</li>`;
      });
      countriesHtml += "</ul>";
      countriesList.innerHTML = countriesHtml;

      // Update URL with new state
      updateUrl(currentPage, currentSortField, currentSortOrder);
    })
    .catch((error) => console.log("Error:", error));
}

// Apply the sorting and then we fetch
function applySorting() {
  const sortField = document.getElementById("sortField").value;
  const sortOrder = document.getElementById("sortOrder").value;
  //if we change sorting value we fetch the page 1 again
  fetchCountries(1);
}

//for previous button and we make an API call here after changing the parametes
function prevPage() {
  if (currentPage > 1) {
    fetchCountries(currentPage - 1);
  }
}

//for next button and we make an API call here after changing the paramters
function nextPage() {
  if (currentPage < totalPages) {
    fetchCountries(currentPage + 1);
  }
}

// Running on page page load
window.onload = function () {
  const page = parseInt(getQueryParam("page")) || 1;
  const sortField = getQueryParam("sortField") || "Country Name"; //sort based on country name
  const sortOrder = getQueryParam("sortOrder") || "asc";
  const rowsPerPage = getQueryParam("rowsPerPage") || 10;
  document.getElementById("sortField").value = sortField;
  document.getElementById("sortOrder").value = sortOrder;
  document.getElementById("rowsPerPage").value = rowsPerPage;
  fetchCountries(page);
};
