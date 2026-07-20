import Reveal from '../node_modules/reveal.js/dist/reveal.mjs';
import RevealMenu from '../node_modules/reveal.js-menu/plugin.js';

// Global confidentiality level for the complete deck.
// Valid values: SEC0, SEC1, SEC2, SEC2a, SEC3.
const CONFIDENTIALITY_LEVEL = 'SEC1';

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

const CONFIDENTIALITY_PATCHES = {
  SEC0: {
    compact: 'assets/icons/security-patches/SEC0-company-public.svg',
    full: 'assets/icons/security-patches/SEC0-company-public.svg'
  },
  SEC1: {
    compact: 'assets/icons/security-patches/SEC1-company-confidential.svg',
    full: 'assets/icons/security-patches/SEC1-company-confidential-full.svg'
  },
  SEC2: {
    compact: 'assets/icons/security-patches/SEC2-company-restricted.svg',
    full: 'assets/icons/security-patches/SEC2-company-restricted.svg'
  },
  SEC2a: {
    compact: 'assets/icons/security-patches/SEC2a-customer-restricted.svg',
    full: 'assets/icons/security-patches/SEC2a-customer-restricted.svg'
  },
  SEC3: {
    compact: 'assets/icons/security-patches/SEC3-company-sensitive.svg',
    full: 'assets/icons/security-patches/SEC3-company-sensitive.svg'
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
  autoAnimate: true,
  autoAnimateDuration: 0.85,
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
    loadIcons: true,
    custom: [
      {
        title: 'Theme',
        icon: '<i class="fas fa-adjust"></i>',
        content:
          '<div class="menu-theme-panel">' +
          '<p>Presentation theme</p>' +
          '<button type="button" class="menu-theme-toggle">Switch theme</button>' +
          '<p class="menu-theme-hint">Shortcut: T</p>' +
          '</div>'
      }
    ]
  },
  plugins: [RevealMenu]
});

deck.initialize();

const root = document.documentElement;
const toggle = document.querySelector('.theme-toggle');
const reveal = document.querySelector('.reveal');
let brandingLayer;
let capgeminiLogo;
let confidentialityPatch;
let cicdLeaderLines = [];

function getConfidentialityPatch() {
  return CONFIDENTIALITY_PATCHES[CONFIDENTIALITY_LEVEL] || CONFIDENTIALITY_PATCHES.SEC1;
}

function ensureBrandingLayer() {
  if (brandingLayer) return;

  brandingLayer = document.createElement('div');
  brandingLayer.className = 'slide-background-branding';
  brandingLayer.setAttribute('aria-hidden', 'true');

  capgeminiLogo = document.createElement('img');
  capgeminiLogo.className = 'background-branding-logo';
  capgeminiLogo.alt = '';
  capgeminiLogo.decoding = 'async';
  capgeminiLogo.loading = 'eager';

  confidentialityPatch = document.createElement('img');
  confidentialityPatch.className = 'background-confidentiality-patch';
  confidentialityPatch.alt = '';
  confidentialityPatch.decoding = 'async';
  confidentialityPatch.loading = 'eager';

  brandingLayer.append(capgeminiLogo, confidentialityPatch);
  reveal?.appendChild(brandingLayer);
}

function updateMenuThemeButton(theme) {
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  document.querySelectorAll('.menu-theme-toggle').forEach((button) => {
    button.textContent = `Switch to ${nextTheme} mode`;
    button.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
  });
}

function updateBranding() {
  ensureBrandingLayer();

  const theme = root.dataset.theme === 'light' ? 'light' : 'dark';
  const currentSlide = document.querySelector('.reveal .slides > section.present') || deck.getCurrentSlide();
  const isTitle = currentSlide?.classList.contains('title-slide');
  const capgeminiVariant = isTitle ? 'full' : 'spade';
  const patchVariant = isTitle ? 'full' : 'compact';
  const patch = getConfidentialityPatch();

  brandingLayer.classList.toggle('is-title-slide', Boolean(isTitle));
  brandingLayer.classList.toggle('is-content-slide', !isTitle);
  capgeminiLogo.className = `background-branding-logo background-branding-logo--${capgeminiVariant}`;
  capgeminiLogo.src = CAPGEMINI_LOGOS[theme][capgeminiVariant];
  confidentialityPatch.className = `background-confidentiality-patch background-confidentiality-patch--${patchVariant}`;
  confidentialityPatch.src = patch[patchVariant];
}

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem('tech-talks-theme', theme);
  if (toggle) {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    toggle.textContent = theme === 'dark' ? '☀' : '☾';
    toggle.setAttribute('aria-label', `Switch to ${nextTheme} theme`);
    toggle.setAttribute('title', `Switch to ${nextTheme} theme`);
  }
  updateMenuThemeButton(theme);
  updateBranding();
  requestCicdLeaderLineUpdate();
}

function clearCicdLeaderLines() {
  cicdLeaderLines.forEach((line) => line.remove());
  cicdLeaderLines = [];
}

function getCicdLineColor() {
  return root.dataset.theme === 'light' ? '#000000' : '#ffffff';
}

function renderCicdLeaderLines() {
  clearCicdLeaderLines();

  const currentSlide = deck.getCurrentSlide();
  if (!currentSlide?.classList.contains('cicd-antipattern-slide') || !window.LeaderLine) return;

  const ids = [
    'pipeline-source-anchor',
    'pipeline-step-1',
    'pipeline-step-2',
    'pipeline-step-3',
    'pipeline-step-4',
    'pipeline-step-5',
    'pipeline-registry-anchor'
  ];
  const anchors = ids.map((id) => currentSlide.querySelector(`#${id}`));
  if (anchors.some((anchor) => !anchor)) return;

  const color = getCicdLineColor();
  for (let index = 0; index < anchors.length - 1; index += 1) {
    cicdLeaderLines.push(new window.LeaderLine(anchors[index], anchors[index + 1], {
      path: 'straight',
      startSocket: 'right',
      endSocket: 'left',
      startPlug: 'behind',
      endPlug: 'arrow3',
      color,
      size: 5,
      endPlugSize: 1.9,
      outline: true,
      outlineColor: root.dataset.theme === 'light' ? 'rgba(255, 255, 255, 0.72)' : 'rgba(18, 26, 56, 0.9)',
      outlineSize: 0.36
    }));
  }
}

function requestCicdLeaderLineUpdate() {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(renderCicdLeaderLines);
  });
}

function toggleTheme() {
  setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
}

setTheme(localStorage.getItem('tech-talks-theme') || root.dataset.theme || 'dark');
deck.on('ready', () => {
  updateBranding();
  requestCicdLeaderLineUpdate();
});
deck.on('slidechanged', () => {
  updateBranding();
  requestCicdLeaderLineUpdate();
});
deck.on('resize', requestCicdLeaderLineUpdate);
deck.on('overviewshown', clearCicdLeaderLines);
deck.on('overviewhidden', requestCicdLeaderLineUpdate);
window.addEventListener('resize', requestCicdLeaderLineUpdate);
document.addEventListener('menu-ready', () => updateMenuThemeButton(root.dataset.theme || 'dark'));
document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : event.target?.parentElement;
  if (target?.closest('.menu-theme-toggle')) {
    toggleTheme();
  }
});

toggle?.addEventListener('click', toggleTheme);
window.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 't' && !event.metaKey && !event.ctrlKey && !event.altKey) {
    toggleTheme();
  }
});
