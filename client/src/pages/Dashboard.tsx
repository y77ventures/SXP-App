// Dashboard — Swim School Scheduler & Coach Dashboard
// Design: Aqua Clarity — tabs for different roles, calendar, student roster, analytics

import { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, Users, Calendar, TrendingUp, AlertCircle, CheckCircle2, Clock, MapPin, Plus, BarChart3, Briefcase, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/components/AppLayout';
import { lessons, students, coaches, adminStats } from '@/lib/mockData';
import CommissionProgressTracker from '@/components/CommissionProgressTracker';
import { mockCoachCommissionDB } from '@/lib/commissionEngine';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const LOGO_IMG = '/swimxp-logo-v3.png';

const STATUS_COLORS: Record<string, string> = {
  Scheduled: 'bg-blue-50 text-blue-600',
  Confirmed: 'bg-[oklch(0.93_0.05_200)] text-[oklch(0.52_0.14_200)]',
  Completed: 'bg-green-50 text-green-600',
  Cancelled: 'bg-red-50 text-red-500',
  'Makeup Requested': 'bg-amber-50 text-amber-600',
};

const weeklyData = [
  { day: 'Mon', lessons: 8 },
  { day: 'Tue', lessons: 12 },
  { day: 'Wed', lessons: 10 },
  { day: 'Thu', lessons: 15 },
  { day: 'Fri', lessons: 9 },
  { day: 'Sat', lessons: 22 },
  { day: 'Sun', lessons: 18 },
];

const levelData = [
  { name: 'Beginner', value: 45, color: '#0CC6C6' },
  { name: 'Intermediate', value: 30, color: '#0A2540' },
  { name: 'Advanced', value: 15, color: '#FF6B6B' },
  { name: 'Competitive', value: 10, color: '#10B981' },
];

type DashTab = 'overview' | 'lessons' | 'students' | 'coaches' | 'analytics';

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<DashTab>('overview');

  const todayLessons = lessons.filter(l => l.date === '2026-06-23');
  const makeupRequests = lessons.filter(l => l.status === 'Makeup Requested');

  return (
    <AppLayout hideNav>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[oklch(0.965_0.012_220)] border-b border-border/50">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => navigate('/')} className="w-8 h-8 rounded-xl bg-[oklch(0.955_0.010_220)] flex items-center justify-center">
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-2">
              <img
                src={LOGO_IMG}
                alt="SwimXP"
                className="h-14 w-auto object-contain"
                style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))' }}
              />
              <h1 className="text-lg font-bold font-display" style={{ color: 'oklch(0.22 0.06 240)' }}>Swim School Dashboard</h1>
            </div>
          </div>
          {/* Tab bar */}
          <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
            {(['overview', 'lessons', 'students', 'coaches', 'analytics'] as DashTab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-semibold transition-all capitalize',
                  tab === t
                    ? 'bg-[oklch(0.72_0.13_200)] text-white'
                    : 'bg-[oklch(0.955_0.010_220)] text-muted-foreground'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-4 animate-fade-up">
        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="space-y-4">
            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Today's Lessons", value: todayLessons.length, icon: Calendar, color: 'text-[oklch(0.72_0.13_200)]', bg: 'bg-[oklch(0.93_0.05_200)]' },
                { label: 'Active Students', value: students.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Available Slots', value: 14, icon: Clock, color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Makeup Requests', value: makeupRequests.length, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
              ].map(card => (
                <div key={card.label} className="bg-white rounded-2xl border border-border/50 p-4 shadow-sm">
                  <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-2', card.bg)}>
                    <card.icon size={18} className={card.color} />
                  </div>
                  <div className="text-2xl font-bold font-display text-navy">{card.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{card.label}</div>
                </div>
              ))}
            </div>

            {/* Utilisation */}
            <div className="bg-white rounded-2xl border border-border/50 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm font-display text-navy">Pool Utilisation</h3>
                <span className="text-xs text-[oklch(0.72_0.13_200)] font-semibold">78%</span>
              </div>
              <div className="h-2 bg-[oklch(0.92_0.005_220)] rounded-full overflow-hidden">
                <div className="h-full bg-[oklch(0.72_0.13_200)] rounded-full" style={{ width: '78%' }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">78 of 100 available slots booked this week</p>
            </div>

            {/* Today's lessons */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm font-display text-navy">Today's Schedule</h3>
                <button onClick={() => setTab('lessons')} className="text-xs text-[oklch(0.72_0.13_200)]">View all</button>
              </div>
              <div className="space-y-2">
                {todayLessons.slice(0, 4).map(lesson => (
                  <div key={lesson.id} className="flex items-center gap-3 bg-white rounded-xl border border-border/50 p-3">
                    <div className="text-center flex-shrink-0 w-12">
                      <div className="text-xs font-bold text-[oklch(0.72_0.13_200)]">{lesson.time}</div>
                      <div className="text-[10px] text-muted-foreground">{lesson.duration}m</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-navy truncate">{lesson.studentName}</p>
                      <p className="text-xs text-muted-foreground truncate">{lesson.coachName} · {lesson.poolName}</p>
                    </div>
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0', STATUS_COLORS[lesson.status])}>
                      {lesson.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="rounded-2xl h-12 text-xs font-semibold border-[oklch(0.72_0.13_200)] text-[oklch(0.72_0.13_200)]"
                onClick={() => navigate('/book')}
              >
                <Plus size={14} className="mr-1" /> New Booking
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl h-12 text-xs font-semibold"
                onClick={() => setTab('analytics')}
              >
                <BarChart3 size={14} className="mr-1" /> Analytics
              </Button>
              <Button
                className="rounded-2xl h-12 text-xs font-semibold bg-[oklch(0.22_0.06_240)] hover:bg-[oklch(0.28_0.08_240)] text-white col-span-1"
                onClick={() => navigate('/jobs')}
              >
                <Briefcase size={14} className="mr-1" /> Jobs Bulletin
              </Button>
              <Button
                className="rounded-2xl h-12 text-xs font-semibold bg-[oklch(0.72_0.13_200)] hover:bg-[oklch(0.62_0.13_200)] text-white col-span-1"
                onClick={() => navigate('/share')}
              >
                <Share2 size={14} className="mr-1" /> Share My Link
              </Button>
            </div>

            {/* Commission Progress Tracker — compact widget */}
            <CommissionProgressTracker
              record={mockCoachCommissionDB[0]}
              compact
            />
          </div>
        )}

        {/* LESSONS */}
        {tab === 'lessons' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{lessons.length} total lessons</p>
              <Button size="sm" className="bg-[oklch(0.72_0.13_200)] text-white rounded-full text-xs" onClick={() => navigate('/book')}>
                <Plus size={12} className="mr-1" /> Add Lesson
              </Button>
            </div>
            {lessons.map(lesson => (
              <div key={lesson.id} className="bg-white rounded-2xl border border-border/50 p-4 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-sm font-display text-navy">{lesson.studentName}</h3>
                    <p className="text-xs text-muted-foreground">{lesson.coachName}</p>
                  </div>
                  <span className={cn('text-xs px-2 py-1 rounded-full font-medium', STATUS_COLORS[lesson.status])}>
                    {lesson.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1"><Calendar size={11} />{lesson.date}</div>
                  <div className="flex items-center gap-1"><Clock size={11} />{lesson.time} · {lesson.duration}m</div>
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <MapPin size={11} />{lesson.poolName}
                </div>
                {lesson.status === 'Makeup Requested' && (
                  <Button size="sm" variant="outline" className="mt-2 text-xs w-full border-amber-300 text-amber-600"
                    onClick={() => toast.success('Makeup lesson rescheduled!')}>
                    Reschedule Makeup
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* STUDENTS */}
        {tab === 'students' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{students.length} students</p>
              <Button size="sm" className="bg-[oklch(0.72_0.13_200)] text-white rounded-full text-xs"
                onClick={() => toast.info('Add student coming soon')}>
                <Plus size={12} className="mr-1" /> Add Student
              </Button>
            </div>
            {students.map(student => (
              <div key={student.id} className="bg-white rounded-2xl border border-border/50 p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <img src={student.photo} alt={student.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm font-display text-navy">{student.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Age {student.age}</span>
                      <Badge className="bg-[oklch(0.93_0.05_200)] text-[oklch(0.52_0.14_200)] border-0 text-[10px]">
                        {student.swimLevel}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold font-display text-[oklch(0.72_0.13_200)]">{student.totalLessons}</div>
                    <div className="text-[10px] text-muted-foreground">lessons</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center gap-1"><Users size={11} />Coach: {student.assignedCoach}</div>
                  <div className="flex items-center gap-1"><MapPin size={11} />{student.preferredPool}</div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" className="flex-1 text-xs rounded-xl"
                    onClick={() => toast.info('Profile coming soon')}>View Profile</Button>
                  <Button size="sm" className="flex-1 text-xs rounded-xl bg-[oklch(0.72_0.13_200)] text-white"
                    onClick={() => navigate('/book')}>Schedule</Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* COACHES */}
        {tab === 'coaches' && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">{coaches.length} coaches on platform</p>
            {coaches.slice(0, 8).map(coach => (
              <div key={coach.id} className="bg-white rounded-2xl border border-border/50 p-3 shadow-sm flex gap-3">
                <img src={coach.photo} alt={coach.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm font-display text-navy">{coach.name}</h3>
                    {coach.verified
                      ? <CheckCircle2 size={14} className="text-[oklch(0.72_0.13_200)]" />
                      : <Clock size={14} className="text-amber-500" />
                    }
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{coach.experience} yrs</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{coach.studentCount} students</span>
                  </div>
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {coach.availability.slice(0, 4).map(d => (
                      <span key={d} className="text-[10px] px-1.5 py-0.5 rounded bg-[oklch(0.93_0.05_200)] text-[oklch(0.52_0.14_200)]">{d}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ANALYTICS */}
        {tab === 'analytics' && (
          <div className="space-y-5">
            {/* Weekly lessons chart */}
            <div className="bg-white rounded-2xl border border-border/50 p-4 shadow-sm">
              <h3 className="font-semibold text-sm font-display text-navy mb-4">Weekly Lessons</h3>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={weeklyData} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 220)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'oklch(0.52 0.02 240)' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                  />
                  <Bar dataKey="lessons" fill="oklch(0.76 0.14 192)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Swim levels */}
            <div className="bg-white rounded-2xl border border-border/50 p-4 shadow-sm">
              <h3 className="font-semibold text-sm font-display text-navy mb-4">Student Levels</h3>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width={120} height={120}>
                  <PieChart>
                    <Pie data={levelData} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value" strokeWidth={0}>
                      {levelData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {levelData.map(item => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                        <span className="text-xs text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-navy">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Total Lessons', value: '50', change: '+12%', positive: true },
                { label: 'Completion Rate', value: '94%', change: '+2%', positive: true },
                { label: 'Avg Rating', value: '4.8', change: '+0.1', positive: true },
                { label: 'Cancellation Rate', value: '6%', change: '-1%', positive: true },
              ].map(kpi => (
                <div key={kpi.label} className="bg-white rounded-2xl border border-border/50 p-4 shadow-sm">
                  <div className="text-xl font-bold font-display text-navy">{kpi.value}</div>
                  <div className="text-xs text-muted-foreground">{kpi.label}</div>
                  <div className={cn('text-xs font-semibold mt-1', kpi.positive ? 'text-green-600' : 'text-red-500')}>
                    {kpi.change} this month
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
