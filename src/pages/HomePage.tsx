import React from 'react';
import {
  Camera,
  BarChart3,
  ArrowRight,
  ShieldAlert,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  MapPin,
  TrendingUp,
  Award,
  Zap,
  Leaf,
} from 'lucide-react';
import { CivicImage } from '../components/CivicImage';
import { NavTab } from '../components/Navbar';
import { useReports } from '../context/ReportContext';
import { useToast } from '../context/ToastContext';

interface HomePageProps {
  setActiveTab: (tab: NavTab) => void;
  onSelectReport?: (reportId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab, onSelectReport }) => {
  const { reports, stats, loadDemoMode } = useReports();
  const { showToast } = useToast();
  const recentReports = reports.slice(0, 3);

  const handleLaunchDemoMode = () => {
    loadDemoMode();
    showToast('⚡ Demo Mode active: Loaded 3 pre-made environmental reports with before/after photos!', 'success');
    setActiveTab('tracker');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Resolved
          </span>
        );
      case 'Escalated':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 border border-red-300 dark:border-red-800">
            <AlertTriangle className="w-3 h-3 text-red-600 dark:text-red-400" /> Escalated
          </span>
        );
      case 'Not Actually Fixed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <XCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" /> Fake Fix Caught
          </span>
        );
      case 'Reminder Sent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
            <Clock className="w-3 h-3 text-blue-600 dark:text-blue-400" /> SLA Warning Sent
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            <Clock className="w-3 h-3 text-slate-500" /> Filed & Tracked
          </span>
        );
    }
  };

  return (
    <div className="space-y-16 pb-12 animate-in fade-in duration-500">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B3D2E] via-[#0d4a38] to-[#10B981] text-white pt-16 pb-20 md:py-24 px-4 sm:px-6 lg:px-8 shadow-2xl rounded-b-[2.5rem]">
        {/* Decorative Cityline & Eco Leaf SVG in background */}
        <div className="absolute inset-0 pointer-events-none opacity-15 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 1200 600" fill="none" preserveAspectRatio="none">
            {/* Geometric City Skyline silhouettes */}
            <path d="M0,600 L0,380 L60,380 L60,320 L110,320 L110,420 L160,420 L160,250 L220,250 L220,360 L280,360 L280,220 L350,220 L350,450 L420,450 L420,280 L490,280 L490,380 L550,380 L550,180 L620,180 L620,410 L680,410 L680,290 L750,290 L750,390 L820,390 L820,230 L880,230 L880,440 L950,440 L950,260 L1020,260 L1020,370 L1100,370 L1100,200 L1160,200 L1160,410 L1200,410 L1200,600 Z" fill="#FFFFFF" />
            {/* Floating leaf elements */}
            <path d="M900,120 C960,100 1020,160 990,220 C930,250 870,180 900,120 Z" fill="#6EE7B7" opacity="0.3" />
            <path d="M200,80 C260,60 300,110 280,160 C230,180 180,130 200,80 Z" fill="#A7F3D0" opacity="0.25" />
          </svg>
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-400/15 border border-emerald-300/30 text-emerald-200 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-inner">
            <Sparkles className="w-4 h-4 text-emerald-300 animate-spin-slow" />
            <span>Autonomous Environmental Crisis & Pollution Grievance Accountability</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-heading text-white leading-tight sm:leading-none">
            Report it. Track it.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-200 to-amber-200">
              Get it fixed.
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-emerald-100/90 font-normal leading-relaxed">
            Existing apps let you report a problem.{' '}
            <strong className="text-white font-bold">FixMyCity AI makes sure it gets fixed.</strong>{' '}
            Snap any acute environmental violation—illegal garbage dumping, burning waste, plastic pollution, polluted lakes, raw sewage, or toxic air emissions. Gemini analyzes the photo, writes the formal statutory complaint, enforces legal deadlines, and audits contractor remediation with follow-up photos.
          </p>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => setActiveTab('report')}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-[#0B3D2E] font-extrabold text-base transition-all shadow-xl shadow-emerald-950/40 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Camera className="w-5 h-5 text-[#0B3D2E] group-hover:rotate-6 transition-transform" />
              <span>Report an Environmental Hazard</span>
              <ArrowRight className="w-4 h-4 text-[#0B3D2E] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-base transition-all border border-white/20 backdrop-blur-md hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <BarChart3 className="w-5 h-5 text-emerald-200" />
              <span>City Dashboard</span>
            </button>

            <button
              onClick={handleLaunchDemoMode}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 hover:brightness-110 font-extrabold text-base transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-5 h-5 fill-current text-slate-950" />
              <span>⚡ Demo Mode (3 Reports)</span>
            </button>
          </div>
        </div>

        {/* Floating Quick Stats Banner */}
        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              {stats.total}
            </div>
            <div className="text-xs text-emerald-200 font-medium mt-1">Reports Filed</div>
          </div>
          <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-200 font-heading">
              {stats.resolvedPercent}%
            </div>
            <div className="text-xs text-emerald-200 font-medium mt-1">Verified Resolution</div>
          </div>
          <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-heading">
              {stats.avgDaysToResolve} <span className="text-sm font-normal">days</span>
            </div>
            <div className="text-xs text-emerald-200 font-medium mt-1">Avg. Fix Time</div>
          </div>
          <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-300 font-heading">
              {stats.escalatedCount}
            </div>
            <div className="text-xs text-emerald-200 font-medium mt-1">Official Escalations</div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            Systemic Failure
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white mt-1">
            The problem with today&apos;s civic apps
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            Why citizens gave up on traditional portals like Swachhata and government web desks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white dark:bg-[#0c2e22] rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200/80 dark:border-emerald-900/60 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-5 font-bold">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-2">
              1. Tedious Manual Forms
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Citizens are forced through 15 confusing dropdowns (ward number, zone, sub-category, department codes). Most give up before even submitting.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-emerald-900/40 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FixMyCity AI: Just 1 photo. AI handles everything.</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-[#0c2e22] rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200/80 dark:border-emerald-900/60 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-400 flex items-center justify-center mb-5 font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-2">
              2. No Follow-up & Opaque Delays
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Complaints vanish into bureaucratic black holes. No deadline enforcement, zero pressure on contractors, and no consequences when ignored for months.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-emerald-900/40 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FixMyCity AI: Auto-escalates to Commissioners.</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-[#0c2e22] rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200/80 dark:border-emerald-900/60 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-400 flex items-center justify-center mb-5 font-bold">
              <XCircle className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-2">
              3. Closed Without Being Fixed
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Staff simply click &ldquo;Resolved&rdquo; to pad performance quotas while the blackwater or burning garbage is still right there on the road.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-emerald-900/40 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FixMyCity AI: AI vision compares Before vs After.</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-950/10 dark:bg-[#08281e]/90 rounded-3xl p-8 sm:p-12 border border-emerald-800/20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              Accountability Loop
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white mt-1">
              How FixMyCity AI gets results
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-2">
              From citizen snapshot to verified resolution in four automated steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-white dark:bg-[#0c3125] rounded-2xl p-6 border border-emerald-900/30 relative flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-[#0B3D2E] font-extrabold flex items-center justify-center text-sm mb-4 shadow-md">
                  01
                </div>
                <div className="flex items-center gap-2 mb-2 font-heading font-bold text-slate-900 dark:text-white text-base">
                  <Camera className="w-4 h-4 text-emerald-500" />
                  <span>Snap a Photo</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Capture garbage piles, toxic foam, burning waste, or broken pipes. Geolocation tags the exact spot automatically.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-emerald-900/30 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                ✓ Multi-format photo intake
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-[#0c3125] rounded-2xl p-6 border border-emerald-900/30 relative flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-[#0B3D2E] font-extrabold flex items-center justify-center text-sm mb-4 shadow-md">
                  02
                </div>
                <div className="flex items-center gap-2 mb-2 font-heading font-bold text-slate-900 dark:text-white text-base">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span>AI Writes Complaint</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Gemini analyzes hazards, detects responsible civic bodies, and drafts an official notice citing Solid Waste & Water Acts in English, Kannada, or Hindi.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-emerald-900/30 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                ✓ Legal citation & SLA assignment
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-[#0c3125] rounded-2xl p-6 border border-emerald-900/30 relative flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-[#0B3D2E] font-extrabold flex items-center justify-center text-sm mb-4 shadow-md">
                  03
                </div>
                <div className="flex items-center gap-2 mb-2 font-heading font-bold text-slate-900 dark:text-white text-base">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Auto-Escalation</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  If the statutory deadline lapses with no work done, the system generates Tier-II notices to the Municipal Commissioner and District Magistrate.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-emerald-900/30 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                ✓ Bureaucratic pressure guaranteed
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white dark:bg-[#0c3125] rounded-2xl p-6 border border-emerald-900/30 relative flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-[#0B3D2E] font-extrabold flex items-center justify-center text-sm mb-4 shadow-md">
                  04
                </div>
                <div className="flex items-center gap-2 mb-2 font-heading font-bold text-slate-900 dark:text-white text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>AI Verifies the Fix</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Before closing, upload an &ldquo;after&rdquo; photo. Gemini inspects ground surfaces side-by-side to ensure the waste is truly gone.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-emerald-900/30 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                ✓ Zero fake closures
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT REPORTS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              Live Civic Feed
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white mt-1">
              Recent Local Reports
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('tracker')}
            className="text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View All ({reports.length}) Reports</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentReports.map((report) => (
            <div
              key={report.id}
              onClick={() => {
                if (onSelectReport) onSelectReport(report.id);
                setActiveTab('tracker');
              }}
              className="bg-white dark:bg-[#0c2e22] rounded-2xl overflow-hidden border border-slate-200/80 dark:border-emerald-900/60 shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Photo preview */}
                <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                  <CivicImage
                    src={report.photoUrl}
                    alt={report.problemType}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    isDemo={report.isDemo}
                    demoSceneType={report.demoSceneType}
                    demoState="before"
                    demoLabel="BEFORE"
                  />
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(report.status)}
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 text-white backdrop-blur-md">
                    Day {report.simulatedDaysPassed}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="truncate">{report.location}</span>
                  </div>

                  <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {report.problemType}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {report.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 dark:border-emerald-900/40 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    {report.id}
                  </span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Inspect <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#0B3D2E] to-[#10B981] text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading">
              Notice a problem in your street today?
            </h3>
            <p className="text-emerald-100 text-sm sm:text-base max-w-xl">
              Don&apos;t wait for someone else. Snap a photo and let FixMyCity AI handle the paperwork and tracking.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('report')}
            className="shrink-0 px-8 py-4 rounded-xl bg-white text-[#0B3D2E] hover:bg-emerald-50 font-extrabold text-sm sm:text-base shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Camera className="w-5 h-5 text-emerald-600" />
            <span>Launch Camera & Report</span>
          </button>
        </div>
      </section>
    </div>
  );
};
