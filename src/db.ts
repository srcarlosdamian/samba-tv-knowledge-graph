export type Genre = { id: number; name: string; count: string };
export type Topic = { id: number; name: string; count: string };
export type GraphNode = { id: string; x: number; y: number; type: 'genre' | 'topic' | 'household' | 'individual' | 'affinity'; label?: string; size?: number };
export type GraphEdge = { from: string; to: string };
export type TableRow = { household: string; sambaId: string; genreScore: string; topicScore: string };

export const genres: Genre[] = [
  { id: 1, name: 'Documentary', count: '600.0k' },
  { id: 2, name: 'Crime Drama', count: '600.0k' },
  { id: 3, name: 'Talk Show', count: '600.0k' },
  { id: 4, name: 'Reality', count: '600.0k' },
  { id: 5, name: 'Dreams', count: '600.0k' },
  { id: 6, name: 'Virtuality', count: '600.0k' },
  { id: 7, name: 'Anime', count: '600.0k' },
  { id: 8, name: 'Romance', count: '600.0k' },
  { id: 9, name: 'Drama', count: '400.0k' },
  { id: 10, name: 'Awards Shows', count: '500.0k' },
  { id: 11, name: 'Travel', count: '400.0k' },
  { id: 12, name: 'Political Drama', count: '650.0k' },
  { id: 13, name: 'Comedy', count: '580.0k' },
  { id: 14, name: 'Sports', count: '520.0k' },
  { id: 15, name: 'Science', count: '480.0k' },
  { id: 16, name: 'Biography', count: '460.0k' },
  { id: 17, name: 'News', count: '440.0k' },
  { id: 18, name: 'True Crime', count: '420.0k' },
  { id: 19, name: 'Sports Analysis', count: '380.0k' },
  { id: 20, name: 'Nature & Wildlife', count: '360.0k' },
];

export const topics: Topic[] = [
  { id: 1, name: 'News & Politics', count: '750.0k' },
  { id: 2, name: 'Technology', count: '620.0k' },
  { id: 3, name: 'Health & Fitness', count: '580.0k' },
  { id: 4, name: 'Food & Cooking', count: '530.0k' },
  { id: 5, name: 'Travel & Adventure', count: '490.0k' },
  { id: 6, name: 'Personal Finance', count: '460.0k' },
  { id: 7, name: 'Gaming', count: '440.0k' },
  { id: 8, name: 'Fashion & Style', count: '420.0k' },
  { id: 9, name: 'Arts & Culture', count: '400.0k' },
  { id: 10, name: 'Science & Education', count: '380.0k' },
];

export const graphNodes: GraphNode[] = [
  { id: 'sports', x: 320, y: 360, type: 'topic', label: 'Sports', size: 18 },
  { id: 'comedy', x: 660, y: 300, type: 'genre', label: 'Comedy', size: 16 },
  { id: 'h1', x: 120, y: 180, type: 'household', size: 7 },
  { id: 'h2', x: 200, y: 140, type: 'household', size: 7 },
  { id: 'h3', x: 80, y: 280, type: 'household', size: 7 },
  { id: 'h4', x: 160, y: 420, type: 'household', size: 7 },
  { id: 'h5', x: 100, y: 500, type: 'household', size: 7 },
  { id: 'h6', x: 220, y: 550, type: 'household', size: 7 },
  { id: 'h7', x: 380, y: 520, type: 'household', size: 7 },
  { id: 'h8', x: 450, y: 470, type: 'household', size: 7 },
  { id: 'h9', x: 500, y: 400, type: 'household', size: 7 },
  { id: 'h10', x: 520, y: 280, type: 'household', size: 7 },
  { id: 'h11', x: 460, y: 200, type: 'household', size: 7 },
  { id: 'h12', x: 350, y: 160, type: 'household', size: 7 },
  { id: 'h13', x: 260, y: 200, type: 'household', size: 7 },
  { id: 'i1', x: 580, y: 160, type: 'individual', size: 7 },
  { id: 'i2', x: 700, y: 140, type: 'individual', size: 7 },
  { id: 'i3', x: 780, y: 220, type: 'individual', size: 7 },
  { id: 'i4', x: 820, y: 320, type: 'individual', size: 7 },
  { id: 'i5', x: 800, y: 420, type: 'individual', size: 7 },
  { id: 'i6', x: 740, y: 480, type: 'individual', size: 7 },
  { id: 'i7', x: 640, y: 500, type: 'individual', size: 7 },
  { id: 'i8', x: 560, y: 540, type: 'individual', size: 7 },
  { id: 'g1', x: 900, y: 280, type: 'genre', size: 7 },
  { id: 'g2', x: 920, y: 380, type: 'genre', size: 7 },
  { id: 'g3', x: 860, y: 460, type: 'genre', size: 7 },
];

export const graphEdges: GraphEdge[] = [
  ...['h1','h2','h3','h4','h5','h6','h7','h8','h9','h10','h11','h12','h13'].map(id => ({ from: 'sports', to: id })),
  ...['i1','i2','i3','i4','i5','i6','i7','i8'].map(id => ({ from: 'comedy', to: id })),
  ...['g1','g2','g3'].map(id => ({ from: 'comedy', to: id })),
  { from: 'sports', to: 'h9' },
  { from: 'comedy', to: 'h9' },
];

export const tableRows: TableRow[] = Array.from({ length: 10 }, (_, i) => ({
  household: `samba.tv/34003493403040${340 + i}`,
  sambaId: ['e8bbb6fa0afd5cb6','b9ccc7fa0cfe6dcb7','c1ddd8fafe0f7ece8','d2eee9fa2f2f7fdf9','e3ff0efa3g3230f0a','f4gg1bfa4h4341g1b','g5hh2cfa5i5452h2c','h6ii3dfa6j6563i3d','h6ii3dfa6j6563i3d','h6ii3dfa6j6563i3d'][i],
  genreScore: (1.0 + i * 0.1).toFixed(1),
  topicScore: '1.0',
}));

export const audienceData = {
  households: '125.4k',
  population: '326k',
  alsoInterestedIn: [
    { name: 'Talk Show', index: '3.3×', count: '23.6k', type: 'genre' },
    { name: 'Reality', index: '2.8×', count: '57.4k', type: 'genre' },
    { name: 'Biography', index: '2.6×', count: '14.8k', type: 'topic' },
    { name: 'Science', index: '2.6×', count: '30.1k', type: 'genre' },
    { name: 'Sports Analysis', index: '2.1×', count: '25.8k', type: 'genre' },
    { name: 'True Crime', index: '2.1×', count: '11.2k', type: 'topic' },
    { name: 'News', index: '2.0×', count: '11.2k', type: 'genre' },
    { name: 'Nature & Wildlife', index: '1.9×', count: '33k', type: 'topic' },
  ],
  topStates: [
    { name: 'Maine', index: '1.50×' },
    { name: 'Florida', index: '1.49×' },
    { name: 'Kentucky', index: '1.48×' },
    { name: 'Alabama', index: '1.47×' },
    { name: 'Mississippi', index: '1.44×' },
  ],
  ageBands: [12, 18, 22, 28, 35, 30, 25, 20, 14, 9, 6, 4],
  ageBandLabels: ['18-20','21-24','25-34','35-44','40-44','45-49','50-54','55-59','60-64','65-74','75+'],
  incomes: [8, 14, 22, 30, 35, 28, 22, 18, 12, 8, 5],
  race: [
    { label: 'White', value: '39.9k', pct: 0.62 },
    { label: 'Black', value: '6.9k', pct: 0.11 },
    { label: 'Hispanic', value: '11.7k', pct: 0.18 },
    { label: 'Asian', value: '5.1k', pct: 0.08 },
    { label: 'Other', value: '1.8k', pct: 0.03 },
  ],
  householdMakeup: {
    size: '2.6', adults: '2.1', children: '0.5',
    male: '158k', female: '168k', malePct: 0.48, femalePct: 0.52,
  },
};
