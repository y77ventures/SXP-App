// ShareMyLink — Viral Growth Hub
// Coach custom profile URL generator + free scheduling for offline students via platform payments

import { useState } from 'react';
import { useLocation } from 'wouter';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft, Link2, Copy, Share2, CheckCircle2, Zap,
  Calendar, CreditCard, Users, Star, ExternalLink, Edit3,
  QrCode, Instagram, MessageCircle, Gift
} from 'lucide-react';
import { toast } from 'sonner';

const BASE_URL = 'swimxp.com/coach/';

export default function ShareMyLink() {
  const [, navigate] = useLocation();
  const [handle, setHandle] = useState('marcus-tan');
  const [editingHandle, setEditingHandle] = useState(false);
  const [tempHandle, setTempHandle] = useState('marcus-tan');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'schedule' | 'preview'>('link');

  const profileUrl = `https://${BASE_URL}${handle}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Link copied!', { description: profileUrl });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'Book a swim lesson with me', url: profileUrl });
    } else {
      handleCopy();
    }
  };

  const handleSaveHandle = () => {
    const clean = tempHandle.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (clean.length < 3) {
      toast.error('Handle must be at least 3 characters');
      return;
    }
    setHandle(clean);
    setEditingHandle(false);
    toast.success('Profile URL updated!', { description: `https://${BASE_URL}${clean}` });
  };

  // Mock offline students for the free scheduling demo
  const offlineStudents = [
    { name: 'Ethan Lim', age: 8, level: 'Beginner', nextLesson: 'Sat 9:00 AM', pool: 'Home Condo Pool', fee: '$90' },
    { name: 'Chloe Ng', age: 6, level: 'Pre-school', nextLesson: 'Sun 8:30 AM', pool: 'Tampines Condo', fee: '$85' },
    { name: 'Ryan Tan', age: 12, level: 'Intermediate', nextLesson: 'Tue 5:00 PM', pool: 'Bedok Complex', fee: '$110' },
  ];

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
                Share My Link
              </h1>
              <p className="text-xs text-muted-foreground">Viral Growth Hub</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            {(['link', 'schedule', 'preview'] as const).map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`flex-1 text-xs py-2 rounded-xl font-semibold capitalize transition-all ${
                  activeTab === t
                    ? 'bg-[oklch(0.72_0.13_200)] text-white'
                    : 'bg-[oklch(0.955_0.010_220)] text-muted-foreground'
                }`}
              >
                {t === 'link' ? '🔗 My Link' : t === 'schedule' ? '📅 Free Scheduler' : '👁️ Preview'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-4 pb-24 space-y-4">

        {/* ── TAB: MY LINK ── */}
        {activeTab === 'link' && (
          <>
            {/* Hero card */}
            <div className="bg-gradient-to-br from-[oklch(0.22_0.06_240)] to-[oklch(0.35_0.10_220)] rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-1">
                <Zap size={16} className="text-[oklch(0.85_0.10_200)]" />
                <span className="text-sm font-bold font-display">Your Coach Profile Link</span>
              </div>
              <p className="text-xs text-white/70 mb-4 leading-relaxed">
                Share this link on WhatsApp, Instagram, or anywhere online. Clients can view your profile, check availability, and book directly — all payments go through the platform.
              </p>

              {/* URL display */}
              <div className="bg-white/10 rounded-xl px-3 py-2.5 flex items-center gap-2 mb-3">
                <Link2 size={14} className="text-[oklch(0.85_0.10_200)] flex-shrink-0" />
                {editingHandle ? (
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-xs text-white/60 flex-shrink-0">{BASE_URL}</span>
                    <input
                      value={tempHandle}
                      onChange={e => setTempHandle(e.target.value)}
                      className="flex-1 bg-white/20 rounded-lg px-2 py-1 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/40"
                      autoFocus
                      onKeyDown={e => e.key === 'Enter' && handleSaveHandle()}
                    />
                    <button onClick={handleSaveHandle} className="text-xs text-[oklch(0.85_0.10_200)] font-semibold">Save</button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1 text-xs text-white font-mono truncate">{profileUrl}</span>
                    <button onClick={() => { setTempHandle(handle); setEditingHandle(true); }} className="flex-shrink-0">
                      <Edit3 size={13} className="text-white/60 hover:text-white" />
                    </button>
                  </>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 h-9 text-xs rounded-xl bg-white text-[oklch(0.22_0.06_240)] hover:bg-white/90 font-semibold"
                  onClick={handleCopy}
                >
                  {copied ? <CheckCircle2 size={13} className="mr-1.5 text-green-600" /> : <Copy size={13} className="mr-1.5" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </Button>
                <Button
                  size="sm"
                  className="flex-1 h-9 text-xs rounded-xl bg-[oklch(0.72_0.13_200)] hover:bg-[oklch(0.62_0.13_200)] text-white font-semibold"
                  onClick={handleShare}
                >
                  <Share2 size={13} className="mr-1.5" />
                  Share
                </Button>
              </div>
            </div>

            {/* Share channels */}
            <div>
              <h3 className="text-sm font-semibold font-display text-foreground mb-2">Share via</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: MessageCircle, label: 'WhatsApp', color: 'bg-green-50 text-green-700', action: () => window.open(`https://wa.me/?text=Book a swim lesson with me! ${profileUrl}`) },
                  { icon: Instagram, label: 'Instagram', color: 'bg-pink-50 text-pink-700', action: () => { handleCopy(); toast.info('Link copied — paste it in your Instagram bio!'); } },
                  { icon: QrCode, label: 'QR Code', color: 'bg-[oklch(0.93_0.05_200)] text-[oklch(0.42_0.14_200)]', action: () => toast.info('QR Code generator coming soon!') },
                ].map(ch => (
                  <button
                    key={ch.label}
                    onClick={ch.action}
                    className={`${ch.color} rounded-xl py-3 flex flex-col items-center gap-1.5 text-xs font-semibold transition-all active:scale-95`}
                  >
                    <ch.icon size={20} />
                    {ch.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Profile Views', value: '247', icon: Users },
                { label: 'Link Clicks', value: '89', icon: ExternalLink },
                { label: 'Bookings via Link', value: '12', icon: Star },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl border border-border/50 p-3 text-center">
                  <s.icon size={16} className="mx-auto mb-1 text-[oklch(0.72_0.13_200)]" />
                  <div className="text-lg font-bold font-display text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground leading-tight">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Free offer banner */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Gift size={16} className="text-amber-600" />
                <span className="text-sm font-bold font-display text-amber-800">Free Scheduling for Your Offline Students</span>
              </div>
              <p className="text-xs text-amber-700 leading-relaxed mb-3">
                Already have students you teach privately? Use our built-in scheduler for free — zero platform fee — as long as your clients pay securely through our Stripe Connect wallet. You keep 100% of your earnings.
              </p>
              <Button
                size="sm"
                className="w-full h-9 text-xs rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                onClick={() => setActiveTab('schedule')}
              >
                <Calendar size={13} className="mr-1.5" />
                Set Up Free Scheduler
              </Button>
            </div>
          </>
        )}

        {/* ── TAB: FREE SCHEDULER ── */}
        {activeTab === 'schedule' && (
          <>
            {/* Free offer explanation */}
            <div className="bg-gradient-to-br from-[oklch(0.22_0.06_240)] to-[oklch(0.35_0.10_220)] rounded-2xl p-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <Gift size={16} className="text-[oklch(0.85_0.10_200)]" />
                <span className="text-sm font-bold font-display">Free Scheduling Offer</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed mb-3">
                Bring your existing offline students onto the platform. Use our scheduler, calendar, and payment collection tools completely free — no platform commission — provided your clients pay through our Stripe Connect wallet engine.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: Calendar, label: 'Free scheduling & calendar' },
                  { icon: CreditCard, label: 'Secure Stripe payments' },
                  { icon: Users, label: 'Student roster management' },
                  { icon: Star, label: '0% commission on offline students' },
                ].map(f => (
                  <div key={f.label} className="flex items-center gap-2 bg-white/10 rounded-xl px-2.5 py-2">
                    <f.icon size={13} className="text-[oklch(0.85_0.10_200)] flex-shrink-0" />
                    <span className="text-xs text-white/90">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Offline students list */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold font-display text-foreground">Your Offline Students</h3>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs rounded-full"
                  onClick={() => toast.info('Add student flow coming soon!')}
                >
                  + Add Student
                </Button>
              </div>

              <div className="space-y-2">
                {offlineStudents.map(s => (
                  <div key={s.name} className="bg-white rounded-2xl border border-border/50 px-4 py-3 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm text-foreground">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.age}y · {s.level} · {s.pool}</div>
                      <div className="text-xs text-[oklch(0.72_0.13_200)] font-medium mt-0.5">
                        Next: {s.nextLesson}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-green-700">{s.fee}</div>
                      <div className="text-xs text-muted-foreground">per session</div>
                      <Badge className="mt-1 text-xs bg-green-50 text-green-700 border-0">0% fee</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stripe Connect CTA */}
            <div className="bg-[oklch(0.955_0.010_220)] rounded-2xl p-4 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard size={16} className="text-[oklch(0.72_0.13_200)]" />
                <span className="text-sm font-semibold font-display text-foreground">Connect Stripe Account</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                Connect your Stripe account to start receiving payments from your offline students securely. Funds are deposited directly to your bank account within 2 business days.
              </p>
              <Button
                className="w-full h-9 text-xs rounded-xl bg-[oklch(0.72_0.13_200)] hover:bg-[oklch(0.62_0.13_200)] text-white font-semibold"
                onClick={() => toast.info('Stripe Connect setup coming soon!', { description: 'We\'ll guide you through connecting your bank account.' })}
              >
                <CreditCard size={13} className="mr-1.5" />
                Connect Stripe — Start Accepting Payments
              </Button>
            </div>
          </>
        )}

        {/* ── TAB: PREVIEW ── */}
        {activeTab === 'preview' && (
          <>
            <div className="bg-[oklch(0.955_0.010_220)] rounded-xl px-3 py-2 text-xs text-muted-foreground text-center mb-1">
              Preview of your public profile at <span className="font-mono text-[oklch(0.42_0.14_200)]">{profileUrl}</span>
            </div>

            {/* Mock public profile card */}
            <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden">
              {/* Cover */}
              <div className="h-24 bg-gradient-to-r from-[oklch(0.22_0.06_240)] to-[oklch(0.52_0.14_200)]" />

              {/* Avatar + name */}
              <div className="px-4 pb-4 -mt-8">
                <div className="w-16 h-16 rounded-2xl bg-[oklch(0.72_0.13_200)] border-4 border-white flex items-center justify-center text-white text-2xl font-bold font-display mb-2">
                  M
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold font-display text-foreground">Marcus Tan</h2>
                    <p className="text-xs text-muted-foreground">Certified Swim Coach · Singapore</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={12} className="text-amber-500 fill-amber-500" />
                      <span className="text-xs font-semibold">4.9</span>
                      <span className="text-xs text-muted-foreground">(47 reviews)</span>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-0 text-xs">Available</Badge>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {['Kids Beginner', 'SwimSafer', 'Stroke Correction', 'Condo Pool'].map(tag => (
                    <span key={tag} className="text-xs bg-[oklch(0.93_0.05_200)] text-[oklch(0.42_0.14_200)] px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Bio */}
                <p className="text-xs text-muted-foreground leading-relaxed mt-3">
                  SSC-certified coach with 8 years of experience. Specialise in children aged 3–12 and SwimSafer certification. Available at condo pools across East Singapore.
                </p>

                {/* Pricing */}
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="bg-[oklch(0.955_0.010_220)] rounded-xl p-2.5 text-center">
                    <div className="text-sm font-bold text-foreground">$90</div>
                    <div className="text-xs text-muted-foreground">1-to-1 / session</div>
                  </div>
                  <div className="bg-[oklch(0.955_0.010_220)] rounded-xl p-2.5 text-center">
                    <div className="text-sm font-bold text-foreground">$65</div>
                    <div className="text-xs text-muted-foreground">Group / session</div>
                  </div>
                </div>

                {/* Book CTA */}
                <Button
                  className="w-full mt-3 h-10 rounded-xl bg-[oklch(0.72_0.13_200)] hover:bg-[oklch(0.62_0.13_200)] text-white font-semibold text-sm"
                  onClick={() => navigate('/booking')}
                >
                  Book a Lesson
                </Button>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              This is how clients see your profile. Edit your details in the Coach Dashboard.
            </p>
          </>
        )}
      </div>
    </AppLayout>
  );
}
