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
let cicdLeaderLineLayer;

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
  cicdLeaderLineLayer?.remove();
  cicdLeaderLineLayer = undefined;
}

function getCicdLineColor() {
  return '#1db8f2';
}

function renderCicdLeaderLines() {
  clearCicdLeaderLines();

  const currentSlide = deck.getCurrentSlide();
  if (!currentSlide?.classList.contains('cicd-antipattern-slide')) return;

  const grid = currentSlide.querySelector('.cicd-grid-reference');
  const columns = [...currentSlide.querySelectorAll('.cicd-grid-column')];
  if (!grid || columns.length < 2) return;

  const color = getCicdLineColor();
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
  const routedPipeline = (startY, endY) => {
    const points = horizontalPipelineAtY(startY);
    const start = points[0];
    const curveStart = points[1];
    const curveEnd = { x: points[4].x, y: endY };
    const end = { x: points[5].x, y: endY };
    const controlOffset = Math.max(70, (curveEnd.x - curveStart.x) * 0.35);
    return [
      `M ${start.x} ${start.y}`,
      `H ${curveStart.x}`,
      `C ${curveStart.x + controlOffset} ${start.y} ${curveEnd.x - controlOffset} ${endY} ${curveEnd.x} ${endY}`,
      `H ${end.x}`
    ].join(' ');
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

  const sourceToRegistryPoints = columns.slice(0, -1).map((column) => rightEdgePointAtY(column, sourceLaneY));
  const pipelines = [];
  const routedPipelines = [];

  if (isFragmentVisible(0)) {
    pipelines.push(sourceToRegistryPoints);
  }
  if (isFragmentVisible(1) && infraCodeItem && kubernetesGroup) {
    pipelines.push(horizontalPipelineAtY(kubernetesUpperY));
  }
  if (isFragmentVisible(2) && infraCodeItem && cloudInfrastructureGroup) {
    routedPipelines.push(routedPipeline(
      elementYInGrid(infraCodeItem, 0.5),
      iconRowCenterYInGrid(cloudInfrastructureGroup, 0)
    ));
  }
  if (isFragmentVisible(3) && infraCodeItem && thirdPartyGroup) {
    routedPipelines.push(routedPipeline(
      elementYInGrid(infraCodeItem, 0.78),
      thirdPartyUpperY
    ));
  }
  if (isFragmentVisible(4) && deploymentManifestItem && kubernetesGroup) {
    routedPipelines.push(routedPipeline(
      elementYInGrid(deploymentManifestItem, 0.15),
      kubernetesCenterY
    ));
  }
  if (isFragmentVisible(5) && deploymentManifestItem && cloudInfrastructureGroup) {
    pipelines.push(horizontalPipelineAtY(cloudMiddleRowY));
  }
  if (isFragmentVisible(6) && deploymentManifestItem && thirdPartyGroup) {
    routedPipelines.push(routedPipeline(
      elementYInGrid(deploymentManifestItem, 0.72),
      thirdPartyLowerY
    ));
  }
  if (isFragmentVisible(7) && testSuitesItem && kubernetesGroup) {
    routedPipelines.push(routedPipeline(
      elementYInGrid(testSuitesItem, 0.25),
      kubernetesLowerY
    ));
  }
  if (isFragmentVisible(8) && testSuitesItem && cloudInfrastructureGroup) {
    routedPipelines.push(routedPipeline(
      elementYInGrid(testSuitesItem, 0.54),
      iconRowCenterYInGrid(cloudInfrastructureGroup, 2)
    ));
  }

  cicdLeaderLineLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  cicdLeaderLineLayer.classList.add('cicd-pipeline-lines-layer');
  cicdLeaderLineLayer.setAttribute('aria-hidden', 'true');
  cicdLeaderLineLayer.setAttribute('viewBox', `0 0 ${grid.offsetWidth} ${grid.offsetHeight}`);
  cicdLeaderLineLayer.setAttribute('preserveAspectRatio', 'none');
  cicdLeaderLineLayer.innerHTML = `
    <defs>
      <marker id="cicd-pipeline-arrowhead" markerWidth="20" markerHeight="20" refX="17" refY="10" orient="auto" markerUnits="userSpaceOnUse">
        <path d="M 2 2 L 18 10 L 2 18 z" fill="${color}"></path>
      </marker>
    </defs>
  `;

  pipelines.forEach((points) => {
    const segments = points.slice(0, -1).map((point, index) => [point, points[index + 1]]);

    segments.forEach(([start, end]) => {
      const outline = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      outline.classList.add('cicd-pipeline-line-outline');
      outline.setAttribute('x1', start.x);
      outline.setAttribute('y1', start.y);
      outline.setAttribute('x2', end.x);
      outline.setAttribute('y2', end.y);
      outline.setAttribute('stroke', outlineColor);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.classList.add('cicd-pipeline-line');
      line.setAttribute('x1', start.x);
      line.setAttribute('y1', start.y);
      line.setAttribute('x2', end.x);
      line.setAttribute('y2', end.y);
      line.setAttribute('stroke', color);
      line.setAttribute('marker-end', 'url(#cicd-pipeline-arrowhead)');

      cicdLeaderLineLayer.append(outline, line);
    });
  });

  routedPipelines.forEach((pathData) => {
    const outline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    outline.classList.add('cicd-pipeline-line-outline', 'cicd-pipeline-line-path');
    outline.setAttribute('d', pathData);
    outline.setAttribute('stroke', outlineColor);

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.classList.add('cicd-pipeline-line', 'cicd-pipeline-line-path');
    path.setAttribute('d', pathData);
    path.setAttribute('stroke', color);
    path.setAttribute('marker-end', 'url(#cicd-pipeline-arrowhead)');

    cicdLeaderLineLayer.append(outline, path);
  });

  grid.appendChild(cicdLeaderLineLayer);
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
