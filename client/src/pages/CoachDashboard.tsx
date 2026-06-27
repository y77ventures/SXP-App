import { useState, useRef } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Link } from 'wouter';
import {
  Home, Star, Lock, Upload, Calendar, MapPin, Video, ShieldCheck,
  CheckCircle, Clock, DollarSign
} from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 7);

const SG_REGIONS = [
  'Central', 'North', 'North-East', 'East', 'West',
  'Jurong', 'Woodlands', 'Tampines', 'Bedok', 'Clementi',
  'Buona Vista', 'Bishan', 'Ang Mo Kio', 'Punggol', 'Sengkang',
];

function PremiumGate({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none select-none">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded-2xl">
        <Lock size={24} className="text-amber-500 mb-2" />
        <p className="font-semibold text-sm text-navy">Premium Feature</p>
        <p className="text-xs text-muted-foreground text-center mt-1 px-4">
          Upgrade to Premium to unlock this feature
        </p>
        <Button size="sm" className="mt-3 bg-amber-500 hover:bg-amber-600 text-white text-xs">
          Upgrade to Premium
        </Button>
      </div>
    </div>
  );
}

export default function CoachDashboard() {
  const { user } = useAuth();
  const { data: profile, refetch } = trpc.coach.myProfile.useQuery();
  const { data: lessons } = trpc.coach.myLessons.useQuery();
  const { data: availability } = trpc.coach.availability.useQuery();

  const isPremium = profile?.subscriptionTier === 'premium';
  const isApproved = profile?.certStatus === 'approved';

  const [bio, setBio] = useState('');
  const [languages, setLanguages] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [availSlots, setAvailSlots] = useState<{ dayOfWeek: number; startHour: number; endHour: number }[]>([]);
  const photoRef = useRef<HTMLInputElement>(null);

  const saveProfile = trpc.coach.saveProfile.useMutation({
    onSuccess: () => { toast.success('Profile saved'); refetch(); },
    onError: (e) => toast.error(e.message),
  });

  const uploadPhoto = trpc.coach.uploadPhoto.useMutation({
    onSuccess: () => { toast.success('Photo uploaded'); refetch(); },
    onError: (e) => toast.error(e.message),
  });

  const setAvailability = trpc.coach.setAvailability.useMutation({
    onSuccess: () => { toast.success('Availability saved'); refetch(); },
    onError: (e) => toast.error(e.message),
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = (ev.target?.result as string).split(',')[1];
      uploadPhoto.mutate({ base64, mimeType: file.type });
    };
    reader.readAsDataURL(file);
  };

  const toggleSlot = (dayOfWeek: number, startHour: number) => {
    const endHour = startHour + 1;
    const exists = availSlots.find(s => s.dayOfWeek === dayOfWeek && s.startHour === startHour);
    if (exists) {
      setAvailSlots(s => s.filter(x => !(x.dayOfWeek === dayOfWeek && x.startHour === startHour)));
    } else {
      setAvailSlots(s => [...s, { dayOfWeek, startHour, endHour }]);
    }
  };

  const toggleRegion = (r: string) => {
    setSelectedRegions(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);
  };

  const earnings = lessons?.reduce((sum, l) => sum + parseFloat(l.coachPayout ?? '0'), 0) ?? 0;
  const completed = lessons?.filter(l => l.status === 'completed').length ?? 0;
  const upcoming = lessons?.filter(l => l.status === 'confirmed').length ?? 0;

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.005_220)]">
      {/* Header */}
      <div className="bg-[oklch(0.18_0.06_240)] text-white px-4 pt-10 pb-6">
        <div className="flex items-center justify-between mb-2">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 -ml-2 gap-1">
              <Home size={14} /> Home
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            {isApproved && (
              <Badge className="bg-emerald-500/20 text-emerald-200 border-emerald-500/30 text-xs gap-1">
                <ShieldCheck size={10} /> Verified
              </Badge>
            )}
            <Badge className={isPremium
              ? 'bg-amber-500/20 text-amber-200 border-amber-500/30 text-xs'
              : 'bg-white/10 text-white/70 border-white/20 text-xs'}>
              {isPremium ? '⭐ Premium' : 'Basic'}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative cursor-pointer" onClick={() => photoRef.current?.click()}>
            {profile?.photoUrl ? (
              <img src={profile.photoUrl} alt="Coach photo" className="w-14 h-14 rounded-2xl object-cover border-2 border-white/30" />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                <Upload size={18} className="text-white/70" />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-xl font-extrabold font-display">{user?.name ?? 'Coach Dashboard'}</h1>
            <p className="text-white/60 text-xs mt-0.5">{profile?.primaryCert ?? 'Complete your profile below'}</p>
          </div>
        </div>
        <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-0 shadow-sm text-center">
            <CardContent className="p-3">
              <p className="text-2xl font-bold text-navy">{completed}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm text-center">
            <CardContent className="p-3">
              <p className="text-2xl font-bold text-navy">{upcoming}</p>
              <p className="text-xs text-muted-foreground">Upcoming</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm text-center">
            <CardContent className="p-3">
              <p className="text-lg font-bold text-emerald-600">${earnings.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">Earnings</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="w-full bg-white border border-border/40 rounded-xl p-1">
            <TabsTrigger value="profile" className="flex-1 text-xs rounded-lg">Profile</TabsTrigger>
            <TabsTrigger value="calendar" className="flex-1 text-xs rounded-lg">Calendar</TabsTrigger>
            <TabsTrigger value="lessons" className="flex-1 text-xs rounded-lg">Lessons</TabsTrigger>
          </TabsList>

          {/* Profile */}
          <TabsContent value="profile" className="mt-4 space-y-4">
            {/* Basic fields */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-navy">Basic Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Short Bio</Label>
                  <Textarea className="mt-1 text-sm resize-none" rows={3}
                    placeholder="Tell clients about your coaching style and experience…"
                    defaultValue={profile?.bio ?? ''} onChange={(e) => setBio(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Languages Spoken</Label>
                  <Input className="mt-1 h-9 text-sm" placeholder="e.g. English, Mandarin, Malay"
                    defaultValue={profile?.languages ?? ''} onChange={(e) => setLanguages(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Hourly Rate (SGD)</Label>
                  <Input className="mt-1 h-9 text-sm" type="number" placeholder="e.g. 80"
                    defaultValue={profile?.hourlyRate ?? ''} onChange={(e) => setHourlyRate(e.target.value)} />
                </div>
                <Button className="w-full bg-[oklch(0.55_0.14_200)] hover:bg-[oklch(0.45_0.14_200)] text-white"
                  onClick={() => saveProfile.mutate({ bio, languages, hourlyRate })}
                  disabled={saveProfile.isPending}>
                  {saveProfile.isPending ? 'Saving…' : 'Save Basic Profile'}
                </Button>
              </CardContent>
            </Card>

            {/* Premium: Video Portfolio */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Video size={14} className="text-amber-500" />
                <p className="text-sm font-semibold text-navy">Video Portfolio</p>
                {!isPremium && <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px]">Premium</Badge>}
              </div>
              {isPremium ? (
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Portfolio Video URL</Label>
                      <Input className="mt-1 h-9 text-sm" placeholder="https://youtube.com/..."
                        defaultValue={profile?.videoPortfolioUrl ?? ''} onChange={(e) => setVideoUrl(e.target.value)} />
                    </div>
                    <Button size="sm" className="w-full bg-amber-500 hover:bg-amber-600 text-white text-xs"
                      onClick={() => saveProfile.mutate({ videoPortfolioUrl: videoUrl })}
                      disabled={saveProfile.isPending}>
                      Save Video URL
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <PremiumGate>
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <Input className="h-9 text-sm" placeholder="https://youtube.com/..." disabled />
                    </CardContent>
                  </Card>
                </PremiumGate>
              )}
            </div>

            {/* Premium: Catchment Regions */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={14} className="text-amber-500" />
                <p className="text-sm font-semibold text-navy">Service Catchment</p>
                {!isPremium && <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px]">Premium</Badge>}
              </div>
              {isPremium ? (
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-3">Select the regions where you offer private lessons:</p>
                    <div className="flex flex-wrap gap-2">
                      {SG_REGIONS.map(r => (
                        <button key={r} onClick={() => toggleRegion(r)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${selectedRegions.includes(r)
                            ? 'bg-[oklch(0.55_0.14_200)] text-white border-[oklch(0.55_0.14_200)]'
                            : 'bg-white text-muted-foreground border-border hover:border-[oklch(0.55_0.14_200)]'}`}>
                          {r}
                        </button>
                      ))}
                    </div>
                    <Button size="sm" className="w-full mt-3 bg-amber-500 hover:bg-amber-600 text-white text-xs"
                      onClick={() => saveProfile.mutate({ catchmentRegions: JSON.stringify(selectedRegions) })}
                      disabled={saveProfile.isPending}>
                      Save Catchment Regions
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <PremiumGate>
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {SG_REGIONS.slice(0, 6).map(r => (
                          <span key={r} className="text-xs px-3 py-1.5 rounded-full border bg-white text-muted-foreground">{r}</span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </PremiumGate>
              )}
            </div>
          </TabsContent>

          {/* Calendar (Premium only) */}
          <TabsContent value="calendar" className="mt-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={14} className="text-amber-500" />
              <p className="text-sm font-semibold text-navy">Weekly Availability</p>
              {!isPremium && <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px]">Premium</Badge>}
            </div>
            {isPremium ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-3">Tap slots to toggle availability (teal = available):</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr>
                          <th className="text-left text-muted-foreground font-medium py-1 pr-2 w-10">Time</th>
                          {DAYS.map(d => <th key={d} className="text-center font-medium py-1 px-0.5">{d}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {HOURS.map(h => (
                          <tr key={h} className="border-t border-border/30">
                            <td className="text-muted-foreground py-1.5 pr-2 whitespace-nowrap">{h}:00</td>
                            {DAYS.map((_, dayIdx) => {
                              const active = availSlots.some(s => s.dayOfWeek === dayIdx && s.startHour === h);
                              return (
                                <td key={dayIdx} className="py-0.5 px-0.5">
                                  <button onClick={() => toggleSlot(dayIdx, h)}
                                    className={`w-full h-6 rounded transition-colors ${active
                                      ? 'bg-[oklch(0.72_0.13_200)]'
                                      : 'bg-border/30 hover:bg-[oklch(0.88_0.08_200)]'}`} />
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Button className="w-full mt-4 bg-[oklch(0.55_0.14_200)] hover:bg-[oklch(0.45_0.14_200)] text-white text-sm"
                    onClick={() => setAvailability.mutate({ slots: availSlots })}
                    disabled={setAvailability.isPending}>
                    {setAvailability.isPending ? 'Saving…' : `Save ${availSlots.length} Slot${availSlots.length !== 1 ? 's' : ''}`}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <PremiumGate>
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="h-40 bg-border/20 rounded-xl" />
                  </CardContent>
                </Card>
              </PremiumGate>
            )}
          </TabsContent>

          {/* Lessons */}
          <TabsContent value="lessons" className="mt-4 space-y-3">
            {!lessons?.length ? (
              <div className="text-center py-10 text-muted-foreground text-sm">
                <Calendar size={32} className="mx-auto mb-2 text-muted-foreground/40" />
                No lessons yet
              </div>
            ) : lessons.map((lesson) => (
              <Card key={lesson.id} className="border-0 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-sm text-navy">
                      {new Date(lesson.scheduledAt).toLocaleDateString('en-SG', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(lesson.scheduledAt).toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })} · {lesson.durationMinutes}min
                    </p>
                    <p className="text-xs text-emerald-600 font-medium mt-0.5">
                      <DollarSign size={10} className="inline" />{lesson.coachPayout} payout
                    </p>
                  </div>
                  <Badge className={
                    lesson.status === 'completed' ? 'bg-emerald-100 text-emerald-700 border-0' :
                    lesson.status === 'confirmed' ? 'bg-blue-100 text-blue-700 border-0' :
                    lesson.status === 'cancelled' ? 'bg-red-100 text-red-700 border-0' :
                    'bg-amber-100 text-amber-700 border-0'
                  }>
                    {lesson.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
