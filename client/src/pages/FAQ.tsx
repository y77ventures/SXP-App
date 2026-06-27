// FAQ — Public frequently asked questions (visible without login)
// Design: Aqua Clarity — accordion list

import { useState } from 'react';
import { Link } from 'wouter';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/components/AppLayout';
import { cn } from '@/lib/utils';

const FAQS = [
  { q: 'How does SwimXP work?', a: 'Tell us about the swimmer\'s goals, location and availability. Our concierge team personally hand-picks the Top 3 best-fit certified coaches for your family and handles the introductions.' },
  { q: 'How much does it cost to find a coach?', a: 'Matching is completely free. You only pay your chosen coach for the lessons, starting from $75 per hour.' },
  { q: 'Where do lessons take place?', a: 'Lessons take place at your private pool — either a condominium pool or a landed property pool. Coaches travel to you.' },
  { q: 'Are the coaches vetted?', a: 'Yes. Every coach is background-checked, holds a valid coaching certification and a current lifesaving qualification. Expired credentials are automatically locked out.' },
  { q: 'What if I\'m not happy with my coach?', a: 'We offer a free rematch. Simply let our concierge team know and we\'ll recommend alternatives at no extra cost.' },
  { q: 'Can adults sign up, or just children?', a: 'Both. SwimXP serves swimmers of all ages — from toddlers to adult beginners and competitive swimmers.' },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <AppLayout>
      <div className="px-4 pt-8 pb-6 text-center">
        <h1 className="text-2xl font-extrabold font-display text-navy">Frequently Asked Questions</h1>
        <p className="text-sm text-muted-foreground mt-2">Everything you need to know about SwimXP.</p>
      </div>

      <div className="px-4 space-y-3 pb-8">
        {FAQS.map((item, i) => (
          <div key={i} className="bg-white rounded-2xl border border-border/50 overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <span className="font-semibold text-sm text-navy font-display pr-3">{item.q}</span>
              <ChevronDown size={18} className={cn('flex-shrink-0 text-muted-foreground transition-transform', open === i && 'rotate-180')} />
            </button>
            {open === i && (
              <div className="px-4 pb-4 -mt-1">
                <p className="text-[13px] text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            )}
          </div>
        ))}

        <Link href="/onboarding">
          <Button className="w-full h-12 bg-[oklch(0.76_0.14_192)] hover:bg-[oklch(0.65_0.14_192)] text-white rounded-2xl font-bold shadow-lg mt-3">
            Find My Coach <ArrowRight size={16} className="ml-1.5" />
          </Button>
        </Link>
      </div>
    </AppLayout>
  );
}
