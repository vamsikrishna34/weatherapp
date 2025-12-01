export function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const body = document.body;

  // Load saved theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    toggleBtn.textContent = '☀️';
    toggleBtn.setAttribute('aria-label', 'Switch to light mode');
  }

  toggleBtn.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    toggleBtn.textContent = isDark ? '☀️' : '🌙';
    toggleBtn.setAttribute(
      'aria-label',
      isDark ? 'Switch to light mode' : 'Switch to dark mode'
    );
  });
}

export function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function formatTemp(temp) {
  return Math.round(temp);
}