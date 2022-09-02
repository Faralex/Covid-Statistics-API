const list = document.querySelector("#result");
const filter = document.querySelector("#filter");
const stats = document.querySelector("#stats");

const listItems = [];

const API_KEY = process.env.API;

filter.addEventListener("input", (e) => {
  filterData(e.target.value);
});

function classRemove(value, className) {
  value.map((val) => {
    val.classList.remove(className);
  });
}

function filterData(searchTerm) {
  listItems.forEach((item) => {
    if (item.innerText.toLowerCase().includes(searchTerm.toLowerCase())) {
      item.classList.remove("hide");
    } else {
      item.classList.add("hide");
    }
  });
}

const getData = async (url, host) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      "X-RapidAPI-Key": API_KEY,
      "X-RapidAPI-Host": host,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

const runApi = async () => {
  // GET COUNTRIES DATA
  const countryNames = await getData(
    "https://covid-193.p.rapidapi.com/countries",
    "covid-193.p.rapidapi.com"
  );
  result.innerHTML = "";
  // UPDATE UI WITH DATA
  countryNames.response.map((country) => {
    const li = document.createElement("li");
    li.classList.add("country-list__item");
    listItems.push(li);
    li.innerHTML = `
        <div class ="country-info">
      <h4>${country}</h4>
        </div>
        `;
    list.appendChild(li);
  });
  const resultLi = [...document.querySelectorAll(".country-list__item")];

  resultLi.map((result) => {
    result.addEventListener("click", (e) => {
      classRemove(resultLi, "activeRed");
      result.classList.toggle("activeRed");

      getStats(e.target.innerText);
    });
  });
};
runApi();

async function getStats(value) {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": API_KEY,
      "X-RapidAPI-Host": "covid-19-coronavirus-statistics.p.rapidapi.com",
    },
  };
  // GET STATS DATA
  await fetch(
    `https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/total?country=${value}`,
    options
  )
    .then((response) => response.json())
    // UPDATE UI WITH STATS DATA
    .then(
      (response) =>
        (stats.innerHTML = `
        <h1>Statistics for ${response.data.location}:</h1>
    <h2>Confirmed cases: ${response.data.confirmed}</h2>
    <h3>Deaths: ${response.data.deaths}</h3>
    <h4>Last Checked: ${response.data.lastChecked}</h4>
    <h4>Last reported: ${response.data.lastReported}</h4>
    `)
    )
    .catch((err) => console.error(err));
}
