/**
 * RegionSelector — Singapore district/region picker
 * Wired to clientProfile.saveProfile tRPC mutation.
 * Renders a visual grid of Singapore planning regions with district sub-selections.
 * On confirm, persists the chosen region to the clientProfile table via tRPC.
 */
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { MapPin, CheckCircle, Loader2 } from 'lucide-react';

// Singapore planning regions → districts
export const SG_REGIONS: Record<string, { label: string; color: string; districts: string[] }> = {
  central: {
    label: 'Central',
    color: 'bg-[oklch(0.88_0.08_200)] border-[oklch(0.72_0.13_200)] text-[oklch(0.35_0.14_200)]',
    districts: ['Bishan', 'Buona Vista', 'Clementi', 'Holland', 'Novena', 'Orchard', 'Queenstown', 'Toa Payoh'],
  },
  north: {
    label: 'North',
    color: 'bg-emerald-50 border-emerald-400 text-emerald-800',
    districts: ['Admiralty', 'Sembawang', 'Woodlands', 'Yishun'],
  },
  northeast: {
    label: 'North-East',
    color: 'bg-violet-50 border-violet-400 text-violet-800',
    districts: ['Ang Mo Kio', 'Hougang', 'Punggol', 'Sengkang', 'Serangoon'],
  },
  east: {
    label: 'East',
    color: 'bg-amber-50 border-amber-400 text-amber-800',
    districts: ['Bedok', 'Changi', 'Pasir Ris', 'Tampines'],
  },
  west: {
    label: 'West',
    color: 'bg-rose-50 border-rose-400 text-rose-800',
    districts: ['Boon Lay', 'Bukit Batok', 'Bukit Panjang', 'Choa Chu Kang', 'Jurong', 'Tengah', 'Tuas'],
  },
};

interface RegionSelectorProps {
  /** Current saved region (e.g. "central:Bishan") */
  initialValue?: string;
  /** Called after a successful DB save */
  onSaved?: (region: string) => void;
  /** Compact mode — show only region pills, no district drill-down */
  compact?: boolean;
}

export default function RegionSelector({ initialValue, onSaved, compact = false }: RegionSelectorProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>(() => initialValue?.split(':')[0] ?? '');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(() => initialValue?.split(':')[1] ?? '');
  const [saved, setSaved] = useState(false);

  const utils = trpc.useUtils();
  const saveProfile = trpc.clientProfile.saveProfile.useMutation({
    onSuccess: () => {
      setSaved(true);
      const regionStr = selectedDistrict ? `${selectedRegion}:${selectedDistrict}` : selectedRegion;
      toast.success(`Location saved — ${SG_REGIONS[selectedRegion]?.label ?? selectedRegion}${selectedDistrict ? `, ${selectedDistrict}` : ''}`);
      utils.clientProfile.myProfile.invalidate();
      onSaved?.(regionStr);
    },
    onError: (e) => toast.error(e.message),
  });

  const handleSave = () => {
    if (!selectedRegion) { toast.error('Please select a region first'); return; }
    const regionStr = selectedDistrict ? `${selectedRegion}:${selectedDistrict}` : selectedRegion;
    // goals field is reused to store the region string as a JSON-encoded preference
    // until a dedicated region column is added to clientProfiles
    saveProfile.mutate({ goals: JSON.stringify({ region: regionStr }) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MapPin size={16} className="text-[oklch(0.55_0.14_200)]" />
        <p className="text-sm font-semibold text-navy">Select Your Area in Singapore</p>
      </div>

      {/* Region grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {Object.entries(SG_REGIONS).map(([key, region]) => (
          <button
            key={key}
            onClick={() => { setSelectedRegion(key); setSelectedDistrict(''); setSaved(false); }}
            className={`relative rounded-xl border-2 p-3 text-left transition-all duration-150 active:scale-95 ${
              selectedRegion === key
                ? `${region.color} border-current shadow-sm`
                : 'bg-white border-border/40 text-foreground hover:border-border'
            }`}
          >
            <p className="text-xs font-bold">{region.label}</p>
            <p className="text-[10px] opacity-70 mt-0.5">{region.districts.length} districts</p>
            {selectedRegion === key && (
              <CheckCircle size={12} className="absolute top-2 right-2 opacity-80" />
            )}
          </button>
        ))}
      </div>

      {/* District drill-down */}
      {!compact && selectedRegion && SG_REGIONS[selectedRegion] && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">
            Select a district in {SG_REGIONS[selectedRegion].label}:
          </p>
          <div className="flex flex-wrap gap-2">
            {SG_REGIONS[selectedRegion].districts.map((d) => (
              <button
                key={d}
                onClick={() => { setSelectedDistrict(d); setSaved(false); }}
                className={`rounded-full px-3 py-1 text-xs font-medium border transition-all duration-100 active:scale-95 ${
                  selectedDistrict === d
                    ? 'bg-[oklch(0.55_0.14_200)] text-white border-[oklch(0.55_0.14_200)]'
                    : 'bg-white border-border/50 text-foreground hover:border-[oklch(0.72_0.13_200)]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selection summary + save */}
      {selectedRegion && (
        <Card className="border-0 bg-[oklch(0.97_0.005_220)] shadow-none">
          <CardContent className="p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-[oklch(0.55_0.14_200)]" />
              <div>
                <p className="text-xs font-semibold text-navy">
                  {SG_REGIONS[selectedRegion]?.label}
                  {selectedDistrict && ` · ${selectedDistrict}`}
                </p>
                {saved && (
                  <p className="text-[10px] text-emerald-600 flex items-center gap-0.5 mt-0.5">
                    <CheckCircle size={9} /> Saved to your profile
                  </p>
                )}
              </div>
            </div>
            <Button
              size="sm"
              className="bg-[oklch(0.55_0.14_200)] hover:bg-[oklch(0.45_0.14_200)] text-white text-xs h-8 px-3"
              onClick={handleSave}
              disabled={saveProfile.isPending || saved}
            >
              {saveProfile.isPending ? (
                <><Loader2 size={12} className="animate-spin mr-1" />Saving…</>
              ) : saved ? (
                <><CheckCircle size={12} className="mr-1" />Saved</>
              ) : 'Save Location'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
