import React from 'react';
import {
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  XCircle,
  Cpu,
  Layers,
  Code2,
  Award,
  Globe2,
  FileCheck,
  Building2,
} from 'lucide-react';
import { NavTab } from '../components/Navbar';

interface AboutPageProps {
  setActiveTab: (tab: NavTab) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setActiveTab }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/60">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>CodeRED: Orion Innovation</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-slate-900 dark:text-white">
          About FixMyCity AI
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          &ldquo;Existing apps let you report a problem. FixMyCity AI makes sure it gets fixed.&rdquo;
        </p>
      </div>

      {/* MISSION CARD */}
      <div className="bg-gradient-to-br from-[#0B3D2E] to-[#10B981] text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">
          Our Environmental & Civic Mission
        </h2>
        <p className="text-emerald-100 text-sm sm:text-base leading-relaxed max-w-3xl">
          For decades, citizen grievance apps like Swachhata or municipal web portals have placed the burden of bureaucracy on ordinary residents. When faced with toxic waste fires, foaming chemical lakes, broken sewage mains, or overflowing plastics, citizens struggle through complicated forms only to see tickets closed without any real on-ground cleanup.
        </p>
        <p className="text-emerald-100 text-sm sm:text-base leading-relaxed max-w-3xl">
          FixMyCity AI refocuses civic technology directly onto acute <strong>environmental emergencies</strong>: illegal garbage dumping, toxic waste burning, single-use plastic pile-ups, dying lakes & rivers, untreated sewage outflows, and industrial air pollution. Using Google Gemini multimodal vision, it audits the environmental impact on air, water, soil and wildlife, identifies the responsible pollution board, generates legally binding statutory notices, and verifies contractor fixes with before/after photos.
        </p>
      </div>

      {/* COMPARISON MATRIX TABLE */}
      <div className="bg-white dark:bg-[#0c2e22] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-emerald-900/60 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            Radical Accountability
          </span>
          <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mt-1">
            Why FixMyCity AI is Different
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Comparing traditional grievance portals with FixMyCity AI&apos;s autonomous pipeline.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-emerald-900/60">
                <th className="py-3 px-4 font-heading font-bold text-slate-700 dark:text-slate-300">
                  Feature / Capability
                </th>
                <th className="py-3 px-4 font-heading font-bold text-slate-500 dark:text-slate-400">
                  Swachhata / Local Helplines
                </th>
                <th className="py-3 px-4 font-heading font-bold text-slate-500 dark:text-slate-400">
                  FixMyStreet (UK/Open)
                </th>
                <th className="py-3 px-4 font-heading font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-t-xl">
                  FixMyCity AI
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-emerald-900/40">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                  Intake Process
                </td>
                <td className="py-3.5 px-4 text-slate-500">
                  15 mandatory form fields, ward codes, and manual categories
                </td>
                <td className="py-3.5 px-4 text-slate-500">
                  Map pin with manual citizen description
                </td>
                <td className="py-3.5 px-4 font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/30">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Single photo: Gemini auto-detects everything</span>
                  </div>
                </td>
              </tr>

              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                  Complaint Quality
                </td>
                <td className="py-3.5 px-4 text-slate-500">
                  Vague one-liner text box often rejected as &ldquo;insufficient&rdquo;
                </td>
                <td className="py-3.5 px-4 text-slate-500">
                  Public citizen forum post
                </td>
                <td className="py-3.5 px-4 font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/30">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Formal statutory letter with legal bylaws</span>
                  </div>
                </td>
              </tr>

              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                  When Ignored / Inaction
                </td>
                <td className="py-3.5 px-4 text-rose-500">
                  <div className="flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>No recourse; tickets sit idle indefinitely</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-rose-500">
                  <div className="flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Public comments only</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/30">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Auto-escalates to Commissioners & Magistrates</span>
                  </div>
                </td>
              </tr>

              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                  Resolution Verification
                </td>
                <td className="py-3.5 px-4 text-rose-500">
                  Contractor closes ticket unilaterally with no proof
                </td>
                <td className="py-3.5 px-4 text-slate-500">
                  Manual user status toggle
                </td>
                <td className="py-3.5 px-4 font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/30">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Before vs After AI visual comparison (Catches fake fixes)</span>
                  </div>
                </td>
              </tr>

              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                  Language Accessibility
                </td>
                <td className="py-3.5 px-4 text-slate-500">
                  Static UI translations only
                </td>
                <td className="py-3.5 px-4 text-slate-500">
                  English only
                </td>
                <td className="py-3.5 px-4 font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-b-xl">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>English, Kannada, Hindi + Voice narration</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* BUILT WITH TECH STACK */}
      <div className="bg-white dark:bg-[#0c2e22] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-emerald-900/60 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            Architecture
          </span>
          <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mt-1">
            Built With Modern Civic Tech
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071f16] border border-slate-200/80 dark:border-emerald-900/60 space-y-1">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <Cpu className="w-4 h-4" />
              <span>Google Gemini 3.8 Flash</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Multimodal image understanding, hazard risk extraction, legal drafting, and before/after verification.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071f16] border border-slate-200/80 dark:border-emerald-900/60 space-y-1">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <Globe2 className="w-4 h-4" />
              <span>Web Speech API + ElevenLabs</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Voice narration in regional languages with architecture slot for ElevenLabs neural TTS.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071f16] border border-slate-200/80 dark:border-emerald-900/60 space-y-1">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <Code2 className="w-4 h-4" />
              <span>Full-Stack Express & Vite</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Secure server proxy routes with @google/genai SDK protecting API keys and client credentials.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071f16] border border-slate-200/80 dark:border-emerald-900/60 space-y-1">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <Layers className="w-4 h-4" />
              <span>Tailwind CSS v4</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tailored civic tech color system (forest green, fresh emerald, soft mint, amber, red) with dark mode.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071f16] border border-slate-200/80 dark:border-emerald-900/60 space-y-1">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <FileCheck className="w-4 h-4" />
              <span>Persistent Local Storage</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Instant offline resilience with demo time-advancement simulations and dynamic accountability stats.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071f16] border border-slate-200/80 dark:border-emerald-900/60 space-y-1">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <Award className="w-4 h-4" />
              <span>CodeRED: Orion</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Built for maximum civic impact, community transparency, and zero dead buttons.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
