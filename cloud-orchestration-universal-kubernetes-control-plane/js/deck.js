import Reveal from '../node_modules/reveal.js/dist/reveal.mjs';
import RevealHighlight from '../node_modules/reveal.js/dist/plugin/highlight.mjs';
import '../node_modules/reveal.js-menu/menu.css';
import '../node_modules/reveal.js/dist/plugin/highlight/monokai.css';
import '../css/menu-overrides.css';
import RevealMenu from '../node_modules/reveal.js-menu/plugin.js';

// Global confidentiality level for the complete deck.
// Valid values: SEC0, SEC1, SEC2, SEC2a, SEC3.
const CONFIDENTIALITY_LEVEL = 'SEC1';

const EVENT_DETAILS = {
  event: 'CIS Cyber Frankfurt Team Meeting'
};

const AUTHOR_DETAILS = {
  name: 'Niklas Schuster',
  jobTitle: 'Senior Cloud Solution Architect',
  company: 'Capgemini'
};

const THEME_OPTIONS = [
  { id: 'dark', label: 'CAPGEMINI DARK' },
  { id: 'light', label: 'CAPGEMINI LIGHT' }
];

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

function getThemeMenuContent() {
  const themeButtons = THEME_OPTIONS.map(({ id, label }) => (
    `<button type="button" class="menu-theme-option" data-theme="${id}">${label}</button>`
  )).join('');

  return '<div class="menu-theme-panel">' +
    '<p>Presentation theme</p>' +
    `<div class="menu-theme-options" role="list">${themeButtons}</div>` +
    '<p class="menu-theme-hint">Shortcut: T cycles through themes</p>' +
    '</div>';
}

function deckAutoAnimateMatcher(fromSlide, toSlide) {
  const isKcpPlatformTransition = (
    fromSlide.classList.contains('kcp-bootstrap-slide--ucp-only')
      && toSlide.classList.contains('kcp-platform-layout-slide')
  ) || (
    fromSlide.classList.contains('kcp-platform-layout-slide')
      && toSlide.classList.contains('kcp-bootstrap-slide--ucp-only')
  );
  if (isKcpPlatformTransition) {
    const fromBox = fromSlide.querySelector('[data-id="bootstrap-ucp-box"]');
    const toBox = toSlide.querySelector('[data-id="bootstrap-ucp-box"]');
    return fromBox && toBox
      ? [{
          from: fromBox,
          to: toBox,
          options: { measure: (element) => element.getBoundingClientRect() }
        }]
      : [];
  }

  const isKcpControlPlaneTransition = fromSlide.classList.contains('kcp-bootstrap-slide--step3-deprovision')
    && toSlide.classList.contains('kcp-bootstrap-slide--step3-deprovision');
  if (!isKcpControlPlaneTransition) return this.getAutoAnimatePairs(fromSlide, toSlide);

  const fromColumn = fromSlide.querySelector('[data-id="bootstrap-ucp-column"]');
  const toColumn = toSlide.querySelector('[data-id="bootstrap-ucp-column"]');
  return fromColumn && toColumn ? [{ from: fromColumn, to: toColumn }] : [];
}

const deck = new Reveal({
  hash: true,
  controls: true,
  progress: true,
  slideNumber: true,
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
  autoAnimateMatcher: deckAutoAnimateMatcher,
  menu: {
    side: 'left',
    width: 'wide',
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
        content: getThemeMenuContent()
      }
    ]
  },
  plugins: [RevealMenu, RevealHighlight]
});

deck.initialize();

const root = document.documentElement;
const toggle = document.querySelector('.theme-toggle');
const reveal = document.querySelector('.reveal');
let brandingLayer;
let capgeminiLogo;
let confidentialityPatch;
let cicdLeaderLineLayer;
let imageColumnLeaderLineLayer;
let imageColumnLeaderLineFrame;
let imageColumnLeaderLineTimeout;
let contentSplitConeLayer;
let contentSplitXrLeaderLayer;
let contentSplitConeUpdateFrame;
let contentSplitConeUpdateTimeout;
let threeColumnLeaderLineLayer;
let threeColumnLeaderLineFrame;
let threeColumnLeaderLineTimeout;
let kcpBootstrapLeaderLineLayer;
let kcpBootstrapLeaderLineFrame;
let kcpBootstrapLeaderLineTimeout;
let kcpBootstrapAutoAnimateFrame;
let kcpPlatformConnectionLayer;
let kcpPlatformConnectionFrame;
let kcpPlatformConnectionSignature;
let controlsEventLine;
let menuAuthorLine;
const contentSplitDrawnXrLeaderIdsBySlide = new WeakMap();

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

function getCurrentSlide() {
  return document.querySelector('.reveal .slides > section.present') || deck.getCurrentSlide();
}

function isTitleSlide() {
  return getCurrentSlide()?.classList.contains('title-slide') ?? false;
}

function updateMenuThemeButton(theme) {
  document.querySelectorAll('.menu-theme-option').forEach((button) => {
    const themeId = button.getAttribute('data-theme');
    const isActive = themeId === theme;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function formatEventDetails() {
  return `${EVENT_DETAILS.event} · ${formatEventDate()}`;
}

function formatEventDate() {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date());
}

function formatAuthorRole() {
  return [AUTHOR_DETAILS.jobTitle, AUTHOR_DETAILS.company]
    .filter(Boolean)
    .join(' @ ');
}

function formatAuthorDetails() {
  return [AUTHOR_DETAILS.name, formatAuthorRole()]
    .filter(Boolean)
    .join(' · ');
}

function formatSpeakerDetails() {
  return [AUTHOR_DETAILS.name, formatAuthorRole(), 'XX.XX.2026']
    .filter(Boolean)
    .join(' | ');
}

function ensureMenuAuthorLine() {
  if (!reveal) return undefined;
  if (!menuAuthorLine || menuAuthorLine.parentElement !== reveal) {
    menuAuthorLine?.remove();
    menuAuthorLine = document.createElement('div');
    menuAuthorLine.className = 'menu-author-line';
    menuAuthorLine.setAttribute('aria-live', 'polite');
    reveal.appendChild(menuAuthorLine);
  }
  return menuAuthorLine;
}

function updateMenuAuthorLine() {
  const authorLine = ensureMenuAuthorLine();
  if (!authorLine) return;
  const authorText = formatAuthorDetails();
  authorLine.textContent = authorText;
  authorLine.setAttribute('aria-label', authorText);
  updateFooterVisibility();
}

function updateSpeakerInfo() {
  document.querySelectorAll('.speaker-line').forEach((speakerLine) => {
    const speakerText = formatSpeakerDetails();
    speakerLine.textContent = speakerText;
    speakerLine.setAttribute('aria-label', speakerText);
  });

  document.querySelectorAll('.title-author-name').forEach((name) => {
    name.textContent = AUTHOR_DETAILS.name;
  });
  document.querySelectorAll('.title-author-role').forEach((role) => {
    role.textContent = formatAuthorRole();
  });
  document.querySelectorAll('.title-event-name').forEach((eventName) => {
    eventName.textContent = EVENT_DETAILS.event;
  });
  document.querySelectorAll('.title-event-date').forEach((eventDate) => {
    eventDate.textContent = formatEventDate();
  });
}

function updateFooterVisibility() {
  const hideFooterDetails = isTitleSlide();
  controlsEventLine?.classList.toggle('is-hidden', hideFooterDetails);
  menuAuthorLine?.classList.toggle('is-hidden', hideFooterDetails);
}

function ensureControlsEventLine() {
  const controls = document.querySelector('.reveal .controls');
  if (!controls) return undefined;
  if (!controlsEventLine || controlsEventLine.parentElement !== controls) {
    controlsEventLine?.remove();
    controlsEventLine = document.createElement('div');
    controlsEventLine.className = 'controls-event-line';
    controlsEventLine.setAttribute('aria-live', 'polite');
    controls.appendChild(controlsEventLine);
  }
  return controlsEventLine;
}

function updateControlsEventLine() {
  const eventLine = ensureControlsEventLine();
  if (!eventLine) return;
  const eventText = formatEventDetails();
  eventLine.textContent = eventText;
  eventLine.setAttribute('aria-label', eventText);
  updateFooterVisibility();
}

function updateBranding() {
  ensureBrandingLayer();

  const theme = root.dataset.theme === 'light' ? 'light' : 'dark';
  const currentSlide = getCurrentSlide();
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
  const selectedTheme = THEME_OPTIONS.some((option) => option.id === theme) ? theme : THEME_OPTIONS[0].id;
  root.dataset.theme = selectedTheme;
  localStorage.setItem('tech-talks-theme', selectedTheme);
  if (toggle) {
    const nextTheme = getNextThemeId(selectedTheme);
    const nextLabel = THEME_OPTIONS.find((option) => option.id === nextTheme)?.label || nextTheme;
    toggle.textContent = selectedTheme === 'dark' ? '☀' : '☾';
    toggle.setAttribute('aria-label', `Switch to ${nextLabel}`);
    toggle.setAttribute('title', `Switch to ${nextLabel}`);
  }
  updateMenuThemeButton(selectedTheme);
  updateBranding();
  requestCicdLeaderLineUpdate();
  requestImageColumnLeaderLineUpdate();
  requestContentSplitConeUpdate();
}

function getNextThemeId(theme) {
  const currentIndex = THEME_OPTIONS.findIndex((option) => option.id === theme);
  return THEME_OPTIONS[(currentIndex + 1 + THEME_OPTIONS.length) % THEME_OPTIONS.length].id;
}

function clearCicdLeaderLines() {
  cicdLeaderLineLayer?.remove();
  cicdLeaderLineLayer = undefined;
}

function clearImageColumnLeaderLines() {
  imageColumnLeaderLineLayer?.remove();
  imageColumnLeaderLineLayer = undefined;
}

function getImageColumnIcon(slide, label) {
  return slide.querySelector(`.image-column-orientation-icon[aria-label="${label}"]`);
}

function getImageColumnLeaderAnchor(icon, corner) {
  let anchorBox = icon.querySelector('.image-column-orientation-leader-box');
  if (!anchorBox) {
    anchorBox = document.createElement('span');
    anchorBox.className = 'image-column-orientation-leader-box';
    anchorBox.setAttribute('aria-hidden', 'true');
    icon.appendChild(anchorBox);
  }

  let anchor = anchorBox.querySelector(`[data-image-column-leader-anchor="${corner}"]`);
  if (!anchor) {
    anchor = document.createElement('span');
    anchor.className = 'image-column-orientation-leader-anchor';
    anchor.dataset.imageColumnLeaderAnchor = corner;
    anchorBox.appendChild(anchor);
  }
  return anchor;
}

function getImageColumnAnchorPoint(anchor, gridRect, scaleX = 1, scaleY = 1) {
  const rect = anchor.getBoundingClientRect();
  return {
    x: (rect.left - gridRect.left) / scaleX,
    y: (rect.top - gridRect.top) / scaleY
  };
}

function imageColumnArcPath(start, end, bendDirection) {
  const distance = Math.abs(end.x - start.x);
  const bend = Math.max(96, Math.min(178, distance * 0.22));
  const controlY = bendDirection === 'up'
    ? Math.min(start.y, end.y) - bend
    : Math.max(start.y, end.y) + bend;

  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} C ${(start.x + distance * 0.32 * Math.sign(end.x - start.x)).toFixed(2)} ${controlY.toFixed(2)} ${(end.x - distance * 0.32 * Math.sign(end.x - start.x)).toFixed(2)} ${controlY.toFixed(2)} ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

function getImageColumnArrowLineEnd(start, end, bendDirection, inset = 16) {
  const distance = Math.abs(end.x - start.x);
  const direction = Math.sign(end.x - start.x) || 1;
  const bend = Math.max(96, Math.min(178, distance * 0.22));
  const controlY = bendDirection === 'up'
    ? Math.min(start.y, end.y) - bend
    : Math.max(start.y, end.y) + bend;
  const controlX = end.x - distance * 0.32 * direction;
  const tangentX = end.x - controlX;
  const tangentY = end.y - controlY;
  const tangentLength = Math.hypot(tangentX, tangentY) || 1;

  return {
    x: end.x - (tangentX / tangentLength) * inset,
    y: end.y - (tangentY / tangentLength) * inset
  };
}

function renderImageColumnLeaderLines() {
  const currentSlide = deck.getCurrentSlide();
  if (!currentSlide?.classList.contains('image-column-orientation-slide') || deck.isOverview()) {
    clearImageColumnLeaderLines();
    return;
  }

  const grid = currentSlide.querySelector('.image-column-orientation-grid');
  const githubIcon = getImageColumnIcon(currentSlide, 'GitHub');
  const argoIcon = getImageColumnIcon(currentSlide, 'Argo CD');
  const kubernetesIcon = getImageColumnIcon(currentSlide, 'Kubernetes');
  if (!grid || !githubIcon || !argoIcon || !kubernetesIcon) {
    clearImageColumnLeaderLines();
    return;
  }

  const anchors = {
    githubTopRight: getImageColumnLeaderAnchor(githubIcon, 'top-right'),
    githubBottomRight: getImageColumnLeaderAnchor(githubIcon, 'bottom-right'),
    argoTopLeft: getImageColumnLeaderAnchor(argoIcon, 'top-left'),
    argoBottomLeft: getImageColumnLeaderAnchor(argoIcon, 'bottom-left'),
    argoTopRight: getImageColumnLeaderAnchor(argoIcon, 'top-right'),
    argoBottomRight: getImageColumnLeaderAnchor(argoIcon, 'bottom-right'),
    kubernetesTopLeft: getImageColumnLeaderAnchor(kubernetesIcon, 'top-left'),
    kubernetesBottomLeft: getImageColumnLeaderAnchor(kubernetesIcon, 'bottom-left')
  };

  const gridRect = grid.getBoundingClientRect();
  const scaleX = gridRect.width / grid.offsetWidth;
  const scaleY = gridRect.height / grid.offsetHeight;
  const point = (anchor) => getImageColumnAnchorPoint(anchor, gridRect, scaleX, scaleY);
  const githubColor = '#ffffff';
  const argoColor = '#ef7b4d';
  const kubernetesColor = '#326ce5';
  const routes = [
    {
      id: 'github-argo-top',
      start: point(anchors.githubTopRight),
      end: point(anchors.argoTopLeft),
      bendDirection: 'up',
      startColor: githubColor,
      endColor: argoColor
    },
    {
      id: 'argo-github-bottom',
      start: point(anchors.argoBottomLeft),
      end: point(anchors.githubBottomRight),
      bendDirection: 'down',
      startColor: argoColor,
      endColor: githubColor
    },
    {
      id: 'argo-kubernetes-top',
      start: point(anchors.argoTopRight),
      end: point(anchors.kubernetesTopLeft),
      bendDirection: 'up',
      startColor: argoColor,
      endColor: kubernetesColor
    },
    {
      id: 'kubernetes-argo-bottom',
      start: point(anchors.kubernetesBottomLeft),
      end: point(anchors.argoBottomRight),
      bendDirection: 'down',
      startColor: kubernetesColor,
      endColor: argoColor
    }
  ];

  if (!imageColumnLeaderLineLayer || imageColumnLeaderLineLayer.parentElement !== grid) {
    clearImageColumnLeaderLines();
    imageColumnLeaderLineLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    imageColumnLeaderLineLayer.classList.add('image-column-orientation-leaders');
    imageColumnLeaderLineLayer.setAttribute('aria-hidden', 'true');
    grid.appendChild(imageColumnLeaderLineLayer);
  }

  const defs = routes.map((route) => `
    <linearGradient id="image-column-gradient-${route.id}" gradientUnits="userSpaceOnUse" x1="${route.start.x.toFixed(2)}" y1="${route.start.y.toFixed(2)}" x2="${route.end.x.toFixed(2)}" y2="${route.end.y.toFixed(2)}">
      <stop offset="0" stop-color="${route.startColor}"/>
      <stop offset="1" stop-color="${route.endColor}"/>
    </linearGradient>
    <marker id="image-column-arrow-${route.id}" viewBox="-8 -8 16 16" refX="-2" refY="0" markerWidth="30" markerHeight="30" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
      <polygon points="-4,-8 4,0 -4,8 -7,5 -2,0 -7,-5" fill="${route.endColor}"/>
    </marker>`).join('');

  const paths = routes.map((route, index) => {
    const lineEnd = getImageColumnArrowLineEnd(route.start, route.end, route.bendDirection);
    const path = imageColumnArcPath(route.start, lineEnd, route.bendDirection);
    const delay = `${index * -0.65}s`;
    return `
    <path class="image-column-orientation-leader-shadow" data-image-column-route-shadow="${route.id}" style="animation-delay: ${delay}" d="${path}"/>
    <path class="image-column-orientation-leader" data-image-column-route="${route.id}" style="animation-delay: ${delay}" d="${path}" stroke="url(#image-column-gradient-${route.id})" marker-end="url(#image-column-arrow-${route.id})"/>`;
  }).join('');

  imageColumnLeaderLineLayer.setAttribute('viewBox', `0 0 ${grid.offsetWidth} ${grid.offsetHeight}`);
  imageColumnLeaderLineLayer.setAttribute('preserveAspectRatio', 'none');
  imageColumnLeaderLineLayer.replaceChildren();
  imageColumnLeaderLineLayer.insertAdjacentHTML('afterbegin', `<defs>${defs}</defs>${paths}`);
}

function requestImageColumnLeaderLineUpdate() {
  if (imageColumnLeaderLineFrame) window.cancelAnimationFrame(imageColumnLeaderLineFrame);
  if (imageColumnLeaderLineTimeout) window.clearTimeout(imageColumnLeaderLineTimeout);
  imageColumnLeaderLineFrame = window.requestAnimationFrame(() => {
    imageColumnLeaderLineFrame = undefined;
    imageColumnLeaderLineTimeout = window.setTimeout(() => {
      imageColumnLeaderLineTimeout = undefined;
      renderImageColumnLeaderLines();
    }, 120);
  });
}

function getCicdLineColor({ isStatic = false } = {}) {
  return isStatic ? 'rgba(76, 116, 156, 0.58)' : '#1db8f2';
}

function renderCicdLeaderLines() {
  const currentSlide = deck.getCurrentSlide();
  if (!currentSlide?.classList.contains('cicd-antipattern-slide')) return;

  const grid = currentSlide.querySelector('.cicd-grid-reference');
  const columns = [...currentSlide.querySelectorAll('.cicd-grid-column')];
  if (!grid || columns.length < 2) return;

  const color = getCicdLineColor();
  const staticColor = getCicdLineColor({ isStatic: true });
  const desiredStateColor = '#feb100';
  const desiredStateReverseColor = 'rgba(126, 78, 0, 0.58)';
  const desiredStateReverseOffset = 48;
  const desiredStateMutedColor = 'rgba(156, 166, 178, 0.82)';
  const desiredStateMutedReverseColor = 'rgba(74, 82, 92, 0.62)';
  const desiredStateMarkerColor = '#9ca6b2';
  const desiredStateMarkerReverseColor = '#4a525c';
  const outlineColor = root.dataset.theme === 'light' ? 'rgba(255, 255, 255, 0.92)' : 'rgba(18, 26, 56, 0.98)';
  const gridRect = grid.getBoundingClientRect();
  const scaleX = gridRect.width / grid.offsetWidth;
  const scaleY = gridRect.height / grid.offsetHeight;
  const toGridPoint = (x, y) => ({
    x: (x - gridRect.left) / scaleX,
    y: (y - gridRect.top) / scaleY
  });
  const laneY = Number.parseFloat(getComputedStyle(currentSlide).getPropertyValue('--cicd-pipeline-lane-y')) || 150;
  const rightEdgePointAtY = (element, y) => {
    const rect = element.getBoundingClientRect();
    return toGridPoint(rect.right, gridRect.top + y * scaleY);
  };
  const centerYInGrid = (element) => {
    const rect = element.getBoundingClientRect();
    return toGridPoint(gridRect.left, rect.top + rect.height / 2).y;
  };
  const centerXInGrid = (element) => {
    const rect = element.getBoundingClientRect();
    return toGridPoint(rect.left + rect.width / 2, gridRect.top).x;
  };
  const elementYInGrid = (element, ratio) => {
    const rect = element.getBoundingClientRect();
    return toGridPoint(gridRect.left, rect.top + rect.height * ratio).y;
  };
  const iconRowCenterYInGrid = (container, rowIndex = 0) => {
    const iconRects = [...container.querySelectorAll('.cicd-target-icon--aws')].map((icon) => icon.getBoundingClientRect());
    if (!iconRects.length) return centerYInGrid(container);

    const rowTops = [...new Set(iconRects.map((rect) => Math.round(rect.top)))].sort((a, b) => a - b);
    const targetRowTop = rowTops[Math.min(rowIndex, rowTops.length - 1)];
    const rowRects = iconRects.filter((rect) => Math.abs(rect.top - targetRowTop) < 3);
    const rowCenter = rowRects.reduce((sum, rect) => sum + rect.top + rect.height / 2, 0) / rowRects.length;
    return toGridPoint(gridRect.left, rowCenter).y;
  };

  const horizontalPipelineAtY = (y) => columns.slice(0, -1).map((column) => {
    const rect = column.getBoundingClientRect();
    return toGridPoint(rect.right, gridRect.top + y * scaleY);
  });
  const routedPipeline = (startY, endY, options = {}) => {
    const points = horizontalPipelineAtY(startY);
    const curveStartIndex = options.curveStartIndex ?? 1;
    const curveEndIndex = options.curveEndIndex ?? 4;
    const start = points[0];
    const curveStart = points[curveStartIndex];
    const curveEnd = { x: points[curveEndIndex].x, y: endY };
    const end = { x: points[5].x, y: endY };
    const controlOffset = Math.max(70, (curveEnd.x - curveStart.x) * (options.controlFactor ?? 0.35));
    return [
      {
        kind: 'line',
        attributes: { x1: start.x, y1: start.y, x2: curveStart.x, y2: start.y },
        length: Math.hypot(curveStart.x - start.x, 0)
      },
      {
        kind: 'path',
        attributes: {
          d: `M ${curveStart.x} ${start.y} C ${curveStart.x + controlOffset} ${start.y} ${curveEnd.x - controlOffset} ${endY} ${curveEnd.x} ${endY}`
        }
      },
      {
        kind: 'line',
        attributes: { x1: curveEnd.x, y1: endY, x2: end.x, y2: endY },
        length: Math.hypot(end.x - curveEnd.x, 0)
      }
    ];
  };

  const sourceCodeItem = currentSlide.querySelector('.cicd-file-item--source-code');
  const infraCodeItem = currentSlide.querySelector('.cicd-file-item--infra-code');
  const deploymentManifestItem = currentSlide.querySelector('.cicd-file-item--deployment-manifests');
  const testSuitesItem = currentSlide.querySelector('.cicd-file-item--test-suites');
  const registryGroup = currentSlide.querySelector('.cicd-target-group--registry');
  const kubernetesGroup = currentSlide.querySelector('.cicd-target-group--kubernetes');
  const cloudInfrastructureGroup = currentSlide.querySelector('.cicd-target-group--cloud');
  const thirdPartyGroup = currentSlide.querySelector('.cicd-target-group--third-party');
  const thirdPartyBox = currentSlide.querySelector('.cicd-target-main-box--third-party');

  const sourceLaneY = sourceCodeItem ? centerYInGrid(sourceCodeItem) : laneY;
  const registryCenterY = registryGroup ? centerYInGrid(registryGroup) : sourceLaneY;
  const kubernetesUpperY = kubernetesGroup ? elementYInGrid(kubernetesGroup, 0.1) : laneY;
  const kubernetesCenterY = kubernetesGroup ? elementYInGrid(kubernetesGroup, 0.46) : laneY;
  const kubernetesLowerY = kubernetesGroup ? elementYInGrid(kubernetesGroup, 0.84) : laneY;
  const cloudMiddleRowY = cloudInfrastructureGroup ? iconRowCenterYInGrid(cloudInfrastructureGroup, 1) : laneY;
  const thirdPartyUpperY = thirdPartyBox ? elementYInGrid(thirdPartyBox, 0.46) : (thirdPartyGroup ? elementYInGrid(thirdPartyGroup, 0.22) : laneY);
  const thirdPartyLowerY = thirdPartyBox ? elementYInGrid(thirdPartyBox, 0.82) : (thirdPartyGroup ? elementYInGrid(thirdPartyGroup, 0.78) : laneY);
  const singlePipelineMode = currentSlide.classList.contains('cicd-antipattern-slide--single-pipeline');
  const staticBasisMode = currentSlide.classList.contains('cicd-antipattern-slide--single-pipeline-basis');
  const nextSlideBaseMode = currentSlide.classList.contains('cicd-antipattern-slide--next-slide-base');
  const skipPipelineDraw = currentSlide.classList.contains('cicd-antipattern-slide--no-pipeline-draw');
  const currentFragment = deck.getIndices().f ?? -1;
  const showAllPipelines = staticBasisMode && !nextSlideBaseMode;
  const isFragmentVisible = (fragmentIndex) => showAllPipelines || currentFragment >= fragmentIndex;
  const allowAllPipelineRoutes = !singlePipelineMode || showAllPipelines;
  const showNextSlideControlPlanePipelines = nextSlideBaseMode;
  const showNextSlideReversePipelines = nextSlideBaseMode && isFragmentVisible(0);

  const sourceToRegistryPoints = columns.slice(0, -1).map((column) => rightEdgePointAtY(column, sourceLaneY));
  const controlPlaneMarkerCenters = [...currentSlide.querySelectorAll('.cicd-control-plane-icon-card')]
    .map((card) => centerXInGrid(card));
  const pipelines = [];
  const routedPipelines = [];

  if (singlePipelineMode || isFragmentVisible(0)) {
    pipelines.push({ id: 'source-to-registry', points: sourceToRegistryPoints });
  }
  if (showNextSlideControlPlanePipelines && infraCodeItem) {
    const infraDefinitionStart = rightEdgePointAtY(columns[0], elementYInGrid(infraCodeItem, 0.5));
    const secondPipelineStepStart = sourceToRegistryPoints[1] || sourceToRegistryPoints[sourceToRegistryPoints.length - 1];
    const controlX = infraDefinitionStart.x + Math.max(80, (secondPipelineStepStart.x - infraDefinitionStart.x) * 0.58);
    routedPipelines.push({
      id: 'infra-definitions-to-second-step',
      segments: [
        {
          kind: 'path',
          attributes: {
            d: `M ${infraDefinitionStart.x} ${infraDefinitionStart.y} C ${controlX} ${infraDefinitionStart.y} ${controlX} ${secondPipelineStepStart.y} ${secondPipelineStepStart.x} ${secondPipelineStepStart.y}`
          }
        }
      ]
    });
  }
  if (showNextSlideControlPlanePipelines && deploymentManifestItem) {
    const desiredStateY = elementYInGrid(deploymentManifestItem, 0.5);
    const desiredStatePoints = horizontalPipelineAtY(desiredStateY);
    const middleBoxStart = desiredStatePoints[1];
    const middleBoxEnd = desiredStatePoints[4];
    const rightColumnStart = desiredStatePoints[5];
    const registryBranchY = registryCenterY + 34;
    const branchToTarget = (id, targetY) => {
      const controlOffset = Math.max(42, (rightColumnStart.x - middleBoxEnd.x) * 0.42);
      routedPipelines.push({
        id,
        segments: [
          {
            kind: 'path',
            stroke: desiredStateColor,
            attributes: {
              d: `M ${middleBoxEnd.x} ${middleBoxEnd.y} C ${middleBoxEnd.x + controlOffset} ${middleBoxEnd.y} ${rightColumnStart.x - controlOffset} ${targetY} ${rightColumnStart.x} ${targetY}`
            }
          }
        ]
      });
    };
    const desiredStateReverseY = desiredStateY + desiredStateReverseOffset;
    const desiredStateReversePoints = horizontalPipelineAtY(desiredStateReverseY);
    const middleBoxStartReverse = desiredStateReversePoints[1];
    const middleBoxEndReverse = desiredStateReversePoints[4];
    const rightColumnStartReverse = desiredStateReversePoints[5];
    const branchBackToControlPlane = (id, targetY) => {
      const reverseTargetY = targetY + desiredStateReverseOffset;
      const controlOffset = Math.max(42, (rightColumnStartReverse.x - middleBoxEndReverse.x) * 0.42);
      routedPipelines.push({
        id,
        segments: [
          {
            kind: 'path',
            stroke: desiredStateReverseColor,
            attributes: {
              d: `M ${rightColumnStartReverse.x} ${reverseTargetY} C ${rightColumnStartReverse.x - controlOffset} ${reverseTargetY} ${middleBoxEndReverse.x + controlOffset} ${middleBoxEndReverse.y} ${middleBoxEndReverse.x} ${middleBoxEndReverse.y}`
            }
          }
        ]
      });
    };
    if (showNextSlideReversePipelines) {
      routedPipelines.push({
        id: 'reverse-desired-state-middle-to-source',
        segments: [
          {
            kind: 'line',
            stroke: desiredStateReverseColor,
            attributes: {
              x1: middleBoxStartReverse.x,
              y1: middleBoxStartReverse.y,
              x2: desiredStateReversePoints[0].x,
              y2: desiredStateReversePoints[0].y
            },
            length: Math.hypot(middleBoxStartReverse.x - desiredStateReversePoints[0].x, 0)
          }
        ]
      });
      routedPipelines.push({
        id: 'reverse-desired-state-control-plane-crossing',
        segments: [
          {
            kind: 'line',
            stroke: desiredStateMutedReverseColor,
            attributes: {
              x1: middleBoxEndReverse.x,
              y1: middleBoxEndReverse.y,
              x2: middleBoxStartReverse.x,
              y2: middleBoxStartReverse.y
            },
            length: Math.hypot(middleBoxEndReverse.x - middleBoxStartReverse.x, 0)
          }
        ]
      });
      routedPipelines.push({
        id: 'reverse-cloud-infrastructure-to-desired-state-middle',
        segments: [
          {
            kind: 'line',
            stroke: desiredStateReverseColor,
            attributes: {
              x1: rightColumnStartReverse.x,
              y1: middleBoxEndReverse.y,
              x2: middleBoxEndReverse.x,
              y2: middleBoxEndReverse.y
            },
            length: Math.hypot(rightColumnStartReverse.x - middleBoxEndReverse.x, 0)
          }
        ]
      });
      branchBackToControlPlane('reverse-registry-to-desired-state-middle', registryBranchY);
      branchBackToControlPlane('reverse-kubernetes-to-desired-state-middle', kubernetesCenterY);
      branchBackToControlPlane('reverse-third-party-to-desired-state-middle', thirdPartyUpperY);
    }
    routedPipelines.push({
      id: 'desired-state-to-middle-box',
      segments: [
        {
          kind: 'line',
          stroke: desiredStateColor,
          attributes: {
            x1: desiredStatePoints[0].x,
            y1: desiredStatePoints[0].y,
            x2: middleBoxStart.x,
            y2: middleBoxStart.y
          },
          length: Math.hypot(middleBoxStart.x - desiredStatePoints[0].x, 0)
        },
        {
          kind: 'line',
          stroke: desiredStateMutedColor,
          attributes: {
            x1: middleBoxStart.x,
            y1: middleBoxStart.y,
            x2: middleBoxEnd.x,
            y2: middleBoxEnd.y
          },
          length: Math.hypot(middleBoxEnd.x - middleBoxStart.x, 0)
        }
      ]
    });
    routedPipelines.push({
      id: 'desired-state-middle-to-cloud-infrastructure',
      segments: [
        {
          kind: 'line',
          stroke: desiredStateColor,
          attributes: {
            x1: middleBoxEnd.x,
            y1: middleBoxEnd.y,
            x2: rightColumnStart.x,
            y2: middleBoxEnd.y
          },
          length: Math.hypot(rightColumnStart.x - middleBoxEnd.x, 0)
        }
      ]
    });
    branchToTarget('desired-state-middle-to-registry', registryBranchY);
    branchToTarget('desired-state-middle-to-kubernetes', kubernetesCenterY);
    branchToTarget('desired-state-middle-to-third-party', thirdPartyUpperY);
  }
  if (allowAllPipelineRoutes && isFragmentVisible(1) && infraCodeItem && kubernetesGroup) {
    pipelines.push({ id: 'infra-to-kubernetes', points: horizontalPipelineAtY(kubernetesUpperY) });
  }
  if (allowAllPipelineRoutes && isFragmentVisible(2) && infraCodeItem && cloudInfrastructureGroup) {
    routedPipelines.push({
      id: 'infra-to-cloud',
      segments: routedPipeline(
        elementYInGrid(infraCodeItem, 0.5),
        iconRowCenterYInGrid(cloudInfrastructureGroup, 0)
      )
    });
  }
  if (allowAllPipelineRoutes && isFragmentVisible(3) && infraCodeItem && thirdPartyGroup) {
    routedPipelines.push({
      id: 'infra-to-third-party',
      segments: routedPipeline(
        elementYInGrid(infraCodeItem, 0.9),
        thirdPartyUpperY
      )
    });
  }
  if (allowAllPipelineRoutes && isFragmentVisible(4) && deploymentManifestItem && kubernetesGroup) {
    routedPipelines.push({
      id: 'deployment-to-kubernetes',
      segments: routedPipeline(
        elementYInGrid(deploymentManifestItem, 0.12),
        kubernetesCenterY,
        { curveStartIndex: 1, curveEndIndex: 4, controlFactor: 0.28 }
      )
    });
  }
  if (allowAllPipelineRoutes && isFragmentVisible(5) && deploymentManifestItem && cloudInfrastructureGroup) {
    routedPipelines.push({
      id: 'deployment-to-cloud',
      segments: routedPipeline(
        elementYInGrid(deploymentManifestItem, 0.5),
        cloudMiddleRowY,
        { curveStartIndex: 1, curveEndIndex: 4, controlFactor: 0.24 }
      )
    });
  }
  if (allowAllPipelineRoutes && isFragmentVisible(6) && deploymentManifestItem && thirdPartyGroup) {
    routedPipelines.push({
      id: 'deployment-to-third-party',
      segments: routedPipeline(
        elementYInGrid(deploymentManifestItem, 0.88),
        thirdPartyLowerY,
        { curveStartIndex: 1, curveEndIndex: 4, controlFactor: 0.28 }
      )
    });
  }
  if (allowAllPipelineRoutes && isFragmentVisible(7) && testSuitesItem && kubernetesGroup) {
    routedPipelines.push({
      id: 'test-to-kubernetes',
      segments: routedPipeline(
        elementYInGrid(testSuitesItem, 0.12),
        kubernetesLowerY
      )
    });
  }
  if (allowAllPipelineRoutes && isFragmentVisible(8) && testSuitesItem && cloudInfrastructureGroup) {
    routedPipelines.push({
      id: 'test-to-cloud',
      segments: routedPipeline(
        elementYInGrid(testSuitesItem, 0.54),
        iconRowCenterYInGrid(cloudInfrastructureGroup, 2)
      )
    });
  }

  if (!cicdLeaderLineLayer || cicdLeaderLineLayer.parentElement !== grid) {
    clearCicdLeaderLines();
    cicdLeaderLineLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    cicdLeaderLineLayer.classList.add('cicd-pipeline-lines-layer');
    cicdLeaderLineLayer.setAttribute('aria-hidden', 'true');
    cicdLeaderLineLayer.innerHTML = `
      <defs>
        <marker id="cicd-pipeline-arrowhead" viewBox="-8 -8 16 16" markerWidth="30" markerHeight="30" refX="-2" refY="0" orient="auto" markerUnits="userSpaceOnUse">
          <polygon class="cicd-pipeline-arrowhead-path" points="-4,-8 4,0 -4,8 -7,5 -2,0 -7,-5"></polygon>
        </marker>
        <marker id="cicd-pipeline-arrowhead-static" viewBox="-8 -8 16 16" markerWidth="30" markerHeight="30" refX="-2" refY="0" orient="auto" markerUnits="userSpaceOnUse">
          <polygon class="cicd-pipeline-arrowhead-path-static" points="-4,-8 4,0 -4,8 -7,5 -2,0 -7,-5"></polygon>
        </marker>
        <marker id="cicd-pipeline-arrowhead-desired" viewBox="-8 -8 16 16" markerWidth="30" markerHeight="30" refX="-2" refY="0" orient="auto" markerUnits="userSpaceOnUse">
          <polygon class="cicd-pipeline-arrowhead-path-desired" points="-4,-8 4,0 -4,8 -7,5 -2,0 -7,-5"></polygon>
        </marker>
        <marker id="cicd-pipeline-arrowhead-desired-reverse" viewBox="-8 -8 16 16" markerWidth="30" markerHeight="30" refX="-2" refY="0" orient="auto" markerUnits="userSpaceOnUse">
          <polygon class="cicd-pipeline-arrowhead-path-desired-reverse" points="-4,-8 4,0 -4,8 -7,5 -2,0 -7,-5"></polygon>
        </marker>
        <marker id="cicd-pipeline-arrowhead-muted" viewBox="-8 -8 16 16" markerWidth="30" markerHeight="30" refX="-2" refY="0" orient="auto" markerUnits="userSpaceOnUse">
          <polygon class="cicd-pipeline-arrowhead-path-muted" points="-4,-8 4,0 -4,8 -7,5 -2,0 -7,-5"></polygon>
        </marker>
      </defs>
    `;
    grid.appendChild(cicdLeaderLineLayer);
  }

  cicdLeaderLineLayer.setAttribute('viewBox', `0 0 ${grid.offsetWidth} ${grid.offsetHeight}`);
  cicdLeaderLineLayer.setAttribute('preserveAspectRatio', 'none');
  cicdLeaderLineLayer.querySelector('.cicd-pipeline-arrowhead-path')?.setAttribute('fill', color);
  cicdLeaderLineLayer.querySelector('.cicd-pipeline-arrowhead-path-static')?.setAttribute('fill', staticColor);
  cicdLeaderLineLayer.querySelectorAll('.cicd-pipeline-arrowhead-path-desired').forEach((path) => path.setAttribute('fill', desiredStateColor));
  cicdLeaderLineLayer.querySelectorAll('.cicd-pipeline-arrowhead-path-desired-reverse').forEach((path) => path.setAttribute('fill', desiredStateReverseColor));
  cicdLeaderLineLayer.querySelector('.cicd-pipeline-arrowhead-path-muted')?.setAttribute('fill', desiredStateMutedColor);

  const activePipelineIds = new Set();
  const setCommonLineAttributes = (element, stroke) => {
    element.setAttribute('stroke', stroke);
    if (element.classList.contains('cicd-pipeline-line')) {
      element.removeAttribute('marker-start');
      element.removeAttribute('marker-end');
      let markerId = 'cicd-pipeline-arrowhead';
      if (stroke === desiredStateMutedColor || stroke === desiredStateMutedReverseColor) {
        return;
      }
      if (stroke === staticColor) markerId = 'cicd-pipeline-arrowhead-static';
      if (stroke === desiredStateColor) {
        element.setAttribute('marker-end', 'url(#cicd-pipeline-arrowhead-desired)');
        return;
      }
      if (stroke === desiredStateReverseColor) {
        element.setAttribute('marker-end', 'url(#cicd-pipeline-arrowhead-desired-reverse)');
        return;
      }
      element.setAttribute('marker-end', `url(#${markerId})`);
    }
  };
  const renderControlPlaneMarkerConnectors = () => {
    cicdLeaderLineLayer.querySelector('.cicd-control-plane-marker-connectors')?.remove();
    cicdLeaderLineLayer.querySelectorAll('[id^="cicd-control-plane-marker-connector-gradient-"]').forEach((gradient) => gradient.remove());
    if (!showNextSlideReversePipelines) return;

    const markers = [...cicdLeaderLineLayer.querySelectorAll('.cicd-control-plane-line-marker')]
      .map((marker) => ({
        x: Number.parseFloat(marker.getAttribute('cx')),
        y: Number.parseFloat(marker.getAttribute('cy')),
        fill: marker.getAttribute('fill')
      }))
      .filter(({ x, y }) => Number.isFinite(x) && Number.isFinite(y));
    const markerPairs = controlPlaneMarkerCenters
      .map((centerX) => {
        const atCenter = markers.filter(({ x }) => Math.abs(x - centerX) < 3);
        const lightMarker = atCenter.find(({ fill }) => fill === desiredStateMarkerColor);
        const darkMarker = atCenter.find(({ fill }) => fill === desiredStateMarkerReverseColor);
        return lightMarker && darkMarker ? { x: centerX, lightMarker, darkMarker } : null;
      })
      .filter(Boolean);
    if (!markerPairs.length) return;

    const defs = cicdLeaderLineLayer.querySelector('defs');
    if (!defs) return;
    const connectorGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    connectorGroup.classList.add('cicd-control-plane-marker-connectors');

    markerPairs.forEach(({ x, lightMarker, darkMarker }, index) => {
      const y1 = Math.min(lightMarker.y, darkMarker.y) + 12;
      const y2 = Math.max(lightMarker.y, darkMarker.y) - 12;
      if (y2 <= y1) return;
      const gradientId = `cicd-control-plane-marker-connector-gradient-${index}`;
      const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      gradient.id = gradientId;
      gradient.setAttribute('gradientUnits', 'userSpaceOnUse');
      gradient.setAttribute('x1', x);
      gradient.setAttribute('x2', x);
      gradient.setAttribute('y1', y1);
      gradient.setAttribute('y2', y2);
      const lightStop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      lightStop.setAttribute('offset', '0%');
      lightStop.setAttribute('stop-color', desiredStateMarkerColor);
      const darkStop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      darkStop.setAttribute('offset', '100%');
      darkStop.setAttribute('stop-color', desiredStateMarkerReverseColor);
      gradient.append(lightStop, darkStop);
      defs.appendChild(gradient);

      const connector = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      connector.classList.add('cicd-control-plane-marker-connector');
      connector.setAttribute('x1', x);
      connector.setAttribute('x2', x);
      connector.setAttribute('y1', y1);
      connector.setAttribute('y2', y2);
      connector.setAttribute('stroke', `url(#${gradientId})`);
      connectorGroup.appendChild(connector);
    });

    const firstPrimaryGroup = [...cicdLeaderLineLayer.querySelectorAll('.cicd-pipeline-group')]
      .find((group) => !group.dataset.cicdPipelineId?.startsWith('reverse-'));
    cicdLeaderLineLayer.insertBefore(connectorGroup, firstPrimaryGroup || null);
  };

  const easeCicdDraw = (t) => t < 0.5
    ? 2 * t * t
    : 1 - Math.pow(-2 * t + 2, 2) / 2;

  const arrowEndpointInset = 16;
  const lineHasArrow = (stroke) => stroke !== desiredStateMutedColor && stroke !== desiredStateMutedReverseColor;
  const shortenLineAttributes = (attributes, inset = arrowEndpointInset) => {
    const x1 = Number.parseFloat(attributes.x1);
    const y1 = Number.parseFloat(attributes.y1);
    const x2 = Number.parseFloat(attributes.x2);
    const y2 = Number.parseFloat(attributes.y2);
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.hypot(dx, dy) || 1;
    if (length <= inset) return attributes;
    return {
      ...attributes,
      x2: x2 - (dx / length) * inset,
      y2: y2 - (dy / length) * inset
    };
  };
  const shortenCubicPathAttributes = (attributes, inset = arrowEndpointInset) => {
    const d = attributes.d || '';
    const match = d.match(/^M\s+(-?[\d.]+)\s+(-?[\d.]+)\s+C\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)$/);
    if (!match) return attributes;
    const values = match.slice(1).map(Number);
    const [startX, startY, control1X, control1Y, control2X, control2Y, endX, endY] = values;
    const tangentX = endX - control2X;
    const tangentY = endY - control2Y;
    const tangentLength = Math.hypot(tangentX, tangentY) || 1;
    const shortenedEndX = endX - (tangentX / tangentLength) * inset;
    const shortenedEndY = endY - (tangentY / tangentLength) * inset;
    return {
      ...attributes,
      d: `M ${startX} ${startY} C ${control1X} ${control1Y} ${control2X} ${control2Y} ${shortenedEndX} ${shortenedEndY}`
    };
  };
  const shortenArrowAttributes = (tagName, attributes, stroke) => {
    if (!lineHasArrow(stroke)) return attributes;
    return tagName === 'path'
      ? shortenCubicPathAttributes(attributes)
      : shortenLineAttributes(attributes);
  };

  const addDrawMask = (group, line, length, marker, stroke) => {
    const defs = cicdLeaderLineLayer.querySelector('defs');
    if (!defs) return;

    group.dataset.cicdDrawMaskId && document.getElementById(group.dataset.cicdDrawMaskId)?.remove();
    group.dataset.cicdDrawArrowId && document.getElementById(group.dataset.cicdDrawArrowId)?.remove();
    line.removeAttribute('marker-end');

    const maskId = `cicd-pipeline-draw-mask-${group.dataset.cicdPipelineId.replace(/[^a-z0-9_-]/gi, '-')}`;
    const drawMask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
    drawMask.id = maskId;
    drawMask.setAttribute('maskUnits', 'userSpaceOnUse');
    drawMask.setAttribute('x', '0');
    drawMask.setAttribute('y', '0');
    drawMask.setAttribute('width', grid.offsetWidth);
    drawMask.setAttribute('height', grid.offsetHeight);

    const maskBackground = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    maskBackground.setAttribute('width', grid.offsetWidth);
    maskBackground.setAttribute('height', grid.offsetHeight);
    maskBackground.setAttribute('fill', '#000');
    const maskRoute = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const routePath = line.tagName.toLowerCase() === 'path'
      ? line.getAttribute('d') || ''
      : `M ${line.getAttribute('x1')} ${line.getAttribute('y1')} L ${line.getAttribute('x2')} ${line.getAttribute('y2')}`;
    maskRoute.setAttribute('d', routePath);
    maskRoute.setAttribute('fill', 'none');
    maskRoute.setAttribute('stroke', '#fff');
    maskRoute.setAttribute('stroke-width', '20');
    maskRoute.setAttribute('stroke-linecap', 'butt');
    maskRoute.setAttribute('stroke-dasharray', length);
    maskRoute.setAttribute('stroke-dashoffset', length);
    drawMask.append(maskBackground, maskRoute);
    defs.appendChild(drawMask);

    const drawToken = `${maskId}-${window.performance.now().toFixed(3)}`;
    group.dataset.cicdDrawMaskId = maskId;
    group.dataset.cicdDrawToken = drawToken;
    group.classList.add('cicd-pipeline-group--drawing');
    group.setAttribute('mask', `url(#${maskId})`);

    const movingArrow = marker
      ? document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
      : null;
    if (movingArrow) {
      const arrowId = `${maskId}-moving-arrow`;
      movingArrow.id = arrowId;
      movingArrow.classList.add('cicd-pipeline-moving-arrow-head');
      movingArrow.setAttribute('points', '-4,-8 4,0 -4,8 -7,5 -2,0 -7,-5');
      movingArrow.setAttribute('fill', stroke);
      movingArrow.setAttribute('aria-hidden', 'true');
      group.dataset.cicdDrawArrowId = arrowId;
      cicdLeaderLineLayer.appendChild(movingArrow);
    }

    const start = window.performance.now();
    const duration = 760;
    const finishDraw = () => {
      if (group.dataset.cicdDrawMaskId !== maskId || group.dataset.cicdDrawToken !== drawToken) return;
      group.removeAttribute('mask');
      group.classList.remove('cicd-pipeline-group--drawing');
      if (marker) {
        line.setAttribute('marker-end', marker);
      } else {
        line.removeAttribute('marker-end');
      }
      movingArrow?.remove();
      delete group.dataset.cicdDrawMaskId;
      delete group.dataset.cicdDrawToken;
      delete group.dataset.cicdDrawArrowId;
      drawMask.remove();
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finishDraw();
      return;
    }
    const drawFrame = (now) => {
      if (!drawMask.isConnected || group.dataset.cicdDrawMaskId !== maskId || group.dataset.cicdDrawToken !== drawToken) return;
      const progress = Math.min(1, Math.max(0, (now - start) / duration));
      const eased = easeCicdDraw(progress);
      maskRoute.setAttribute('stroke-dashoffset', length * (1 - eased));
      if (movingArrow && line.getPointAtLength) {
        const distance = Math.min(length, Math.max(0, length * eased));
        const point = line.getPointAtLength(distance);
        const tangentInset = Math.max(1, length * 0.002);
        const tangentStart = line.getPointAtLength(Math.max(0, distance - tangentInset));
        const tangentEnd = line.getPointAtLength(Math.min(length, distance + tangentInset));
        const angle = Math.atan2(tangentEnd.y - tangentStart.y, tangentEnd.x - tangentStart.x) * 180 / Math.PI;
        movingArrow.setAttribute('transform', `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)}) rotate(${angle.toFixed(2)}) scale(1.875)`);
        movingArrow.setAttribute('opacity', progress > 0.01 ? '1' : '0');
      }
      if (progress < 1) {
        window.requestAnimationFrame(drawFrame);
      } else {
        finishDraw();
      }
    };
    window.requestAnimationFrame(drawFrame);
    window.setTimeout(finishDraw, duration + 80);
  };

  const ensurePipelineGroup = (id) => {
    activePipelineIds.add(id);
    let group = cicdLeaderLineLayer.querySelector(`[data-cicd-pipeline-id="${id}"]`);
    const isNew = !group;
    if (!group) {
      group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.dataset.cicdPipelineId = id;
      group.classList.add('cicd-pipeline-group');
      cicdLeaderLineLayer.appendChild(group);
    }
    return { group, isNew };
  };
  const isSourceToRegistryGroup = (pipelineGroupId) => pipelineGroupId.startsWith('source-to-registry-');
  const shouldDashPipelineGroup = (pipelineGroupId) => {
    return !staticBasisMode || isSourceToRegistryGroup(pipelineGroupId);
  };
  const shouldDrawPipelineGroup = (pipelineGroupId) => {
    if (skipPipelineDraw) return false;
    if (nextSlideBaseMode && isSourceToRegistryGroup(pipelineGroupId)) return false;
    return !staticBasisMode || isSourceToRegistryGroup(pipelineGroupId);
  };
  pipelines.forEach(({ id, points, segmentStrokes = [] }) => {
    const segments = points.slice(0, -1).map((point, index) => [point, points[index + 1], `${id}-${index}`, segmentStrokes[index]]);

    segments.forEach(([start, end, segmentId, segmentStroke]) => {
      const { group, isNew } = ensurePipelineGroup(segmentId);
      const shouldDash = shouldDashPipelineGroup(segmentId);
      const shouldDraw = shouldDrawPipelineGroup(segmentId);
      group.classList.toggle('cicd-pipeline-group--static', !shouldDash);
      let outline = group.querySelector('.cicd-pipeline-line-outline');
      let line = group.querySelector('.cicd-pipeline-line');
      if (!outline) {
        outline = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        outline.classList.add('cicd-pipeline-line-outline');
        group.appendChild(outline);
      }
      if (!line) {
        line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.classList.add('cicd-pipeline-line');
        group.appendChild(line);
      }
      const segmentStrokeColor = segmentStroke || (shouldDash ? color : staticColor);
      const attrs = shortenArrowAttributes('line', { x1: start.x, y1: start.y, x2: end.x, y2: end.y }, segmentStrokeColor);
      Object.entries(attrs).forEach(([name, value]) => {
        outline.setAttribute(name, value);
        line.setAttribute(name, value);
      });
      outline.setAttribute('stroke', outlineColor);
      setCommonLineAttributes(line, segmentStrokeColor);
      const marker = line.getAttribute('marker-end');
      if (group.classList.contains('cicd-pipeline-group--drawing')) {
        line.removeAttribute('marker-end');
      }
      if (isNew && shouldDraw) {
        addDrawMask(
          group,
          line,
          Math.hypot(attrs.x2 - attrs.x1, attrs.y2 - attrs.y1),
          marker,
          segmentStrokeColor
        );
      }
    });
  });

  routedPipelines.forEach(({ id, segments }) => {
    const segmentNames = ['start', 'curve', 'end'];
    segments.forEach(({ kind, attributes, length, stroke }, index) => {
      const segmentId = `${id}-${segmentNames[index] || index}`;
      const { group, isNew } = ensurePipelineGroup(segmentId);
      const shouldDash = shouldDashPipelineGroup(segmentId);
      const shouldDraw = shouldDrawPipelineGroup(segmentId);
      group.classList.toggle('cicd-pipeline-group--static', !shouldDash);
      const tagName = kind === 'path' ? 'path' : 'line';
      let outline = group.querySelector('.cicd-pipeline-line-outline');
      let line = group.querySelector('.cicd-pipeline-line');
      if (!outline || outline.tagName.toLowerCase() !== tagName) {
        outline?.remove();
        outline = document.createElementNS('http://www.w3.org/2000/svg', tagName);
        outline.classList.add('cicd-pipeline-line-outline');
        if (tagName === 'path') outline.classList.add('cicd-pipeline-line-path');
        group.appendChild(outline);
      }
      if (!line || line.tagName.toLowerCase() !== tagName) {
        line?.remove();
        line = document.createElementNS('http://www.w3.org/2000/svg', tagName);
        line.classList.add('cicd-pipeline-line');
        if (tagName === 'path') line.classList.add('cicd-pipeline-line-path');
        group.appendChild(line);
      }
      const segmentStroke = stroke || (shouldDash ? color : staticColor);
      const attrs = shortenArrowAttributes(tagName, attributes, segmentStroke);
      Object.entries(attrs).forEach(([name, value]) => {
        outline.setAttribute(name, value);
        line.setAttribute(name, value);
      });
      outline.setAttribute('stroke', outlineColor);
      setCommonLineAttributes(line, segmentStroke);
      const marker = line.getAttribute('marker-end');
      if (group.classList.contains('cicd-pipeline-group--drawing')) {
        line.removeAttribute('marker-end');
      }
      group.querySelectorAll('.cicd-control-plane-line-marker').forEach((marker) => marker.remove());
      if (
        nextSlideBaseMode &&
        tagName === 'line' &&
        (segmentStroke === desiredStateMutedColor || segmentStroke === desiredStateMutedReverseColor)
      ) {
        const x1 = Number.parseFloat(attributes.x1);
        const x2 = Number.parseFloat(attributes.x2);
        const y = Number.parseFloat(attributes.y1);
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        controlPlaneMarkerCenters
          .filter((x) => x >= minX + 8 && x <= maxX - 8)
          .forEach((x) => {
            const marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            marker.classList.add('cicd-control-plane-line-marker');
            marker.setAttribute('cx', x);
            marker.setAttribute('cy', y);
            marker.setAttribute('r', '12');
            const markerColor = segmentStroke === desiredStateMutedReverseColor
              ? desiredStateMarkerReverseColor
              : desiredStateMarkerColor;
            marker.setAttribute('fill', markerColor);
            marker.removeAttribute('stroke');
            group.appendChild(marker);
          });
      }
      if (isNew && shouldDraw) {
        const segmentLength = line.getTotalLength ? line.getTotalLength() : length || 1;
        addDrawMask(group, line, segmentLength, marker, segmentStroke);
      }
    });
  });

  cicdLeaderLineLayer.querySelectorAll('.cicd-pipeline-group').forEach((group) => {
    if (!activePipelineIds.has(group.dataset.cicdPipelineId)) {
      group.dataset.cicdDrawMaskId && document.getElementById(group.dataset.cicdDrawMaskId)?.remove();
      group.dataset.cicdDrawArrowId && document.getElementById(group.dataset.cicdDrawArrowId)?.remove();
      delete group.dataset.cicdDrawMaskId;
      delete group.dataset.cicdDrawToken;
      delete group.dataset.cicdDrawArrowId;
      group.remove();
    }
  });

  const activePipelineGroups = [...cicdLeaderLineLayer.querySelectorAll('.cicd-pipeline-group')];
  const orderedPipelineGroups = activePipelineGroups.sort((a, b) => {
    const aIsReverse = a.dataset.cicdPipelineId?.startsWith('reverse-') ? 0 : 1;
    const bIsReverse = b.dataset.cicdPipelineId?.startsWith('reverse-') ? 0 : 1;
    return aIsReverse - bIsReverse;
  });
  const currentPipelineGroupOrder = [...cicdLeaderLineLayer.children]
    .filter((child) => child.classList?.contains('cicd-pipeline-group'));
  const pipelineOrderChanged = currentPipelineGroupOrder.length !== orderedPipelineGroups.length ||
    orderedPipelineGroups.some((group, index) => currentPipelineGroupOrder[index] !== group);
  if (pipelineOrderChanged) {
    orderedPipelineGroups.forEach((group) => cicdLeaderLineLayer.appendChild(group));
  }
  cicdLeaderLineLayer.querySelectorAll('.cicd-pipeline-moving-arrow-head')
    .forEach((arrow) => cicdLeaderLineLayer.appendChild(arrow));

  renderControlPlaneMarkerConnectors();
}

function requestCicdLeaderLineUpdate() {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(renderCicdLeaderLines);
  });
  window.setTimeout(renderCicdLeaderLines, 160);
  window.setTimeout(renderCicdLeaderLines, 420);
}

function renderContentSplitCones() {
  const currentSlide = deck.getCurrentSlide();
  if (!currentSlide?.classList.contains('content-split-orientation-slide')) {
    contentSplitConeLayer?.remove();
    contentSplitXrLeaderLayer?.remove();
    contentSplitConeLayer = undefined;
    contentSplitXrLeaderLayer = undefined;
    return;
  }
  const pane = currentSlide.querySelector('.content-split-orientation-pane--right');
  const k8sIcon = currentSlide.querySelector('.content-split-abstraction-icon--kubernetes');
  const crossplaneIcon = currentSlide.querySelector('.content-split-abstraction-icon--crossplane');
  const boxes = [...currentSlide.querySelectorAll('.content-split-target-box')];
  const workloadIcons = [...currentSlide.querySelectorAll('.content-split-kubernetes-resource-icon--deploy, .content-split-kubernetes-resource-icon--svc')];
  const resourceIconTargets = [...currentSlide.querySelectorAll('.content-split-kubernetes-resource-stack > img, .content-split-kubernetes-resource-stack > span')];
  const crdIcons = [...currentSlide.querySelectorAll('.content-split-kubernetes-resource-icon--crd')];
  const compositeCrdIcon = currentSlide.querySelector('.content-split-composite-resource-icon');
  if (!pane || !k8sIcon || !crossplaneIcon || boxes.length < 4 || workloadIcons.length < 2 || !crdIcons.length) return;
  const compositeResourceBlock = currentSlide.querySelector('.content-split-composite-resource-block');
  const compositeResourceVisible = compositeResourceBlock?.classList.contains('visible');
  if (!compositeResourceVisible) contentSplitDrawnXrLeaderIdsBySlide.delete(currentSlide);
  if (compositeResourceVisible && contentSplitXrLeaderLayer?.querySelector('.content-split-xr-leader-group--drawing')) return;

  if (!contentSplitConeLayer || contentSplitConeLayer.closest('section') !== currentSlide) {
    contentSplitConeLayer?.remove();
    contentSplitConeLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    contentSplitConeLayer.classList.add('content-split-cone-layer');
    contentSplitConeLayer.setAttribute('aria-hidden', 'true');
    pane.prepend(contentSplitConeLayer);
  }
  if (!contentSplitXrLeaderLayer || contentSplitXrLeaderLayer.closest('section') !== currentSlide) {
    contentSplitXrLeaderLayer?.remove();
    contentSplitXrLeaderLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    contentSplitXrLeaderLayer.classList.add('content-split-xr-leader-layer');
    contentSplitXrLeaderLayer.setAttribute('aria-hidden', 'true');
    pane.appendChild(contentSplitXrLeaderLayer);
  }

  const paneRect = pane.getBoundingClientRect();
  const scaleX = paneRect.width / pane.offsetWidth;
  const scaleY = paneRect.height / pane.offsetHeight;
  const toPane = (x, y) => ({
    x: (x - paneRect.left) / scaleX,
    y: (y - paneRect.top) / scaleY
  });
  const unionRect = (elements) => {
    const rects = elements.map((element) => element.getBoundingClientRect());
    return {
      left: Math.min(...rects.map((rect) => rect.left)),
      right: Math.max(...rects.map((rect) => rect.right)),
      top: Math.min(...rects.map((rect) => rect.top)),
      bottom: Math.max(...rects.map((rect) => rect.bottom))
    };
  };
  const rect = (element) => element.getBoundingClientRect();
  const coneFillColor = '#19375d';
  const rootStyles = getComputedStyle(root);
  const crossplaneRed = rootStyles.getPropertyValue('--crossplane-red').trim() || '#e4867f';
  const crossplaneYellow = rootStyles.getPropertyValue('--crossplane-yellow').trim() || '#f7cf5a';
  const crossplaneGreen = rootStyles.getPropertyValue('--crossplane-green').trim() || '#69cdbb';
  const kubernetesBlue = '#3f67d5';
  const easeContentSplitDraw = (t) => t < 0.5
    ? 2 * t * t
    : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const xrDefs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const xrLeaderContent = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  xrLeaderContent.classList.add('content-split-xr-leader-content');
  const xrArrowMarker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
  xrArrowMarker.id = 'content-split-xr-leader-arrowhead';
  xrArrowMarker.setAttribute('viewBox', '-8 -8 16 16');
  xrArrowMarker.setAttribute('markerWidth', '30');
  xrArrowMarker.setAttribute('markerHeight', '30');
  xrArrowMarker.setAttribute('refX', '-2');
  xrArrowMarker.setAttribute('refY', '0');
  xrArrowMarker.setAttribute('orient', 'auto');
  xrArrowMarker.setAttribute('markerUnits', 'userSpaceOnUse');
  const xrArrowShape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  xrArrowShape.setAttribute('points', '-4,-8 4,0 -4,8 -7,5 -2,0 -7,-5');
  xrArrowShape.setAttribute('fill', getCicdLineColor());
  xrArrowMarker.appendChild(xrArrowShape);
  xrDefs.appendChild(xrArrowMarker);
  const gradient = ({ id, sourceX, targetX, y }) => {
    const gradientElement = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradientElement.id = id;
    gradientElement.setAttribute('gradientUnits', 'userSpaceOnUse');
    gradientElement.setAttribute('x1', sourceX);
    gradientElement.setAttribute('y1', y);
    gradientElement.setAttribute('x2', targetX);
    gradientElement.setAttribute('y2', y);

    const start = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    start.setAttribute('offset', '0%');
    start.setAttribute('stop-color', coneFillColor);
    start.setAttribute('stop-opacity', '0.78');

    const end = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    end.setAttribute('offset', '100%');
    end.setAttribute('stop-color', coneFillColor);
    end.setAttribute('stop-opacity', '0');

    gradientElement.append(start, end);
    return gradientElement;
  };
  const entangledLineGradient = ({ id, start, end, endColor }) => {
    const gradientElement = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradientElement.id = id;
    gradientElement.setAttribute('gradientUnits', 'userSpaceOnUse');
    gradientElement.setAttribute('x1', start.x);
    gradientElement.setAttribute('y1', start.y);
    gradientElement.setAttribute('x2', end.x);
    gradientElement.setAttribute('y2', end.y);
    [
      ['0%', kubernetesBlue],
      ['24%', kubernetesBlue],
      ['62%', endColor],
      ['100%', endColor]
    ].forEach(([offset, color]) => {
      const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop.setAttribute('offset', offset);
      stop.setAttribute('stop-color', color);
      gradientElement.appendChild(stop);
    });
    return gradientElement;
  };
  const entangledLines = ({ topIcon, bottomIcon }) => {
    const top = rect(topIcon);
    const bottom = rect(bottomIcon);
    const topPoint = (xRatio, yRatio) => toPane(top.left + top.width * xRatio, top.top + top.height * yRatio);
    const bottomPoint = (xRatio, yRatio) => toPane(bottom.left + bottom.width * xRatio, bottom.top + bottom.height * yRatio);
    const start = topPoint(0.5, 0.58);
    const end = bottomPoint(0.62, 0.58);
    const dy = end.y - start.y;
    const curvePoint = (xOffset, yRatio) => ({ x: start.x + xOffset, y: start.y + dy * yRatio });
    const endPoints = [
      bottomPoint(0.46, 0.33),
      bottomPoint(0.61, 0.38),
      bottomPoint(0.68, 0.52),
      bottomPoint(0.58, 0.66),
      bottomPoint(0.44, 0.73)
    ];
    const endColors = [crossplaneRed, crossplaneYellow, crossplaneYellow, crossplaneGreen, crossplaneGreen];
    const routes = [
      [start, curvePoint(-48, 0.16), curvePoint(-68, 0.38), curvePoint(-46, 0.62), curvePoint(-18, 0.82), endPoints[0]],
      [start, curvePoint(-22, 0.12), curvePoint(44, 0.28), curvePoint(26, 0.52), curvePoint(54, 0.74), endPoints[1]],
      [start, curvePoint(42, 0.14), curvePoint(-32, 0.36), curvePoint(56, 0.58), curvePoint(12, 0.78), endPoints[2]],
      [start, curvePoint(72, 0.2), curvePoint(38, 0.42), curvePoint(-24, 0.64), curvePoint(58, 0.86), endPoints[3]],
      [start, curvePoint(-36, 0.22), curvePoint(24, 0.44), curvePoint(-10, 0.66), curvePoint(-54, 0.8), endPoints[4]]
    ];
    routes.forEach((route, index) => {
      defs.appendChild(entangledLineGradient({
        id: `content-split-entangled-gradient-${index + 1}`,
        start,
        end: route.at(-1),
        endColor: endColors[index]
      }));
    });
    const smoothPath = (points) => {
      const commandParts = [`M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`];
      const tension = 1.08;
      for (let index = 0; index < points.length - 1; index += 1) {
        const p0 = points[Math.max(0, index - 1)];
        const p1 = points[index];
        const p2 = points[index + 1];
        const p3 = points[Math.min(points.length - 1, index + 2)];
        const c1 = {
          x: p1.x + ((p2.x - p0.x) / 6) * tension,
          y: p1.y + ((p2.y - p0.y) / 6) * tension
        };
        const c2 = {
          x: p2.x - ((p3.x - p1.x) / 6) * tension,
          y: p2.y - ((p3.y - p1.y) / 6) * tension
        };
        commandParts.push(`C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)}, ${c2.x.toFixed(1)} ${c2.y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`);
      }
      return commandParts.join(' ');
    };
    const makePath = (points, index, halo = false) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.classList.add('content-split-entangled-line');
      if (halo) path.classList.add('content-split-entangled-line--halo');
      path.setAttribute('data-entangled-line', `${index + 1}`);
      if (halo) path.setAttribute('data-entangled-line-halo', `${index + 1}`);
      path.classList.add('content-split-svg-fragment--1');
      if (!halo) path.style.stroke = `url(#content-split-entangled-gradient-${index + 1})`;
      path.setAttribute('d', smoothPath(points));
      return path;
    };
    const halos = routes.map((route, index) => makePath(route, index, true));
    const lines = routes.map((route, index) => makePath(route, index));
    return [...halos, ...lines];
  };
  const xrLeaderLines = ({ sourceIcons, targetIcon }) => {
    if (!targetIcon || sourceIcons.length < 8) return { elements: [], startDraws: () => {} };
    if (!compositeResourceVisible) return { elements: [], startDraws: () => {} };
    const target = rect(targetIcon);
    const targetTopLeft = toPane(target.left, target.top);
    const targetBottomRight = toPane(target.right, target.bottom);
    const targetWidth = targetBottomRight.x - targetTopLeft.x;
    const targetHeight = targetBottomRight.y - targetTopLeft.y;
    const targetPadding = 3;
    const xrMaskWidth = Math.max(pane.offsetWidth, targetBottomRight.x + targetPadding);
    const xrMaskHeight = Math.max(pane.offsetHeight, targetBottomRight.y + targetPadding);
    const targetOcclusionMask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
    targetOcclusionMask.id = 'content-split-xr-target-occlusion-mask';
    targetOcclusionMask.setAttribute('maskUnits', 'userSpaceOnUse');
    targetOcclusionMask.setAttribute('x', '0');
    targetOcclusionMask.setAttribute('y', '0');
    targetOcclusionMask.setAttribute('width', xrMaskWidth);
    targetOcclusionMask.setAttribute('height', xrMaskHeight);
    const targetOcclusionBackground = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    targetOcclusionBackground.setAttribute('width', xrMaskWidth);
    targetOcclusionBackground.setAttribute('height', xrMaskHeight);
    targetOcclusionBackground.setAttribute('fill', '#fff');
    const targetOcclusionHex = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    const targetLeft = targetTopLeft.x - targetPadding;
    const targetRight = targetBottomRight.x + targetPadding;
    const targetTop = targetTopLeft.y - targetPadding;
    const targetBottom = targetBottomRight.y + targetPadding;
    const targetMidY = targetTop + (targetBottom - targetTop) * 0.5;
    const targetShoulder = targetWidth * 0.16;
    targetOcclusionHex.setAttribute('points', [
      `${targetLeft + targetShoulder},${targetTop}`,
      `${targetRight - targetShoulder},${targetTop}`,
      `${targetRight},${targetMidY}`,
      `${targetRight - targetShoulder},${targetBottom}`,
      `${targetLeft + targetShoulder},${targetBottom}`,
      `${targetLeft},${targetMidY}`
    ].join(' '));
    targetOcclusionHex.setAttribute('fill', '#000');
    targetOcclusionMask.append(targetOcclusionBackground, targetOcclusionHex);
    xrDefs.appendChild(targetOcclusionMask);
    xrLeaderContent.setAttribute('mask', `url(#${targetOcclusionMask.id})`);
    const targetPoint = (yRatio) => toPane(target.left + target.width * 0.54, target.top + target.height * yRatio);
    const leaderSources = sourceIcons
      .map((element, index) => ({ element, sourceIndex: index + 1 }))
      .filter(({ sourceIndex }) => sourceIndex !== 1 && sourceIndex !== 3 && sourceIndex !== 6);
    const targetRatios = [0.22, 0.36, 0.5, 0.64, 0.78];
    const routes = leaderSources.map(({ element, sourceIndex }, index) => {
      const source = rect(element);
      const start = toPane(source.right, source.top + source.height * 0.5);
      const end = targetPoint(targetRatios[index]);
      const dx = end.x - start.x;
      const verticalNudge = index % 2 === 0 ? -8 : 8;
      const control1 = { x: start.x + dx * 0.32, y: start.y + verticalNudge };
      const control2 = { x: start.x + dx * 0.62, y: end.y - verticalNudge };
      const tangentX = end.x - control2.x;
      const tangentY = end.y - control2.y;
      const tangentLength = Math.hypot(tangentX, tangentY) || 1;
      const shortenedEnd = {
        x: end.x - (tangentX / tangentLength) * 16,
        y: end.y - (tangentY / tangentLength) * 16
      };
      return {
        sourceIndex,
        points: [
          start,
          control1,
          control2,
          shortenedEnd
        ]
      };
    });
    const smoothPath = (points) => `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)} C ${points[1].x.toFixed(1)} ${points[1].y.toFixed(1)}, ${points[2].x.toFixed(1)} ${points[2].y.toFixed(1)}, ${points[3].x.toFixed(1)} ${points[3].y.toFixed(1)}`;
    const outlineColor = root.dataset.theme === 'light' ? 'rgba(255, 255, 255, 0.92)' : 'rgba(18, 26, 56, 0.98)';
    const lineColor = getCicdLineColor();
    const shouldDrawNow = compositeResourceVisible;
    const drawnIds = contentSplitDrawnXrLeaderIdsBySlide.get(currentSlide) || new Set();
    contentSplitDrawnXrLeaderIdsBySlide.set(currentSlide, drawnIds);
    const pendingDraws = [];
    const addDrawAnimation = (group, id, line) => {
      if (drawnIds.has(id)) return;
      const maskId = `content-split-xr-leader-draw-mask-${id.replace(/[^a-z0-9_-]/gi, '-')}`;
      const mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
      mask.id = maskId;
      mask.setAttribute('maskUnits', 'userSpaceOnUse');
      mask.setAttribute('x', '0');
      mask.setAttribute('y', '0');
      mask.setAttribute('width', xrMaskWidth);
      mask.setAttribute('height', xrMaskHeight);
      const maskBackground = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      maskBackground.setAttribute('width', xrMaskWidth);
      maskBackground.setAttribute('height', xrMaskHeight);
      maskBackground.setAttribute('fill', '#000');
      const maskRoute = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      maskRoute.setAttribute('d', line.getAttribute('d') || '');
      maskRoute.setAttribute('fill', 'none');
      maskRoute.setAttribute('stroke', '#fff');
      maskRoute.setAttribute('stroke-width', '24');
      maskRoute.setAttribute('stroke-linecap', 'butt');
      const length = Math.max(1, line.getTotalLength ? line.getTotalLength() : 1);
      maskRoute.setAttribute('stroke-dasharray', length);
      maskRoute.setAttribute('stroke-dashoffset', length);
      mask.append(maskBackground, maskRoute);
      xrDefs.appendChild(mask);

      const marker = line.getAttribute('marker-end');
      line.removeAttribute('marker-end');
      const drawToken = `${maskId}-${window.performance.now().toFixed(3)}`;
      group.dataset.contentSplitDrawMaskId = maskId;
      group.dataset.contentSplitDrawToken = drawToken;
      group.classList.add('content-split-xr-leader-group--drawing');
      group.setAttribute('mask', `url(#${maskId})`);

      const movingArrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      movingArrow.id = `${maskId}-moving-arrow`;
      movingArrow.classList.add('content-split-xr-leader-moving-arrow');
      movingArrow.setAttribute('points', '-4,-8 4,0 -4,8 -7,5 -2,0 -7,-5');
      movingArrow.setAttribute('fill', lineColor);
      movingArrow.setAttribute('aria-hidden', 'true');
      movingArrow.setAttribute('opacity', '0');
      group.dataset.contentSplitDrawArrowId = movingArrow.id;
      xrLeaderContent.appendChild(movingArrow);

      const start = window.performance.now();
      const duration = 760;
      const finishDraw = () => {
        if (group.dataset.contentSplitDrawMaskId !== maskId || group.dataset.contentSplitDrawToken !== drawToken) return;
        group.removeAttribute('mask');
        group.classList.remove('content-split-xr-leader-group--drawing');
        if (marker) line.setAttribute('marker-end', marker);
        movingArrow.remove();
        delete group.dataset.contentSplitDrawMaskId;
        delete group.dataset.contentSplitDrawToken;
        delete group.dataset.contentSplitDrawArrowId;
        drawnIds.add(id);
        mask.remove();
      };
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        finishDraw();
        return;
      }
      const drawFrame = (now) => {
        if (!mask.isConnected || group.dataset.contentSplitDrawMaskId !== maskId || group.dataset.contentSplitDrawToken !== drawToken) return;
        const progress = Math.min(1, Math.max(0, (now - start) / duration));
        const eased = easeContentSplitDraw(progress);
        maskRoute.setAttribute('stroke-dashoffset', length * (1 - eased));
        const distance = Math.min(length, Math.max(0, length * eased));
        const point = line.getPointAtLength(distance);
        const tangentInset = Math.max(1, length * 0.002);
        const tangentStart = line.getPointAtLength(Math.max(0, distance - tangentInset));
        const tangentEnd = line.getPointAtLength(Math.min(length, distance + tangentInset));
        const angle = Math.atan2(tangentEnd.y - tangentStart.y, tangentEnd.x - tangentStart.x) * 180 / Math.PI;
        movingArrow.setAttribute('transform', `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)}) rotate(${angle.toFixed(2)}) scale(1.875)`);
        movingArrow.setAttribute('opacity', progress > 0.01 ? '1' : '0');
        if (progress < 1) {
          window.requestAnimationFrame(drawFrame);
        } else {
          finishDraw();
        }
      };
      window.requestAnimationFrame(drawFrame);
      window.setTimeout(finishDraw, duration + 80);
    };
    const elements = routes.map((route) => {
      const d = smoothPath(route.points);
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.classList.add('content-split-svg-fragment--3');
      group.setAttribute('data-xr-leader-group', `${route.sourceIndex}`);
      const outline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      outline.classList.add('content-split-xr-leader-line', 'content-split-xr-leader-line--halo');
      outline.setAttribute('data-xr-leader-halo', `${route.sourceIndex}`);
      outline.setAttribute('stroke', outlineColor);
      outline.setAttribute('d', d);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      line.classList.add('content-split-xr-leader-line');
      line.setAttribute('data-xr-leader-line', `${route.sourceIndex}`);
      line.setAttribute('stroke', lineColor);
      line.setAttribute('marker-end', 'url(#content-split-xr-leader-arrowhead)');
      line.setAttribute('d', d);
      group.append(outline, line);
      if (shouldDrawNow) pendingDraws.push(() => addDrawAnimation(group, `source-${route.sourceIndex}`, line));
      return group;
    });
    return { elements, startDraws: () => pendingDraws.forEach((startDraw) => startDraw()) };
  };
  const cone = ({ source, target, direction, id }) => {
    const centerX = source.left + source.width / 2;
    const centerY = source.top + source.height / 2;
    const sourceTop = toPane(centerX, centerY - source.height * 0.128);
    const sourceBottom = toPane(centerX, centerY + source.height * 0.128);
    const targetTop = direction === 'left'
      ? toPane(target.right, target.top)
      : toPane(target.left, target.top);
    const targetBottom = direction === 'left'
      ? toPane(target.right, target.bottom)
      : toPane(target.left, target.bottom);
    const targetX = targetTop.x;
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.classList.add('content-split-cone');
    polygon.setAttribute('fill', `url(#${id})`);
    polygon.setAttribute('points', `${sourceTop.x},${sourceTop.y} ${sourceBottom.x},${sourceBottom.y} ${targetBottom.x},${targetBottom.y} ${targetTop.x},${targetTop.y}`);
    defs.appendChild(gradient({ id, sourceX: sourceTop.x, targetX, y: (sourceTop.y + sourceBottom.y) / 2 }));
    return polygon;
  };

  contentSplitConeLayer.setAttribute('viewBox', `0 0 ${pane.offsetWidth} ${pane.offsetHeight}`);
  contentSplitXrLeaderLayer.setAttribute('viewBox', `0 0 ${pane.offsetWidth} ${pane.offsetHeight}`);
  const cones = [
    cone({ source: rect(k8sIcon), target: rect(boxes[0]), direction: 'left', id: 'content-split-cone-k8s-box' }),
    cone({ source: rect(k8sIcon), target: unionRect(workloadIcons), direction: 'right', id: 'content-split-cone-k8s-resources' }),
    cone({ source: rect(crossplaneIcon), target: unionRect(boxes.slice(1)), direction: 'left', id: 'content-split-cone-crossplane-boxes' }),
    cone({ source: rect(crossplaneIcon), target: unionRect(crdIcons), direction: 'right', id: 'content-split-cone-crossplane-crds' })
  ];
  cones.slice(2).forEach((coneElement) => {
    coneElement.classList.add('content-split-svg-fragment--1');
  });
  const entangled = entangledLines({ topIcon: k8sIcon, bottomIcon: crossplaneIcon });
  const xrLeaders = xrLeaderLines({ sourceIcons: resourceIconTargets, targetIcon: compositeCrdIcon });
  contentSplitConeLayer.replaceChildren(defs, ...cones, ...entangled);
  xrLeaderContent.prepend(...xrLeaders.elements);
  contentSplitXrLeaderLayer.replaceChildren(xrDefs, xrLeaderContent);
  xrLeaders.startDraws();
}

function requestContentSplitConeUpdate() {
  if (contentSplitConeUpdateFrame) window.cancelAnimationFrame(contentSplitConeUpdateFrame);
  if (contentSplitConeUpdateTimeout) window.clearTimeout(contentSplitConeUpdateTimeout);
  contentSplitConeUpdateFrame = window.requestAnimationFrame(() => {
    contentSplitConeUpdateFrame = undefined;
    contentSplitConeUpdateTimeout = window.setTimeout(() => {
      contentSplitConeUpdateTimeout = undefined;
      renderContentSplitCones();
    }, 120);
  });
}

function clearThreeColumnLeaderLines() {
  threeColumnLeaderLineLayer?.remove();
  threeColumnLeaderLineLayer = undefined;
}

function renderThreeColumnLeaderLines() {
  const currentSlide = deck.getCurrentSlide();
  if (!currentSlide?.classList.contains('three-column-layout-slide')) {
    clearThreeColumnLeaderLines();
    return;
  }

  const grid = currentSlide.querySelector('.three-column-layout-grid');
  const source = currentSlide.querySelector('.three-column-layout-yellow-box--claim-source');
  const configurationTargets = [...currentSlide.querySelectorAll('.three-column-layout-yellow-stack--configuration .three-column-layout-yellow-box')];
  const topConfigurationSource = currentSlide.querySelector('.three-column-layout-yellow-box--configuration-source');
  const managedTargets = [...currentSlide.querySelectorAll('.three-column-layout-yellow-box--managed-target')];
  if (!grid || !source || configurationTargets.length !== 3 || !topConfigurationSource || managedTargets.length !== 7) {
    clearThreeColumnLeaderLines();
    return;
  }

  if (!threeColumnLeaderLineLayer || threeColumnLeaderLineLayer.parentElement !== grid) {
    clearThreeColumnLeaderLines();
    threeColumnLeaderLineLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    threeColumnLeaderLineLayer.classList.add('three-column-layout-leader-lines');
    threeColumnLeaderLineLayer.setAttribute('aria-hidden', 'true');
    grid.appendChild(threeColumnLeaderLineLayer);
  }

  const gridRect = grid.getBoundingClientRect();
  const gridWidth = grid.clientWidth || grid.offsetWidth || gridRect.width;
  const gridHeight = grid.clientHeight || grid.offsetHeight || gridRect.height;
  const scaleX = gridRect.width / gridWidth || 1;
  const scaleY = gridRect.height / gridHeight || 1;
  const rect = (element) => element.getBoundingClientRect();
  const toSvg = (x, y) => ({ x: (x - gridRect.left) / scaleX, y: (y - gridRect.top) / scaleY });
  const rightCenter = (element) => {
    const box = rect(element);
    return toSvg(box.right, box.top + box.height / 2);
  };
  const leftCenter = (element, inset = 0) => {
    const box = rect(element);
    return toSvg(box.left - inset, box.top + box.height / 2);
  };
  const makeGridPath = (from, to, busX) => {
    const x1 = from.x.toFixed(1);
    const y1 = from.y.toFixed(1);
    const xb = busX.toFixed(1);
    const x2 = to.x.toFixed(1);
    const y2 = to.y.toFixed(1);
    return `M ${x1} ${y1} H ${xb} V ${y2} H ${x2}`;
  };
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const createGradient = ({ id, from, to, fromColor, toColor }) => {
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.id = id;
    gradient.setAttribute('gradientUnits', 'userSpaceOnUse');
    gradient.setAttribute('x1', from.x.toFixed(1));
    gradient.setAttribute('y1', from.y.toFixed(1));
    gradient.setAttribute('x2', to.x.toFixed(1));
    gradient.setAttribute('y2', to.y.toFixed(1));
    const start = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    start.setAttribute('offset', '0%');
    start.setAttribute('stop-color', fromColor);
    const hold = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    hold.setAttribute('offset', '68%');
    hold.setAttribute('stop-color', fromColor);
    const end = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    end.setAttribute('offset', '100%');
    end.setAttribute('stop-color', toColor);
    gradient.append(start, hold, end);
    defs.appendChild(gradient);
  };
  const createPathSpec = ({ from, to, className, index, fromColor, toColor, busX }) => {
    const gradientId = `three-column-layout-leader-gradient-${index + 1}-${className}`;
    createGradient({ id: gradientId, from, to, fromColor, toColor });
    return {
      key: `${className}-${index + 1}`,
      className,
      index,
      d: makeGridPath(from, to, busX),
      stroke: `url(#${gradientId})`,
      arrowColor: toColor,
      arrowRevealDistance: Math.abs(busX - from.x) + Math.abs(to.y - from.y),
      markerEnd: `url(#three-column-layout-leader-arrow-${index + 1}-${className})`
    };
  };

  const createMarker = (id, color) => {
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.id = id;
    marker.setAttribute('viewBox', '-8 -8 16 16');
    marker.setAttribute('refX', '0');
    marker.setAttribute('refY', '0');
    marker.setAttribute('markerWidth', '30');
    marker.setAttribute('markerHeight', '30');
    marker.setAttribute('markerUnits', 'userSpaceOnUse');
    marker.setAttribute('orient', 'auto');
    const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    arrow.setAttribute('points', '-4,-8 4,0 -4,8 -7,5 -2,0 -7,-5');
    arrow.setAttribute('fill', color);
    marker.appendChild(arrow);
    defs.appendChild(marker);
  };

  const blue = getComputedStyle(root).getPropertyValue('--capgemini-light-blue').trim() || '#1db8f2';
  const yellow = getComputedStyle(root).getPropertyValue('--capgemini-yellow').trim() || '#feb100';
  const turquoise = getComputedStyle(root).getPropertyValue('--capgemini-turquoise').trim() || '#12abdb';
  for (let index = 0; index < configurationTargets.length; index += 1) {
    createMarker(`three-column-layout-leader-arrow-${index + 1}-three-column-layout-leader-group--blue-to-yellow`, yellow);
  }
  for (let index = 0; index < managedTargets.length; index += 1) {
    createMarker(`three-column-layout-leader-arrow-${index + 1}-three-column-layout-leader-group--yellow-to-turquoise`, turquoise);
  }
  const isRevealedFragment = (element) => !element.closest('.fragment:not(.visible)');
  const fromBlue = rightCenter(source);
  const fromYellow = rightCenter(topConfigurationSource);
  const arrowTipExtension = 7.5;
  const arrowEndpointInset = arrowTipExtension * scaleX;
  const configurationEndpoints = configurationTargets.filter(isRevealedFragment).map((target) => leftCenter(target, arrowEndpointInset));
  const managedEndpoints = managedTargets.filter(isRevealedFragment).map((target) => leftCenter(target, arrowEndpointInset));
  const blueBusX = configurationEndpoints.length
    ? fromBlue.x + Math.max(72, (Math.min(...configurationEndpoints.map((point) => point.x)) - fromBlue.x) * 0.5)
    : fromBlue.x + 72;
  const yellowBusX = managedEndpoints.length
    ? fromYellow.x + Math.max(72, (Math.min(...managedEndpoints.map((point) => point.x)) - fromYellow.x) * 0.5)
    : fromYellow.x + 72;
  const blueLines = configurationEndpoints.map((target, index) => createPathSpec({
    from: fromBlue,
    to: target,
    className: 'three-column-layout-leader-group--blue-to-yellow',
    index,
    fromColor: blue,
    toColor: yellow,
    busX: blueBusX
  }));
  const yellowLines = isRevealedFragment(topConfigurationSource)
    ? managedEndpoints.map((target, index) => createPathSpec({
      from: fromYellow,
      to: target,
      className: 'three-column-layout-leader-group--yellow-to-turquoise',
      index,
      fromColor: yellow,
      toColor: turquoise,
      busX: yellowBusX
    }))
    : [];

  threeColumnLeaderLineLayer.setAttribute('viewBox', `0 0 ${gridWidth} ${gridHeight}`);
  threeColumnLeaderLineLayer.setAttribute('width', `${gridWidth}`);
  threeColumnLeaderLineLayer.setAttribute('height', `${gridHeight}`);
  threeColumnLeaderLineLayer.style.removeProperty('width');
  threeColumnLeaderLineLayer.style.removeProperty('height');
  threeColumnLeaderLineLayer.setAttribute('preserveAspectRatio', 'none');
  const activeSpecs = [...blueLines, ...yellowLines];
  const activeKeys = new Set(activeSpecs.map((spec) => spec.key));
  defs.classList.add('three-column-layout-static-defs');
  const previousDefs = threeColumnLeaderLineLayer.querySelector('defs.three-column-layout-static-defs');
  if (previousDefs) {
    previousDefs.replaceWith(defs);
  } else {
    threeColumnLeaderLineLayer.prepend(defs);
  }
  let drawDefs = threeColumnLeaderLineLayer.querySelector('defs.three-column-layout-draw-defs');
  if (!drawDefs) {
    drawDefs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    drawDefs.classList.add('three-column-layout-draw-defs');
    threeColumnLeaderLineLayer.prepend(drawDefs);
  }
  const easeDraw = (progress) => progress < 0.5
    ? 2 * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
  const startLeaderArrowDraw = (group, line, spec) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      group.removeAttribute('mask');
      line.setAttribute('marker-end', spec.markerEnd);
      return;
    }
    group.dataset.threeColumnDrawMaskId
      && document.getElementById(group.dataset.threeColumnDrawMaskId)?.remove();
    group.dataset.threeColumnDrawArrowId
      && document.getElementById(group.dataset.threeColumnDrawArrowId)?.remove();
    line.removeAttribute('marker-end');
    const drawToken = `${spec.key}-${window.performance.now().toFixed(3)}`;
    const maskId = `three-column-layout-draw-mask-${spec.key}`;
    const arrowId = `three-column-layout-moving-arrow-${spec.key}`;
    const drawMask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
    drawMask.id = maskId;
    drawMask.setAttribute('maskUnits', 'userSpaceOnUse');
    drawMask.setAttribute('x', '0');
    drawMask.setAttribute('y', '0');
    drawMask.setAttribute('width', gridWidth);
    drawMask.setAttribute('height', gridHeight);
    const maskBackground = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    maskBackground.setAttribute('width', gridWidth);
    maskBackground.setAttribute('height', gridHeight);
    maskBackground.setAttribute('fill', '#000');
    const maskRoute = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    maskRoute.classList.add('three-column-layout-leader-draw-mask');
    maskRoute.setAttribute('d', spec.d);
    drawMask.append(maskBackground, maskRoute);
    drawDefs.appendChild(drawMask);
    const movingArrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    movingArrow.id = arrowId;
    movingArrow.classList.add('three-column-layout-moving-arrow-head');
    movingArrow.setAttribute('points', '-4,-8 4,0 -4,8 -7,5 -2,0 -7,-5');
    movingArrow.setAttribute('fill', spec.arrowColor);
    movingArrow.setAttribute('opacity', '0');
    movingArrow.setAttribute('aria-hidden', 'true');
    group.dataset.threeColumnDrawToken = drawToken;
    group.dataset.threeColumnDrawMaskId = maskId;
    group.dataset.threeColumnDrawArrowId = arrowId;
    group.setAttribute('mask', `url(#${maskId})`);
    threeColumnLeaderLineLayer.appendChild(movingArrow);

    const totalLength = Math.max(1, line.getTotalLength());
    maskRoute.setAttribute('stroke-dasharray', totalLength);
    maskRoute.setAttribute('stroke-dashoffset', totalLength);
    const delay = spec.index * 90;
    const start = window.performance.now() + delay;
    const duration = 820;
    const finishDraw = () => {
      if (group.dataset.threeColumnDrawToken !== drawToken) return;
      group.removeAttribute('mask');
      line.setAttribute('marker-end', spec.markerEnd);
      movingArrow.remove();
      drawMask.remove();
      delete group.dataset.threeColumnDrawToken;
      delete group.dataset.threeColumnDrawMaskId;
      delete group.dataset.threeColumnDrawArrowId;
    };
    const drawFrame = (now) => {
      if (!line.isConnected || group.dataset.threeColumnDrawToken !== drawToken) return;
      const progress = Math.min(1, Math.max(0, (now - start) / duration));
      const eased = easeDraw(progress);
      maskRoute.setAttribute('stroke-dashoffset', totalLength * (1 - eased));
      const distance = totalLength * eased;
      const point = line.getPointAtLength(distance);
      const tangentInset = Math.max(1, totalLength * 0.002);
      const tangentStart = line.getPointAtLength(Math.max(0, distance - tangentInset));
      const tangentEnd = line.getPointAtLength(Math.min(totalLength, distance + tangentInset));
      const angle = Math.atan2(tangentEnd.y - tangentStart.y, tangentEnd.x - tangentStart.x) * 180 / Math.PI;
      movingArrow.setAttribute('transform', `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)}) rotate(${angle.toFixed(2)}) scale(1.875)`);
      movingArrow.setAttribute('opacity', progress > 0.01 && distance >= spec.arrowRevealDistance ? '1' : '0');
      if (progress < 1) {
        window.requestAnimationFrame(drawFrame);
      } else {
        finishDraw();
      }
    };
    window.requestAnimationFrame(drawFrame);
    window.setTimeout(finishDraw, delay + duration + 80);
  };
  activeSpecs.forEach((spec) => {
    let group = threeColumnLeaderLineLayer.querySelector(`[data-three-column-leader-key="${spec.key}"]`);
    let line = group?.querySelector('.three-column-layout-leader-line:not(.three-column-layout-leader-line--halo)');
    let outline = group?.querySelector('.three-column-layout-leader-line--halo');
    const isNew = !group || !line || !outline;
    if (isNew) {
      group?.remove();
      group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.classList.add('three-column-layout-leader-group', spec.className);
      group.setAttribute('data-three-column-leader', `${spec.index + 1}`);
      group.setAttribute('data-three-column-leader-key', spec.key);
      outline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      outline.classList.add('three-column-layout-leader-line', 'three-column-layout-leader-line--halo');
      line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      line.classList.add('three-column-layout-leader-line');
      group.append(outline, line);
      threeColumnLeaderLineLayer.append(group);
    }
    const geometryChanged = line.getAttribute('d') !== spec.d;
    outline.setAttribute('d', spec.d);
    line.setAttribute('d', spec.d);
    line.setAttribute('stroke', spec.stroke);
    if (isNew || (geometryChanged && group.dataset.threeColumnDrawToken)) {
      startLeaderArrowDraw(group, line, spec);
    } else if (group.dataset.threeColumnDrawToken) {
      line.removeAttribute('marker-end');
    } else {
      line.setAttribute('marker-end', spec.markerEnd);
    }
  });
  threeColumnLeaderLineLayer.querySelectorAll('.three-column-layout-leader-group').forEach((group) => {
    if (!activeKeys.has(group.getAttribute('data-three-column-leader-key'))) {
      group.dataset.threeColumnDrawMaskId
        && document.getElementById(group.dataset.threeColumnDrawMaskId)?.remove();
      group.dataset.threeColumnDrawArrowId
        && document.getElementById(group.dataset.threeColumnDrawArrowId)?.remove();
      group.remove();
    }
  });
}

function requestThreeColumnLeaderLineUpdate() {
  if (threeColumnLeaderLineFrame) window.cancelAnimationFrame(threeColumnLeaderLineFrame);
  if (threeColumnLeaderLineTimeout) window.clearTimeout(threeColumnLeaderLineTimeout);
  threeColumnLeaderLineFrame = window.requestAnimationFrame(() => {
    threeColumnLeaderLineFrame = undefined;
    threeColumnLeaderLineTimeout = window.setTimeout(() => {
      threeColumnLeaderLineTimeout = undefined;
      renderThreeColumnLeaderLines();
    }, 120);
  });
}

function clearKcpBootstrapLeaderLines() {
  kcpBootstrapLeaderLineLayer?.remove();
  kcpBootstrapLeaderLineLayer = undefined;
}

function renderKcpBootstrapLeaderLines() {
  const currentSlide = deck.getCurrentSlide();
  if (!currentSlide?.classList.contains('kcp-bootstrap-slide') || deck.isOverview()) {
    clearKcpBootstrapLeaderLines();
    return;
  }

  const grid = currentSlide.querySelector('.kcp-bootstrap-grid');
  const isStep3DeprovisionSlide = currentSlide.classList.contains('kcp-bootstrap-slide--step3-deprovision');
  const isUcpOnlySlide = currentSlide.classList.contains('kcp-bootstrap-slide--ucp-only');
  const firstFileIcon = currentSlide.querySelector('.kcp-bootstrap-file-row--one .kcp-bootstrap-file-icon');
  const secondFileIcon = currentSlide.querySelector('.kcp-bootstrap-file-row--two .kcp-bootstrap-file-icon');
  const thirdFileIcon = currentSlide.querySelector('.kcp-bootstrap-file-row--three .kcp-bootstrap-file-icon');
  const argoIcon = currentSlide.querySelector('.kcp-bootstrap-local-plane-icon--argo');
  const argoAnchor = currentSlide.querySelector('.kcp-bootstrap-local-plane-icon-anchor--argo');
  const crossplaneIcon = currentSlide.querySelector('.kcp-bootstrap-local-plane-icon--crossplane');
  const crossplaneAnchor = currentSlide.querySelector('.kcp-bootstrap-local-plane-icon-anchor--crossplane');
  const firstColumn = currentSlide.querySelector('.kcp-bootstrap-column--one');
  const secondColumn = currentSlide.querySelector('.kcp-bootstrap-column--two');
  const thirdColumn = currentSlide.querySelector('.kcp-bootstrap-column--three');
  const fourthColumn = currentSlide.querySelector('.kcp-bootstrap-column--four');
  const fifthColumn = currentSlide.querySelector('.kcp-bootstrap-column--five');
  const localPlaneShell = currentSlide.querySelector('.kcp-bootstrap-local-plane-shell');
  const ucpPlane = currentSlide.querySelector('.kcp-bootstrap-control-plane');
  const ucpArgoAnchor = currentSlide.querySelector('.kcp-bootstrap-ucp-icon-anchor--argo');
  const ucpCrossplaneAnchor = currentSlide.querySelector('.kcp-bootstrap-ucp-icon-anchor--crossplane');
  if (!grid || !firstFileIcon || !secondFileIcon || !thirdFileIcon || !argoIcon || !argoAnchor || !crossplaneIcon || !crossplaneAnchor || !firstColumn || !secondColumn || !thirdColumn || !fourthColumn || !fifthColumn || !localPlaneShell || !ucpPlane || (isStep3DeprovisionSlide && (!ucpArgoAnchor || !ucpCrossplaneAnchor))) {
    clearKcpBootstrapLeaderLines();
    return;
  }

  if (!kcpBootstrapLeaderLineLayer || kcpBootstrapLeaderLineLayer.parentElement !== grid) {
    clearKcpBootstrapLeaderLines();
    kcpBootstrapLeaderLineLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    kcpBootstrapLeaderLineLayer.classList.add('cicd-pipeline-lines-layer', 'kcp-bootstrap-lines-layer');
    kcpBootstrapLeaderLineLayer.setAttribute('aria-hidden', 'true');
    kcpBootstrapLeaderLineLayer.innerHTML = `
      <defs>
        <marker id="kcp-bootstrap-pipeline-arrow-blue" viewBox="-8 -8 16 16" markerWidth="30" markerHeight="30" refX="-2" refY="0" orient="auto" markerUnits="userSpaceOnUse">
          <polygon class="kcp-bootstrap-arrow-head kcp-bootstrap-arrow-head--blue" points="-4,-8 4,0 -4,8 -7,5 -2,0 -7,-5"></polygon>
        </marker>
        <marker id="kcp-bootstrap-pipeline-arrow-yellow" viewBox="-8 -8 16 16" markerWidth="30" markerHeight="30" refX="-2" refY="0" orient="auto" markerUnits="userSpaceOnUse">
          <polygon class="kcp-bootstrap-arrow-head kcp-bootstrap-arrow-head--yellow" points="-4,-8 4,0 -4,8 -7,5 -2,0 -7,-5"></polygon>
        </marker>
        <marker id="kcp-bootstrap-pipeline-arrow-turquoise" viewBox="-8 -8 16 16" markerWidth="30" markerHeight="30" refX="-2" refY="0" orient="auto" markerUnits="userSpaceOnUse">
          <polygon class="kcp-bootstrap-arrow-head kcp-bootstrap-arrow-head--turquoise" points="-4,-8 4,0 -4,8 -7,5 -2,0 -7,-5"></polygon>
        </marker>
        <marker id="kcp-bootstrap-pipeline-arrow-grey" viewBox="-8 -8 16 16" markerWidth="30" markerHeight="30" refX="-2" refY="0" orient="auto" markerUnits="userSpaceOnUse">
          <polygon class="kcp-bootstrap-arrow-head kcp-bootstrap-arrow-head--grey" points="-4,-8 4,0 -4,8 -7,5 -2,0 -7,-5"></polygon>
        </marker>
      </defs>
    `;
    grid.appendChild(kcpBootstrapLeaderLineLayer);
  }

  const gridRect = grid.getBoundingClientRect();
  const rectPoint = (rect, xFactor, yFactor) => ({
    x: rect.left - gridRect.left + rect.width * xFactor,
    y: rect.top - gridRect.top + rect.height * yFactor
  });
  const firstFileRect = firstFileIcon.getBoundingClientRect();
  const secondFileRect = secondFileIcon.getBoundingClientRect();
  const thirdFileRect = thirdFileIcon.getBoundingClientRect();
  const argoIconRect = argoIcon.getBoundingClientRect();
  const argoRect = argoAnchor.getBoundingClientRect();
  const crossplaneIconRect = crossplaneIcon.getBoundingClientRect();
  const crossplaneRect = crossplaneAnchor.getBoundingClientRect();
  const firstColumnRect = firstColumn.getBoundingClientRect();
  const secondColumnRect = secondColumn.getBoundingClientRect();
  const thirdRect = thirdColumn.getBoundingClientRect();
  const fourthColumnRect = fourthColumn.getBoundingClientRect();
  const fifthRect = fifthColumn.getBoundingClientRect();
  const shellRect = localPlaneShell.getBoundingClientRect();
  const ucpRect = ucpPlane.getBoundingClientRect();
  const ucpArgoRect = ucpArgoAnchor?.getBoundingClientRect();
  const ucpCrossplaneRect = ucpCrossplaneAnchor?.getBoundingClientRect();

  const firstFileStart = rectPoint(firstFileRect, 1, 0.5);
  const secondFileStart = rectPoint(secondFileRect, 1, 0.5);
  const thirdFileStart = rectPoint(thirdFileRect, 1, 0.5);
  const argoIconLeft = rectPoint(argoIconRect, 0, 0.5);
  const argoBottom = rectPoint(argoRect, 0.5, 1);
  const crossplaneTop = rectPoint(crossplaneRect, 0.5, 0);
  const crossplaneIconRight = rectPoint(crossplaneIconRect, 1, 0.5);
  const firstColumnRight = firstColumnRect.right - gridRect.left;
  const secondColumnCenter = secondColumnRect.left - gridRect.left + secondColumnRect.width / 2;
  const thirdRight = thirdRect.right - gridRect.left;
  const fourthColumnCenter = fourthColumnRect.left - gridRect.left + fourthColumnRect.width / 2;
  const shellLeft = shellRect.left - gridRect.left;
  const ucpLeft = ucpRect.left - gridRect.left;
  const argoHorizontalTarget = {
    x: argoIconLeft.x,
    y: firstFileStart.y
  };
  const thirdBorder = {
    x: shellLeft,
    y: secondFileStart.y
  };
  const fifthBorder = {
    x: ucpLeft,
    y: crossplaneIconRight.y
  };
  const ucpArgoBottom = ucpArgoRect ? rectPoint(ucpArgoRect, 0.5, 1) : null;
  const ucpCrossplaneTop = ucpCrossplaneRect ? rectPoint(ucpCrossplaneRect, 0.5, 0) : null;
  const ucpCrossplaneLeft = ucpCrossplaneRect ? rectPoint(ucpCrossplaneRect, 0, 0.5) : null;

  const arrowEndpointInset = 16;
  const shortenLineEnd = (from, to, inset = arrowEndpointInset) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.hypot(dx, dy) || 1;
    if (length <= inset) return to;
    return {
      x: to.x - (dx / length) * inset,
      y: to.y - (dy / length) * inset
    };
  };
  const shortenCubicEnd = (startPoint, control1, control2, endPoint, inset = arrowEndpointInset) => {
    const tangentX = endPoint.x - control2.x;
    const tangentY = endPoint.y - control2.y;
    const tangentLength = Math.hypot(tangentX, tangentY) || 1;
    return {
      x: endPoint.x - (tangentX / tangentLength) * inset,
      y: endPoint.y - (tangentY / tangentLength) * inset
    };
  };
  const cubicPath = (startPoint, control1, control2, endPoint) => {
    const shortenedEnd = shortenCubicEnd(startPoint, control1, control2, endPoint);
    return `M ${startPoint.x.toFixed(2)} ${startPoint.y.toFixed(2)} C ${control1.x.toFixed(2)} ${control1.y.toFixed(2)} ${control2.x.toFixed(2)} ${control2.y.toFixed(2)} ${shortenedEnd.x.toFixed(2)} ${shortenedEnd.y.toFixed(2)}`;
  };
  const linePath = (startPoint, endPoint) => {
    const shortenedEnd = shortenLineEnd(startPoint, endPoint);
    return `M ${startPoint.x.toFixed(2)} ${startPoint.y.toFixed(2)} L ${shortenedEnd.x.toFixed(2)} ${shortenedEnd.y.toFixed(2)}`;
  };
  const smoothBridgePath = (startPoint, secondColumnX, fourthColumnX, underBoxY, targetPoint) => {
    const radius = 58;
    const kappa = 0.5522847498;
    const k = radius * kappa;
    const firstTurnStartX = secondColumnX - radius;
    const straightStartX = secondColumnX + radius;
    const finalTurnStartX = fourthColumnX - radius;
    return [
      `M ${startPoint.x.toFixed(2)} ${startPoint.y.toFixed(2)}`,
      `L ${firstTurnStartX.toFixed(2)} ${startPoint.y.toFixed(2)}`,
      `C ${(firstTurnStartX + k).toFixed(2)} ${startPoint.y.toFixed(2)} ${secondColumnX.toFixed(2)} ${(startPoint.y + radius - k).toFixed(2)} ${secondColumnX.toFixed(2)} ${(startPoint.y + radius).toFixed(2)}`,
      `L ${secondColumnX.toFixed(2)} ${(underBoxY - radius).toFixed(2)}`,
      `C ${secondColumnX.toFixed(2)} ${(underBoxY - radius + k).toFixed(2)} ${(straightStartX - k).toFixed(2)} ${underBoxY.toFixed(2)} ${straightStartX.toFixed(2)} ${underBoxY.toFixed(2)}`,
      `L ${finalTurnStartX.toFixed(2)} ${underBoxY.toFixed(2)}`,
      `C ${(finalTurnStartX + k).toFixed(2)} ${underBoxY.toFixed(2)} ${fourthColumnX.toFixed(2)} ${(underBoxY - radius + k).toFixed(2)} ${fourthColumnX.toFixed(2)} ${(underBoxY - radius).toFixed(2)}`,
      `L ${fourthColumnX.toFixed(2)} ${targetPoint.y.toFixed(2)}`
    ].join(' ');
  };
  const easeDraw = (t) => t < 0.5
    ? 2 * t * t
    : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const addDrawMask = (group, route, line, length) => {
    const defs = kcpBootstrapLeaderLineLayer.querySelector('defs');
    if (!defs) return;
    group.dataset.cicdDrawMaskId && document.getElementById(group.dataset.cicdDrawMaskId)?.remove();
    group.dataset.cicdDrawArrowId && document.getElementById(group.dataset.cicdDrawArrowId)?.remove();
    line.removeAttribute('marker-end');

    const maskId = `kcp-bootstrap-draw-mask-${route.id.replace(/[^a-z0-9_-]/gi, '-')}`;
    const drawMask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
    drawMask.id = maskId;
    drawMask.setAttribute('maskUnits', 'userSpaceOnUse');
    drawMask.setAttribute('x', '0');
    drawMask.setAttribute('y', '0');
    drawMask.setAttribute('width', gridRect.width);
    drawMask.setAttribute('height', gridRect.height);
    const maskBackground = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    maskBackground.setAttribute('width', gridRect.width);
    maskBackground.setAttribute('height', gridRect.height);
    maskBackground.setAttribute('fill', '#000');
    const maskRoute = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    maskRoute.setAttribute('d', line.getAttribute('d') || '');
    maskRoute.setAttribute('fill', 'none');
    maskRoute.setAttribute('stroke', '#fff');
    maskRoute.setAttribute('stroke-width', '40');
    maskRoute.setAttribute('stroke-linecap', 'butt');
    maskRoute.setAttribute('stroke-dasharray', length);
    maskRoute.setAttribute('stroke-dashoffset', length);
    drawMask.append(maskBackground, maskRoute);
    defs.appendChild(drawMask);

    const drawToken = `${maskId}-${window.performance.now().toFixed(3)}`;
    group.dataset.cicdDrawMaskId = maskId;
    group.dataset.cicdDrawToken = drawToken;
    group.classList.add('cicd-pipeline-group--drawing');
    group.setAttribute('mask', `url(#${maskId})`);

    const movingArrow = route.marker
      ? document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
      : null;
    if (movingArrow) {
      const arrowId = `${maskId}-moving-arrow`;
      movingArrow.id = arrowId;
      movingArrow.classList.add('kcp-bootstrap-moving-arrow-head');
      movingArrow.setAttribute('points', '-4,-8 4,0 -4,8 -7,5 -2,0 -7,-5');
      movingArrow.setAttribute('fill', route.stroke);
      movingArrow.setAttribute('aria-hidden', 'true');
      group.dataset.cicdDrawArrowId = arrowId;
      kcpBootstrapLeaderLineLayer.appendChild(movingArrow);
    }

    const start = window.performance.now();
    const duration = 760;
    const finishDraw = () => {
      if (group.dataset.cicdDrawMaskId !== maskId || group.dataset.cicdDrawToken !== drawToken) return;
      group.removeAttribute('mask');
      group.classList.remove('cicd-pipeline-group--drawing');
      if (route.marker) {
        line.setAttribute('marker-end', route.marker);
      } else {
        line.removeAttribute('marker-end');
      }
      movingArrow?.remove();
      delete group.dataset.cicdDrawMaskId;
      delete group.dataset.cicdDrawToken;
      delete group.dataset.cicdDrawArrowId;
      drawMask.remove();
    };
    const drawFrame = (now) => {
      if (!drawMask.isConnected || group.dataset.cicdDrawMaskId !== maskId || group.dataset.cicdDrawToken !== drawToken) return;
      const progress = Math.min(1, Math.max(0, (now - start) / duration));
      const eased = easeDraw(progress);
      maskRoute.setAttribute('stroke-dashoffset', length * (1 - eased));
      if (movingArrow && line.getPointAtLength) {
        const distance = Math.min(length, Math.max(0, length * eased));
        const point = line.getPointAtLength(distance);
        const tangentInset = Math.max(1, length * 0.002);
        const tangentStart = line.getPointAtLength(Math.max(0, distance - tangentInset));
        const tangentEnd = line.getPointAtLength(Math.min(length, distance + tangentInset));
        const angle = Math.atan2(tangentEnd.y - tangentStart.y, tangentEnd.x - tangentStart.x) * 180 / Math.PI;
        movingArrow.setAttribute('transform', `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)}) rotate(${angle.toFixed(2)}) scale(1.875)`);
        movingArrow.setAttribute('opacity', progress > 0.01 ? '1' : '0');
      }
      if (progress < 1) {
        window.requestAnimationFrame(drawFrame);
      } else {
        finishDraw();
      }
    };
    window.requestAnimationFrame(drawFrame);
    window.setTimeout(finishDraw, duration + 80);
  };

  const blueColor = getComputedStyle(document.documentElement).getPropertyValue('--capgemini-light-blue').trim() || '#1db8f2';
  const yellowColor = getComputedStyle(document.documentElement).getPropertyValue('--capgemini-yellow').trim() || '#feb100';
  const turquoiseColor = getComputedStyle(document.documentElement).getPropertyValue('--capgemini-turquoise').trim() || '#00d5d0';
  const greyColor = '#4c525b';
  const localFragmentVisible = currentSlide.querySelector('.kcp-bootstrap-fragment-local')?.classList.contains('visible');
  const isUcpStartSlide = currentSlide.classList.contains('kcp-bootstrap-slide--ucp-start');
  const ucpFragmentVisible = isUcpStartSlide
    || currentSlide.querySelector('.kcp-bootstrap-fragment-ucp')?.classList.contains('visible');
  const blueRoutesVisible = localFragmentVisible && !isUcpStartSlide;
  kcpBootstrapLeaderLineLayer.querySelector('.kcp-bootstrap-arrow-head--blue')?.setAttribute('fill', blueColor);
  kcpBootstrapLeaderLineLayer.querySelector('.kcp-bootstrap-arrow-head--yellow')?.setAttribute('fill', yellowColor);
  kcpBootstrapLeaderLineLayer.querySelector('.kcp-bootstrap-arrow-head--turquoise')?.setAttribute('fill', turquoiseColor);
  kcpBootstrapLeaderLineLayer.querySelector('.kcp-bootstrap-arrow-head--grey')?.setAttribute('fill', greyColor);
  kcpBootstrapLeaderLineLayer.setAttribute('viewBox', `0 0 ${gridRect.width} ${gridRect.height}`);
  kcpBootstrapLeaderLineLayer.setAttribute('preserveAspectRatio', 'none');

  const crossplaneToFifthRoute = (id, verticalOffset = 0, options = {}) => {
    const isEdgeRoute = options.fromThirdEdge === true;
    const strokeColor = isEdgeRoute ? turquoiseColor : yellowColor;
    const markerId = isEdgeRoute
      ? 'url(#kcp-bootstrap-pipeline-arrow-turquoise)'
      : 'url(#kcp-bootstrap-pipeline-arrow-yellow)';
    const start = {
      x: isEdgeRoute ? thirdRight : crossplaneIconRight.x,
      y: crossplaneIconRight.y + verticalOffset
    };
    const end = {
      x: fifthBorder.x,
      y: fifthBorder.y + verticalOffset
    };
    return {
      id,
      className: isEdgeRoute ? 'kcp-bootstrap-line-group--turquoise' : 'kcp-bootstrap-line-group--yellow',
      stroke: strokeColor,
      marker: markerId,
      revealAxis: 'x',
      visible: ucpFragmentVisible,
      d: cubicPath(
        start,
        { x: start.x + 112, y: start.y },
        { x: end.x - 112, y: end.y },
        end
      )
    };
  };
  const secondFileToBottomTurquoiseRoute = () => {
    const bottomLineStart = { x: thirdRight, y: fifthBorder.y + 48 };
    const bottomLineEnd = { x: fifthBorder.x, y: fifthBorder.y + 48 };
    const target = {
      x: (bottomLineStart.x + bottomLineEnd.x) / 2,
      y: bottomLineStart.y
    };
    const underThirdBoxY = thirdRect.bottom - gridRect.top + 72;
    return {
      id: 'second-file-to-bottom-turquoise-midpoint',
      className: 'kcp-bootstrap-line-group--turquoise',
      stroke: turquoiseColor,
      marker: null,
      endDot: { x: target.x, y: target.y, radius: 13 },
      revealAxis: 'x',
      visible: isUcpStartSlide,
      d: smoothBridgePath(secondFileStart, secondColumnCenter, fourthColumnCenter, underThirdBoxY, target)
    };
  };

  const ucpSelfLoopPath = (anchor) => {
    const loopAnchor = { x: anchor.x - 42, y: anchor.y };
    const gap = 42;
    const radiusX = 126;
    const radiusY = 82;
    const outerX = loopAnchor.x - radiusX;
    const start = { x: loopAnchor.x, y: loopAnchor.y - gap / 2 };
    const end = { x: loopAnchor.x, y: loopAnchor.y + gap / 2 };
    return [
      `M ${start.x.toFixed(2)} ${start.y.toFixed(2)}`,
      `C ${(loopAnchor.x - 38).toFixed(2)} ${(loopAnchor.y - radiusY).toFixed(2)} ${outerX.toFixed(2)} ${(loopAnchor.y - radiusY).toFixed(2)} ${outerX.toFixed(2)} ${loopAnchor.y.toFixed(2)}`,
      `C ${outerX.toFixed(2)} ${(loopAnchor.y + radiusY).toFixed(2)} ${(loopAnchor.x - 38).toFixed(2)} ${(loopAnchor.y + radiusY).toFixed(2)} ${end.x.toFixed(2)} ${end.y.toFixed(2)}`
    ].join(' ');
  };
  const ucpCrossplaneEdgeTarget = ucpCrossplaneLeft ? { x: ucpLeft, y: ucpCrossplaneLeft.y } : null;
  const ucpCrossplaneEdgeLineEnd = ucpCrossplaneLeft && ucpCrossplaneEdgeTarget
    ? shortenLineEnd(ucpCrossplaneLeft, ucpCrossplaneEdgeTarget)
    : null;

  const ucpManagementRoutes = [
    ...(ucpArgoBottom && ucpCrossplaneTop
      ? [{
          id: 'ucp-argo-to-crossplane',
          className: 'kcp-bootstrap-line-group--yellow',
          stroke: yellowColor,
          marker: 'url(#kcp-bootstrap-pipeline-arrow-yellow)',
          revealAxis: 'y',
          visible: true,
          d: linePath(ucpArgoBottom, ucpCrossplaneTop)
        }]
      : []),
    ...(ucpCrossplaneLeft && ucpCrossplaneEdgeTarget && ucpCrossplaneEdgeLineEnd
      ? [
          {
            id: 'ucp-crossplane-to-left-edge',
            className: 'kcp-bootstrap-line-group--yellow',
            stroke: yellowColor,
            marker: 'url(#kcp-bootstrap-pipeline-arrow-yellow)',
            revealAxis: 'x',
            visible: true,
            d: linePath(ucpCrossplaneLeft, ucpCrossplaneEdgeTarget)
          },
          {
            id: 'ucp-self-manage-loop',
            className: 'kcp-bootstrap-line-group--yellow',
            stroke: yellowColor,
            marker: 'url(#kcp-bootstrap-pipeline-arrow-yellow)',
            revealAxis: 'x',
            visible: true,
            d: ucpSelfLoopPath(ucpCrossplaneEdgeLineEnd)
          }
        ]
      : [])
  ];

  const step3Routes = [
    {
      id: 'third-file-to-third-column-deprovision',
      className: 'kcp-bootstrap-line-group--grey',
      stroke: greyColor,
      marker: 'url(#kcp-bootstrap-pipeline-arrow-grey)',
      revealAxis: 'x',
      visible: true,
      d: cubicPath(
        thirdFileStart,
        { x: thirdFileStart.x + 145, y: thirdFileStart.y },
        { x: shellLeft - 125, y: thirdFileStart.y },
        { x: shellLeft, y: thirdFileStart.y }
      )
    },
    ...ucpManagementRoutes
  ];

  const routes = isUcpOnlySlide ? ucpManagementRoutes : isStep3DeprovisionSlide ? step3Routes : [
    {
      id: 'file-to-argo',
      className: 'kcp-bootstrap-line-group--blue',
      stroke: blueColor,
      marker: 'url(#kcp-bootstrap-pipeline-arrow-blue)',
      revealAxis: 'x',
      visible: blueRoutesVisible,
      d: linePath(firstFileStart, argoHorizontalTarget)
    },
    {
      id: 'file-to-third-column',
      className: 'kcp-bootstrap-line-group--blue',
      stroke: blueColor,
      marker: 'url(#kcp-bootstrap-pipeline-arrow-blue)',
      revealAxis: 'x',
      visible: blueRoutesVisible,
      d: cubicPath(
        firstFileStart,
        { x: firstFileStart.x + 145, y: firstFileStart.y },
        { x: thirdBorder.x - 125, y: thirdBorder.y },
        thirdBorder
      )
    },
    {
      id: 'argo-to-crossplane',
      className: 'kcp-bootstrap-line-group--yellow',
      stroke: yellowColor,
      marker: 'url(#kcp-bootstrap-pipeline-arrow-yellow)',
      revealAxis: 'y',
      visible: ucpFragmentVisible,
      d: linePath(argoBottom, crossplaneTop)
    },
    ...(isUcpStartSlide
      ? [
          crossplaneToFifthRoute('crossplane-to-fifth-column'),
          ...[-288, -240, -192, -144, -96, -48, 48].map((offset, index) => crossplaneToFifthRoute(`third-edge-to-fifth-column-${index + 1}`, offset, { fromThirdEdge: true })),
          secondFileToBottomTurquoiseRoute()
        ]
      : [crossplaneToFifthRoute('crossplane-to-fifth-column')])
  ];

  const visibleRoutes = routes.filter((route) => route.visible);
  const activeIds = new Set(visibleRoutes.map((route) => route.id));
  visibleRoutes.forEach((route) => {
    let group = kcpBootstrapLeaderLineLayer.querySelector(`[data-kcp-bootstrap-route="${route.id}"]`);
    let outline = group?.querySelector('.cicd-pipeline-line-outline');
    let line = group?.querySelector('.cicd-pipeline-line');
    let endDot = group?.querySelector('.kcp-bootstrap-line-end-dot');
    const isNew = !group || !line || !outline;
    if (!group || !line || !outline) {
      group = group || document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.classList.add('cicd-pipeline-group', 'kcp-bootstrap-line-group', route.className);
      group.dataset.kcpBootstrapRoute = route.id;
      outline?.remove();
      line?.remove();
      outline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      outline.classList.add('cicd-pipeline-line-outline', 'cicd-pipeline-line-path');
      line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      line.classList.add('cicd-pipeline-line', 'cicd-pipeline-line-path');
      group.append(outline, line);
      if (!group.parentElement) kcpBootstrapLeaderLineLayer.append(group);
    }
    group.classList.toggle('kcp-bootstrap-line-group--blue', route.className === 'kcp-bootstrap-line-group--blue');
    group.classList.toggle('kcp-bootstrap-line-group--yellow', route.className === 'kcp-bootstrap-line-group--yellow');
    group.classList.toggle('kcp-bootstrap-line-group--turquoise', route.className === 'kcp-bootstrap-line-group--turquoise');
    group.classList.toggle('kcp-bootstrap-line-group--grey', route.className === 'kcp-bootstrap-line-group--grey');
    outline.setAttribute('d', route.d);
    outline.setAttribute('stroke', 'rgba(4, 13, 34, 0.72)');
    line.setAttribute('d', route.d);
    line.setAttribute('stroke', route.stroke);
    if (group.classList.contains('cicd-pipeline-group--drawing')) {
      line.removeAttribute('marker-end');
    } else if (route.marker) {
      line.setAttribute('marker-end', route.marker);
    } else {
      line.removeAttribute('marker-end');
    }
    if (route.endDot) {
      if (!endDot) {
        endDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        endDot.classList.add('kcp-bootstrap-line-end-dot');
        group.append(endDot);
      }
      endDot.setAttribute('cx', route.endDot.x.toFixed(2));
      endDot.setAttribute('cy', route.endDot.y.toFixed(2));
      endDot.setAttribute('r', String(route.endDot.radius));
      endDot.setAttribute('fill', route.stroke);
      endDot.setAttribute('stroke', 'rgba(4, 13, 34, 0.82)');
      endDot.setAttribute('stroke-width', '4');
    } else {
      endDot?.remove();
    }
    if (isNew && !isUcpStartSlide) {
      addDrawMask(group, route, line, line.getTotalLength ? line.getTotalLength() : 1);
    }
  });
  kcpBootstrapLeaderLineLayer.querySelectorAll('.kcp-bootstrap-line-group[data-kcp-bootstrap-route]').forEach((group) => {
    if (!activeIds.has(group.dataset.kcpBootstrapRoute)) {
      group.dataset.cicdDrawMaskId && document.getElementById(group.dataset.cicdDrawMaskId)?.remove();
      delete group.dataset.cicdDrawMaskId;
      delete group.dataset.cicdDrawToken;
      group.dataset.cicdDrawArrowId && document.getElementById(group.dataset.cicdDrawArrowId)?.remove();
      delete group.dataset.cicdDrawArrowId;
      group.remove();
    }
  });
}

function requestKcpBootstrapLeaderLineUpdate() {
  if (kcpBootstrapLeaderLineFrame) window.cancelAnimationFrame(kcpBootstrapLeaderLineFrame);
  if (kcpBootstrapLeaderLineTimeout) window.clearTimeout(kcpBootstrapLeaderLineTimeout);
  kcpBootstrapLeaderLineFrame = window.requestAnimationFrame(() => {
    kcpBootstrapLeaderLineFrame = window.requestAnimationFrame(() => {
      kcpBootstrapLeaderLineFrame = undefined;
      renderKcpBootstrapLeaderLines();
    });
  });
  window.setTimeout(renderKcpBootstrapLeaderLines, 160);
  kcpBootstrapLeaderLineTimeout = window.setTimeout(() => {
    kcpBootstrapLeaderLineTimeout = undefined;
    renderKcpBootstrapLeaderLines();
  }, 420);
}

function trackKcpBootstrapLeaderLinesDuringAutoAnimate() {
  if (kcpBootstrapAutoAnimateFrame) window.cancelAnimationFrame(kcpBootstrapAutoAnimateFrame);
  const slide = deck.getCurrentSlide();
  if (!slide?.classList.contains('kcp-bootstrap-slide')) return;

  const configuredDuration = Number.parseFloat(slide.dataset.autoAnimateDuration);
  const duration = (Number.isFinite(configuredDuration)
    ? configuredDuration
    : deck.getConfig().autoAnimateDuration || 1) * 1000;
  const start = window.performance.now();

  const update = (now) => {
    if (deck.getCurrentSlide() !== slide) {
      kcpBootstrapAutoAnimateFrame = undefined;
      return;
    }
    renderKcpBootstrapLeaderLines();
    if (now - start <= duration + 80) {
      kcpBootstrapAutoAnimateFrame = window.requestAnimationFrame(update);
    } else {
      kcpBootstrapAutoAnimateFrame = undefined;
      requestKcpBootstrapLeaderLineUpdate();
    }
  };

  kcpBootstrapAutoAnimateFrame = window.requestAnimationFrame(update);
}

function clearKcpPlatformConnections() {
  kcpPlatformConnectionLayer?.remove();
  kcpPlatformConnectionLayer = undefined;
  kcpPlatformConnectionSignature = undefined;
}

function renderKcpPlatformConnections() {
  const slide = getCurrentSlide();
  if (!slide?.classList.contains('kcp-platform-layout-slide')) {
    clearKcpPlatformConnections();
    return;
  }
  const grid = slide.querySelector('.kcp-platform-layout-grid');
  const ucpBox = slide.querySelector('.kcp-platform-layout-ucp-box');
  const ucpIcons = Array.from(slide.querySelectorAll('.kcp-platform-ucp-icon-row img'));
  const argoIcon = slide.querySelector('.kcp-platform-ucp-icon-row img[alt="Argo CD"]');
  const lowerBoxes = Array.from(slide.querySelectorAll('.kcp-platform-lower-box'));
  const githubBox = slide.querySelector('.kcp-platform-lower-box[aria-label="GitHub source control"]');
  const githubFileRow = githubBox?.querySelector('.kcp-platform-github-file-row');
  const backstageBox = slide.querySelector('.kcp-platform-lower-box[aria-label="Port.io developer portal"]');
  const providerBox = (name) => slide.querySelector(`.content-split-target-box--${name}`);
  const awsBadge = providerBox('aws')?.querySelector('.content-split-box-badge');
  const gcpBadge = providerBox('gcp')?.querySelector('.content-split-box-badge');
  const azureBadge = providerBox('azure')?.querySelector('.content-split-box-badge');
  if (!grid || !ucpBox || !argoIcon || !githubBox || !githubFileRow || !backstageBox || !awsBadge || !gcpBadge || !azureBadge) {
    clearKcpPlatformConnections();
    return;
  }

  if (!kcpPlatformConnectionLayer || kcpPlatformConnectionLayer.parentElement !== grid) {
    clearKcpPlatformConnections();
    kcpPlatformConnectionLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    kcpPlatformConnectionLayer.classList.add('kcp-platform-connection-layer');
    kcpPlatformConnectionLayer.setAttribute('aria-hidden', 'true');
    grid.appendChild(kcpPlatformConnectionLayer);
  }

  const gridRect = grid.getBoundingClientRect();
  const argoRect = argoIcon.getBoundingClientRect();
  const ucpRect = ucpBox.getBoundingClientRect();
  const githubRect = githubBox.getBoundingClientRect();
  const githubFileRowRect = githubFileRow.getBoundingClientRect();
  const backstageRect = backstageBox.getBoundingClientRect();
  const awsBadgeRect = awsBadge.getBoundingClientRect();
  const gcpBadgeRect = gcpBadge.getBoundingClientRect();
  const azureBadgeRect = azureBadge.getBoundingClientRect();
  const geometrySignature = [
    gridRect,
    argoRect,
    ucpRect,
    githubRect,
    githubFileRowRect,
    backstageRect,
    awsBadgeRect,
    gcpBadgeRect,
    azureBadgeRect,
  ].flatMap((rect) => [rect.left, rect.top, rect.width, rect.height])
    .map((value) => value.toFixed(2))
    .join('|');
  if (kcpPlatformConnectionSignature === geometrySignature && kcpPlatformConnectionLayer.childElementCount > 0) {
    return;
  }
  kcpPlatformConnectionSignature = geometrySignature;
  kcpPlatformConnectionLayer.setAttribute('viewBox', `0 0 ${gridRect.width.toFixed(2)} ${gridRect.height.toFixed(2)}`);
  kcpPlatformConnectionLayer.setAttribute('width', gridRect.width.toFixed(2));
  kcpPlatformConnectionLayer.setAttribute('height', gridRect.height.toFixed(2));

  const pt = (x, y) => ({ x: x - gridRect.left, y: y - gridRect.top });
  const ucpIconCenters = ucpIcons.map((icon) => {
    const rect = icon.getBoundingClientRect();
    return pt(rect.left + rect.width * 0.5, gcpBadgeRect.top + gcpBadgeRect.height * 0.5);
  });
  const argoCenter = pt(argoRect.left + argoRect.width * 0.5, gcpBadgeRect.top + gcpBadgeRect.height * 0.5);
  const backstageTop = pt(backstageRect.left + backstageRect.width * 0.5, backstageRect.top);
  const backstageLeft = pt(backstageRect.left, backstageRect.top + backstageRect.height * 0.5);
  const githubRight = pt(githubRect.right, githubRect.top + githubRect.height * 0.5);
  const githubFileTarget = pt(
    argoRect.left + argoRect.width * 0.5,
    githubFileRowRect.top - Math.max(20, githubRect.height * 0.07)
  );
  const ucpBottom = pt(ucpRect.left + ucpRect.width * 0.5, ucpRect.bottom);
  const ucpRight = pt(ucpRect.right, ucpRect.top + ucpRect.height * 0.5);
  const awsBadgeLeft = pt(awsBadgeRect.left, awsBadgeRect.top + awsBadgeRect.height * 0.5);
  const gcpBadgeLeft = pt(gcpBadgeRect.left, gcpBadgeRect.top + gcpBadgeRect.height * 0.5);
  const azureBadgeLeft = pt(azureBadgeRect.left, azureBadgeRect.top + azureBadgeRect.height * 0.5);
  const staticOffsets = [-34, 0, 34];
  const dashedOffsets = [-32, 0, 32];
  const squareSize = 18;
  const arrowTipCompensation = 11.25;

  kcpPlatformConnectionLayer.replaceChildren();
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const addArrow2Marker = (id, fill) => {
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', id);
    marker.setAttribute('viewBox', '-8 -8 16 16');
    marker.setAttribute('refX', '-2');
    marker.setAttribute('refY', '0');
    marker.setAttribute('markerWidth', '30');
    marker.setAttribute('markerHeight', '30');
    marker.setAttribute('orient', 'auto');
    marker.setAttribute('markerUnits', 'userSpaceOnUse');
    const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    arrowPath.setAttribute('points', '-4,-8 4,0 -4,8 -7,5 -2,0 -7,-5');
    arrowPath.setAttribute('fill', fill);
    marker.appendChild(arrowPath);
    defs.appendChild(marker);
  };
  addArrow2Marker('kcp-platform-arrow2-yellow', 'var(--capgemini-yellow)');
  addArrow2Marker('kcp-platform-arrow2-grey', '#4c525b');

  const betweenBoxesClip = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
  betweenBoxesClip.setAttribute('id', 'kcp-platform-between-boxes-clip');
  betweenBoxesClip.setAttribute('clipPathUnits', 'userSpaceOnUse');
  const betweenBoxesMask = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const relativeRect = (rect) => ({
    left: rect.left - gridRect.left,
    top: rect.top - gridRect.top,
    right: rect.right - gridRect.left,
    bottom: rect.bottom - gridRect.top,
  });
  const ucpBounds = relativeRect(ucpRect);
  const githubBounds = relativeRect(githubRect);
  betweenBoxesMask.setAttribute('d', [
    `M 0 0 H ${gridRect.width.toFixed(2)} V ${gridRect.height.toFixed(2)} H 0 Z`,
    `M ${ucpBounds.left.toFixed(2)} ${ucpBounds.top.toFixed(2)} H ${ucpBounds.right.toFixed(2)} V ${ucpBounds.bottom.toFixed(2)} H ${ucpBounds.left.toFixed(2)} Z`,
    `M ${githubBounds.left.toFixed(2)} ${githubBounds.top.toFixed(2)} H ${githubBounds.right.toFixed(2)} V ${githubBounds.bottom.toFixed(2)} H ${githubBounds.left.toFixed(2)} Z`,
  ].join(' '));
  betweenBoxesMask.setAttribute('fill-rule', 'evenodd');
  betweenBoxesMask.setAttribute('clip-rule', 'evenodd');
  betweenBoxesClip.appendChild(betweenBoxesMask);
  defs.appendChild(betweenBoxesClip);
  kcpPlatformConnectionLayer.appendChild(defs);
  staticOffsets.forEach((offset, index) => {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.dataset.kcpPlatformRoute = `backstage-to-ucp-double-${index + 1}`;
    const start = { x: backstageTop.x + offset, y: backstageTop.y };
    const end = { x: start.x, y: ucpBottom.y };
    [-6, 6].forEach((parallelOffset) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.classList.add('kcp-platform-static-double-line');
      path.setAttribute('d', `M ${(start.x + parallelOffset).toFixed(2)} ${start.y.toFixed(2)} L ${(end.x + parallelOffset).toFixed(2)} ${end.y.toFixed(2)}`);
      group.appendChild(path);
    });
    [start, end].forEach((point) => {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.classList.add('kcp-platform-static-line-square');
      rect.setAttribute('x', (point.x - squareSize / 2).toFixed(2));
      rect.setAttribute('y', (point.y - squareSize / 2).toFixed(2));
      rect.setAttribute('width', String(squareSize));
      rect.setAttribute('height', String(squareSize));
      rect.setAttribute('transform', `rotate(45 ${point.x.toFixed(2)} ${point.y.toFixed(2)})`);
      group.appendChild(rect);
    });
    kcpPlatformConnectionLayer.appendChild(group);
  });

  dashedOffsets.forEach((offset, index) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.classList.add('cicd-pipeline-line', 'cicd-pipeline-line-path', 'kcp-platform-dashed-line');
    path.dataset.kcpPlatformRoute = `backstage-to-github-dashed-${index + 1}`;
    const start = { x: backstageLeft.x, y: backstageLeft.y + offset };
    const end = { x: githubRight.x + arrowTipCompensation, y: githubRight.y + offset };
    path.setAttribute('d', `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} C ${(start.x - 90).toFixed(2)} ${start.y.toFixed(2)}, ${(end.x + 90).toFixed(2)} ${end.y.toFixed(2)}, ${end.x.toFixed(2)} ${end.y.toFixed(2)}`);
    path.setAttribute('marker-end', 'url(#kcp-platform-arrow2-yellow)');
    path.style.animationDelay = `${index * -0.28}s`;
    kcpPlatformConnectionLayer.appendChild(path);
  });

  const providerStart = { x: ucpRight.x, y: gcpBadgeLeft.y };
  const gcpInBoxLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  gcpInBoxLine.classList.add('cicd-pipeline-line', 'cicd-pipeline-line-path', 'kcp-platform-grey-line');
  gcpInBoxLine.dataset.kcpPlatformRoute = 'argo-to-ucp-edge-gcp-grey';
  gcpInBoxLine.setAttribute('d', `M ${argoCenter.x.toFixed(2)} ${providerStart.y.toFixed(2)} L ${providerStart.x.toFixed(2)} ${providerStart.y.toFixed(2)}`);
  gcpInBoxLine.style.animationDelay = '-0.42s';
  kcpPlatformConnectionLayer.appendChild(gcpInBoxLine);

  ucpIconCenters.forEach((center, index) => {
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.classList.add('kcp-platform-grey-line-dot');
    dot.dataset.kcpPlatformRoute = `ucp-grey-dot-${index + 1}`;
    dot.setAttribute('cx', center.x.toFixed(2));
    dot.setAttribute('cy', providerStart.y.toFixed(2));
    dot.setAttribute('r', '13');
    kcpPlatformConnectionLayer.appendChild(dot);
  });

  const argoDotPoint = { x: argoCenter.x, y: providerStart.y };
  const dx = githubFileTarget.x - argoDotPoint.x;
  const dy = githubFileTarget.y - argoDotPoint.y;
  const length = Math.max(1, Math.hypot(dx, dy));
  const axis = { x: dx / length, y: dy / length };
  const trimRatio = 0.08;
  const ovalStart = {
    x: argoDotPoint.x + dx * trimRatio,
    y: argoDotPoint.y + dy * trimRatio,
  };
  const ovalEnd = {
    x: githubFileTarget.x - dx * trimRatio,
    y: githubFileTarget.y - dy * trimRatio,
  };
  const normal = { x: -dy / length, y: dx / length };
  const endSeparation = 24;
  const ovalWidth = 200;
  const radius = ovalWidth * 0.5 - endSeparation;
  const controlInset = length * 0.1;
  const makeSemicircle = (side, reverse = false) => {
    const sideStart = {
      x: ovalStart.x + normal.x * endSeparation * side,
      y: ovalStart.y + normal.y * endSeparation * side,
    };
    const sideEnd = {
      x: ovalEnd.x + normal.x * endSeparation * side,
      y: ovalEnd.y + normal.y * endSeparation * side,
    };
    const startControl = {
      x: sideStart.x + axis.x * controlInset + normal.x * radius * side,
      y: sideStart.y + axis.y * controlInset + normal.y * radius * side,
    };
    const endControl = {
      x: sideEnd.x - axis.x * controlInset + normal.x * radius * side,
      y: sideEnd.y - axis.y * controlInset + normal.y * radius * side,
    };
    if (reverse) {
      return `M ${sideEnd.x.toFixed(2)} ${sideEnd.y.toFixed(2)} C ${endControl.x.toFixed(2)} ${endControl.y.toFixed(2)}, ${startControl.x.toFixed(2)} ${startControl.y.toFixed(2)}, ${sideStart.x.toFixed(2)} ${sideStart.y.toFixed(2)}`;
    }
    return `M ${sideStart.x.toFixed(2)} ${sideStart.y.toFixed(2)} C ${startControl.x.toFixed(2)} ${startControl.y.toFixed(2)}, ${endControl.x.toFixed(2)} ${endControl.y.toFixed(2)}, ${sideEnd.x.toFixed(2)} ${sideEnd.y.toFixed(2)}`;
  };
  [
    {
      id: 'argo-dot-to-github-oval-clockwise',
      d: makeSemicircle(1),
      delay: '-0.12s',
    },
    {
      id: 'github-to-argo-dot-oval-counter',
      d: makeSemicircle(-1, true),
      delay: '-0.58s',
    },
  ].forEach((route) => {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.dataset.kcpPlatformRoute = route.id;

    const greyLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    greyLine.classList.add('cicd-pipeline-line', 'cicd-pipeline-line-path', 'kcp-platform-grey-line', 'kcp-platform-oval-route');
    greyLine.dataset.kcpPlatformSegment = 'in-box-grey';
    greyLine.setAttribute('d', route.d);
    greyLine.setAttribute('marker-end', 'url(#kcp-platform-arrow2-grey)');
    greyLine.style.animationDelay = route.delay;

    const yellowLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    yellowLine.classList.add('cicd-pipeline-line', 'cicd-pipeline-line-path', 'kcp-platform-dashed-line', 'kcp-platform-oval-route');
    yellowLine.dataset.kcpPlatformSegment = 'between-boxes-yellow';
    yellowLine.setAttribute('d', route.d);
    yellowLine.setAttribute('clip-path', 'url(#kcp-platform-between-boxes-clip)');
    yellowLine.style.animationDelay = route.delay;

    group.append(greyLine, yellowLine);
    kcpPlatformConnectionLayer.appendChild(group);
  });

  [
    { id: 'ucp-to-aws-badge-dashed', target: awsBadgeLeft, delay: '-0.18s', fluid: true },
    { id: 'ucp-to-gcp-badge-dashed', target: gcpBadgeLeft, delay: '-0.42s', fluid: false },
    { id: 'ucp-to-azure-badge-dashed', target: azureBadgeLeft, delay: '-0.66s', fluid: true },
  ].forEach((route) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.classList.add('cicd-pipeline-line', 'cicd-pipeline-line-path', 'kcp-platform-dashed-line');
    line.dataset.kcpPlatformRoute = route.id;
    const end = { x: route.target.x - arrowTipCompensation, y: route.target.y };
    if (route.fluid) {
      const controlDistance = Math.max(130, Math.abs(end.x - providerStart.x) * 0.42);
      line.setAttribute('d', `M ${providerStart.x.toFixed(2)} ${providerStart.y.toFixed(2)} C ${(providerStart.x + controlDistance).toFixed(2)} ${providerStart.y.toFixed(2)}, ${(end.x - controlDistance).toFixed(2)} ${end.y.toFixed(2)}, ${end.x.toFixed(2)} ${end.y.toFixed(2)}`);
    } else {
      line.setAttribute('d', `M ${providerStart.x.toFixed(2)} ${providerStart.y.toFixed(2)} L ${end.x.toFixed(2)} ${end.y.toFixed(2)}`);
    }
    line.setAttribute('marker-end', 'url(#kcp-platform-arrow2-yellow)');
    line.style.animationDelay = route.delay;
    kcpPlatformConnectionLayer.appendChild(line);
  });
}

function requestKcpPlatformConnectionUpdate() {
  if (kcpPlatformConnectionFrame) window.cancelAnimationFrame(kcpPlatformConnectionFrame);
  kcpPlatformConnectionFrame = window.requestAnimationFrame(() => {
    kcpPlatformConnectionFrame = window.requestAnimationFrame(() => {
      kcpPlatformConnectionFrame = undefined;
      renderKcpPlatformConnections();
    });
  });
}

function updateCicdOverlayVideos() {
  document.querySelectorAll('.cicd-static-pipeline-video-overlay, .cicd-desired-state-background-video, .limitless-potential-background-video').forEach((video) => {
    if (!(video instanceof HTMLVideoElement)) return;
    const isPresent = video.closest('section')?.classList.contains('present');
    if (isPresent) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  });
}

function toggleTheme() {
  setTheme(getNextThemeId(root.dataset.theme || THEME_OPTIONS[0].id));
}

setTheme(localStorage.getItem('tech-talks-theme') || root.dataset.theme || 'dark');
deck.on('ready', () => {
  updateBranding();
  updateSpeakerInfo();
  updateControlsEventLine();
  updateMenuAuthorLine();
  updateCicdOverlayVideos();
  requestCicdLeaderLineUpdate();
  requestImageColumnLeaderLineUpdate();
  requestThreeColumnLeaderLineUpdate();
  requestKcpBootstrapLeaderLineUpdate();
  requestKcpPlatformConnectionUpdate();
  requestContentSplitConeUpdate();
  window.setTimeout(() => {
    updateMenuAuthorLine();
    requestCicdLeaderLineUpdate();
    requestImageColumnLeaderLineUpdate();
    requestThreeColumnLeaderLineUpdate();
    requestKcpBootstrapLeaderLineUpdate();
    requestKcpPlatformConnectionUpdate();
    requestContentSplitConeUpdate();
  }, 650);
});
deck.on('slidechanged', () => {
  updateBranding();
  updateControlsEventLine();
  updateMenuAuthorLine();
  updateCicdOverlayVideos();
  requestCicdLeaderLineUpdate();
  requestImageColumnLeaderLineUpdate();
  requestThreeColumnLeaderLineUpdate();
  requestKcpBootstrapLeaderLineUpdate();
  requestKcpPlatformConnectionUpdate();
  requestContentSplitConeUpdate();
});
deck.on('autoanimate', trackKcpBootstrapLeaderLinesDuringAutoAnimate);
deck.on('fragmentshown', () => {
  requestCicdLeaderLineUpdate();
  requestImageColumnLeaderLineUpdate();
  requestThreeColumnLeaderLineUpdate();
  requestKcpBootstrapLeaderLineUpdate();
  requestKcpPlatformConnectionUpdate();
  requestContentSplitConeUpdate();
});
deck.on('fragmenthidden', () => {
  requestCicdLeaderLineUpdate();
  requestImageColumnLeaderLineUpdate();
  requestThreeColumnLeaderLineUpdate();
  requestKcpBootstrapLeaderLineUpdate();
  requestKcpPlatformConnectionUpdate();
  requestContentSplitConeUpdate();
});
deck.on('resize', () => {
  requestCicdLeaderLineUpdate();
  requestImageColumnLeaderLineUpdate();
  requestThreeColumnLeaderLineUpdate();
  requestKcpBootstrapLeaderLineUpdate();
  requestKcpPlatformConnectionUpdate();
  requestContentSplitConeUpdate();
});
deck.on('overviewshown', () => {
  clearCicdLeaderLines();
  clearImageColumnLeaderLines();
  clearThreeColumnLeaderLines();
  clearKcpBootstrapLeaderLines();
  clearKcpPlatformConnections();
});
deck.on('overviewhidden', () => {
  requestCicdLeaderLineUpdate();
  requestImageColumnLeaderLineUpdate();
  requestThreeColumnLeaderLineUpdate();
  requestKcpBootstrapLeaderLineUpdate();
  requestKcpPlatformConnectionUpdate();
  requestContentSplitConeUpdate();
});
window.addEventListener('resize', () => {
  requestCicdLeaderLineUpdate();
  requestImageColumnLeaderLineUpdate();
  requestThreeColumnLeaderLineUpdate();
  requestKcpBootstrapLeaderLineUpdate();
  requestKcpPlatformConnectionUpdate();
  requestContentSplitConeUpdate();
});
document.addEventListener('menu-ready', () => updateMenuThemeButton(root.dataset.theme || THEME_OPTIONS[0].id));
document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : event.target?.parentElement;
  const themeOption = target?.closest('.menu-theme-option');
  if (themeOption) {
    setTheme(themeOption.getAttribute('data-theme'));
  }
});

toggle?.addEventListener('click', toggleTheme);
window.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 't' && !event.metaKey && !event.ctrlKey && !event.altKey) {
    toggleTheme();
  }
});
