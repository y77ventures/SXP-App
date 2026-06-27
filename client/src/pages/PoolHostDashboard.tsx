import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Link } from 'wouter';
import { Home, MapPin, Building2, Shield, CheckCircle, Plus, Waves } from 'lucide-react';
import { z } from 'zod';

const POOL_TYPES = [
  { label: 'Condominium Pool', value: 'condominium' },
  { label: 'Landed Estate Pool', value: 'landed_estate' },
  { label: 'Private Club Pool', value: 'other' },
  { label: 'Corporate Pool', value: 'other' }
];
const SECURITY_TYPES = ['Lobby Pass Required', 'Visitor Registration', 'Access Card', 'Intercom Entry', 'No Security Required'];

const poolSchema = z.object({
  estateName: z.string().min(3, "Name must be at least 3 characters"),
  poolType: z.enum(['condominium', 'landed_estate', 'other', '']),
  fullAddress: z.string().min(10, "Please provide a full address"),
  postalCode: z.string().regex(/^\d{6}$/, "Postal code must be exactly 6 digits"),
  unitNumber: z.string().optional(),
  poolLength: z.string().regex(/^\d+$/, "Length must be a number").transform(v => parseInt(v)).optional(),
  poolDepth: z.string().optional(),
  securityGuidelines: z.string().optional(),
  accessInstructions: z.string().optional(),
});

export default function PoolHostDashboard() {
  const { user } = useAuth();
  const { data: pools, refetch } = trpc.poolHost.myPools.useQuery();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    estateName: '', poolType: '' as 'condominium' | 'landed_estate' | 'other', fullAddress: '', postalCode: '',
    unitNumber: '', poolLength: '', poolDepth: '',
    securityGuidelines: '', accessInstructions: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const registerPool = trpc.poolHost.registerPool.useMutation({
    onSuccess: () => {
      toast.success('Pool registered successfully');
      setShowForm(false);
      setForm({ estateName: '', poolType: '' as 'condominium' | 'landed_estate' | 'other', fullAddress: '', postalCode: '', unitNumber: '', poolLength: '', poolDepth: '', securityGuidelines: '', accessInstructions: '' });
      refetch();
    },
    onError: (e) => toast.error(e.message),
  });

  const validate = () => {
    try {
      poolSchema.parse(form);
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

  const handleRegister = () => {
    if (validate()) {
      registerPool.mutate({
        ...form,
        poolLength: parseInt(form.poolLength) || 0,
        poolType: form.poolType as any
      });
    } else {
      toast.error("Please fix the validation errors");
    }
  };

  const set = (k: keyof typeof form, v: any) => {
    setForm(prev => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors(prev => { const n = { ...prev }; delete n[k]; return n; });
  };

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.005_220)]">
      <div className="bg-[oklch(0.22_0.06_240)] text-white px-4 pt-10 pb-6">
        <div className="flex items-center justify-between mb-2">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 -ml-2 gap-1">
              <Home size={14} /> Home
            </Button>
          </Link>
          <Badge className="bg-white/10 text-white/80 border-white/20 text-xs">Pool Host</Badge>
        </div>
        <h1 className="text-xl font-extrabold font-display">My Private Pools</h1>
        <p className="text-white/60 text-xs mt-0.5">{pools?.length ?? 0} registered {pools?.length === 1 ? 'facility' : 'facilities'}</p>
      </div>

      <div className="px-4 py-5 space-y-4">
        <Card className="border-0 shadow-sm bg-amber-50 border-l-4 border-l-amber-400">
          <CardContent className="p-4 flex gap-3">
            <Shield size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Private Facilities Only</p>
              <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                SwimXP Connect does not list public pools. Please register your condominium, landed estate, or private club pool details below.
              </p>
            </div>
          </CardContent>
        </Card>

        {pools?.map((pool) => (
          <Card key={pool.id} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[oklch(0.93_0.05_200)] flex items-center justify-center flex-shrink-0">
                    <Waves size={20} className="text-[oklch(0.55_0.14_200)]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-navy">{pool.estateName}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={10} className="text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{pool.fullAddress}</p>
                    </div>
                  </div>
                </div>
                <Badge className={pool.mcstApproved ? 'bg-emerald-100 text-emerald-700 border-0 text-xs' : 'bg-amber-100 text-amber-700 border-0 text-xs'}>
                  {pool.mcstApproved ? <><CheckCircle size={10} className="inline mr-1" />Verified</> : 'Pending'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}

        {!showForm && (
          <Button className="w-full bg-[oklch(0.55_0.14_200)] hover:bg-[oklch(0.45_0.14_200)] text-white gap-2" onClick={() => setShowForm(true)}>
            <Plus size={16} /> Register New Pool
          </Button>
        )}

        {showForm && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-navy flex items-center gap-2">
                <Building2 size={16} /> Register Private Pool
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <FormField label="Condominium / Estate Name *" error={errors.estateName}>
                <Input type="text" placeholder="e.g. The Rivervale" value={form.estateName} onChange={e => set('estateName', e.target.value)} />
              </FormField>
              <FormField label="Facility Type *" error={errors.poolType}>
                <Select onValueChange={(v) => set('poolType', v)}>
                  <SelectTrigger className="mt-1 h-9 text-sm"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {POOL_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Full Property Address *" error={errors.fullAddress}>
                <Input type="text" placeholder="e.g. Block 12, Rivervale Drive, #01-01" value={form.fullAddress} onChange={e => set('fullAddress', e.target.value)} />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Postal Code *" error={errors.postalCode}>
                  <Input type="tel" inputMode="numeric" pattern="[0-9]*" placeholder="e.g. 543210" value={form.postalCode} onChange={e => set('postalCode', e.target.value.replace(/\D/g, ''))} maxLength={6} />
                </FormField>
                <FormField label="Unit Number">
                  <Input type="text" placeholder="e.g. #12-34" value={form.unitNumber} onChange={e => set('unitNumber', e.target.value)} />
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Pool Length (m)">
                  <Input type="tel" inputMode="numeric" pattern="[0-9]*" placeholder="e.g. 25" value={form.poolLength} onChange={e => set('poolLength', e.target.value.replace(/\D/g, ''))} />
                </FormField>
                <FormField label="Max Depth (m)">
                  <Input type="text" placeholder="e.g. 1.5" value={form.poolDepth} onChange={e => set('poolDepth', e.target.value)} />
                </FormField>
              </div>
              <div className="flex gap-3 pt-1">
                <Button variant="outline" className="flex-1 text-sm" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button className="flex-1 bg-[oklch(0.55_0.14_200)] hover:bg-[oklch(0.45_0.14_200)] text-white text-sm" onClick={handleRegister} disabled={registerPool.isPending}>
                  {registerPool.isPending ? 'Registering…' : 'Register Pool'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
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
