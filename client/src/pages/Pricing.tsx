// Pricing — Public pricing page (visible without login)
// Design: Aqua Clarity — concierge tiers, transparent fees

import { Link } from 'wouter';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/components/AppLayout';

const TIERS = [
  {
    name: 'Concierge Match',
    price: 'Free',
    note: 'No cost to find your coach',
    highlight: false,
    features: [
      'Personalised Top 3 coach shortlist',
      'Coaches vetted & certified',
      'Lessons at your private pool',
      'Concierge introductions',
    ],
  },
  {
    name: 'Private Lessons',
    price: 'From $75',
    note: 'per hour, paid to your coach',
    highlight: true,
    features: [
      'Elite 1-to-1 coaching',
      'Flexible scheduling',
      'Condo or landed estate pools',
      'Free rematch if not satisfied',
    ],
  },
  {
    name: '4-Lesson Package',
    price: '$280+',
    note: 'best value starter block',
    highlight: false,
    features: [
      '4 structured lessons',
      'Progress tracking',
      'Priority concierge support',
      'WhatsApp coordination',
    ],
  },
];

export default function Pricing() {
  return (
    <AppLayout>
      <div className="px-4 pt-8 pb-6 text-center">
        <Badge className="bg-[oklch(0.93_0.05_200)] text-[oklch(0.52_0.14_200)] border-0 mb-3">Transparent Pricing</Badge>
        <h1 className="text-2xl font-extrabold font-display text-navy">Simple, Honest Pricing</h1>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          Matching is always free. You only pay your coach for lessons — starting at $75/hour.
        </p>
      </div>

      <div className="px-4 space-y-4 pb-8">
        {TIERS.map(tier => (
          <div
            key={tier.name}
            className={cn(
              'rounded-3xl p-6 border',
              tier.highlight
                ? 'bg-[oklch(0.2_0.04_240)] border-transparent text-white'
                : 'bg-white border-border/50'
            )}
          >
            {tier.highlight && (
              <Badge className="bg-[oklch(0.76_0.14_192)] text-white border-0 mb-3">Most Popular</Badge>
            )}
            <h2 className={cn('text-lg font-bold font-display', tier.highlight ? 'text-white' : 'text-navy')}>{tier.name}</h2>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={cn('text-3xl font-extrabold font-display', tier.highlight ? 'text-[oklch(0.85_0.12_195)]' : 'text-[oklch(0.76_0.14_192)]')}>{tier.price}</span>
            </div>
            <p className={cn('text-xs mb-4', tier.highlight ? 'text-white/70' : 'text-muted-foreground')}>{tier.note}</p>
            <ul className="space-y-2.5">
              {tier.features.map(f => (
                <li key={f} className="flex items-start gap-2">
                  <Check size={16} className={cn('flex-shrink-0 mt-0.5', tier.highlight ? 'text-[oklch(0.85_0.12_195)]' : 'text-[oklch(0.76_0.14_192)]')} />
                  <span className={cn('text-sm', tier.highlight ? 'text-white/90' : 'text-foreground')}>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <Link href="/onboarding">
          <Button className="w-full h-12 bg-[oklch(0.76_0.14_192)] hover:bg-[oklch(0.65_0.14_192)] text-white rounded-2xl font-bold shadow-lg mt-2">
            Find My Coach <ArrowRight size={16} className="ml-1.5" />
          </Button>
        </Link>
      </div>
    </AppLayout>
  );
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
