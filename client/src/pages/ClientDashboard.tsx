import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import RegionSelector from '@/components/RegionSelector';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'wouter';
import { Home, Calendar, DollarSign, User, CheckCircle, Clock, XCircle, Star, MapPin } from 'lucide-react';

export default function ClientDashboard() {
  const { user } = useAuth();
  const { data: profile } = trpc.clientProfile.myProfile.useQuery();
  const { data: lessons } = trpc.clientProfile.myLessons.useQuery();
  const billing: Array<{id: number; amount: string; status: string; description?: string; createdAt: Date}> = [];
  const coaches: Array<{id: number; userId: number; primaryCert?: string; languages?: string; photoUrl?: string; certStatus?: string}> = [];

  const upcoming = lessons?.filter(l => l.status === 'confirmed' || l.status === 'pending') ?? [];
  const past = lessons?.filter(l => l.status === 'completed' || l.status === 'cancelled') ?? [];
  const totalSpent = billing.reduce((sum: number, b: {amount: string}) => sum + parseFloat(b.amount ?? '0'), 0);

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
          <Badge className="bg-white/10 text-white/80 border-white/20 text-xs">Client</Badge>
        </div>
        <h1 className="text-xl font-extrabold font-display">Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!</h1>
        <p className="text-white/60 text-xs mt-0.5">Your swim lesson dashboard</p>
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-0 shadow-sm text-center">
            <CardContent className="p-3">
              <p className="text-2xl font-bold text-navy">{upcoming.length}</p>
              <p className="text-xs text-muted-foreground">Upcoming</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm text-center">
            <CardContent className="p-3">
              <p className="text-2xl font-bold text-navy">{past.filter(l => l.status === 'completed').length}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm text-center">
            <CardContent className="p-3">
              <p className="text-lg font-bold text-[oklch(0.55_0.14_200)]">${totalSpent.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">Total Spent</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="lessons">
          <TabsList className="w-full bg-white border border-border/40 rounded-xl p-1">
            <TabsTrigger value="lessons" className="flex-1 text-xs rounded-lg">Lessons</TabsTrigger>
            <TabsTrigger value="coaches" className="flex-1 text-xs rounded-lg">Coaches</TabsTrigger>
            <TabsTrigger value="billing" className="flex-1 text-xs rounded-lg">Billing</TabsTrigger>
            <TabsTrigger value="profile" className="flex-1 text-xs rounded-lg">Profile</TabsTrigger>
          </TabsList>

          {/* Lessons */}
          <TabsContent value="lessons" className="mt-4 space-y-4">
            {upcoming.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Upcoming</p>
                <div className="space-y-3">
                  {upcoming.map((lesson) => (
                    <Card key={lesson.id} className="border-0 shadow-sm border-l-4 border-l-[oklch(0.72_0.13_200)]">
                      <CardContent className="p-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-sm text-navy">
                            {new Date(lesson.scheduledAt).toLocaleDateString('en-SG', { weekday: 'long', month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(lesson.scheduledAt).toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })} · {lesson.durationMinutes} min
                          </p>
                          {lesson.notes && <p className="text-xs text-muted-foreground capitalize mt-0.5">{lesson.notes}</p>}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-navy">${lesson.rateAtBooking}</p>
                          <Badge className="bg-blue-100 text-blue-700 border-0 text-xs mt-1">{lesson.status}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {past.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Past Lessons</p>
                <div className="space-y-3">
                  {past.map((lesson) => (
                    <Card key={lesson.id} className="border-0 shadow-sm opacity-80">
                      <CardContent className="p-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-sm text-navy">
                            {new Date(lesson.scheduledAt).toLocaleDateString('en-SG', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(lesson.scheduledAt).toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })} · {lesson.durationMinutes} min
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-navy">${lesson.rateAtBooking}</p>
                          <Badge className={lesson.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-700 border-0 text-xs mt-1'
                            : 'bg-red-100 text-red-700 border-0 text-xs mt-1'}>
                            {lesson.status === 'completed' ? <><CheckCircle size={9} className="inline mr-0.5" />Done</> : <><XCircle size={9} className="inline mr-0.5" />Cancelled</>}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {!lessons?.length && (
              <div className="text-center py-12 text-muted-foreground text-sm">
                <Calendar size={36} className="mx-auto mb-3 text-muted-foreground/40" />
                <p className="font-medium">No lessons yet</p>
                <p className="text-xs mt-1">Find a coach and book your first lesson</p>
                <Link href="/matches">
                  <Button className="mt-4 bg-[oklch(0.55_0.14_200)] hover:bg-[oklch(0.45_0.14_200)] text-white text-sm">
                    Find a Coach
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          {/* My Coaches */}
          <TabsContent value="coaches" className="mt-4 space-y-3">
            {!coaches?.length ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                <User size={36} className="mx-auto mb-3 text-muted-foreground/40" />
                <p className="font-medium">No coaches assigned yet</p>
                <Link href="/matches">
                  <Button className="mt-4 bg-[oklch(0.55_0.14_200)] hover:bg-[oklch(0.45_0.14_200)] text-white text-sm">
                    Browse Coaches
                  </Button>
                </Link>
              </div>
            ) : coaches.map((coach) => (
              <Card key={coach.id} className="border-0 shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  {coach.photoUrl ? (
                    <img src={coach.photoUrl} alt="Coach" className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-[oklch(0.93_0.05_200)] flex items-center justify-center">
                      <User size={20} className="text-[oklch(0.55_0.14_200)]" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-navy">Coach ID #{coach.userId}</p>
                    {coach.primaryCert && <p className="text-xs text-muted-foreground">{coach.primaryCert}</p>}
                    {coach.languages && <p className="text-xs text-muted-foreground">{coach.languages}</p>}
                  </div>
                  {coach.certStatus === 'approved' && (
                    <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">Verified</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Profile & Region */}
          <TabsContent value="profile" className="mt-4 space-y-4">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
                  <MapPin size={14} className="text-[oklch(0.55_0.14_200)]" /> My Location
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <RegionSelector
                  initialValue={profile?.goals ? (() => { try { return JSON.parse(profile.goals ?? '').region; } catch { return undefined; } })() : undefined}
                />
              </CardContent>
            </Card>

            {/* Swimmer profile summary */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
                  <User size={14} className="text-[oklch(0.55_0.14_200)]" /> Swimmer Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {profile ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-xs">Swimmer type</span>
                      <span className="text-xs font-semibold capitalize">{profile.swimmerType?.replace('_', ' ')}</span>
                    </div>
                    {profile.swimmerName && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-xs">Name</span>
                        <span className="text-xs font-semibold">{profile.swimmerName}</span>
                      </div>
                    )}
                    {profile.swimmerAgeGroup && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-xs">Age group</span>
                        <span className="text-xs font-semibold">{profile.swimmerAgeGroup} yrs</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-xs">Swim level</span>
                      <span className="text-xs font-semibold capitalize">{profile.swimLevel?.replace('_', ' ')}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Complete onboarding to set up your swimmer profile.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing */}
          <TabsContent value="billing" className="mt-4 space-y-3">
            <Card className="border-0 shadow-sm bg-[oklch(0.18_0.06_240)] text-white">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/60">Total Spent</p>
                  <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
                </div>
                <DollarSign size={32} className="text-white/20" />
              </CardContent>
            </Card>

            {!billing?.length ? (
              <div className="text-center py-10 text-muted-foreground text-sm">
                <DollarSign size={32} className="mx-auto mb-2 text-muted-foreground/40" />
                No billing history yet
              </div>
            ) : billing.map((b) => (
              <Card key={b.id} className="border-0 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-sm text-navy">${b.amount}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(b.createdAt).toLocaleDateString('en-SG', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    {b.description && <p className="text-xs text-muted-foreground mt-0.5">{b.description}</p>}
                  </div>
                  <Badge className={b.status === 'paid'
                    ? 'bg-emerald-100 text-emerald-700 border-0 text-xs'
                    : b.status === 'pending' ? 'bg-amber-100 text-amber-700 border-0 text-xs'
                    : 'bg-red-100 text-red-700 border-0 text-xs'}>
                    {b.status}
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
