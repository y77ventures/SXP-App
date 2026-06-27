// SingaporeRegionMap — SVG clickable region selector
// Design: Aqua Clarity — no external API, no GPS, pure static SVG with instant filtering
// Regions: Central, North, North-East, East, West

import { cn } from '@/lib/utils';

export type SgRegion = 'Central' | 'North' | 'North-East' | 'East' | 'West' | null;

interface Props {
  selected: SgRegion;
  onSelect: (region: SgRegion) => void;
}

// Region color palette
const REGION_COLORS: Record<string, { base: string; active: string; text: string }> = {
  Central:     { base: '#C7E8F5', active: '#3BBFCF', text: '#1B3A5C' },
  North:       { base: '#D4EED4', active: '#3A9E6A', text: '#1B3A5C' },
  'North-East':{ base: '#FDE8C8', active: '#E8923A', text: '#1B3A5C' },
  East:        { base: '#FAD4D4', active: '#D94F4F', text: '#1B3A5C' },
  West:        { base: '#E8D4F5', active: '#8A4FD9', text: '#1B3A5C' },
};

// Simplified SVG paths representing Singapore's 5 planning regions
// Viewbox: 0 0 300 200 — approximate shape, not geo-accurate
const REGION_PATHS: { id: string; d: string; labelX: number; labelY: number }[] = [
  {
    id: 'North',
    d: 'M 30 20 L 270 20 L 260 30 L 230 35 L 200 30 L 170 40 L 140 38 L 110 42 L 80 38 L 50 42 L 30 35 Z',
    labelX: 150,
    labelY: 32,
  },
  {
    id: 'West',
    d: 'M 30 35 L 50 42 L 55 60 L 45 80 L 40 105 L 30 120 L 10 130 L 8 110 L 10 80 L 15 55 Z',
    labelX: 30,
    labelY: 85,
  },
  {
    id: 'Central',
    d: 'M 80 38 L 110 42 L 140 38 L 170 40 L 200 30 L 210 55 L 205 75 L 195 95 L 175 110 L 155 120 L 135 118 L 115 112 L 100 98 L 88 80 L 78 60 Z',
    labelX: 148,
    labelY: 80,
  },
  {
    id: 'North-East',
    d: 'M 170 40 L 200 30 L 230 35 L 260 30 L 270 20 L 280 40 L 275 65 L 260 80 L 240 90 L 215 92 L 205 75 L 210 55 Z',
    labelX: 238,
    labelY: 60,
  },
  {
    id: 'East',
    d: 'M 205 75 L 215 92 L 240 90 L 260 80 L 275 65 L 285 90 L 285 120 L 270 140 L 250 150 L 225 148 L 205 140 L 195 120 L 195 95 Z',
    labelX: 242,
    labelY: 115,
  },
  // South / bottom fill (part of Central for simplicity)
  {
    id: 'Central',
    d: 'M 40 105 L 45 80 L 55 60 L 78 60 L 88 80 L 100 98 L 115 112 L 135 118 L 155 120 L 175 110 L 195 120 L 195 140 L 180 155 L 160 162 L 140 165 L 120 162 L 100 155 L 80 148 L 60 138 L 45 125 Z',
    labelX: 120,
    labelY: 140,
  },
];

// Deduplicated region shapes (merge Central paths)
const MERGED_REGIONS: { id: string; paths: string[]; labelX: number; labelY: number }[] = [
  {
    id: 'North',
    paths: ['M 30 20 L 270 20 L 260 30 L 230 35 L 200 30 L 170 40 L 140 38 L 110 42 L 80 38 L 50 42 L 30 35 Z'],
    labelX: 150, labelY: 30,
  },
  {
    id: 'West',
    paths: ['M 30 35 L 50 42 L 55 60 L 78 60 L 78 60 L 60 80 L 45 105 L 40 125 L 60 138 L 45 125 L 40 105 L 45 80 L 55 60 L 50 42 L 30 35 Z',
             'M 8 110 L 10 80 L 15 55 L 30 35 L 30 120 L 10 130 Z'],
    labelX: 32, labelY: 88,
  },
  {
    id: 'Central',
    paths: ['M 78 60 L 80 38 L 110 42 L 140 38 L 170 40 L 210 55 L 205 75 L 195 95 L 195 120 L 180 155 L 160 162 L 140 165 L 120 162 L 100 155 L 80 148 L 60 138 L 40 125 L 45 105 L 60 80 L 78 60 Z'],
    labelX: 130, labelY: 105,
  },
  {
    id: 'North-East',
    paths: ['M 170 40 L 200 30 L 230 35 L 260 30 L 270 20 L 280 40 L 275 65 L 260 80 L 240 90 L 215 92 L 205 75 L 210 55 Z'],
    labelX: 238, labelY: 58,
  },
  {
    id: 'East',
    paths: ['M 205 75 L 215 92 L 240 90 L 260 80 L 275 65 L 285 90 L 285 120 L 270 140 L 250 150 L 225 148 L 205 140 L 195 120 L 195 95 Z'],
    labelX: 242, labelY: 112,
  },
];

export default function SingaporeRegionMap({ selected, onSelect }: Props) {
  return (
    <div className="w-full">
      {/* SVG Map */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-[oklch(0.955_0.010_220)] border border-border/40">
        <svg
          viewBox="0 0 300 175"
          className="w-full h-auto"
          style={{ maxHeight: 200 }}
        >
          {/* Sea background */}
          <rect x="0" y="0" width="300" height="175" fill="#EEF8FB" rx="12" />

          {MERGED_REGIONS.map(region => {
            const isSelected = selected === region.id;
            const colors = REGION_COLORS[region.id];
            return (
              <g key={region.id} onClick={() => onSelect(isSelected ? null : region.id as SgRegion)} style={{ cursor: 'pointer' }}>
                {region.paths.map((d, i) => (
                  <path
                    key={i}
                    d={d}
                    fill={isSelected ? colors.active : colors.base}
                    stroke="white"
                    strokeWidth="1.5"
                    style={{ transition: 'fill 0.2s ease' }}
                  />
                ))}
                {/* Label */}
                <text
                  x={region.labelX}
                  y={region.labelY}
                  textAnchor="middle"
                  fontSize="7.5"
                  fontWeight="700"
                  fill={isSelected ? 'white' : colors.text}
                  style={{ pointerEvents: 'none', fontFamily: 'Sora, sans-serif', transition: 'fill 0.2s ease' }}
                >
                  {region.id}
                </text>
              </g>
            );
          })}

          {/* Singapore island outline overlay (subtle) */}
          <path
            d="M 8 110 L 10 80 L 15 55 L 30 35 L 30 20 L 270 20 L 280 40 L 285 90 L 285 120 L 270 140 L 250 150 L 225 148 L 205 140 L 180 155 L 160 162 L 140 165 L 120 162 L 100 155 L 80 148 L 60 138 L 40 125 L 10 130 Z"
            fill="none"
            stroke="#1B3A5C"
            strokeWidth="1.5"
            strokeOpacity="0.25"
          />
        </svg>

        {/* "Tap to filter" hint */}
        <div className="absolute bottom-2 right-3 text-[10px] text-muted-foreground/60 font-medium">
          Tap a region to filter
        </div>
      </div>

      {/* Region chip row */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {Object.keys(REGION_COLORS).map(r => {
          const isActive = selected === r;
          const colors = REGION_COLORS[r];
          return (
            <button
              key={r}
              onClick={() => onSelect(isActive ? null : r as SgRegion)}
              className={cn(
                'text-xs px-3 py-1.5 rounded-full font-semibold transition-all border',
                isActive ? 'text-white border-transparent' : 'border-border/40 text-muted-foreground bg-white'
              )}
              style={isActive ? { background: colors.active } : {}}
            >
              {r}
            </button>
          );
        })}
        {selected && (
          <button
            onClick={() => onSelect(null)}
            className="text-xs px-3 py-1.5 rounded-full font-semibold text-muted-foreground bg-[oklch(0.955_0.010_220)] border border-border/40 transition-all"
          >
            Clear ✕
          </button>
        )}
      </div>
    </div>
  );
}
