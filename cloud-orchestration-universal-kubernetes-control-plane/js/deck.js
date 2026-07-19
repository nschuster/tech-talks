import Reveal from '../node_modules/reveal.js/dist/reveal.mjs';
import RevealMenu from '../node_modules/reveal.js-menu/plugin.js';

const CAPGEMINI_LOGOS = {
  dark: {
    full: 'assets/logos/Capgemini_Primary_Logo_White.svg',
    spade: 'assets/logos/Capgemini_Primary_Spade_White.svg'
  },
  light: {
    full: 'assets/logos/Capgemini_Primary_Logo_Blue.svg',
    spade: 'assets/logos/Capgemini_Primary_Spade_Blue.svg'
  }
};

const deck = new Reveal({
  hash: true,
  controls: true,
  progress: true,
  center: false,
  width: 1920,
  height: 1080,
  margin: 0.015,
  minScale: 0.2,
  maxScale: 2.5,
  transition: 'slide',
  backgroundTransition: 'fade',
  menu: {
    side: 'left',
    width: 'normal',
    numbers: true,
    titleSelector: 'h1, h2',
    useTextContentForMissingTitles: true,
    hideMissingTitles: false,
    markers: true,
    themes: false,
    transitions: false,
    openButton: true,
    keyboard: true,
    loadIcons: true
  },
  plugins: [RevealMenu]
});

deck.initialize();

const root = document.documentElement;
const toggle = document.querySelector('.theme-toggle');

function ensureCapgeminiLogos() {
  document.querySelectorAll('.reveal .slides > section').forEach((slide) => {
    const isTitle = slide.classList.contains('title-slide');
    const variant = isTitle ? 'full' : 'spade';
    const label = isTitle ? 'Capgemini logo' : 'Capgemini spade logo';
    const existing = slide.querySelector(':scope > .capgemini-slide-logo');
    const logo = existing || document.createElement('img');

    logo.className = `capgemini-slide-logo capgemini-slide-logo--${variant}`;
    logo.alt = label;
    logo.decoding = 'async';
    logo.loading = 'eager';
    logo.dataset.logoVariant = variant;

    if (!existing) {
      slide.appendChild(logo);
    }
  });
}

function updateCapgeminiLogos(theme) {
  const palette = CAPGEMINI_LOGOS[theme] || CAPGEMINI_LOGOS.dark;

  document.querySelectorAll('.capgemini-slide-logo').forEach((logo) => {
    const variant = logo.dataset.logoVariant === 'full' ? 'full' : 'spade';
    logo.src = palette[variant];
  });
}

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem('tech-talks-theme', theme);
  updateCapgeminiLogos(theme);
  if (toggle) {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    toggle.textContent = theme === 'dark' ? '☀' : '☾';
    toggle.setAttribute('aria-label', `Switch to ${nextTheme} theme`);
    toggle.setAttribute('title', `Switch to ${nextTheme} theme`);
  }
}

function toggleTheme() {
  setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
}

ensureCapgeminiLogos();
setTheme(localStorage.getItem('tech-talks-theme') || root.dataset.theme || 'dark');

toggle?.addEventListener('click', toggleTheme);
window.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 't' && !event.metaKey && !event.ctrlKey && !event.altKey) {
    toggleTheme();
  }
});
