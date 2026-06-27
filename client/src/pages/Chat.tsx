// Chat — In-App Messaging Mockup with Compliance Enforcement UI
// Design: Aqua Clarity — static UI mockup showing where chat sits
// Compliance: Coach must confirm lesson start/end via app for first 3 lessons
// Off-platform penalty: membership freeze warning displayed prominently

import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  ChevronLeft, CheckCircle2, Clock, AlertTriangle,
  Lock, MessageCircle, Shield, Send, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import AppLayout from '@/components/AppLayout';

// ── Mock conversation data ───────────────────────────────────────────────────
interface Message {
  id: string;
  sender: 'coach' | 'parent' | 'system';
  text: string;
  time: string;
  isCompliance?: boolean;
  complianceType?: 'lesson_start' | 'lesson_end' | 'penalty_warning';
}

const MOCK_MESSAGES: Message[] = [
  {
    id: 'm1',
    sender: 'system',
    text: '🔒 This conversation is monitored for compliance. All lesson confirmations must be completed in-app. Off-platform communication for lesson scheduling is prohibited.',
    time: '9:00 AM',
    isCompliance: true,
    complianceType: 'penalty_warning',
  },
  {
    id: 'm2',
    sender: 'parent',
    text: 'Hi Sarah! Looking forward to our first lesson this Saturday at 9 AM at The Parc Condo pool.',
    time: '9:02 AM',
  },
  {
    id: 'm3',
    sender: 'coach',
    text: 'Hi! Yes, confirmed for Saturday 9 AM. I\'ll be at the pool entrance 10 minutes early. Please bring your child\'s swim gear and a towel.',
    time: '9:15 AM',
  },
  {
    id: 'm4',
    sender: 'parent',
    text: 'Perfect, thank you! My daughter Emma is a little nervous — it\'s her first time in a pool.',
    time: '9:18 AM',
  },
  {
    id: 'm5',
    sender: 'coach',
    text: 'No worries at all! I specialise in water-anxious children. We\'ll start very gently with just getting comfortable at the pool edge. She\'ll love it! 🐠',
    time: '9:20 AM',
  },
  {
    id: 'm6',
    sender: 'system',
    text: '⏰ LESSON 1 — Saturday, 28 Jun 2026 at 9:00 AM\nCoach must tap "Confirm Lesson Started" below when the lesson begins.',
    time: 'Saturday 8:58 AM',
    isCompliance: true,
    complianceType: 'lesson_start',
  },
];

// ── Compliance status for the 3 introductory lessons ────────────────────────
const LESSON_STATUS = [
  { lesson: 1, date: 'Sat 28 Jun', status: 'pending', startConfirmed: false, endConfirmed: false },
  { lesson: 2, date: 'Sat 5 Jul', status: 'upcoming', startConfirmed: false, endConfirmed: false },
  { lesson: 3, date: 'Sat 12 Jul', status: 'upcoming', startConfirmed: false, endConfirmed: false },
];

export default function Chat() {
  const [, navigate] = useLocation();
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [lessonStatus, setLessonStatus] = useState(LESSON_STATUS);
  const [showPenaltyInfo, setShowPenaltyInfo] = useState(false);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg: Message = {
      id: `m${messages.length + 1}`,
      sender: 'coach',
      text: inputText.trim(),
      time: 'Just now',
    };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
  };

  const handleConfirmStart = (lessonIndex: number) => {
    const updated = [...lessonStatus];
    updated[lessonIndex].startConfirmed = true;
    updated[lessonIndex].status = 'in_progress';
    setLessonStatus(updated);
    const systemMsg: Message = {
      id: `m${messages.length + 1}`,
      sender: 'system',
      text: `✅ Coach confirmed Lesson ${lessonIndex + 1} has started at ${new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })}. Timer running.`,
      time: 'Just now',
      isCompliance: true,
    };
    setMessages(prev => [...prev, systemMsg]);
    toast.success('Lesson start confirmed', { description: 'The platform has recorded the lesson start time.' });
  };

  const handleConfirmEnd = (lessonIndex: number) => {
    const updated = [...lessonStatus];
    updated[lessonIndex].endConfirmed = true;
    updated[lessonIndex].status = 'completed';
    setLessonStatus(updated);
    const systemMsg: Message = {
      id: `m${messages.length + 1}`,
      sender: 'system',
      text: `✅ Coach confirmed Lesson ${lessonIndex + 1} has ended. Payment of $90.00 has been released to the platform wallet. Client will be prompted to rate this session.`,
      time: 'Just now',
      isCompliance: true,
    };
    setMessages(prev => [...prev, systemMsg]);
    toast.success('Lesson completed!', { description: 'Payment released. Client has been notified to rate the session.' });
  };

  const currentLesson = lessonStatus.find(l => l.status === 'pending' || l.status === 'in_progress');
  const currentLessonIndex = currentLesson ? lessonStatus.indexOf(currentLesson) : -1;

  return (
    <AppLayout hideNav>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[oklch(0.965_0.012_220)] border-b border-border/50">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/schedule')} className="w-8 h-8 rounded-xl bg-[oklch(0.955_0.010_220)] flex items-center justify-center">
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-2 flex-1">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop"
                  alt="Sarah Chen"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
              </div>
              <div>
                <p className="text-sm font-bold font-display text-navy">Sarah Chen</p>
                <p className="text-xs text-muted-foreground">Certified Coach · Lesson 1 of 3</p>
              </div>
            </div>
            <button
              onClick={() => setShowPenaltyInfo(p => !p)}
              className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center"
            >
              <Shield size={16} className="text-amber-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Penalty info banner (collapsible) */}
      {showPenaltyInfo && (
        <div className="mx-4 mt-3 bg-amber-50 border border-amber-200 rounded-2xl p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-800 mb-1">Off-Platform Communication Policy</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                All lesson scheduling, confirmation, and payment must occur through this app. Taking communication or payments off-platform will result in:
              </p>
              <ul className="text-xs text-amber-700 mt-1 space-y-0.5 list-disc list-inside">
                <li>Immediate membership freeze</li>
                <li>Forfeiture of pending payouts</li>
                <li>Permanent account review</li>
              </ul>
              <p className="text-xs text-amber-600 font-semibold mt-1.5">
                By using this chat, you agree to the Coach Professional Agreement terms.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Compliance lesson tracker strip */}
      <div className="mx-4 mt-3 bg-white border border-border/50 rounded-2xl p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <Lock size={13} className="text-[oklch(0.72_0.13_200)]" />
          <span className="text-xs font-bold text-navy">Introductory Lesson Compliance Tracker</span>
        </div>
        <div className="flex gap-2">
          {lessonStatus.map((l, i) => (
            <div
              key={l.lesson}
              className={`flex-1 rounded-xl p-2 text-center border ${
                l.status === 'completed'
                  ? 'bg-green-50 border-green-200'
                  : l.status === 'in_progress'
                  ? 'bg-[oklch(0.93_0.05_200)] border-[oklch(0.72_0.13_200)]'
                  : 'bg-[oklch(0.965_0.012_220)] border-border/40'
              }`}
            >
              <div className="text-[10px] font-bold text-muted-foreground mb-0.5">Lesson {l.lesson}</div>
              <div className="text-[10px] text-muted-foreground">{l.date}</div>
              <div className={`text-[10px] font-semibold mt-1 ${
                l.status === 'completed' ? 'text-green-600' :
                l.status === 'in_progress' ? 'text-[oklch(0.52_0.14_200)]' :
                'text-muted-foreground'
              }`}>
                {l.status === 'completed' ? '✅ Done' : l.status === 'in_progress' ? '🔵 Active' : '⏳ Upcoming'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message thread */}
      <div className="px-4 pt-3 pb-4 space-y-3 overflow-y-auto" style={{ minHeight: 200 }}>
        {messages.map(msg => (
          <div key={msg.id}>
            {msg.sender === 'system' ? (
              <div className={`rounded-2xl p-3 text-xs leading-relaxed ${
                msg.complianceType === 'penalty_warning'
                  ? 'bg-amber-50 border border-amber-200 text-amber-800'
                  : 'bg-[oklch(0.93_0.05_200)] border border-[oklch(0.85_0.07_200)] text-[oklch(0.35_0.10_220)]'
              }`}>
                <div className="flex items-start gap-1.5">
                  {msg.complianceType === 'penalty_warning'
                    ? <AlertTriangle size={12} className="flex-shrink-0 mt-0.5 text-amber-600" />
                    : <Info size={12} className="flex-shrink-0 mt-0.5" />
                  }
                  <span className="whitespace-pre-line">{msg.text}</span>
                </div>
                <div className="text-right text-[10px] text-muted-foreground mt-1">{msg.time}</div>
              </div>
            ) : msg.sender === 'coach' ? (
              <div className="flex justify-end">
                <div className="max-w-[75%] bg-[oklch(0.72_0.13_200)] text-white rounded-2xl rounded-br-sm px-3 py-2">
                  <p className="text-xs leading-relaxed">{msg.text}</p>
                  <p className="text-[10px] text-white/60 text-right mt-1">{msg.time}</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-start">
                <div className="max-w-[75%] bg-white border border-border/50 rounded-2xl rounded-bl-sm px-3 py-2">
                  <p className="text-xs leading-relaxed text-foreground">{msg.text}</p>
                  <p className="text-[10px] text-muted-foreground text-right mt-1">{msg.time}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Compliance action buttons — shown when lesson is pending/in_progress */}
      {currentLesson && (
        <div className="mx-4 mb-3 bg-navy rounded-2xl p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <CheckCircle2 size={13} className="text-[oklch(0.85_0.10_200)]" />
            <span className="text-xs font-bold text-white">
              Lesson {currentLesson.lesson} Compliance Actions
            </span>
            <Badge className="ml-auto bg-white/20 text-white border-0 text-[10px]">Required</Badge>
          </div>
          <p className="text-[11px] text-white/70 mb-2 leading-relaxed">
            You must confirm lesson start and end via this app. Skipping this step will trigger a compliance review.
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              disabled={currentLesson.startConfirmed}
              onClick={() => handleConfirmStart(currentLessonIndex)}
              className="flex-1 text-xs h-9 bg-[oklch(0.72_0.13_200)] hover:bg-[oklch(0.65_0.14_200)] text-white border-0 disabled:opacity-50"
            >
              {currentLesson.startConfirmed ? '✅ Started' : '▶ Confirm Lesson Started'}
            </Button>
            <Button
              size="sm"
              disabled={!currentLesson.startConfirmed || currentLesson.endConfirmed}
              onClick={() => handleConfirmEnd(currentLessonIndex)}
              className="flex-1 text-xs h-9 bg-green-600 hover:bg-green-700 text-white border-0 disabled:opacity-40"
            >
              {currentLesson.endConfirmed ? '✅ Ended' : '⏹ Confirm Lesson Ended'}
            </Button>
          </div>
        </div>
      )}

      {/* Message input */}
      <div className="sticky bottom-16 px-4 pb-3 bg-[oklch(0.965_0.012_220)] border-t border-border/50 pt-2">
        <div className="flex gap-2 items-end">
          <div className="flex-1 bg-white border border-border/50 rounded-2xl px-3 py-2 min-h-[40px] flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-2xl bg-[oklch(0.72_0.13_200)] text-white flex items-center justify-center disabled:opacity-40 transition-all active:scale-95"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-1.5 flex items-center justify-center gap-1">
          <Lock size={9} /> All messages are monitored for platform compliance
        </p>
      </div>
    </AppLayout>
  );
}
