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

export const tableRows: TableRow[] = Array.from({ length: 10 }, (_, i) => ({
  household: `samba.tv/34003493403040${340 + i}`,
  sambaId: ['6e382a05b1af1d9b','2a3c85ba5b7588ad','3875d60a53a61971','3755283108548888','e00a493c8c98f734','770a764a077729db','6a48bc3421e45de6','4801141778832035','8612846182973880','f95a680f0ed7e4e4'][i],
  genreScore: (0.95 - i * 0.04).toFixed(2),
  topicScore: (0.92 - i * 0.03).toFixed(2),
}));

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

// ─── Pre-computed Fibonacci sphere helper ─────────────────────────────────────
function fibSphere(n: number, radius: number, offsetAngle = 0): [number, number, number][] {
  const pts: [number, number, number][] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / Math.max(1, n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i + offsetAngle;
    pts.push([Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius]);
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
// 1. Example 1: Multi-Device Household Constellation (60+ Nodes)
// ─────────────────────────────────────────────────────────────────────────────
function buildExample1_Devices(): GraphDataset {
  const nodes: Node3DData[] = [];
  const edges: Edge3DData[] = [];

  // 2 Central Core Hubs
  nodes.push({
    id: 'samba_dex_core1',
    label: 'Samba TV DEX Core A',
    type: 'household',
    x: -80, y: 0, z: 0,
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
    x: 80, y: 0, z: 0,
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

  // Inner Shell: 16 Households (Radius 220)
  const hhCount = 16;
  const hhPts = fibSphere(hhCount, 220);

  for (let i = 0; i < hhCount; i++) {
    const hhId = `hh_dev_${i}`;
    const [hx, hy, hz] = hhPts[i];
    const sambaId = HH_IDS[i % HH_IDS.length];

    nodes.push({
      id: hhId,
      label: sambaId,
      type: 'household',
      x: hx, y: hy, z: hz,
      size: 13,
      properties: [
        { label: 'Household ID', value: sambaId },
        { label: 'Country', value: 'US' },
        { label: 'Status', value: 'Active Match' },
        { label: 'Graph Sample', value: 'Multi-Device Household (>3 Devices)' },
      ],
      devicesSummary: { sambaTv: 1, apple: 2, android: 1, cookieOrIp: 2, total: 6 },
      campaignsCount: 4 + (i * 2),
    });

    const parentCore = i % 2 === 0 ? 'samba_dex_core1' : 'samba_dex_core2';
    edges.push({
      from: parentCore,
      to: hhId,
      rel: 'clusterMember',
      weight: (0.95 - (i % 8) * 0.04).toFixed(2),
      hidden: i >= 8,
    });
  }

  // Outer Shell: 32 Devices + 16 Cookies (Radius 360-440)
  const devTypes: { cat: DeviceCategory; label: string; name: string }[] = [
    { cat: 'samba_tv', label: 'Samba Smart TV 65"', name: 'Samba TV 65"' },
    { cat: 'apple', label: 'Apple TV 4K', name: 'Apple TV 4K' },
    { cat: 'apple', label: 'Apple MacBook Pro', name: 'Apple MacBook Pro M3' },
    { cat: 'apple', label: 'Apple iPhone 15', name: 'Apple iPhone 15' },
    { cat: 'android', label: 'Samsung Galaxy S24', name: 'Samsung Galaxy S24' },
    { cat: 'android', label: 'Google Pixel 8', name: 'Google Pixel 8' },
    { cat: 'cookie_or_ip', label: 'IP Bridge Match', name: 'IP Bridge Match' },
    { cat: 'cookie_or_ip', label: 'DEX Cookie Sync', name: 'DEX Cookie Sync' },
  ];

  const outerCount = 48;
  const outerPts = fibSphere(outerCount, 380, 0.4);

  for (let di = 0; di < outerCount; di++) {
    const devId = `dev_node_${di}`;
    const [dx, dy, dz] = outerPts[di];
    const d = devTypes[di % devTypes.length];
    const isCookie = d.cat === 'cookie_or_ip';

    nodes.push({
      id: devId,
      label: d.label,
      type: isCookie ? 'cookie_or_ip' : 'device',
      subType: d.cat,
      x: dx, y: dy, z: dz,
      size: isCookie ? 8 : 10,
      properties: isCookie
        ? [
            { label: 'Cookie Identifier', value: `ck_${HH_IDS[di % HH_IDS.length].slice(0, 8)}_${di}` },
            { label: 'Simulated IP', value: `192.168.1.${40 + di * 4}` },
            { label: 'Sync Status', value: 'Valid IP Bridge' },
          ]
        : [
            { label: 'Device ID', value: `dev_${HH_IDS[di % HH_IDS.length].slice(0, 6)}_${d.cat}_${di}` },
            { label: 'Device Model', value: d.name },
            { label: 'Match Key Type', value: d.cat === 'samba_tv' ? 'DEX_ID' : 'IP_MATCH' },
            { label: 'Last Active', value: 'Active Now' },
          ],
    });

    const targetHH = `hh_dev_${di % hhCount}`;
    edges.push({
      from: targetHH,
      to: devId,
      rel: isCookie ? 'hasCookie' : 'hasDevice',
      weight: (0.94 - (di % 6) * 0.05).toFixed(2),
      hidden: di >= 16,
    });
  }

  return {
    query: 'Households with Samba TV and more than 3 devices',
    title: 'Samba TV Multi-Device Household Cluster',
    description: '3D constellation of households verified with active Samba TV units and >= 3 connected endpoints.',
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
// 2. Example 2: Households in Texas (70+ Nodes in 3D Spherical World)
// ─────────────────────────────────────────────────────────────────────────────
function buildExample2_Texas(): GraphDataset {
  const nodes: Node3DData[] = [];
  const edges: Edge3DData[] = [];

  // 2 Central Core Elements
  nodes.push({
    id: 'state_tx_core',
    label: 'Texas Geographic Hub',
    type: 'state',
    x: -80, y: 0, z: 0,
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
    x: 80, y: 0, z: 0,
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

  // Inner Shell: 24 Experian Households (Radius 220)
  const expCount = 24;
  const expPts = fibSphere(expCount, 220);

  for (let i = 0; i < expCount; i++) {
    const expId = `exp_tx_${i}`;
    const [ex, ey, ez] = expPts[i];

    nodes.push({
      id: expId,
      label: `Experian HH ${i + 1}`,
      type: 'experian_household',
      x: ex, y: ey, z: ez,
      size: 11,
      properties: [
        { label: 'Experian ID', value: `EXP-TX-${1000 + i}` },
        { label: 'State of Residence', value: 'Texas' },
        { label: 'Match Confidence', value: '98.4%' },
      ],
    });

    edges.push({
      from: 'experian_tx_core',
      to: expId,
      rel: 'verifiedRecord',
      weight: (0.98 - (i % 6) * 0.03).toFixed(2),
      hidden: i >= 10,
    });

    edges.push({
      from: 'state_tx_core',
      to: expId,
      rel: 'stateOfResidence',
      weight: '1.00',
      hidden: i >= 10,
    });
  }

  // Mid Shell: 24 Samba Households (Radius 340)
  const hhCount = 24;
  const hhPts = fibSphere(hhCount, 340, 0.3);

  for (let i = 0; i < hhCount; i++) {
    const hhId = `hh_tx_${i}`;
    const [hx, hy, hz] = hhPts[i];
    const sambaId = HH_IDS[i % HH_IDS.length];

    nodes.push({
      id: hhId,
      label: sambaId,
      type: 'household',
      x: hx, y: hy, z: hz,
      size: 12,
      properties: [
        { label: 'Household ID', value: sambaId },
        { label: 'DMA', value: i % 3 === 0 ? 'Dallas-Ft. Worth' : i % 3 === 1 ? 'Houston' : 'Austin-San Antonio' },
        { label: 'Matched State', value: 'Texas' },
      ],
      devicesSummary: { sambaTv: 1, apple: 2, android: 2, cookieOrIp: 1, total: 6 },
      campaignsCount: 6 + (i % 6),
    });

    const targetExp = `exp_tx_${i % expCount}`;
    edges.push({
      from: targetExp,
      to: hhId,
      rel: 'linkedHousehold',
      weight: '0.95',
      hidden: i >= 12,
    });
  }

  // Outer Shell: 20 Connected Devices (Radius 440)
  const devPts = fibSphere(20, 440, 0.6);
  for (let di = 0; di < 20; di++) {
    const devId = `dev_tx_${di}`;
    const [dx, dy, dz] = devPts[di];

    nodes.push({
      id: devId,
      label: di % 2 === 0 ? `Samba TV TX-${di + 1}` : `Device TX-${di + 1}`,
      type: 'device',
      subType: di % 2 === 0 ? 'samba_tv' : 'android',
      x: dx, y: dy, z: dz,
      size: 9,
      properties: [
        { label: 'Device ID', value: `dev_tx_${di * 91 + 104}` },
        { label: 'DMA Region', value: 'Texas Metro' },
        { label: 'Status', value: 'Active Connected Node' },
      ],
    });

    const targetHH = `hh_tx_${di % hhCount}`;
    edges.push({
      from: targetHH,
      to: devId,
      rel: 'hasDevice',
      weight: '0.90',
      hidden: di >= 8,
    });
  }

  return {
    query: 'Households in Texas',
    title: 'Geographic Audience Hub: Texas',
    description: '3D constellation of Texas households linked through intermediate Experian identity resolution nodes.',
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
// 3. Example 3: Households with income over $75k (60+ Nodes in 3D Spherical World)
// ─────────────────────────────────────────────────────────────────────────────
function buildExample3_Income(): GraphDataset {
  const nodes: Node3DData[] = [];
  const edges: Edge3DData[] = [];

  // 2 Central Core Elements
  nodes.push({
    id: 'income_75k_core',
    label: '>$75k Income Bracket',
    type: 'income_bracket',
    x: -80, y: 0, z: 0,
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
    x: 80, y: 0, z: 0,
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

  // Inner Shell: 20 Experian Demographic Hubs (Radius 220)
  const expCount = 20;
  const expPts = fibSphere(expCount, 220);

  for (let i = 0; i < expCount; i++) {
    const expId = `exp_inc_${i}`;
    const [ex, ey, ez] = expPts[i];

    nodes.push({
      id: expId,
      label: `Experian HH ${i + 1}`,
      type: 'experian_household',
      x: ex, y: ey, z: ez,
      size: 11,
      properties: [
        { label: 'Experian ID', value: `EXP-INC-${2000 + i}` },
        { label: 'Reported Income', value: '$85k - $125k' },
        { label: 'Income Confidence', value: 'High (0.92)' },
      ],
    });

    edges.push({
      from: 'income_75k_core',
      to: expId,
      rel: 'incomeBracket',
      weight: (0.94 - (i % 5) * 0.03).toFixed(2),
      hidden: i >= 8,
    });
    edges.push({
      from: 'affluence_index_core',
      to: expId,
      rel: 'mosaicSegment',
      weight: '0.92',
      hidden: i >= 8,
    });
  }

  // Mid Shell: 24 Samba Households (Radius 330)
  const hhCount = 24;
  const hhPts = fibSphere(hhCount, 330, 0.4);

  for (let i = 0; i < hhCount; i++) {
    const hhId = `hh_inc_${i}`;
    const [hx, hy, hz] = hhPts[i];
    const sambaId = HH_IDS[i % HH_IDS.length];

    nodes.push({
      id: hhId,
      label: sambaId,
      type: 'household',
      x: hx, y: hy, z: hz,
      size: 12,
      properties: [
        { label: 'Household ID', value: sambaId },
        { label: 'Affluence Index', value: '142' },
        { label: 'Premium Ad Engagement', value: 'High' },
      ],
      devicesSummary: { sambaTv: 1, apple: 3, android: 1, cookieOrIp: 2, total: 7 },
      campaignsCount: 9,
    });

    const targetExp = `exp_inc_${i % expCount}`;
    edges.push({
      from: targetExp,
      to: hhId,
      rel: 'matchedHousehold',
      weight: '0.93',
      hidden: i >= 10,
    });
  }

  // Outer Shell: 18 Premium Devices (Radius 430)
  const devPts = fibSphere(18, 430, 0.7);
  for (let di = 0; di < 18; di++) {
    const devId = `dev_inc_${di}`;
    const [dx, dy, dz] = devPts[di];

    nodes.push({
      id: devId,
      label: di % 2 === 0 ? `Apple TV 4K #${di + 1}` : `MacBook Pro #${di + 1}`,
      type: 'device',
      subType: 'apple',
      x: dx, y: dy, z: dz,
      size: 9,
      properties: [
        { label: 'Device ID', value: `dev_prem_${di * 44 + 301}` },
        { label: 'Category', value: 'Premium Connected Device' },
      ],
    });

    const targetHH = `hh_inc_${di % hhCount}`;
    edges.push({
      from: targetHH,
      to: devId,
      rel: 'hasDevice',
      weight: '0.91',
      hidden: di >= 7,
    });
  }

  return {
    query: 'Households with income over $75k',
    title: 'High Income Audience Resolution',
    description: '3D constellation of high income households resolved through Experian demographic income attribute hubs.',
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
// 4. Example 4: Who likes Friends in New York (60+ Nodes in 3D Spherical World)
// ─────────────────────────────────────────────────────────────────────────────
function buildExample4_FriendsNY(): GraphDataset {
  const nodes: Node3DData[] = [];
  const edges: Edge3DData[] = [];

  // 2 Central Core Elements
  nodes.push({
    id: 'series_friends_core',
    label: 'Friends',
    type: 'series',
    x: -80, y: 0, z: 0,
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
    x: 80, y: 0, z: 0,
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

  // Intermediate Genre Satellite Hubs
  nodes.push({
    id: 'genre_comedy',
    label: 'Comedy',
    type: 'genre',
    x: -40, y: 160, z: 0,
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
    x: -40, y: -160, z: 0,
    size: 18,
    properties: [
      { label: 'Genre Name', value: 'Sitcom' },
      { label: 'Total Reach', value: '450.0k Households' },
    ],
  });

  edges.push({ from: 'series_friends_core', to: 'genre_comedy', rel: 'hasGenre', weight: '1.0' });
  edges.push({ from: 'series_friends_core', to: 'genre_sitcom', rel: 'hasGenre', weight: '1.0' });

  // Inner Shell: 24 Households (Radius 250)
  const hhCount = 24;
  const hhPts = fibSphere(hhCount, 250);

  for (let i = 0; i < hhCount; i++) {
    const hhId = `hh_frny_${i}`;
    const [hx, hy, hz] = hhPts[i];
    const sambaId = HH_IDS[i % HH_IDS.length];

    nodes.push({
      id: hhId,
      label: sambaId,
      type: 'household',
      x: hx, y: hy, z: hz,
      size: 11,
      properties: [
        { label: 'Household ID', value: sambaId },
        { label: 'Series Affinity', value: 'Friends (0.88)' },
        { label: 'Location', value: 'New York, NY' },
      ],
      devicesSummary: { sambaTv: 1, apple: 2, android: 1, cookieOrIp: 2, total: 6 },
      campaignsCount: 5 + (i % 5),
    });

    edges.push({
      from: i % 2 === 0 ? 'genre_comedy' : 'genre_sitcom',
      to: hhId,
      rel: 'affinity',
      weight: (0.90 - (i % 6) * 0.04).toFixed(2),
      hidden: i >= 10,
    });
  }

  // Mid Shell: 20 Experian NY Records (Radius 360)
  const expCount = 20;
  const expPts = fibSphere(expCount, 360, 0.4);

  for (let i = 0; i < expCount; i++) {
    const expId = `exp_ny_${i}`;
    const [ex, ey, ez] = expPts[i];

    nodes.push({
      id: expId,
      label: `Experian NY ${i + 1}`,
      type: 'experian_household',
      x: ex, y: ey, z: ez,
      size: 10,
      properties: [
        { label: 'Experian ID', value: `EXP-NY-${300 + i}` },
        { label: 'State of Residence', value: 'New York' },
      ],
    });

    const targetHH = `hh_frny_${i % hhCount}`;
    edges.push({ from: targetHH, to: expId, rel: 'identityMatch', weight: '0.94', hidden: i >= 10 });
    edges.push({ from: expId, to: 'state_ny_core', rel: 'stateOfResidence', weight: '1.0', hidden: i >= 10 });
  }

  // Outer Shell: 16 Connected Devices (Radius 440)
  const devPts = fibSphere(16, 440, 0.8);
  for (let di = 0; di < 16; di++) {
    const devId = `dev_ny_${di}`;
    const [dx, dy, dz] = devPts[di];

    nodes.push({
      id: devId,
      label: `Samba Smart TV NY-${di + 1}`,
      type: 'device',
      subType: 'samba_tv',
      x: dx, y: dy, z: dz,
      size: 9,
      properties: [
        { label: 'Device ID', value: `dev_ny_${di * 12 + 201}` },
        { label: 'Region', value: 'New York DMA' },
      ],
    });

    const targetHH = `hh_frny_${di % hhCount}`;
    edges.push({ from: targetHH, to: devId, rel: 'hasDevice', weight: '0.91', hidden: di >= 6 });
  }

  return {
    query: 'People in New York who like Friends',
    title: 'Series Affinity & Geo Filter: Friends (NY)',
    description: '3D constellation of Friends viewers in New York mapped through genres and Experian residence records.',
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
// 5. Example 5: Comedy & Sports (118+ Nodes 3D Globe with 2 Central Core Hubs)
// ─────────────────────────────────────────────────────────────────────────────
function buildExample5_ComedySports(genreName = 'Comedy', topicName = 'Sports'): GraphDataset {
  const nodes: Node3DData[] = [];
  const edges: Edge3DData[] = [];

  // ═════════════════════════════════════════════════════════════════════════════
  // 1. THE 2 CENTRAL CORE ELEMENTS (Sitting prominently in the center of the world)
  // ═════════════════════════════════════════════════════════════════════════════
  nodes.push({
    id: 'comedy_core',
    label: genreName,
    type: 'genre',
    x: -80, y: 0, z: 0,
    size: 28,
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
    x: 80, y: 0, z: 0,
    size: 28,
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
    weight: '0.94',
    hidden: false,
  });

  // ═════════════════════════════════════════════════════════════════════════════
  // 2. INNER SPHERICAL SHELL (Radius 200, 36 Nodes: Households & Individuals)
  // ═════════════════════════════════════════════════════════════════════════════
  const innerHhCount = 20;
  const innerIndCount = 16;
  const innerPts = fibSphere(innerHhCount + innerIndCount, 205);

  for (let i = 0; i < innerHhCount; i++) {
    const hhId = `hh_in_${i}`;
    const [x, y, z] = innerPts[i];
    const sambaId = HH_IDS[i % HH_IDS.length];

    nodes.push({
      id: hhId,
      label: sambaId,
      type: 'household',
      x, y, z,
      size: 11,
      properties: [
        { label: 'Household ID', value: sambaId },
        { label: 'Genre Affinity', value: `${genreName} (${(0.96 - i * 0.02).toFixed(2)})` },
        { label: 'Core Proximity', value: 'Inner Orbit' },
      ],
      devicesSummary: { sambaTv: 1, apple: 2, android: 1, cookieOrIp: 2, total: 6 },
      campaignsCount: 4 + (i % 6),
    });

    edges.push({
      from: 'comedy_core',
      to: hhId,
      rel: 'hasAffinity',
      weight: (0.95 - (i % 6) * 0.04).toFixed(2),
      hidden: i >= 8, // Initial sampled visibility; rest revealed on click!
    });
  }

  for (let i = 0; i < innerIndCount; i++) {
    const indId = `ind_in_${i}`;
    const [x, y, z] = innerPts[innerHhCount + i];
    const personId = IND_IDS[i % IND_IDS.length];

    nodes.push({
      id: indId,
      label: personId,
      type: 'individual',
      x, y, z,
      size: 10,
      properties: [
        { label: 'Individual ID', value: personId },
        { label: 'Topic Affinity', value: `${topicName} (${(0.95 - i * 0.02).toFixed(2)})` },
        { label: 'Role', value: 'Primary Household Viewer' },
      ],
    });

    edges.push({
      from: 'sports_core',
      to: indId,
      rel: 'individualAffinity',
      weight: (0.93 - (i % 6) * 0.04).toFixed(2),
      hidden: i >= 8,
    });

    // Link individual to corresponding inner household
    const targetHH = `hh_in_${i % innerHhCount}`;
    edges.push({
      from: targetHH,
      to: indId,
      rel: 'hasIndividual',
      weight: '0.96',
      hidden: i >= 10,
    });
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // 3. MID SPHERICAL SHELL (Radius 320, 44 Nodes: Extended Households, Individuals, Devices)
  // ═════════════════════════════════════════════════════════════════════════════
  const midHhCount = 14;
  const midIndCount = 14;
  const midDevCount = 16;
  const midPts = fibSphere(midHhCount + midIndCount + midDevCount, 320, 0.5);

  for (let i = 0; i < midHhCount; i++) {
    const hhId = `hh_mid_${i}`;
    const [x, y, z] = midPts[i];
    const sambaId = HH_IDS[(i + 8) % HH_IDS.length];

    nodes.push({
      id: hhId,
      label: sambaId,
      type: 'household',
      x, y, z,
      size: 10,
      properties: [
        { label: 'Household ID', value: sambaId },
        { label: 'Genre Affinity', value: `${genreName} (0.86)` },
        { label: 'Orbit Layer', value: 'Mid Constellation' },
      ],
      devicesSummary: { sambaTv: 1, apple: 1, android: 2, cookieOrIp: 1, total: 5 },
      campaignsCount: 6 + (i % 4),
    });

    edges.push({
      from: 'comedy_core',
      to: hhId,
      rel: 'hasAffinity',
      weight: (0.88 - (i % 4) * 0.04).toFixed(2),
      hidden: true, // revealed on interaction
    });

    // Cross link with inner household
    const innerTarget = `hh_in_${i % innerHhCount}`;
    edges.push({
      from: innerTarget,
      to: hhId,
      rel: 'coCluster',
      weight: '0.78',
      hidden: i >= 6,
    });
  }

  for (let i = 0; i < midIndCount; i++) {
    const indId = `ind_mid_${i}`;
    const [x, y, z] = midPts[midHhCount + i];
    const personId = IND_IDS[(i + 6) % IND_IDS.length];

    nodes.push({
      id: indId,
      label: personId,
      type: 'individual',
      x, y, z,
      size: 9,
      properties: [
        { label: 'Individual ID', value: personId },
        { label: 'Topic Affinity', value: `${topicName} (0.88)` },
        { label: 'Orbit Layer', value: 'Mid Constellation' },
      ],
    });

    edges.push({
      from: 'sports_core',
      to: indId,
      rel: 'individualAffinity',
      weight: (0.87 - (i % 4) * 0.04).toFixed(2),
      hidden: true,
    });

    const targetMidHH = `hh_mid_${i % midHhCount}`;
    edges.push({
      from: targetMidHH,
      to: indId,
      rel: 'hasIndividual',
      weight: '0.94',
      hidden: i >= 6,
    });
  }

  for (let i = 0; i < midDevCount; i++) {
    const devId = `dev_mid_${i}`;
    const [x, y, z] = midPts[midHhCount + midIndCount + i];
    const devCategory: DeviceCategory = i % 3 === 0 ? 'samba_tv' : i % 3 === 1 ? 'apple' : 'android';

    nodes.push({
      id: devId,
      label: devCategory === 'samba_tv' ? `Samba TV 65" #${i + 1}` : devCategory === 'apple' ? `Apple TV 4K #${i + 1}` : `Samsung Galaxy Tab #${i + 1}`,
      type: 'device',
      subType: devCategory,
      x, y, z,
      size: 9,
      properties: [
        { label: 'Device Category', value: devCategory },
        { label: 'Device ID', value: `dev_${devCategory}_${i * 37 + 102}` },
        { label: 'Network Presence', value: 'Active Home Network' },
      ],
    });

    const targetHH = `hh_in_${i % innerHhCount}`;
    edges.push({
      from: targetHH,
      to: devId,
      rel: 'hasDevice',
      weight: '0.92',
      hidden: i >= 8,
    });
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // 4. OUTER CONSTELLATION SHELL (Radius 440, 36 Nodes: Cookies, Mobile, Sub-Hubs)
  // ═════════════════════════════════════════════════════════════════════════════
  const outerCount = 36;
  const outerPts = fibSphere(outerCount, 440, 1.1);

  // 4 Sub-satellite Hubs on the outer sphere
  const subSatellites = [
    { id: 'sub_sitcom', label: 'Sitcom', type: 'genre' as NodeType, parent: 'comedy_core', rel: 'subGenre', desc: 'Situational Comedies' },
    { id: 'sub_standup', label: 'Stand-up', type: 'genre' as NodeType, parent: 'comedy_core', rel: 'subGenre', desc: 'Stand-up Specials' },
    { id: 'sub_live_events', label: 'Live Events', type: 'topic' as NodeType, parent: 'sports_core', rel: 'subTopic', desc: 'Live Tournament Broadcasts' },
    { id: 'sub_highlights', label: 'Highlights', type: 'topic' as NodeType, parent: 'sports_core', rel: 'subTopic', desc: 'Sports Analysis & Recaps' },
  ];

  subSatellites.forEach((sat, si) => {
    const [x, y, z] = outerPts[si];
    nodes.push({
      id: sat.id,
      label: sat.label,
      type: sat.type,
      x, y, z,
      size: 16,
      properties: [
        { label: 'Category', value: sat.desc },
        { label: 'Parent Hub', value: sat.parent === 'comedy_core' ? genreName : topicName },
        { label: 'Sub-Affinity Match', value: 'High Correlation (0.91)' },
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

  // Remaining outer nodes: Cookie / IP resolution nodes & Mobile Devices
  for (let di = 4; di < outerCount; di++) {
    const [x, y, z] = outerPts[di];
    const isCookie = di % 2 === 0;
    const nodeId = isCookie ? `ck_out_${di}` : `mob_out_${di}`;

    nodes.push({
      id: nodeId,
      label: isCookie ? `Cookie ID ${di - 3}` : `Mobile iPhone #${di - 3}`,
      type: isCookie ? 'cookie_or_ip' : 'device',
      subType: isCookie ? 'cookie_or_ip' : 'apple',
      x, y, z,
      size: isCookie ? 7 : 8,
      properties: isCookie
        ? [
            { label: 'Cookie Resolution', value: `ck_sync_${di * 1928 + 11}` },
            { label: 'IP Bridge Match', value: `192.168.1.${50 + di * 3}` },
            { label: 'Status', value: 'Validated Identity Anchor' },
          ]
        : [
            { label: 'Device ID', value: `mob_dev_${di * 881 + 44}` },
            { label: 'Device Model', value: 'Apple iPhone 15 Pro' },
            { label: 'Location Match', value: 'Verified Home Geo' },
          ],
    });

    // Link to individuals or households
    if (isCookie) {
      const targetInd = `ind_in_${(di - 4) % innerIndCount}`;
      edges.push({
        from: targetInd,
        to: nodeId,
        rel: 'hasCookie',
        weight: (0.93 - (di % 4) * 0.05).toFixed(2),
        hidden: di >= 12,
      });
    } else {
      const targetHH = `hh_mid_${(di - 4) % midHhCount}`;
      edges.push({
        from: targetHH,
        to: nodeId,
        rel: 'hasDevice',
        weight: (0.91 - (di % 4) * 0.05).toFixed(2),
        hidden: di >= 12,
      });
    }
  }

  return {
    query: `Households that like ${genreName} and read about ${topicName}`,
    title: `${genreName} & ${topicName} Affinity 3D Constellation`,
    description: `Spherical 3D world of ${nodes.length} interconnected nodes demonstrating Household ${genreName} affinity + Individual ${topicName} topic affinity.`,
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
// 6. Example 6: Game of Thrones, NY, Married (60+ Nodes 3D Spherical World)
// ─────────────────────────────────────────────────────────────────────────────
function buildExample6_GoTMarried(): GraphDataset {
  const nodes: Node3DData[] = [];
  const edges: Edge3DData[] = [];

  // 2 Central Core Elements
  nodes.push({
    id: 'series_got_core',
    label: 'Game of Thrones',
    type: 'series',
    x: -80, y: 0, z: 0,
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
    x: 80, y: 0, z: 0,
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

  // Intermediate Genre Satellite Hubs
  nodes.push({
    id: 'genre_drama',
    label: 'Drama',
    type: 'genre',
    x: -40, y: 160, z: 0,
    size: 18,
    properties: [{ label: 'Genre Name', value: 'Drama' }, { label: 'Reach', value: '400.0k' }],
  });
  nodes.push({
    id: 'genre_fantasy',
    label: 'Fantasy',
    type: 'genre',
    x: -40, y: -160, z: 0,
    size: 18,
    properties: [{ label: 'Genre Name', value: 'Fantasy' }, { label: 'Reach', value: '520.0k' }],
  });

  edges.push({ from: 'series_got_core', to: 'genre_drama', rel: 'hasGenre', weight: '1.0' });
  edges.push({ from: 'series_got_core', to: 'genre_fantasy', rel: 'hasGenre', weight: '1.0' });

  // Inner Shell: 20 Samba Households (Radius 240)
  const hhCount = 20;
  const hhPts = fibSphere(hhCount, 240);

  for (let i = 0; i < hhCount; i++) {
    const hhId = `hh_got_${i}`;
    const [hx, hy, hz] = hhPts[i];
    const sambaId = HH_IDS[i % HH_IDS.length];

    nodes.push({
      id: hhId,
      label: sambaId,
      type: 'household',
      x: hx, y: hy, z: hz,
      size: 11,
      properties: [
        { label: 'Household ID', value: sambaId },
        { label: 'Series Affinity', value: 'Game of Thrones (0.93)' },
      ],
      devicesSummary: { sambaTv: 1, apple: 2, android: 1, cookieOrIp: 1, total: 5 },
      campaignsCount: 8,
    });

    edges.push({
      from: i % 2 === 0 ? 'genre_drama' : 'genre_fantasy',
      to: hhId,
      rel: 'affinity',
      weight: (0.92 - (i % 5) * 0.03).toFixed(2),
      hidden: i >= 8,
    });
  }

  // Mid Shell: 20 Experian Married Records (Radius 350)
  const expCount = 20;
  const expPts = fibSphere(expCount, 350, 0.4);

  for (let i = 0; i < expCount; i++) {
    const expId = `exp_got_${i}`;
    const [ex, ey, ez] = expPts[i];

    nodes.push({
      id: expId,
      label: `Experian Married ${i + 1}`,
      type: 'experian_household',
      x: ex, y: ey, z: ez,
      size: 10,
      properties: [
        { label: 'State of Residence', value: 'New York' },
        { label: 'Marital Status', value: 'Married', isNote: true },
        { label: 'Schema Status', value: 'Illustrative field (not yet finalized in production ontology)', isNote: true },
      ],
    });

    const targetHH = `hh_got_${i % hhCount}`;
    edges.push({ from: targetHH, to: expId, rel: 'experianProfile', weight: '0.96', hidden: i >= 8 });
    edges.push({ from: expId, to: 'state_ny_married_core', rel: 'stateOfResidence', weight: '1.0', hidden: i >= 8 });
  }

  // Outer Shell: 16 Connected Devices (Radius 440)
  const devPts = fibSphere(16, 440, 0.8);
  for (let di = 0; di < 16; di++) {
    const devId = `dev_got_${di}`;
    const [dx, dy, dz] = devPts[di];

    nodes.push({
      id: devId,
      label: `Samba Smart TV GoT-${di + 1}`,
      type: 'device',
      subType: 'samba_tv',
      x: dx, y: dy, z: dz,
      size: 9,
      properties: [
        { label: 'Device ID', value: `dev_got_${di * 14 + 501}` },
        { label: 'Location', value: 'New York Metro Area' },
      ],
    });

    const targetHH = `hh_got_${di % hhCount}`;
    edges.push({ from: targetHH, to: devId, rel: 'hasDevice', weight: '0.91', hidden: di >= 6 });
  }

  return {
    query: 'People who like Game of Thrones, living in New York, who are married',
    title: 'Series Affinity, Geo & Demographic Profile',
    description: '3D constellation of Game of Thrones viewers in New York with Experian marital status attributes.',
    nodes,
    edges,
    sparqlQuery: `PREFIX samba: <http://samba.tv/ontology/graph#>
PREFIX show: <http://samba.tv/data/Show#>
PREFIX experian: <http://samba.tv/data/Experian#>

# NOTE: experian:maritalStatus is an illustrative review example field
# and not yet part of the finalized production ontology.
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
    // Single genre: direct household affinity
    return buildExample5_ComedySports(detectedGenre.name, 'Sports');
  }

  if (detectedTopic && !detectedGenre) {
    // Single topic: household -> individual -> topic
    return buildExample5_ComedySports('Comedy', detectedTopic.name);
  }

  // Default rich scene: Comedy & Sports
  return buildExample5_ComedySports('Comedy', 'Sports');
}
