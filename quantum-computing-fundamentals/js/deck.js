import Reveal from '../node_modules/reveal.js/dist/reveal.esm.js';

const CONFIDENTIALITY_LEVEL = 'SEC1';
const EVENT_DETAILS = { event: 'CIS Cyber Frankfurt Team Meeting', date: '30.07.2026' };
const AUTHOR_DETAILS = {
  name: 'Niklas Schuster',
  jobTitle: 'Senior Cloud Solution Architect',
  company: 'Capgemini'
};
const CAPGEMINI_LOGOS = {
  full: 'assets/logos/Capgemini_Primary_Logo_White.svg',
  spade: 'assets/logos/Capgemini_Primary_Spade_White.svg'
};
const CONFIDENTIALITY_PATCHES = {
  SEC1: {
    compact: 'assets/icons/security-patches/SEC1-company-confidential.svg',
    full: 'assets/icons/security-patches/SEC1-company-confidential-full.svg'
  }
};

const deck = new Reveal({
  hash: true,
  controls: true,
  progress: true,
  slideNumber: 'c/t',
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
  navigationMode: 'linear'
});

function blochSvg(kind) {
  const isHadamard = kind === 'hadamard';
  const vectorClass = isHadamard ? 'bloch-vector hadamard-vector' : 'bloch-vector';
  const vector = isHadamard
    ? '<line x1="380" y1="380" x2="380" y2="145"/><polygon class="bloch-vector-tip" points="380,118 360,158 400,158"/><circle class="bloch-state-dot" cx="380" cy="145" r="13"/>'
    : '<line x1="380" y1="380" x2="555" y2="230"/><polygon class="bloch-vector-tip" points="575,212 533,224 558,253"/><circle class="bloch-state-dot" cx="555" cy="230" r="13"/>';
  const stateLabel = isHadamard ? '<text class="bloch-label hadamard-plus-label" x="625" y="395">|+⟩</text>' : '<text class="bloch-label" x="574" y="205">|ψ⟩</text>';
  return `<svg class="bloch-svg" viewBox="0 0 760 760" role="img" aria-label="${isHadamard ? 'Bloch sphere endpoint animation from zero to plus' : 'Bloch sphere showing a general qubit state'}">
    <defs><radialGradient id="sphereFill-${kind}" cx="34%" cy="28%"><stop offset="0" stop-color="#294c75"/><stop offset=".62" stop-color="#172d53"/><stop offset="1" stop-color="#0b1129"/></radialGradient></defs>
    <circle class="bloch-sphere" style="fill:url(#sphereFill-${kind})" cx="380" cy="380" r="255"/>
    <ellipse class="bloch-equator" cx="380" cy="380" rx="255" ry="82"/>
    <path class="bloch-latitude" d="M159 252 C255 320 505 320 601 252"/>
    <path class="bloch-latitude" d="M159 508 C255 440 505 440 601 508"/>
    <line class="bloch-axis" x1="380" y1="78" x2="380" y2="682"/><line class="bloch-axis" x1="110" y1="505" x2="650" y2="255"/><line class="bloch-axis" x1="98" y1="380" x2="662" y2="380"/>
    <text class="bloch-label" x="395" y="88">|0⟩</text><text class="bloch-label" x="395" y="710">|1⟩</text><text class="bloch-label" x="674" y="389">+X</text><text class="bloch-label" x="62" y="536">−Y</text>
    <g class="${vectorClass}">${vector}</g>${stateLabel}
  </svg>`;
}

document.querySelectorAll('[data-bloch-state]').forEach((node) => {
  node.innerHTML = blochSvg(node.dataset.blochState);
});

const reveal = document.querySelector('.reveal');
let brandingLayer;
let capgeminiLogo;
let confidentialityPatch;
let eventLine;
let authorLine;

function currentSlide() {
  return document.querySelector('.reveal .slides > section.present') || deck.getCurrentSlide();
}
function isTitleSlide() {
  return currentSlide()?.classList.contains('title-slide') ?? false;
}
function ensureBranding() {
  if (brandingLayer) return;
  brandingLayer = document.createElement('div');
  brandingLayer.className = 'slide-background-branding';
  brandingLayer.setAttribute('aria-hidden', 'true');
  capgeminiLogo = document.createElement('img');
  capgeminiLogo.alt = '';
  confidentialityPatch = document.createElement('img');
  confidentialityPatch.alt = '';
  brandingLayer.append(capgeminiLogo, confidentialityPatch);
  reveal.appendChild(brandingLayer);
}
function formatEvent() {
  return `${EVENT_DETAILS.event} · ${EVENT_DETAILS.date}`;
}
function ensureFooter() {
  const controls = document.querySelector('.reveal .controls');
  if (controls && !eventLine) {
    eventLine = document.createElement('div');
    eventLine.className = 'controls-event-line';
    controls.appendChild(eventLine);
  }
  if (!authorLine) {
    authorLine = document.createElement('div');
    authorLine.className = 'menu-author-line';
    reveal.appendChild(authorLine);
  }
  if (eventLine) eventLine.textContent = formatEvent();
  authorLine.textContent = `${AUTHOR_DETAILS.name} · ${AUTHOR_DETAILS.jobTitle} @ ${AUTHOR_DETAILS.company}`;
}
function updateChrome() {
  ensureBranding();
  ensureFooter();
  const title = isTitleSlide();
  const logoVariant = title ? 'full' : 'spade';
  const patchVariant = title ? 'full' : 'compact';
  capgeminiLogo.className = `background-branding-logo background-branding-logo--${logoVariant}`;
  capgeminiLogo.src = CAPGEMINI_LOGOS[logoVariant];
  confidentialityPatch.className = `background-confidentiality-patch background-confidentiality-patch--${patchVariant}`;
  confidentialityPatch.src = CONFIDENTIALITY_PATCHES[CONFIDENTIALITY_LEVEL][patchVariant];
  eventLine?.classList.toggle('is-hidden', title);
  authorLine?.classList.toggle('is-hidden', title);
  document.querySelector('.reveal .slide-number')?.classList.toggle('is-hidden', title);
}
function updateHadamard(fragment) {
  const slide = fragment?.closest('.hadamard-slide');
  if (!slide || !fragment.classList.contains('hadamard-trigger')) return;
  slide.classList.toggle('is-hadamard-complete', fragment.classList.contains('visible'));
}

deck.on('ready', updateChrome);
deck.on('slidechanged', updateChrome);
deck.on('fragmentshown', ({ fragment }) => updateHadamard(fragment));
deck.on('fragmenthidden', ({ fragment }) => updateHadamard(fragment));
await deck.initialize();
updateChrome();
window.deck = deck;
