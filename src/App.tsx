import { useState, useRef, useEffect, createContext, useContext } from 'react';
import {
  Network, Sun, Moon, ChevronDown, ArrowRight, Plus,
  Trash2, Search, X, Copy, ChevronUp, ChevronLeft, ChevronRight,
  Download, Sliders, ZoomIn, ZoomOut, Move
} from 'lucide-react';
import {
  genres, topics, tableRows, audienceData,
  type Genre, type Topic
} from './db';
import Graph3D, { DEFAULT_GRAPH_CONFIG, type GraphConfig, type NodeType, type Graph3DHandle, type Node3D } from './Graph3D';

type View = 'home' | 'graph' | 'audience';
type GraphTab = 'graph' | 'table';
type Theme = 'dark' | 'light';

// ─── Theme context ────────────────────────────────────────────────────────────
const ThemeCtx = createContext<Theme>('dark');
const useTheme = () => useContext(ThemeCtx);

// Sidebar icons are always white (sidebar bg is always dark)
const ICON_W  = 'rgba(255,255,255,0.9)';
const ICON_DIM = 'rgba(255,255,255,0.65)';

// ─── Tooltip (fixed, never clipped) ──────────────────────────────────────────
function SidebarTooltip({ label, anchorRect }: { label: string; anchorRect: DOMRect }) {
  return (
    <div style={{
      position: 'fixed',
      top: anchorRect.top + anchorRect.height / 2,
      left: anchorRect.right + 8,
      transform: 'translateY(-50%)',
      zIndex: 9999, pointerEvents: 'none',
      backgroundColor: '#d9d9d9', color: '#1a1a1a',
      padding: '2px 8px', borderRadius: 4,
      fontSize: 14, lineHeight: '20px', fontFamily: "'Season Sans', 'Inter', sans-serif",
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%)',
        width: 0, height: 0,
        borderTop: '4px solid transparent', borderBottom: '4px solid transparent',
        borderRight: '6px solid #d9d9d9',
      }} />
      {label}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ view, setView, theme, toggleTheme, showGraphEditor, onToggleEditor }: {
  view: View; setView: (v: View) => void;
  theme: Theme; toggleTheme: () => void;
  showGraphEditor: boolean; onToggleEditor: () => void;
}) {
  const [tooltip, setTooltip] = useState<{ label: string; rect: DOMRect } | null>(null);

  function NavItem({ icon, label, active, onClick }: {
    icon: React.ReactNode; label: string; active: boolean; onClick: () => void;
  }) {
    const btnRef = useRef<HTMLButtonElement>(null);
    return (
      <div className="relative w-full">
        <button
          ref={btnRef}
          onClick={onClick}
          onMouseEnter={() => { if (btnRef.current) setTooltip({ label, rect: btnRef.current.getBoundingClientRect() }); }}
          onMouseLeave={() => setTooltip(null)}
          className="flex items-center justify-center w-full py-1.5 rounded-lg transition-colors"
          style={{ backgroundColor: active ? 'var(--bg-btn-active)' : 'transparent' }}
        >
          {icon}
        </button>
      </div>
    );
  }

  return (
    <>
      {tooltip && <SidebarTooltip label={tooltip.label} anchorRect={tooltip.rect} />}
      <div
        className="flex flex-col items-center justify-between shrink-0"
        style={{ backgroundColor: '#0f0f0f', width: 56, minHeight: '100vh', padding: '24px 12px' }}
      >
        {/* Top */}
        <div className="flex flex-col gap-6 items-center w-full">
          <button onClick={() => setView('graph')} className="flex items-center justify-center" style={{ width: 24, height: 20 }}>
            <img alt="logo" src="/assets/05855.svg" style={{ width: 24, height: 20, display: 'block' }} />
          </button>
          <div className="flex flex-col gap-4 items-center w-full">
            <NavItem
              key="graph"
              icon={<img src="/assets/9c176.svg" alt="" style={{ width: 20, height: 20, filter: 'brightness(0) invert(1)', opacity: view === 'graph' ? 0.9 : 0.55 }} />}
              label="Ask a question"
              active={view === 'graph'}
              onClick={() => setView('graph')}
            />
            <NavItem
              key="audience"
              icon={<img src="/assets/51833.svg" alt="" style={{ width: 20, height: 20, filter: 'brightness(0) invert(1)', opacity: view === 'audience' ? 0.9 : 0.55 }} />}
              label="Audience"
              active={view === 'audience'}
              onClick={() => setView('audience')}
            />
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-3 items-center">
          {/* Graph editor toggle */}
          <button
            onClick={onToggleEditor}
            title="Graph editor"
            className="flex items-center justify-center rounded-lg transition-colors"
            style={{ width: 32, height: 32, backgroundColor: showGraphEditor ? 'rgba(103,129,168,0.25)' : 'transparent' }}
          >
            <Sliders size={18} strokeWidth={1.5} color={showGraphEditor ? ICON_W : ICON_DIM} />
          </button>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex items-center justify-center rounded-lg transition-colors"
            style={{ width: 32, height: 32, backgroundColor: theme === 'light' ? 'var(--bg-btn)' : 'transparent' }}
          >
            {theme === 'dark'
              ? <Sun size={18} strokeWidth={1.5} color={ICON_DIM} />
              : <Moon size={18} strokeWidth={1.5} color={ICON_W} />
            }
          </button>
          {/* Avatar */}
          <div className="relative">
            <div className="flex items-center justify-center rounded-full text-white text-xs font-medium"
              style={{ width: 28, height: 28, backgroundColor: '#4a5568', fontSize: 11, fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 500 }}>
              TA
            </div>
            <div className="absolute rounded-full"
              style={{ width: 8, height: 8, backgroundColor: '#48bb78', bottom: 0, right: 0, border: '1.5px solid #0f0f0f' }} />
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Home View ────────────────────────────────────────────────────────────────
function HomeView({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('');
  const [boxFocused, setBoxFocused] = useState(false);
  const [boxHovered, setBoxHovered] = useState(false);
  const suggestions = [
    'Married people living in New York who like Game of Thrones',
    'Households in Texas',
    'Households that like comedy and read about sports',
    'People in New York who like Friends',
  ];

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-4 relative min-h-screen"
      style={{ backgroundColor: 'var(--bg)', transition: 'background-color 0.2s', overflow: 'hidden' }}>

      {/* Background diagram lines — color adapts to theme via currentColor */}
      <svg
        aria-hidden="true"
        preserveAspectRatio="none"
        overflow="visible"
        viewBox="0 0 1230 681.067"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(1230px, 130%)',
          height: 'auto',
          color: 'var(--border-mid)',
          opacity: 0.7,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <path d="M898.616 9.64929C715.873 9.64931 567.731 157.791 567.731 340.534C567.731 523.276 715.874 671.419 898.616 671.419C1081.36 671.419 1229.5 523.276 1229.5 340.534C1229.5 157.791 1081.36 9.64928 898.616 9.64929Z" stroke="currentColor" strokeMiterlimit="10"/>
        <path d="M340.533 0.5C152.738 0.500016 0.499984 152.738 0.5 340.534C0.500016 528.329 152.738 680.567 340.534 680.567C528.329 680.567 680.567 528.329 680.567 340.533C680.567 152.738 528.329 0.499984 340.533 0.5Z" stroke="currentColor" strokeMiterlimit="10"/>
        <path d="M625.292 154.507C522.342 154.507 438.884 237.965 438.884 340.915C438.884 443.866 522.342 527.324 625.292 527.324C728.243 527.324 811.701 443.866 811.701 340.915C811.701 237.965 728.243 154.507 625.292 154.507Z" stroke="currentColor" strokeMiterlimit="10"/>
      </svg>

      {/* Content sits above the background SVG */}
      <div className="flex flex-col items-center gap-6 w-full" style={{ position: 'relative', zIndex: 1 }}>

      <p className="text-center" style={{
        fontFamily: "'Season Mix', 'Inter', sans-serif", fontWeight: 580, fontSize: 36,
        lineHeight: 'normal', color: 'var(--text)', maxWidth: 450,
      }}>
        What insights do you want to uncover today?
      </p>

      {/* Query block */}
      <div className="flex flex-col justify-between overflow-hidden rounded-lg"
        onMouseEnter={() => setBoxHovered(true)}
        onMouseLeave={() => setBoxHovered(false)}
        style={{
          backgroundColor: 'var(--bg-card)',
          border: (boxFocused || boxHovered) ? '1px solid var(--border-mid)' : '1px solid transparent',
          padding: 16, width: 'min(700px, 100%)', height: 154,
          transition: 'border-color 0.15s',
        }}>
        <textarea
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setBoxFocused(true)}
          onBlur={() => setBoxFocused(false)}
          placeholder="Ask anything about your audience or graph data..."
          className="flex-1 resize-none bg-transparent outline-none w-full"
          style={{
            fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 400, fontSize: 16,
            lineHeight: '24px', color: query ? 'var(--text)' : 'var(--text-ph)', border: 'none',
            backgroundColor: 'transparent',
          }}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && query.trim()) { e.preventDefault(); onSearch(query); } }}
        />
        <div className="flex items-center justify-between mt-2">
          <button className="flex gap-2 items-center justify-center rounded"
            style={{ border: '1px solid var(--border-mid)', height: 32, padding: '0 12px', background: 'transparent' }}>
            <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 14, color: 'var(--text-btn)', lineHeight: '20px' }}>20 objects</span>
            <ChevronDown size={12} strokeWidth={1.5} color="var(--text-dim)" />
          </button>
          <div className="flex gap-3 items-center">
            <button className="flex gap-2 items-center justify-center rounded"
              style={{ border: '1px solid var(--border-mid)', height: 32, padding: '0 12px', background: 'transparent' }}>
              <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 14, color: 'var(--text-btn)', lineHeight: '20px' }}>Haiku (fast)</span>
              <ChevronDown size={12} strokeWidth={1.5} color="var(--text-dim)" />
            </button>
            <button
              disabled={!query.trim()}
              onClick={() => onSearch(query)}
              className="flex items-center justify-center rounded-full transition-all"
              style={{
                backgroundColor: query.trim() ? 'var(--accent)' : 'var(--bg-btn)',
                width: 28, height: 28, border: 'none', cursor: query.trim() ? 'pointer' : 'not-allowed',
              }}>
              <ArrowRight size={14} strokeWidth={1.5} color={query.trim() ? '#fff' : 'var(--text-dim)'} />
            </button>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-3 items-start justify-center" style={{ width: 'min(700px, 100%)' }}>
        {suggestions.map(tag => (
          <button key={tag} onClick={() => setQuery(tag)}
            className="flex gap-2 items-center rounded transition-colors"
            style={{
              border: query === tag ? '1px solid var(--border-mid)' : '1px solid var(--border-tag)',
              height: 32, padding: '0 12px',
              background: query === tag ? 'var(--bg-btn)' : 'var(--bg-tag)',
            }}>
            <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 500, fontSize: 14, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              {tag}
            </span>
          </button>
        ))}
      </div>

      </div>{/* end content z-index wrapper */}
    </div>
  );
}

// ─── Dropdown ─────────────────────────────────────────────────────────────────
const MODELS = [
  { value: 'haiku',  label: 'Haiku (fast)',     desc: 'Respuestas rápidas, menor precisión' },
  { value: 'sonnet', label: 'Sonnet (balanced)', desc: 'Balance velocidad / calidad' },
  { value: 'opus',   label: 'Opus (precise)',    desc: 'Máxima precisión, más lento' },
];
const LIMITS = [
  { value: '10',  label: '10 objects' },
  { value: '20',  label: '20 objects' },
  { value: '50',  label: '50 objects' },
  { value: '100', label: '100 objects' },
  { value: '500', label: '500 objects' },
];

function SelectDropdown({ label, options, value, onChange }: {
  label: string;
  options: { value: string; label: string; desc?: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.value === value) ?? options[0];

  useEffect(() => {
    function onOut(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onOut);
    return () => document.removeEventListener('mousedown', onOut);
  }, []);

  return (
    <div className="flex flex-col gap-2 flex-1 relative" ref={ref}>
      <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 14, color: 'var(--text-muted)' }}>{label}</span>
      <button onClick={() => setOpen(p => !p)}
        className="relative flex items-center rounded"
        style={{
          backgroundColor: 'var(--bg-input)', height: 32, paddingLeft: 10, paddingRight: 28,
          border: open ? '1px solid var(--accent)' : '1px solid var(--border)', textAlign: 'left',
        }}>
        <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 13, color: 'var(--text)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {selected.label}
        </span>
        <ChevronDown size={12} strokeWidth={1.5} color="var(--text-dim)"
          style={{ position: 'absolute', right: 8, transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>
      {open && (
        <div className="absolute z-50 rounded-lg overflow-hidden"
          style={{ top: '100%', left: 0, right: 0, marginTop: 4, backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-mid)', boxShadow: '0 8px 24px var(--shadow)' }}>
          {options.map(opt => (
            <button key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
              className="w-full flex flex-col items-start px-3 py-2 transition-colors"
              style={{ backgroundColor: opt.value === value ? 'var(--bg-btn-active)' : 'transparent', borderBottom: '1px solid var(--border)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-btn)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = opt.value === value ? 'var(--bg-btn-active)' : 'transparent')}>
              <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 13, color: opt.value === value ? 'var(--text)' : 'var(--text-btn)', fontWeight: opt.value === value ? 500 : 400 }}>
                {opt.label}
              </span>
              {opt.desc && <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 11, color: 'var(--text-dim)', marginTop: 1 }}>{opt.desc}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Knowledge Graph Sidebar (floating card) ──────────────────────────────────
function KnowledgeGraphSidebar({ graphTab, setGraphTab, query, setQuery, onRunAnalysis }: {
  graphTab: GraphTab; setGraphTab: (t: GraphTab) => void;
  query: string; setQuery: (q: string) => void;
  onRunAnalysis: () => void;
}) {
  const [techExpanded, setTechExpanded] = useState(false);
  const [model, setModel] = useState('haiku');
  const [limit, setLimit] = useState('20');

  return (
    <div className="flex flex-col gap-[18px] rounded-lg overflow-y-auto shrink-0"
      style={{
        backgroundColor: 'var(--bg-card)',
        width: 290, padding: 12,
        maxHeight: 'calc(100vh - 130px)',
        boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
        position: 'relative', zIndex: 10,
      }}>

      <p style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 500, fontSize: 20, color: 'var(--text)', lineHeight: '1.5' }}>
        Knowledge Graph
      </p>

      {/* Display toggle */}
      <div className="flex flex-col gap-[10px]">
        <div className="flex items-center justify-between">
          <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 14, color: 'var(--text-muted)', lineHeight: '20px' }}>Display</span>
          <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-dim)', lineHeight: '16px' }}>20 nodes</span>
        </div>
        <div className="flex gap-1 rounded p-1" style={{ backgroundColor: 'var(--bg-input)', height: 32 }}>
          {(['graph', 'table'] as GraphTab[]).map(tab => (
            <button key={tab} onClick={() => setGraphTab(tab)}
              className="flex flex-1 items-center justify-center rounded"
              style={{
                backgroundColor: graphTab === tab ? 'rgba(255,255,255,0.04)' : 'transparent',
                color: graphTab === tab ? 'var(--text)' : 'var(--text-dim)',
                fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 14, border: 'none',
              }}>
              {tab === 'graph' ? 'Graph' : 'Results table'}
            </button>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="flex flex-col gap-2">
        <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 14, color: 'var(--text-muted)', lineHeight: '20px' }}>Instructions</span>
        <textarea value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Ask anything..."
          className="rounded resize-none outline-none"
          style={{
            backgroundColor: 'var(--bg-input)', padding: '8px 12px', border: 'none',
            fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 14, color: 'var(--text)',
            lineHeight: '20px', height: 128,
          }} />
        <div className="flex gap-2 overflow-hidden">
          {['Households in Texas', 'People in New York who like Friends'].map(tag => (
            <button key={tag} onClick={() => setQuery(tag)}
              className="flex items-center justify-center rounded-md shrink-0"
              style={{ backgroundColor: 'var(--border)', padding: '0 8px', height: 24, fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-btn)', whiteSpace: 'nowrap', border: 'none' }}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: 1, backgroundColor: 'var(--border)' }} />

      {/* Model / Limit */}
      <div className="flex gap-4">
        <SelectDropdown label="Model" options={MODELS} value={model} onChange={setModel} />
        <SelectDropdown label="Limit" options={LIMITS} value={limit} onChange={setLimit} />
      </div>

      {/* Technical details */}
      <div className="flex flex-col gap-[10px]">
        <div className="flex items-center justify-between">
          <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 14, color: 'var(--text-muted)', lineHeight: '20px' }}>Technical details</span>
          <div className="flex gap-3 items-center">
            <button className="flex items-center justify-center rounded p-1"
              style={{ border: '1px solid var(--border)', width: 24, height: 24, background: 'transparent' }}>
              <Copy size={12} strokeWidth={1.5} color="var(--text-dim)" />
            </button>
            <button onClick={() => setTechExpanded(p => !p)}
              className="flex items-center justify-center rounded p-1"
              style={{ border: '1px solid var(--border)', width: 24, height: 24, background: 'transparent' }}>
              {techExpanded
                ? <ChevronUp size={12} strokeWidth={1.5} color="var(--text-dim)" />
                : <ChevronDown size={12} strokeWidth={1.5} color="var(--text-dim)" />}
            </button>
          </div>
        </div>
        {techExpanded && (
          <div className="rounded p-2 overflow-x-auto"
            style={{ backgroundColor: 'var(--bg-input)', border: 'none', fontFamily: 'monospace', color: 'var(--text-dim)', fontSize: 11, lineHeight: '18px', whiteSpace: 'pre' }}>
            <span style={{ color: '#9b59b6' }}>PREFIX</span>{' samba <http://samba.tv/ontolo...>\n'}
            <span style={{ color: '#9b59b6' }}>SELECT</span>{' ?household ?exp\n'}
            <span style={{ color: '#9b59b6' }}>WHERE</span>{' {\n  '}
            <span style={{ color: '#4a9bdc' }}>GRAPH</span>{' <http://samba.tv/data/Identit...> {\n'}
            {'    ?household ...\n    ?exp samba:stateOfResidence '}
            <span style={{ color: '#e88e2d' }}>"Texas"</span>{'\n  }\n}\n'}
            <span style={{ color: '#9b59b6' }}>LIMIT</span>{` ${limit}`}
          </div>
        )}
      </div>

      <button onClick={onRunAnalysis}
        className="w-full flex items-center justify-center rounded-md transition-opacity hover:opacity-90"
        style={{ backgroundColor: '#6781a8', height: 40, fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 16, color: '#fff', border: 'none' }}>
        Run Analysis
      </button>
    </div>
  );
}

// ─── Divider pill ─────────────────────────────────────────────────────────────
function PillDivider() {
  return <div style={{ width: 1, height: 24, backgroundColor: '#3a3a3a', flexShrink: 0 }} />;
}

// ─── Graph Editor Panel ───────────────────────────────────────────────────────
const GROUP_META: { type: NodeType; label: string }[] = [
  { type: 'genre',      label: 'Genre (Comedy hub)' },
  { type: 'topic',      label: 'Topic (Sports hub)' },
  { type: 'household',  label: 'Household' },
  { type: 'individual', label: 'Individual' },
];

function ColorSwatch({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="relative cursor-pointer flex-shrink-0" style={{ width: 28, height: 22 }}>
      <input type="color" value={value} onChange={e => onChange(e.target.value)}
        style={{ opacity: 0, position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
      <div style={{ width: 28, height: 22, borderRadius: 4, backgroundColor: value, border: '1px solid var(--border-mid)' }} />
    </label>
  );
}

function EditorRow({ label, color, colorDot, accentColor, sliderMin, sliderMax, sliderStep, sliderValue, sliderLabel, onColorChange, onSliderChange }: {
  label: string; color: string; colorDot?: boolean; accentColor?: string;
  sliderMin: number; sliderMax: number; sliderStep: number; sliderValue: number; sliderLabel: string;
  onColorChange?: (v: string) => void; onSliderChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg p-3" style={{ backgroundColor: 'var(--bg-card-alt)', marginBottom: 4 }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {colorDot && <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />}
          {!colorDot && <div style={{ width: 18, height: 2, borderRadius: 1, backgroundColor: color, flexShrink: 0 }} />}
          <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>{label}</span>
        </div>
        {onColorChange && <ColorSwatch value={color} onChange={onColorChange} />}
      </div>
      <div className="flex items-center gap-2">
        <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 11, color: 'var(--text-muted)', width: 32, flexShrink: 0 }}>{sliderLabel}</span>
        <input type="range" min={sliderMin} max={sliderMax} step={sliderStep} value={sliderValue}
          onChange={e => onSliderChange(parseFloat(e.target.value))}
          style={{ flex: 1, accentColor: accentColor ?? color, height: 4 }} />
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)', width: 32, textAlign: 'right', flexShrink: 0 }}>
          {sliderValue % 1 === 0 ? sliderValue.toFixed(0) : sliderValue.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

function GraphEditorPanel({ config, onChange, onClose }: {
  config: GraphConfig;
  onChange: (c: GraphConfig) => void;
  onClose: () => void;
}) {
  const panelWidth = 272;
  const [pos, setPos] = useState<{ x: number; y: number }>(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
    return { x: Math.max(20, w - panelWidth - 24), y: 64 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startMouseX: number; startMouseY: number; startPosX: number; startPosY: number } | null>(null);

  const startDrag = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('button:not(.drag-handle)') || target.closest('input')) return;

    dragRef.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startPosX: pos.x,
      startPosY: pos.y,
    };
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startMouseX;
      const dy = e.clientY - dragRef.current.startMouseY;
      const maxX = Math.max(10, window.innerWidth - panelWidth - 10);
      const maxY = Math.max(10, window.innerHeight - 80);
      setPos({
        x: Math.max(10, Math.min(maxX, dragRef.current.startPosX + dx)),
        y: Math.max(10, Math.min(maxY, dragRef.current.startPosY + dy)),
      });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      dragRef.current = null;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging]);

  return (
    <div className="fixed flex flex-col" style={{
      top: pos.y, left: pos.x, zIndex: 50, width: panelWidth,
      backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 10,
      boxShadow: isDragging ? '0 12px 36px rgba(0,0,0,0.45)' : '0 8px 24px var(--shadow)',
      pointerEvents: 'auto',
      maxHeight: 'calc(100vh - 80px)', overflowY: 'auto',
      userSelect: isDragging ? 'none' : 'auto',
    }}>
      {/* Header with move handle */}
      <div
        onPointerDown={startDrag}
        className="flex items-center justify-between px-3 py-2.5 sticky top-0 cursor-grab active:cursor-grabbing select-none"
        style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', zIndex: 1, touchAction: 'none' }}
      >
        <div className="flex items-center gap-1.5 flex-1 drag-handle">
          <div className="flex items-center justify-center p-1 rounded hover:bg-[var(--bg-btn)] text-[var(--text-muted)]" title="Drag to move panel">
            <Move size={14} strokeWidth={1.5} />
          </div>
          <Sliders size={14} strokeWidth={1.5} color="var(--text-muted)" />
          <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Graph Editor</span>
        </div>
        <button onClick={onClose} className="flex items-center justify-center rounded hover:bg-[var(--bg-btn)] transition-colors"
          style={{ width: 22, height: 22, background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <X size={14} strokeWidth={1.5} color="var(--text-dim)" />
        </button>
      </div>

      <div className="p-3 flex flex-col gap-0">
        {/* Section: Nodes */}
        <div className="mb-1" style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 10, fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', paddingLeft: 4, marginBottom: 6 }}>
          Nodes
        </div>
        {GROUP_META.map(({ type, label }) => (
          <EditorRow key={type}
            label={label} color={config.colors[type]} colorDot
            sliderMin={0.3} sliderMax={2.5} sliderStep={0.05} sliderValue={config.sizes[type]} sliderLabel="Size"
            onColorChange={hex => onChange({ ...config, colors: { ...config.colors, [type]: hex } })}
            onSliderChange={val => onChange({ ...config, sizes: { ...config.sizes, [type]: val } })}
          />
        ))}

        {/* Section: Glow */}
        <div className="mt-2 mb-1" style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 10, fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', paddingLeft: 4, marginBottom: 6 }}>
          Glow
        </div>
        <div className="flex flex-col gap-2 rounded-lg p-3" style={{ backgroundColor: 'var(--bg-card-alt)', marginBottom: 4 }}>
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text)', fontWeight: 500, flex: 1 }}>Node glow</span>
            <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)', width: 32, textAlign: 'right' }}>
              {(config.glowIntensity ?? 0.25).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 11, color: 'var(--text-muted)', width: 32, flexShrink: 0 }}>Intensity</span>
            <input type="range" min={0} max={1} step={0.01} value={config.glowIntensity ?? 0.25}
              onChange={e => onChange({ ...config, glowIntensity: parseFloat(e.target.value) })}
              style={{ flex: 1, accentColor: 'var(--accent)', height: 4 }} />
          </div>
        </div>

        {/* Section: Lines */}
        <div className="mt-2 mb-1" style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 10, fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', paddingLeft: 4, marginBottom: 6 }}>
          Lines
        </div>
        <EditorRow
          label="Edge color" color={config.edgeColor}
          accentColor="var(--accent)"
          sliderMin={0} sliderMax={1} sliderStep={0.01} sliderValue={config.edgeOpacity} sliderLabel="Opacity"
          onColorChange={hex => onChange({ ...config, edgeColor: hex })}
          onSliderChange={val => onChange({ ...config, edgeOpacity: val })}
        />
        <EditorRow
          label="Hub edge" color={config.hubEdgeColor}
          accentColor="var(--accent)"
          sliderMin={0} sliderMax={1} sliderStep={0.01} sliderValue={config.edgeOpacity} sliderLabel="Opacity"
          onColorChange={hex => onChange({ ...config, hubEdgeColor: hex })}
          onSliderChange={val => onChange({ ...config, edgeOpacity: val })}
        />
      </div>

      {/* Reset */}
      <div className="px-3 pb-3">
        <button onClick={() => onChange(DEFAULT_GRAPH_CONFIG)}
          className="w-full flex items-center justify-center rounded-lg"
          style={{ height: 30, backgroundColor: 'var(--bg-btn)', border: '1px solid var(--border)', fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-muted)' }}>
          Reset to defaults
        </button>
      </div>
    </div>
  );
}

// ─── Node Detail Panel ────────────────────────────────────────────────────────
const TYPE_META: Record<NodeType, { label: string; color: string }> = {
  genre:      { label: 'Genre',      color: '#38A169' },
  topic:      { label: 'Topic',      color: '#D53F8C' },
  household:  { label: 'Household',  color: '#4E6E9D' },
  individual: { label: 'Individual', color: '#EF3557' },
};

const NODE_DETAILS: Record<string, { description: string; metrics: { label: string; value: string }[]; connections: string[] }> = {
  sports: {
    description: 'Sports affinity hub — aggregates households and individuals with strong sports viewing behavior.',
    metrics: [{ label: 'Affinity score', value: '0.93' }, { label: 'Reach', value: '42.3k HH' }, { label: 'Avg. freq.', value: '4.2x/wk' }],
    connections: ['Comedy', ...Array.from({ length: 6 }, (_, i) => `HH ${i + 1}`)],
  },
  comedy: {
    description: 'Comedy genre hub — central node for comedy content affinity across linked households.',
    metrics: [{ label: 'Affinity score', value: '0.81' }, { label: 'Reach', value: '38.1k HH' }, { label: 'Avg. freq.', value: '3.7x/wk' }],
    connections: ['Sports', ...Array.from({ length: 6 }, (_, i) => `HH ${i + 7}`)],
  },
};

function NodeDetailPanel({ node, onClose, graphConfig }: { node: Node3D; onClose: () => void; graphConfig: GraphConfig }) {
  const meta = TYPE_META[node.type];
  const details = NODE_DETAILS[node.id];
  const nodeColor = graphConfig.colors[node.type] ?? meta.color;
  const isHub = node.id === 'sports' || node.id === 'comedy';

  const metrics = details?.metrics ?? [
    { label: 'Affinity score', value: (Math.random() * 0.9 + 0.1).toFixed(2) },
    { label: 'Connections', value: String(Math.floor(Math.random() * 8 + 2)) },
    { label: 'Segment match', value: `${Math.floor(Math.random() * 40 + 60)}%` },
  ];

  return (
    <div
      className="absolute top-0 right-0 flex flex-col h-full"
      style={{
        width: 280, zIndex: 25, pointerEvents: 'auto',
        backgroundColor: 'var(--bg-card-alt)',
        borderLeft: '1px solid var(--border)',
        boxShadow: '-8px 0 32px var(--shadow)',
        animation: 'slideInRight 0.22s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: nodeColor, flexShrink: 0, boxShadow: `0 0 8px ${nodeColor}88` }} />
          <div className="flex flex-col">
            <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: 'var(--text)', lineHeight: '20px' }}>
              {isHub ? node.label : node.label.slice(0, 16) + (node.label.length > 16 ? '…' : '')}
            </span>
            <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 11, color: nodeColor, lineHeight: '16px', fontWeight: 500 }}>
              {meta.label}
            </span>
          </div>
        </div>
        <button onClick={onClose} className="flex items-center justify-center rounded"
          style={{ width: 24, height: 24, background: 'transparent', border: 'none', flexShrink: 0 }}>
          <X size={14} strokeWidth={1.5} color="var(--text-dim)" />
        </button>
      </div>

      <div className="flex flex-col gap-4 p-4 overflow-y-auto flex-1">
        {/* ID */}
        <div className="flex flex-col gap-1">
          <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 10, fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Node ID</span>
          <code style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)', backgroundColor: 'var(--bg-input)', padding: '4px 8px', borderRadius: 4, wordBreak: 'break-all' }}>
            {node.id}
          </code>
        </div>

        {/* Description */}
        {details?.description && (
          <div className="flex flex-col gap-1">
            <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 10, fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>About</span>
            <p style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-muted)', lineHeight: '18px' }}>{details.description}</p>
          </div>
        )}

        {/* Metrics */}
        <div className="flex flex-col gap-1">
          <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 10, fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Metrics</span>
          <div className="flex flex-col gap-1">
            {metrics.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between rounded px-3 py-2"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Type badge */}
        <div className="flex flex-col gap-1">
          <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 10, fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Type</span>
          <div className="flex items-center gap-2">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, border: `1px solid ${nodeColor}55`, backgroundColor: `${nodeColor}18` }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: nodeColor }} />
              <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: nodeColor, fontWeight: 500 }}>{meta.label}</span>
            </div>
            {isHub && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, border: '1px solid var(--border)', backgroundColor: 'var(--bg-btn)' }}>
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>Hub</span>
              </div>
            )}
          </div>
        </div>

        {/* Connections */}
        {details?.connections && (
          <div className="flex flex-col gap-1">
            <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 10, fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Connected to</span>
            <div className="flex flex-wrap gap-1">
              {details.connections.slice(0, 8).map(c => (
                <span key={c} style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 11, color: 'var(--text-muted)', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: 4 }}>
                  {c}
                </span>
              ))}
              {details.connections.length > 8 && (
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 11, color: 'var(--text-dim)', padding: '2px 6px' }}>
                  +{details.connections.length - 8} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer action */}
      <div className="px-4 py-3" style={{ borderTop: '1px solid var(--border)' }}>
        <button className="w-full flex items-center justify-center gap-2 rounded-lg"
          style={{ height: 32, backgroundColor: nodeColor, border: 'none', fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: '#fff' }}>
          <Network size={13} strokeWidth={1.5} color="#fff" />
          Explore node
        </button>
      </div>
    </div>
  );
}

// ─── Knowledge Graph View ─────────────────────────────────────────────────────
function KnowledgeGraphView({ query, onNavigateAudience, graphConfig, showGraphEditor, onCloseEditor, onUpdateConfig }: {
  query: string; onNavigateAudience: () => void;
  graphConfig: GraphConfig; showGraphEditor: boolean;
  onCloseEditor: () => void; onUpdateConfig: (c: GraphConfig) => void;
}) {
  const [graphTab, setGraphTab] = useState<GraphTab>('graph');
  const [localQuery, setLocalQuery] = useState(query);
  const [page, setPage] = useState(1);
  const [selectedNode, setSelectedNode] = useState<Node3D | null>(null);
  const graphRef = useRef<Graph3DHandle>(null);

  const legendItems = [
    { label: 'Genre',      color: '#38A169', dot: true  },
    { label: 'Individual', color: '#EF3557', dot: true  },
    { label: 'Topic',      color: '#D53F8C', dot: true  },
    { label: 'Household',  color: '#4E6E9D', dot: true  },
    { label: 'Affinity',   color: 'var(--text-dim)', dot: false },
  ];

  return (
    // Outer wrapper — graph is the background, all UI floats with pointer-events management
    <div className="flex-1 relative overflow-hidden" style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>

      {/* ── Graph fills the entire background — receives all pointer events ── */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <Graph3D ref={graphRef} config={graphConfig} onNodeClick={setSelectedNode} />
      </div>

      {/* ── Overlay layer: pointer-events none so graph gets mouse/touch ── */}
      <div className="absolute inset-0 flex flex-col" style={{ zIndex: 10, pointerEvents: 'none' }}>

      {/* ── Top floating bar ── */}
      <div className="flex items-center justify-center p-4" style={{ pointerEvents: 'none' }}>
        <div className="flex items-center gap-6 rounded-lg px-6 py-2 flex-wrap"
          style={{ backgroundColor: 'var(--bg-card)', boxShadow: '0 1px 1px rgba(0,0,0,0.05)', pointerEvents: 'auto' }}>

          {/* Stats */}
          <div className="flex gap-6 items-center">
            {[{ val: '75.7k', sub: 'People match' }, { val: '67.5k', sub: 'Seed household' }].map(({ val, sub }) => (
              <div key={sub} className="flex flex-col items-center">
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 600, fontSize: 20, color: 'var(--text)', lineHeight: '28px' }}>{val}</span>
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-muted)', lineHeight: '16px' }}>{sub}</span>
              </div>
            ))}
          </div>

          <PillDivider />

          {/* Legend */}
          <div className="flex gap-4 items-center flex-wrap">
            {legendItems.map(({ label, color, dot }) => (
              <div key={label} className="flex gap-2 items-center">
                {dot
                  ? <div className="rounded-full" style={{ width: 10, height: 10, backgroundColor: color }} />
                  : <div style={{ width: 10, height: 2, backgroundColor: color }} />}
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 14, color: 'var(--text)', lineHeight: '20px' }}>{label}</span>
              </div>
            ))}
          </div>

          <PillDivider />

          {/* Counts */}
          <div className="flex gap-4 items-center">
            <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 14, color: 'var(--text-dim)' }}>20 nodes</span>
            <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 14, color: 'var(--text-dim)' }}>20 edges</span>
          </div>

          <PillDivider />

          <button onClick={onNavigateAudience}
            className="flex items-center justify-center rounded-md transition-colors"
            style={{ backgroundColor: 'var(--bg-btn)', padding: '0 12px', height: 32, fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 14, color: 'var(--text-btn)', border: 'none' }}>
            Explore this audience
          </button>
        </div>
      </div>

      {/* ── Content row: sidebar + optional table ── */}
      <div className="flex flex-1 items-start p-4 gap-4" style={{ pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }}>
          <KnowledgeGraphSidebar
            graphTab={graphTab} setGraphTab={setGraphTab}
            query={localQuery} setQuery={setLocalQuery}
            onRunAnalysis={() => {}}
          />
        </div>

        {/* Results table */}
        {graphTab === 'table' && (
          <div className="flex flex-col rounded-lg overflow-hidden flex-1"
            style={{ pointerEvents: 'auto', backgroundColor: 'var(--bg-card-alt)', border: '1px solid var(--border)', maxHeight: 'calc(100vh - 130px)' }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 20, fontWeight: 500, color: 'var(--text)' }}>Result bindings</span>
              <button className="flex items-center gap-2 rounded"
                style={{ border: '1px solid var(--border)', padding: '0 12px', height: 32, background: 'transparent', fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 14, color: 'var(--text-btn)' }}>
                <Download size={14} strokeWidth={1.5} color="var(--text-dim)" />
                Export to CSV
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['House Hold', 'Samba ID', 'Genre Score', 'Topic Score'].map(h => (
                      <th key={h} style={{ padding: '8px 16px', textAlign: 'left', fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 14, fontWeight: 500, color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)', backgroundColor: i % 2 === 1 ? 'var(--bg-input)' : 'transparent' }}>
                      <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text)' }}>{row.household}</td>
                      <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text)' }}>{row.sambaId}</td>
                      <td style={{ padding: '10px 16px', fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 13, color: 'var(--text)', textAlign: 'center' }}>{row.genreScore}</td>
                      <td style={{ padding: '10px 16px', fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 13, color: 'var(--text)', textAlign: 'center' }}>{row.topicScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid var(--border)' }}>
              <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 14, color: 'var(--text-dim)' }}>Showing 10 of 20 results</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} className="flex items-center justify-center rounded"
                  style={{ width: 28, height: 28, border: '1px solid var(--border)', background: 'transparent' }}>
                  <ChevronLeft size={14} strokeWidth={1.5} color="var(--text-dim)" />
                </button>
                {[1, 2].map(p => (
                  <button key={p} onClick={() => setPage(p)} className="flex items-center justify-center rounded"
                    style={{ width: 28, height: 28, border: '1px solid var(--border)', backgroundColor: page === p ? '#6781a8' : 'transparent', color: page === p ? '#fff' : '#a3a3a3', fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 14 }}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(2, p + 1))} className="flex items-center justify-center rounded"
                  style={{ width: 28, height: 28, border: '1px solid var(--border)', background: 'transparent' }}>
                  <ChevronRight size={14} strokeWidth={1.5} color="var(--text-dim)" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom floating bar ── */}
      <div className="flex items-center justify-center p-4" style={{ pointerEvents: 'none' }}>
        <div className="flex items-center gap-6 rounded-lg px-6 py-2"
          style={{ backgroundColor: 'var(--bg-card)', boxShadow: '0 1px 1px rgba(0,0,0,0.05)', pointerEvents: 'auto' }}>
          <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 14, color: 'var(--text-dim)', lineHeight: '20px' }}>
            Showing 34 of 512,000 households
          </span>
          <PillDivider />
          <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 14, color: 'var(--text-dim)', lineHeight: '20px' }}>
            Click on any node for more information.
          </span>
        </div>
      </div>

      </div>{/* end overlay layer */}

      {/* ── Graph editor panel ── */}
      {showGraphEditor && (
        <GraphEditorPanel config={graphConfig} onChange={onUpdateConfig} onClose={onCloseEditor} />
      )}

      {/* ── Node detail panel ── */}
      {selectedNode && (
        <NodeDetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} graphConfig={graphConfig} />
      )}

      {/* ── Zoom / pan controls ── */}
      <div className="absolute flex flex-col gap-2 items-center" style={{ bottom: 16, right: 16, zIndex: 20 }}>
        {([
          { icon: ZoomIn,  title: 'Zoom in',  onClick: () => graphRef.current?.zoom(-80) },
          { icon: ZoomOut, title: 'Zoom out', onClick: () => graphRef.current?.zoom(80) },
          { icon: Move,    title: 'Pan: shift+drag or right-click drag', onClick: undefined },
        ]).map(({ icon: Icon, title, onClick }) => (
          <button key={title} onClick={onClick ?? undefined} title={title}
            className="flex items-center justify-center rounded"
            style={{ width: 32, height: 32, border: '1px solid var(--border)', backgroundColor: 'var(--bg-input)', cursor: onClick ? 'pointer' : 'default', opacity: onClick ? 1 : 0.5 }}>
            <Icon size={14} strokeWidth={1.5} color="var(--text-dim)" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Genres Modal ─────────────────────────────────────────────────────────────
function GenresModal({ onClose, selectedGenres, onConfirm }: {
  onClose: () => void; selectedGenres: number[]; onConfirm: (ids: number[]) => void;
}) {
  const [tab, setTab] = useState<'genres' | 'topics'>('genres');
  const [search, setSearch] = useState('');
  const [checked, setChecked] = useState<Set<number>>(new Set(selectedGenres));
  const filtered = genres.filter(g => g.name.toLowerCase().includes(search.toLowerCase()));

  function toggle(id: number) {
    setChecked(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'var(--overlay)' }}>
      <div className="flex flex-col gap-6 rounded-lg"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', width: 600, padding: 24, maxHeight: '90vh', overflow: 'hidden', boxShadow: '0 20px 60px var(--shadow)' }}>

        <div className="flex items-start justify-between">
          <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 500, fontSize: 30, color: 'var(--text)', lineHeight: 'normal' }}>Add genres</span>
          <button onClick={onClose}><X size={20} strokeWidth={1.5} color="var(--text)" /></button>
        </div>

        <div className="flex" style={{ borderBottom: '2px solid var(--border)' }}>
          {(['genres', 'topics'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className="px-4 py-1"
              style={{
                fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 500, fontSize: 14,
                color: tab === t ? 'var(--accent)' : 'var(--text-dim)',
                borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
                marginBottom: -2, background: 'transparent',
              }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 16, color: 'var(--text)' }}>Browse {tab}</span>
          <div className="relative">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search"
              className="w-full rounded outline-none"
              style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border)', height: 48, paddingLeft: 16, paddingRight: 48, fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 16, color: 'var(--text-sub)' }} />
            <Search size={18} strokeWidth={1.5} color="var(--text-ph)" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }} />
          </div>
          <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-ph)' }}>
            {filtered.length} of {genres.length} available {tab}
          </span>
        </div>

        <div className="flex gap-2 overflow-hidden" style={{ flex: 1, minHeight: 0 }}>
          <div className="flex flex-col gap-4 flex-1 overflow-y-auto pr-2" style={{ maxHeight: 320 }}>
            {(tab === 'genres' ? filtered : topics).map(item => (
              <div key={item.id} className="flex gap-2 items-center">
                <button onClick={() => toggle(item.id)}
                  className="flex items-center justify-center rounded shrink-0"
                  style={{ width: 16, height: 16, border: checked.has(item.id) ? 'none' : '2px solid var(--border-tag)', backgroundColor: checked.has(item.id) ? 'var(--accent)' : 'transparent' }}>
                  {checked.has(item.id) && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 16, color: 'var(--text)', flex: 1 }}>{item.name}</span>
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 14, color: 'var(--text-dim)' }}>{item.count}</span>
              </div>
            ))}
          </div>
          <div className="rounded-full shrink-0" style={{ width: 4, height: 153, backgroundColor: 'var(--border-tag)', alignSelf: 'flex-start', marginTop: 4 }} />
        </div>

        <div className="flex gap-4 items-center justify-end">
          <button onClick={onClose} className="flex items-center justify-center rounded"
            style={{ border: '1px solid var(--border)', height: 40, padding: '0 16px', background: 'transparent', fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 16, color: 'var(--text-btn)' }}>
            Cancel
          </button>
          <button onClick={() => { onConfirm(Array.from(checked)); onClose(); }}
            className="flex items-center justify-center rounded"
            style={{ backgroundColor: 'var(--accent)', height: 40, padding: '0 16px', border: 'none', fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 16, color: '#fff' }}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Audience View ────────────────────────────────────────────────────────────
function MiniBarChart({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values);
  return (
    <div className="flex items-end gap-0.5 h-16 w-full">
      {values.map((v, i) => (
        <div key={i} className="flex-1 rounded-sm" style={{ height: `${(v / max) * 100}%`, backgroundColor: color, minWidth: 4 }} />
      ))}
    </div>
  );
}

function HorizBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="flex-1 rounded-full overflow-hidden" style={{ height: 6, backgroundColor: 'var(--border)' }}>
      <div className="h-full rounded-full" style={{ width: `${(value / max) * 100}%`, backgroundColor: color }} />
    </div>
  );
}

function SeedInterestSidebar({ onAddGenre }: { onAddGenre: () => void }) {
  return (
    <div className="flex flex-col gap-4 shrink-0 rounded-lg overflow-y-auto"
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', width: 260, padding: 12, maxHeight: 'calc(100vh - 32px)' }}>

      <p style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 500, fontSize: 20, color: 'var(--text)', lineHeight: '1.5' }}>Seed interests</p>

      {/* Genres */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 500, fontSize: 16, color: 'var(--text)' }}>Genres</span>
          <div className="flex gap-2">
            <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-ph)' }}>856 available</span>
            <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-ph)', fontWeight: 600 }}>1 selected</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 rounded-lg p-2" style={{ border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 14, fontWeight: 500, color: '#cb3557', flex: 1 }}>Sports</span>
            <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-dim)' }}>Interested</span>
            <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-dim)' }}>0.45</span>
            <button><Trash2 size={14} strokeWidth={1.5} color="var(--text-dim)" /></button>
          </div>
          <div className="relative py-1.5">
            <div className="rounded-full overflow-hidden" style={{ height: 4, backgroundColor: 'var(--border)' }}>
              <div className="h-full rounded-full" style={{ width: '50%', backgroundColor: 'var(--accent)' }} />
            </div>
            <div className="absolute rounded-full" style={{ width: 14, height: 14, backgroundColor: 'var(--accent)', border: '2px solid var(--bg-card)', top: '50%', left: 'calc(50% - 7px)', transform: 'translateY(-50%)', cursor: 'pointer' }} />
          </div>
        </div>
      </div>

      <div style={{ height: 1, backgroundColor: 'var(--border)' }} />

      {/* Topics */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 500, fontSize: 16, color: 'var(--text)' }}>Topics</span>
          <div className="flex gap-2">
            <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-ph)' }}>34 shown</span>
            <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-ph)', fontWeight: 600 }}>1 selected</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 rounded-lg p-2" style={{ border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 14, fontWeight: 500, color: '#77cca6', flex: 1 }}>News &amp; Politics</span>
            <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-dim)' }}>Interested</span>
            <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-dim)' }}>0.45</span>
            <button><Trash2 size={14} strokeWidth={1.5} color="var(--text-dim)" /></button>
          </div>
          <div className="relative py-1.5">
            <div className="rounded-full overflow-hidden" style={{ height: 4, backgroundColor: 'var(--border)' }}>
              <div className="h-full rounded-full" style={{ width: '50%', backgroundColor: 'var(--accent)' }} />
            </div>
            <div className="absolute rounded-full" style={{ width: 14, height: 14, backgroundColor: 'var(--accent)', border: '2px solid var(--bg-card)', top: '50%', left: 'calc(50% - 7px)', transform: 'translateY(-50%)', cursor: 'pointer' }} />
          </div>
        </div>
      </div>

      <button onClick={onAddGenre}
        className="flex items-center justify-center gap-2 rounded-md w-full"
        style={{ border: '1px solid var(--border)', height: 40, background: 'transparent', fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 16, color: 'var(--text-btn)' }}>
        <Plus size={16} strokeWidth={1.5} color="var(--text-btn)" />
        Add genre or topic
      </button>
    </div>
  );
}

function AudienceView({ onAddGenre }: { onAddGenre: () => void }) {
  const d = audienceData;
  return (
    <div className="flex flex-1 min-h-screen" style={{ backgroundColor: 'var(--bg)', transition: 'background-color 0.2s' }}>
      <div className="flex flex-1 gap-6 p-4">
        <SeedInterestSidebar onAddGenre={onAddGenre} />
        <div className="flex flex-col gap-4 flex-1 overflow-y-auto">
          {/* Title row */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 500, fontSize: 30, color: 'var(--text)' }}>Audience profile</span>
            <div className="flex items-center gap-8">
              <div className="flex gap-4 items-center">
                {[{ label: 'Households', val: d.households }, { label: 'Est. population', val: d.population }].map(({ label, val }) => (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-ph)' }}>{label}</span>
                    <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 500, fontSize: 30, color: 'var(--text)', lineHeight: 1 }}>{val}</span>
                  </div>
                ))}
              </div>
              <button className="flex items-center justify-center rounded"
                style={{ border: '1px solid var(--accent)', height: 40, padding: '0 16px', background: 'transparent', fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 16, color: 'var(--accent)' }}>
                View tech inquiry
              </button>
            </div>
          </div>

          {/* Top two cards */}
          <div className="flex gap-6 flex-wrap">
            {/* Also interested in */}
            <div className="flex flex-col gap-4 rounded-xl p-6 flex-1" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)' }}>
              <div>
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 500, fontSize: 20, color: 'var(--text)', display: 'block' }}>Also interested in</span>
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-ph)', display: 'block', marginTop: 4 }}>Index vs. all households — 1.00× is average. Click a row to add it as a seed.</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {d.alsoInterestedIn.map(item => {
                  const barW = (parseFloat(item.index) / 4) * 100;
                  return (
                    <div key={item.name} className="flex items-center gap-3">
                      <div className="rounded shrink-0" style={{ width: 8, height: 8, backgroundColor: item.type === 'genre' ? 'var(--accent)' : '#e87f9b' }} />
                      <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 14, color: 'var(--text)', width: 140, flexShrink: 0 }}>{item.name}</span>
                      <div className="flex-1 rounded-sm overflow-hidden" style={{ height: 8, backgroundColor: 'var(--border)' }}>
                        <div className="h-full rounded-sm" style={{ width: `${barW}%`, backgroundColor: 'var(--accent)' }} />
                      </div>
                      <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 14, color: 'var(--text-ph)', width: 36, textAlign: 'right', flexShrink: 0 }}>{item.index}</span>
                      <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 14, color: 'var(--text-ph)', width: 44, textAlign: 'right', flexShrink: 0 }}>{item.count}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex gap-4">
                  {[{ label: 'Genre', color: 'var(--accent)' }, { label: 'Topic', color: '#e87f9b' }].map(({ label, color }) => (
                    <div key={label} className="flex gap-2 items-center">
                      <div className="rounded-full" style={{ width: 8, height: 8, backgroundColor: color }} />
                      <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-ph)' }}>{label}</span>
                    </div>
                  ))}
                </div>
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-ph)' }}>households co-occurring</span>
              </div>
            </div>

            {/* Where they live */}
            <div className="flex flex-col gap-4 rounded-xl p-6" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', minWidth: 280 }}>
              <div>
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 500, fontSize: 20, color: 'var(--text)', display: 'block' }}>Where they live</span>
                <div className="flex items-center gap-2 mt-1">
                  <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-ph)' }}>0.8×</span>
                  <div className="flex-1 rounded-full overflow-hidden" style={{ height: 4, backgroundColor: 'var(--border)' }}>
                    <div className="h-full rounded-full" style={{ width: '60%', backgroundColor: 'var(--accent)' }} />
                  </div>
                  <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-ph)' }}>1.5×</span>
                </div>
              </div>
              <div className="rounded flex items-center justify-center" style={{ backgroundColor: 'var(--bg-input)', height: 120, border: '1px solid var(--border)' }}>
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-dim)' }}>State index map</span>
              </div>
              <div>
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-ph)', display: 'block', marginBottom: 8 }}>TOP STATES</span>
                <div className="flex flex-col gap-1.5">
                  {d.topStates.map(s => (
                    <div key={s.name} className="flex items-center justify-between">
                      <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 14, color: 'var(--text)' }}>{s.name}</span>
                      <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 14, color: 'var(--text-ph)' }}>{s.index}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom four cards */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex flex-col gap-3 rounded-xl p-4 flex-1" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', minWidth: 160 }}>
              <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 500, fontSize: 20, color: 'var(--text)' }}>Age</span>
              <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-ph)' }}>People per band, summed</span>
              <MiniBarChart values={d.ageBands} color="var(--accent)" />
            </div>
            <div className="flex flex-col gap-3 rounded-xl p-4 flex-1" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', minWidth: 160 }}>
              <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 500, fontSize: 20, color: 'var(--text)' }}>Household income</span>
              <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-ph)' }}>11 bands · skews mid-market</span>
              <MiniBarChart values={d.incomes} color="var(--accent)" />
            </div>
            <div className="flex flex-col gap-3 rounded-xl p-4 flex-1" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', minWidth: 160 }}>
              <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 500, fontSize: 20, color: 'var(--text)' }}>Race &amp; ethnicity</span>
              <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-ph)' }}>People per band, summed</span>
              <div className="flex flex-col gap-2">
                {d.race.map(r => (
                  <div key={r.label} className="flex items-center gap-2">
                    <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-muted)', width: 60, flexShrink: 0 }}>{r.label}</span>
                    <HorizBar value={r.pct} max={1} color="var(--accent)" />
                    <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-ph)', width: 40, textAlign: 'right' }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-xl p-4 flex-1" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', minWidth: 160 }}>
              <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 500, fontSize: 20, color: 'var(--text)' }}>Household makeup</span>
              <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-ph)' }}>Average per household</span>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Household size', val: d.householdMakeup.size },
                  { label: 'Adults', val: d.householdMakeup.adults },
                  { label: 'Children', val: d.householdMakeup.children },
                ].map(({ label, val }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 14, color: 'var(--text-muted)' }}>{label}</span>
                    <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 20, fontWeight: 500, color: 'var(--text)' }}>{val}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-muted)' }}>Male {d.householdMakeup.male}</span>
                  <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-muted)' }}>Female {d.householdMakeup.female}</span>
                </div>
                <div className="flex rounded-full overflow-hidden" style={{ height: 6 }}>
                  <div style={{ flex: d.householdMakeup.malePct, backgroundColor: '#4a6b9a' }} />
                  <div style={{ flex: d.householdMakeup.femalePct, backgroundColor: '#cb3557' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView]             = useState<View>('graph');
  const [lastQuery, setLastQuery]   = useState('');
  const [showGenres, setShowGenres] = useState(false);
  const [selGenres, setSelGenres]   = useState<number[]>([1]);
  const [theme, setTheme]           = useState<Theme>('dark');
  const [graphConfig, setGraphConfig] = useState<GraphConfig>(DEFAULT_GRAPH_CONFIG);
  const [showGraphEditor, setShowGraphEditor] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  function handleSearch(q: string) { setLastQuery(q); setView('graph'); }

  return (
    <ThemeCtx.Provider value={theme}>
      <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg)', transition: 'background-color 0.2s' }}>
        <Sidebar
          view={view} setView={setView} theme={theme}
          toggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
          showGraphEditor={showGraphEditor}
          onToggleEditor={() => setShowGraphEditor(v => !v)}
        />
        {view === 'home'     && <HomeView onSearch={handleSearch} />}
        {view === 'graph'    && (
          <KnowledgeGraphView
            query={lastQuery}
            onNavigateAudience={() => setView('audience')}
            graphConfig={graphConfig}
            showGraphEditor={showGraphEditor}
            onCloseEditor={() => setShowGraphEditor(false)}
            onUpdateConfig={setGraphConfig}
          />
        )}
        {view === 'audience' && <AudienceView onAddGenre={() => setShowGenres(true)} />}
        {showGenres && <GenresModal onClose={() => setShowGenres(false)} selectedGenres={selGenres} onConfirm={ids => setSelGenres(ids)} />}
      </div>
    </ThemeCtx.Provider>
  );
}
