import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import {
  type NodeType,
  type Node3DData,
  type Edge3DData,
  type GraphDataset,
  getGraphDataset
} from './db';

export { type NodeType, type Node3DData, type Edge3DData };

export type EdgeCategory = 'hub' | 'affinity' | 'individual' | 'device' | 'other';

export interface GraphConfig {
  globalScale?: number;    // 0.3 to 2.5, overall scale multiplier for entire graph
  colors: Record<string, string>;
  sizes: Record<string, number>;
  glowIntensity: number;   // 0–1, emissive intensity multiplier

  // ─── Base Lines (Líneas Normales Continuas) ─────────────────────────────────
  edgeColor: string;              // Affinity lines color (default #6a7a8a)
  hubEdgeColor: string;           // Hub bridge lines color (default #9aaaaa)
  individualEdgeColor?: string;   // Individual <-> Household cross lines color (default #8e9aaf)
  deviceEdgeColor?: string;       // Device & cookie lines color (default #5c7f99)
  edgeOpacity: number;            // Standard/Affinity lines opacity (default 0.45)
  hubEdgeOpacity?: number;        // Hub bridge lines opacity (default 0.55)
  individualEdgeOpacity?: number; // Individual <-> Household lines opacity (default 0.40)
  deviceEdgeOpacity?: number;     // Device lines opacity (default 0.35)
  showAllEdges?: boolean;         // Reveal 100% of all lines without clicking (default false)

  // ─── Dotted Animated Overlay Layer (Capa Superpuesta de Líneas Punteadas) ───
  enableDottedOverlay?: boolean;  // Active dotted animated layer on selection (default true)
  dottedLineWidth?: number;       // Line thickness in px (1.0 to 12.0, default 3.5)
  dottedLineColor?: string;       // Color for dotted layer (default #ffffff or selectionColor)
  dottedLineOpacity?: number;     // Opacity for dotted layer (0 to 1.0, default 0.95)
  edgeDashSpeed?: number;         // Traveling flow speed multiplier (0.2 to 4.0, default 1.5)
  dottedDashSize?: number;        // Length of dashes (2 to 24, default 8)
  dottedGapSize?: number;         // Gap between dots (2 to 24, default 6)

  // ─── Selection & Highlight (Selección y Destello) ───────────────────────────
  selectionColor?: string;       // Color for selection highlight & active lines (default #ffffff)
  selectionHaloOpacity?: number; // 0 to 1.0 (default 0.35)
  selectionBlur?: number;        // 0 to 2.5, soft blur & halo aura intensity (default 1.0)
  animateConnection?: boolean;   // Animate lines connecting outwards on click (default true)

  // ─── Text & Labels (Texto y Etiquetas) ─────────────────────────────────────
  textSize?: number;             // 0.4 to 2.5, node text size multiplier (default 1.0)
  textOpacity?: number;          // 0 to 1.0, general fallback node text label opacity (default 1.0)
  individualTextOpacity?: number;// 0 to 1.0, opacity for Individual SHAs text (default 0.75)
  householdTextOpacity?: number; // 0 to 1.0, opacity for Household IDs text (default 0.85)
  hubTextOpacity?: number;       // 0 to 1.0, opacity for Hub titles text (default 1.0)
  edgeTextColor?: string;        // Color for edge relationship & weight text (default #888888)
  edgeTextSize?: number;         // 0.4 to 2.0, edge text size multiplier (default 0.45)
  showEdgeText?: boolean;        // Toggle edge text labels
}

export const DEFAULT_GRAPH_CONFIG: GraphConfig = {
  globalScale: 1.0,
  colors: {
    genre: '#38A169',
    topic: '#D53F8C',
    household: '#4E6E9D',
    individual: '#EF3557',
    device: '#319795',
    cookie_or_ip: '#ED8936',
    series: '#805AD5',
    experian_household: '#4299E1',
    state: '#ECC94B',
    income_bracket: '#38B2AC',
  },
  sizes: {
    genre: 0.70,
    topic: 0.75,
    household: 0.50,
    individual: 0.45,
    device: 0.45,
    cookie_or_ip: 0.40,
    series: 0.75,
    experian_household: 0.50,
    state: 0.75,
    income_bracket: 0.75,
  },
  glowIntensity: 0.45,

  // Base Lines (Normales continuas por defecto)
  edgeColor: '#6a7a8a',
  hubEdgeColor: '#9aaaaa',
  individualEdgeColor: '#8e9aaf',
  deviceEdgeColor: '#5c7f99',
  edgeOpacity: 0.45,
  hubEdgeOpacity: 0.55,
  individualEdgeOpacity: 0.40,
  deviceEdgeOpacity: 0.35,
  showAllEdges: false,

  // Dotted Animated Layer (Capa superpuesta punteada animada)
  enableDottedOverlay: true,
  dottedLineWidth: 3.5,
  dottedLineColor: '#ffffff',
  dottedLineOpacity: 0.95,
  edgeDashSpeed: 1.5,
  dottedDashSize: 8,
  dottedGapSize: 6,

  // Selection default
  selectionColor: '#ffffff',
  selectionHaloOpacity: 0.35,
  selectionBlur: 1.0,
  animateConnection: true,

  // Text / Labels default
  textSize: 1.0,
  textOpacity: 1.0,
  individualTextOpacity: 0.75,
  householdTextOpacity: 0.85,
  hubTextOpacity: 1.0,
  edgeTextColor: '#888888',
  edgeTextSize: 0.45,
  showEdgeText: true,
};

export interface Graph3DHandle {
  zoom: (delta: number) => void;   // positive = zoom in, negative = zoom out
  pan: (dx: number, dy: number) => void;
  resetHighlight: () => void;
}

function cssToHex(css: string | undefined, defaultHex = 0x6a7a8a): number {
  if (!css) return defaultHex;
  return parseInt(css.replace('#', ''), 16);
}

const BG_COLOR = 0x111111;
const SELECTION_BLUE = 0x1d4ed8;
const MAGENTA_TOPIC = 0xD53F8C;

export interface Graph3DProps {
  dataset?: GraphDataset;
  query?: string;
  config?: GraphConfig;
  onNodeClick?: (node: Node3DData | null) => void;
}

// ─── Easing Functions ────────────────────────────────────────────────────────
const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const c1 = 1.70158, c3 = c1 + 1;
const easeOutBack = (t: number) => 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);

const Graph3D = forwardRef<Graph3DHandle, Graph3DProps>(function Graph3D(
  { dataset: customDataset, query, config, onNodeClick },
  ref
) {
  const mountRef = useRef<HTMLDivElement>(null);

  const activeDataset = customDataset ?? getGraphDataset(query ?? 'Comedy and Sports');

  const mergedConfig: GraphConfig = {
    ...DEFAULT_GRAPH_CONFIG,
    ...config,
    colors: { ...DEFAULT_GRAPH_CONFIG.colors, ...config?.colors },
    sizes: { ...DEFAULT_GRAPH_CONFIG.sizes, ...config?.sizes },
  };

  const configRef = useRef(mergedConfig);
  configRef.current = mergedConfig;

  const datasetRef = useRef(activeDataset);
  datasetRef.current = activeDataset;

  const onNodeClickRef = useRef(onNodeClick);
  onNodeClickRef.current = onNodeClick;

  const zoomFnRef = useRef<(delta: number) => void>(() => {});
  const panFnRef = useRef<(dx: number, dy: number) => void>(() => {});
  const resetHighlightRef = useRef<() => void>(() => {});

  useImperativeHandle(ref, () => ({
    zoom: (delta) => zoomFnRef.current(delta),
    pan: (dx, dy) => panFnRef.current(dx, dy),
    resetHighlight: () => resetHighlightRef.current(),
  }));

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth, H = el.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(W, H);
    renderer.setClearColor(BG_COLOR, 1);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 1, 3000);
    camera.position.set(0, 0, 760);

    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.85);
    dirLight.position.set(1, 2, 3);
    scene.add(dirLight);
    const pointLight = new THREE.PointLight(0x6781a8, 1.3, 1300);
    pointLight.position.set(-200, 200, 200);
    scene.add(pointLight);

    const pivot = new THREE.Group();
    scene.add(pivot);

    // Stars background
    const starGeo = new THREE.BufferGeometry();
    const starPts: number[] = [];
    for (let i = 0; i < 600; i++) {
      starPts.push(
        (Math.random() - 0.5) * 3200,
        (Math.random() - 0.5) * 3200,
        (Math.random() - 0.5) * 3200
      );
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPts, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0x22223a, size: 1.6, sizeAttenuation: true })));

    // ─── Label Canvas ────────────────────────────────────────────────────────
    const lc = document.createElement('canvas');
    lc.style.cssText = 'position:absolute;inset:0;pointer-events:none;';
    el.style.position = 'relative';
    el.appendChild(lc);

    function resizeLc() {
      lc.width = el!.clientWidth * window.devicePixelRatio;
      lc.height = el!.clientHeight * window.devicePixelRatio;
      lc.style.width = el!.clientWidth + 'px';
      lc.style.height = el!.clientHeight + 'px';
    }
    resizeLc();

    function project(wx: number, wy: number, wz: number) {
      const v = new THREE.Vector3(wx, wy, wz);
      pivot.localToWorld(v);
      v.project(camera);
      return {
        sx: (v.x * 0.5 + 0.5) * el!.clientWidth,
        sy: (-v.y * 0.5 + 0.5) * el!.clientHeight,
        behind: v.z > 1,
      };
    }

    // ─── State & Meshes for current dataset ──────────────────────────────────
    const nodes = datasetRef.current.nodes;
    const edges = datasetRef.current.edges;

    const nodeMap = new Map<string, THREE.Mesh>();
    const haloMap = new Map<string, THREE.Mesh>();
    const glowMap = new Map<string, THREE.Sprite>();
    const meshToNode = new Map<THREE.Mesh, Node3DData>();
    const nodeAlpha = new Map<string, number>();

    // ─── Radial Luminous Glow Texture (Outer Aura / Soft Blur Estela) ────────
    function createGlowTexture(): THREE.CanvasTexture {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;
      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.18, 'rgba(255, 255, 255, 0.82)');
      gradient.addColorStop(0.38, 'rgba(255, 255, 255, 0.40)');
      gradient.addColorStop(0.65, 'rgba(255, 255, 255, 0.12)');
      gradient.addColorStop(0.88, 'rgba(255, 255, 255, 0.02)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(canvas);
    }
    const glowTexture = createGlowTexture();

    // Node materials
    const nodeMaterials = new Map<string, THREE.MeshPhongMaterial>();

    nodes.forEach(n => {
      const baseColor = configRef.current.colors[n.type] ?? '#4E6E9D';
      const hex = cssToHex(baseColor);
      const isHub = n.type === 'genre' || n.type === 'topic' || n.type === 'series' || n.type === 'state' || n.type === 'income_bracket';

      const mat = new THREE.MeshPhongMaterial({
        color: hex,
        shininess: isHub ? 85 : 55,
        emissive: hex,
        emissiveIntensity: configRef.current.glowIntensity * (isHub ? 1.0 : 0.4),
        transparent: true,
        opacity: 1.0,
      });
      nodeMaterials.set(n.id, mat);

      const sphereGeo = new THREE.SphereGeometry(n.size, 24, 18);
      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.set(n.x, n.y, n.z);
      mesh.scale.setScalar(0); // Start hidden for reveal animation
      pivot.add(mesh);
      nodeMap.set(n.id, mesh);
      meshToNode.set(mesh, n);
      nodeAlpha.set(n.id, 0);

      // Outer Luminous Glow Aura (Estela / Soft Blur Haze)
      const glowMat = new THREE.SpriteMaterial({
        map: glowTexture,
        color: hex,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const glowSprite = new THREE.Sprite(glowMat);
      glowSprite.position.set(n.x, n.y, n.z);
      glowSprite.scale.set(0, 0, 1);
      pivot.add(glowSprite);
      glowMap.set(n.id, glowSprite);

      // Selection Halo mesh (Soft configurable opacity on active selection)
      const haloGeo = new THREE.SphereGeometry(n.size * 1.36, 24, 20);
      const haloMat = new THREE.MeshBasicMaterial({
        color: cssToHex(configRef.current.selectionColor ?? '#ffffff'),
        transparent: true,
        opacity: 0,
        wireframe: false,
        depthWrite: false,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.position.set(n.x, n.y, n.z);
      haloMesh.scale.setScalar(0);
      pivot.add(haloMesh);
      haloMap.set(n.id, haloMesh);
    });

    // Edges
    function getEdgeCategory(edge: Edge3DData, nodes: Node3DData[]): EdgeCategory {
  const nodeA = nodes.find(n => n.id === edge.from);
  const nodeB = nodes.find(n => n.id === edge.to);
  const isHubA = nodeA?.type === 'genre' || nodeA?.type === 'topic' || nodeA?.type === 'series' || nodeA?.type === 'state' || nodeA?.type === 'income_bracket';
  const isHubB = nodeB?.type === 'genre' || nodeB?.type === 'topic' || nodeB?.type === 'series' || nodeB?.type === 'state' || nodeB?.type === 'income_bracket';

  if (
    edge.rel === 'hasDevice' ||
    edge.rel === 'hasCookie' ||
    edge.rel === 'hasIP' ||
    nodeA?.type === 'device' ||
    nodeB?.type === 'device' ||
    nodeA?.type === 'cookie_or_ip' ||
    nodeB?.type === 'cookie_or_ip'
  ) {
    return 'device';
  }
  if (
    edge.rel === 'hasIndividual' ||
    (nodeA?.type === 'individual' && nodeB?.type === 'household') ||
    (nodeA?.type === 'household' && nodeB?.type === 'individual')
  ) {
    return 'individual';
  }
  if (isHubA && isHubB) {
    return 'hub';
  }
  return 'affinity';
}

function getEdgeColorHex(category: EdgeCategory, cfg: GraphConfig): number {
  switch (category) {
    case 'hub':
      return cssToHex(cfg.hubEdgeColor ?? '#9aaaaa');
    case 'individual':
      return cssToHex(cfg.individualEdgeColor ?? '#8e9aaf');
    case 'device':
      return cssToHex(cfg.deviceEdgeColor ?? '#5c7f99');
    case 'affinity':
    default:
      return cssToHex(cfg.edgeColor ?? '#6a7a8a');
  }
}

function getEdgeBaseOpacity(category: EdgeCategory, cfg: GraphConfig): number {
  switch (category) {
    case 'hub':
      return cfg.hubEdgeOpacity ?? 0.55;
    case 'individual':
      return cfg.individualEdgeOpacity ?? 0.40;
    case 'device':
      return cfg.deviceEdgeOpacity ?? 0.35;
    case 'affinity':
    default:
      return cfg.edgeOpacity ?? 0.45;
  }
}

    interface EdgeState {
      data: Edge3DData;
      line: THREE.Line;
      material: THREE.LineBasicMaterial;
      category: EdgeCategory;
      isHub: boolean;
      revealed: boolean;
      currentOpacity: number;
      targetOpacity: number;
      mid?: { x: number; y: number; z: number; weight?: string; rel?: string; visible: boolean };

      // Overlay Dotted Animated Layer (Line2 with configurable thickness)
      dottedLine: Line2;
      dottedGeo: LineGeometry;
      dottedMat: LineMaterial;
      isConnecting?: boolean;
      connectProgress?: number;
      originPos?: THREE.Vector3;
      targetPos?: THREE.Vector3;
    }

    const edgeStates: EdgeState[] = [];
    const containerW = el.clientWidth || 800;
    const containerH = el.clientHeight || 600;

    edges.forEach((e) => {
      const a = nodeMap.get(e.from);
      const b = nodeMap.get(e.to);
      if (!a || !b) return;

      const category = getEdgeCategory(e, nodes);
      const isHub = category === 'hub';
      const isInitiallyRevealed = !e.hidden || (configRef.current.showAllEdges ?? false);

      // 1. Base Normal Line (Solid)
      const geo = new THREE.BufferGeometry().setFromPoints([a.position, b.position]);
      const baseMat = new THREE.LineBasicMaterial({
        color: getEdgeColorHex(category, configRef.current),
        transparent: true,
        opacity: 0,
      });

      const line = new THREE.Line(geo, baseMat);
      pivot.add(line);

      // 2. Overlay Dotted Animated Line (Line2 with thickness)
      const dottedGeo = new LineGeometry();
      dottedGeo.setPositions([a.position.x, a.position.y, a.position.z, b.position.x, b.position.y, b.position.z]);

      const dottedMat = new LineMaterial({
        color: cssToHex(configRef.current.dottedLineColor ?? configRef.current.selectionColor ?? '#ffffff'),
        linewidth: configRef.current.dottedLineWidth ?? 3.5,
        dashed: true,
        dashSize: configRef.current.dottedDashSize ?? 8,
        gapSize: configRef.current.dottedGapSize ?? 6,
        dashScale: 1,
        transparent: true,
        opacity: 0,
        depthTest: true,
        resolution: new THREE.Vector2(containerW, containerH),
      });

      const dottedLine = new Line2(dottedGeo, dottedMat);
      dottedLine.computeLineDistances();
      dottedLine.visible = false;
      pivot.add(dottedLine);

      const mid = e.weight || e.rel ? {
        x: (a.position.x + b.position.x) / 2,
        y: (a.position.y + b.position.y) / 2,
        z: (a.position.z + b.position.z) / 2,
        weight: e.weight,
        rel: e.rel,
        visible: false,
      } : undefined;

      edgeStates.push({
        data: e,
        line,
        material: baseMat,
        dottedLine,
        dottedGeo,
        dottedMat,
        category,
        isHub,
        revealed: isInitiallyRevealed,
        currentOpacity: 0,
        targetOpacity: isInitiallyRevealed ? getEdgeBaseOpacity(category, configRef.current) : 0,
        mid,
      });
    });

    // ─── Selection State ─────────────────────────────────────────────────────
    let selectedNodeId: string | null = null;
    let activeNeighborIds: Set<string> = new Set();
    let magentaHighlightedNodeIds: Set<string> = new Set();
    let lastClickedNodeId: string | null = null;
    let lastClickTime = 0;

    // ─── Reveal Animation Track ──────────────────────────────────────────────
    let revealClock = 0;
    let revealDone = false;
    const HUB_IN = 0.55;
    const hubNodes = nodes.filter(n => n.type === 'genre' || n.type === 'topic' || n.type === 'series' || n.type === 'state' || n.type === 'income_bracket');
    const peripheralNodes = nodes.filter(n => !hubNodes.includes(n));
    const NODE_INTERVAL = Math.min(0.025, 1.4 / Math.max(1, peripheralNodes.length));
    const REVEAL_END = HUB_IN + peripheralNodes.length * NODE_INTERVAL + 0.3;

    let autoRotating = true;
    let autoRotVel = 0.26;
    const INITIAL_SPIN_DURATION = 9.0;
    const IDLE_DRIFT = 0.035;

    function applySelectionHighlight(nodeId: string | null) {
      selectedNodeId = nodeId;
      activeNeighborIds.clear();
      magentaHighlightedNodeIds.clear();

      const curCfg = configRef.current;
      const selColorHex = cssToHex(curCfg.selectionColor ?? '#ffffff');
      const selHaloOpacity = curCfg.selectionHaloOpacity ?? 0.35;
      const selBlur = curCfg.selectionBlur ?? 1.0;

      if (!nodeId) {
        // Deselect all: restore full visibility, natural geometry, and default colors
        edgeStates.forEach(es => {
          const a = nodeMap.get(es.data.from);
          const b = nodeMap.get(es.data.to);
          if (a && b) {
            const posAttr = es.line.geometry.attributes.position as THREE.BufferAttribute;
            posAttr.setXYZ(0, a.position.x, a.position.y, a.position.z);
            posAttr.setXYZ(1, b.position.x, b.position.y, b.position.z);
            posAttr.needsUpdate = true;

            es.dottedGeo.setPositions([a.position.x, a.position.y, a.position.z, b.position.x, b.position.y, b.position.z]);
            es.dottedLine.computeLineDistances();

            if (es.mid) {
              es.mid.x = (a.position.x + b.position.x) / 2;
              es.mid.y = (a.position.y + b.position.y) / 2;
              es.mid.z = (a.position.z + b.position.z) / 2;
              es.mid.visible = es.revealed || (curCfg.showAllEdges ?? false);
            }
          }
          es.isConnecting = false;
          es.material.color.setHex(getEdgeColorHex(es.category, curCfg));
          const isVis = es.revealed || (curCfg.showAllEdges ?? false);
          es.targetOpacity = isVis ? getEdgeBaseOpacity(es.category, curCfg) : 0;

          // Hide overlay dotted layer
          es.dottedLine.visible = false;
          es.dottedMat.opacity = 0;
        });

        nodes.forEach(n => {
          const halo = haloMap.get(n.id);
          if (halo) {
            (halo.material as THREE.MeshBasicMaterial).opacity = 0;
            halo.scale.setScalar(0);
          }
          const mat = nodeMaterials.get(n.id);
          if (mat) {
            const hex = cssToHex(curCfg.colors[n.type] ?? '#4E6E9D');
            mat.color.setHex(hex);
            mat.emissive.setHex(hex);
            const isHub = n.type === 'genre' || n.type === 'topic' || n.type === 'series' || n.type === 'state' || n.type === 'income_bracket';
            mat.emissiveIntensity = curCfg.glowIntensity * (isHub ? 1.0 : 0.4);
            mat.opacity = 1.0;
          }
          const sprite = glowMap.get(n.id);
          if (sprite) {
            const hex = cssToHex(curCfg.colors[n.type] ?? '#4E6E9D');
            sprite.material.color.setHex(hex);
            const isHub = n.type === 'genre' || n.type === 'topic' || n.type === 'series' || n.type === 'state' || n.type === 'income_bracket';
            sprite.material.opacity = curCfg.glowIntensity * (isHub ? 0.95 : 0.70);
            const sizeMultiplier = curCfg.sizes[n.type] ?? 1.0;
            const baseScale = n.size * (isHub ? 3.8 : 3.2) * sizeMultiplier;
            sprite.scale.set(baseScale, baseScale, 1);
          }
        });
        return;
      }

      // Single-click selection:
      // 1. Configurable halo and soft blur aura on selected node
      // 2. Background base lines attenuate (dim)
      // 3. Overlay Dotted Animated lines activate and flow towards connected neighbors
      activeNeighborIds.add(nodeId);

      const selMesh = nodeMap.get(nodeId);
      const startPos = selMesh ? selMesh.position : new THREE.Vector3();

      edgeStates.forEach(es => {
        const isConnected = es.data.from === nodeId || es.data.to === nodeId;
        if (isConnected) {
          if (!es.revealed) {
            es.revealed = true;
            es.data.hidden = false;
          }
          const neighborId = es.data.from === nodeId ? es.data.to : es.data.from;
          activeNeighborIds.add(neighborId);

          const neighborMesh = nodeMap.get(neighborId);
          if (neighborMesh) {
            if (neighborMesh.scale.x < 0.2) {
              neighborMesh.scale.setScalar(curCfg.sizes[nodes.find(n => n.id === neighborId)?.type ?? 'device'] ?? 1);
              nodeAlpha.set(neighborId, 1);
            }

            // Animate line connection from selected node outward
            if (curCfg.animateConnection !== false) {
              es.isConnecting = true;
              es.connectProgress = 0;
              es.originPos = startPos.clone();
              es.targetPos = neighborMesh.position.clone();

              const posAttr = es.line.geometry.attributes.position as THREE.BufferAttribute;
              posAttr.setXYZ(0, startPos.x, startPos.y, startPos.z);
              posAttr.setXYZ(1, startPos.x, startPos.y, startPos.z);
              posAttr.needsUpdate = true;

              es.dottedGeo.setPositions([startPos.x, startPos.y, startPos.z, startPos.x, startPos.y, startPos.z]);
              es.dottedLine.computeLineDistances();

              if (es.mid) es.mid.visible = false;
            } else {
              es.isConnecting = false;
              const posAttr = es.line.geometry.attributes.position as THREE.BufferAttribute;
              posAttr.setXYZ(0, startPos.x, startPos.y, startPos.z);
              posAttr.setXYZ(1, neighborMesh.position.x, neighborMesh.position.y, neighborMesh.position.z);
              posAttr.needsUpdate = true;

              es.dottedGeo.setPositions([startPos.x, startPos.y, startPos.z, neighborMesh.position.x, neighborMesh.position.y, neighborMesh.position.z]);
              es.dottedLine.computeLineDistances();
            }
          }

          // Base line highlighted beneath dotted line
          es.material.color.setHex(selColorHex);
          es.targetOpacity = 0.50;

          // Overlay Dotted Animated Line activated
          const showDotted = curCfg.enableDottedOverlay !== false;
          es.dottedLine.visible = showDotted;
          es.dottedMat.opacity = showDotted ? (curCfg.dottedLineOpacity ?? 0.95) : 0;
          es.dottedMat.color.setHex(cssToHex(curCfg.dottedLineColor ?? curCfg.selectionColor ?? '#ffffff'));
          es.dottedMat.linewidth = curCfg.dottedLineWidth ?? 3.5;
          es.dottedMat.dashSize = curCfg.dottedDashSize ?? 8;
          es.dottedMat.gapSize = curCfg.dottedGapSize ?? 6;
        } else {
          es.isConnecting = false;
          es.material.color.setHex(getEdgeColorHex(es.category, curCfg));
          const isVis = es.revealed || (curCfg.showAllEdges ?? false);
          es.targetOpacity = isVis ? 0.05 : 0; // Attenuated background edges

          // Hide dotted overlay on background edges
          es.dottedLine.visible = false;
          es.dottedMat.opacity = 0;
        }
      });

      // Update node halos & materials: attenuate unselected background nodes
      nodes.forEach(n => {
        const halo = haloMap.get(n.id);
        const mat = nodeMaterials.get(n.id);
        const sprite = glowMap.get(n.id);
        const isSelf = n.id === nodeId;
        const isNeighbor = activeNeighborIds.has(n.id);
        const isHub = n.type === 'genre' || n.type === 'topic' || n.type === 'series' || n.type === 'state' || n.type === 'income_bracket';

        if (halo) {
          const haloMat = halo.material as THREE.MeshBasicMaterial;
          if (isSelf) {
            haloMat.color.setHex(selColorHex);
            haloMat.opacity = selHaloOpacity;
            halo.scale.setScalar(1.42 * (curCfg.sizes[n.type] ?? 1));
          } else if (isNeighbor) {
            haloMat.color.setHex(selColorHex);
            haloMat.opacity = selHaloOpacity * 0.5;
            halo.scale.setScalar(1.22 * (curCfg.sizes[n.type] ?? 1));
          } else {
            haloMat.opacity = 0;
            halo.scale.setScalar(0);
          }
        }

        if (mat) {
          const hex = cssToHex(curCfg.colors[n.type] ?? '#4E6E9D');
          mat.color.setHex(hex);
          mat.emissive.setHex(hex);

          if (isSelf || isNeighbor) {
            mat.opacity = 1.0;
            mat.emissiveIntensity = curCfg.glowIntensity * (isSelf ? 1.4 : isHub ? 1.0 : 0.6);
          } else {
            // Attenuate background nodes
            mat.opacity = 0.20;
            mat.emissiveIntensity = 0.03;
          }
        }

        if (sprite) {
          if (isSelf) {
            sprite.material.color.setHex(selColorHex);
            sprite.material.opacity = Math.min(1.0, (curCfg.glowIntensity ?? 0.45) * 1.8 * selBlur);
            const selScale = n.size * (4.8 + selBlur * 1.2) * (curCfg.sizes[n.type] ?? 1);
            sprite.scale.set(selScale, selScale, 1);
          } else if (isNeighbor) {
            sprite.material.color.setHex(cssToHex(curCfg.colors[n.type] ?? '#4E6E9D'));
            sprite.material.opacity = (curCfg.glowIntensity ?? 0.45) * 0.85;
            const nbScale = n.size * 3.6 * (curCfg.sizes[n.type] ?? 1);
            sprite.scale.set(nbScale, nbScale, 1);
          } else {
            sprite.material.opacity = (curCfg.glowIntensity ?? 0.45) * 0.08;
          }
        }
      });
    }

    // Double-click expansions
    function handleDoubleClick(node: Node3DData) {
      if (node.type === 'household') {
        // Expand and reveal all connected subgraphs through any path without depth limit
        const visited = new Set<string>();
        const queue: string[] = [node.id];
        visited.add(node.id);

        while (queue.length > 0) {
          const currentId = queue.shift()!;
          edgeStates.forEach(es => {
            if (es.data.from === currentId || es.data.to === currentId) {
              es.revealed = true;
              es.data.hidden = false;
              const nextId = es.data.from === currentId ? es.data.to : es.data.from;
              if (!visited.has(nextId)) {
                visited.add(nextId);
                queue.push(nextId);
                const nextMesh = nodeMap.get(nextId);
                if (nextMesh) {
                  nextMesh.scale.setScalar(configRef.current.sizes[nodes.find(n => n.id === nextId)?.type ?? 'household'] ?? 1);
                  nodeAlpha.set(nextId, 1);
                }
              }
            }
          });
        }
        applySelectionHighlight(node.id);
      } else if (node.type === 'genre') {
        // Traverse Genre -> Households -> Individuals -> Topics and highlight only Topic nodes in Magenta (#D53F8C)
        const genreId = node.id;
        const reachedHouseholds = new Set<string>();
        edgeStates.forEach(es => {
          if (es.data.from === genreId) reachedHouseholds.add(es.data.to);
          if (es.data.to === genreId) reachedHouseholds.add(es.data.from);
        });

        const reachedIndividuals = new Set<string>();
        edgeStates.forEach(es => {
          if (reachedHouseholds.has(es.data.from) && nodes.find(n => n.id === es.data.to)?.type === 'individual') {
            reachedIndividuals.add(es.data.to);
          }
          if (reachedHouseholds.has(es.data.to) && nodes.find(n => n.id === es.data.from)?.type === 'individual') {
            reachedIndividuals.add(es.data.from);
          }
        });

        const reachedTopics = new Set<string>();
        edgeStates.forEach(es => {
          if (reachedIndividuals.has(es.data.from) && nodes.find(n => n.id === es.data.to)?.type === 'topic') {
            reachedTopics.add(es.data.to);
          }
          if (reachedIndividuals.has(es.data.to) && nodes.find(n => n.id === es.data.from)?.type === 'topic') {
            reachedTopics.add(es.data.from);
          }
        });

        // Also check direct genre -> topic cross-links if present
        nodes.filter(n => n.type === 'topic').forEach(t => reachedTopics.add(t.id));

        magentaHighlightedNodeIds = reachedTopics;
        selectedNodeId = null;

        // Reset edges and highlight magenta topics
        edgeStates.forEach(es => {
          es.material.color.setHex(getEdgeColorHex(es.category, configRef.current));
          const isVis = es.revealed || (configRef.current.showAllEdges ?? false);
          es.targetOpacity = isVis ? getEdgeBaseOpacity(es.category, configRef.current) : 0;
          es.dottedLine.visible = false;
          es.dottedMat.opacity = 0;
        });

        nodes.forEach(n => {
          const halo = haloMap.get(n.id);
          const mat = nodeMaterials.get(n.id);
          const sprite = glowMap.get(n.id);
          if (reachedTopics.has(n.id)) {
            if (halo) {
              const haloMat = halo.material as THREE.MeshBasicMaterial;
              haloMat.color.setHex(MAGENTA_TOPIC);
              haloMat.opacity = 0.95;
              halo.scale.setScalar(1.4 * (configRef.current.sizes[n.type] ?? 1));
            }
            if (mat) {
              mat.color.setHex(MAGENTA_TOPIC);
              mat.emissive.setHex(MAGENTA_TOPIC);
              mat.emissiveIntensity = 0.8;
            }
            if (sprite) {
              sprite.material.color.setHex(MAGENTA_TOPIC);
              sprite.material.opacity = 1.0;
              const topScale = n.size * 4.4 * (configRef.current.sizes[n.type] ?? 1);
              sprite.scale.set(topScale, topScale, 1);
            }
          } else {
            if (halo) {
              (halo.material as THREE.MeshBasicMaterial).opacity = 0;
              halo.scale.setScalar(0);
            }
            if (sprite) {
              sprite.material.opacity = 0.1 * configRef.current.glowIntensity;
            }
          }
        });
      }
    }

    resetHighlightRef.current = () => applySelectionHighlight(null);

    // ─── Draw 2D Labels ──────────────────────────────────────────────────────
    function drawLabels() {
      const ctx = lc.getContext('2d')!;
      const dpr = window.devicePixelRatio;
      ctx.clearRect(0, 0, lc.width, lc.height);

      const cfg = configRef.current;
      const nodeTextScale = cfg.textSize ?? 1.0;
      const nodeTextAlpha = cfg.textOpacity ?? 1.0;

      if (nodeTextScale > 0.01) {
        nodes.forEach(n => {
          const alpha = nodeAlpha.get(n.id) ?? 0;
          if (alpha <= 0) return;
          const mesh = nodeMap.get(n.id);
          if (!mesh) return;

          const { sx, sy, behind } = project(n.x, n.y, n.z);
          if (behind) return;

          const isHub = n.type === 'genre' || n.type === 'topic' || n.type === 'series' || n.type === 'state' || n.type === 'income_bracket';
          const isIndividual = n.type === 'individual';
          const isHousehold = n.type === 'household' || n.type === 'experian_household';
          const isSelected = selectedNodeId === n.id;
          const isNeighbor = activeNeighborIds.has(n.id);
          const isMagenta = magentaHighlightedNodeIds.has(n.id);

          // Individual text opacity vs household ID opacity vs hub title opacity
          let categoryAlpha = nodeTextAlpha;
          if (isIndividual && cfg.individualTextOpacity !== undefined) {
            categoryAlpha = cfg.individualTextOpacity;
          } else if (isHousehold && cfg.householdTextOpacity !== undefined) {
            categoryAlpha = cfg.householdTextOpacity;
          } else if (isHub && cfg.hubTextOpacity !== undefined) {
            categoryAlpha = cfg.hubTextOpacity;
          }

          if (categoryAlpha <= 0.005) return;

          const fontSize = (isHub ? 13 : isSelected ? 12 : 10) * dpr * nodeTextScale;
          ctx.font = `${isHub || isSelected ? '600' : '500'} ${fontSize}px Inter, 'Season Sans', sans-serif`;
          ctx.textAlign = 'center';

          // All node labels are pure white (#ffffff)
          if (selectedNodeId) {
            if (isSelected) {
              ctx.globalAlpha = 1.0 * categoryAlpha;
              ctx.fillStyle = '#ffffff';
            } else if (isNeighbor) {
              ctx.globalAlpha = 0.95 * categoryAlpha;
              ctx.fillStyle = '#ffffff';
            } else {
              ctx.globalAlpha = 0.18 * alpha * categoryAlpha; // Attenuated background label
              ctx.fillStyle = '#ffffff';
            }
          } else {
            ctx.globalAlpha = alpha * categoryAlpha;
            if (isMagenta) {
              ctx.fillStyle = '#ff70c7';
            } else {
              ctx.fillStyle = '#ffffff'; // White text
            }
          }

          ctx.shadowColor = 'rgba(0,0,0,0.95)';
          ctx.shadowBlur = (isHub ? 6 : 4) * dpr;

          const yOffset = isHub ? n.size + 16 : -n.size - 5;
          ctx.fillText(n.label, sx * dpr, (sy + yOffset) * dpr);
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        });
      }

      // Edge weight & relation labels
      if (cfg.showEdgeText !== false) {
        const edgeTextScale = cfg.edgeTextSize ?? 1.0;
        const edgeColor = cfg.edgeTextColor ?? '#d1d5db';

        edgeStates.forEach(es => {
          const m = es.mid;
          if (!m || !m.visible || es.currentOpacity < 0.25) return;
          const { sx, sy, behind } = project(m.x, m.y, m.z);
          if (behind) return;

          const d2 = window.devicePixelRatio;
          ctx.shadowColor = 'rgba(0,0,0,0.95)';
          ctx.shadowBlur = 4 * d2;
          ctx.globalAlpha = Math.min(1, es.currentOpacity * 1.5);

          if (m.rel) {
            ctx.font = `400 ${8.5 * d2 * edgeTextScale}px Inter, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillStyle = selectedNodeId ? '#ffffff' : '#d1d5db';
            ctx.fillText(m.rel, sx * d2, (sy - 6 * edgeTextScale) * d2);
          }
          if (m.weight) {
            ctx.font = `600 ${9 * d2 * edgeTextScale}px Inter, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(m.weight, sx * d2, (sy + 5 * edgeTextScale) * d2);
          }
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        });
      }
    }

    // ─── Reveal Physics Animation ────────────────────────────────────────────
    function updateReveal(dt: number) {
      if (revealDone) return;
      revealClock += dt;

      // Hubs pop in first
      const hubT = Math.min(revealClock / HUB_IN, 1);
      const hubEased = easeOutBack(hubT);
      hubNodes.forEach(hn => {
        const mesh = nodeMap.get(hn.id);
        if (mesh) {
          mesh.scale.setScalar(Math.max(0, hubEased * (configRef.current.sizes[hn.type] ?? 1)));
          nodeAlpha.set(hn.id, easeInOutCubic(hubT));
        }
        const sprite = glowMap.get(hn.id);
        if (sprite) {
          const glowScale = hn.size * 3.8 * Math.max(0, hubEased * (configRef.current.sizes[hn.type] ?? 1));
          sprite.scale.set(glowScale, glowScale, 1);
          sprite.material.opacity = (configRef.current.glowIntensity ?? 0.25) * 0.95 * easeInOutCubic(hubT);
        }
      });

      // Peripheral nodes sequence in
      if (revealClock >= HUB_IN) {
        const elapsed = revealClock - HUB_IN;
        peripheralNodes.forEach((pn, i) => {
          const revealAt = i * NODE_INTERVAL;
          if (elapsed < revealAt) return;
          const localT = Math.min((elapsed - revealAt) / 0.22, 1);
          const eased = easeOutBack(localT);
          const mesh = nodeMap.get(pn.id);
          if (mesh) {
            mesh.scale.setScalar(Math.max(0, eased * (configRef.current.sizes[pn.type] ?? 1)));
            nodeAlpha.set(pn.id, easeInOutCubic(localT));
          }
          const sprite = glowMap.get(pn.id);
          if (sprite) {
            const glowScale = pn.size * 3.2 * Math.max(0, eased * (configRef.current.sizes[pn.type] ?? 1));
            sprite.scale.set(glowScale, glowScale, 1);
            sprite.material.opacity = (configRef.current.glowIntensity ?? 0.25) * 0.70 * easeInOutCubic(localT);
          }
        });
      }

      // Initial visible edge line fade-in
      edgeStates.forEach(es => {
        if (!es.revealed && !configRef.current.showAllEdges) return;
        const nodeA = nodeAlpha.get(es.data.from) ?? 0;
        const nodeB = nodeAlpha.get(es.data.to) ?? 0;
        const edgeAlpha = Math.min(nodeA, nodeB);
        es.targetOpacity = edgeAlpha * getEdgeBaseOpacity(es.category, configRef.current);
        if (es.mid) es.mid.visible = edgeAlpha > 0.4;
      });

      if (revealClock >= REVEAL_END) {
        revealDone = true;
      }
    }

    // ─── Interaction (Orbit, Pan, Raycasting, Double-Click) ───────────────────
    let isDragging = false, isPanning = false;
    let prevX = 0, prevY = 0, velX = 0, velY = 0;
    const clampZ = (z: number) => Math.max(280, Math.min(1800, z));

    zoomFnRef.current = (delta) => {
      camera.position.z = clampZ(camera.position.z + delta);
    };
    panFnRef.current = (dx, dy) => {
      camera.position.x -= dx;
      camera.position.y += dy;
    };

    let mouseDownAt = { x: 0, y: 0 };
    const raycaster = new THREE.Raycaster();

    const onDown = (e: MouseEvent | TouchEvent) => {
      const { clientX, clientY } = 'touches' in e ? e.touches[0] : (e as MouseEvent);
      prevX = clientX;
      prevY = clientY;
      velX = 0;
      velY = 0;
      mouseDownAt = { x: clientX, y: clientY };

      const isRightOrMiddle = 'button' in e && (e.button === 1 || e.button === 2);
      const isShift = 'shiftKey' in e && (e as MouseEvent).shiftKey;
      if (isRightOrMiddle || isShift) {
        isPanning = true;
      } else {
        autoRotating = false;
        isDragging = true;
      }
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      const { clientX, clientY } = 'touches' in e ? e.touches[0] : (e as MouseEvent);
      const dx = clientX - prevX;
      const dy = clientY - prevY;

      if (isDragging) {
        velX = dx;
        velY = dy;
        pivot.rotation.y += dx * 0.005;
        pivot.rotation.x += dy * 0.005;
        pivot.rotation.x = Math.max(-Math.PI / 2.1, Math.min(Math.PI / 2.1, pivot.rotation.x));
      } else if (isPanning) {
        const speed = camera.position.z / 850;
        camera.position.x -= dx * speed;
        camera.position.y += dy * speed;
      }
      prevX = clientX;
      prevY = clientY;
    };

    const onUp = (e: MouseEvent | TouchEvent) => {
      isDragging = false;
      isPanning = false;

      const { clientX, clientY } = 'changedTouches' in e ? e.changedTouches[0] : (e as MouseEvent);
      const dx = clientX - mouseDownAt.x;
      const dy = clientY - mouseDownAt.y;

      // If pointer barely moved, treat as Click / Double-Click
      if (Math.sqrt(dx * dx + dy * dy) < 7) {
        const rect = renderer.domElement.getBoundingClientRect();
        const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
        const ndcY = -((clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);

        const meshes = [...meshToNode.keys()].filter(m => m.scale.x > 0.05);
        const hits = raycaster.intersectObjects(meshes);

        const now = performance.now();

        if (hits.length > 0) {
          const hitNode = meshToNode.get(hits[0].object as THREE.Mesh) ?? null;
          if (hitNode) {
            const isDouble = lastClickedNodeId === hitNode.id && (now - lastClickTime) < 360;
            lastClickedNodeId = hitNode.id;
            lastClickTime = now;

            if (isDouble) {
              handleDoubleClick(hitNode);
            } else {
              applySelectionHighlight(hitNode.id);
              onNodeClickRef.current?.(hitNode);
            }
          }
        } else {
          // Click empty space: deselect and reset
          lastClickedNodeId = null;
          applySelectionHighlight(null);
          onNodeClickRef.current?.(null);
        }
      }
    };

    const onContext = (e: MouseEvent) => e.preventDefault();

    renderer.domElement.addEventListener('mousedown', onDown);
    renderer.domElement.addEventListener('contextmenu', onContext);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    renderer.domElement.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    renderer.domElement.addEventListener('wheel', (e) => {
      camera.position.z = clampZ(camera.position.z + e.deltaY * 0.6);
    }, { passive: true });

    // ─── Render Animation Loop ───────────────────────────────────────────────
    let rafId: number;
    let lastTime = performance.now();
    let t = 0;

    let lastCfgColors = { ...configRef.current.colors };
    let lastCfgSizes = { ...configRef.current.sizes };
    let lastGlowIntensity = configRef.current.glowIntensity;
    let lastEdgeColor = configRef.current.edgeColor;
    let lastHubEdgeColor = configRef.current.hubEdgeColor;
    let lastIndividualEdgeColor = configRef.current.individualEdgeColor;
    let lastDeviceEdgeColor = configRef.current.deviceEdgeColor;
    let lastEdgeOpacity = configRef.current.edgeOpacity;
    let lastHubEdgeOpacity = configRef.current.hubEdgeOpacity;
    let lastIndividualEdgeOpacity = configRef.current.individualEdgeOpacity;
    let lastDeviceEdgeOpacity = configRef.current.deviceEdgeOpacity;
    let lastShowAllEdges = configRef.current.showAllEdges ?? false;
    let lastGlobalScale = configRef.current.globalScale ?? 1.0;
    let lastSelectionColor = configRef.current.selectionColor ?? '#ffffff';
    let lastSelectionHaloOpacity = configRef.current.selectionHaloOpacity ?? 0.35;
    let lastSelectionBlur = configRef.current.selectionBlur ?? 1.0;
    let lastDottedLineWidth = configRef.current.dottedLineWidth ?? 3.5;
    let lastDottedLineColor = configRef.current.dottedLineColor ?? configRef.current.selectionColor ?? '#ffffff';
    let lastDottedLineOpacity = configRef.current.dottedLineOpacity ?? 0.95;
    let lastDottedDashSize = configRef.current.dottedDashSize ?? 8;
    let lastDottedGapSize = configRef.current.dottedGapSize ?? 6;
    let lastEnableDottedOverlay = configRef.current.enableDottedOverlay !== false;

    function syncConfig() {
      const c = configRef.current;

      // 1. Overall Graph Scale
      const curGlobalScale = c.globalScale ?? 1.0;
      if (curGlobalScale !== lastGlobalScale) {
        pivot.scale.setScalar(curGlobalScale);
        lastGlobalScale = curGlobalScale;
      }

      // 2. Glow or Colors
      const glowChanged = c.glowIntensity !== lastGlowIntensity;
      let colorsChanged = false;
      for (const k of Object.keys(c.colors)) {
        if (c.colors[k] !== lastCfgColors[k]) {
          colorsChanged = true;
          break;
        }
      }

      if (colorsChanged || glowChanged) {
        nodes.forEach(n => {
          const mat = nodeMaterials.get(n.id);
          const isHub = n.type === 'genre' || n.type === 'topic' || n.type === 'series' || n.type === 'state' || n.type === 'income_bracket';
          if (mat && selectedNodeId !== n.id && !magentaHighlightedNodeIds.has(n.id)) {
            const hex = cssToHex(c.colors[n.type] ?? '#4E6E9D');
            mat.color.setHex(hex);
            mat.emissive.setHex(hex);
            mat.emissiveIntensity = c.glowIntensity * (isHub ? 1.0 : 0.4);
          }
          const sprite = glowMap.get(n.id);
          if (sprite && selectedNodeId !== n.id && !magentaHighlightedNodeIds.has(n.id)) {
            const hex = cssToHex(c.colors[n.type] ?? '#4E6E9D');
            sprite.material.color.setHex(hex);
            const alpha = nodeAlpha.get(n.id) ?? 1;
            sprite.material.opacity = c.glowIntensity * (isHub ? 0.95 : 0.70) * alpha;
          }
        });
        if (colorsChanged) lastCfgColors = { ...c.colors };
        if (glowChanged) lastGlowIntensity = c.glowIntensity;
      }

      // 3. Node Sizes
      let sizesChanged = false;
      for (const k of Object.keys(c.sizes)) {
        if (c.sizes[k] !== lastCfgSizes[k]) {
          sizesChanged = true;
          break;
        }
      }

      if (sizesChanged && revealDone) {
        nodes.forEach(n => {
          const isHub = n.type === 'genre' || n.type === 'topic' || n.type === 'series' || n.type === 'state' || n.type === 'income_bracket';
          const sizeMultiplier = c.sizes[n.type] ?? 1.0;
          const mesh = nodeMap.get(n.id);
          if (mesh && mesh.scale.x > 0.05 && selectedNodeId !== n.id) {
            mesh.scale.setScalar(sizeMultiplier);
          }
          const sprite = glowMap.get(n.id);
          if (sprite && sprite.scale.x > 0.05 && selectedNodeId !== n.id) {
            const baseScale = n.size * (isHub ? 3.8 : 3.2) * sizeMultiplier;
            sprite.scale.set(baseScale, baseScale, 1);
          }
        });
        lastCfgSizes = { ...c.sizes };
      }

      // 4. Base Edge Colors & Opacities & Show All
      const curShowAllEdges = c.showAllEdges ?? false;
      const showAllEdgesToggled = curShowAllEdges !== lastShowAllEdges;
      const edgeColorsChanged =
        c.edgeColor !== lastEdgeColor ||
        c.hubEdgeColor !== lastHubEdgeColor ||
        c.individualEdgeColor !== lastIndividualEdgeColor ||
        c.deviceEdgeColor !== lastDeviceEdgeColor;
      const edgeOpacitiesChanged =
        c.edgeOpacity !== lastEdgeOpacity ||
        c.hubEdgeOpacity !== lastHubEdgeOpacity ||
        c.individualEdgeOpacity !== lastIndividualEdgeOpacity ||
        c.deviceEdgeOpacity !== lastDeviceEdgeOpacity;

      if (edgeColorsChanged || edgeOpacitiesChanged || showAllEdgesToggled) {
        edgeStates.forEach(es => {
          const isConnectedToSelection = selectedNodeId && (es.data.from === selectedNodeId || es.data.to === selectedNodeId);

          // Update color for unselected edges
          if (!isConnectedToSelection) {
            es.material.color.setHex(getEdgeColorHex(es.category, c));
          }

          if (showAllEdgesToggled && curShowAllEdges) {
            es.revealed = true;
          }

          if (revealDone) {
            const isVisible = es.revealed || curShowAllEdges;
            if (selectedNodeId) {
              if (!isConnectedToSelection) {
                es.targetOpacity = isVisible ? 0.05 : 0;
              }
            } else {
              es.targetOpacity = isVisible ? getEdgeBaseOpacity(es.category, c) : 0;
            }
          }
        });

        lastEdgeColor = c.edgeColor;
        lastHubEdgeColor = c.hubEdgeColor;
        lastIndividualEdgeColor = c.individualEdgeColor;
        lastDeviceEdgeColor = c.deviceEdgeColor;
        lastEdgeOpacity = c.edgeOpacity;
        lastHubEdgeOpacity = c.hubEdgeOpacity;
        lastIndividualEdgeOpacity = c.individualEdgeOpacity;
        lastDeviceEdgeOpacity = c.deviceEdgeOpacity;
        lastShowAllEdges = curShowAllEdges;
      }

      // 5. Overlay Dotted Lines Configuration
      const curDottedLineWidth = c.dottedLineWidth ?? 3.5;
      const curDottedLineColor = c.dottedLineColor ?? c.selectionColor ?? '#ffffff';
      const curDottedLineOpacity = c.dottedLineOpacity ?? 0.95;
      const curDottedDashSize = c.dottedDashSize ?? 8;
      const curDottedGapSize = c.dottedGapSize ?? 6;
      const curEnableDotted = c.enableDottedOverlay !== false;

      const dottedChanged =
        curDottedLineWidth !== lastDottedLineWidth ||
        curDottedLineColor !== lastDottedLineColor ||
        curDottedLineOpacity !== lastDottedLineOpacity ||
        curDottedDashSize !== lastDottedDashSize ||
        curDottedGapSize !== lastDottedGapSize ||
        curEnableDotted !== lastEnableDottedOverlay;

      if (dottedChanged) {
        edgeStates.forEach(es => {
          es.dottedMat.linewidth = curDottedLineWidth;
          es.dottedMat.dashSize = curDottedDashSize;
          es.dottedMat.gapSize = curDottedGapSize;

          const isConnectedToSelection = selectedNodeId && (es.data.from === selectedNodeId || es.data.to === selectedNodeId);
          if (isConnectedToSelection) {
            es.dottedLine.visible = curEnableDotted;
            es.dottedMat.opacity = curEnableDotted ? curDottedLineOpacity : 0;
            es.dottedMat.color.setHex(cssToHex(curDottedLineColor));
          }
        });

        lastDottedLineWidth = curDottedLineWidth;
        lastDottedLineColor = curDottedLineColor;
        lastDottedLineOpacity = curDottedLineOpacity;
        lastDottedDashSize = curDottedDashSize;
        lastDottedGapSize = curDottedGapSize;
        lastEnableDottedOverlay = curEnableDotted;
      }

      // 6. Selection Color, Blur, or Halo Opacity changed while node selected
      const curSelColor = c.selectionColor ?? '#ffffff';
      const curSelHaloOpacity = c.selectionHaloOpacity ?? 0.35;
      const curSelBlur = c.selectionBlur ?? 1.0;
      if (curSelColor !== lastSelectionColor || curSelHaloOpacity !== lastSelectionHaloOpacity || curSelBlur !== lastSelectionBlur) {
        if (selectedNodeId) {
          applySelectionHighlight(selectedNodeId);
        }
        lastSelectionColor = curSelColor;
        lastSelectionHaloOpacity = curSelHaloOpacity;
        lastSelectionBlur = curSelBlur;
      }
    }

    function animate(now: number) {
      rafId = requestAnimationFrame(animate);
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      t += dt;

      // Sync graph editor configuration in real-time
      syncConfig();

      // Update Reveal physics
      updateReveal(dt);

      // Marching dashes/dots animated flow along overlay dotted lines
      const speed = configRef.current.edgeDashSpeed ?? 1.5;
      const isDottedEnabled = configRef.current.enableDottedOverlay !== false;

      edgeStates.forEach(es => {
        // Continuous traveling dot flow
        if (isDottedEnabled && es.dottedLine.visible && es.dottedMat.opacity > 0.01) {
          es.dottedMat.dashOffset -= speed * dt * 45;
        }

        // Base line opacity lerp
        es.currentOpacity += (es.targetOpacity - es.currentOpacity) * 0.15;
        es.material.opacity = es.currentOpacity;

        // Dynamic line connection drawing animation (outward motion on click)
        if (es.isConnecting && es.originPos && es.targetPos) {
          es.connectProgress = Math.min(1.0, (es.connectProgress ?? 0) + dt * 3.6);
          const easeT = easeOutCubic(es.connectProgress);
          const curEnd = new THREE.Vector3().lerpVectors(es.originPos, es.targetPos, easeT);

          // Update base line
          const posAttr = es.line.geometry.attributes.position as THREE.BufferAttribute;
          posAttr.setXYZ(0, es.originPos.x, es.originPos.y, es.originPos.z);
          posAttr.setXYZ(1, curEnd.x, curEnd.y, curEnd.z);
          posAttr.needsUpdate = true;

          // Update overlay Line2 dotted geometry
          es.dottedGeo.setPositions([es.originPos.x, es.originPos.y, es.originPos.z, curEnd.x, curEnd.y, curEnd.z]);
          es.dottedLine.computeLineDistances();

          if (es.mid) {
            es.mid.x = (es.originPos.x + curEnd.x) / 2;
            es.mid.y = (es.originPos.y + curEnd.y) / 2;
            es.mid.z = (es.originPos.z + curEnd.z) / 2;
            es.mid.visible = es.connectProgress > 0.65;
          }

          if (es.connectProgress >= 1.0) {
            es.isConnecting = false;
          }
        }
      });

      // Rotation & Inertia
      if (!isDragging) {
        if (autoRotating) {
          const spinProgress = Math.min(t / INITIAL_SPIN_DURATION, 1.0);
          const targetVel = (1 - easeInOutCubic(spinProgress)) * 0.26 + IDLE_DRIFT;
          autoRotVel += (targetVel - autoRotVel) * 0.05 * 60 * dt;
          pivot.rotation.y += autoRotVel * dt;
        } else {
          velX *= Math.pow(0.92, 60 * dt);
          velY *= Math.pow(0.92, 60 * dt);
          pivot.rotation.y += velX * 0.003;
          pivot.rotation.x += velY * 0.003;
        }
      }

      // Hub node subtle idle breathing pulse & aura
      if (revealDone) {
        const pulse = 1 + Math.sin(t * 2) * 0.025;
        const glowPulse = 1 + Math.sin(t * 2) * 0.08;
        hubNodes.forEach(hn => {
          if (hn.id !== selectedNodeId && !magentaHighlightedNodeIds.has(hn.id)) {
            const mesh = nodeMap.get(hn.id);
            if (mesh) mesh.scale.setScalar((configRef.current.sizes[hn.type] ?? 1) * pulse);
            const sprite = glowMap.get(hn.id);
            if (sprite) {
              const hubScale = hn.size * 3.8 * (configRef.current.sizes[hn.type] ?? 1) * glowPulse;
              sprite.scale.set(hubScale, hubScale, 1);
            }
          }
        });
      }

      renderer.render(scene, camera);
      drawLabels();
    }
    rafId = requestAnimationFrame(animate);

    const ro = new ResizeObserver(() => {
      const w = el!.clientWidth, h = el!.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      resizeLc();
      edgeStates.forEach(es => {
        es.dottedMat.resolution.set(w, h);
      });
    });
    ro.observe(el);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      renderer.domElement.removeEventListener('mousedown', onDown);
      renderer.domElement.removeEventListener('contextmenu', onContext);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      renderer.domElement.removeEventListener('touchstart', onDown);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      if (lc.parentNode === el) el.removeChild(lc);
    };
  }, [activeDataset]);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: 500,
        cursor: 'grab',
        userSelect: 'none',
        backgroundColor: '#111111',
      }}
    />
  );
});

export default Graph3D;
