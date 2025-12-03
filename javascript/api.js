
const API_KEY = 'c0f60080e1454828b18200447250312'; 
const BASE_URL = 'https://api.weatherapi.com/v1';  

export async function fetchWeather(query) {
  
  const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(query)}&days=5&aqi=no`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const message = errData.error?.message || `Failed to fetch weather for "${query}"`;
      throw new Error(message);
    }

    const data = await res.json();
    
    return data;
  } catch (err) {
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
        
        const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=1&aqi=no`;

        try {
          const res = await fetch(url);
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error?.message || 'Weather data unavailable for your location.');
          }
          const data = await res.json();
          resolve(data.location.name);
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