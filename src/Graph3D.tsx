import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';

export type NodeType = 'genre' | 'topic' | 'household' | 'individual';

export interface GraphConfig {
  colors:        Record<NodeType, string>;
  sizes:         Record<NodeType, number>;
  glowIntensity: number;   // 0–1, emissive intensity multiplier
  edgeColor:     string;
  hubEdgeColor:  string;
  edgeOpacity:   number;
}

export const DEFAULT_GRAPH_CONFIG: GraphConfig = {
  colors:        { genre: '#38A169', topic: '#D53F8C', household: '#4E6E9D', individual: '#EF3557' },
  sizes:         { genre: 1, topic: 1, household: 1, individual: 1 },
  glowIntensity: 0.25,
  edgeColor:     '#6a7a8a',
  hubEdgeColor:  '#9aaaaa',
  edgeOpacity:   0.45,
};

export interface Graph3DHandle {
  zoom: (delta: number) => void;   // positive = zoom in, negative = zoom out
  pan:  (dx: number, dy: number) => void;
}

function cssToHex(css: string | undefined): number {
  if (!css) return 0x6a7a8a;
  return parseInt(css.replace('#', ''), 16);
}

// ─── Colors from Figma design ────────────────────────────────────────────────
const EDGE_COLORS = { edge: 0x6a7a8a, edgeHub: 0x9aaaaa, bg: 0x111111 };

export interface Node3D {
  id: string; label: string; type: NodeType;
  x: number; y: number; z: number; size: number;
}
interface Edge3D { from: string; to: string; weight?: string; rel?: string }

const HH_IDS = [
  '2a3c85ba5b7588ad','3875d60a53a61971','6e382a05b1af1d9b','3755283108548888',
  'e00a493c8c98f734','770a764a077729db','6a48bc3421e45de6','4801141778832035',
  '8612846182973880','f95a680f0ed7e4e4','c54ccbf5624389ca','e9543400f413ac09',
  'e8bbb6fa0afd5cb6','dc33e75c07031ad0','a6aa69cc9ce634e8','4569387219552335',
  '-538117694897656','174916023354764','-587392188977142','5f89f4a6731ff2e9',
];
const IND_IDS = [
  '64aa10689b7507ec','cebcdbf756ee10b4','db3caa36ef541f49','500df0e75055093c',
  '471cef7a96ef3f2b','804e64b1934d720d','ec988ef278528424','dc33e75c07031ad1',
  '-2329183756794299','7cf5131e5552f538','95e73a1af61ff2b6','14c6da983a55a902',
  '64dea901d7af6e7b','ef6d2785d945fd3b','a66a60fc38a72d3d',
];

function fibSphere(n: number, radius: number): [number, number, number][] {
  const pts: [number, number, number][] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    pts.push([Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius]);
  }
  return pts;
}

function buildScene(): { nodes: Node3D[]; edges: Edge3D[] } {
  const nodes: Node3D[] = [];
  const edges: Edge3D[] = [];

  nodes.push({ id: 'sports', label: 'Sports', type: 'topic',  x: -160, y: 0, z: 0, size: 24 });
  nodes.push({ id: 'comedy', label: 'Comedy', type: 'genre',  x:  160, y: 0, z: 0, size: 22 });

  const positions = fibSphere(35, 310);
  const hhIds: string[] = [];
  const indIds: string[] = [];

  for (let i = 0; i < 20; i++) {
    const [x, y, z] = positions[i];
    const id = `hh${i}`;
    nodes.push({ id, label: HH_IDS[i], type: 'household', x, y, z, size: 10 });
    hhIds.push(id);
  }
  for (let i = 20; i < 35; i++) {
    const [x, y, z] = positions[i];
    const id = `ind${i - 20}`;
    nodes.push({ id, label: IND_IDS[i - 20], type: 'individual', x, y, z, size: 10 });
    indIds.push(id);
  }

  const weights = ['0.06','0.11','0.17','0.22','0.25','0.28','0.33','0.36','0.39','0.46','0.47','0.49','0.62','0.81','0.93','1.00'];
  hhIds.forEach((id, i) => {
    edges.push({ from: i % 2 === 0 ? 'sports' : 'comedy', to: id, rel: 'hasIndividual', weight: weights[i % weights.length] });
  });
  indIds.forEach((id, i) => {
    edges.push({ from: i % 2 === 0 ? 'comedy' : 'sports', to: id, rel: 'hasIndividual', weight: weights[(i + 5) % weights.length] });
  });
  edges.push({ from: 'sports', to: 'comedy', weight: '0.81' });
  hhIds.slice(0, 4).forEach((id, i) => {
    edges.push({ from: id, to: indIds[i * 3 % indIds.length], weight: weights[i % weights.length] });
  });

  return { nodes, edges };
}

const Graph3D = forwardRef<Graph3DHandle, { config?: GraphConfig; onNodeClick?: (node: Node3D | null) => void }>(function Graph3D({ config, onNodeClick }, ref) {
  const mountRef = useRef<HTMLDivElement>(null);
  const merged: GraphConfig = { ...DEFAULT_GRAPH_CONFIG, ...config, colors: { ...DEFAULT_GRAPH_CONFIG.colors, ...config?.colors }, sizes: { ...DEFAULT_GRAPH_CONFIG.sizes, ...config?.sizes } };
  const configRef = useRef(merged);
  configRef.current = merged;

  const onNodeClickRef = useRef(onNodeClick);
  onNodeClickRef.current = onNodeClick;

  // Imperative zoom/pan — updated by the effect via a stable callback ref
  const zoomFnRef = useRef<(delta: number) => void>(() => {});
  const panFnRef  = useRef<(dx: number, dy: number) => void>(() => {});

  useImperativeHandle(ref, () => ({
    zoom: (delta) => zoomFnRef.current(delta),
    pan:  (dx, dy) => panFnRef.current(dx, dy),
  }));

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth, H = el.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(W, H);
    renderer.setClearColor(EDGE_COLORS.bg, 1);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 1, 3000);
    camera.position.set(0, 0, 700);

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(1, 2, 3); scene.add(dir);
    const pt = new THREE.PointLight(0x6781a8, 1.2, 1200);
    pt.position.set(-200, 200, 200); scene.add(pt);

    const { nodes, edges } = buildScene();
    const pivot = new THREE.Group();
    scene.add(pivot);

    // ─── Materials ───────────────────────────────────────────────────────────
    const cfg = configRef.current;
    const matOf: Record<NodeType, THREE.MeshPhongMaterial> = {
      genre:      new THREE.MeshPhongMaterial({ color: cssToHex(cfg.colors.genre),      shininess: 80, emissive: cssToHex(cfg.colors.genre),      emissiveIntensity: 0.25 }),
      topic:      new THREE.MeshPhongMaterial({ color: cssToHex(cfg.colors.topic),      shininess: 80, emissive: cssToHex(cfg.colors.topic),      emissiveIntensity: 0.25 }),
      household:  new THREE.MeshPhongMaterial({ color: cssToHex(cfg.colors.household),  shininess: 60, emissive: cssToHex(cfg.colors.household),  emissiveIntensity: 0.15 }),
      individual: new THREE.MeshPhongMaterial({ color: cssToHex(cfg.colors.individual), shininess: 60, emissive: cssToHex(cfg.colors.individual), emissiveIntensity: 0.15 }),
    };
    // keep ref so animate loop can hot-update materials
    const matOfRef = matOf;


    // ─── Build all node meshes (start hidden) ─────────────────────────────────
    const nodeMap    = new Map<string, THREE.Mesh>();
    const meshToNode = new Map<THREE.Mesh, Node3D>();
    const nodeOrder  = nodes.map(n => n.id);

    nodes.forEach(n => {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(n.size, 24, 16), matOf[n.type].clone());
      mesh.position.set(n.x, n.y, n.z);
      mesh.scale.setScalar(0); // hidden initially
      pivot.add(mesh);
      nodeMap.set(n.id, mesh);
      meshToNode.set(mesh, n);
    });

    // ─── Build all edge lines (start invisible) ───────────────────────────────
    const edgeMids: { x: number; y: number; z: number; weight: string; rel?: string; visible: boolean }[] = [];
    const edgeLines: THREE.Line[] = [];

    edges.forEach(e => {
      const a = nodeMap.get(e.from), b = nodeMap.get(e.to);
      if (!a || !b) return;
      const geo = new THREE.BufferGeometry().setFromPoints([a.position, b.position]);
      const isHub = (e.from === 'sports' || e.from === 'comedy') && (e.to === 'sports' || e.to === 'comedy');
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({
        color: cssToHex(isHub ? cfg.hubEdgeColor : cfg.edgeColor),
        transparent: true, opacity: 0,
      }));
      pivot.add(line);
      edgeLines.push(line);
      if (e.weight) {
        edgeMids.push({
          x: (a.position.x + b.position.x) / 2,
          y: (a.position.y + b.position.y) / 2,
          z: (a.position.z + b.position.z) / 2,
          weight: e.weight, rel: e.rel, visible: false,
        });
      }
    });

    // Stars
    const starGeo = new THREE.BufferGeometry();
    const sp: number[] = [];
    for (let i = 0; i < 600; i++) sp.push((Math.random()-0.5)*3000, (Math.random()-0.5)*3000, (Math.random()-0.5)*3000);
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0x2a2a44, size: 1.5, sizeAttenuation: true })));

    // ─── Label canvas ────────────────────────────────────────────────────────
    const lc = document.createElement('canvas');
    lc.style.cssText = 'position:absolute;inset:0;pointer-events:none;';
    el.style.position = 'relative';
    el.appendChild(lc);
    function resizeLc() {
      lc.width  = el!.clientWidth  * window.devicePixelRatio;
      lc.height = el!.clientHeight * window.devicePixelRatio;
      lc.style.width  = el!.clientWidth  + 'px';
      lc.style.height = el!.clientHeight + 'px';
    }
    resizeLc();

    function project(wx: number, wy: number, wz: number) {
      const v = new THREE.Vector3(wx, wy, wz);
      pivot.localToWorld(v); v.project(camera);
      return { sx: (v.x * 0.5 + 0.5) * el!.clientWidth, sy: (-v.y * 0.5 + 0.5) * el!.clientHeight, behind: v.z > 1 };
    }

    // nodeAlpha tracks per-node label visibility (0→1)
    const nodeAlpha = new Map<string, number>(nodes.map(n => [n.id, 0]));

    function drawLabels() {
      const ctx = lc.getContext('2d')!;
      const dpr = window.devicePixelRatio;
      ctx.clearRect(0, 0, lc.width, lc.height);

      nodes.forEach(n => {
        const alpha = nodeAlpha.get(n.id) ?? 0;
        if (alpha <= 0) return;
        const mesh = nodeMap.get(n.id); if (!mesh) return;
        const { sx, sy, behind } = project(n.x, n.y, n.z);
        if (behind) return;
        const isHub = n.id === 'sports' || n.id === 'comedy';
        const fontSize = (isHub ? 14 : 9) * dpr;
        ctx.font = `${isHub ? 600 : 400} ${fontSize}px Inter, monospace`;
        ctx.textAlign = 'center';
        ctx.globalAlpha = alpha;
        ctx.shadowColor = 'rgba(0,0,0,0.95)';
        ctx.shadowBlur = 5 * dpr;
        ctx.fillStyle = configRef.current.colors[n.type];
        ctx.fillText(n.label, sx * dpr, (sy + (isHub ? n.size + 18 : -n.size - 4)) * dpr);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      // Edge weight labels
      edgeMids.forEach(m => {
        if (!m.visible) return;
        const { sx, sy, behind } = project(m.x, m.y, m.z);
        if (behind) return;
        const d2 = window.devicePixelRatio;
        ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = 4 * d2;
        if (m.rel) {
          ctx.font = `400 ${9 * d2}px Inter, sans-serif`;
          ctx.textAlign = 'center'; ctx.fillStyle = '#777777';
          ctx.fillText(m.rel, sx * d2, (sy - 7) * d2);
        }
        ctx.font = `600 ${9 * d2}px Inter, sans-serif`;
        ctx.fillStyle = '#bbbbbb'; ctx.fillText(m.weight, sx * d2, (sy + 4) * d2);
        ctx.shadowBlur = 0;
      });
    }

    // ─── Intro animation state ───────────────────────────────────────────────
    // Two independent tracks:
    //   revealClock  — drives node/edge appearance (runs to completion, never loops)
    //   autoRotate   — slow spin during intro, user drag interrupts it at any time
    //
    // Phase 0 (0–0.8s):  hubs scale in
    // Phase 1 (0.8–end): peripheral nodes appear one by one, rotation continues
    // After reveal:      rotation stops, scene is static

    // ─── Easing functions ────────────────────────────────────────────────────
    // easeInOutCubic: smooth start and end
    const easeInOutCubic = (t: number) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
    // easeOutBack: overshoots slightly then settles — springy pop
    const c1 = 1.70158, c3 = c1 + 1;
    const easeOutBack = (t: number) => 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);

    let revealClock = 0;
    let revealDone = false;
    const HUB_IN   = 0.9;
    const NODE_INTERVAL = 0.09;
    const REVEAL_END = HUB_IN + (nodes.length - 2) * NODE_INTERVAL + 0.3;

    // Auto-rotation with smooth ease-in / ease-out
    const AUTO_ROT_MAX = 0.22;  // max rad/s
    let autoRotVel = 0;         // current rotation velocity (rad/s)
    let autoRotating = true;    // user can interrupt any time

    function updateReveal(dt: number) {
      if (revealDone) return;
      revealClock += dt;

      // Hubs: easeOutBack for a springy scale-in
      {
        const rawT = Math.min(revealClock / HUB_IN, 1);
        const eased = easeOutBack(rawT);
        ['sports','comedy'].forEach(id => {
          const mesh = nodeMap.get(id)!;
          mesh.scale.setScalar(Math.max(0, eased));
          nodeAlpha.set(id, easeInOutCubic(rawT));
        });
        // Hub-to-hub edge fades in with smooth cubic
        const fadeT = easeInOutCubic(rawT);
        edgeLines.forEach((line, li) => {
          const e = edges[li];
          if (!e) return;
          if ((e.from === 'sports' || e.from === 'comedy') && (e.to === 'sports' || e.to === 'comedy')) {
            (line.material as THREE.LineBasicMaterial).opacity = fadeT * configRef.current.edgeOpacity * 1.1;
          }
        });
      }

      // Peripheral nodes: easeOutBack pop-in one by one
      if (revealClock >= HUB_IN) {
        const elapsed = revealClock - HUB_IN;
        nodes.slice(2).forEach((n, i) => {
          const revealAt = i * NODE_INTERVAL;
          if (elapsed < revealAt) return;
          const localT = Math.min((elapsed - revealAt) / 0.22, 1);
          const eased = easeOutBack(localT);
          nodeMap.get(n.id)!.scale.setScalar(Math.max(0, eased));
          nodeAlpha.set(n.id, easeInOutCubic(localT));

          const li = edges.findIndex(e => e.to === n.id || e.from === n.id);
          if (li >= 0) {
            (edgeLines[li].material as THREE.LineBasicMaterial).opacity = easeInOutCubic(localT) * configRef.current.edgeOpacity;
            if (edgeMids[li]) edgeMids[li].visible = localT > 0.5;
          }
        });
      }

      if (revealClock >= REVEAL_END) {
        revealDone = true;
        // don't hard-stop — let autoRotVel ease out naturally
      }
    }

    // ─── Interaction ─────────────────────────────────────────────────────────
    let isDragging = false, isPanning = false;
    let prevX = 0, prevY = 0, velX = 0, velY = 0;

    const clampZ = (z: number) => Math.max(300, Math.min(1600, z));

    // Wire imperative handles
    zoomFnRef.current = (delta) => {
      camera.position.z = clampZ(camera.position.z + delta);
    };
    panFnRef.current = (dx, dy) => {
      camera.position.x -= dx;
      camera.position.y += dy;
    };

    const onDown = (e: MouseEvent | TouchEvent) => {
      const { clientX, clientY } = 'touches' in e ? e.touches[0] : e;
      prevX = clientX; prevY = clientY; velX = 0; velY = 0;
      // Right-click or middle-click or shift+click → pan
      const isRightOrMiddle = 'button' in e && (e.button === 1 || e.button === 2);
      const isShift = 'shiftKey' in e && e.shiftKey;
      if (isRightOrMiddle || isShift) {
        isPanning = true;
      } else {
        autoRotating = false;
        isDragging = true;
      }
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      const { clientX, clientY } = 'touches' in e ? e.touches[0] : e;
      const dx = clientX - prevX, dy = clientY - prevY;
      if (isDragging) {
        velX = dx; velY = dy;
        pivot.rotation.y += dx * 0.005;
        pivot.rotation.x += dy * 0.005;
        pivot.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pivot.rotation.x));
      } else if (isPanning) {
        // scale pan speed with zoom distance
        const speed = camera.position.z / 800;
        camera.position.x -= dx * speed;
        camera.position.y += dy * speed;
      }
      prevX = clientX; prevY = clientY;
    };
    let mouseDownAt = { x: 0, y: 0 };
    const raycaster = new THREE.Raycaster();
    raycaster.params.Mesh = {};

    const onUp = (e: MouseEvent | TouchEvent) => {
      const wasDragging = isDragging || isPanning;
      isDragging = false; isPanning = false;

      // Only fire click if pointer barely moved (not a drag)
      if (!wasDragging || true) {
        const { clientX, clientY } = 'changedTouches' in e ? e.changedTouches[0] : e as MouseEvent;
        const dx = clientX - mouseDownAt.x, dy = clientY - mouseDownAt.y;
        if (Math.sqrt(dx * dx + dy * dy) < 6) {
          // Raycast
          const rect = renderer.domElement.getBoundingClientRect();
          const ndcX = ((clientX - rect.left) / rect.width)  * 2 - 1;
          const ndcY = -((clientY - rect.top)  / rect.height) * 2 + 1;
          raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
          const meshes = [...meshToNode.keys()].filter(m => m.scale.x > 0.05);
          const hits = raycaster.intersectObjects(meshes);
          if (hits.length > 0) {
            const hit = meshToNode.get(hits[0].object as THREE.Mesh) ?? null;
            onNodeClickRef.current?.(hit);
          } else {
            onNodeClickRef.current?.(null); // click empty space → deselect
          }
        }
      }
    };
    const onContext = (e: MouseEvent) => e.preventDefault();

    // Track mouse-down position for click vs drag discrimination
    const _onDown = onDown;
    const onDownWrapped = (e: MouseEvent | TouchEvent) => {
      const { clientX, clientY } = 'touches' in e ? e.touches[0] : e as MouseEvent;
      mouseDownAt = { x: clientX, y: clientY };
      _onDown(e);
    };

    renderer.domElement.addEventListener('mousedown', onDownWrapped);
    renderer.domElement.addEventListener('contextmenu', onContext);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    renderer.domElement.addEventListener('touchstart', onDownWrapped, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    renderer.domElement.addEventListener('wheel', e => {
      camera.position.z = clampZ(camera.position.z + e.deltaY * 0.6);
    }, { passive: true });

    // ─── Render loop ─────────────────────────────────────────────────────────
    let rafId: number;
    let lastTime = performance.now();
    let t = 0;

    // track last config to avoid per-frame work when nothing changed
    let lastCfgColors    = { ...configRef.current.colors };
    let lastCfgSizes     = { ...configRef.current.sizes };
    let lastGlowIntensity = configRef.current.glowIntensity;
    let lastEdgeColor    = configRef.current.edgeColor;
    let lastHubEdgeColor = configRef.current.hubEdgeColor;
    let lastEdgeOpacity  = configRef.current.edgeOpacity;

    // classify each edge line as hub or peripheral once
    const isHubLine = edgeLines.map((_, li) => {
      const e = edges[li];
      return e && (e.from === 'sports' || e.from === 'comedy') && (e.to === 'sports' || e.to === 'comedy');
    });

    function syncConfig() {
      const c = configRef.current;
      const types: NodeType[] = ['genre', 'topic', 'household', 'individual'];

      let colorChanged = false, sizeChanged = false;
      const glowChanged = c.glowIntensity !== lastGlowIntensity;
      let edgeChanged = c.edgeColor !== lastEdgeColor || c.hubEdgeColor !== lastHubEdgeColor || c.edgeOpacity !== lastEdgeOpacity;
      for (const t of types) {
        if (c.colors[t] !== lastCfgColors[t]) colorChanged = true;
        if (c.sizes[t]  !== lastCfgSizes[t])  sizeChanged  = true;
      }

      if (colorChanged || glowChanged) {
        for (const t of types) {
          const hex = cssToHex(c.colors[t]);
          matOfRef[t].color.setHex(hex);
          matOfRef[t].emissive.setHex(hex);
          const isHub = t === 'genre' || t === 'topic';
          matOfRef[t].emissiveIntensity = c.glowIntensity * (isHub ? 1 : 0.6);
        }
        if (colorChanged) lastCfgColors = { ...c.colors };
        if (glowChanged)  lastGlowIntensity = c.glowIntensity;
      }
      if (sizeChanged) {
        nodes.forEach(n => {
          const mesh = nodeMap.get(n.id);
          if (!mesh || mesh.scale.x === 0) return;
          mesh.scale.setScalar(c.sizes[n.type]);
        });
        lastCfgSizes = { ...c.sizes };
      }
      if (edgeChanged) {
        edgeLines.forEach((line, li) => {
          const mat = line.material as THREE.LineBasicMaterial;
          if (mat.opacity === 0) return; // not yet revealed
          const hub = isHubLine[li];
          mat.color.setHex(cssToHex(hub ? c.hubEdgeColor : c.edgeColor));
          mat.opacity = hub ? c.edgeOpacity * 1.1 : c.edgeOpacity;
        });
        lastEdgeColor    = c.edgeColor;
        lastHubEdgeColor = c.hubEdgeColor;
        lastEdgeOpacity  = c.edgeOpacity;
      }
    }

    function animate(now: number) {
      rafId = requestAnimationFrame(animate);
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      t += dt;

      syncConfig();

      // Node/edge reveal — always runs until done, independent of rotation
      updateReveal(dt);

      // Rotation
      if (!isDragging) {
        if (autoRotating) {
          // Ease-in at start: lerp autoRotVel toward target using easeInQuad feel
          const target = revealDone ? 0 : AUTO_ROT_MAX;
          autoRotVel += (target - autoRotVel) * (revealDone ? 0.04 : 0.025) * 60 * dt;
          pivot.rotation.y += autoRotVel * dt;
          if (revealDone && Math.abs(autoRotVel) < 0.001) autoRotVel = 0;
        } else {
          // Drag inertia: smooth exponential decay
          velX *= Math.pow(0.92, 60 * dt);
          velY *= Math.pow(0.92, 60 * dt);
          pivot.rotation.y += velX * 0.003;
          pivot.rotation.x += velY * 0.003;
        }
      }

      // Hub pulse (only after reveal)
      if (revealDone) {
        const pulse = 1 + Math.sin(t * 2) * 0.03;
        const cfg2 = configRef.current;
        nodeMap.get('sports')?.scale.setScalar(cfg2.sizes.topic * pulse);
        nodeMap.get('comedy')?.scale.setScalar(cfg2.sizes.genre * (pulse + 0.02));
      }

      renderer.render(scene, camera);
      drawLabels();
    }
    rafId = requestAnimationFrame(animate);

    const ro = new ResizeObserver(() => {
      const w = el!.clientWidth, h = el!.clientHeight;
      renderer.setSize(w, h); camera.aspect = w / h;
      camera.updateProjectionMatrix(); resizeLc();
    });
    ro.observe(el);

    return () => {
      cancelAnimationFrame(rafId); ro.disconnect();
      renderer.domElement.removeEventListener('mousedown', onDownWrapped);
      renderer.domElement.removeEventListener('contextmenu', onContext);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      renderer.domElement.removeEventListener('touchstart', onDownWrapped);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      if (lc.parentNode === el) el.removeChild(lc);
    };
  }, []);

  return (
    <div ref={mountRef}
      style={{ width: '100%', height: '100%', minHeight: 500, cursor: 'grab', userSelect: 'none', backgroundColor: '#111111' }}
    />
  );
});

export default Graph3D;
