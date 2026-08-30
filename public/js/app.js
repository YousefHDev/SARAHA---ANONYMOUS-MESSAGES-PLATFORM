/* ==========================================================================
   SARAHA - CORE JAVASCRIPT UTILITY ENGINE
   Handles Theme persistence, Toast system, API requests, & Auth state
   ========================================================================== */

const API_BASE_URL = '/api/v1';

// Theme Management (Night / Morning mode)
export const initTheme = () => {
  const savedTheme = localStorage.getItem('saraha_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
};

export const toggleTheme = () => {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('saraha_theme', newTheme);
  updateThemeIcon(newTheme);
  showToast(`Switched to ${newTheme === 'dark' ? 'Night 🌙' : 'Morning ☀️'} Mode!`, 'info');
};

const updateThemeIcon = (theme) => {
  const btn = document.getElementById('theme-toggle-btn');
  if (btn) {
    btn.innerHTML = theme === 'dark' ? '🌙' : '☀️';
    btn.setAttribute('title', theme === 'dark' ? 'Switch to Morning Mode' : 'Switch to Night Mode');
  }
};

// Toast Notifications System
export const showToast = (message, type = 'success') => {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const iconMap = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  };

  toast.innerHTML = `
    <span>${iconMap[type] || '🔔'}</span>
    <div>${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

// Auth Storage Helpers
export const getToken = () => localStorage.getItem('saraha_token');
export const setToken = (token) => localStorage.setItem('saraha_token', token);
export const getUser = () => {
  const raw = localStorage.getItem('saraha_user');
  return raw ? JSON.parse(raw) : null;
};
export const setUser = (user) => localStorage.setItem('saraha_user', JSON.stringify(user));

export const logout = () => {
  localStorage.removeItem('saraha_token');
  localStorage.removeItem('saraha_user');
  showToast('Logged out successfully!', 'info');
  setTimeout(() => {
    window.location.href = '/login.html';
  }, 500);
};

// API Fetch Helper
export const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    ...options.headers
  };

  // Add Content-Type if not FormData
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 && !endpoint.includes('/login')) {
        // Token expired or invalid
        logout();
      }
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Dynamic Navbar Renderer
export const renderNavbar = () => {
  const user = getUser();
  const currentPath = window.location.pathname;

  const navMenu = document.getElementById('nav-menu');
  if (!navMenu) return;

  if (user) {
    navMenu.innerHTML = `
      <li><a href="/index.html" class="nav-link ${currentPath.includes('index') ? 'active' : ''}">Home</a></li>
      <li><a href="/dashboard.html" class="nav-link ${currentPath.includes('dashboard') ? 'active' : ''}">Dashboard</a></li>
      <li><a href="/profile.html" class="nav-link ${currentPath.includes('profile') ? 'active' : ''}">Profile</a></li>
      <li><a href="/token-info.html" class="nav-link ${currentPath.includes('token-info') ? 'active' : ''}">Token Info</a></li>
      <li><button id="theme-toggle-btn" class="theme-toggle-btn">🌙</button></li>
      <li><button id="logout-btn" class="btn btn-secondary btn-sm">Logout</button></li>
    `;

    document.getElementById('logout-btn')?.addEventListener('click', logout);
  } else {
    navMenu.innerHTML = `
      <li><a href="/index.html" class="nav-link ${currentPath.includes('index') ? 'active' : ''}">Home</a></li>
      <li><a href="/token-info.html" class="nav-link ${currentPath.includes('token-info') ? 'active' : ''}">What is a Token?</a></li>
      <li><a href="/login.html" class="nav-link ${currentPath.includes('login') ? 'active' : ''}">Login</a></li>
      <li><a href="/signup.html" class="btn btn-primary btn-sm">Get Started</a></li>
      <li><button id="theme-toggle-btn" class="theme-toggle-btn">🌙</button></li>
    `;
  }

  document.getElementById('theme-toggle-btn')?.addEventListener('click', toggleTheme);
  initTheme();
};

// Auto initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
});
