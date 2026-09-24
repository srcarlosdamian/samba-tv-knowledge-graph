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
function fibSphere(n: number, radius: number): [number, number, number][] {
  const pts: [number, number, number][] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / Math.max(1, n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    pts.push([Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius]);
  }
  return pts;
}

const HH_IDS = [
  '6e382a05b1af1d9b','2a3c85ba5b7588ad','3875d60a53a61971','3755283108548888',
  'e00a493c8c98f734','770a764a077729db','6a48bc3421e45de6','4801141778832035',
  '8612846182973880','f95a680f0ed7e4e4','c54ccbf5624389ca','e9543400f413ac09',
  'e8bbb6fa0afd5cb6','dc33e75c07031ad0','a6aa69cc9ce634e8','4569387219552335'
];

const IND_IDS = [
  '64aa10689b7507ec','cebcdbf756ee10b4','db3caa36ef541f49','500df0e75055093c',
  '471cef7a96ef3f2b','804e64b1934d720d','ec988ef278528424','dc33e75c07031ad1'
];

// ─────────────────────────────────────────────────────────────────────────────
// 1. Example 1: Households with Samba TV and > 3 devices (Star shaped clusters)
// ─────────────────────────────────────────────────────────────────────────────
function buildExample1_Devices(): GraphDataset {
  const nodes: Node3DData[] = [];
  const edges: Edge3DData[] = [];
  const hhCount = 4;
  const spherePts = fibSphere(hhCount, 180);

  for (let i = 0; i < hhCount; i++) {
    const hhId = `hh_${i}`;
    const [hx, hy, hz] = spherePts[i];
    const sambaId = HH_IDS[i % HH_IDS.length];

    nodes.push({
      id: hhId,
      label: sambaId,
      type: 'household',
      x: hx, y: hy, z: hz,
      size: 14,
      properties: [
        { label: 'Household ID', value: sambaId },
        { label: 'Country', value: 'US' },
        { label: 'Status', value: 'Active Match' },
        { label: 'Graph Sample', value: 'Guaranteed 4 Device Categories' },
      ],
      devicesSummary: { sambaTv: 1, apple: 2, android: 1, cookieOrIp: 3, total: 7 },
      campaignsCount: 4 + (i * 3),
    });

    // Sub-devices in a star shape around each household
    const devTypes: { cat: DeviceCategory; label: string; count: number; name: string }[] = [
      { cat: 'samba_tv', label: `SambaTV-${i + 1}`, count: 1, name: 'Samba TV 65"' },
      { cat: 'apple', label: `Apple-Mac-${i + 1}`, count: 1, name: 'Apple MacBook Pro' },
      { cat: 'apple', label: `Apple-iPhone-${i + 1}`, count: 1, name: 'Apple iPhone 15' },
      { cat: 'android', label: `Android-Phone-${i + 1}`, count: 1, name: 'Samsung Galaxy S24' },
      { cat: 'cookie_or_ip', label: `Cookie-${i + 1}a`, count: 1, name: 'Cookie / Sync ID' },
      { cat: 'cookie_or_ip', label: `Cookie-${i + 1}b`, count: 1, name: 'IP Bridge Match' },
      { cat: 'cookie_or_ip', label: `Cookie-${i + 1}c`, count: 1, name: 'DEX Household Cookie' },
    ];

    const offsetRadius = 90;
    devTypes.forEach((d, di) => {
      const devId = `${hhId}_dev_${di}`;
      const angle = (di / devTypes.length) * Math.PI * 2;
      const dx = hx + Math.cos(angle) * offsetRadius;
      const dy = hy + Math.sin(angle) * offsetRadius;
      const dz = hz + (di % 2 === 0 ? 35 : -35);

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
              { label: 'Cookie Identifier', value: `ck_${sambaId.slice(0, 8)}_${di}` },
              { label: 'Simulated IP', value: `192.168.1.${40 + di * 12 + i}` },
              { label: 'Sync Status', value: 'Valid IP Bridge' },
            ]
          : [
              { label: 'Device ID', value: `dev_${sambaId.slice(0, 6)}_${d.cat}_${di}` },
              { label: 'Device Model', value: d.name },
              { label: 'Match Key Type', value: d.cat === 'samba_tv' ? 'DEX_ID' : 'IP_MATCH' },
              { label: 'Last Active', value: '1 hour ago' },
            ],
      });

      // Sampled visibility: initially draw 3 edges per HH; remainder are hidden until click!
      const isInitialSample = di < 3;
      edges.push({
        id: `e_${hhId}_${devId}`,
        from: hhId,
        to: devId,
        rel: isCookie ? 'hasCookie' : 'hasDevice',
        weight: (0.95 - di * 0.08).toFixed(2),
        hidden: !isInitialSample,
      });
    });
  }

  // Cross links between some households
  edges.push({ from: 'hh_0', to: 'hh_1', rel: 'coLocated', weight: '0.65', hidden: false });
  edges.push({ from: 'hh_2', to: 'hh_3', rel: 'neighborhood', weight: '0.58', hidden: false });

  return {
    query: 'Households with Samba TV and more than 3 devices',
    title: 'Samba TV Multi-Device Household Cluster',
    description: 'Households verified with active Samba TV units and >= 3 connected mobile/desktop/cookie endpoints.',
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
// 2. Example 2: Households in Texas (State Hub -> Experian HH -> Household)
// ─────────────────────────────────────────────────────────────────────────────
function buildExample2_Texas(): GraphDataset {
  const nodes: Node3DData[] = [];
  const edges: Edge3DData[] = [];

  // Central State node
  nodes.push({
    id: 'state_tx',
    label: 'Texas',
    type: 'state',
    x: 0, y: 0, z: 0,
    size: 26,
    properties: [
      { label: 'State Name', value: 'Texas' },
      { label: 'State Code', value: 'TX' },
      { label: 'Country', value: 'United States' },
      { label: 'Total Samba Reach', value: '2.85M Households' },
    ],
  });

  const count = 12;
  const expPts = fibSphere(count, 170);
  const hhPts = fibSphere(count, 310);

  for (let i = 0; i < count; i++) {
    const expId = `exp_tx_${i}`;
    const hhId = `hh_tx_${i}`;
    const sambaId = HH_IDS[i % HH_IDS.length];

    nodes.push({
      id: expId,
      label: `Experian HH ${i + 1}`,
      type: 'experian_household',
      x: expPts[i][0], y: expPts[i][1], z: expPts[i][2],
      size: 11,
      properties: [
        { label: 'Experian ID', value: `EXP-TX-${1000 + i}` },
        { label: 'State of Residence', value: 'Texas' },
        { label: 'Match Confidence', value: '98.4%' },
      ],
    });

    nodes.push({
      id: hhId,
      label: sambaId,
      type: 'household',
      x: hhPts[i][0], y: hhPts[i][1], z: hhPts[i][2],
      size: 12,
      properties: [
        { label: 'Household ID', value: sambaId },
        { label: 'DMA', value: i % 2 === 0 ? 'Dallas-Ft. Worth' : 'Houston' },
        { label: 'Matched State', value: 'Texas' },
      ],
      devicesSummary: { sambaTv: 1, apple: 1, android: 2, cookieOrIp: 1, total: 5 },
      campaignsCount: 6 + (i % 5),
    });

    // State -> Experian edge (first 6 drawn, rest hidden until State is clicked)
    edges.push({
      from: 'state_tx',
      to: expId,
      rel: 'stateOfResidence',
      weight: '1.00',
      hidden: i >= 6,
    });

    // Experian -> Household edge
    edges.push({
      from: expId,
      to: hhId,
      rel: 'linkedHousehold',
      weight: '0.94',
      hidden: i >= 6,
    });
  }

  return {
    query: 'Households in Texas',
    title: 'Geographic Audience Hub: Texas',
    description: 'Households in Texas connected via intermediate Experian identity resolution nodes.',
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

  nodes.push({
    id: 'income_75k',
    label: '>$75k Income',
    type: 'income_bracket',
    x: 0, y: 0, z: 0,
    size: 26,
    properties: [
      { label: 'Income Bracket', value: '>$75,000 / year' },
      { label: 'Median HH Income', value: '$94,200' },
      { label: 'Index vs National', value: '138' },
      { label: 'Demographic Source', value: 'Experian Mosaic' },
    ],
  });

  const count = 10;
  const expPts = fibSphere(count, 160);
  const hhPts = fibSphere(count, 300);

  for (let i = 0; i < count; i++) {
    const expId = `exp_inc_${i}`;
    const hhId = `hh_inc_${i}`;
    const sambaId = HH_IDS[i % HH_IDS.length];

    nodes.push({
      id: expId,
      label: `Experian HH ${i + 1}`,
      type: 'experian_household',
      x: expPts[i][0], y: expPts[i][1], z: expPts[i][2],
      size: 11,
      properties: [
        { label: 'Experian ID', value: `EXP-INC-${2000 + i}` },
        { label: 'Reported Income', value: '$85k - $125k' },
        { label: 'Income Confidence', value: 'High (0.92)' },
      ],
    });

    nodes.push({
      id: hhId,
      label: sambaId,
      type: 'household',
      x: hhPts[i][0], y: hhPts[i][1], z: hhPts[i][2],
      size: 12,
      properties: [
        { label: 'Household ID', value: sambaId },
        { label: 'Affluence Index', value: '142' },
      ],
      devicesSummary: { sambaTv: 1, apple: 3, android: 1, cookieOrIp: 2, total: 7 },
      campaignsCount: 9,
    });

    edges.push({ from: 'income_75k', to: expId, rel: 'incomeBracket', weight: '0.90', hidden: i >= 5 });
    edges.push({ from: expId, to: hhId, rel: 'matchedHousehold', weight: '0.92', hidden: i >= 5 });
  }

  return {
    query: 'Households with income over $75k',
    title: 'High Income Audience Resolution',
    description: 'Households linked through Experian demographic income attribute hubs.',
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

  // Series Hub
  nodes.push({
    id: 'series_friends',
    label: 'Friends',
    type: 'series',
    x: -180, y: 0, z: 0,
    size: 24,
    properties: [
      { label: 'Series Title', value: 'Friends' },
      { label: 'Network', value: 'NBC / Warner Bros' },
      { label: 'Primary Genres', value: 'Comedy, Sitcom' },
      { label: 'Catalog ID', value: 'SHOW-FRND-1994' },
    ],
  });

  // 2 Genre nodes
  nodes.push({
    id: 'genre_comedy',
    label: 'Comedy',
    type: 'genre',
    x: -60, y: 120, z: 0,
    size: 18,
    properties: [
      { label: 'Genre Name', value: 'Comedy' },
      { label: 'Affinity Type', value: 'TV Viewing Behavior' },
      { label: 'Total Reach', value: '580.0k Households' },
    ],
  });
  nodes.push({
    id: 'genre_sitcom',
    label: 'Sitcom',
    type: 'genre',
    x: -60, y: -120, z: 0,
    size: 18,
    properties: [
      { label: 'Genre Name', value: 'Sitcom' },
      { label: 'Affinity Type', value: 'TV Viewing Behavior' },
      { label: 'Total Reach', value: '450.0k Households' },
    ],
  });

  edges.push({ from: 'series_friends', to: 'genre_comedy', rel: 'hasGenre', weight: '1.0' });
  edges.push({ from: 'series_friends', to: 'genre_sitcom', rel: 'hasGenre', weight: '1.0' });

  // State Node: New York
  nodes.push({
    id: 'state_ny',
    label: 'New York',
    type: 'state',
    x: 220, y: 0, z: 0,
    size: 22,
    properties: [
      { label: 'State Name', value: 'New York' },
      { label: 'State Code', value: 'NY' },
    ],
  });

  const count = 8;
  const spherePts = fibSphere(count, 220);

  for (let i = 0; i < count; i++) {
    const hhId = `hh_frny_${i}`;
    const expId = `exp_ny_${i}`;
    const sambaId = HH_IDS[i % HH_IDS.length];

    nodes.push({
      id: hhId,
      label: sambaId,
      type: 'household',
      x: 80 + spherePts[i][0] * 0.5,
      y: spherePts[i][1],
      z: spherePts[i][2],
      size: 11,
      properties: [
        { label: 'Household ID', value: sambaId },
        { label: 'Series Affinity', value: 'Friends (0.88)' },
        { label: 'Location', value: 'New York, NY' },
      ],
      devicesSummary: { sambaTv: 1, apple: 2, android: 1, cookieOrIp: 2, total: 6 },
      campaignsCount: 5 + i,
    });

    nodes.push({
      id: expId,
      label: `Experian NY ${i + 1}`,
      type: 'experian_household',
      x: 160 + spherePts[i][0] * 0.3,
      y: spherePts[i][1] * 0.7,
      z: spherePts[i][2] * 0.7,
      size: 9,
      properties: [
        { label: 'Experian ID', value: `EXP-NY-${300 + i}` },
        { label: 'State of Residence', value: 'New York' },
      ],
    });

    // Connections to genres & experian
    edges.push({ from: i % 2 === 0 ? 'genre_comedy' : 'genre_sitcom', to: hhId, rel: 'affinity', weight: (0.85 - i * 0.03).toFixed(2) });
    edges.push({ from: hhId, to: expId, rel: 'identityMatch', weight: '0.94' });
    edges.push({ from: expId, to: 'state_ny', rel: 'stateOfResidence', weight: '1.0' });
  }

  return {
    query: 'People in New York who like Friends',
    title: 'Series Affinity & Geo Filter: Friends (NY)',
    description: 'Viewers of Friends in New York mapped through genres and Experian residence records.',
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
// 5. Example 5: Comedy & Sports (Genre + Topic Hubs with Individuals)
// ─────────────────────────────────────────────────────────────────────────────
function buildExample5_ComedySports(genreName = 'Comedy', topicName = 'Sports'): GraphDataset {
  const nodes: Node3DData[] = [];
  const edges: Edge3DData[] = [];

  nodes.push({
    id: 'sports',
    label: topicName,
    type: 'topic',
    x: -160, y: 0, z: 0,
    size: 24,
    properties: [
      { label: 'Topic Name', value: topicName },
      { label: 'Affinity Type', value: 'Individual Reading & Behavior' },
      { label: 'Attached Entity', value: 'Individual Person' },
      { label: 'Reach', value: '520.0k Individuals' },
    ],
  });

  nodes.push({
    id: 'comedy',
    label: genreName,
    type: 'genre',
    x: 160, y: 0, z: 0,
    size: 22,
    properties: [
      { label: 'Genre Name', value: genreName },
      { label: 'Affinity Type', value: 'Household Content Affinity' },
      { label: 'Attached Entity', value: 'Household Unit' },
      { label: 'Reach', value: '580.0k Households' },
    ],
  });

  edges.push({ from: 'sports', to: 'comedy', weight: '0.81', rel: 'crossAffinity' });

  const spherePts = fibSphere(24, 300);
  const hhCount = 14;
  const indCount = 10;

  for (let i = 0; i < hhCount; i++) {
    const hhId = `hh_${i}`;
    const [x, y, z] = spherePts[i];
    const sambaId = HH_IDS[i % HH_IDS.length];

    nodes.push({
      id: hhId,
      label: sambaId,
      type: 'household',
      x, y, z,
      size: 10,
      properties: [
        { label: 'Household ID', value: sambaId },
        { label: 'Genre Affinity', value: `${genreName} (0.84)` },
      ],
      devicesSummary: { sambaTv: 1, apple: 2, android: 1, cookieOrIp: 2, total: 6 },
      campaignsCount: 4 + i,
    });

    edges.push({ from: 'comedy', to: hhId, rel: 'hasAffinity', weight: (0.92 - i * 0.04).toFixed(2), hidden: i >= 7 });
  }

  for (let i = 0; i < indCount; i++) {
    const indId = `ind_${i}`;
    const [x, y, z] = spherePts[hhCount + i];
    const personId = IND_IDS[i % IND_IDS.length];

    nodes.push({
      id: indId,
      label: personId,
      type: 'individual',
      x, y, z,
      size: 10,
      properties: [
        { label: 'Individual ID', value: personId },
        { label: 'Topic Affinity', value: `${topicName} (0.89)` },
        { label: 'Role', value: 'Household Viewer' },
      ],
    });

    edges.push({ from: 'sports', to: indId, rel: 'individualAffinity', weight: (0.90 - i * 0.04).toFixed(2), hidden: i >= 5 });

    // Link individual to corresponding household
    const targetHH = `hh_${i % hhCount}`;
    edges.push({ from: targetHH, to: indId, rel: 'hasIndividual', weight: '0.95' });
  }

  return {
    query: `Households that like ${genreName} and read about ${topicName}`,
    title: `${genreName} & ${topicName} Affinity Resolution`,
    description: `Demonstrating Household ${genreName} affinity + Individual ${topicName} topic affinity.`,
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
// 6. Example 6: Game of Thrones, NY, Married (with illustrative schema note)
// ─────────────────────────────────────────────────────────────────────────────
function buildExample6_GoTMarried(): GraphDataset {
  const nodes: Node3DData[] = [];
  const edges: Edge3DData[] = [];

  nodes.push({
    id: 'series_got',
    label: 'Game of Thrones',
    type: 'series',
    x: -200, y: 0, z: 0,
    size: 25,
    properties: [
      { label: 'Series Title', value: 'Game of Thrones' },
      { label: 'Network', value: 'HBO' },
      { label: 'Genres', value: 'Drama, Fantasy' },
    ],
  });

  nodes.push({
    id: 'genre_drama',
    label: 'Drama',
    type: 'genre',
    x: -80, y: 110, z: 0,
    size: 18,
    properties: [{ label: 'Genre Name', value: 'Drama' }, { label: 'Reach', value: '400.0k' }],
  });
  nodes.push({
    id: 'genre_fantasy',
    label: 'Fantasy',
    type: 'genre',
    x: -80, y: -110, z: 0,
    size: 18,
    properties: [{ label: 'Genre Name', value: 'Fantasy' }, { label: 'Reach', value: '520.0k' }],
  });

  edges.push({ from: 'series_got', to: 'genre_drama', rel: 'hasGenre', weight: '1.0' });
  edges.push({ from: 'series_got', to: 'genre_fantasy', rel: 'hasGenre', weight: '1.0' });

  nodes.push({
    id: 'state_ny',
    label: 'New York',
    type: 'state',
    x: 220, y: 0, z: 0,
    size: 22,
    properties: [{ label: 'State Name', value: 'New York' }, { label: 'State Code', value: 'NY' }],
  });

  const count = 7;
  const pts = fibSphere(count, 220);

  for (let i = 0; i < count; i++) {
    const hhId = `hh_got_${i}`;
    const expId = `exp_got_${i}`;
    const sambaId = HH_IDS[i % HH_IDS.length];

    nodes.push({
      id: hhId,
      label: sambaId,
      type: 'household',
      x: 70 + pts[i][0] * 0.5,
      y: pts[i][1],
      z: pts[i][2],
      size: 11,
      properties: [
        { label: 'Household ID', value: sambaId },
        { label: 'Series Affinity', value: 'Game of Thrones (0.93)' },
      ],
      devicesSummary: { sambaTv: 1, apple: 2, android: 1, cookieOrIp: 1, total: 5 },
      campaignsCount: 8,
    });

    nodes.push({
      id: expId,
      label: `Experian Married ${i + 1}`,
      type: 'experian_household',
      x: 150 + pts[i][0] * 0.3,
      y: pts[i][1] * 0.7,
      z: pts[i][2] * 0.7,
      size: 9,
      properties: [
        { label: 'State of Residence', value: 'New York' },
        { label: 'Marital Status', value: 'Married', isNote: true },
        { label: 'Schema Status', value: 'Illustrative field (not yet finalized in production ontology)', isNote: true },
      ],
    });

    edges.push({ from: i % 2 === 0 ? 'genre_drama' : 'genre_fantasy', to: hhId, rel: 'affinity', weight: (0.91 - i * 0.03).toFixed(2) });
    edges.push({ from: hhId, to: expId, rel: 'experianProfile', weight: '0.96' });
    edges.push({ from: expId, to: 'state_ny', rel: 'stateOfResidence', weight: '1.0' });
  }

  return {
    query: 'People who like Game of Thrones, living in New York, who are married',
    title: 'Series Affinity, Geo & Demographic Profile',
    description: 'Game of Thrones viewers in New York with Experian marital status attributes.',
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
