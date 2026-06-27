// PoolDetail — Full pool profile page
import { useParams, useLocation } from 'wouter';
import { ChevronLeft, Star, MapPin, Clock, Users, CheckCircle2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/components/AppLayout';
import { pools } from '@/lib/mockData';
import { toast } from 'sonner';

export default function PoolDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const pool = pools.find(p => p.id === id) ?? pools[0];

  return (
    <AppLayout hideNav>
      <div className="sticky top-0 z-40 bg-transparent">
        <button
          onClick={() => navigate('/explore')}
          className="m-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md"
        >
          <ChevronLeft size={20} className="text-navy" />
        </button>
      </div>

      <div className="relative -mt-14" style={{ height: 300 }}>
        <img src={pool.image} alt={pool.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl font-extrabold text-white font-display">{pool.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              <span className="text-white font-semibold text-sm">{pool.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={12} className="text-white/70" />
              <span className="text-white/70 text-xs">{pool.distance}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-5">
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: `${pool.length}m`, label: 'Length' },
            { value: `${pool.lanes}`, label: 'Lanes' },
            { value: `${pool.capacity}`, label: 'Capacity' },
          ].map(s => (
            <div key={s.label} className="bg-[oklch(0.955_0.010_220)] rounded-2xl p-3 text-center">
              <div className="text-lg font-bold font-display text-[oklch(0.72_0.13_200)]">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="font-bold text-base font-display text-navy mb-2">Location</h2>
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-[oklch(0.72_0.13_200)] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">{pool.address}</p>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-base font-display text-navy mb-2">Features</h2>
          <div className="flex flex-wrap gap-2">
            {pool.features.map(f => (
              <div key={f} className="flex items-center gap-1.5 bg-[oklch(0.93_0.05_200)] px-3 py-1.5 rounded-full">
                <CheckCircle2 size={12} className="text-[oklch(0.72_0.13_200)]" />
                <span className="text-xs font-medium text-[oklch(0.52_0.14_200)]">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-bold text-base font-display text-navy mb-2">Availability</h2>
          <div className="space-y-2">
            {pool.availability.map(a => (
              <div key={a} className="flex items-center gap-2">
                <Clock size={13} className="text-[oklch(0.72_0.13_200)]" />
                <span className="text-sm text-muted-foreground">{a}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-bold text-base font-display text-navy mb-2">Host</h2>
          <div className="flex items-center gap-2">
            <Users size={14} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{pool.hostName}</span>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-[oklch(0.965_0.012_220)]/95 backdrop-blur-xl border-t border-border/50 p-4 pb-safe">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-2xl font-bold font-display text-[oklch(0.72_0.13_200)]">${pool.rentalRate}</span>
            <span className="text-muted-foreground text-sm">/hr</span>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-200">Available</Badge>
        </div>
        <Button
          className="w-full bg-[oklch(0.72_0.13_200)] hover:bg-[oklch(0.62_0.13_200)] text-white rounded-2xl font-semibold h-12"
          onClick={() => navigate('/book')}
        >
          <Calendar size={16} className="mr-2" />
          Book This Pool
        </Button>
      </div>
    </AppLayout>
  );
}
