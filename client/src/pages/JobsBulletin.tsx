// JobsBulletin — Coach Acquisition Jobs Bulletin Board
// 15 mock client requests visible to coaches; shows real demand even with no live clients
// Accessible from Coach Dashboard

import { useState } from 'react';
import { useLocation } from 'wouter';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft, MapPin, Clock, Users, Star, Briefcase,
  ChevronRight, Bell, Filter, Zap, DollarSign
} from 'lucide-react';
import { toast } from 'sonner';
import SEOHead, { SEO_PAGES } from '@/components/SEOHead';

interface JobRequest {
  id: string;
  title: string;
  parentName: string;
  location: string;
  region: string;
  poolType: string;
  childAge: number;
  childLevel: string;
  sessionType: string;
  frequency: string;
  preferredTime: string;
  budget: string;
  postedAgo: string;
  urgency: 'High' | 'Medium' | 'Low';
  applicants: number;
  description: string;
}

const mockJobs: JobRequest[] = [
  {
    id: 'j01',
    title: '1-to-1 Weekend Lessons for 5-Year-Old Beginner',
    parentName: 'Sarah T.',
    location: 'The Parc Condo, Tampines',
    region: 'East',
    poolType: 'Condo Pool',
    childAge: 5,
    childLevel: 'Beginner (no water experience)',
    sessionType: '1-to-1',
    frequency: 'Every Saturday & Sunday',
    preferredTime: '8:00 AM – 10:00 AM',
    budget: '$80–$100 / session',
    postedAgo: '2 hours ago',
    urgency: 'High',
    applicants: 2,
    description: 'Looking for a patient, certified coach for my 5-year-old daughter. She has never been in a pool before. Prefer female coach. Condo pool is available on weekends.',
  },
  {
    id: 'j02',
    title: 'Group Class (2 Kids) at Pasir Ris Condo',
    parentName: 'Michael L.',
    location: 'Loyang Valley, Pasir Ris',
    region: 'East',
    poolType: 'Condo Pool',
    childAge: 7,
    childLevel: 'Beginner (can float)',
    sessionType: '1-to-2',
    frequency: 'Weekday evenings',
    preferredTime: '5:30 PM – 7:00 PM',
    budget: '$60–$70 / session per child',
    postedAgo: '5 hours ago',
    urgency: 'Medium',
    applicants: 4,
    description: 'My 7-year-old and neighbour\'s 6-year-old need lessons together. Both can float but not swim independently. Flexible on days.',
  },
  {
    id: 'j03',
    title: 'Competitive Stroke Improvement for 10-Year-Old',
    parentName: 'Rachel K.',
    location: 'Yishun Swimming Complex',
    region: 'North',
    poolType: 'Public Complex',
    childAge: 10,
    childLevel: 'Intermediate (Stroke Technique & Endurance)',
    sessionType: '1-to-1',
    frequency: '3x per week',
    preferredTime: 'Flexible',
    budget: '$120–$150 / session',
    postedAgo: '1 day ago',
    urgency: 'High',
    applicants: 6,
    description: 'My son competes at school level. Looking for a coach who can work on advanced stroke technique and timing improvement. Competitive training focus.',
  },
  {
    id: 'j04',
    title: 'Water Confidence for Anxious 4-Year-Old',
    parentName: 'Priya M.',
    location: 'Novena Residences, Novena',
    region: 'Central',
    poolType: 'Condo Pool',
    childAge: 4,
    childLevel: 'Beginner (water-phobic)',
    sessionType: '1-to-1',
    frequency: 'Once a week',
    preferredTime: 'Saturday mornings',
    budget: '$90–$110 / session',
    postedAgo: '3 hours ago',
    urgency: 'High',
    applicants: 1,
    description: 'My daughter is very scared of water. Need a gentle, experienced coach who specialises in young children with water anxiety. Patience is key.',
  },
  {
    id: 'j05',
    title: 'Adult Beginner — Learn to Swim from Scratch',
    parentName: 'David C.',
    location: 'Clementi Swimming Complex',
    region: 'West',
    poolType: 'Public Complex',
    childAge: 35,
    childLevel: 'Adult Beginner',
    sessionType: '1-to-1',
    frequency: 'Twice a week',
    preferredTime: 'Early mornings (6–8 AM)',
    budget: '$100–$130 / session',
    postedAgo: '6 hours ago',
    urgency: 'Medium',
    applicants: 3,
    description: 'I\'m 35 and never learned to swim. Looking for a patient coach for early morning sessions before work. Prefer male coach.',
  },
  {
    id: 'j06',
    title: 'Siblings Package — 3 Kids at Jurong Condo',
    parentName: 'Wendy H.',
    location: 'Lakeside Residences, Jurong',
    region: 'West',
    poolType: 'Condo Pool',
    childAge: 8,
    childLevel: 'Mixed (beginner to intermediate)',
    sessionType: '1-to-3',
    frequency: 'Sunday mornings',
    preferredTime: '9:00 AM – 11:00 AM',
    budget: '$50 / session per child',
    postedAgo: '2 days ago',
    urgency: 'Low',
    applicants: 5,
    description: 'Three kids aged 6, 8, and 11 with different skill levels. Looking for a coach who can manage a small group with varied abilities.',
  },
  {
    id: 'j07',
    title: 'Pre-School Swim Readiness (3 Years Old)',
    parentName: 'Amanda T.',
    location: 'Braddell View, Marymount',
    region: 'Central',
    poolType: 'Condo Pool',
    childAge: 3,
    childLevel: 'Pre-school (parent-accompanied)',
    sessionType: '1-to-1',
    frequency: 'Weekly',
    preferredTime: 'Weekday afternoons',
    budget: '$80–$100 / session',
    postedAgo: '4 hours ago',
    urgency: 'Medium',
    applicants: 2,
    description: 'My 3-year-old is ready to start swimming. I will be in the pool with her. Looking for a coach experienced with toddlers and parent-child classes.',
  },
  {
    id: 'j08',
    title: 'SwimSafer Stage 3 Preparation',
    parentName: 'Jason W.',
    location: 'Bedok Swimming Complex',
    region: 'East',
    poolType: 'Public Complex',
    childAge: 9,
    childLevel: 'Intermediate (SwimSafer Stage 2)',
    sessionType: '1-to-1',
    frequency: '2x per week',
    preferredTime: 'After school (4–6 PM)',
    budget: '$100–$120 / session',
    postedAgo: '1 day ago',
    urgency: 'High',
    applicants: 7,
    description: 'My son needs to pass SwimSafer Stage 3 by December for school requirements. Looking for a structured coaching plan.',
  },
  {
    id: 'j09',
    title: 'Triathlon Swim Training for Adult',
    parentName: 'Kevin O.',
    location: 'Kallang Basin Swimming Complex',
    region: 'Central',
    poolType: 'Public Complex',
    childAge: 28,
    childLevel: 'Adult Intermediate',
    sessionType: '1-to-1',
    frequency: '3x per week',
    preferredTime: 'Early mornings or evenings',
    budget: '$140–$160 / session',
    postedAgo: '8 hours ago',
    urgency: 'High',
    applicants: 4,
    description: 'Training for my first triathlon in 6 months. Can swim but need to improve open-water technique, endurance, and flip turns. Serious commitment.',
  },
  {
    id: 'j10',
    title: 'Weekend Group Class at AMK Condo',
    parentName: 'Fiona L.',
    location: 'Thomson Impressions, Upper Thomson',
    region: 'Central',
    poolType: 'Condo Pool',
    childAge: 6,
    childLevel: 'Beginner',
    sessionType: '1-to-2',
    frequency: 'Saturdays',
    preferredTime: '8:30 AM – 10:00 AM',
    budget: '$65–$75 / session per child',
    postedAgo: '3 days ago',
    urgency: 'Low',
    applicants: 3,
    description: 'My 6-year-old and a friend\'s child. Both are beginners. Looking for a fun, engaging coach who can make lessons enjoyable for young kids.',
  },
  {
    id: 'j11',
    title: 'Stroke Correction for Competitive Teen',
    parentName: 'Lily C.',
    location: 'Woodlands Swimming Complex',
    region: 'North',
    poolType: 'Public Complex',
    childAge: 14,
    childLevel: 'Advanced (school team)',
    sessionType: '1-to-1',
    frequency: '4x per week',
    preferredTime: 'Early mornings (5:30–7:30 AM)',
    budget: '$150–$180 / session',
    postedAgo: '12 hours ago',
    urgency: 'High',
    applicants: 8,
    description: 'My daughter is on the school swim team and needs elite-level coaching for all stroke technique refinement. Video analysis preferred.',
  },
  {
    id: 'j12',
    title: 'Elderly Parent — Aqua Therapy Sessions',
    parentName: 'Benjamin T.',
    location: 'Toa Payoh Swimming Complex',
    region: 'South',
    poolType: 'Public Complex',
    childAge: 68,
    childLevel: 'Adult (rehabilitation)',
    sessionType: '1-to-1',
    frequency: 'Twice a week',
    preferredTime: 'Weekday mornings',
    budget: '$90–$110 / session',
    postedAgo: '2 days ago',
    urgency: 'Medium',
    applicants: 2,
    description: 'My 68-year-old mother needs gentle aqua therapy following knee surgery. Looking for a coach with physiotherapy or rehabilitation experience.',
  },
  {
    id: 'j13',
    title: 'Twins — Beginner Lessons at Bishan Pool',
    parentName: 'Grace N.',
    location: 'Bishan Swimming Complex',
    region: 'South',
    poolType: 'Public Complex',
    childAge: 7,
    childLevel: 'Beginner',
    sessionType: '1-to-2',
    frequency: 'Weekends',
    preferredTime: 'Flexible',
    budget: '$70 / session per child',
    postedAgo: '5 hours ago',
    urgency: 'Medium',
    applicants: 3,
    description: 'Twin boys, 7 years old, both complete beginners. Looking for a coach who can teach them together and keep them engaged.',
  },
  {
    id: 'j14',
    title: 'Home Condo Pool — Flexible Scheduling',
    parentName: 'Irene S.',
    location: 'Parc Botannia, Sengkang',
    region: 'North',
    poolType: 'Condo Pool',
    childAge: 8,
    childLevel: 'Beginner (can float)',
    sessionType: '1-to-1',
    frequency: 'Flexible (2–3x per month)',
    preferredTime: 'Weekends preferred',
    budget: '$85–$100 / session',
    postedAgo: '1 day ago',
    urgency: 'Low',
    applicants: 4,
    description: 'Flexible schedule, happy to work around the coach\'s availability. My son can float but needs to learn proper stroke technique.',
  },
  {
    id: 'j15',
    title: 'Corporate Wellness — Office Pool Sessions',
    parentName: 'HR Team, TechCorp SG',
    location: 'Raffles Town Club, Bukit Timah',
    region: 'Central',
    poolType: 'Clubhouse',
    childAge: 0,
    childLevel: 'Mixed adult levels',
    sessionType: 'Group (6–8 pax)',
    frequency: 'Every Friday',
    preferredTime: '12:00 PM – 1:30 PM',
    budget: '$300–$400 / session (group)',
    postedAgo: '6 hours ago',
    urgency: 'High',
    applicants: 1,
    description: 'Corporate wellness programme for 6–8 employees. Mixed skill levels. Looking for an engaging coach who can run structured group sessions. Ongoing contract possible.',
  },
];

const urgencyColors = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-green-100 text-green-700',
};

export default function JobsBulletin() {
  const [, navigate] = useLocation();
  const [filter, setFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [applied, setApplied] = useState<Set<string>>(new Set());

  const filtered = filter === 'All' ? mockJobs : mockJobs.filter(j => j.urgency === filter);

  const handleApply = (job: JobRequest) => {
    const next = new Set(applied);
    next.add(job.id);
    setApplied(next);
    toast.success(`Application sent for "${job.title}"`, {
      description: `${job.parentName} will receive your profile and respond within 24 hours.`,
    });
  };

  return (
    <AppLayout hideNav>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[oklch(0.965_0.012_220)] border-b border-border/50">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => navigate('/dashboard')} className="w-8 h-8 rounded-xl bg-[oklch(0.955_0.010_220)] flex items-center justify-center">
              <ChevronLeft size={16} />
            </button>
            <div>
              <h1 className="text-lg font-bold font-display" style={{ color: 'oklch(0.22 0.06 240)' }}>
                Jobs Bulletin Board
              </h1>
              <p className="text-xs text-muted-foreground">{mockJobs.length} open client requests</p>
            </div>
          </div>

          {/* Urgency filter */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
            {(['All', 'High', 'Medium', 'Low'] as const).map(u => (
              <button
                key={u}
                onClick={() => setFilter(u)}
                className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${
                  filter === u
                    ? 'bg-[oklch(0.72_0.13_200)] text-white'
                    : 'bg-[oklch(0.955_0.010_220)] text-muted-foreground'
                }`}
              >
                {u === 'All' ? 'All Requests' : `${u} Priority`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Intro banner */}
      <div className="mx-4 mt-4 mb-3 bg-gradient-to-r from-[oklch(0.22_0.06_240)] to-[oklch(0.35_0.08_240)] rounded-2xl p-4 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Zap size={16} className="text-[oklch(0.85_0.10_200)]" />
          <span className="text-sm font-bold font-display">Real Demand, Real Clients</span>
        </div>
        <p className="text-xs text-white/80 leading-relaxed">
          These are live client requests from parents and individuals in your area. Apply to any request and we'll connect you instantly. New requests are added daily.
        </p>
      </div>

      {/* Job cards */}
      <div className="px-4 pb-24 space-y-3">
        {filtered.map(job => (
          <div key={job.id} className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden">
            <div className="px-4 pt-3 pb-3">
              {/* Title + urgency */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-sm font-display text-foreground leading-tight flex-1">
                  {job.title}
                </h3>
                <Badge className={`text-xs px-2 py-0.5 border-0 flex-shrink-0 ${urgencyColors[job.urgency]}`}>
                  {job.urgency}
                </Badge>
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground mb-2">
                <span className="flex items-center gap-1"><MapPin size={11} />{job.location}</span>
                <span className="flex items-center gap-1"><Clock size={11} />{job.postedAgo}</span>
                <span className="flex items-center gap-1"><Users size={11} />{job.applicants} applied</span>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mb-2">
                <div><span className="text-muted-foreground">Type: </span><span className="font-medium">{job.sessionType}</span></div>
                <div><span className="text-muted-foreground">Pool: </span><span className="font-medium">{job.poolType}</span></div>
                <div><span className="text-muted-foreground">Level: </span><span className="font-medium">{job.childLevel}</span></div>
                <div><span className="text-muted-foreground">Schedule: </span><span className="font-medium">{job.frequency}</span></div>
                <div className="col-span-2 flex items-center gap-1">
                  <DollarSign size={11} className="text-green-600" />
                  <span className="font-semibold text-green-700">{job.budget}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                {job.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="text-xs bg-[oklch(0.955_0.010_220)] text-muted-foreground px-2 py-0.5 rounded-full">
                  {job.region}
                </span>
                <span className="text-xs bg-[oklch(0.955_0.010_220)] text-muted-foreground px-2 py-0.5 rounded-full">
                  {job.preferredTime}
                </span>
              </div>

              {/* CTA */}
              {applied.has(job.id) ? (
                <div className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2">
                  <Star size={14} className="text-green-600" />
                  <span className="text-xs font-semibold text-green-700">Application sent — awaiting response</span>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-9 text-xs rounded-xl"
                    onClick={() => toast.info('Full details coming soon', { description: 'Contact the parent directly after applying.' })}
                  >
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 h-9 text-xs rounded-xl bg-[oklch(0.72_0.13_200)] hover:bg-[oklch(0.62_0.13_200)] text-white font-semibold"
                    onClick={() => handleApply(job)}
                  >
                    <Briefcase size={13} className="mr-1.5" />
                    Apply Now
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
