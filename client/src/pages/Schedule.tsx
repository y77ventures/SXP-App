// Schedule — Parent & Coach schedule view
// Design: Aqua Clarity — calendar tabs, lesson cards with status badges

import { useState } from 'react';
import { Calendar, Clock, MapPin, User, CheckCircle2, XCircle, AlertCircle, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';
import AppLayout from '@/components/AppLayout';
import { lessons } from '@/lib/mockData';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const STATUS_CONFIG = {
  Scheduled: { color: 'bg-blue-50 text-blue-600', icon: Clock },
  Confirmed: { color: 'bg-[oklch(0.93_0.05_200)] text-[oklch(0.52_0.14_200)]', icon: CheckCircle2 },
  Completed: { color: 'bg-green-50 text-green-600', icon: CheckCircle2 },
  Cancelled: { color: 'bg-red-50 text-red-500', icon: XCircle },
  'Makeup Requested': { color: 'bg-amber-50 text-amber-600', icon: AlertCircle },
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const today = new Date();
const weekDates = DAYS.map((d, i) => {
  const date = new Date(today);
  const dayOfWeek = today.getDay();
  const diff = i - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
  date.setDate(today.getDate() + diff);
  return { day: d, date: date.getDate(), full: date.toISOString().split('T')[0] };
});

export default function Schedule() {
  const [, navigate] = useLocation();
  const [selectedDay, setSelectedDay] = useState(weekDates.find(d => d.full === today.toISOString().split('T')[0])?.full ?? weekDates[0].full);
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  const todayLessons = lessons.filter(l => l.date === selectedDay);
  const upcomingLessons = lessons.filter(l => l.date >= today.toISOString().split('T')[0] && l.status !== 'Cancelled');
  const pastLessons = lessons.filter(l => l.status === 'Completed' || l.status === 'Cancelled');

  return (
    <AppLayout>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[oklch(0.965_0.012_220)]/95 backdrop-blur-xl border-b border-border/50 px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold font-display text-navy">Schedule</h1>
          <Link href="/book">
            <Button size="sm" className="bg-[oklch(0.72_0.13_200)] text-white rounded-full text-xs">
              + Book Lesson
            </Button>
          </Link>
        </div>
        {/* Week strip */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
          {weekDates.map(({ day, date, full }) => {
            const hasLesson = lessons.some(l => l.date === full);
            const isToday = full === today.toISOString().split('T')[0];
            const isSelected = full === selectedDay;
            return (
              <button
                key={full}
                onClick={() => setSelectedDay(full)}
                className={cn(
                  'flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl transition-all duration-200 min-w-[48px]',
                  isSelected
                    ? 'bg-[oklch(0.72_0.13_200)] text-white'
                    : isToday
                    ? 'bg-[oklch(0.93_0.05_200)] text-[oklch(0.72_0.13_200)]'
                    : 'text-muted-foreground'
                )}
              >
                <span className="text-[10px] font-medium">{day}</span>
                <span className={cn('text-base font-bold font-display', isSelected ? 'text-white' : '')}>{date}</span>
                {hasLesson && (
                  <div className={cn('w-1 h-1 rounded-full mt-0.5', isSelected ? 'bg-white' : 'bg-[oklch(0.72_0.13_200)]')} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Day lessons */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">
            {selectedDay === today.toISOString().split('T')[0] ? "Today's Lessons" : `Lessons on ${selectedDay}`}
          </h2>
          {todayLessons.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-[oklch(0.955_0.010_220)] rounded-2xl">
              <Calendar size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No lessons on this day</p>
              <Link href="/book">
                <Button variant="outline" size="sm" className="mt-3 text-xs">Book a Lesson</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {todayLessons.map(lesson => {
                const cfg = STATUS_CONFIG[lesson.status];
                const StatusIcon = cfg.icon;
                return (
                  <div key={lesson.id} className="bg-white rounded-2xl border border-border/50 p-4 shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-sm font-display text-navy">{lesson.studentName}</h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          <User size={11} className="text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{lesson.coachName}</span>
                        </div>
                      </div>
                      <span className={cn('text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1', cfg.color)}>
                        <StatusIcon size={11} />
                        {lesson.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock size={11} />
                        {lesson.time} · {lesson.duration} min
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={11} />
                        {lesson.poolName}
                      </div>
                    </div>
                    {lesson.notes && (
                      <p className="text-xs text-muted-foreground mt-2 bg-[oklch(0.955_0.010_220)] rounded-lg px-3 py-2">
                        📝 {lesson.notes}
                      </p>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 text-xs border-[oklch(0.72_0.13_200)] text-[oklch(0.52_0.14_200)] w-full flex items-center gap-1.5"
                      onClick={() => navigate('/chat')}
                    >
                      <MessageCircle size={12} /> Message Coach
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tab: upcoming / past */}
        <div className="flex gap-1 bg-[oklch(0.955_0.010_220)] p-1 rounded-xl mb-4">
          {(['upcoming', 'past'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 capitalize',
                tab === t ? 'bg-white text-navy shadow-sm' : 'text-muted-foreground'
              )}
            >
              {t === 'upcoming' ? `Upcoming (${upcomingLessons.length})` : `Past (${pastLessons.length})`}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {(tab === 'upcoming' ? upcomingLessons : pastLessons).map(lesson => {
            const cfg = STATUS_CONFIG[lesson.status];
            const StatusIcon = cfg.icon;
            return (
              <div key={lesson.id} className="bg-white rounded-2xl border border-border/50 p-4 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-sm font-display text-navy">{lesson.studentName}</h3>
                    <span className="text-xs text-muted-foreground">{lesson.coachName}</span>
                  </div>
                  <span className={cn('text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1', cfg.color)}>
                    <StatusIcon size={11} />
                    {lesson.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar size={11} />
                    {lesson.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={11} />
                    {lesson.time} · {lesson.duration} min
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <MapPin size={11} />
                  {lesson.poolName}
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs border-[oklch(0.72_0.13_200)] text-[oklch(0.52_0.14_200)] flex items-center gap-1.5"
                    onClick={() => navigate('/chat')}
                  >
                    <MessageCircle size={12} /> Message
                  </Button>
                  {lesson.status === 'Makeup Requested' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs border-amber-300 text-amber-600"
                      onClick={() => toast.success('Makeup lesson rescheduled!')}
                    >
                      Reschedule
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
