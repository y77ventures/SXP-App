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

const POOL_TYPES = [
  { label: 'Condominium Pool', value: 'condominium' },
  { label: 'Landed Estate Pool', value: 'landed_estate' },
  { label: 'Private Club Pool', value: 'other' },
  { label: 'Corporate Pool', value: 'other' }
];
const SECURITY_TYPES = ['Lobby Pass Required', 'Visitor Registration', 'Access Card', 'Intercom Entry', 'No Security Required'];

export default function PoolHostDashboard() {
  const { user } = useAuth();
  const { data: pools, refetch } = trpc.poolHost.myPools.useQuery();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    estateName: '', poolType: '' as 'condominium' | 'landed_estate' | 'other', fullAddress: '', postalCode: '',
    unitNumber: '', poolLength: 0, poolDepth: '',
    securityGuidelines: '', accessInstructions: '',
  });

  const registerPool = trpc.poolHost.registerPool.useMutation({
    onSuccess: () => {
      toast.success('Pool registered successfully');
      setShowForm(false);
      setForm({ estateName: '', poolType: '' as 'condominium' | 'landed_estate' | 'other', fullAddress: '', postalCode: '', unitNumber: '', poolLength: 0, poolDepth: '', securityGuidelines: '', accessInstructions: '' });
      refetch();
    },
    onError: (e) => toast.error(e.message),
  });

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

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
        {/* Notice */}
        <Card className="border-0 shadow-sm bg-amber-50 border-l-4 border-l-amber-400">
          <CardContent className="p-4 flex gap-3">
            <Shield size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Private Facilities Only</p>
              <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                SwimXP Connect does not list public pools. Please register your condominium, landed estate, or private club pool details below. All entries are verified before going live.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Registered Pools */}
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
                    <p className="text-xs text-muted-foreground">Postal: {pool.postalCode}</p>
                  </div>
                </div>
                <Badge className={pool.mcstApproved
                  ? 'bg-emerald-100 text-emerald-700 border-0 text-xs'
                  : 'bg-amber-100 text-amber-700 border-0 text-xs'}>
                  {pool.mcstApproved ? <><CheckCircle size={10} className="inline mr-1" />Verified</> : 'Pending'}
                </Badge>
              </div>
              {pool.securityGuidelines && (
                <div className="mt-3 p-2 bg-[oklch(0.97_0.005_220)] rounded-lg">
                  <p className="text-xs text-muted-foreground"><Shield size={10} className="inline mr-1" />Security: {pool.securityGuidelines}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Add Pool Button */}
        {!showForm && (
          <Button className="w-full bg-[oklch(0.55_0.14_200)] hover:bg-[oklch(0.45_0.14_200)] text-white gap-2"
            onClick={() => setShowForm(true)}>
            <Plus size={16} /> Register New Pool
          </Button>
        )}

        {/* Registration Form */}
        {showForm && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-navy flex items-center gap-2">
                <Building2 size={16} /> Register Private Pool
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Pool / Facility Name *</Label>
                <Input className="mt-1 h-9 text-sm" placeholder="e.g. Rivervale Condo Pool" onChange={f('estateName')} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Facility Type *</Label>
                <Select onValueChange={(v) => setForm(p => ({ ...p, poolType: v as 'condominium' | 'landed_estate' | 'other' }))}>
                  <SelectTrigger className="mt-1 h-9 text-sm"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {POOL_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Condominium / Estate Name *</Label>
                <Input className="mt-1 h-9 text-sm" placeholder="e.g. The Rivervale" onChange={f('estateName')} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Full Property Address *</Label>
                <Input className="mt-1 h-9 text-sm" placeholder="Block 12, Rivervale Drive, #01-01" onChange={f('fullAddress')} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Postal Code *</Label>
                  <Input className="mt-1 h-9 text-sm" placeholder="543210" maxLength={6} onChange={f('postalCode')} />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Unit Number</Label>
                  <Input className="mt-1 h-9 text-sm" placeholder="#12-34" onChange={f('unitNumber')} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Pool Length (m)</Label>
                  <Input className="mt-1 h-9 text-sm" type="number" placeholder="25" onChange={f('poolLength')} />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Max Depth (m)</Label>
                  <Input className="mt-1 h-9 text-sm" type="number" placeholder="1.5" onChange={f('poolDepth')} />
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Security / Entry Requirements *</Label>
                <Select onValueChange={(v) => setForm(p => ({ ...p, securityType: v }))}>
                  <SelectTrigger className="mt-1 h-9 text-sm"><SelectValue placeholder="Select entry type" /></SelectTrigger>
                  <SelectContent>
                    {SECURITY_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Security Entry Instructions</Label>
                <Textarea className="mt-1 text-sm resize-none" rows={3}
                  placeholder="e.g. Coach must register at lobby reception. Bring NRIC. Pool access via Level 2 lift lobby."
                  onChange={f('securityGuidelines')} />
              </div>
              <div className="flex gap-3 pt-1">
                <Button variant="outline" className="flex-1 text-sm" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button className="flex-1 bg-[oklch(0.55_0.14_200)] hover:bg-[oklch(0.45_0.14_200)] text-white text-sm"
                  onClick={() => registerPool.mutate(form)}
                  disabled={registerPool.isPending || !form.estateName || !form.fullAddress || !form.postalCode}>
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
