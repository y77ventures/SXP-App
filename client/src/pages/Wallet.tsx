// Wallet — Digital wallet with transaction history, top-up, and payout flow
// Design: Aqua Clarity — balance card, transaction list, role-based views

import { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, Plus, Send, CreditCard, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/components/AppLayout';
import { walletTransactions } from '@/lib/mockData';
import CommissionProgressTracker from '@/components/CommissionProgressTracker';
import { mockCoachCommissionDB } from '@/lib/commissionEngine';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const LOGO_IMG = '/swimxp-logo-v3.png';

type WalletTab = 'transactions' | 'topup' | 'payout';

const TOP_UP_AMOUNTS = [50, 100, 200, 500];

export default function Wallet() {
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<WalletTab>('transactions');
  const [balance] = useState(247.50);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');

  const credits = walletTransactions.filter(t => t.type === 'credit');
  const debits = walletTransactions.filter(t => t.type === 'debit');
  const totalIn = credits.reduce((sum, t) => sum + t.amount, 0);
  const totalOut = debits.reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const handleTopUp = () => {
    const amount = selectedAmount ?? parseFloat(customAmount);
    if (!amount || amount <= 0) { toast.error('Please select or enter an amount'); return; }
    toast.success(`$${amount} added to your wallet!`, { icon: '💳' });
  };

  const handlePayout = () => {
    toast.success('Payout request submitted! Funds arrive in 1–2 business days.', { icon: '🏦' });
  };

  return (
    <AppLayout hideNav>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[oklch(0.965_0.012_220)]/95 backdrop-blur-xl border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate('/profile')} className="w-8 h-8 rounded-xl bg-[oklch(0.955_0.010_220)] flex items-center justify-center">
            <ChevronLeft size={16} />
          </button>
          <h1 className="text-lg font-bold font-display text-navy">My Wallet</h1>
        </div>
        <div className="flex gap-1">
          {(['transactions', 'topup', 'payout'] as WalletTab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'flex-1 text-xs py-1.5 rounded-full font-semibold transition-all capitalize',
                tab === t ? 'bg-[oklch(0.72_0.13_200)] text-white' : 'bg-[oklch(0.955_0.010_220)] text-muted-foreground'
              )}
            >
              {t === 'topup' ? 'Top Up' : t === 'payout' ? 'Payout' : 'History'}
            </button>
          ))}
        </div>
      </div>

      {/* Balance card */}
      <div className="mx-4 mt-4 bg-[oklch(0.22_0.06_240)] rounded-3xl p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-[oklch(0.72_0.13_200)]/20 translate-y-8 -translate-x-8" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <img
              src={LOGO_IMG}
              alt="SwimXP"
              className="h-14 w-auto object-contain"
              style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.15))' }}
            />
            <span className="text-white/60 text-xs">My Balance</span>
          </div>
          <div className="text-4xl font-extrabold font-display mb-1">${balance.toFixed(2)}</div>
          <p className="text-white/50 text-xs">Available for lessons & bookings</p>
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-green-400/20 flex items-center justify-center">
                <ArrowDownLeft size={12} className="text-green-400" />
              </div>
              <div>
                <div className="text-xs text-white/60">In</div>
                <div className="text-sm font-bold text-white">${totalIn.toFixed(2)}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-red-400/20 flex items-center justify-center">
                <ArrowUpRight size={12} className="text-red-400" />
              </div>
              <div>
                <div className="text-xs text-white/60">Out</div>
                <div className="text-sm font-bold text-white">${totalOut.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 animate-fade-up">
        {/* TRANSACTIONS */}
        {tab === 'transactions' && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">{walletTransactions.length} transactions</p>
            {walletTransactions.map(tx => {
              const isCredit = tx.type === 'credit';
              const isPayout = tx.type === 'payout';
              const isPending = tx.status === 'pending';
              return (
                <div key={tx.id} className="bg-white rounded-2xl border border-border/50 p-4 flex items-center gap-3 shadow-sm">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                    isCredit ? 'bg-green-50' : isPayout ? 'bg-blue-50' : 'bg-red-50'
                  )}>
                    {isCredit ? <ArrowDownLeft size={18} className="text-green-500" /> :
                     isPayout ? <Send size={18} className="text-blue-500" /> :
                     <ArrowUpRight size={18} className="text-red-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy truncate">{tx.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{tx.date}</span>
                      <span className="text-xs text-muted-foreground">· {tx.from}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={cn(
                      'text-sm font-bold font-display',
                      isCredit ? 'text-green-600' : isPayout ? 'text-blue-600' : 'text-red-500'
                    )}>
                      {isCredit || isPayout ? '+' : ''}{tx.amount < 0 ? '' : ''}${Math.abs(tx.amount).toFixed(2)}
                    </div>
                    <div className="flex items-center gap-1 justify-end mt-0.5">
                      {isPending
                        ? <Clock size={10} className="text-amber-500" />
                        : <CheckCircle2 size={10} className="text-green-500" />
                      }
                      <span className={cn('text-[10px]', isPending ? 'text-amber-500' : 'text-green-500')}>
                        {isPending ? 'Pending' : 'Done'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TOP UP */}
        {tab === 'topup' && (
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-navy mb-3">Select Amount</p>
              <div className="grid grid-cols-2 gap-3">
                {TOP_UP_AMOUNTS.map(amount => (
                  <button
                    key={amount}
                    onClick={() => { setSelectedAmount(amount); setCustomAmount(''); }}
                    className={cn(
                      'py-4 rounded-2xl border-2 font-bold text-lg font-display transition-all',
                      selectedAmount === amount
                        ? 'border-[oklch(0.72_0.13_200)] bg-[oklch(0.93_0.05_200)] text-[oklch(0.72_0.13_200)]'
                        : 'border-border bg-white text-navy'
                    )}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-navy mb-2">Or enter custom amount</p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={customAmount}
                  onChange={e => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-[oklch(0.955_0.010_220)] border-0 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.13_200)]"
                />
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-border/50 p-4 shadow-sm">
              <h3 className="font-semibold text-sm font-display text-navy mb-3">Payment Method</h3>
              {[
                { icon: CreditCard, label: 'Visa ending in 4242', sub: 'Default card' },
                { icon: CreditCard, label: 'PayNow / PayLah!', sub: 'Singapore instant transfer' },
              ].map((method, i) => (
                <div key={i} className={cn('flex items-center gap-3 py-2.5', i < 1 && 'border-b border-border/30')}>
                  <div className="w-8 h-8 rounded-xl bg-[oklch(0.955_0.010_220)] flex items-center justify-center">
                    <method.icon size={15} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-navy">{method.label}</p>
                    <p className="text-xs text-muted-foreground">{method.sub}</p>
                  </div>
                  {i === 0 && <CheckCircle2 size={16} className="text-[oklch(0.72_0.13_200)]" />}
                </div>
              ))}
            </div>
            <Button
              onClick={handleTopUp}
              className="w-full bg-[oklch(0.72_0.13_200)] text-white rounded-2xl h-12 font-semibold"
            >
              <Plus size={16} className="mr-2" />
              Top Up ${selectedAmount !== null ? String(selectedAmount) : (customAmount || '0')}
            </Button>
            <p className="text-center text-xs text-muted-foreground">Mock demo — no real payment processed</p>
          </div>
        )}

        {/* PAYOUT */}
        {tab === 'payout' && (
          <div className="space-y-4">
            <div className="bg-[oklch(0.93_0.05_200)] rounded-2xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Available for Payout</p>
              <div className="text-3xl font-extrabold font-display text-[oklch(0.72_0.13_200)]">${balance.toFixed(2)}</div>
            </div>

            <div className="bg-white rounded-2xl border border-border/50 p-4 shadow-sm">
              <h3 className="font-semibold text-sm font-display text-navy mb-3">Payout Destination</h3>
              {[
                { label: 'DBS Bank ****5678', sub: 'Primary bank account', active: true },
                { label: 'PayNow / UEN', sub: 'Instant transfer', active: false },
              ].map((dest, i) => (
                <div key={i} className={cn('flex items-center gap-3 py-2.5', i < 1 && 'border-b border-border/30')}>
                  <div className="w-8 h-8 rounded-xl bg-[oklch(0.955_0.010_220)] flex items-center justify-center">
                    <Send size={15} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-navy">{dest.label}</p>
                    <p className="text-xs text-muted-foreground">{dest.sub}</p>
                  </div>
                  {dest.active && <CheckCircle2 size={16} className="text-[oklch(0.72_0.13_200)]" />}
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-border/50 p-4 shadow-sm">
              <h3 className="font-semibold text-sm font-display text-navy mb-3">Payout Schedule</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Processing time</span>
                  <span className="font-medium">1–2 business days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Minimum payout</span>
                  <span className="font-medium">$50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform fee</span>
                  <span className="font-medium">0% (free)</span>
                </div>
              </div>
            </div>

            {/* Commission Progress Tracker — full panel */}
            <CommissionProgressTracker record={mockCoachCommissionDB[0]} />

            <div className="bg-white rounded-2xl border border-border/50 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={16} className="text-[oklch(0.72_0.13_200)]" />
                <h3 className="font-semibold text-sm font-display text-navy">Earnings Summary</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">This month</span>
                  <span className="font-bold text-green-600">+$1,240.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last month</span>
                  <span className="font-medium">$1,050.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">YTD</span>
                  <span className="font-medium">$7,820.00</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handlePayout}
              className="w-full bg-[oklch(0.72_0.13_200)] text-white rounded-2xl h-12 font-semibold"
            >
              <Send size={16} className="mr-2" />
              Request Payout · ${balance.toFixed(2)}
            </Button>
            <p className="text-center text-xs text-muted-foreground">Mock demo — no real payout processed</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
