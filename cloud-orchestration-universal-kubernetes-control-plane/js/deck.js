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
const cicdLeaderLines = new Map();
let cicdLeaderLineAnchorLayer;

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
  cicdLeaderLines.forEach(({ line }) => line.remove());
  cicdLeaderLines.clear();
  cicdLeaderLineAnchorLayer?.remove();
  cicdLeaderLineAnchorLayer = undefined;
}

function getCicdLineColor() {
  return '#1db8f2';
}

function ensureCicdLeaderLineAnchorLayer() {
  if (cicdLeaderLineAnchorLayer) return cicdLeaderLineAnchorLayer;
  cicdLeaderLineAnchorLayer = document.createElement('div');
  cicdLeaderLineAnchorLayer.className = 'cicd-leaderline-anchor-layer';
  cicdLeaderLineAnchorLayer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cicdLeaderLineAnchorLayer);
  return cicdLeaderLineAnchorLayer;
}

function renderCicdLeaderLines() {
  const LeaderLine = window.LeaderLine;
  const currentSlide = deck.getCurrentSlide();
  if (!currentSlide?.classList.contains('cicd-antipattern-slide') || !LeaderLine) {
    clearCicdLeaderLines();
    return;
  }

  const grid = currentSlide.querySelector('.cicd-grid-reference');
  const columns = [...currentSlide.querySelectorAll('.cicd-grid-column')];
  if (!grid || columns.length < 2) {
    clearCicdLeaderLines();
    return;
  }

  const color = getCicdLineColor();
  const outlineColor = root.dataset.theme === 'light' ? 'rgba(255, 255, 255, 0.92)' : 'rgba(18, 26, 56, 0.98)';
  const gridRect = grid.getBoundingClientRect();
  const scaleX = gridRect.width / grid.offsetWidth;
  const scaleY = gridRect.height / grid.offsetHeight;
  const toGridPoint = (x, y) => ({
    x: (x - gridRect.left) / scaleX,
    y: (y - gridRect.top) / scaleY
  });
  const toViewportPoint = (point) => ({
    x: gridRect.left + point.x * scaleX,
    y: gridRect.top + point.y * scaleY
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

  const horizontalPipelineAtY = (y) => {
    const start = rightEdgePointAtY(columns[0], y);
    const end = (() => {
      const rect = columns[6].getBoundingClientRect();
      return toGridPoint(rect.left, gridRect.top + y * scaleY);
    })();
    return { start, end, path: 'straight' };
  };
  const routedPipeline = (startY, endY) => {
    const start = rightEdgePointAtY(columns[0], startY);
    const targetRect = columns[6].getBoundingClientRect();
    const end = toGridPoint(targetRect.left, gridRect.top + endY * scaleY);
    return { start, end, path: 'fluid' };
  };

  const sourceCodeItem = currentSlide.querySelector('.cicd-file-item--source-code');
  const infraCodeItem = currentSlide.querySelector('.cicd-file-item--infra-code');
  const deploymentManifestItem = currentSlide.querySelector('.cicd-file-item--deployment-manifests');
  const testSuitesItem = currentSlide.querySelector('.cicd-file-item--test-suites');
  const kubernetesGroup = currentSlide.querySelector('.cicd-target-group--kubernetes');
  const cloudInfrastructureGroup = currentSlide.querySelector('.cicd-target-group--cloud');
  const thirdPartyGroup = currentSlide.querySelector('.cicd-target-group--third-party');
  const thirdPartyBox = currentSlide.querySelector('.cicd-target-main-box--third-party');

  const sourceLaneY = sourceCodeItem ? centerYInGrid(sourceCodeItem) : laneY;
  const kubernetesUpperY = kubernetesGroup ? elementYInGrid(kubernetesGroup, 0.2) : laneY;
  const kubernetesCenterY = kubernetesGroup ? elementYInGrid(kubernetesGroup, 0.5) : laneY;
  const kubernetesLowerY = kubernetesGroup ? elementYInGrid(kubernetesGroup, 0.92) : laneY;
  const cloudMiddleRowY = cloudInfrastructureGroup ? iconRowCenterYInGrid(cloudInfrastructureGroup, 1) : laneY;
  const thirdPartyUpperY = thirdPartyBox ? elementYInGrid(thirdPartyBox, 0.52) : (thirdPartyGroup ? elementYInGrid(thirdPartyGroup, 0.28) : laneY);
  const thirdPartyLowerY = thirdPartyBox ? elementYInGrid(thirdPartyBox, 0.74) : (thirdPartyGroup ? elementYInGrid(thirdPartyGroup, 0.7) : laneY);
  const currentFragment = deck.getIndices().f ?? -1;
  const isFragmentVisible = (fragmentIndex) => currentFragment >= fragmentIndex;

  const routes = [];
  if (isFragmentVisible(0)) {
    routes.push({ id: 'source-to-registry', ...horizontalPipelineAtY(sourceLaneY) });
  }
  if (isFragmentVisible(1) && infraCodeItem && kubernetesGroup) {
    routes.push({ id: 'infra-to-kubernetes', ...horizontalPipelineAtY(kubernetesUpperY) });
  }
  if (isFragmentVisible(2) && infraCodeItem && cloudInfrastructureGroup) {
    routes.push({ id: 'infra-to-cloud', ...routedPipeline(elementYInGrid(infraCodeItem, 0.5), iconRowCenterYInGrid(cloudInfrastructureGroup, 0)) });
  }
  if (isFragmentVisible(3) && infraCodeItem && thirdPartyGroup) {
    routes.push({ id: 'infra-to-third-party', ...routedPipeline(elementYInGrid(infraCodeItem, 0.78), thirdPartyUpperY) });
  }
  if (isFragmentVisible(4) && deploymentManifestItem && kubernetesGroup) {
    routes.push({ id: 'deployment-to-kubernetes', ...routedPipeline(elementYInGrid(deploymentManifestItem, 0.15), kubernetesCenterY) });
  }
  if (isFragmentVisible(5) && deploymentManifestItem && cloudInfrastructureGroup) {
    routes.push({ id: 'deployment-to-cloud', ...horizontalPipelineAtY(cloudMiddleRowY) });
  }
  if (isFragmentVisible(6) && deploymentManifestItem && thirdPartyGroup) {
    routes.push({ id: 'deployment-to-third-party', ...routedPipeline(elementYInGrid(deploymentManifestItem, 0.72), thirdPartyLowerY) });
  }
  if (isFragmentVisible(7) && testSuitesItem && kubernetesGroup) {
    routes.push({ id: 'test-to-kubernetes', ...routedPipeline(elementYInGrid(testSuitesItem, 0.25), kubernetesLowerY) });
  }
  if (isFragmentVisible(8) && testSuitesItem && cloudInfrastructureGroup) {
    routes.push({ id: 'test-to-cloud', ...routedPipeline(elementYInGrid(testSuitesItem, 0.54), iconRowCenterYInGrid(cloudInfrastructureGroup, 2)) });
  }

  const activeRouteIds = new Set(routes.map((route) => route.id));
  cicdLeaderLines.forEach(({ line, startAnchor, endAnchor }, id) => {
    if (!activeRouteIds.has(id)) {
      line.remove();
      startAnchor.remove();
      endAnchor.remove();
      cicdLeaderLines.delete(id);
    }
  });

  const anchorLayer = ensureCicdLeaderLineAnchorLayer();
  const positionAnchor = (anchor, point) => {
    anchor.style.left = `${point.x}px`;
    anchor.style.top = `${point.y}px`;
  };
  const createAnchor = (id, endpoint) => {
    const anchor = document.createElement('span');
    anchor.className = 'cicd-leaderline-anchor';
    anchor.dataset.cicdLeaderLineAnchor = `${id}-${endpoint}`;
    anchorLayer.appendChild(anchor);
    return anchor;
  };

  routes.forEach((route) => {
    const start = toViewportPoint(route.start);
    const end = toViewportPoint(route.end);
    let entry = cicdLeaderLines.get(route.id);
    const lineOptions = {
      color,
      size: 9,
      outline: true,
      outlineColor,
      outlineSize: 0.42,
      startPlug: 'behind',
      endPlug: 'arrow1',
      endPlugSize: 1.35,
      endPlugOutline: true,
      endPlugOutlineColor: outlineColor,
      endPlugOutlineSize: 0.3,
      path: route.path,
      startSocket: 'right',
      endSocket: 'left',
      startSocketGravity: route.path === 'fluid' ? [260, 0] : 'auto',
      endSocketGravity: route.path === 'fluid' ? [-260, 0] : 'auto',
      dash: { len: 30, gap: 18, animation: false }
    };

    if (!entry) {
      const startAnchor = createAnchor(route.id, 'start');
      const endAnchor = createAnchor(route.id, 'end');
      positionAnchor(startAnchor, start);
      positionAnchor(endAnchor, end);
      const line = new LeaderLine(startAnchor, endAnchor, { ...lineOptions, hide: true });
      entry = { line, startAnchor, endAnchor, signature: JSON.stringify({ start, end, color, outlineColor, path: route.path }) };
      cicdLeaderLines.set(route.id, entry);
      line.show('draw', { duration: 650, timing: [0.58, 0, 0.42, 1] });
      return;
    }

    const nextSignature = JSON.stringify({ start, end, color, outlineColor, path: route.path });
    if (entry.signature === nextSignature) return;
    entry.signature = nextSignature;
    positionAnchor(entry.startAnchor, start);
    positionAnchor(entry.endAnchor, end);
    entry.line.setOptions(lineOptions);
    entry.line.position();
  });
}

function requestCicdLeaderLineUpdate() {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(renderCicdLeaderLines);
  });
  window.setTimeout(renderCicdLeaderLines, 160);
  window.setTimeout(renderCicdLeaderLines, 420);
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
deck.on('fragmentshown', requestCicdLeaderLineUpdate);
deck.on('fragmenthidden', requestCicdLeaderLineUpdate);
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
