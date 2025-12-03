import { fetchWeather, geolocateAndSearch } from './api.js';
import { formatDate, formatTemp } from './utils.js';

export function setupEventListeners() {
  const searchBtn = document.getElementById('search-btn');
  const input = document.getElementById('location-input');
  const geoBtn = document.getElementById('geolocate-btn');

  searchBtn.addEventListener('click', handleSearch);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });
  geoBtn.addEventListener('click', handleGeolocate);
}



function showLoading() {
  document.getElementById('loading').classList.remove('hidden');
  document.getElementById('error').classList.add('hidden');
  document.getElementById('current-weather').classList.add('hidden');
  document.getElementById('forecast').classList.add('hidden');
}

function hideLoading() {
  document.getElementById('loading').classList.add('hidden');
}

function showError(message) {
  const errorEl = document.getElementById('error');
  errorEl.textContent = message;
  errorEl.classList.remove('hidden');
}


function renderWeather(data) {
  const { current, forecast } = data; 

  // Current weather
  document.getElementById('city-name').textContent = `${current.name}, ${current.sys.country}`;
  document.getElementById('temp').textContent = formatTemp(current.main.temp);
  document.getElementById('description').textContent = current.weather[0].description;
  document.getElementById('humidity').textContent = `${current.main.humidity}%`;
  document.getElementById('wind').textContent = `${current.wind.speed} m/s`;
  document.getElementById('feels-like').textContent = `${formatTemp(current.main.feels_like)}°C`;

  const iconCode = current.weather[0].icon;
  const iconEl = document.getElementById('weather-icon');
  iconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  iconEl.alt = current.weather[0].description;
  iconEl.style.display = 'inline';

  // Show sections
  document.getElementById('current-weather').classList.remove('hidden');
  document.getElementById('forecast').classList.remove('hidden');

  renderForecast(forecast);
}

function renderForecast(forecast) {
  const container = document.getElementById('forecast-cards');
  container.innerHTML = '';

  const daily = [];
  const seenDays = new Set();

  for (const item of forecast.list) {
    const date = new Date(item.dt * 1000);
    const day = date.toDateString();
    if (!seenDays.has(day) && date.getHours() >= 10 && date.getHours() <= 14) {
      daily.push(item);
      seenDays.add(day);
      if (daily.length === 5) break;
    }
  }

  daily.forEach(item => {
    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.innerHTML = `
      <div class="day">${formatDate(item.dt)}</div>
      <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" 
           alt="${item.weather[0].description}" 
           class="weather-icon">
      <div class="temps">
        <span class="high">${formatTemp(item.main.temp_max)}°</span>
        <span class="low">${formatTemp(item.main.temp_min)}°</span>
      </div>
    `;
    container.appendChild(card);
  });
}