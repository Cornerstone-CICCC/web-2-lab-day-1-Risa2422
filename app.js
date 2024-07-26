const form = document.querySelector(".form-weather");
const cityName = document.querySelector("#cityname");

let latitude, longitude;
let newArray = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();

  GetCityData(cityName.value)
    .then((newArray) => {
      GetWeatherData(newArray).then((data) => {
        SetDisplayData(data);
      });
    })
    .catch((e) => {
      console.log("something went wrong.");
    });
});

// get a city data
async function GetCityData(city) {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
    );
    const data = await response.json();

    console.log(data);

    // country
    const country = document.querySelector(".country");
    country.textContent = data.results[0].country;

    // Population
    const population = document.querySelector(".population");
    population.textContent = data.results[0].population;

    latitude = data.results[0].latitude;
    longitude = data.results[0].longitude;

    newArray.push(latitude);
    newArray.push(longitude);

    return newArray;
  } catch (e) {
    console.log(e);
  }
}

// get a weather data
async function GetWeatherData(newArray) {
  try {
    latitude = newArray[0];
    longitude = newArray[1];
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,rain,showers&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`
    );
    const data = await response.json();
    return data;
  } catch (e) {
    console.log(e);
  }
}

// set data
function SetDisplayData(data) {
  console.log(data);

  // city name
  const targetCity = document.querySelector(".cityname");
  targetCity.textContent = cityName.value;

  // tempature
  const tempature = document.querySelector(".tempature");
  tempature.textContent = data.current.temperature_2m;

  // tempature unit
  const tempatureUnit = document.querySelector(".tempature-unit");
  tempatureUnit.textContent = data.current_units.temperature_2m;

  // Timezone
  const timezone = document.querySelector(".timezone");
  timezone.textContent = data.timezone;

  // forecastLow
  const forecastLow = document.querySelector(".forecast-low");
  forecastLow.textContent = data.daily.temperature_2m_min;

  // forecastMax
  const forecastMax = document.querySelector(".forecast-max");
  forecastMax.textContent = data.daily.temperature_2m_max;

  // background image
  const city = document.querySelector(".city");
  if (data.current.is_day === 1) {
    city.style.backgroundImage = "url(./images/day.jpg)";
  } else {
    city.style.backgroundImage = "url(./images/night.jpg)";
  }
}
