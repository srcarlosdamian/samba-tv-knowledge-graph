export type NodeType =
  | 'household'
  | 'device'
  | 'cookie_or_ip'
  | 'individual'
  | 'genre'
  | 'topic'
  | 'series'
  | 'experian_household'
  | 'state'
  | 'income_bracket';

export type DeviceCategory = 'samba_tv' | 'android' | 'apple' | 'cookie_or_ip';

export interface ConnectedDevicesSummary {
  sambaTv: number;
  android: number;
  apple: number;
  cookieOrIp: number;
  total: number;
}

export interface NodeProperty {
  label: string;
  value: string;
  isNote?: boolean;
}

export interface Node3DData {
  id: string;
  label: string;
  type: NodeType;
  x: number;
  y: number;
  z: number;
  size: number;
  properties: NodeProperty[];
  devicesSummary?: ConnectedDevicesSummary;
  campaignsCount?: number;
  subType?: DeviceCategory;
}

export interface Edge3DData {
  id?: string;
  from: string;
  to: string;
  weight?: string;
  rel?: string;
  hidden?: boolean; // initially sampled/hidden for legibility, revealed on click
}

export interface GraphDataset {
  query: string;
  title: string;
  description: string;
  nodes: Node3DData[];
  edges: Edge3DData[];
  sparqlQuery: string;
  metrics: {
    peopleMatch: string;
    seedHousehold: string;
  };
}

export interface Genre { id: number; name: string; count: string; }
export interface Topic { id: number; name: string; count: string; }
export interface TableRow { household: string; sambaId: string; genreScore: string; topicScore: string; }

export const genres: Genre[] = [
  { id: 1, name: 'Documentary', count: '600.0k' },
  { id: 2, name: 'Crime Drama', count: '600.0k' },
  { id: 3, name: 'Talk Show', count: '600.0k' },
  { id: 4, name: 'Reality', count: '600.0k' },
  { id: 5, name: 'Comedy', count: '580.0k' },
  { id: 6, name: 'Sports', count: '520.0k' },
  { id: 7, name: 'Drama', count: '400.0k' },
  { id: 8, name: 'Anime', count: '600.0k' },
  { id: 9, name: 'Sitcom', count: '450.0k' },
  { id: 10, name: 'Fantasy', count: '520.0k' },
];

export const topics: Topic[] = [
  { id: 1, name: 'Sports', count: '750.0k' },
  { id: 2, name: 'Technology', count: '620.0k' },
  { id: 3, name: 'News & Politics', count: '580.0k' },
  { id: 4, name: 'Food & Cooking', count: '530.0k' },
  { id: 5, name: 'Gaming', count: '440.0k' },
];

export const tableRows: TableRow[] = [
  { household: 'samba.tv/34003493403040340', sambaId: 'e8bbb6fa0afd5cb6', genreScore: '1.0', topicScore: '1.0' },
  { household: 'samba.tv/34003493403040341', sambaId: 'b9ccc7fa0cfe6dcb7', genreScore: '1.1', topicScore: '1.0' },
  { household: 'samba.tv/34003493403040342', sambaId: 'c1ddd8fa1e0f7ece8', genreScore: '1.2', topicScore: '1.0' },
  { household: 'samba.tv/34003493403040343', sambaId: 'd2eee9fa2f217fcf9', genreScore: '1.3', topicScore: '1.0' },
  { household: 'samba.tv/34003493403040344', sambaId: 'e3ff0afa3g3230f0a', genreScore: '1.4', topicScore: '1.0' },
  { household: 'samba.tv/34003493403040345', sambaId: 'f4gg1bfa4h4341g1b', genreScore: '1.5', topicScore: '1.0' },
  { household: 'samba.tv/34003493403040346', sambaId: 'g5hh2cfa5i5452h2c', genreScore: '1.6', topicScore: '1.0' },
  { household: 'samba.tv/34003493403040347', sambaId: 'h6ii3dfa6j6563i3d', genreScore: '1.7', topicScore: '1.0' },
  { household: 'samba.tv/34003493403040347', sambaId: 'h6ii3dfa6j6563i3d', genreScore: '1.7', topicScore: '1.0' },
  { household: 'samba.tv/34003493403040347', sambaId: 'h6ii3dfa6j6563i3d', genreScore: '1.7', topicScore: '1.0' },
  { household: 'samba.tv/34003493403040348', sambaId: 'i7jj4efa7k7674j4e', genreScore: '1.8', topicScore: '1.0' },
  { household: 'samba.tv/34003493403040349', sambaId: 'j8kk5ffb8l8785k5f', genreScore: '1.8', topicScore: '1.0' },
  { household: 'samba.tv/34003493403040350', sambaId: 'k9ll6ggc9m9896l6g', genreScore: '1.9', topicScore: '1.0' },
  { household: 'samba.tv/34003493403040351', sambaId: 'l0mm7hhd0n0907m7h', genreScore: '1.9', topicScore: '1.0' },
  { household: 'samba.tv/34003493403040352', sambaId: 'm1nn8iie1o1018n8i', genreScore: '2.0', topicScore: '1.0' },
  { household: 'samba.tv/34003493403040353', sambaId: 'n2oo9jjf2p2129o9j', genreScore: '2.0', topicScore: '1.0' },
  { household: 'samba.tv/34003493403040354', sambaId: 'o3pp0kkg3q3230p0k', genreScore: '2.1', topicScore: '1.0' },
  { household: 'samba.tv/34003493403040355', sambaId: 'p4qq1llh4r4341q1l', genreScore: '2.1', topicScore: '1.0' },
  { household: 'samba.tv/34003493403040356', sambaId: 'q5rr2mmi5s5452r2m', genreScore: '2.2', topicScore: '1.0' },
  { household: 'samba.tv/34003493403040357', sambaId: 'r6ss3nnj6t6563s3n', genreScore: '2.2', topicScore: '1.0' },
];

export const audienceData = {
  households: '125.4k',
  population: '326k',
  alsoInterestedIn: [
    { name: 'Talk Show', index: '3.3×', count: '23.6k', type: 'genre', pct: 0.82 },
    { name: 'Reality', index: '2.8×', count: '57.4k', type: 'genre', pct: 0.70 },
    { name: 'Biography', index: '2.6×', count: '14.8k', type: 'topic', pct: 0.65 },
    { name: 'Science', index: '2.6×', count: '30.1k', type: 'genre', pct: 0.65 },
    { name: 'Sports Analysis', index: '2.1×', count: '25.8k', type: 'genre', pct: 0.52 },
    { name: 'True Crime', index: '2.1×', count: '11.2k', type: 'topic', pct: 0.52 },
    { name: 'News', index: '2.0×', count: '11.2k', type: 'genre', pct: 0.50 },
    { name: 'Nature & Wildlife', index: '1.9×', count: '33k', type: 'topic', pct: 0.47 },
  ],
  topStates: [
    { name: 'Maine', index: '1.50×' },
    { name: 'Florida', index: '1.49×' },
    { name: 'Kentucky', index: '1.48×' },
    { name: 'Alabama', index: '1.47×' },
    { name: 'Mississippi', index: '1.44×' },
  ],
  stateTiles: [
    { code: 'AK', r: 0, c: 0, val: 0.95 },
    { code: 'ME', r: 0, c: 10, val: 1.50 },
    { code: 'WA', r: 1, c: 1, val: 1.15 },
    { code: 'ID', r: 1, c: 2, val: 1.20 },
    { code: 'MT', r: 1, c: 3, val: 1.10 },
    { code: 'ND', r: 1, c: 4, val: 1.18 },
    { code: 'MN', r: 1, c: 5, val: 1.22 },
    { code: 'IL', r: 1, c: 6, val: 1.12 },
    { code: 'MI', r: 1, c: 7, val: 1.25 },
    { code: 'NY', r: 1, c: 8, val: 1.35 },
    { code: 'VT', r: 1, c: 9, val: 1.40 },
    { code: 'NH', r: 1, c: 10, val: 1.38 },
    { code: 'OR', r: 2, c: 1, val: 1.28 },
    { code: 'NV', r: 2, c: 2, val: 1.18 },
    { code: 'WY', r: 2, c: 3, val: 1.22 },
    { code: 'SD', r: 2, c: 4, val: 1.14 },
    { code: 'IA', r: 2, c: 5, val: 1.30 },
    { code: 'IN', r: 2, c: 6, val: 1.34 },
    { code: 'OH', r: 2, c: 7, val: 1.36 },
    { code: 'PA', r: 2, c: 8, val: 1.28 },
    { code: 'NJ', r: 2, c: 9, val: 1.32 },
    { code: 'MA', r: 2, c: 10, val: 1.30 },
    { code: 'CA', r: 3, c: 1, val: 1.32 },
    { code: 'UT', r: 3, c: 2, val: 1.20 },
    { code: 'CO', r: 3, c: 3, val: 1.15 },
    { code: 'NE', r: 3, c: 4, val: 1.10 },
    { code: 'MO', r: 3, c: 5, val: 1.28 },
    { code: 'KY', r: 3, c: 6, val: 1.48 },
    { code: 'WV', r: 3, c: 7, val: 1.40 },
    { code: 'VA', r: 3, c: 8, val: 1.30 },
    { code: 'MD', r: 3, c: 9, val: 1.25 },
    { code: 'DE', r: 3, c: 10, val: 1.22 },
    { code: 'AZ', r: 4, c: 1, val: 1.25 },
    { code: 'NM', r: 4, c: 2, val: 1.18 },
    { code: 'KS', r: 4, c: 3, val: 1.20 },
    { code: 'AR', r: 4, c: 4, val: 1.38 },
    { code: 'TN', r: 4, c: 5, val: 1.42 },
    { code: 'NC', r: 4, c: 6, val: 1.35 },
    { code: 'SC', r: 4, c: 7, val: 1.38 },
    { code: 'DC', r: 4, c: 9, val: 1.18 },
    { code: 'HI', r: 5, c: 0, val: 0.90 },
    { code: 'OK', r: 5, c: 3, val: 1.22 },
    { code: 'LA', r: 5, c: 4, val: 1.40 },
    { code: 'MS', r: 5, c: 5, val: 1.44 },
    { code: 'AL', r: 5, c: 6, val: 1.47 },
    { code: 'GA', r: 5, c: 7, val: 1.38 },
    { code: 'TX', r: 6, c: 3, val: 1.42 },
    { code: 'FL', r: 6, c: 7, val: 1.49 },
  ],
  ageBands: [15, 38, 75, 68, 52, 62, 72, 36, 18],
  ageBandLabels: ['18-20', '21-24', '25-34', '35-44', '45-49', '50-54', '55-64', '65-74', '75+'],
  incomes: [20, 30, 38, 48, 75, 60, 38, 22, 16, 12],
  incomeLabels: ['0-25k', '25-50k', '35-50k', '50-75k', '75-100k', '100-125k', '125-150k', '150-175k', '200k+'],
  race: [
    { label: 'White', value: '39.8k', pct: 0.80 },
    { label: 'Black', value: '6.9k', pct: 0.25 },
    { label: 'Hispanic', value: '11.7k', pct: 0.45 },
    { label: 'Asian', value: '5.1k', pct: 0.18 },
    { label: 'Other', value: '1.8k', pct: 0.08 },
  ],
  householdMakeup: {
    size: '2.6',
    adults: '2.1',
    children: '0.5',
    male: '158k',
    female: '168k',
    malePct: 0.485,
    femalePct: 0.515,
  },
};

// ─── Pre-computed Dual-Hub Bipolar Radial Matrix Helper ───────────────────────
export interface BipolarLayoutConfig {
  hub1Pos?: [number, number, number]; // e.g. [135, -15, 0] (Right Hub: Genre / Main Hub)
  hub2Pos?: [number, number, number]; // e.g. [-135, -35, 0] (Left Hub: Topic / Secondary Hub)
  bridgeCount?: number;               // Intermediate bridge nodes between the two hubs
  fan1Count?: number;                 // Radial burst nodes around Hub 1 (Right Hemisphere)
  fan2Count?: number;                 // Radial burst nodes around Hub 2 (Left Hemisphere)
  fan1RadiusMin?: number;
  fan1RadiusMax?: number;
  fan2RadiusMin?: number;
  fan2RadiusMax?: number;
}

export function generateBipolarPositions(cfg: BipolarLayoutConfig = {}) {
  const hub1Pos: [number, number, number] = cfg.hub1Pos ?? [135, -15, 0];
  const hub2Pos: [number, number, number] = cfg.hub2Pos ?? [-135, -35, 0];
  const bridgeCount = cfg.bridgeCount ?? 6;
  const fan1Count = cfg.fan1Count ?? 8;
  const fan2Count = cfg.fan2Count ?? 10;
  const fan1RadiusMin = cfg.fan1RadiusMin ?? 125;
  const fan1RadiusMax = cfg.fan1RadiusMax ?? 215;
  const fan2RadiusMin = cfg.fan2RadiusMin ?? 130;
  const fan2RadiusMax = cfg.fan2RadiusMax ?? 225;

  // 1. Central Bridge Nodes (spanning vertically in the center corridor between Hub 1 & Hub 2)
  const bridgePts: [number, number, number][] = [];
  const ySpan = 230; // from -115 to +115
  for (let i = 0; i < bridgeCount; i++) {
    const t = i / Math.max(1, bridgeCount - 1); // 0 to 1
    const y = -115 + t * ySpan + (i % 2 === 0 ? 10 : -10);
    // Slight wave in X between the two hubs
    const midX = (hub1Pos[0] + hub2Pos[0]) / 2;
    const x = midX + Math.sin(t * Math.PI * 2) * 35 + (i % 2 === 0 ? -14 : 16);
    const z = Math.cos(t * Math.PI * 3) * 28;
    bridgePts.push([Math.round(x), Math.round(y), Math.round(z)]);
  }

  // 2. Hub 1 Outer Radial Fan (Right hemisphere: angles from -75° to +100°)
  const fan1Pts: [number, number, number][] = [];
  const startAng1 = -Math.PI * 0.40; // -72 deg
  const endAng1 = Math.PI * 0.56;    // +100 deg
  for (let i = 0; i < fan1Count; i++) {
    const t = i / Math.max(1, fan1Count - 1);
    const angle = startAng1 + t * (endAng1 - startAng1);
    const radius = fan1RadiusMin + (i % 3) * ((fan1RadiusMax - fan1RadiusMin) / 2);
    const x = hub1Pos[0] + Math.cos(angle) * radius;
    const y = hub1Pos[1] + Math.sin(angle) * radius;
    const z = (i % 2 === 0 ? 1 : -1) * (15 + (i % 4) * 8);
    fan1Pts.push([Math.round(x), Math.round(y), Math.round(z)]);
  }

  // 3. Hub 2 Outer Radial Fan (Left hemisphere: angles from +95° to +265°)
  const fan2Pts: [number, number, number][] = [];
  const startAng2 = Math.PI * 0.54;  // +97 deg
  const endAng2 = Math.PI * 1.48;   // +266 deg
  for (let i = 0; i < fan2Count; i++) {
    const t = i / Math.max(1, fan2Count - 1);
    const angle = startAng2 + t * (endAng2 - startAng2);
    const radius = fan2RadiusMin + (i % 3) * ((fan2RadiusMax - fan2RadiusMin) / 2);
    const x = hub2Pos[0] + Math.cos(angle) * radius;
    const y = hub2Pos[1] + Math.sin(angle) * radius;
    const z = (i % 2 === 0 ? -1 : 1) * (14 + (i % 4) * 9);
    fan2Pts.push([Math.round(x), Math.round(y), Math.round(z)]);
  }

  return { hub1Pos, hub2Pos, bridgePts, fan1Pts, fan2Pts };
}

// ─── Legacy Pre-computed Circular Orbital Matrix Helper ───────────────────────
export function circularMatrixOrbit(
  n: number,
  radius: number,
  tiltX = 0.35,
  tiltZ = 0.15,
  yOffset = 0,
  waveAmp = 16,
  waveFreq = 2,
  startAngle = 0
): [number, number, number][] {
  const pts: [number, number, number][] = [];
  for (let i = 0; i < n; i++) {
    const angle = startAngle + (i / n) * Math.PI * 2;
    const rawX = Math.cos(angle) * radius;
    const rawZ = Math.sin(angle) * radius;
    const rawY = yOffset + Math.sin(angle * waveFreq) * waveAmp;

    const cosX = Math.cos(tiltX), sinX = Math.sin(tiltX);
    const cosZ = Math.cos(tiltZ), sinZ = Math.sin(tiltZ);

    const y1 = rawY * cosX - rawZ * sinX;
    const z1 = rawY * sinX + rawZ * cosX;

    const x2 = rawX * cosZ - y1 * sinZ;
    const y2 = rawX * sinZ + y1 * cosZ;
    const z2 = z1;

    pts.push([Math.round(x2), Math.round(y2), Math.round(z2)]);
  }
  return pts;
}

const HH_IDS = [
  '6e382a05b1af1d9b', '2a3c85ba5b7588ad', '3875d60a53a61971', '3755283108548888',
  'e00a493c8c98f734', '770a764a077729db', '6a48bc3421e45de6', '4801141778832035',
  '8612846182973880', 'f95a680f0ed7e4e4', 'c54ccbf5624389ca', 'e9543400f413ac09',
  'e8bbb6fa0afd5cb6', 'dc33e75c07031ad0', 'a6aa69cc9ce634e8', '4569387219552335',
  'bf771029482ca1e2', '512903847ab99ef1', '89104928bf1e34cc', '10928374fa90bc21',
  'fa90218374bc1092', 'bc21fa9021837410', '3948571029384bc1', '9028374109283fa8',
  '7481920384756102', '1827364509182736', '6172839405192837', '9283746152431092',
  '3456789012345678', '9876543210987654', '1234098765432109', '8765123490876512',
  '5647382910293847', '2938475610293847', '7483920192837465', '1029384756102938'
];

const IND_IDS = [
  '64aa10689b7507ec', 'cebcdbf756ee10b4', 'db3caa36ef541f49', '500df0e75055093c',
  '471cef7a96ef3f2b', '804e64b1934d720d', 'ec988ef278528424', 'dc33e75c07031ad1',
  '9018237465ab1928', '192837465ab90182', '7465ab1928374650', 'ab19283746590182',
  '3847562910293847', '5849302918273645', '7182930495867182', '9384756102938475',
  '2938475610293846', '4857691029384756', '6758493029182736', '8675940392817263',
  '1526374859607182', '3748596071829304', '5960718293048576', '7182930485769201',
  '8293048576920134', '9304857692013456', '0485769201345678', '4857692013456789',
  '8576920134567890', '5769201345678901', '7692013456789012', '6920134567890123'
];

// ─────────────────────────────────────────────────────────────────────────────
// 1. Example 1: Multi-Device Household Constellation
// ─────────────────────────────────────────────────────────────────────────────
function buildExample1_Devices(): GraphDataset {
  const nodes: Node3DData[] = [];
  const edges: Edge3DData[] = [];

  const layout = generateBipolarPositions({
    hub1Pos: [135, -20, 0],
    hub2Pos: [-135, -20, 0],
    bridgeCount: 6,
    fan1Count: 8,
    fan2Count: 8,
  });

  // 2 Central Core Hubs
  nodes.push({
    id: 'samba_dex_core1',
    label: 'Samba TV DEX Core A',
    type: 'household',
    x: layout.hub2Pos[0], y: layout.hub2Pos[1], z: layout.hub2Pos[2],
    size: 26,
    properties: [
      { label: 'Cluster Type', value: 'Primary Multi-Device Hub' },
      { label: 'Resolution Rate', value: '99.4%' },
      { label: 'DEX Sync ID', value: 'DEX-HUB-88201' },
      { label: 'Active Devices', value: '42 Verified Connected Units' },
    ],
    devicesSummary: { sambaTv: 12, apple: 16, android: 8, cookieOrIp: 14, total: 50 },
    campaignsCount: 18,
  });

  nodes.push({
    id: 'samba_dex_core2',
    label: 'Samba TV DEX Core B',
    type: 'household',
    x: layout.hub1Pos[0], y: layout.hub1Pos[1], z: layout.hub1Pos[2],
    size: 26,
    properties: [
      { label: 'Cluster Type', value: 'Secondary Multi-Device Hub' },
      { label: 'Resolution Rate', value: '98.8%' },
      { label: 'DEX Sync ID', value: 'DEX-HUB-88202' },
      { label: 'Active Devices', value: '38 Verified Connected Units' },
    ],
    devicesSummary: { sambaTv: 10, apple: 14, android: 10, cookieOrIp: 12, total: 46 },
    campaignsCount: 15,
  });

  edges.push({
    from: 'samba_dex_core1',
    to: 'samba_dex_core2',
    rel: 'coreSyncBridge',
    weight: '0.99',
    hidden: false,
  });

  // Central Bridge Households
  layout.bridgePts.forEach((pos, i) => {
    const hhId = `hh_dev_bridge_${i}`;
    const sambaId = HH_IDS[i % HH_IDS.length];
    nodes.push({
      id: hhId,
      label: sambaId,
      type: 'household',
      x: pos[0], y: pos[1], z: pos[2],
      size: 13,
      properties: [
        { label: 'Household ID', value: sambaId },
        { label: 'Resolution Status', value: 'Dual-Hub Synchronized' },
      ],
      devicesSummary: { sambaTv: 1, apple: 2, android: 1, cookieOrIp: 2, total: 6 },
      campaignsCount: 5 + i,
    });
    edges.push({
      from: 'samba_dex_core1',
      to: hhId,
      rel: 'clusterMember',
      weight: (0.95 - i * 0.03).toFixed(2),
      hidden: false,
    });
    edges.push({
      from: 'samba_dex_core2',
      to: hhId,
      rel: 'clusterMember',
      weight: (0.92 - i * 0.02).toFixed(2),
      hidden: false,
    });
  });

  // Left Fan Devices (Core A)
  const devTypesLeft: { cat: DeviceCategory; label: string; name: string }[] = [
    { cat: 'samba_tv', label: 'Samba Smart TV 65"', name: 'Samba TV 65"' },
    { cat: 'android', label: 'Samsung Galaxy S24', name: 'Samsung Galaxy S24' },
    { cat: 'android', label: 'Google Pixel 8', name: 'Google Pixel 8' },
    { cat: 'cookie_or_ip', label: 'IP Bridge Match', name: 'IP Bridge Match' },
  ];
  layout.fan2Pts.forEach((pos, i) => {
    const devId = `dev_left_${i}`;
    const d = devTypesLeft[i % devTypesLeft.length];
    const isCookie = d.cat === 'cookie_or_ip';
    nodes.push({
      id: devId,
      label: d.label,
      type: isCookie ? 'cookie_or_ip' : 'device',
      subType: d.cat,
      x: pos[0], y: pos[1], z: pos[2],
      size: isCookie ? 8 : 10,
      properties: [
        { label: 'Device ID', value: `dev_left_${i + 101}` },
        { label: 'Model', value: d.name },
      ],
    });
    edges.push({
      from: 'samba_dex_core1',
      to: devId,
      rel: isCookie ? 'hasCookie' : 'hasDevice',
      weight: (0.94 - (i % 4) * 0.04).toFixed(2),
      hidden: i >= 5,
    });
  });

  // Right Fan Devices (Core B)
  const devTypesRight: { cat: DeviceCategory; label: string; name: string }[] = [
    { cat: 'apple', label: 'Apple TV 4K', name: 'Apple TV 4K' },
    { cat: 'apple', label: 'Apple MacBook Pro', name: 'Apple MacBook Pro M3' },
    { cat: 'apple', label: 'Apple iPhone 15', name: 'Apple iPhone 15' },
    { cat: 'cookie_or_ip', label: 'DEX Cookie Sync', name: 'DEX Cookie Sync' },
  ];
  layout.fan1Pts.forEach((pos, i) => {
    const devId = `dev_right_${i}`;
    const d = devTypesRight[i % devTypesRight.length];
    const isCookie = d.cat === 'cookie_or_ip';
    nodes.push({
      id: devId,
      label: d.label,
      type: isCookie ? 'cookie_or_ip' : 'device',
      subType: d.cat,
      x: pos[0], y: pos[1], z: pos[2],
      size: isCookie ? 8 : 10,
      properties: [
        { label: 'Device ID', value: `dev_right_${i + 201}` },
        { label: 'Model', value: d.name },
      ],
    });
    edges.push({
      from: 'samba_dex_core2',
      to: devId,
      rel: isCookie ? 'hasCookie' : 'hasDevice',
      weight: (0.95 - (i % 4) * 0.04).toFixed(2),
      hidden: i >= 5,
    });
  });

  return {
    query: 'Households with Samba TV and more than 3 devices',
    title: 'Samba TV Multi-Device Household Cluster',
    description: 'Bipolar dual-hub matrix of households verified with active Samba TV units and >= 3 connected endpoints.',
    nodes,
    edges,
    sparqlQuery: `PREFIX samba: <http://samba.tv/ontology/graph#>
PREFIX device: <http://samba.tv/data/Device#>

SELECT ?household ?sambaTv ?deviceCount WHERE {
  GRAPH <http://samba.tv/data/IdentityGraph> {
    ?household a samba:Household ;
               samba:hasDevice ?sambaTv .
    ?sambaTv samba:deviceType "SambaTV" .
    {
      SELECT ?household (COUNT(?dev) AS ?deviceCount) WHERE {
        ?household samba:hasDevice ?dev .
      } GROUP BY ?household HAVING (?deviceCount > 3)
    }
  }
}
LIMIT 20`,
    metrics: { peopleMatch: '84.2k', seedHousehold: '22.6k' },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Example 2: Households in Texas
// ─────────────────────────────────────────────────────────────────────────────
function buildExample2_Texas(): GraphDataset {
  const nodes: Node3DData[] = [];
  const edges: Edge3DData[] = [];

  const layout = generateBipolarPositions({
    hub1Pos: [135, -20, 0], // Experian Texas
    hub2Pos: [-135, -20, 0], // Texas Geo Hub
    bridgeCount: 6,
    fan1Count: 8,
    fan2Count: 8,
  });

  // 2 Central Core Elements
  nodes.push({
    id: 'state_tx_core',
    label: 'Texas Geographic Hub',
    type: 'state',
    x: layout.hub2Pos[0], y: layout.hub2Pos[1], z: layout.hub2Pos[2],
    size: 28,
    properties: [
      { label: 'State Name', value: 'Texas' },
      { label: 'State Code', value: 'TX' },
      { label: 'Country', value: 'United States' },
      { label: 'Total Samba Reach', value: '2.85M Households' },
    ],
  });

  nodes.push({
    id: 'experian_tx_core',
    label: 'Experian Texas Mosaic',
    type: 'experian_household',
    x: layout.hub1Pos[0], y: layout.hub1Pos[1], z: layout.hub1Pos[2],
    size: 26,
    properties: [
      { label: 'Demographic Engine', value: 'Experian Identity Resolution' },
      { label: 'Verified Residents', value: '7.4M Individuals' },
      { label: 'State Coverage', value: '99.1%' },
    ],
  });

  edges.push({
    from: 'state_tx_core',
    to: 'experian_tx_core',
    rel: 'demographicResolution',
    weight: '1.00',
    hidden: false,
  });

  // Bridge Experian Households
  layout.bridgePts.forEach((pos, i) => {
    const expId = `exp_tx_bridge_${i}`;
    nodes.push({
      id: expId,
      label: `Experian HH ${i + 1}`,
      type: 'experian_household',
      x: pos[0], y: pos[1], z: pos[2],
      size: 11,
      properties: [
        { label: 'Experian ID', value: `EXP-TX-${1000 + i}` },
        { label: 'State of Residence', value: 'Texas' },
        { label: 'Match Confidence', value: '98.4%' },
      ],
    });
    edges.push({
      from: 'state_tx_core',
      to: expId,
      rel: 'stateOfResidence',
      weight: '1.00',
      hidden: false,
    });
    edges.push({
      from: 'experian_tx_core',
      to: expId,
      rel: 'verifiedRecord',
      weight: (0.98 - i * 0.02).toFixed(2),
      hidden: false,
    });
  });

  // Fan 1 (Right): Samba Households
  layout.fan1Pts.forEach((pos, i) => {
    const hhId = `hh_tx_fan_${i}`;
    const sambaId = HH_IDS[i % HH_IDS.length];
    nodes.push({
      id: hhId,
      label: sambaId,
      type: 'household',
      x: pos[0], y: pos[1], z: pos[2],
      size: 12,
      properties: [
        { label: 'Household ID', value: sambaId },
        { label: 'DMA', value: i % 2 === 0 ? 'Dallas-Ft. Worth' : 'Houston' },
        { label: 'Matched State', value: 'Texas' },
      ],
      devicesSummary: { sambaTv: 1, apple: 2, android: 2, cookieOrIp: 1, total: 6 },
      campaignsCount: 6 + i,
    });
    edges.push({
      from: 'experian_tx_core',
      to: hhId,
      rel: 'linkedHousehold',
      weight: (0.95 - (i % 4) * 0.03).toFixed(2),
      hidden: i >= 5,
    });
  });

  // Fan 2 (Left): Connected Devices
  layout.fan2Pts.forEach((pos, i) => {
    const devId = `dev_tx_fan_${i}`;
    nodes.push({
      id: devId,
      label: i % 2 === 0 ? `Samba TV TX-${i + 1}` : `Device TX-${i + 1}`,
      type: 'device',
      subType: i % 2 === 0 ? 'samba_tv' : 'android',
      x: pos[0], y: pos[1], z: pos[2],
      size: 9,
      properties: [
        { label: 'Device ID', value: `dev_tx_${i * 91 + 104}` },
        { label: 'DMA Region', value: 'Texas Metro' },
      ],
    });
    edges.push({
      from: 'state_tx_core',
      to: devId,
      rel: 'hasDevice',
      weight: '0.90',
      hidden: i >= 5,
    });
  });

  return {
    query: 'Households in Texas',
    title: 'Geographic Audience Hub: Texas',
    description: 'Bipolar dual-hub matrix of Texas households linked through intermediate Experian identity resolution nodes.',
    nodes,
    edges,
    sparqlQuery: `PREFIX samba: <http://samba.tv/ontology/graph#>
PREFIX experian: <http://samba.tv/data/Experian#>

SELECT ?household ?experianRecord ?state WHERE {
  GRAPH <http://samba.tv/data/IdentityGraph> {
    ?household samba:linkedExperian ?experianRecord .
    ?experianRecord experian:stateOfResidence "Texas" .
    BIND("Texas" AS ?state)
  }
}
LIMIT 20`,
    metrics: { peopleMatch: '142.6k', seedHousehold: '58.9k' },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Example 3: Households with income over $75k
// ─────────────────────────────────────────────────────────────────────────────
function buildExample3_Income(): GraphDataset {
  const nodes: Node3DData[] = [];
  const edges: Edge3DData[] = [];

  const layout = generateBipolarPositions({
    hub1Pos: [135, -20, 0], // Affluence Index
    hub2Pos: [-135, -20, 0], // >$75k Income Bracket
    bridgeCount: 6,
    fan1Count: 8,
    fan2Count: 8,
  });

  // 2 Central Core Elements
  nodes.push({
    id: 'income_75k_core',
    label: '>$75k Income Bracket',
    type: 'income_bracket',
    x: layout.hub2Pos[0], y: layout.hub2Pos[1], z: layout.hub2Pos[2],
    size: 28,
    properties: [
      { label: 'Income Bracket', value: '>$75,000 / year' },
      { label: 'Median HH Income', value: '$94,200' },
      { label: 'Index vs National', value: '138' },
      { label: 'Demographic Source', value: 'Experian Mosaic' },
    ],
  });

  nodes.push({
    id: 'affluence_index_core',
    label: 'Experian Affluence Index',
    type: 'experian_household',
    x: layout.hub1Pos[0], y: layout.hub1Pos[1], z: layout.hub1Pos[2],
    size: 26,
    properties: [
      { label: 'Demographic Index', value: 'High Net Worth Cluster' },
      { label: 'Purchasing Power', value: 'Top 25% Tier' },
      { label: 'Credit & Asset Score', value: 'Verified Tier 1' },
    ],
  });

  edges.push({
    from: 'income_75k_core',
    to: 'affluence_index_core',
    rel: 'affluenceStratification',
    weight: '0.98',
    hidden: false,
  });

  // Bridge Experian Demographic Nodes
  layout.bridgePts.forEach((pos, i) => {
    const expId = `exp_inc_bridge_${i}`;
    nodes.push({
      id: expId,
      label: `Experian HH ${i + 1}`,
      type: 'experian_household',
      x: pos[0], y: pos[1], z: pos[2],
      size: 11,
      properties: [
        { label: 'Experian ID', value: `EXP-INC-${2000 + i}` },
        { label: 'Reported Income', value: '$85k - $125k' },
      ],
    });
    edges.push({
      from: 'income_75k_core',
      to: expId,
      rel: 'incomeBracket',
      weight: (0.94 - i * 0.02).toFixed(2),
      hidden: false,
    });
    edges.push({
      from: 'affluence_index_core',
      to: expId,
      rel: 'mosaicSegment',
      weight: '0.92',
      hidden: false,
    });
  });

  // Fan 1 (Right): High-Income Households
  layout.fan1Pts.forEach((pos, i) => {
    const hhId = `hh_inc_fan_${i}`;
    const sambaId = HH_IDS[i % HH_IDS.length];
    nodes.push({
      id: hhId,
      label: sambaId,
      type: 'household',
      x: pos[0], y: pos[1], z: pos[2],
      size: 12,
      properties: [
        { label: 'Household ID', value: sambaId },
        { label: 'Affluence Index', value: '142' },
      ],
      devicesSummary: { sambaTv: 1, apple: 3, android: 1, cookieOrIp: 2, total: 7 },
      campaignsCount: 9,
    });
    edges.push({
      from: 'affluence_index_core',
      to: hhId,
      rel: 'matchedHousehold',
      weight: (0.93 - (i % 4) * 0.03).toFixed(2),
      hidden: i >= 5,
    });
  });

  // Fan 2 (Left): Premium Connected Devices
  layout.fan2Pts.forEach((pos, i) => {
    const devId = `dev_inc_fan_${i}`;
    nodes.push({
      id: devId,
      label: i % 2 === 0 ? `Apple TV 4K #${i + 1}` : `MacBook Pro #${i + 1}`,
      type: 'device',
      subType: 'apple',
      x: pos[0], y: pos[1], z: pos[2],
      size: 9,
      properties: [
        { label: 'Device ID', value: `dev_prem_${i * 44 + 301}` },
        { label: 'Category', value: 'Premium Connected Device' },
      ],
    });
    edges.push({
      from: 'income_75k_core',
      to: devId,
      rel: 'hasDevice',
      weight: '0.91',
      hidden: i >= 5,
    });
  });

  return {
    query: 'Households with income over $75k',
    title: 'High Income Audience Resolution',
    description: 'Bipolar dual-hub matrix of high income households resolved through Experian demographic income attribute hubs.',
    nodes,
    edges,
    sparqlQuery: `PREFIX samba: <http://samba.tv/ontology/graph#>
PREFIX experian: <http://samba.tv/data/Experian#>

SELECT ?household ?incomeBracket WHERE {
  GRAPH <http://samba.tv/data/IdentityGraph> {
    ?household samba:linkedExperian ?exp .
    ?exp experian:estimatedIncomeRange ?incomeBracket .
    FILTER(?incomeBracket >= 75000)
  }
}
LIMIT 20`,
    metrics: { peopleMatch: '96.4k', seedHousehold: '37.8k' },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Example 4: Who likes Friends in New York
// ─────────────────────────────────────────────────────────────────────────────
function buildExample4_FriendsNY(): GraphDataset {
  const nodes: Node3DData[] = [];
  const edges: Edge3DData[] = [];

  const layout = generateBipolarPositions({
    hub1Pos: [135, -20, 0], // New York Geo Hub
    hub2Pos: [-135, -20, 0], // Friends Series
    bridgeCount: 6,
    fan1Count: 8,
    fan2Count: 8,
  });

  // 2 Central Core Elements
  nodes.push({
    id: 'series_friends_core',
    label: 'Friends',
    type: 'series',
    x: layout.hub2Pos[0], y: layout.hub2Pos[1], z: layout.hub2Pos[2],
    size: 28,
    properties: [
      { label: 'Series Title', value: 'Friends' },
      { label: 'Network', value: 'NBC / Warner Bros' },
      { label: 'Primary Genres', value: 'Comedy, Sitcom' },
      { label: 'Catalog ID', value: 'SHOW-FRND-1994' },
    ],
  });

  nodes.push({
    id: 'state_ny_core',
    label: 'New York Geographic Hub',
    type: 'state',
    x: layout.hub1Pos[0], y: layout.hub1Pos[1], z: layout.hub1Pos[2],
    size: 28,
    properties: [
      { label: 'State Name', value: 'New York' },
      { label: 'State Code', value: 'NY' },
      { label: 'Region', value: 'US Northeast DMA' },
    ],
  });

  edges.push({
    from: 'series_friends_core',
    to: 'state_ny_core',
    rel: 'crossGeoAffinity',
    weight: '0.91',
    hidden: false,
  });

  // Intermediate Genre Satellites
  nodes.push({
    id: 'genre_comedy',
    label: 'Comedy',
    type: 'genre',
    x: -210, y: 145, z: -25,
    size: 18,
    properties: [
      { label: 'Genre Name', value: 'Comedy' },
      { label: 'Total Reach', value: '580.0k Households' },
    ],
  });
  nodes.push({
    id: 'genre_sitcom',
    label: 'Sitcom',
    type: 'genre',
    x: -210, y: -145, z: 25,
    size: 18,
    properties: [
      { label: 'Genre Name', value: 'Sitcom' },
      { label: 'Total Reach', value: '450.0k Households' },
    ],
  });
  edges.push({ from: 'series_friends_core', to: 'genre_comedy', rel: 'hasGenre', weight: '1.0' });
  edges.push({ from: 'series_friends_core', to: 'genre_sitcom', rel: 'hasGenre', weight: '1.0' });

  // Bridge Households
  layout.bridgePts.forEach((pos, i) => {
    const hhId = `hh_frny_bridge_${i}`;
    const sambaId = HH_IDS[i % HH_IDS.length];
    nodes.push({
      id: hhId,
      label: sambaId,
      type: 'household',
      x: pos[0], y: pos[1], z: pos[2],
      size: 11,
      properties: [
        { label: 'Household ID', value: sambaId },
        { label: 'Series Affinity', value: 'Friends (0.88)' },
        { label: 'Location', value: 'New York, NY' },
      ],
      devicesSummary: { sambaTv: 1, apple: 2, android: 1, cookieOrIp: 2, total: 6 },
      campaignsCount: 5 + i,
    });
    edges.push({
      from: 'series_friends_core',
      to: hhId,
      rel: 'affinity',
      weight: (0.90 - (i % 4) * 0.04).toFixed(2),
      hidden: false,
    });
    edges.push({
      from: 'state_ny_core',
      to: hhId,
      rel: 'stateOfResidence',
      weight: '1.00',
      hidden: false,
    });
  });

  // Fan 1 (Right): Experian NY Records
  layout.fan1Pts.forEach((pos, i) => {
    const expId = `exp_ny_fan_${i}`;
    nodes.push({
      id: expId,
      label: `Experian NY ${i + 1}`,
      type: 'experian_household',
      x: pos[0], y: pos[1], z: pos[2],
      size: 10,
      properties: [
        { label: 'Experian ID', value: `EXP-NY-${300 + i}` },
        { label: 'State of Residence', value: 'New York' },
      ],
    });
    edges.push({
      from: 'state_ny_core',
      to: expId,
      rel: 'stateOfResidence',
      weight: '1.00',
      hidden: i >= 5,
    });
  });

  return {
    query: 'People in New York who like Friends',
    title: 'Series Affinity & Geo Filter: Friends (NY)',
    description: 'Bipolar dual-hub matrix of Friends viewers in New York mapped through genres and Experian residence records.',
    nodes,
    edges,
    sparqlQuery: `PREFIX samba: <http://samba.tv/ontology/graph#>
PREFIX show: <http://samba.tv/data/Show#>
PREFIX experian: <http://samba.tv/data/Experian#>

SELECT ?household ?series ?genre ?state WHERE {
  GRAPH <http://samba.tv/data/ContentGraph> {
    ?series a show:Series ;
            show:title "Friends" ;
            show:hasGenre ?genre .
  }
  GRAPH <http://samba.tv/data/IdentityGraph> {
    ?household samba:hasAffinity ?genre ;
               samba:linkedExperian ?exp .
    ?exp experian:stateOfResidence "New York" .
  }
}
LIMIT 20`,
    metrics: { peopleMatch: '67.5k', seedHousehold: '24.1k' },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Example 5: Comedy & Sports (Bipolar Dual-Hub Radial Matrix Layout)
// ─────────────────────────────────────────────────────────────────────────────
function buildExample5_ComedySports(genreName = 'Comedy', topicName = 'Sports'): GraphDataset {
  const nodes: Node3DData[] = [];
  const edges: Edge3DData[] = [];

  // Bipolar Matrix Layout:
  // - Hub 1 (Right Hub: Comedy / Genre) placed at (+135, -15, 0)
  // - Hub 2 (Left Hub: Sports / Topic) placed at (-135, -35, 0)
  const layout = generateBipolarPositions({
    hub1Pos: [135, -15, 0],
    hub2Pos: [-135, -35, 0],
    bridgeCount: 6,
    fan1Count: 9,
    fan2Count: 11,
    fan1RadiusMin: 120,
    fan1RadiusMax: 215,
    fan2RadiusMin: 125,
    fan2RadiusMax: 225,
  });

  // ═════════════════════════════════════════════════════════════════════════════
  // 1. THE 2 CENTRAL CORE ELEMENTS (BIPOLAR HUBS)
  // ═════════════════════════════════════════════════════════════════════════════
  nodes.push({
    id: 'comedy_core',
    label: genreName,
    type: 'genre',
    x: layout.hub1Pos[0],
    y: layout.hub1Pos[1],
    z: layout.hub1Pos[2],
    size: 26,
    properties: [
      { label: 'Genre Name', value: genreName },
      { label: 'Affinity Type', value: 'Household Content Viewing Behavior' },
      { label: 'Attached Entity', value: 'Household Unit' },
      { label: 'Total Reach', value: '580.0k Households' },
      { label: 'Average Watch Time', value: '4.2 hrs / week' },
      { label: 'Identity Confidence', value: '99.4%' },
    ],
  });

  nodes.push({
    id: 'sports_core',
    label: topicName,
    type: 'topic',
    x: layout.hub2Pos[0],
    y: layout.hub2Pos[1],
    z: layout.hub2Pos[2],
    size: 26,
    properties: [
      { label: 'Topic Name', value: topicName },
      { label: 'Affinity Type', value: 'Individual Reading & Behavior Engagement' },
      { label: 'Attached Entity', value: 'Individual Person' },
      { label: 'Total Reach', value: '520.0k Individuals' },
      { label: 'Digital Affinity Index', value: '148 (High Interest)' },
      { label: 'Engagement Velocity', value: 'Daily Active Audience' },
    ],
  });

  // Direct luminescent bridge connecting the 2 core hubs
  edges.push({
    id: 'edge_core_bridge',
    from: 'sports_core',
    to: 'comedy_core',
    rel: 'crossAffinity',
    weight: '1.00',
    hidden: false,
  });

  // ═════════════════════════════════════════════════════════════════════════════
  // 2. CENTRAL BRIDGE NODES (Shared Households spanning between Hub 1 and Hub 2)
  // ═════════════════════════════════════════════════════════════════════════════
  const bridgeHouseholdIds = [
    '2a3c85ba5b7588ad',
    '3875d60a53a61971',
    'ef6d2785d945fd3b',
    '14c6da983a55a902',
    '95c73a1af61ff2b6',
    '6e382a05b1af1d9b',
  ];

  bridgeHouseholdIds.forEach((sambaId, i) => {
    const hhId = `hh_bridge_${i}`;
    const [x, y, z] = layout.bridgePts[i];

    nodes.push({
      id: hhId,
      label: sambaId,
      type: 'household',
      x, y, z,
      size: 13,
      properties: [
        { label: 'Household ID', value: sambaId },
        { label: 'Genre Affinity', value: `${genreName} (${(0.96 - i * 0.04).toFixed(2)})` },
        { label: 'Cluster Role', value: 'Shared Bridge Household' },
      ],
      devicesSummary: { sambaTv: 1, apple: 2, android: 1, cookieOrIp: 2, total: 6 },
      campaignsCount: 6 + i,
    });

    // Connection to Genre Hub (Comedy)
    edges.push({
      from: 'comedy_core',
      to: hhId,
      rel: 'hasAffinity',
      weight: (0.95 - (i % 4) * 0.05).toFixed(2),
      hidden: false,
    });

    // Connection to Topic Hub (Sports) or bridge cross-link
    edges.push({
      from: 'sports_core',
      to: hhId,
      rel: 'topicBridge',
      weight: (0.88 - (i % 4) * 0.04).toFixed(2),
      hidden: i >= 4,
    });
  });

  // ═════════════════════════════════════════════════════════════════════════════
  // 3. RIGHT HEMISPHERE RADIAL FAN (Households radiating outwards around Comedy)
  // ═════════════════════════════════════════════════════════════════════════════
  const rightFanHouseholdIds = [
    'e00a493c8c98f734',
    '770a764a077729db',
    '6a48bc3421e45de6',
    '4801141778832035',
    '8612846182973880',
    'f95a680f0ed7e4e4',
    'c54ccbf5624389ca',
    'e9543400f413ac09',
    'e8bbb6fa0afd5cb6',
  ];

  rightFanHouseholdIds.forEach((sambaId, i) => {
    const hhId = `hh_right_${i}`;
    const [x, y, z] = layout.fan1Pts[i];

    nodes.push({
      id: hhId,
      label: sambaId,
      type: 'household',
      x, y, z,
      size: 12,
      properties: [
        { label: 'Household ID', value: sambaId },
        { label: 'Genre Affinity', value: `${genreName} (${(0.94 - i * 0.03).toFixed(2)})` },
        { label: 'Core Proximity', value: 'Right Hemisphere Matrix' },
      ],
      devicesSummary: { sambaTv: 1, apple: 2, android: 1, cookieOrIp: 1, total: 5 },
      campaignsCount: 4 + (i % 5),
    });

    // Ray from Comedy Core to Household
    const weights = ['1.00', '0.81', '0.47', '0.92', '0.78', '0.64', '0.85', '0.73', '0.59'];
    edges.push({
      from: 'comedy_core',
      to: hhId,
      rel: 'hasAffinity',
      weight: weights[i % weights.length],
      hidden: i >= 7,
    });
  });

  // ═════════════════════════════════════════════════════════════════════════════
  // 4. LEFT HEMISPHERE RADIAL FAN (Individuals radiating outwards around Sports)
  // ═════════════════════════════════════════════════════════════════════════════
  const leftFanIndividualIds = [
    '64aa10689b7507ec',
    'cebcdbf756ee10b4',
    'db3caa36ef541f49',
    '500df0e75055093c',
    '471cef7a96ef3f2b',
    '804e64b1934d720d',
    'ec988ef278528424',
    'dc33e75c07031ad1',
    '9018237465ab1928',
    '192837465ab90182',
    '7465ab1928374650',
  ];

  leftFanIndividualIds.forEach((personId, i) => {
    const indId = `ind_left_${i}`;
    const [x, y, z] = layout.fan2Pts[i];

    nodes.push({
      id: indId,
      label: personId,
      type: 'individual',
      x, y, z,
      size: 11,
      properties: [
        { label: 'Individual ID', value: personId },
        { label: 'Topic Affinity', value: `${topicName} (${(0.95 - i * 0.02).toFixed(2)})` },
        { label: 'Role', value: 'Primary Household Viewer' },
      ],
    });

    // Ray from Sports Core to Individual
    const indWeights = ['0.95', '0.88', '0.81', '0.74', '0.68', '0.91', '0.83', '0.76', '0.69', '0.87', '0.72'];
    edges.push({
      from: 'sports_core',
      to: indId,
      rel: 'individualAffinity',
      weight: indWeights[i % indWeights.length],
      hidden: i >= 8,
    });

    // Cross-link: hasIndividual from Households to Individuals
    const targetBridgeHH = `hh_bridge_${i % bridgeHouseholdIds.length}`;
    const crossWeights = ['1.00', '0.81', '0.47', '0.22', '0.06', '0.94', '0.78', '0.55', '0.38', '0.19', '0.82'];
    edges.push({
      from: targetBridgeHH,
      to: indId,
      rel: 'hasIndividual',
      weight: crossWeights[i % crossWeights.length],
      hidden: i >= 7,
    });
  });

  // ═════════════════════════════════════════════════════════════════════════════
  // 5. PERIPHERAL SATELLITES & ENDPOINTS
  // ═════════════════════════════════════════════════════════════════════════════
  const subSatellites = [
    { id: 'sub_sitcom', label: 'Sitcom', type: 'genre' as NodeType, parent: 'comedy_core', rel: 'subGenre', x: 235, y: 160, z: -30, desc: 'Situational Comedies' },
    { id: 'sub_live_events', label: 'Live Events', type: 'topic' as NodeType, parent: 'sports_core', rel: 'subTopic', x: -235, y: 155, z: 30, desc: 'Live Tournament Broadcasts' },
    { id: 'sub_smart_tv', label: 'Samba Smart TV 65"', type: 'device' as NodeType, parent: 'hh_right_0', rel: 'hasDevice', x: 330, y: -130, z: 25, desc: 'Samba Connected TV' },
    { id: 'sub_apple_tv', label: 'Apple TV 4K', type: 'device' as NodeType, parent: 'ind_left_0', rel: 'hasDevice', x: -320, y: -140, z: -25, desc: 'Apple Streaming Hub' },
  ];

  subSatellites.forEach((sat) => {
    nodes.push({
      id: sat.id,
      label: sat.label,
      type: sat.type,
      x: sat.x, y: sat.y, z: sat.z,
      size: 13,
      properties: [
        { label: 'Category', value: sat.desc },
        { label: 'Affinity Match', value: 'High Confidence (0.92)' },
      ],
    });

    edges.push({
      from: sat.parent,
      to: sat.id,
      rel: sat.rel,
      weight: '0.92',
      hidden: false,
    });
  });

  return {
    query: `Households that like ${genreName} and read about ${topicName}`,
    title: `${genreName} & ${topicName} Affinity Bipolar Matrix`,
    description: `Bipolar dual-hub matrix of ${nodes.length} interconnected nodes demonstrating Household ${genreName} affinity + Individual ${topicName} topic affinity.`,
    nodes,
    edges,
    sparqlQuery: `PREFIX samba: <http://samba.tv/ontology/graph#>

SELECT ?household ?genre ?individual ?topic WHERE {
  GRAPH <http://samba.tv/data/IdentityGraph> {
    ?household a samba:Household ;
               samba:hasAffinity <http://samba.tv/genre/${genreName}> ;
               samba:hasIndividual ?individual .
    ?individual samba:hasTopicAffinity <http://samba.tv/topic/${topicName}> .
  }
}
LIMIT 20`,
    metrics: { peopleMatch: '75.7k', seedHousehold: '67.5k' },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Example 6: Game of Thrones, NY, Married
// ─────────────────────────────────────────────────────────────────────────────
function buildExample6_GoTMarried(): GraphDataset {
  const nodes: Node3DData[] = [];
  const edges: Edge3DData[] = [];

  const layout = generateBipolarPositions({
    hub1Pos: [135, -20, 0], // New York Married
    hub2Pos: [-135, -20, 0], // Game of Thrones
    bridgeCount: 6,
    fan1Count: 8,
    fan2Count: 8,
  });

  // 2 Central Core Elements
  nodes.push({
    id: 'series_got_core',
    label: 'Game of Thrones',
    type: 'series',
    x: layout.hub2Pos[0], y: layout.hub2Pos[1], z: layout.hub2Pos[2],
    size: 28,
    properties: [
      { label: 'Series Title', value: 'Game of Thrones' },
      { label: 'Network', value: 'HBO / Warner Bros Discovery' },
      { label: 'Genres', value: 'Drama, Fantasy' },
      { label: 'Global Viewers', value: '18.4M Tracked Households' },
    ],
  });

  nodes.push({
    id: 'state_ny_married_core',
    label: 'New York (Married Cohort)',
    type: 'state',
    x: layout.hub1Pos[0], y: layout.hub1Pos[1], z: layout.hub1Pos[2],
    size: 28,
    properties: [
      { label: 'State Name', value: 'New York' },
      { label: 'Demographic Filter', value: 'Married Households' },
      { label: 'Experian Validation', value: 'High Confidence (0.95)' },
    ],
  });

  edges.push({
    from: 'series_got_core',
    to: 'state_ny_married_core',
    rel: 'crossCohortAffinity',
    weight: '0.93',
    hidden: false,
  });

  // Intermediate Genre Satellites
  nodes.push({
    id: 'genre_drama',
    label: 'Drama',
    type: 'genre',
    x: -210, y: 145, z: -25,
    size: 18,
    properties: [{ label: 'Genre Name', value: 'Drama' }, { label: 'Reach', value: '400.0k' }],
  });
  nodes.push({
    id: 'genre_fantasy',
    label: 'Fantasy',
    type: 'genre',
    x: -210, y: -145, z: 25,
    size: 18,
    properties: [{ label: 'Genre Name', value: 'Fantasy' }, { label: 'Reach', value: '520.0k' }],
  });
  edges.push({ from: 'series_got_core', to: 'genre_drama', rel: 'hasGenre', weight: '1.0' });
  edges.push({ from: 'series_got_core', to: 'genre_fantasy', rel: 'hasGenre', weight: '1.0' });

  // Bridge Households
  layout.bridgePts.forEach((pos, i) => {
    const hhId = `hh_got_bridge_${i}`;
    const sambaId = HH_IDS[i % HH_IDS.length];
    nodes.push({
      id: hhId,
      label: sambaId,
      type: 'household',
      x: pos[0], y: pos[1], z: pos[2],
      size: 11,
      properties: [
        { label: 'Household ID', value: sambaId },
        { label: 'Series Affinity', value: 'Game of Thrones (0.93)' },
      ],
      devicesSummary: { sambaTv: 1, apple: 2, android: 1, cookieOrIp: 1, total: 5 },
      campaignsCount: 8,
    });
    edges.push({
      from: 'series_got_core',
      to: hhId,
      rel: 'affinity',
      weight: (0.92 - (i % 4) * 0.03).toFixed(2),
      hidden: false,
    });
    edges.push({
      from: 'state_ny_married_core',
      to: hhId,
      rel: 'stateOfResidence',
      weight: '1.00',
      hidden: false,
    });
  });

  // Fan 1 (Right): Experian Married Records
  layout.fan1Pts.forEach((pos, i) => {
    const expId = `exp_got_fan_${i}`;
    nodes.push({
      id: expId,
      label: `Experian Married ${i + 1}`,
      type: 'experian_household',
      x: pos[0], y: pos[1], z: pos[2],
      size: 10,
      properties: [
        { label: 'State of Residence', value: 'New York' },
        { label: 'Marital Status', value: 'Married', isNote: true },
      ],
    });
    edges.push({
      from: 'state_ny_married_core',
      to: expId,
      rel: 'stateOfResidence',
      weight: '1.00',
      hidden: i >= 5,
    });
  });

  return {
    query: 'People who like Game of Thrones, living in New York, who are married',
    title: 'Series Affinity, Geo & Demographic Profile',
    description: 'Bipolar dual-hub matrix of Game of Thrones viewers in New York with Experian marital status attributes.',
    nodes,
    edges,
    sparqlQuery: `PREFIX samba: <http://samba.tv/ontology/graph#>
PREFIX show: <http://samba.tv/data/Show#>
PREFIX experian: <http://samba.tv/data/Experian#>

SELECT ?household ?series ?state ?maritalStatus WHERE {
  GRAPH <http://samba.tv/data/ContentGraph> {
    ?series show:title "Game of Thrones" ;
            show:hasGenre ?genre .
  }
  GRAPH <http://samba.tv/data/IdentityGraph> {
    ?household samba:hasAffinity ?genre ;
               samba:linkedExperian ?exp .
    ?exp experian:stateOfResidence "New York" ;
         experian:maritalStatus "Married" .
  }
}
LIMIT 20`,
    metrics: { peopleMatch: '48.9k', seedHousehold: '19.2k' },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Query Engine: Select matching dataset for any user query or fallback
// ─────────────────────────────────────────────────────────────────────────────
export function getGraphDataset(queryText: string): GraphDataset {
  const q = (queryText || '').toLowerCase().trim();

  if (q.includes('samba tv') && (q.includes('device') || q.includes('3') || q.includes('more'))) {
    return buildExample1_Devices();
  }
  if (q.includes('texas')) {
    return buildExample2_Texas();
  }
  if (q.includes('75') || q.includes('income')) {
    return buildExample3_Income();
  }
  if (q.includes('friends') || (q.includes('new york') && !q.includes('thrones') && !q.includes('married'))) {
    return buildExample4_FriendsNY();
  }
  if (q.includes('game of thrones') || q.includes('thrones') || q.includes('married')) {
    return buildExample6_GoTMarried();
  }

  // Genre detection
  const detectedGenre = genres.find(g => q.includes(g.name.toLowerCase()));
  // Topic detection
  const detectedTopic = topics.find(t => q.includes(t.name.toLowerCase()));

  if (detectedGenre && detectedTopic) {
    return buildExample5_ComedySports(detectedGenre.name, detectedTopic.name);
  }

  if (detectedGenre && !detectedTopic) {
    return buildExample5_ComedySports(detectedGenre.name, 'Sports');
  }

  if (detectedTopic && !detectedGenre) {
    return buildExample5_ComedySports('Comedy', detectedTopic.name);
  }

  // Default rich scene: Comedy & Sports
  return buildExample5_ComedySports('Comedy', 'Sports');
}
