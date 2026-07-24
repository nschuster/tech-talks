import Reveal from '../node_modules/reveal.js/dist/reveal.mjs';
import RevealHighlight from '../node_modules/reveal.js/dist/plugin/highlight.mjs';
import '../node_modules/reveal.js-menu/menu.css';
import '../node_modules/reveal.js/dist/plugin/highlight/monokai.css';
import '../css/menu-overrides.css';
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
        content:
          '<div class="menu-theme-panel">' +
          '<p>Presentation theme</p>' +
          '<button type="button" class="menu-theme-toggle">Switch theme</button>' +
          '<p class="menu-theme-hint">Shortcut: T</p>' +
          '</div>'
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
let contentSplitConeLayer;

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
  requestContentSplitConeUpdate();
}

function clearCicdLeaderLines() {
  cicdLeaderLineLayer?.remove();
  cicdLeaderLineLayer = undefined;
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
        { curveStartIndex: 2, curveEndIndex: 4, controlFactor: 0.28 }
      )
    });
  }
  if (allowAllPipelineRoutes && isFragmentVisible(5) && deploymentManifestItem && cloudInfrastructureGroup) {
    routedPipelines.push({
      id: 'deployment-to-cloud',
      segments: routedPipeline(
        elementYInGrid(deploymentManifestItem, 0.5),
        cloudMiddleRowY,
        { curveStartIndex: 2, curveEndIndex: 4, controlFactor: 0.24 }
      )
    });
  }
  if (allowAllPipelineRoutes && isFragmentVisible(6) && deploymentManifestItem && thirdPartyGroup) {
    routedPipelines.push({
      id: 'deployment-to-third-party',
      segments: routedPipeline(
        elementYInGrid(deploymentManifestItem, 0.88),
        thirdPartyLowerY,
        { curveStartIndex: 2, curveEndIndex: 4, controlFactor: 0.28 }
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
        <marker id="cicd-pipeline-arrowhead" markerWidth="20" markerHeight="20" refX="17" refY="10" orient="auto" markerUnits="userSpaceOnUse">
          <path class="cicd-pipeline-arrowhead-path" d="M 2 2 L 18 10 L 2 18 z"></path>
        </marker>
        <marker id="cicd-pipeline-arrowhead-static" markerWidth="20" markerHeight="20" refX="17" refY="10" orient="auto" markerUnits="userSpaceOnUse">
          <path class="cicd-pipeline-arrowhead-path-static" d="M 2 2 L 18 10 L 2 18 z"></path>
        </marker>
        <marker id="cicd-pipeline-arrowhead-desired" markerWidth="30" markerHeight="30" refX="26" refY="15" orient="auto" markerUnits="userSpaceOnUse">
          <path class="cicd-pipeline-arrowhead-path-desired" d="M 3 3 L 27 15 L 3 27 z"></path>
        </marker>
        <marker id="cicd-pipeline-arrowhead-desired-reverse" markerWidth="30" markerHeight="30" refX="26" refY="15" orient="auto" markerUnits="userSpaceOnUse">
          <path class="cicd-pipeline-arrowhead-path-desired-reverse" d="M 3 3 L 27 15 L 3 27 z"></path>
        </marker>
        <marker id="cicd-pipeline-arrowhead-muted" markerWidth="20" markerHeight="20" refX="17" refY="10" orient="auto" markerUnits="userSpaceOnUse">
          <path class="cicd-pipeline-arrowhead-path-muted" d="M 2 2 L 18 10 L 2 18 z"></path>
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

  const addDrawMask = (group, tagName, attributes, length) => {
    const defs = cicdLeaderLineLayer.querySelector('defs');
    if (!defs) return;

    group.dataset.cicdDrawMaskId && document.getElementById(group.dataset.cicdDrawMaskId)?.remove();
    const maskId = `cicd-pipeline-draw-mask-${group.dataset.cicdPipelineId.replace(/[^a-z0-9_-]/gi, '-')}`;
    const mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
    mask.id = maskId;
    mask.setAttribute('maskUnits', 'userSpaceOnUse');
    mask.setAttribute('x', '0');
    mask.setAttribute('y', '0');
    mask.setAttribute('width', grid.offsetWidth);
    mask.setAttribute('height', grid.offsetHeight);

    const drawLine = document.createElementNS('http://www.w3.org/2000/svg', tagName);
    drawLine.classList.add('cicd-pipeline-line-draw-mask');
    Object.entries(attributes).forEach(([name, value]) => drawLine.setAttribute(name, value));
    drawLine.style.setProperty('--cicd-draw-length', Math.max(1, length));
    mask.appendChild(drawLine);
    defs.appendChild(mask);

    group.dataset.cicdDrawMaskId = maskId;
    group.setAttribute('mask', `url(#${maskId})`);
    const finishDraw = () => {
      group.removeAttribute('mask');
      delete group.dataset.cicdDrawMaskId;
      mask.remove();
    };
    drawLine.addEventListener('animationend', finishDraw, { once: true });
    window.setTimeout(finishDraw, 900);
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
      const attrs = { x1: start.x, y1: start.y, x2: end.x, y2: end.y };
      Object.entries(attrs).forEach(([name, value]) => {
        outline.setAttribute(name, value);
        line.setAttribute(name, value);
      });
      outline.setAttribute('stroke', outlineColor);
      setCommonLineAttributes(line, segmentStroke || (shouldDash ? color : staticColor));
      if (isNew && shouldDraw) addDrawMask(group, 'line', attrs, Math.hypot(end.x - start.x, end.y - start.y));
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
      Object.entries(attributes).forEach(([name, value]) => {
        outline.setAttribute(name, value);
        line.setAttribute(name, value);
      });
      outline.setAttribute('stroke', outlineColor);
      const segmentStroke = stroke || (shouldDash ? color : staticColor);
      setCommonLineAttributes(line, segmentStroke);
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
        const segmentLength = length || (line.getTotalLength ? line.getTotalLength() : 1);
        addDrawMask(group, tagName, attributes, segmentLength);
      }
    });
  });

  cicdLeaderLineLayer.querySelectorAll('.cicd-pipeline-group').forEach((group) => {
    if (!activePipelineIds.has(group.dataset.cicdPipelineId)) {
      group.dataset.cicdDrawMaskId && document.getElementById(group.dataset.cicdDrawMaskId)?.remove();
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
    contentSplitConeLayer = undefined;
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

  if (!contentSplitConeLayer || contentSplitConeLayer.closest('section') !== currentSlide) {
    contentSplitConeLayer?.remove();
    contentSplitConeLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    contentSplitConeLayer.classList.add('content-split-cone-layer');
    contentSplitConeLayer.setAttribute('aria-hidden', 'true');
    pane.prepend(contentSplitConeLayer);
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
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
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
    if (!targetIcon || sourceIcons.length < 8) return [];
    const target = rect(targetIcon);
    const targetPoint = (yRatio) => toPane(target.left + target.width * 0.08, target.top + target.height * yRatio);
    const leaderSources = sourceIcons
      .map((element, index) => ({ element, sourceIndex: index + 1 }))
      .filter(({ sourceIndex }) => sourceIndex !== 3 && sourceIndex !== 6);
    const targetRatios = [0.16, 0.3, 0.43, 0.57, 0.7, 0.84];
    const colors = [kubernetesBlue, kubernetesBlue, crossplaneRed, crossplaneYellow, crossplaneGreen, crossplaneGreen];
    const routes = leaderSources.map(({ element, sourceIndex }, index) => {
      const source = rect(element);
      const start = toPane(source.right, source.top + source.height * 0.5);
      const end = targetPoint(targetRatios[index]);
      const dx = end.x - start.x;
      const verticalNudge = index % 2 === 0 ? -8 : 8;
      return {
        sourceIndex,
        color: colors[index],
        points: [
          start,
          { x: start.x + dx * 0.32, y: start.y + verticalNudge },
          { x: start.x + dx * 0.62, y: end.y - verticalNudge },
          end
        ]
      };
    });
    routes.forEach(({ points, color }, index) => {
      defs.appendChild(entangledLineGradient({
        id: `content-split-xr-leader-gradient-${index + 1}`,
        start: points[0],
        end: points.at(-1),
        endColor: color
      }));
    });
    const smoothPath = (points) => `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)} C ${points[1].x.toFixed(1)} ${points[1].y.toFixed(1)}, ${points[2].x.toFixed(1)} ${points[2].y.toFixed(1)}, ${points[3].x.toFixed(1)} ${points[3].y.toFixed(1)}`;
    const makePath = ({ points, sourceIndex }, index, halo = false) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.classList.add('content-split-xr-leader-line', 'content-split-svg-fragment--3');
      if (halo) path.classList.add('content-split-xr-leader-line--halo');
      path.setAttribute(halo ? 'data-xr-leader-halo' : 'data-xr-leader-line', `${sourceIndex}`);
      if (!halo) path.style.stroke = `url(#content-split-xr-leader-gradient-${index + 1})`;
      path.setAttribute('d', smoothPath(points));
      return path;
    };
    const halos = routes.map((route, index) => makePath(route, index, true));
    const lines = routes.map((route, index) => makePath(route, index));
    return [...halos, ...lines];
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
  contentSplitConeLayer.replaceChildren(defs, ...cones, ...entangled, ...xrLeaders);
}

function requestContentSplitConeUpdate() {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(renderContentSplitCones);
  });
  window.setTimeout(renderContentSplitCones, 160);
  window.setTimeout(renderContentSplitCones, 420);
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
  setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
}

setTheme(localStorage.getItem('tech-talks-theme') || root.dataset.theme || 'dark');
deck.on('ready', () => {
  updateBranding();
  updateCicdOverlayVideos();
  requestCicdLeaderLineUpdate();
  requestContentSplitConeUpdate();
});
deck.on('slidechanged', () => {
  updateBranding();
  updateCicdOverlayVideos();
  requestCicdLeaderLineUpdate();
  requestContentSplitConeUpdate();
});
deck.on('fragmentshown', () => {
  requestCicdLeaderLineUpdate();
  requestContentSplitConeUpdate();
});
deck.on('fragmenthidden', () => {
  requestCicdLeaderLineUpdate();
  requestContentSplitConeUpdate();
});
deck.on('resize', () => {
  requestCicdLeaderLineUpdate();
  requestContentSplitConeUpdate();
});
deck.on('overviewshown', clearCicdLeaderLines);
deck.on('overviewhidden', () => {
  requestCicdLeaderLineUpdate();
  requestContentSplitConeUpdate();
});
window.addEventListener('resize', () => {
  requestCicdLeaderLineUpdate();
  requestContentSplitConeUpdate();
});
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
