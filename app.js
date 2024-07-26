const form = document.querySelector(".form-weather");
const cityName = document.querySelector("#cityname");

let latitude, longitude;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const countryData = await GetCityData(cityName.value);
  latitude = countryData.results[0].latitude;
  longitude = countryData.results[0].longitude;

  const weatherData = await GetWeatherData(latitude, longitude);
  SetDisplayData(countryData, weatherData);
});

// get a city data
async function GetCityData(city) {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
    );
    const data = await response.json();

    return data;
  } catch (e) {
    console.log(e);
  }
}

// get a weather data
async function GetWeatherData(latitude, longitude) {
  try {
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
function SetDisplayData(countryData, weatherData) {
  document.querySelector("tbody").style.display = "block";

  // country
  const country = document.querySelector(".country");
  country.textContent = countryData.results[0].country;

  // Population
  const population = document.querySelector(".population");
  population.textContent = countryData.results[0].population;

  // city name
  const targetCity = document.querySelector(".cityname");
  targetCity.textContent = cityName.value;

  // tempature
  const tempature = document.querySelector(".tempature");
  tempature.textContent = weatherData.current.temperature_2m;
  tempature.textContent = `${weatherData.current.temperature_2m} ${weatherData.current_units.temperature_2m}`;

  // Timezone
  const timezone = document.querySelector(".timezone");
  timezone.textContent = weatherData.timezone;

  // forecastLow
  const forecastLow = document.querySelector(".forecast-low");
  forecastLow.textContent = `Low :${weatherData.daily.temperature_2m_min} ${weatherData.current_units.temperature_2m}`;

  // forecastMax
  const forecastMax = document.querySelector(".forecast-max");
  forecastMax.textContent = `Max :${weatherData.daily.temperature_2m_max} ${weatherData.current_units.temperature_2m}`;

  // background image
  const city = document.querySelector(".city");
  city.style.backgroundSize = "cover";
  city.style.backgroundPosition = " 0 30%";

  if (weatherData.current.is_day === 1) {
    city.style.backgroundImage = "url(./images/day.jpg)";
  } else {
    city.style.backgroundImage = "url(./images/night.jpg)";
    targetCity.style.color = "white";
    tempature.style.color = "white";
  }
}
