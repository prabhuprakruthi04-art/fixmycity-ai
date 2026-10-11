import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  RefreshCw,
  HelpCircle,
  Database,
  ArrowRight,
} from 'lucide-react';
import { CivicReport } from '../types';
import { AudioNarrationButton } from './AudioNarrationButton';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AskFixMyCityBoxProps {
  reports: CivicReport[];
  onSelectReport?: (reportId: string) => void;
}

const SAMPLE_QUESTIONS = [
  'Which of my reports are still unresolved?',
  'How long did the last garbage complaint take?',
  'Which areas have the most complaints?',
  'How many reports have been escalated to Commissioners?',
];

export const AskFixMyCityBox: React.FC<AskFixMyCityBoxProps> = ({
  reports,
  onSelectReport,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Hello! I am **Ask FixMyCity**, connected to your **Backboard Persistent Memory**. You can ask me anything about your filed reports, resolution durations, unresolved hazards, or repeat municipal violations.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || loading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/memory/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: textToSend,
          clientReports: reports,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const assistantMsg: Message = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || 'No response generated from memory.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      console.warn('Memory Q&A error, using local memory fallback:', err);
      // Fallback local memory reasoning
      let fallbackAnswer = '';
      const lower = textToSend.toLowerCase();

      if (lower.includes('unresolved') || lower.includes('pending') || lower.includes('open')) {
        const unresolved = reports.filter((r) => r.status !== 'Resolved');
        fallbackAnswer = `Based on Backboard memory, you currently have **${unresolved.length} unresolved reports**:\n` +
          unresolved.map((r) => `• **#${r.id}** - ${r.problemType} at *${r.location}* (${r.status}, ${r.simulatedDaysPassed} days elapsed)`).join('\n');
      } else if (lower.includes('how long') || lower.includes('garbage')) {
        const resolvedGarbage = reports.filter(
          (r) => r.status === 'Resolved' && r.problemType.toLowerCase().includes('garbage')
        );
        if (resolvedGarbage.length > 0) {
          const item = resolvedGarbage[0];
          fallbackAnswer = `The last resolved garbage complaint (**#${item.id}** at *${item.location}*) took approximately **${item.simulatedDaysPassed} days** to be completely verified and cleared.`;
        } else {
          fallbackAnswer = `The last registered garbage complaint has been active for **${reports[0]?.simulatedDaysPassed || 3} days** and is currently awaiting contractor remediation.`;
        }
      } else {
        fallbackAnswer = `Backboard Persistent Memory contains **${reports.length} total reports** (${reports.filter((r) => r.status === 'Resolved').length} resolved, ${reports.filter((r) => r.status === 'Escalated').length} escalated).`;
      }

      const fallbackMsg: Message = {
        id: `fb-${Date.now()}`,
        sender: 'assistant',
        text: fallbackAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0c2e22] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-emerald-900/60 shadow-lg space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-emerald-900/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-[#0B3D2E] shadow-md">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
              Ask FixMyCity
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
              <Database className="w-2.5 h-2.5" /> Backboard Memory
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Query your cross-device persistent memory of all complaints, timelines, and municipal performance metrics.
          </p>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-[#071f16] text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 w-fit">
          {reports.length} Reports in Memory
        </span>
      </div>

      {/* Quick Suggestion Chips */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-emerald-500" />
          <span>Try asking:</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-[#071f16] dark:hover:bg-emerald-950/60 text-slate-700 dark:text-emerald-200 border border-slate-200/80 dark:border-emerald-900/60 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
            >
              <Sparkles className="w-3 h-3 text-emerald-500 shrink-0" />
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="h-72 overflow-y-auto space-y-4 p-4 rounded-2xl bg-slate-50/80 dark:bg-[#071f16] border border-slate-200/80 dark:border-emerald-900/60">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold shadow-sm ${
                  isUser
                    ? 'bg-slate-800 text-white dark:bg-emerald-600'
                    : 'bg-emerald-500 text-[#0B3D2E]'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed space-y-2 ${
                  isUser
                    ? 'bg-[#0B3D2E] text-white rounded-tr-none'
                    : 'bg-white dark:bg-[#0c2e22] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-emerald-900/60 rounded-tl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>

                {/* Listen button for assistant answers */}
                {!isUser && m.id !== 'welcome-1' && (
                  <div className="pt-1 border-t border-slate-100 dark:border-emerald-900/30 flex items-center justify-between text-[10px] text-slate-400">
                    <AudioNarrationButton
                      text={m.text.replace(/[*_#•]/g, '')}
                      size="sm"
                      label="Listen"
                    />
                    <span>{m.timestamp}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-[#0B3D2E] flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white dark:bg-[#0c2e22] rounded-2xl p-3.5 text-xs border border-slate-200 dark:border-emerald-900/60 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-500" />
              <span className="text-slate-500 dark:text-slate-400">
                Searching Backboard memory & reasoning with Gemini...
              </span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="relative flex items-center"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask a question about your reports, resolutions, or locations..."
          className="w-full pl-4 pr-12 py-3 rounded-2xl border border-slate-300 dark:border-emerald-900/60 bg-white dark:bg-[#071f16] text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || loading}
          className="absolute right-2 p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0B3D2E] disabled:opacity-40 transition-transform active:scale-95 cursor-pointer shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
