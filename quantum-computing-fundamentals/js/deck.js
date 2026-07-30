import Reveal from '../node_modules/reveal.js/dist/reveal.esm.js';

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
  autoAnimateDuration: 0.8,
  navigationMode: 'linear'
});

function blochSvg(kind) {
  const general = kind === 'general';
  const angle = general ? -42 : 0;
  const label = general
    ? '<text class="bloch-label bloch-state-label" x="574" y="200">|ψ⟩</text>'
    : '<text class="bloch-label bloch-state-label" x="618" y="344">|+⟩</text>';
  return `
  <svg class="bloch-svg" viewBox="0 0 760 760" role="img" aria-label="Bloch sphere showing ${general ? 'a general qubit state' : 'Hadamard rotation from zero to plus'}">
    <defs>
      <radialGradient id="sphereFill" cx="34%" cy="28%"><stop offset="0" stop-color="#ffffff"/><stop offset=".62" stop-color="#eaf7fc"/><stop offset="1" stop-color="#c9e8f4"/></radialGradient>
      <filter id="sphereShadow"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#121a38" flood-opacity=".18"/></filter>
    </defs>
    <g filter="url(#sphereShadow)">
      <circle class="bloch-sphere" cx="380" cy="380" r="255"/>
      <ellipse class="bloch-equator" cx="380" cy="380" rx="255" ry="82"/>
      <path class="bloch-latitude" d="M159 252 C255 320 505 320 601 252"/>
      <path class="bloch-latitude" d="M159 508 C255 440 505 440 601 508"/>
      <line class="bloch-axis" x1="380" y1="78" x2="380" y2="682"/>
      <line class="bloch-axis" x1="110" y1="505" x2="650" y2="255"/>
      <line class="bloch-axis" x1="98" y1="380" x2="662" y2="380"/>
      <text class="bloch-label" x="395" y="88">|0⟩</text><text class="bloch-label" x="395" y="704">|1⟩</text>
      <text class="bloch-label" x="676" y="388">+X</text><text class="bloch-label" x="74" y="535">−Y</text>
      <g class="bloch-vector" style="${general ? `transform:rotate(${angle}deg)` : ''}">
        <line x1="380" y1="380" x2="606" y2="380"/>
        <polygon class="bloch-vector-tip" points="630,380 593,360 593,400"/>
        <circle class="bloch-state-dot" cx="606" cy="380" r="13"/>
      </g>
      ${label}
    </g>
  </svg>`;
}

document.querySelectorAll('[data-bloch-state]').forEach((node) => {
  node.innerHTML = blochSvg(node.dataset.blochState);
});

const brand = document.createElement('div');
brand.className = 'deck-brand';
brand.textContent = 'QUANTUM COMPUTING FUNDAMENTALS';
document.body.appendChild(brand);

function updateChrome() {
  const slide = deck.getCurrentSlide();
  brand.style.color = slide?.classList.contains('section-divider') || slide?.classList.contains('end-slide') ? '#ffffff' : '#0058ab';
  brand.style.opacity = slide?.classList.contains('title-slide') ? '0' : '1';
}

deck.on('ready', updateChrome);
deck.on('slidechanged', updateChrome);
await deck.initialize();
window.deck = deck;
