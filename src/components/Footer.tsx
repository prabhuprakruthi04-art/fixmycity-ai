import React from 'react';
import { ShieldCheck, Heart, Sparkles, ExternalLink } from 'lucide-react';
import { NavTab } from './Navbar';

interface FooterProps {
  setActiveTab: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-[#0B3D2E] text-emerald-100/80 border-t border-emerald-900/60 pt-12 pb-24 md:pb-12 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-[#0B3D2E]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-heading font-extrabold text-xl text-white">
                FixMyCity AI
              </span>
            </div>
            <p className="text-sm text-emerald-200/70 max-w-md leading-relaxed">
              &ldquo;Existing apps let you report a problem. FixMyCity AI makes sure it gets fixed.&rdquo;
              Transforming citizen snapshots into legally binding civic complaints with automated SLA tracking,
              bureaucratic escalation, and forensic before/after fix verification.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold bg-emerald-900/50 px-3 py-1.5 rounded-lg border border-emerald-700/40 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Built for CodeRED: Orion</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider font-heading">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setActiveTab('home')}
                  className="hover:text-emerald-300 transition-colors"
                >
                  Home Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('report')}
                  className="hover:text-emerald-300 transition-colors"
                >
                  File Complaint
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('tracker')}
                  className="hover:text-emerald-300 transition-colors"
                >
                  Live Tracker
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="hover:text-emerald-300 transition-colors"
                >
                  City Transparency Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Governance & Compliance */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider font-heading">
              Civic Directives
            </h4>
            <ul className="space-y-2 text-xs text-emerald-200/60 leading-normal">
              <li>• Solid Waste Management Rules 2016</li>
              <li>• Water (Prevention & Control of Pollution) Act 1974</li>
              <li>• Air Quality & NGT Anti-Burning Guidelines</li>
              <li>• Right to Public Services Guarantee Charters</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-emerald-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-300/60 gap-4">
          <p>© {new Date().getFullYear()} FixMyCity AI. Public Civic Technology Initiative.</p>
          <div className="flex items-center gap-2">
            <span>Powered by Gemini 3.8 Multimodal Intelligence</span>
            <span>•</span>
            <span className="text-emerald-300 font-medium">CodeRED: Orion</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
