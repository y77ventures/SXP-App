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
import { Home, Building2, Upload, Users, Calendar } from 'lucide-react';
import { z } from 'zod';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7am–8pm

const schoolSchema = z.object({
  name: z.string().min(3, "School name must be at least 3 characters"),
  uen: z.string().regex(/^[0-9]{8,9}[A-Z]$/i, "Invalid UEN format (e.g., 202312345A)"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().regex(/^\d{8,15}$/, "Phone must be 8-15 digits"),
  address: z.string().min(10, "Please provide a full address"),
  postalCode: z.string().regex(/^\d{6}$/, "Postal code must be exactly 6 digits"),
  brandColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
});

export default function SwimSchoolDashboard() {
  const { user } = useAuth();
  const { data: school, refetch } = trpc.swimSchool.mySchool.useQuery();
  const { data: roster } = trpc.swimSchool.roster.useQuery();
  const { data: lessons } = trpc.swimSchool.lessons.useQuery();

  const [form, setForm] = useState({
    name: school?.name ?? '',
    uen: school?.uen ?? '',
    contactEmail: school?.contactEmail ?? '',
    contactPhone: school?.contactPhone ?? '',
    address: school?.address ?? '',
    postalCode: school?.postalCode ?? '',
    brandColor: school?.brandColor ?? '#1B3A5C'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
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

  const validate = () => {
    try {
      schoolSchema.parse(form);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach((e: any) => { if (e.path[0]) newErrors[e.path[0] as string] = e.message; });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSave = () => {
    if (validate()) upsert.mutate(form);
    else toast.error("Please fix validation errors");
  };

  const set = (k: keyof typeof form, v: string) => {
    setForm(prev => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors(prev => { const n = { ...prev }; delete n[k]; return n; });
  };

  const logoUrl = school?.logoUrl ?? logoPreview;
  const brandColor = school?.brandColor ?? form.brandColor;

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.005_220)]">
      <div className="text-white px-4 pt-10 pb-6" style={{ backgroundColor: brandColor }}>
        <div className="flex items-center justify-between mb-2">
          <Link href="/"><Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 -ml-2 gap-1"><Home size={14} /> Home</Button></Link>
          <Badge className="bg-white/20 text-white border-white/30 text-xs">School Admin</Badge>
        </div>
        <div className="flex items-center gap-3">
          {logoUrl ? <img src={logoUrl} alt="Logo" className="w-14 h-14 rounded-2xl object-cover border-2 border-white/30" /> : <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center cursor-pointer" onClick={() => fileRef.current?.click()}><Upload size={20} className="text-white/70" /></div>}
          <div><h1 className="text-xl font-extrabold font-display">{school?.name ?? 'Your Swim School'}</h1><p className="text-white/60 text-xs mt-0.5">{school?.contactEmail ?? 'Set up your school profile below'}</p></div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const r = new FileReader(); r.onload = (ev) => uploadLogo.mutate({ base64: (ev.target?.result as string).split(',')[1], mimeType: file.type }); r.readAsDataURL(file); } }} />
      </div>

      <div className="px-4 py-5 space-y-5">
        <Tabs defaultValue="profile">
          <TabsList className="w-full bg-white border border-border/40 rounded-xl p-1">
            <TabsTrigger value="profile" className="flex-1 text-xs rounded-lg">Profile</TabsTrigger>
            <TabsTrigger value="schedule" className="flex-1 text-xs rounded-lg">Schedule</TabsTrigger>
            <TabsTrigger value="roster" className="flex-1 text-xs rounded-lg">Roster</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4 space-y-4">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold text-navy flex items-center gap-2"><Building2 size={16} /> School Details</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <FormField label="School Name *" error={errors.name}><Input type="text" placeholder="e.g. AquaStars Swim Academy" value={form.name} onChange={e => set('name', e.target.value)} /></FormField>
                <FormField label="UEN (Business Registration) *" error={errors.uen}><Input type="text" placeholder="e.g. 202312345A" value={form.uen} onChange={e => set('uen', e.target.value.toUpperCase())} /></FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Contact Email *" error={errors.contactEmail}><Input type="email" placeholder="e.g. admin@school.sg" value={form.contactEmail} onChange={e => set('contactEmail', e.target.value)} /></FormField>
                  <FormField label="Phone *" error={errors.contactPhone}><Input type="tel" inputMode="numeric" pattern="[0-9]*" placeholder="e.g. 91234567" value={form.contactPhone} onChange={e => set('contactPhone', e.target.value.replace(/\D/g, ''))} /></FormField>
                </div>
                <FormField label="School Address *" error={errors.address}><Input type="text" placeholder="e.g. Block 123, Street Name, #01-01" value={form.address} onChange={e => set('address', e.target.value)} /></FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Postal Code *" error={errors.postalCode}><Input type="tel" inputMode="numeric" pattern="[0-9]*" placeholder="e.g. 123456" value={form.postalCode} onChange={e => set('postalCode', e.target.value.replace(/\D/g, ''))} maxLength={6} /></FormField>
                  <FormField label="Brand Colour"><div className="flex items-center gap-2 mt-1"><input type="color" value={form.brandColor} className="w-9 h-9 rounded-lg border cursor-pointer" onChange={e => set('brandColor', e.target.value)} /><span className="text-xs text-muted-foreground">{form.brandColor}</span></div></FormField>
                </div>
                <Button className="w-full bg-[oklch(0.55_0.14_200)] hover:bg-[oklch(0.45_0.14_200)] text-white mt-2" onClick={handleSave} disabled={upsert.isPending}>{upsert.isPending ? 'Saving…' : 'Save School Profile'}</Button>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Schedule and Roster content... */}
        </Tabs>
      </div>
    </div>
  );
}

function FormField({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
      {error && <p className="text-[10px] text-destructive font-medium">{error}</p>}
    </div>
  );
}
