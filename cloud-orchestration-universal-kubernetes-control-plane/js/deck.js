import Reveal from '../node_modules/reveal.js/dist/reveal.mjs';
import '../node_modules/reveal.js-menu/menu.css';
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
  const showAllPipelines = staticBasisMode;
  const isFragmentVisible = (fragmentIndex) => showAllPipelines || currentFragment >= fragmentIndex;
  const allowAllPipelineRoutes = !singlePipelineMode || showAllPipelines;

  const sourceToRegistryPoints = columns.slice(0, -1).map((column) => rightEdgePointAtY(column, sourceLaneY));
  const controlPlaneMarkerCenters = [...currentSlide.querySelectorAll('.cicd-control-plane-icon-card')]
    .map((card) => centerXInGrid(card));
  const pipelines = [];
  const routedPipelines = [];

  if (singlePipelineMode || isFragmentVisible(0)) {
    pipelines.push({ id: 'source-to-registry', points: sourceToRegistryPoints });
  }
  if (nextSlideBaseMode && infraCodeItem) {
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
  if (nextSlideBaseMode && deploymentManifestItem) {
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
            marker.setAttribute('r', '8');
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
}

function requestCicdLeaderLineUpdate() {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(renderCicdLeaderLines);
  });
  window.setTimeout(renderCicdLeaderLines, 160);
  window.setTimeout(renderCicdLeaderLines, 420);
}

function updateCicdOverlayVideos() {
  document.querySelectorAll('.cicd-static-pipeline-video-overlay').forEach((video) => {
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
});
deck.on('slidechanged', () => {
  updateBranding();
  updateCicdOverlayVideos();
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
