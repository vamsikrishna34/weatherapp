

const API_KEY = '439d4b80d52c420a979163e16c877e4b'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function fetchWeather(query) {
  const currentUrl = `${BASE_URL}/weather?q=${encodeURIComponent(query)}&appid=${API_KEY}&units=metric`;
  const forecastUrl = `${BASE_URL}/forecast?q=${encodeURIComponent(query)}&appid=${API_KEY}&units=metric`;

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl)
    ]);

    if (!currentRes.ok) {
      const errData = await currentRes.json().catch(() => ({}));
      throw new Error(errData.message || `City not found. Try: London, Tokyo, Chicago.`);
    }

    const current = await currentRes.json();
    const forecast = await forecastRes.json();

    return { current, forecast };
  } catch (err) {
    // Handle network errors (e.g., offline)
    if (err.name === 'TypeError') {
      throw new Error('Network error. Check your internet connection.');
    }
    throw err;
  }
}

export async function geolocateAndSearch() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // ✅ Use BASE_URL and API_KEY (not hardcoded)
        const url = `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
        
        try {
          const res = await fetch(url);
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Weather data unavailable for your location.');
          }
          const data = await res.json();
          resolve(data.name); // e.g., "Chicago"
        } catch (err) {
          reject(err.message || 'Failed to fetch location-based weather.');
        }
      },
      () => {
        reject(new Error('Location access denied. Enable location services and try again.'));
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  });
}