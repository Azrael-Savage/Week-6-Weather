
// JavaScript
const apiKey = 'a70e1977d76881ccd4382b91bdd211db';
const searchForm = document.querySelector('#search-form');
const cityInput = document.querySelector('#city-input');
const currentWeather = document.querySelector('#current-weather');
const fiveDayWeather = document.querySelector('#five-Day-Forecast');

// Get the user's current location and show the weather for that location on page load
navigator.geolocation.getCurrentPosition(position => {
  const lat = position.coords.latitude;
  const long = position.coords.longitude;
  
  // Fetch current weather data for the user's location from the API
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      // Display the current weather data on the dashboard
      const cityName = data.name;
      const date = new Date().toLocaleDateString();
      const temperature = `${data.main.temp}°C`;
      const humidity = `${data.main.humidity}%`;
      const windSpeed = `${data.wind.speed} m/s`;
      
      currentWeather.innerHTML = `
        <h2>${cityName} (${date})</h2>
        <p>Temperature: ${temperature}</p>
        <p>Humidity: ${humidity}</p>
        <p>Wind Speed: ${windSpeed}</p>
      `;
      
      // Fetch the five-day forecast data for the user's location from the API
      getFiveDayForecast(lat, long, cityName);
    })
    .catch(error => console.error(error));
});

// Handle form submission to show weather for a user-specified city
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const city = cityInput.value;

  // Fetch current weather data for the city from the API
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      // Display the current weather data on the dashboard
      const cityName = data.name;
      const date = new Date().toLocaleDateString();
      const temperature = `${data.main.temp}°C`;
      const humidity = `${data.main.humidity}%`;
      const windSpeed = `${data.wind.speed} m/s`;
      
      currentWeather.innerHTML = `
        <h2>${cityName} (${date})</h2>
        <p>Temperature: ${temperature}</p>
        <p>Humidity: ${humidity}</p>
        <p>Wind Speed: ${windSpeed}</p>
      `;
     
      console.log(data)
      getFiveDayForecast(data.coord.lat,data.coord.lon,cityName);
    })
    .catch(error => console.error(error));
});

// Fetch the five-day forecast data for the specified location from the API
// Fetch the five-day forecast data for the specified location from the API
function getFiveDayForecast(lat, long, cityName) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      console.log(data);

      // Create an array to store the forecast data for each of the next 5 days
      const forecasts = [];

      // Loop through the data and extract the forecast for each of the next 5 days
      for (let i = 0; i < data.list.length; i++) {
        const forecast = data.list[i];
        const forecastDate = new Date(forecast.dt_txt).toLocaleDateString();

        // Check if the forecast date is one of the next 5 days
        if (forecasts.length < 5 && forecastDate !== forecasts[forecasts.length - 1]?.date) {
          forecasts.push({
            date: forecastDate,
            temperature: `${forecast.main.temp}°C`,
            humidity: `${forecast.main.humidity}%`,
            windSpeed: `${forecast.wind.speed} m/s`,
            icon: forecast.weather[0].icon
          });
        }
      }

      // Render a forecast card for each of the next 5 days
      let html = '';
      for (const forecast of forecasts) {
        html += `
          <div class="card">
            <h3>${cityName} (${forecast.date})</h3>
            <img src="https://openweathermap.org/img/w/${forecast.icon}.png" alt="weather icon">
            <p>Temperature: ${forecast.temperature}</p>
            <p>Humidity: ${forecast.humidity}</p>
            <p>Wind Speed: ${forecast.windSpeed}</p>
          </div>
        `;
      }

      fiveDayWeather.innerHTML = html;
    })
    .catch(error => console.error(error));
}
