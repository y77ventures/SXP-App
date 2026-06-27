import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Link } from 'wouter';
import {
  Users, ShieldCheck, AlertTriangle, DollarSign, CheckCircle, XCircle,
  Home, TrendingUp, Building2, Clock
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={22} className="text-white" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          <p className="text-2xl font-bold text-navy">{value}</p>
          {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export default function RootAdminDashboard() {
  const { user } = useAuth();
  const { data: stats } = trpc.admin.platformStats.useQuery();
  const { data: pending, refetch: refetchPending } = trpc.admin.pendingCoaches.useQuery();
  const { data: expiring } = trpc.admin.expiringCoaches.useQuery({ withinDays: 30 });
  const { data: schools } = trpc.admin.allSwimSchools.useQuery();

  const approveCoach = trpc.admin.approveCoach.useMutation({
    onSuccess: () => { toast.success('Coach status updated'); refetchPending(); },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.005_220)]">
      {/* Header */}
      <div className="bg-[oklch(0.18_0.06_240)] text-white px-4 pt-10 pb-6">
        <div className="flex items-center justify-between mb-1">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 -ml-2 gap-1">
              <Home size={14} /> Home
            </Button>
          </Link>
          <Badge className="bg-red-500/20 text-red-200 border-red-500/30 text-xs">Root Admin</Badge>
        </div>
        <h1 className="text-2xl font-extrabold font-display">Platform Command</h1>
        <p className="text-white/60 text-sm mt-0.5">SwimXP Connect · Global Overview</p>
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={Users} label="Total Users" value={stats?.totalUsers ?? '—'} color="bg-[oklch(0.55_0.14_200)]" />
          <StatCard icon={ShieldCheck} label="Coaches" value={stats?.totalCoaches ?? '—'} color="bg-emerald-500" />
          <StatCard icon={TrendingUp} label="Lessons" value={stats?.totalLessons ?? '—'} color="bg-violet-500" />
          <StatCard icon={DollarSign} label="Platform Fees" value={`$${parseFloat(stats?.totalFees ?? '0').toFixed(2)}`} color="bg-amber-500" />
        </div>

        <Tabs defaultValue="pending">
          <TabsList className="w-full bg-white border border-border/40 rounded-xl p-1">
            <TabsTrigger value="pending" className="flex-1 text-xs rounded-lg">
              Pending ({pending?.length ?? 0})
            </TabsTrigger>
            <TabsTrigger value="expiring" className="flex-1 text-xs rounded-lg">
              Expiring ({expiring?.length ?? 0})
            </TabsTrigger>
            <TabsTrigger value="schools" className="flex-1 text-xs rounded-lg">
              Schools ({schools?.length ?? 0})
            </TabsTrigger>
          </TabsList>

          {/* Pending Coach Approvals */}
          <TabsContent value="pending" className="mt-4 space-y-3">
            {!pending?.length && (
              <div className="text-center py-10 text-muted-foreground text-sm">
                <CheckCircle size={32} className="mx-auto mb-2 text-emerald-400" />
                No pending coach applications
              </div>
            )}
            {pending?.map((coach) => (
              <Card key={coach.id} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-navy truncate">Coach ID #{coach.userId}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {coach.primaryCert ?? 'No cert'} · {coach.lifesavingCert ?? 'No lifesaving cert'}
                      </p>
                      {coach.primaryCertExpiry && (
                        <p className="text-xs text-muted-foreground">
                          Primary expires: {new Date(coach.primaryCertExpiry).toLocaleDateString()}
                        </p>
                      )}
                      {coach.primaryCertProofUrl && (
                        <a href={coach.primaryCertProofUrl} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-[oklch(0.55_0.14_200)] underline mt-1 inline-block">
                          View proof document
                        </a>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        className="bg-emerald-500 hover:bg-emerald-600 text-white h-8 px-3 text-xs gap-1"
                        onClick={() => approveCoach.mutate({ coachProfileId: coach.id, approve: true })}
                        disabled={approveCoach.isPending}
                      >
                        <CheckCircle size={12} /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50 h-8 px-3 text-xs gap-1"
                        onClick={() => approveCoach.mutate({ coachProfileId: coach.id, approve: false, notes: 'Rejected by admin' })}
                        disabled={approveCoach.isPending}
                      >
                        <XCircle size={12} /> Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Expiring Certifications */}
          <TabsContent value="expiring" className="mt-4 space-y-3">
            {!expiring?.length && (
              <div className="text-center py-10 text-muted-foreground text-sm">
                <ShieldCheck size={32} className="mx-auto mb-2 text-emerald-400" />
                No certifications expiring in 30 days
              </div>
            )}
            {expiring?.map((coach) => {
              const expiry = coach.primaryCertExpiry ? new Date(coach.primaryCertExpiry) : null;
              const daysLeft = expiry ? Math.ceil((expiry.getTime() - Date.now()) / 86400000) : null;
              return (
                <Card key={coach.id} className="border-0 shadow-sm border-l-4 border-l-amber-400">
                  <CardContent className="p-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-sm text-navy">Coach ID #{coach.userId}</p>
                      <p className="text-xs text-muted-foreground">{coach.primaryCert}</p>
                      {daysLeft !== null && (
                        <p className="text-xs text-amber-600 font-medium mt-0.5">
                          <Clock size={10} className="inline mr-1" />
                          Expires in {daysLeft} day{daysLeft !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                    <Button size="sm" variant="outline" className="text-xs h-8"
                      onClick={() => toast.info('Renewal reminder sent')}>
                      Send Reminder
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Swim Schools */}
          <TabsContent value="schools" className="mt-4 space-y-3">
            {!schools?.length && (
              <div className="text-center py-10 text-muted-foreground text-sm">
                <Building2 size={32} className="mx-auto mb-2 text-muted-foreground/40" />
                No swim schools registered yet
              </div>
            )}
            {schools?.map((school) => (
              <Card key={school.id} className="border-0 shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  {school.logoUrl ? (
                    <img src={school.logoUrl} alt={school.name} className="w-12 h-12 rounded-xl object-cover border" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-[oklch(0.93_0.05_200)] flex items-center justify-center">
                      <Building2 size={20} className="text-[oklch(0.55_0.14_200)]" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-navy truncate">{school.name}</p>
                    {school.uen && <p className="text-xs text-muted-foreground">UEN: {school.uen}</p>}
                    {school.contactEmail && <p className="text-xs text-muted-foreground truncate">{school.contactEmail}</p>}
                  </div>
                  <Badge className={school.isActive ? 'bg-emerald-100 text-emerald-700 border-0' : 'bg-red-100 text-red-700 border-0'}>
                    {school.isActive ? 'Active' : 'Inactive'}
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
