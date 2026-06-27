import { useState, useRef } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Link } from 'wouter';
import { Home, Building2, Upload, Users, Calendar, CheckCircle, Clock } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7am–8pm

export default function SwimSchoolDashboard() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const { data: school, refetch } = trpc.swimSchool.mySchool.useQuery();
  const { data: roster } = trpc.swimSchool.roster.useQuery();
  const { data: lessons } = trpc.swimSchool.lessons.useQuery();

  const [form, setForm] = useState({ name: '', uen: '', contactEmail: '', contactPhone: '', address: '', postalCode: '', brandColor: '#1B3A5C' });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const upsert = trpc.swimSchool.upsert.useMutation({
    onSuccess: () => { toast.success('School profile saved'); refetch(); },
    onError: (e) => toast.error(e.message),
  });

  const uploadLogo = trpc.swimSchool.uploadLogo.useMutation({
    onSuccess: (d) => { toast.success('Logo uploaded'); setLogoPreview(d.url); refetch(); },
    onError: (e) => toast.error(e.message),
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = (ev.target?.result as string).split(',')[1];
      uploadLogo.mutate({ base64, mimeType: file.type });
    };
    reader.readAsDataURL(file);
  };

  const logoUrl = school?.logoUrl ?? logoPreview;
  const brandColor = school?.brandColor ?? form.brandColor;

  // Lesson schedule matrix: group by day
  const scheduleMatrix: Record<number, typeof lessons> = {};
  DAYS.forEach((_, i) => { scheduleMatrix[i] = []; });
  lessons?.forEach((l) => {
    const day = new Date(l.scheduledAt).getDay();
    scheduleMatrix[day]?.push(l);
  });

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.005_220)]">
      {/* White-label header */}
      <div className="text-white px-4 pt-10 pb-6" style={{ backgroundColor: brandColor }}>
        <div className="flex items-center justify-between mb-2">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 -ml-2 gap-1">
              <Home size={14} /> Home
            </Button>
          </Link>
          <Badge className="bg-white/20 text-white border-white/30 text-xs">School Admin</Badge>
        </div>
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt="School logo" className="w-14 h-14 rounded-2xl object-cover border-2 border-white/30" />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center cursor-pointer"
              onClick={() => fileRef.current?.click()}>
              <Upload size={20} className="text-white/70" />
            </div>
          )}
          <div>
            <h1 className="text-xl font-extrabold font-display">{school?.name ?? 'Your Swim School'}</h1>
            <p className="text-white/60 text-xs mt-0.5">{school?.contactEmail ?? 'Set up your school profile below'}</p>
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-0 shadow-sm text-center">
            <CardContent className="p-3">
              <p className="text-2xl font-bold text-navy">{roster?.length ?? 0}</p>
              <p className="text-xs text-muted-foreground">Coaches</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm text-center">
            <CardContent className="p-3">
              <p className="text-2xl font-bold text-navy">{lessons?.length ?? 0}</p>
              <p className="text-xs text-muted-foreground">Lessons</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm text-center">
            <CardContent className="p-3">
              <p className="text-2xl font-bold text-navy">
                {lessons?.filter(l => l.status === 'completed').length ?? 0}
              </p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="w-full bg-white border border-border/40 rounded-xl p-1">
            <TabsTrigger value="profile" className="flex-1 text-xs rounded-lg">Profile</TabsTrigger>
            <TabsTrigger value="schedule" className="flex-1 text-xs rounded-lg">Schedule</TabsTrigger>
            <TabsTrigger value="roster" className="flex-1 text-xs rounded-lg">Roster</TabsTrigger>
          </TabsList>

          {/* School Profile */}
          <TabsContent value="profile" className="mt-4 space-y-4">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-navy flex items-center gap-2">
                  <Building2 size={16} /> School Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">School Name *</Label>
                  <Input className="mt-1 h-9 text-sm" placeholder="e.g. AquaStars Swim Academy"
                    defaultValue={school?.name ?? ''} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">UEN (Business Registration)</Label>
                  <Input className="mt-1 h-9 text-sm" placeholder="e.g. 202312345A"
                    defaultValue={school?.uen ?? ''} onChange={(e) => setForm(f => ({ ...f, uen: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Contact Email</Label>
                    <Input className="mt-1 h-9 text-sm" type="email" placeholder="admin@school.sg"
                      defaultValue={school?.contactEmail ?? ''} onChange={(e) => setForm(f => ({ ...f, contactEmail: e.target.value }))} />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Phone</Label>
                    <Input className="mt-1 h-9 text-sm" placeholder="+65 9xxx xxxx"
                      defaultValue={school?.contactPhone ?? ''} onChange={(e) => setForm(f => ({ ...f, contactPhone: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">School Address</Label>
                  <Input className="mt-1 h-9 text-sm" placeholder="Block 123, Street Name, #01-01"
                    defaultValue={school?.address ?? ''} onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Postal Code</Label>
                    <Input className="mt-1 h-9 text-sm" placeholder="123456"
                      defaultValue={school?.postalCode ?? ''} onChange={(e) => setForm(f => ({ ...f, postalCode: e.target.value }))} />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Brand Colour</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <input type="color" value={form.brandColor} className="w-9 h-9 rounded-lg border cursor-pointer"
                        onChange={(e) => setForm(f => ({ ...f, brandColor: e.target.value }))} />
                      <span className="text-xs text-muted-foreground">{form.brandColor}</span>
                    </div>
                  </div>
                </div>
                <div className="pt-2">
                  <Label className="text-xs text-muted-foreground mb-2 block">School Logo</Label>
                  <div className="flex items-center gap-3">
                    {logoUrl && <img src={logoUrl} alt="Logo" className="w-16 h-16 rounded-xl object-cover border" />}
                    <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => fileRef.current?.click()}>
                      <Upload size={12} /> {logoUrl ? 'Replace Logo' : 'Upload Logo'}
                    </Button>
                  </div>
                </div>
                <Button className="w-full bg-[oklch(0.55_0.14_200)] hover:bg-[oklch(0.45_0.14_200)] text-white mt-2"
                  onClick={() => upsert.mutate({ ...form, name: form.name || school?.name || 'My School' })}
                  disabled={upsert.isPending}>
                  {upsert.isPending ? 'Saving…' : 'Save School Profile'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Matrix */}
          <TabsContent value="schedule" className="mt-4">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-navy flex items-center gap-2">
                  <Calendar size={16} /> Weekly Schedule Matrix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr>
                        <th className="text-left text-muted-foreground font-medium py-1 pr-2 w-10">Time</th>
                        {DAYS.map(d => (
                          <th key={d} className="text-center text-muted-foreground font-medium py-1 px-1">{d}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {HOURS.map(h => (
                        <tr key={h} className="border-t border-border/30">
                          <td className="text-muted-foreground py-2 pr-2 whitespace-nowrap">{h}:00</td>
                          {DAYS.map((_, dayIdx) => {
                            const slot = scheduleMatrix[dayIdx]?.find(l => new Date(l.scheduledAt).getHours() === h);
                            return (
                              <td key={dayIdx} className="py-1 px-1 text-center">
                                {slot ? (
                                  <div className="bg-[oklch(0.93_0.05_200)] rounded-md px-1 py-0.5 text-[9px] text-[oklch(0.45_0.14_200)] font-medium truncate">
                                    {slot.status}
                                  </div>
                                ) : (
                                  <div className="w-full h-5 rounded-md bg-border/20" />
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roster */}
          <TabsContent value="roster" className="mt-4 space-y-3">
            {!roster?.length ? (
              <div className="text-center py-10 text-muted-foreground text-sm">
                <Users size={32} className="mx-auto mb-2 text-muted-foreground/40" />
                No coaches in your roster yet
              </div>
            ) : roster.map((member) => (
              <Card key={member.id} className="border-0 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-navy">Coach ID #{member.coachId}</p>
                    <p className="text-xs text-muted-foreground capitalize">{member.role.replace('_', ' ')}</p>
                  </div>
                  <Badge className="bg-[oklch(0.93_0.05_200)] text-[oklch(0.45_0.14_200)] border-0 text-xs capitalize">
                    {member.role}
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
