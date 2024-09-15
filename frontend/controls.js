let currPage = 1;
let totalPages = 1;
let currentSortField = "Country Name";
let currentSortOrder = "asc";
let currRowsPerPage = 10;
let currentCondition = "";
const apiUrl = "http://localhost:3000/api/countries";

// This function is used to pull parameters from our query
//to avoid reuse
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Function to update our URL without reloading the page
function updateUrl(page, sortField, sortOrder, rowsPerPage) {
  const url = new URL(window.location.href);
  url.searchParams.set("page", page);
  url.searchParams.set("sortField", sortField);
  url.searchParams.set("sortOrder", sortOrder);
  url.searchParams.set("rowsPerPage", rowsPerPage);
  window.history.pushState({}, "", url);
}

//change the button tags accoring to the page you are on
//also change the active tag on the link depending on which page you are on

function displayPageNumberButtons(page) {
  let page1 = document.querySelector("#page1 .page-link");

  let page2 = document.querySelector("#page2 .page-link");

  let page3 = document.querySelector("#page3 .page-link");

  let pageLink1 = document.querySelector("#page1");

  let pageLink2 = document.querySelector("#page2");

  let pageLink3 = document.querySelector("#page3");

  pageLink1.classList.remove("active");
  pageLink2.classList.remove("active");
  pageLink3.classList.remove("active");

  //take care of edge cases
  if (page === 1) {
    page1.innerText = page;
    pageLink1.classList.add("active");
    page2.innerText = page + 1;
    page3.innerText = page + 2;
  } else if (page === totalPages) {
    page1.innerText = page - 2;
    page2.innerText = page - 1;
    page3.innerText = page;
    pageLink3.classList.add("active");
  } else {
    page1.innerText = page - 1;
    page2.innerText = page;
    pageLink2.classList.add("active");
    page3.innerText = page + 1;
  }
}

// get countries from our API using the params mentioned in our query or from the form
//we have to get data from the query
function fetchCountries(page = 1, condition) {
  currentSortField =
    getQueryParam("sortField") || document.getElementById("sortField").value;

  currentSortOrder =
    getQueryParam("sortOrder") || document.getElementById("sortOrder").value;

  currPage = page;
  currentCondition = condition || "";

  displayPageNumberButtons(page);
  currRowsPerPage =
    getQueryParam("rowsPerPage") ||
    document.getElementById("rowsPerPage").value;

  // Make the API call with current page, sort field, and sort order
  fetch(
    `${apiUrl}?page=${currPage}&rowsPerPage=${currRowsPerPage}&sortField=${currentSortField}&sortOrder=${currentSortOrder}&condition=${currentCondition}`
  )
    .then((response) => {
      if (response.status === 200) return response.json();
      else throw new Error("Error while fetching data");
    })
    .then((data) => {
      currPage = data.page;
      totalPages = data.totalPages;
      console.log(data);

      // Add the list of countries to the page
      const countriesList = document.getElementById("countries-list");
      let countriesHtml = `
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Country Name</th>
                                    <th>Capital City</th>
                                    <th>Time Zone</th>
                                    <th>Population</th>
                                </tr>
                            </thead>
                            <tbody>
                            `;

      data.data.forEach((country) => {
        let countryName = country["Country Name"];
        let capCity = country["Capital City"];
        let timeZone = country["Time Zone"];
        let populatn = country["Population"];
        countriesHtml += `
                            <tr>
                                <td>${countryName}</td>
                                <td>${capCity}</td>
                                <td>${timeZone}</td>
                                <td>${populatn}</td>
                            </tr>`;
      });
      countriesHtml += `
                        </tbody>
                        </table>`;

      countriesList.innerHTML = countriesHtml;

      document
        .getElementById("prev-page")
        .classList.toggle("disabled", currPage === 1);
      document
        .getElementById("next-page")
        .classList.toggle("disabled", currPage === totalPages);

      // Update URL with new state
      updateUrl(
        currPage,
        currentSortField,
        currentSortOrder,
        currRowsPerPage,
        currentCondition
      );
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

// Apply the sorting and then we fetch
function applySorting() {
  const sortField = document.getElementById("sortField").value;
  const sortOrder = document.getElementById("sortOrder").value;
  const rowsPerPage = document.getElementById("rowsPerPage").value;
  //if we change sorting value we fetch the page 1 again
  currentSortField = sortField;
  currentSortOrder = sortOrder;
  currRowsPerPage = rowsPerPage;
  updateUrl(currPage, currentSortField, currentSortOrder, currRowsPerPage);
  fetchCountries(1);
}
function firstPage() {
  fetchCountries(1);
}
//for LastPage
function lastPage() {
  fetchCountries(totalPages);
}
//for previous button and we make an API call here after changing the parametes
function prevPage() {
  if (currPage > 1) {
    fetchCountries(currPage - 1);
  }
}
//for next button and we make an API call here after changing the paramters
function nextPage() {
  if (currPage < totalPages) {
    fetchCountries(currPage + 1);
  }
}
function handlePageClick(page) {
  if (currPage === 1) {
    if (page === "second") {
      fetchCountries(currPage + 1);
    } else if (page === "third") {
      fetchCountries(currPage + 2);
    }
  } else if (currPage === totalPages) {
    if (page === "second") fetchCountries(currPage - 1);
    else if (page === "first") fetchCountries(currPage - 2);
  } else {
    if (page === "first") fetchCountries(currPage - 1);
    else if (page === "third") fetchCountries(currPage + 1);
  }
}
function expandSearch() {
  const searchField = document.getElementById("searchField");
  searchField.style.width = "400px"; // Expanded width on focus
}

function collapseSearch() {
  const searchField = document.getElementById("searchField");
  if (!searchField.value) {
    searchField.style.width = "150px"; // Collapse if the field is empty
  }
}
function handleSearch() {
  const condition = document.getElementById("searchField").value.trim();
  console.log(condition);
  // Fetch countries with the search query applied (you can modify this as per your backend API)
  fetchCountries(1, condition);
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
