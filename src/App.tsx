import { useState, useRef, useEffect, useMemo, createContext, useContext } from 'react';
import {
  Network, Sun, Moon, ChevronDown, ArrowRight, Plus,
  Trash2, Search, X, Copy, ChevronUp, ChevronLeft, ChevronRight,
  Download, Sliders, ZoomIn, ZoomOut, Move, Tv, Check, VectorPolygon
} from 'lucide-react';
import {
  genres, topics, tableRows, audienceData,
  type Genre, type Topic,
  type NodeType, type Node3DData, type GraphDataset,
  getGraphDataset, getTableRows
} from './db';
import Graph3D, { DEFAULT_GRAPH_CONFIG, type GraphConfig, type Graph3DHandle } from './Graph3D';

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

// ─── Custom Sidebar Icons ──────────────────────────────────────────────────
function SambaTvLogo({ width = 24, height = 22 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', flexShrink: 0 }}>
      <path
        d="M7.8 7.5C5.7 7.5 4 9.2 4 11.3C4 13.4 5.7 15.1 7.8 15.1C10.5 15.1 13.8 11.2 15.8 8.8C17.5 6.8 20.2 6.5 21.8 8.2C23.5 10 23.2 12.8 21.2 14.5L14.8 19.8C13.8 20.6 12.2 20.6 11.2 19.8L8.5 17.5"
        stroke="#5885D6"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function KnowledgeGraphNavIcon({ size = 20 }: { size?: number }) {
  return <VectorPolygon size={size} strokeWidth={1} />;
}

function AudienceNavIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', flexShrink: 0 }}>
      <path
        d="M13 3.5C17.7 3.9 20.1 6.3 20.5 11H13V3.5Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 13C21 17.97 16.97 22 12 22C7.03 22 3 17.97 3 13C3 8.03 7.03 4 12 4"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
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
          <button onClick={() => setView('graph')} className="flex items-center justify-center p-0.5 rounded hover:opacity-85 transition-opacity" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }} title="Samba TV">
            <SambaTvLogo width={24} height={22} />
          </button>
          <div className="flex flex-col gap-4 items-center w-full">
            <NavItem
              key="graph"
              icon={
                <div style={{ color: view === 'graph' ? '#ffffff' : 'rgba(255,255,255,0.6)' }}>
                  <KnowledgeGraphNavIcon size={20} />
                </div>
              }
              label="Ask a question"
              active={view === 'graph'}
              onClick={() => setView('graph')}
            />
            <NavItem
              key="audience"
              icon={
                <div style={{ color: view === 'audience' ? '#ffffff' : 'rgba(255,255,255,0.6)' }}>
                  <AudienceNavIcon size={20} />
                </div>
              }
              label="Audience"
              active={view === 'audience'}
              onClick={() => setView('audience')}
            />
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-4 items-center">
          {/* Theme / Settings toggle (Sun icon from Figma) */}
          <button
            onClick={toggleTheme}
            title="Toggle theme"
            className="flex items-center justify-center rounded-lg text-[#8a8a8a] hover:text-white transition-colors cursor-pointer"
            style={{ width: 28, height: 28, background: 'transparent', border: 'none' }}
          >
            <Sun size={18} strokeWidth={1.5} />
          </button>

          {/* Graph editor toggle */}
          <button
            onClick={onToggleEditor}
            title="Graph editor"
            className="flex items-center justify-center rounded-lg transition-colors cursor-pointer"
            style={{ width: 28, height: 28, backgroundColor: showGraphEditor ? 'rgba(103,129,168,0.25)' : 'transparent', border: 'none' }}
          >
            <Sliders size={16} strokeWidth={1.2} color={showGraphEditor ? ICON_W : ICON_DIM} />
          </button>

          {/* Avatar with photo and green status badge */}
          <div className="relative cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="User Avatar"
              className="rounded-full object-cover border border-[#262626]"
              style={{ width: 28, height: 28 }}
            />
            <div
              className="absolute rounded-full"
              style={{ width: 8, height: 8, backgroundColor: '#22c55e', bottom: -1, right: -1, border: '2px solid #0f0f0f' }}
            />
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
    'Households with Samba TV and more than 3 devices',
    'Households in Texas',
    'Households with income over $75k',
    'People in New York who like Friends',
    'Households that like Comedy and read about Sports',
    'People who like Game of Thrones, living in New York, who are married',
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
  { value: 'haiku',  label: 'Haiku (fast)',     desc: 'Fast response time, lower latency' },
  { value: 'sonnet', label: 'Sonnet (balanced)', desc: 'Balanced speed and precision' },
  { value: 'opus',   label: 'Opus (precise)',    desc: 'Maximum precision, in-depth reasoning' },
];
const LIMITS = [
  { value: '10',  label: '10 objects' },
  { value: '20',  label: '20 objects' },
  { value: '50',  label: '50 objects' },
  { value: '100', label: '100 objects' },
  { value: '500', label: '500 objects' },
];

function SelectDropdown({ label, options, value, onChange }: {
  label?: string;
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
    <div className="flex flex-col gap-2 w-full relative" ref={ref}>
      {label && (
        <div style={{ alignSelf: 'stretch', color: 'var(--NEUTRAL-600, #A3A3A3)', fontSize: 14, fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 400, lineHeight: '20px' }}>
          {label}
        </div>
      )}
      <div style={{ alignSelf: 'stretch', position: 'relative', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex', width: '100%' }}>
        <button
          onClick={() => setOpen(p => !p)}
          className="cursor-pointer"
          style={{
            flex: '1 1 0',
            height: 32,
            paddingLeft: 12,
            paddingRight: 32,
            background: 'var(--white, #1A1A1A)',
            borderRadius: 4,
            border: open ? '1px solid var(--PACIFIC--BLUE-500, #6781A8)' : 'none',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            display: 'inline-flex',
            textAlign: 'left',
            width: '100%',
          }}
        >
          <div style={{ alignSelf: 'stretch', color: 'var(--NEUTRAL-900, #D9D9D9)', fontSize: 14, fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 400, lineHeight: '20px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {selected.label}
          </div>
        </button>
        <div style={{ width: 32, height: 32, right: 0, top: 0, position: 'absolute', justifyContent: 'center', alignItems: 'center', display: 'flex', pointerEvents: 'none' }}>
          <ChevronDown size={14} color="#E5E5E5" style={{ transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'none' }} />
        </div>
      </div>
      {open && (
        <div className="absolute z-50 rounded overflow-hidden shadow-2xl"
          style={{ top: '100%', left: 0, right: 0, marginTop: 4, background: 'var(--NEUTRAL-100, #222222)', border: '1px solid var(--NEUTRAL-200, #2E2E2E)', borderRadius: 6, boxShadow: '0 8px 28px rgba(0,0,0,0.6)' }}>
          {options.map(opt => (
            <button key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
              className="w-full flex flex-col items-start px-3 py-2 transition-colors cursor-pointer text-left"
              style={{ backgroundColor: opt.value === value ? 'var(--NEUTRAL-200, #2E2E2E)' : 'transparent', borderBottom: '1px solid var(--NEUTRAL-200, #2E2E2E)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--NEUTRAL-200, #2E2E2E)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = opt.value === value ? 'var(--NEUTRAL-200, #2E2E2E)' : 'transparent')}>
              <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 13, color: opt.value === value ? 'var(--black, #E5E5E5)' : 'var(--NEUTRAL-800, #C6C6C6)', fontWeight: opt.value === value ? 500 : 400 }}>
                {opt.label}
              </span>
              {opt.desc && <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 11, color: 'var(--NEUTRAL-500, #8A8A8A)', marginTop: 1 }}>{opt.desc}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SuggestionSlider({ currentQuery, onSelect }: { currentQuery: string; onSelect: (tag: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const suggestions = [
    'Households in Texas',
    'People in New York who like Friends',
    'Households with Samba TV and more than 3 devices',
    'Households with income over $75k',
    'Households that like Comedy and read about Sports',
    'People who like Game of Thrones, living in New York, who are married',
  ];

  const updateScrollState = () => {
    const el = containerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && el.scrollWidth > el.clientWidth) {
        e.preventDefault();
        el.scrollLeft += e.deltaY * 0.8;
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
      el.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const scrollBy = (offset: number) => {
    containerRef.current?.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full overflow-hidden" style={{ alignSelf: 'stretch' }}>
      {/* Left indicator */}
      {canScrollLeft && (
        <button
          onClick={() => scrollBy(-100)}
          className="absolute left-0 top-0 bottom-0 z-10 flex items-center pr-2 pl-0"
          style={{
            background: 'linear-gradient(to right, var(--NEUTRAL-100, #222222) 65%, transparent)',
            border: 'none',
            cursor: 'pointer',
          }}
          title="Scroll left"
        >
          <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[var(--NEUTRAL-200,#2E2E2E)] text-[var(--NEUTRAL-600,#A3A3A3)] hover:text-white transition-colors">
            <ChevronLeft size={12} strokeWidth={2.2} />
          </div>
        </button>
      )}

      {/* Right indicator */}
      {canScrollRight && (
        <button
          onClick={() => scrollBy(100)}
          className="absolute right-0 top-0 bottom-0 z-10 flex items-center pl-2 pr-0"
          style={{
            background: 'linear-gradient(to left, var(--NEUTRAL-100, #222222) 65%, transparent)',
            border: 'none',
            cursor: 'pointer',
          }}
          title="Scroll right"
        >
          <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[var(--NEUTRAL-200,#2E2E2E)] text-[var(--NEUTRAL-600,#A3A3A3)] hover:text-white transition-colors">
            <ChevronRight size={12} strokeWidth={2.2} />
          </div>
        </button>
      )}

      {/* Horizontal chip suggestions */}
      <div
        ref={containerRef}
        className="flex gap-2 overflow-x-auto hide-scrollbar scroll-smooth py-0.5"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {suggestions.map(tag => {
          const isActive = currentQuery === tag;
          return (
            <button
              key={tag}
              onClick={() => onSelect(tag)}
              className="flex items-center justify-center shrink-0 transition-all duration-150 active:scale-95 cursor-pointer"
              style={{
                height: 24,
                paddingLeft: 8,
                paddingRight: 8,
                background: isActive ? 'var(--NEUTRAL-300, #4A4D50)' : 'var(--NEUTRAL-200, #2E2E2E)',
                borderRadius: 6,
                border: 'none',
                gap: 6,
              }}
            >
              <div style={{ color: isActive ? '#ffffff' : 'var(--NEUTRAL-800, #C6C6C6)', fontSize: 12, fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 400, lineHeight: '16px', whiteSpace: 'nowrap' }}>
                {tag}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SparqlCodeViewer({ code, onCopy, copied }: { code: string; onCopy: () => void; copied: boolean }) {
  const lines = code.trim().split('\n');

  const highlightToken = (token: string, key: number) => {
    const upper = token.toUpperCase();
    const keywords = ['PREFIX', 'SELECT', 'WHERE', 'GRAPH', 'LIMIT', 'CONSTRUCT', 'OPTIONAL', 'FILTER', 'BIND', 'COUNT', 'AS', 'A'];
    if (keywords.includes(upper)) {
      return <span key={key} style={{ color: 'var(--SIGNAL--RED-500, #BE2440)', fontSize: 12, fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 400, lineHeight: '20px' }}>{token}</span>;
    }
    if (token.startsWith('<') && token.endsWith('>')) {
      return <span key={key} style={{ color: 'var(--green-500, #63BA8C)', fontSize: 12, fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 400, lineHeight: '20px' }}>{token}</span>;
    }
    if (token.startsWith('"') || token.startsWith("'")) {
      return <span key={key} style={{ color: 'var(--SANDSTONE-500, #A6684C)', fontSize: 12, fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 400, lineHeight: '20px' }}>{token}</span>;
    }
    if (token.startsWith('samba:') || token.startsWith('show:') || token.startsWith('experian:') || token.startsWith('device:')) {
      return <span key={key} style={{ color: 'var(--PACIFIC--BLUE-500, #6781A8)', fontSize: 12, fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 400, lineHeight: '20px' }}>{token}</span>;
    }
    if (/^\d+$/.test(token)) {
      return <span key={key} style={{ color: 'var(--teal-500, #6AC1BF)', fontSize: 12, fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 400, lineHeight: '20px' }}>{token}</span>;
    }
    if (token === ':' || token === '{' || token === '}' || token === ';') {
      return <span key={key} style={{ color: 'var(--NEUTRAL-500, #8A8A8A)', fontSize: 12, fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 400, lineHeight: '20px' }}>{token}</span>;
    }
    return <span key={key} style={{ color: 'var(--black, #E5E5E5)', fontSize: 12, fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 400, lineHeight: '20px' }}>{token}</span>;
  };

  const highlightLine = (line: string) => {
    const parts = line.split(/(\s+|[{}<>;,:])/);
    return parts.map((part, i) => highlightToken(part, i));
  };

  return (
    <div
      style={{
        alignSelf: 'stretch',
        padding: '10px 12px',
        background: 'var(--white, #1A1A1A)',
        borderRadius: 8,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Scrollable code area with exact 5 lines visible (5 lines * 20px = 100px) */}
      <div
        style={{
          maxHeight: 100, // Exact 5 lines
          overflowY: 'auto',
          overflowX: 'auto',
          display: 'flex',
          gap: 12,
          paddingRight: 28, // space for copy button
        }}
      >
        {/* Line numbers */}
        <div
          style={{
            textAlign: 'right',
            color: 'var(--NEUTRAL-300, #4A4D50)',
            fontSize: 12,
            fontFamily: "'Season Sans', 'Inter', sans-serif",
            fontWeight: 400,
            lineHeight: '20px',
            userSelect: 'none',
            flexShrink: 0,
          }}
        >
          {lines.map((_, idx) => (
            <div key={idx} style={{ height: 20, minHeight: 20 }}>
              {idx + 1}
            </div>
          ))}
        </div>

        {/* Code lines */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {lines.map((line, idx) => (
            <div
              key={idx}
              style={{
                height: 20,
                minHeight: 20,
                whiteSpace: 'pre',
                lineHeight: '20px',
              }}
            >
              {highlightLine(line)}
            </div>
          ))}
        </div>
      </div>

      {/* Copy button */}
      <button
        onClick={onCopy}
        style={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          width: 24,
          height: 24,
          padding: 4,
          borderRadius: 4,
          outline: '1px var(--NEUTRAL-200, #2E2E2E) solid',
          outlineOffset: '-1px',
          justifyContent: 'center',
          alignItems: 'center',
          display: 'inline-flex',
          background: 'var(--white, #1A1A1A)',
          border: 'none',
          cursor: 'pointer',
          zIndex: 5,
        }}
        title={copied ? 'Copied!' : 'Copy SPARQL'}
      >
        {copied ? <Check size={12} color="#63BA8C" /> : <Copy size={12} color="var(--NEUTRAL-600, #A3A3A3)" />}
      </button>
    </div>
  );
}

// ─── Knowledge Graph Sidebar (floating card) ──────────────────────────────────
function KnowledgeGraphSidebar({ graphTab, setGraphTab, query, setQuery, onRunAnalysis, sparqlQuery, nodeCount, limit, setLimit }: {
  graphTab: GraphTab; setGraphTab: (t: GraphTab) => void;
  query: string; setQuery: (q: string) => void;
  onRunAnalysis: () => void;
  sparqlQuery?: string;
  nodeCount?: number;
  limit: string;
  setLimit: (l: string) => void;
}) {
  const [techExpanded, setTechExpanded] = useState(true);
  const [sparqlTab, setSparqlTab] = useState<'select' | 'construct'>('select');
  const [model, setModel] = useState('haiku');
  const [copied, setCopied] = useState(false);

  const baseSparql = sparqlQuery ?? `PREFIX samba: <http://samba.tv/ontology/graph#>\nSELECT ?household ?exp\nWHERE {\n  GRAPH <http://samba.tv/data/identity/> {\n    ?household a samba:Household ;\n      samba:stateOfResidence "Texas" .\n  }\n}\nLIMIT ${limit}`;
  const activeSparqlCode = baseSparql.replace(/LIMIT\s+\d+/i, `LIMIT ${limit}`);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSparqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="flex flex-col shrink-0 hide-scrollbar"
      style={{
        width: 290,
        padding: 12,
        background: 'var(--NEUTRAL-100, #222222)',
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
        borderRadius: 8,
        gap: 18,
        maxHeight: 'calc(100vh - 90px)',
        overflowY: 'auto',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Title */}
      <div style={{ alignSelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', display: 'inline-flex' }}>
        <div style={{ color: 'var(--black, #E5E5E5)', fontSize: 20, fontFamily: "'Season Mix', 'Newsreader', serif", fontWeight: 580, lineHeight: '30px' }}>
          Knowledge Graph
        </div>
      </div>

      {/* Display */}
      <div style={{ alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 10, display: 'flex' }}>
        <div style={{ alignSelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', display: 'inline-flex' }}>
          <div style={{ color: 'var(--NEUTRAL-600, #A3A3A3)', fontSize: 14, fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 400, lineHeight: '20px' }}>
            Display
          </div>
          <div style={{ color: 'var(--NEUTRAL-400, #636363)', fontSize: 12, fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 400, lineHeight: '16px' }}>
            {nodeCount ?? 20} nodes
          </div>
        </div>
        <div style={{ alignSelf: 'stretch', height: 32, padding: 4, background: 'var(--white, #1A1A1A)', borderRadius: 4, justifyContent: 'center', alignItems: 'center', gap: 4, display: 'inline-flex' }}>
          <button
            onClick={() => setGraphTab('graph')}
            style={{
              flex: '1 1 0',
              alignSelf: 'stretch',
              background: graphTab === 'graph' ? 'var(--whiteAlpha-50, rgba(255, 255, 255, 0.04))' : 'transparent',
              borderRadius: 4,
              justifyContent: 'center',
              alignItems: 'center',
              gap: 10,
              display: 'flex',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <div style={{ color: graphTab === 'graph' ? 'var(--black, #E5E5E5)' : 'var(--NEUTRAL-500, #8A8A8A)', fontSize: 14, fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 400, lineHeight: '20px' }}>
              Graph
            </div>
          </button>
          <button
            onClick={() => setGraphTab('table')}
            style={{
              flex: '1 1 0',
              alignSelf: 'stretch',
              background: graphTab === 'table' ? 'var(--whiteAlpha-50, rgba(255, 255, 255, 0.04))' : 'transparent',
              borderRadius: 4,
              justifyContent: 'center',
              alignItems: 'center',
              gap: 10,
              display: 'flex',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <div style={{ color: graphTab === 'table' ? 'var(--black, #E5E5E5)' : 'var(--NEUTRAL-500, #8A8A8A)', fontSize: 14, fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 400, lineHeight: '20px' }}>
              Results table
            </div>
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div style={{ alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'flex' }}>
        <div style={{ alignSelf: 'stretch', color: 'var(--NEUTRAL-600, #A3A3A3)', fontSize: 14, fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 400, lineHeight: '20px' }}>
          Instructions
        </div>
        <textarea
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Households that like comedy and read about sports"
          className="resize-none outline-none"
          style={{
            alignSelf: 'stretch',
            height: 128,
            paddingLeft: 12,
            paddingRight: 12,
            paddingTop: 8,
            paddingBottom: 8,
            background: 'var(--white, #1A1A1A)',
            borderRadius: 4,
            border: 'none',
            color: 'var(--black, #E5E5E5)',
            fontSize: 14,
            fontFamily: "'Season Sans', 'Inter', sans-serif",
            fontWeight: 400,
            lineHeight: '20px',
          }}
        />
        <SuggestionSlider currentQuery={query} onSelect={setQuery} />
      </div>

      {/* Divider */}
      <div style={{ alignSelf: 'stretch', height: 0, outline: '1px var(--NEUTRAL-200, #2E2E2E) solid', outlineOffset: '-0.50px' }} />

      {/* Limit */}
      <div style={{ alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 16, display: 'inline-flex' }}>
        <div style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'inline-flex' }}>
          <SelectDropdown label="Limit" options={LIMITS} value={limit} onChange={setLimit} />
        </div>
      </div>

      {/* Technical details */}
      <div style={{ alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 10, display: 'flex' }}>
        <div style={{ alignSelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', display: 'inline-flex' }}>
          <div style={{ color: 'var(--NEUTRAL-600, #A3A3A3)', fontSize: 14, fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 400, lineHeight: '20px' }}>
            Technical details
          </div>
          <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: 12, display: 'flex' }}>
            <button
              onClick={() => setTechExpanded(p => !p)}
              style={{
                width: 24,
                height: 24,
                padding: 4,
                borderRadius: 4,
                outline: '1px var(--NEUTRAL-200, #2E2E2E) solid',
                outlineOffset: '-1px',
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
              title="Toggle details"
            >
              {techExpanded ? <ChevronUp size={14} color="#E5E5E5" /> : <ChevronDown size={14} color="#E5E5E5" />}
            </button>
          </div>
        </div>

        {techExpanded && (
          <>
            <div style={{ alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'flex' }}>
              <SelectDropdown options={MODELS} value={model} onChange={setModel} />
            </div>
            <div style={{ alignSelf: 'stretch', height: 32, padding: 4, background: 'var(--white, #1A1A1A)', borderRadius: 4, justifyContent: 'center', alignItems: 'center', gap: 4, display: 'inline-flex' }}>
              <button
                onClick={() => setSparqlTab('select')}
                style={{
                  flex: '1 1 0',
                  alignSelf: 'stretch',
                  background: sparqlTab === 'select' ? 'var(--whiteAlpha-50, rgba(255, 255, 255, 0.04))' : 'transparent',
                  borderRadius: 4,
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 10,
                  display: 'flex',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <div style={{ color: sparqlTab === 'select' ? 'var(--black, #E5E5E5)' : 'var(--NEUTRAL-500, #8A8A8A)', fontSize: 14, fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 400, lineHeight: '20px' }}>
                  Select
                </div>
              </button>
              <button
                onClick={() => setSparqlTab('construct')}
                style={{
                  flex: '1 1 0',
                  alignSelf: 'stretch',
                  background: sparqlTab === 'construct' ? 'var(--whiteAlpha-50, rgba(255, 255, 255, 0.04))' : 'transparent',
                  borderRadius: 4,
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 10,
                  display: 'flex',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <div style={{ color: sparqlTab === 'construct' ? 'var(--NEUTRAL-500, #8A8A8A)' : 'var(--NEUTRAL-500, #8A8A8A)', fontSize: 14, fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 400, lineHeight: '20px' }}>
                  Construct
                </div>
              </button>
            </div>
            <SparqlCodeViewer code={activeSparqlCode} onCopy={handleCopy} copied={copied} />
          </>
        )}
      </div>

      {/* Run Analysis Button */}
      <button
        onClick={onRunAnalysis}
        className="cursor-pointer"
        style={{
          alignSelf: 'stretch',
          height: 40,
          paddingLeft: 16,
          paddingRight: 16,
          background: 'var(--PACIFIC--BLUE-500, #6781A8)',
          borderRadius: 6,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
          display: 'inline-flex',
          border: 'none',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        <div style={{ color: 'white', fontSize: 16, fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 400, lineHeight: '24px' }}>
          Run Analysis
        </div>
      </button>
    </div>
  );
}

// ─── Divider pill ─────────────────────────────────────────────────────────────
function PillDivider() {
  return <div style={{ width: 1, height: 18, backgroundColor: '#3a3a3a', flexShrink: 0 }} />;
}

// ─── Graph Editor Panel ───────────────────────────────────────────────────────
const GROUP_META: { type: NodeType; label: string }[] = [
  { type: 'genre',              label: 'Genre (Hub)' },
  { type: 'topic',              label: 'Topic (Hub)' },
  { type: 'household',          label: 'Household' },
  { type: 'individual',         label: 'Individual Person' },
  { type: 'device',             label: 'Connected Device' },
  { type: 'cookie_or_ip',       label: 'Cookie / IP Bridge' },
  { type: 'series',             label: 'Content Series' },
  { type: 'experian_household', label: 'Experian Household' },
  { type: 'state',              label: 'Geographic State' },
  { type: 'income_bracket',     label: 'Income Bracket' },
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

type EditorTab = 'nodes' | 'lines' | 'selection' | 'labels';

function GraphEditorPanel({ config, onChange, onClose }: {
  config: GraphConfig;
  onChange: (c: GraphConfig) => void;
  onClose: () => void;
}) {
  const panelWidth = 296;
  const [activeTab, setActiveTab] = useState<EditorTab>('selection');
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

  const tabs: { id: EditorTab; label: string }[] = [
    { id: 'nodes', label: 'Nodes' },
    { id: 'lines', label: 'Lines' },
    { id: 'selection', label: 'Selection' },
    { id: 'labels', label: 'Labels' },
  ];

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
        style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', zIndex: 10, touchAction: 'none' }}
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

      {/* Tabs Bar */}
      <div className="flex items-center p-1.5 mx-2.5 mt-2.5 rounded-lg" style={{ backgroundColor: 'var(--bg-card-alt)', border: '1px solid var(--border-mid)' }}>
        {tabs.map(t => {
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className="flex-1 py-1 text-center rounded transition-all cursor-pointer"
              style={{
                fontFamily: "'Season Sans', 'Inter', sans-serif",
                fontSize: 11,
                fontWeight: active ? 600 : 400,
                color: active ? '#ffffff' : 'var(--text-muted)',
                backgroundColor: active ? 'var(--bg-card)' : 'transparent',
                boxShadow: active ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
                border: 'none',
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="p-3 flex flex-col gap-0">
        {/* ════════════════════════════════════════════════════════════════════
            TAB 1: NODES
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'nodes' && (
          <>
            <div className="mb-1" style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 10, fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', paddingLeft: 4, marginBottom: 6 }}>
              Overall Scale
            </div>
            <div className="flex flex-col gap-2 rounded-lg p-3" style={{ backgroundColor: 'var(--bg-card-alt)', marginBottom: 8 }}>
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>
                  Global Scale
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>
                  {((config.globalScale ?? 1.0) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 11, color: 'var(--text-muted)', width: 32, flexShrink: 0 }}>Scale</span>
                <input
                  type="range"
                  min={0.3}
                  max={2.5}
                  step={0.05}
                  value={config.globalScale ?? 1.0}
                  onChange={e => onChange({ ...config, globalScale: parseFloat(e.target.value) })}
                  style={{ flex: 1, accentColor: 'var(--accent)', height: 4 }}
                />
              </div>
            </div>

            <div className="mb-1" style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 10, fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', paddingLeft: 4, marginBottom: 6 }}>
              Node Glow Aura
            </div>
            <div className="flex flex-col gap-2 rounded-lg p-3" style={{ backgroundColor: 'var(--bg-card-alt)', marginBottom: 8 }}>
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text)', fontWeight: 500, flex: 1 }}>Base glow</span>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)', width: 32, textAlign: 'right' }}>
                  {(config.glowIntensity ?? 0.25).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 11, color: 'var(--text-muted)', width: 32, flexShrink: 0 }}>Glow</span>
                <input type="range" min={0} max={1} step={0.01} value={config.glowIntensity ?? 0.25}
                  onChange={e => onChange({ ...config, glowIntensity: parseFloat(e.target.value) })}
                  style={{ flex: 1, accentColor: 'var(--accent)', height: 4 }} />
              </div>
            </div>

            <div className="mb-1" style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 10, fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', paddingLeft: 4, marginBottom: 6 }}>
              Node Categories
            </div>
            {GROUP_META.map(({ type, label }) => (
              <EditorRow key={type}
                label={label} color={config.colors[type]} colorDot
                sliderMin={0.3} sliderMax={2.5} sliderStep={0.05} sliderValue={config.sizes[type]} sliderLabel="Size"
                onColorChange={hex => onChange({ ...config, colors: { ...config.colors, [type]: hex } })}
                onSliderChange={val => onChange({ ...config, sizes: { ...config.sizes, [type]: val } })}
              />
            ))}
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            TAB 2: LINES
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'lines' && (
          <>
            <div className="mb-1" style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 10, fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', paddingLeft: 4, marginBottom: 6 }}>
              Network Visibility
            </div>
            <div className="flex flex-col gap-2.5 rounded-lg p-3" style={{ backgroundColor: 'var(--bg-card-alt)', marginBottom: 8 }}>
              <div className="flex items-center justify-between">
                <div>
                  <div style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>
                    Show All Network Lines
                  </div>
                  <div style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>
                    Reveal hidden cross-links &amp; device endpoints
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.showAllEdges ?? false}
                    onChange={e => onChange({ ...config, showAllEdges: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4.5 bg-[#333333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[var(--accent)]" />
                </label>
              </div>
            </div>

            <div className="mb-1" style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 10, fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', paddingLeft: 4, marginBottom: 6 }}>
              Dotted Overlay &amp; Animated Flow Layer
            </div>
            <div className="flex flex-col gap-2.5 rounded-lg p-3" style={{ backgroundColor: 'var(--bg-card-alt)', marginBottom: 8 }}>
              <div className="flex items-center justify-between">
                <div>
                  <div style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>
                    Dotted Flow on Selection
                  </div>
                  <div style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>
                    Dynamic traveling dots over active links
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enableDottedOverlay !== false}
                    onChange={e => onChange({ ...config, enableDottedOverlay: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4.5 bg-[#333333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[var(--accent)]" />
                </label>
              </div>

              {/* Line Thickness (Grosor) */}
              <div className="flex items-center justify-between pt-1 border-t border-[var(--border-subtle)]">
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>
                  Dotted Line Thickness (Grosor)
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>
                  {(config.dottedLineWidth ?? 3.5).toFixed(1)} px
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 11, color: 'var(--text-muted)', width: 32, flexShrink: 0 }}>Width</span>
                <input
                  type="range"
                  min={1.0}
                  max={12.0}
                  step={0.5}
                  value={config.dottedLineWidth ?? 3.5}
                  onChange={e => onChange({ ...config, dottedLineWidth: parseFloat(e.target.value) })}
                  style={{ flex: 1, accentColor: 'var(--accent)', height: 4 }}
                />
              </div>

              {/* Flow Speed */}
              <div className="flex items-center justify-between pt-1">
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>
                  Flow Speed
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>
                  {(config.edgeDashSpeed ?? 1.5).toFixed(1)}×
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 11, color: 'var(--text-muted)', width: 32, flexShrink: 0 }}>Speed</span>
                <input
                  type="range"
                  min={0.2}
                  max={4.0}
                  step={0.1}
                  value={config.edgeDashSpeed ?? 1.5}
                  onChange={e => onChange({ ...config, edgeDashSpeed: parseFloat(e.target.value) })}
                  style={{ flex: 1, accentColor: 'var(--accent)', height: 4 }}
                />
              </div>

              {/* Dash & Gap */}
              <div className="flex items-center justify-between pt-1">
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>
                  Dash / Dot Spacing
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>
                  {config.dottedDashSize ?? 8} / {config.dottedGapSize ?? 6}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 11, color: 'var(--text-muted)', width: 32, flexShrink: 0 }}>Dash</span>
                <input
                  type="range"
                  min={2}
                  max={24}
                  step={1}
                  value={config.dottedDashSize ?? 8}
                  onChange={e => onChange({ ...config, dottedDashSize: parseInt(e.target.value, 10) })}
                  style={{ flex: 1, accentColor: 'var(--accent)', height: 4 }}
                />
              </div>
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 11, color: 'var(--text-muted)', width: 32, flexShrink: 0 }}>Gap</span>
                <input
                  type="range"
                  min={2}
                  max={24}
                  step={1}
                  value={config.dottedGapSize ?? 6}
                  onChange={e => onChange({ ...config, dottedGapSize: parseInt(e.target.value, 10) })}
                  style={{ flex: 1, accentColor: 'var(--accent)', height: 4 }}
                />
              </div>
            </div>

            <div className="mb-1" style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 10, fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', paddingLeft: 4, marginBottom: 6 }}>
              Base Line Categories (Continuous)
            </div>
            <EditorRow
              label="Affinity lines" color={config.edgeColor}
              accentColor="var(--accent)"
              sliderMin={0} sliderMax={1} sliderStep={0.01} sliderValue={config.edgeOpacity} sliderLabel="Opacity"
              onColorChange={hex => onChange({ ...config, edgeColor: hex })}
              onSliderChange={val => onChange({ ...config, edgeOpacity: val })}
            />
            <EditorRow
              label="Hub bridge lines" color={config.hubEdgeColor}
              accentColor="var(--accent)"
              sliderMin={0} sliderMax={1} sliderStep={0.01} sliderValue={config.hubEdgeOpacity ?? 0.55} sliderLabel="Opacity"
              onColorChange={hex => onChange({ ...config, hubEdgeColor: hex })}
              onSliderChange={val => onChange({ ...config, hubEdgeOpacity: val })}
            />
            <EditorRow
              label="Individual cross-links" color={config.individualEdgeColor ?? '#8e9aaf'}
              accentColor="var(--accent)"
              sliderMin={0} sliderMax={1} sliderStep={0.01} sliderValue={config.individualEdgeOpacity ?? 0.40} sliderLabel="Opacity"
              onColorChange={hex => onChange({ ...config, individualEdgeColor: hex })}
              onSliderChange={val => onChange({ ...config, individualEdgeOpacity: val })}
            />
            <EditorRow
              label="Device &amp; endpoints" color={config.deviceEdgeColor ?? '#5c7f99'}
              accentColor="var(--accent)"
              sliderMin={0} sliderMax={1} sliderStep={0.01} sliderValue={config.deviceEdgeOpacity ?? 0.35} sliderLabel="Opacity"
              onColorChange={hex => onChange({ ...config, deviceEdgeColor: hex })}
              onSliderChange={val => onChange({ ...config, deviceEdgeOpacity: val })}
            />
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            TAB 3: SELECTION & GLOW BLUR
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'selection' && (
          <>
            <div className="mb-1" style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 10, fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', paddingLeft: 4, marginBottom: 6 }}>
              Selection Color
            </div>
            <div className="flex flex-col gap-2.5 rounded-lg p-3" style={{ backgroundColor: 'var(--bg-card-alt)', marginBottom: 8 }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: config.selectionColor ?? '#ffffff', flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>
                    Highlight &amp; Active Line
                  </span>
                </div>
                <ColorSwatch value={config.selectionColor ?? '#ffffff'} onChange={hex => onChange({ ...config, selectionColor: hex })} />
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 pt-1">
                {[
                  { name: 'Pure White', hex: '#ffffff' },
                  { name: 'Sky Blue', hex: '#60a5fa' },
                  { name: 'Emerald', hex: '#38A169' },
                  { name: 'Coral Rose', hex: '#f43f5e' },
                  { name: 'Amber Gold', hex: '#facc15' },
                  { name: 'Magenta', hex: '#D53F8C' },
                ].map(p => (
                  <button
                    key={p.hex}
                    onClick={() => onChange({ ...config, selectionColor: p.hex })}
                    title={p.name}
                    className="flex-1 rounded transition-transform hover:scale-110 cursor-pointer"
                    style={{
                      height: 18,
                      backgroundColor: p.hex,
                      border: (config.selectionColor ?? '#ffffff').toLowerCase() === p.hex.toLowerCase() ? '2px solid #ffffff' : '1px solid rgba(255,255,255,0.15)',
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="mb-1" style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 10, fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', paddingLeft: 4, marginBottom: 6 }}>
              Dotted Flow Layer (Grosor &amp; Conexión)
            </div>
            <div className="flex flex-col gap-2.5 rounded-lg p-3" style={{ backgroundColor: 'var(--bg-card-alt)', marginBottom: 8 }}>
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>
                  Dotted Line Thickness (Grosor)
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>
                  {(config.dottedLineWidth ?? 3.5).toFixed(1)} px
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 11, color: 'var(--text-muted)', width: 32, flexShrink: 0 }}>Grosor</span>
                <input
                  type="range"
                  min={1.0}
                  max={12.0}
                  step={0.5}
                  value={config.dottedLineWidth ?? 3.5}
                  onChange={e => onChange({ ...config, dottedLineWidth: parseFloat(e.target.value) })}
                  style={{ flex: 1, accentColor: config.selectionColor ?? 'var(--accent)', height: 4 }}
                />
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[var(--border-subtle)]">
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>
                  Animated Line Connection
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.animateConnection !== false}
                    onChange={e => onChange({ ...config, animateConnection: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4.5 bg-[#333333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[var(--accent)]" />
                </label>
              </div>
            </div>

            <div className="mb-1" style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 10, fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', paddingLeft: 4, marginBottom: 6 }}>
              Selection Glow Blur &amp; Halo
            </div>
            <div className="flex flex-col gap-2 rounded-lg p-3" style={{ backgroundColor: 'var(--bg-card-alt)', marginBottom: 8 }}>
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>
                  Soft Blur Intensity
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>
                  {(config.selectionBlur ?? 1.0).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 11, color: 'var(--text-muted)', width: 32, flexShrink: 0 }}>Blur</span>
                <input
                  type="range"
                  min={0.0}
                  max={2.5}
                  step={0.05}
                  value={config.selectionBlur ?? 1.0}
                  onChange={e => onChange({ ...config, selectionBlur: parseFloat(e.target.value) })}
                  style={{ flex: 1, accentColor: config.selectionColor ?? 'var(--accent)', height: 4 }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 rounded-lg p-3" style={{ backgroundColor: 'var(--bg-card-alt)', marginBottom: 8 }}>
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>
                  Halo Mesh Opacity
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>
                  {((config.selectionHaloOpacity ?? 0.35) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 11, color: 'var(--text-muted)', width: 32, flexShrink: 0 }}>Halo</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.02}
                  value={config.selectionHaloOpacity ?? 0.35}
                  onChange={e => onChange({ ...config, selectionHaloOpacity: parseFloat(e.target.value) })}
                  style={{ flex: 1, accentColor: config.selectionColor ?? 'var(--accent)', height: 4 }}
                />
              </div>
            </div>
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            TAB 4: LABELS & TEXT
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'labels' && (
          <>
            <div className="mb-1" style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 10, fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', paddingLeft: 4, marginBottom: 6 }}>
              Text Sizing
            </div>
            <div className="flex flex-col gap-2 rounded-lg p-3" style={{ backgroundColor: 'var(--bg-card-alt)', marginBottom: 8 }}>
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>
                  Node Text Size
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>
                  {((config.textSize ?? 1.0) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 11, color: 'var(--text-muted)', width: 32, flexShrink: 0 }}>Size</span>
                <input
                  type="range"
                  min={0.4}
                  max={2.5}
                  step={0.05}
                  value={config.textSize ?? 1.0}
                  onChange={e => onChange({ ...config, textSize: parseFloat(e.target.value) })}
                  style={{ flex: 1, accentColor: 'var(--accent)', height: 4 }}
                />
              </div>
            </div>

            <div className="mb-1" style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 10, fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', paddingLeft: 4, marginBottom: 6 }}>
              Category Opacity Controls
            </div>

            {/* Individual SHAs Opacity */}
            <div className="flex flex-col gap-2 rounded-lg p-3" style={{ backgroundColor: 'var(--bg-card-alt)', marginBottom: 4 }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: config.colors.individual ?? '#EF3557' }} />
                  <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>
                    Individual SHAs Opacity
                  </span>
                </div>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>
                  {((config.individualTextOpacity ?? 0.75) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 11, color: 'var(--text-muted)', width: 32, flexShrink: 0 }}>SHA</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={config.individualTextOpacity ?? 0.75}
                  onChange={e => onChange({ ...config, individualTextOpacity: parseFloat(e.target.value) })}
                  style={{ flex: 1, accentColor: config.colors.individual ?? '#EF3557', height: 4 }}
                />
              </div>
            </div>

            {/* Household IDs Opacity */}
            <div className="flex flex-col gap-2 rounded-lg p-3" style={{ backgroundColor: 'var(--bg-card-alt)', marginBottom: 4 }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: config.colors.household ?? '#4E6E9D' }} />
                  <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>
                    Household IDs Opacity
                  </span>
                </div>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>
                  {((config.householdTextOpacity ?? 0.85) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 11, color: 'var(--text-muted)', width: 32, flexShrink: 0 }}>ID</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={config.householdTextOpacity ?? 0.85}
                  onChange={e => onChange({ ...config, householdTextOpacity: parseFloat(e.target.value) })}
                  style={{ flex: 1, accentColor: config.colors.household ?? '#4E6E9D', height: 4 }}
                />
              </div>
            </div>

            {/* Hub Titles Opacity */}
            <div className="flex flex-col gap-2 rounded-lg p-3" style={{ backgroundColor: 'var(--bg-card-alt)', marginBottom: 8 }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: config.colors.genre ?? '#38A169' }} />
                  <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>
                    Hub Titles Opacity
                  </span>
                </div>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>
                  {((config.hubTextOpacity ?? 1.0) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 11, color: 'var(--text-muted)', width: 32, flexShrink: 0 }}>Hub</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={config.hubTextOpacity ?? 1.0}
                  onChange={e => onChange({ ...config, hubTextOpacity: parseFloat(e.target.value) })}
                  style={{ flex: 1, accentColor: config.colors.genre ?? '#38A169', height: 4 }}
                />
              </div>
            </div>

            <div className="mb-1" style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 10, fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', paddingLeft: 4, marginBottom: 6 }}>
              Edge Relation Labels
            </div>

            {/* Edge Text Toggle */}
            <div className="flex items-center justify-between rounded-lg p-3" style={{ backgroundColor: 'var(--bg-card-alt)', marginBottom: 4 }}>
              <div className="flex items-center gap-1.5">
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>
                  Show Edge Text
                </span>
              </div>
              <button
                type="button"
                onClick={() => onChange({ ...config, showEdgeText: config.showEdgeText === false })}
                className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer"
                style={{ backgroundColor: config.showEdgeText !== false ? 'var(--accent)' : 'var(--border-mid)' }}
              >
                <span
                  className="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform"
                  style={{ transform: config.showEdgeText !== false ? 'translateX(18px)' : 'translateX(2px)' }}
                />
              </button>
            </div>

            {/* Edge Text Opacity */}
            <div className="flex flex-col gap-2 rounded-lg p-3" style={{ backgroundColor: 'var(--bg-card-alt)', marginBottom: 4 }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: config.edgeTextColor ?? '#888888' }} />
                  <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>
                    Edge Text Opacity
                  </span>
                </div>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>
                  {((config.edgeTextOpacity ?? 0.85) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 11, color: 'var(--text-muted)', width: 32, flexShrink: 0 }}>Alpha</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={config.edgeTextOpacity ?? 0.85}
                  onChange={e => onChange({ ...config, edgeTextOpacity: parseFloat(e.target.value) })}
                  style={{ flex: 1, accentColor: config.edgeTextColor ?? '#888888', height: 4 }}
                />
              </div>
            </div>

            {/* Edge Text Size & Color */}
            <EditorRow
              label="Edge relation style" color={config.edgeTextColor ?? '#888888'}
              accentColor="var(--accent)"
              sliderMin={0.2} sliderMax={2.0} sliderStep={0.05} sliderValue={config.edgeTextSize ?? 0.45} sliderLabel="Size"
              onColorChange={hex => onChange({ ...config, edgeTextColor: hex })}
              onSliderChange={val => onChange({ ...config, edgeTextSize: val })}
            />
          </>
        )}
      </div>

      {/* Reset */}
      <div className="px-3 pb-3">
        <button onClick={() => onChange(DEFAULT_GRAPH_CONFIG)}
          className="w-full flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-card-alt)] cursor-pointer"
          style={{ height: 32, backgroundColor: 'var(--bg-btn)', border: '1px solid var(--border)', fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-muted)' }}>
          Reset to defaults
        </button>
      </div>
    </div>
  );
}

function AppleBrandIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.56.65-.97 1.7-0.84 2.73.99.08 2.02-.48 2.54-1.23z"/>
    </svg>
  );
}

function AndroidBrandIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-4.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 2.23 12.95 2 12 2c-.96 0-1.86.23-2.66.63L7.85 1.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 4.26 6 6.01 6 8h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
    </svg>
  );
}

function CookieBrandIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
      <path d="M8.5 8.5v.01" />
      <path d="M7.5 15.5v.01" />
      <path d="M15.5 15.5v.01" />
      <path d="M11.5 12v.01" />
    </svg>
  );
}

const TYPE_LABELS: Record<NodeType, string> = {
  household: 'Household',
  device: 'Connected Device',
  cookie_or_ip: 'Cookie / IP Match',
  individual: 'Individual Person',
  genre: 'Genre (Affinity Hub)',
  topic: 'Topic (Interest Hub)',
  series: 'Content Series',
  experian_household: 'Experian Household',
  state: 'Geographic State Hub',
  income_bracket: 'Income Demographic Hub',
};

function NodeDetailPanel({ node, onClose, graphConfig }: { node: Node3DData; onClose: () => void; graphConfig?: GraphConfig }) {
  const [showCampaigns, setShowCampaigns] = useState(false);
  const isHousehold = node.type === 'household';
  const title = TYPE_LABELS[node.type] ?? 'Node';
  const subtitle = node.label;
  const devSummary = node.devicesSummary ?? { sambaTv: 1, apple: 2, android: 1, cookieOrIp: 3, total: 4 };
  const campaignsCount = node.campaignsCount ?? 4;

  return (
    <div
      className="flex flex-col gap-2.5 rounded-xl shrink-0 hide-scrollbar"
      style={{
        backgroundColor: '#1e1e1e',
        width: 275,
        padding: '12px 12px 14px 12px',
        maxHeight: 'calc(100vh - 105px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
        position: 'relative',
        zIndex: 10,
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-0.5 pr-2">
          <h2
            style={{
              fontFamily: "'Season Mix', 'Newsreader', serif",
              fontWeight: 400,
              fontSize: 19,
              color: '#f3f4f6',
              lineHeight: '23px',
              letterSpacing: '-0.2px',
            }}
          >
            {title}
          </h2>
          <span
            style={{
              fontSize: 13,
              color: '#9e9e9e',
              lineHeight: '18px',
              wordBreak: 'break-all',
            }}
          >
            {subtitle}
          </span>
        </div>
        <button
          onClick={onClose}
          className="flex items-center justify-center rounded p-1 hover:bg-[#2e2e2e] transition-colors cursor-pointer"
          style={{ width: 22, height: 22, background: 'transparent', border: '1px solid #2e2e2e', flexShrink: 0 }}
          title="Close details"
        >
          <X size={13} strokeWidth={1.5} color="#9e9e9e" />
        </button>
      </div>

      <div style={{ height: 1, backgroundColor: '#282828', margin: '2px 0' }} />

      {/* Household specific: Devices & Cookies breakdown */}
      {isHousehold ? (
        <div className="flex flex-col gap-3">
          {/* Devices Header & List */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 13, color: '#dedede', fontWeight: 400 }}>Devices</span>
              <span style={{ fontSize: 13, color: '#9e9e9e' }}>
                {devSummary.sambaTv + devSummary.apple + devSummary.android}
              </span>
            </div>

            <div className="flex flex-col gap-2.5 pl-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Tv size={16} strokeWidth={1.5} color="#9e9e9e" />
                  <span style={{ fontSize: 13, color: '#dedede' }}>Samba TV</span>
                </div>
                <span style={{ fontSize: 13, color: '#9e9e9e' }}>{devSummary.sambaTv}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <AppleBrandIcon size={16} />
                  <span style={{ fontSize: 13, color: '#dedede' }}>Apple</span>
                </div>
                <span style={{ fontSize: 13, color: '#9e9e9e' }}>{devSummary.apple}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <AndroidBrandIcon size={16} />
                  <span style={{ fontSize: 13, color: '#dedede' }}>Android</span>
                </div>
                <span style={{ fontSize: 13, color: '#9e9e9e' }}>{devSummary.android}</span>
              </div>
            </div>
          </div>

          <div style={{ height: 1, backgroundColor: '#282828' }} />

          {/* Cookies Header */}
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 13, color: '#dedede', fontWeight: 400 }}>Cookies</span>
            <span style={{ fontSize: 13, color: '#9e9e9e' }}>{devSummary.cookieOrIp ?? 3}</span>
          </div>

          <div style={{ height: 1, backgroundColor: '#282828' }} />
        </div>
      ) : (
        /* Non-household properties list */
        <div className="flex flex-col gap-2">
          {node.properties && node.properties.length > 0 ? (
            node.properties.map((p, idx) => (
              <div key={idx} className="flex flex-col gap-0.5 p-2 rounded-md" style={{ backgroundColor: '#141414' }}>
                <span style={{ fontSize: 11, color: '#737373', fontWeight: 500 }}>{p.label}</span>
                <span style={{ fontSize: 12.5, color: '#e5e5e5', wordBreak: 'break-all' }}>{p.value}</span>
              </div>
            ))
          ) : (
            <span style={{ fontSize: 12, color: '#737373', padding: '6px 0' }}>No additional properties</span>
          )}
        </div>
      )}

      {/* Action Button at bottom */}
      <div className="mt-1 flex flex-col gap-2">
        <button
          onClick={() => setShowCampaigns(prev => !prev)}
          className="w-full flex items-center justify-center rounded-lg transition-colors cursor-pointer"
          style={{
            height: 38,
            backgroundColor: '#282828',
            border: 'none',
            fontSize: 13,
            fontWeight: 400,
            color: '#dedede',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#353535'; e.currentTarget.style.color = '#ffffff'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#282828'; e.currentTarget.style.color = '#dedede'; }}
        >
          View past campaigns
        </button>

        {showCampaigns && (
          <div
            className="flex flex-col gap-1.5 p-3 rounded-lg text-left mt-1"
            style={{
              backgroundColor: '#141414',
              border: '1px solid #282828',
            }}
          >
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 12, fontWeight: 500, color: '#e5e5e5' }}>Campaign History</span>
              <span style={{ fontSize: 11, color: '#48bb78', fontWeight: 500 }}>Active Match</span>
            </div>
            <p style={{ fontSize: 11.5, color: '#9e9e9e', lineHeight: '16px', margin: 0 }}>
              Active in <strong style={{ color: '#ffffff' }}>{campaignsCount} past ad campaigns</strong> across Connected TV & Mobile (Q1–Q3 2026).
            </p>
          </div>
        )}
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
  const [limit, setLimit] = useState('20');
  const [page, setPage] = useState(1);
  const [selectedNode, setSelectedNode] = useState<Node3DData | null>(null);
  const graphRef = useRef<Graph3DHandle>(null);

  const limitNum = parseInt(limit, 10) || 20;

  useEffect(() => {
    setPage(1);
  }, [limit, localQuery]);

  const dataset = useMemo(() => getGraphDataset(localQuery, limitNum), [localQuery, limitNum]);
  const tableRows = useMemo(() => getTableRows(limitNum, dataset), [limitNum, dataset]);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(tableRows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, tableRows.length);
  const visibleRows = tableRows.slice(startIdx, endIdx);

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }
    if (currentPage >= totalPages - 2) {
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  const legendItems = [
    { label: 'Genre',      color: '#38A169', dot: true  },
    { label: 'Individual', color: '#EF3557', dot: true  },
    { label: 'Topic',      color: '#D53F8C', dot: true  },
    { label: 'Household',  color: '#4E6E9D', dot: true  },
    { label: 'Affinity',   color: 'var(--text-dim)', dot: false },
  ];

  return (
    // Outer wrapper — graph is the background, all UI floats with pointer-events management
    <div className="flex-1 relative overflow-hidden" style={{ backgroundColor: 'var(--bg, #1a1a1a)', minHeight: '100vh' }}>

      {/* ── Graph fills the entire background when in graph mode — hidden on table mode ── */}
      <div className="absolute inset-0" style={{ zIndex: 0, display: graphTab === 'graph' ? 'block' : 'none' }}>
        <Graph3D ref={graphRef} dataset={dataset} config={graphConfig} onNodeClick={setSelectedNode} />
      </div>

      {/* ── Overlay layer: pointer-events none so graph gets mouse/touch ── */}
      <div className="absolute inset-0 flex flex-col" style={{ zIndex: 10, pointerEvents: 'none' }}>

      {/* ── Top floating bar (only on graph tab) ── */}
      {graphTab === 'graph' && (
        <div className="flex items-center justify-center pt-3 pb-1 px-4" style={{ pointerEvents: 'none' }}>
          <div className="flex items-center gap-4 rounded-lg px-4 py-1.5 flex-wrap"
            style={{ backgroundColor: 'var(--bg-card)', boxShadow: '0 1px 1px rgba(0,0,0,0.05)', pointerEvents: 'auto' }}>

            {/* Stats */}
            <div className="flex gap-4 items-center">
              {[
                { val: dataset.metrics.peopleMatch, sub: 'People match' },
                { val: dataset.metrics.seedHousehold, sub: 'Seed household' }
              ].map(({ val, sub }) => (
                <div key={sub} className="flex flex-col items-center">
                  <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontWeight: 600, fontSize: 16, color: 'var(--text)', lineHeight: '22px' }}>{val}</span>
                  <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 10.5, color: 'var(--text-muted)', lineHeight: '14px' }}>{sub}</span>
                </div>
              ))}
            </div>

            <PillDivider />

            {/* Legend */}
            <div className="flex gap-3 items-center flex-wrap">
              {legendItems.map(({ label, color, dot }) => (
                <div key={label} className="flex gap-1.5 items-center">
                  {dot
                    ? <div className="rounded-full" style={{ width: 8, height: 8, backgroundColor: color }} />
                    : <div style={{ width: 8, height: 2, backgroundColor: color }} />}
                  <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text)', lineHeight: '16px' }}>{label}</span>
                </div>
              ))}
            </div>

            <PillDivider />

            {/* Counts */}
            <div className="flex gap-3 items-center">
              <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-dim)' }}>{dataset.nodes.length} nodes</span>
              <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-dim)' }}>{dataset.edges.length} edges</span>
            </div>

            <PillDivider />

            <button onClick={onNavigateAudience}
              className="flex items-center justify-center rounded-md transition-colors cursor-pointer"
              style={{ backgroundColor: 'var(--bg-btn)', padding: '0 10px', height: 28, fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-btn)', border: 'none' }}>
              Explore this audience
            </button>
          </div>
        </div>
      )}

      {/* ── Content row: left sidebar + optional table + right node detail card ── */}
      <div className={`flex flex-1 items-start justify-between ${graphTab === 'table' ? 'p-6 gap-8' : 'p-4 gap-4'}`} style={{ pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }}>
          <KnowledgeGraphSidebar
            graphTab={graphTab} setGraphTab={setGraphTab}
            query={localQuery} setQuery={setLocalQuery}
            sparqlQuery={dataset.sparqlQuery}
            nodeCount={dataset.nodes.length}
            limit={limit} setLimit={setLimit}
            onRunAnalysis={() => {}}
          />
        </div>

        {/* Results table (Exact Figma Design) */}
        {graphTab === 'table' && (
          <div className="flex flex-col flex-1 pl-4 pr-8 pt-2" style={{ pointerEvents: 'auto' }}>
            {/* Header with Title & Export Button */}
            <div className="flex items-center justify-between pb-6">
              <h1 style={{ fontFamily: "'Season Mix', 'Newsreader', serif", fontSize: 32, fontWeight: 400, color: '#f3f4f6', letterSpacing: '-0.01em' }}>
                Result bindings
              </h1>
              <button
                onClick={() => {
                  const header = 'House Hold,SambaId,Genre Score,Topic Score\n';
                  const csv = header + tableRows.map(r => `"${r.household}","${r.sambaId}","${r.genreScore}","${r.topicScore}"`).join('\n');
                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'result_bindings.csv';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center gap-2 rounded px-3.5 py-1.5 transition-colors hover:bg-[#2e2e32] cursor-pointer"
                style={{
                  backgroundColor: '#222224',
                  border: '1px solid #38383c',
                  fontFamily: "'Season Sans', 'Inter', sans-serif",
                  fontSize: 13,
                  fontWeight: 400,
                  color: '#d1d5db',
                }}
              >
                Export to CSV
              </button>
            </div>

            {/* Table */}
            <div className="w-full">
              <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #222226' }}>
                    <th style={{ padding: '0 0 16px 0', fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: '#8e8e93', width: '38%' }}>
                      House Hold
                    </th>
                    <th style={{ padding: '0 0 16px 0', fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: '#8e8e93', width: '34%' }}>
                      Sambald
                    </th>
                    <th style={{ padding: '0 0 16px 0', fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: '#8e8e93', textAlign: 'right', width: '14%' }}>
                      Genre Score
                    </th>
                    <th style={{ padding: '0 0 16px 0', fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: '#8e8e93', textAlign: 'right', width: '14%' }}>
                      Topic Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((row, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors" style={{ borderBottom: '1px solid #1c1c1f' }}>
                      <td style={{ padding: '14px 0', fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 14, color: '#f3f4f6' }}>
                        {row.household}
                      </td>
                      <td style={{ padding: '14px 0', fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 14, color: '#f3f4f6' }}>
                        {row.sambaId}
                      </td>
                      <td style={{ padding: '14px 0', fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 14, color: '#f3f4f6', textAlign: 'right' }}>
                        {row.genreScore}
                      </td>
                      <td style={{ padding: '14px 0', fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 14, color: '#f3f4f6', textAlign: 'right' }}>
                        {row.topicScore}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-6">
              <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 13, color: '#71717a' }}>
                Showing {tableRows.length > 0 ? `${startIdx + 1}–${endIdx}` : 0} of {tableRows.length} results
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center p-1 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  style={{ color: '#8e8e93', background: 'transparent', border: 'none' }}
                >
                  <ChevronLeft size={16} strokeWidth={1.5} />
                </button>
                {getPageNumbers().map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="flex items-center justify-center rounded text-xs transition-colors cursor-pointer"
                    style={{
                      width: 26,
                      height: 26,
                      backgroundColor: currentPage === p ? '#27272a' : 'transparent',
                      border: currentPage === p ? '1px solid #3f3f46' : '1px solid transparent',
                      color: currentPage === p ? '#ffffff' : '#71717a',
                      fontFamily: "'Season Sans', 'Inter', sans-serif",
                      fontWeight: currentPage === p ? 500 : 400
                    }}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center p-1 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  style={{ color: '#8e8e93', background: 'transparent', border: 'none' }}
                >
                  <ChevronRight size={16} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Right floating card when a node is selected */}
        {selectedNode && graphTab === 'graph' && (
          <div style={{ pointerEvents: 'auto' }}>
            <NodeDetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} graphConfig={graphConfig} />
          </div>
        )}
      </div>

      {/* ── Bottom floating bar (only on graph tab) ── */}
      {graphTab === 'graph' && (
        <div className="flex items-center justify-center pb-3 pt-1 px-4" style={{ pointerEvents: 'none' }}>
          <div className="flex items-center gap-4 rounded-lg px-4 py-1.5"
            style={{ backgroundColor: 'var(--bg-card)', boxShadow: '0 1px 1px rgba(0,0,0,0.05)', pointerEvents: 'auto' }}>
            <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-dim)', lineHeight: '16px' }}>
              Showing {dataset.nodes.length} nodes · {dataset.edges.length} edges
            </span>
            <PillDivider />
            <span style={{ fontFamily: "'Season Sans', 'Inter', sans-serif", fontSize: 12, color: 'var(--text-dim)', lineHeight: '16px' }}>
              Click on any node for details & connections. Double-click to expand.
            </span>
          </div>
        </div>
      )}

      </div>{/* end overlay layer */}

      {/* ── Graph editor panel ── */}
      {showGraphEditor && (
        <GraphEditorPanel config={graphConfig} onChange={onUpdateConfig} onClose={onCloseEditor} />
      )}

      {/* ── Zoom / pan controls (only on graph tab) ── */}
      {graphTab === 'graph' && (
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
      )}
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

// ─── Audience Profile (Cohort View) ──────────────────────────────────────────
function getStateTileColor(val: number) {
  const norm = Math.max(0, Math.min(1, (val - 0.8) / 0.7));
  const r = Math.round(35 + norm * (103 - 35));
  const g = Math.round(48 + norm * (129 - 48));
  const b = Math.round(68 + norm * (168 - 68));
  return `rgb(${r}, ${g}, ${b})`;
}

function StateCartogram({ tiles }: { tiles: typeof audienceData.stateTiles }) {
  // 7 rows x 11 columns grid
  const grid = Array.from({ length: 7 }, () => Array(11).fill(null));
  tiles.forEach(t => {
    if (grid[t.r]) grid[t.r][t.c] = t;
  });

  return (
    <div className="flex flex-col gap-[3px] select-none">
      {grid.map((row, ri) => (
        <div key={ri} className="flex gap-[3px]">
          {row.map((cell, ci) => {
            if (!cell) {
              return <div key={ci} className="w-[20px] h-[19px]" />;
            }
            return (
              <div
                key={ci}
                className="w-[20px] h-[19px] rounded-[3px] flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                style={{
                  backgroundColor: getStateTileColor(cell.val),
                }}
                title={`${cell.code}: ${cell.val.toFixed(2)}×`}
              >
                <span style={{ fontSize: 8, fontWeight: 500, color: 'rgba(255,255,255,0.85)', letterSpacing: '-0.2px' }}>
                  {cell.code}
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function AudienceView({ onBackToGraph }: { onBackToGraph?: () => void }) {
  const d = audienceData;

  return (
    <div
      className="flex flex-1 flex-col overflow-y-auto hide-scrollbar"
      style={{
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        minHeight: '100vh',
        padding: '36px 40px 48px 40px',
        fontFamily: "'Season Sans', 'Inter', sans-serif",
      }}
    >
      <div className="max-w-[1120px] w-full mx-auto flex flex-col gap-5 flex-1">
        {/* Header Row */}
        <div className="flex items-center justify-between pb-2 w-full">
          <h1 style={{ fontFamily: "'Season Mix', 'Newsreader', serif", fontSize: 30, fontWeight: 400, color: '#e5e5e5', letterSpacing: '-0.3px', margin: 0 }}>
            Cohort Profile
          </h1>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-5">
              <div className="flex flex-col items-center justify-center text-center">
                <span style={{ fontSize: 12, color: '#8a8a8a', lineHeight: '16px' }}>Households</span>
                <span style={{ fontFamily: "'Season Mix', 'Newsreader', serif", fontSize: 30, fontWeight: 400, color: '#e5e5e5', lineHeight: '34px' }}>{d.households}</span>
              </div>
              <div style={{ width: 1, height: 36, backgroundColor: '#2e2e2e' }} />
              <div className="flex flex-col items-center justify-center text-center">
                <span style={{ fontSize: 12, color: '#8a8a8a', lineHeight: '16px' }}>Est. population</span>
                <span style={{ fontFamily: "'Season Mix', 'Newsreader', serif", fontSize: 30, fontWeight: 400, color: '#e5e5e5', lineHeight: '34px' }}>{d.population}</span>
              </div>
            </div>
            {onBackToGraph && (
              <button
                onClick={onBackToGraph}
                className="flex items-center justify-center rounded-[6px] transition-colors cursor-pointer"
                style={{
                  border: '1px solid #6781a8',
                  backgroundColor: 'transparent',
                  color: '#6781a8',
                  height: 40,
                  padding: '0 16px',
                  fontSize: 15,
                  fontWeight: 400,
                  fontFamily: "'Season Sans', 'Inter', sans-serif",
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(103, 129, 168, 0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                Back to graph
              </button>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col gap-5 flex-1">
          {/* Top Row: Also interested in + Where they live */}
          <div className="grid grid-cols-12 gap-5">
            {/* Also interested in (7 cols) */}
            <div
              className="col-span-12 lg:col-span-7 flex flex-col justify-between rounded-[12px] p-6"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #2e2e2e',
              }}
            >
            <div>
              <h2 style={{ fontFamily: "'Season Mix', 'Newsreader', serif", fontSize: 20, fontWeight: 400, color: '#ffffff', lineHeight: '24px' }}>
                Also interested in
              </h2>
              <p style={{ fontSize: 12, color: '#8a8a8a', marginTop: 4, marginBottom: 18 }}>
                Index vs. all households — 1.00× is average. Click a row to add it as a seed.
              </p>

              {/* Items List */}
              <div className="flex flex-col gap-3">
                {d.alsoInterestedIn.map(item => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div
                      className="rounded-full shrink-0"
                      style={{
                        width: 6,
                        height: 6,
                        backgroundColor: item.type === 'genre' ? '#6781a8' : '#e87f9b',
                      }}
                    />
                    <span
                      style={{
                        fontSize: 13,
                        color: '#dedede',
                        width: 140,
                        flexShrink: 0,
                        fontWeight: 400,
                      }}
                    >
                      {item.name}
                    </span>

                    {/* Progress Bar Track */}
                    <div className="flex-1 rounded-full overflow-hidden" style={{ height: 6, backgroundColor: '#202020' }}>
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${item.pct * 100}%`,
                          backgroundColor: '#6781a8',
                        }}
                      />
                    </div>

                    <span style={{ fontSize: 13, fontWeight: 500, color: '#ffffff', width: 38, textAlign: 'right', flexShrink: 0 }}>
                      {item.index}
                    </span>
                    <span style={{ fontSize: 13, color: '#737373', width: 44, textAlign: 'right', flexShrink: 0 }}>
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-5 pt-3">
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#6781a8' }} />
                  <span style={{ fontSize: 12, color: '#8a8a8a' }}>Genre</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#e87f9b' }} />
                  <span style={{ fontSize: 12, color: '#8a8a8a' }}>Topic</span>
                </div>
              </div>
              <span style={{ fontSize: 12, color: '#666666' }}>households co-occurring</span>
            </div>
          </div>

          {/* Where they live (5 cols) */}
          <div
            className="col-span-12 lg:col-span-5 flex flex-col justify-between rounded-2xl p-6"
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #2e2e2e',
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <h2 style={{ fontFamily: "'Season Mix', 'Newsreader', serif", fontSize: 20, fontWeight: 400, color: '#ffffff', lineHeight: '24px' }}>
                  Where they live
                </h2>
                <div className="flex items-center gap-1.5">
                  <span style={{ fontSize: 12, color: '#8a8a8a' }}>0.8×</span>
                  <div
                    className="w-10 rounded-full"
                    style={{
                      height: 4,
                      background: 'linear-gradient(to right, rgb(35, 48, 68), rgb(103, 129, 168))',
                    }}
                  />
                  <span style={{ fontSize: 12, color: '#8a8a8a' }}>1.5×</span>
                </div>
              </div>
              <p style={{ fontSize: 12, color: '#8a8a8a', marginBottom: 18 }}>
                State index vs. national baseline - state is the finest geography in the graph
              </p>

              {/* Cartogram + Top States */}
              <div className="flex items-start justify-between gap-4">
                <StateCartogram tiles={d.stateTiles} />

                {/* Top States List */}
                <div className="flex flex-col gap-2 shrink-0 pr-2">
                  <span style={{ fontSize: 10, letterSpacing: '0.5px', color: '#666666', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>
                    TOP STATES
                  </span>
                  {d.topStates.map(s => (
                    <div key={s.name} className="flex items-center justify-between gap-5">
                      <span style={{ fontSize: 13, color: '#dedede', fontWeight: 400 }}>{s.name}</span>
                      <span style={{ fontSize: 13, color: '#ffffff', fontWeight: 500 }}>{s.index}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p style={{ fontSize: 11, color: '#555555', marginTop: 14 }}>
              Graph stores full state names — map codes client-side.
            </p>
          </div>
        </div>

        {/* Bottom Row: 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Age */}
          <div
            className="flex flex-col justify-between rounded-2xl p-5"
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #2e2e2e',
              minHeight: 180,
            }}
          >
            <div>
              <h3 style={{ fontFamily: "'Season Mix', 'Newsreader', serif", fontSize: 18, fontWeight: 400, color: '#ffffff', lineHeight: '22px' }}>Age</h3>
              <p style={{ fontSize: 11, color: '#8a8a8a', marginTop: 2, marginBottom: 16 }}>People per band, summed</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-end justify-between gap-1 h-[68px] w-full px-0.5">
                {d.ageBands.map((v, i) => {
                  const max = 75;
                  const h = (v / max) * 100;
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-t-[2px] transition-all hover:opacity-85"
                      style={{
                        height: `${h}%`,
                        backgroundColor: '#6781a8',
                      }}
                      title={`${d.ageBandLabels[i]}: ${v}%`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between w-full">
                {d.ageBandLabels.map((lbl, i) => (
                  <span key={i} style={{ fontSize: 8, color: '#555555', textAlign: 'center', flex: 1 }}>
                    {lbl}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Household Income */}
          {/* Household income */}
          <div
            className="flex flex-col justify-between rounded-2xl p-5"
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #222222',
              minHeight: 180,
            }}
          >
            <div>
              <h3 style={{ fontFamily: "'Season Mix', 'Newsreader', serif", fontSize: 18, fontWeight: 400, color: '#ffffff', lineHeight: '22px' }}>Household income</h3>
              <p style={{ fontSize: 11, color: '#8a8a8a', marginTop: 2, marginBottom: 16 }}>11 bands · skews mid-market</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-end justify-between gap-1 h-[68px] w-full px-0.5">
                {d.incomes.map((v, i) => {
                  const max = 75;
                  const h = (v / max) * 100;
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-t-[2px] transition-all hover:opacity-85"
                      style={{
                        height: `${h}%`,
                        backgroundColor: '#6781a8',
                      }}
                      title={`${d.incomeLabels[i]}: ${v}%`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between w-full">
                {d.incomeLabels.map((lbl, i) => (
                  <span key={i} style={{ fontSize: 7.5, color: '#555555', textAlign: 'center', flex: 1 }}>
                    {lbl}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Race & Ethnicity */}
          <div
            className="flex flex-col justify-between rounded-2xl p-5"
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #222222',
              minHeight: 180,
            }}
          >
            <div>
              <h3 style={{ fontFamily: "'Season Mix', 'Newsreader', serif", fontSize: 18, fontWeight: 400, color: '#ffffff', lineHeight: '22px' }}>Race &amp; ethnicity</h3>
              <p style={{ fontSize: 11, color: '#8a8a8a', marginTop: 2, marginBottom: 14 }}>People per band, summed</p>
            </div>

            <div className="flex flex-col gap-2">
              {d.race.map(r => (
                <div key={r.label} className="flex items-center gap-2">
                  <span style={{ fontSize: 12, color: '#dedede', width: 55, flexShrink: 0 }}>{r.label}</span>
                  <div className="flex-1 rounded-full overflow-hidden" style={{ height: 5, backgroundColor: '#202020' }}>
                    <div className="h-full rounded-full" style={{ width: `${r.pct * 100}%`, backgroundColor: '#6781a8' }} />
                  </div>
                  <span style={{ fontSize: 12, color: '#737373', width: 38, textAlign: 'right', flexShrink: 0 }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Household Makeup */}
          <div
            className="flex flex-col justify-between rounded-2xl p-5"
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #222222',
              minHeight: 180,
            }}
          >
            <div>
              <h3 style={{ fontFamily: "'Season Mix', 'Newsreader', serif", fontSize: 18, fontWeight: 400, color: '#ffffff', lineHeight: '22px' }}>Household makeup</h3>
              <p style={{ fontSize: 11, color: '#8a8a8a', marginTop: 2, marginBottom: 12 }}>Average per household</p>

              <div className="flex flex-col gap-2">
                {[
                  { label: 'Household size', val: d.householdMakeup.size },
                  { label: 'Adults', val: d.householdMakeup.adults },
                  { label: 'Children', val: d.householdMakeup.children },
                ].map(({ label, val }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span style={{ fontSize: 12, color: '#9e9e9e' }}>{label}</span>
                    <span style={{ fontFamily: "'Season Mix', 'Newsreader', serif", fontSize: 18, fontWeight: 400, color: '#ffffff' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span style={{ fontSize: 11, color: '#737373' }}>Male {d.householdMakeup.male}</span>
                <span style={{ fontSize: 11, color: '#737373' }}>Female {d.householdMakeup.female}</span>
              </div>
              <div className="flex rounded-full overflow-hidden" style={{ height: 5 }}>
                <div style={{ flex: d.householdMakeup.malePct, backgroundColor: '#6781a8' }} />
                <div style={{ flex: d.householdMakeup.femalePct, backgroundColor: '#d9485c' }} />
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
        {view === 'audience' && <AudienceView onBackToGraph={() => setView('graph')} />}
        {showGenres && <GenresModal onClose={() => setShowGenres(false)} selectedGenres={selGenres} onConfirm={ids => setSelGenres(ids)} />}
      </div>
    </ThemeCtx.Provider>
  );
}
