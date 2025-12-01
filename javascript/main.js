// Entry point — wire up all modules
import { initThemeToggle } from './utils.js';
import { setupEventListeners } from './dom.js';
import { geolocateAndSearch } from './api.js';

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  setupEventListeners();

  // Optional: Auto-fetch if ?city=Chicago in URL
  const urlParams = new URLSearchParams(window.location.search);
  const city = urlParams.get('city');
  if (city) {
    document.getElementById('location-input').value = city;
    document.getElementById('search-btn').click();
  }
});