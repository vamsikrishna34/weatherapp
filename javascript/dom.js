import { fetchWeather, geolocateAndSearch } from './api.js';
import { formatDate, formatTemp } from './utils.js';

export function setupEventListeners() {
  const searchBtn = document.getElementById('search-btn');
  const input = document.getElementById('location-input');
  const geoBtn = document.getElementById('geolocate-btn');

  if (!searchBtn || !input || !geoBtn) {
    console.error('Missing DOM elements. Check IDs in index.html.');
    return;
  }

  searchBtn.addEventListener('click', handleSearch);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });
  geoBtn.addEventListener('click', handleGeolocate);
}

async function handleSearch() {
  const input = document.getElementById('location-input');
  const query = input.value.trim();
  if (!query) {
    showError('Please enter a city name');
    return;
  }
  await performSearch(query);
}

async function handleGeolocate() {
  showLoading();
  try {
    const city = await geolocateAndSearch();
    document.getElementById('location-input').value = city;
    await performSearch(city);
  } catch (err) {
    hideLoading();
    showError(err.message);
  }
}

async function performSearch(query) {
  showLoading();
  try {
    const data = await fetchWeather(query);
    renderWeather(data);
  } catch (err) {
    showError(err.message);
  } finally {
    hideLoading();
  }
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
  const { location, current, forecast } = data;

  // Current weather
  document.getElementById('city-name').textContent = `${location.name}, ${location.country}`;
  document.getElementById('temp').textContent = formatTemp(current.temp_c);
  document.getElementById('description').textContent = current.condition.text.toLowerCase();
  document.getElementById('humidity').textContent = `${current.humidity}%`;
  document.getElementById('wind').textContent = `${current.wind_kph} km/h`;
  document.getElementById('feels-like').textContent = `${formatTemp(current.feelslike_c)}°C`;

  
  const iconEl = document.getElementById('weather-icon');
  iconEl.src = `https:${current.condition.icon}`;
  iconEl.alt = current.condition.text;
  iconEl.style.display = 'inline';

  // Show sections
  document.getElementById('current-weather').classList.remove('hidden');
  document.getElementById('forecast').classList.remove('hidden');

  renderForecast(forecast.forecastday);
}

function renderForecast(dailyList) {
  const container = document.getElementById('forecast-cards');
  container.innerHTML = '';

  
  dailyList.slice(0, 3).forEach(day => {
    const card = document.createElement('div');
    card.className = 'forecast-card';
    
    // Format date: e.g., "Mon"
    const date = new Date(day.date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

    
    card.innerHTML = `
      <div class="day">${dayName}</div>
      <img src="https:${day.day.condition.icon}" 
           alt="${day.day.condition.text}" 
           class="weather-icon">
      <div class="temps">
        <span class="high">${formatTemp(day.day.maxtemp_c)}°</span>
        <span class="low">${formatTemp(day.day.mintemp_c)}°</span>
      </div>
    `;
    container.appendChild(card);
  });
}