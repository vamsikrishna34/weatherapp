import { API_KEY, BASE_URL } from '../lib/config.js';

export async function fetchWeather(query) {
  const currentUrl = `$https://api.openweathermap.org/data/2.5}/weather?q=${encodeURIComponent(query)}&appid=$e2a943dcd1eec04298f5473fd704a3a4b&units=metric`;
  const forecastUrl = `$https://api.openweathermap.org/data/2.5}/forecast?q=${encodeURIComponent(query)}&appid=$e2a943dcd1eec04298f5473fd704a3a4&units=metric`;

  const [currentRes, forecastRes] = await Promise.all([
    fetch(currentUrl),
    fetch(forecastUrl)
  ]);

  if (!currentRes.ok) {
    const errData = await currentRes.json().catch(() => ({}));
    throw new Error(errData.message || `Failed to fetch weather for "${query}"`);
  }

  const current = await currentRes.json();
  const forecast = await forecastRes.json();

  return { current, forecast };
}

export async function geolocateAndSearch() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const url = `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to get location weather');
        const data = await res.json();
        resolve(data.name); // e.g., "Chicago"
      },
      (err) => {
        reject(new Error('Location access denied or unavailable'));
      },
      { timeout: 10000 }
    );
  });
}