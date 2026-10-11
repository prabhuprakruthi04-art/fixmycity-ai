import React, { useState, useRef } from 'react';
import {
  Search,
  Filter,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  MapPin,
  Calendar,
  Building,
  Upload,
  Send,
  Camera,
  RefreshCw,
  FileText,
  Copy,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Flame,
  Award,
  Leaf,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useReports } from '../context/ReportContext';
import { useToast } from '../context/ToastContext';
import { CivicImage } from '../components/CivicImage';
import { CivicReport, ReportStatus, Severity, VerificationData } from '../types';
import { generateCivicSvgImage } from '../data/sampleReports';
import { AudioNarrationButton } from '../components/AudioNarrationButton';

interface TrackerPageProps {
  selectedReportId?: string;
  onSelectReport?: (id: string) => void;
}

export const TrackerPage: React.FC<TrackerPageProps> = ({
  selectedReportId,
  onSelectReport,
}) => {
  const { reports, simulateTimePassing, updateReport, loadDemoMode } = useReports();
  const { showToast } = useToast();

  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedReportId, setExpandedReportId] = useState<string | null>(
    selectedReportId || (reports[0]?.id ?? null)
  );

  // Escalation state
  const [isEscalatingId, setIsEscalatingId] = useState<string | null>(null);

  // Verification modal / panel state
  const [verifyingReport, setVerifyingReport] = useState<CivicReport | null>(null);
  const [afterPhotoUrl, setAfterPhotoUrl] = useState<string>('');
  const [afterPhotoMime, setAfterPhotoMime] = useState<string>('image/jpeg');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const verificationInputRef = useRef<HTMLInputElement>(null);

  // Filter & Search logic
  const filteredReports = reports.filter((r) => {
    const matchesFilter =
      activeFilter === 'All'
        ? true
        : activeFilter === 'Active'
        ? r.status === 'Filed' || r.status === 'Reminder Sent'
        : activeFilter === 'Escalated'
        ? r.status === 'Escalated'
        : activeFilter === 'Resolved'
        ? r.status === 'Resolved'
        : activeFilter === 'Fake Fix'
        ? r.status === 'Not Actually Fixed'
        : true;

    const matchesSearch =
      r.problemType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.responsibleAuthority.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Resolved
          </span>
        );
      case 'Escalated':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 border border-red-300 dark:border-red-800 animate-pulse">
            <Flame className="w-3.5 h-3.5 text-red-600 dark:text-red-400" /> Escalated
          </span>
        );
      case 'Not Actually Fixed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <XCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Not Actually Fixed
          </span>
        );
      case 'Reminder Sent':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
            <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Reminder Sent
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-500" /> Filed
          </span>
        );
    }
  };

  const getSeverityBadge = (severity: Severity) => {
    const colors = {
      Critical: 'bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300 border-red-300',
      High: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300',
      Medium: 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300',
      Low: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300',
    };
    return (
      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${colors[severity]}`}>
        {severity}
      </span>
    );
  };

  // Simulate time passing handler (+3 days)
  const handleSimulateDays = (report: CivicReport, e: React.MouseEvent) => {
    e.stopPropagation();
    simulateTimePassing(report.id, 3);
    const updatedDays = report.simulatedDaysPassed + 3;
    showToast(`Time simulated: +3 days added to #${report.id} (Now ${updatedDays} days elapsed)`, 'info');
  };

  // Auto-escalation action
  const handleEscalate = async (report: CivicReport, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEscalatingId(report.id);

    try {
      const response = await fetch('/api/escalate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemType: report.problemType,
          severity: report.severity,
          location: report.location,
          originalAuthority: report.responsibleAuthority,
          dateFiled: new Date(report.dateFiled).toLocaleDateString(),
          daysElapsed: report.simulatedDaysPassed,
          language: report.language || 'en',
          originalComplaint: report.formalComplaint,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate escalation notice');
      }

      const data = await response.json();

      const newTimelineEvent = {
        id: `esc-${Date.now()}`,
        title: `Official Escalation Triggered (${data.escalationReferenceId})`,
        timestamp: new Date().toLocaleString(),
        description: `Dispatched statutory escalation to ${data.escalatedTo} following ${report.simulatedDaysPassed} days of inaction.`,
        type: 'escalation' as const,
      };

      updateReport(report.id, {
        status: 'Escalated',
        escalation: {
          escalatedTo: data.escalatedTo,
          escalationReferenceId: data.escalationReferenceId,
          escalationLetter: data.escalationLetter,
          recommendedAction: data.recommendedAction,
          dateEscalated: new Date().toISOString(),
        },
        timeline: [...report.timeline, newTimelineEvent],
      });

      showToast(`Escalation notice dispatched to ${data.escalatedTo}!`, 'warning');
    } catch (err: unknown) {
      console.error(err);
      showToast('Escalation request failed. Please retry.', 'error');
    } finally {
      setIsEscalatingId(null);
    }
  };

  // Open Verify Fix modal
  const handleOpenVerify = (report: CivicReport, e: React.MouseEvent) => {
    e.stopPropagation();
    setVerifyingReport(report);
    setAfterPhotoUrl('');
  };

  // Verify Fix submit
  const handleRunVerification = async () => {
    if (!verifyingReport || !afterPhotoUrl) {
      showToast('Please provide an "after" photo to verify', 'warning');
      return;
    }

    setIsVerifying(true);

    // Check if we are in demo mode by looking at the photo URL
    const isDemo = afterPhotoUrl.startsWith('data:image/svg+xml;utf8,');

    try {
      const response = await fetch('/api/verify-fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beforeImageBase64: verifyingReport.photoUrl,
          beforeMimeType: 'image/jpeg',
          afterImageBase64: afterPhotoUrl,
          afterMimeType: afterPhotoMime,
          problemType: verifyingReport.problemType,
          description: verifyingReport.description,
          isDemo, // Pass demo flag
        }),
      });

      if (!response.ok) {
        throw new Error('Verification failed');
      }

      const data = await response.json();
      const isFixed = Boolean(data.fixed);

      const verificationData: VerificationData = {
        afterPhotoUrl,
        fixed: isFixed,
        confidence: data.confidence || 90,
        explanation: data.explanation || 'Verification comparison complete.',
        verdict: isFixed ? 'RESOLVED' : 'NOT_ACTUALLY_FIXED',
        dateVerified: new Date().toISOString(),
      };

      const newTimelineEvent = {
        id: `ver-${Date.now()}`,
        title: isFixed
          ? `AI Fix Verified (Confidence: ${verificationData.confidence}%)`
          : `AI Audit: Fix Incomplete (Confidence: ${verificationData.confidence}%)`,
        timestamp: new Date().toLocaleString(),
        description: data.explanation,
        type: 'verification' as const,
      };

      updateReport(verifyingReport.id, {
        status: isFixed ? 'Resolved' : 'Not Actually Fixed',
        verification: verificationData,
        timeline: [...verifyingReport.timeline, newTimelineEvent],
      });

      if (isFixed) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#34D399', '#059669', '#F59E0B'],
        });
        showToast('Civic problem verified as RESOLVED! Clean-up confirmed.', 'success');
      } else {
        showToast('Fake or incomplete fix detected! Marked as "Not Actually Fixed".', 'error');
      }

      setVerifyingReport(null);
      setAfterPhotoUrl('');
    } catch (err: unknown) {
      console.error(err);
      showToast('Error verifying fix photos. Please retry.', 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            Citizen Grievance Docket
          </span>
          <h1 className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
            My Civic Reports & Tracker
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Track SLA deadlines, trigger automated escalations if ignored, and audit contractor fixes.
          </p>
        </div>

        {/* Demo Tip Banner & Demo Mode Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button
            onClick={() => {
              loadDemoMode();
              showToast('⚡ Demo Mode active: Loaded 3 pre-made environmental reports with before/after photos!', 'success');
            }}
            className="px-3.5 py-2 rounded-2xl text-xs font-extrabold bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer hover:scale-105 active:scale-95 shrink-0"
          >
            <Zap className="w-4 h-4 fill-current text-slate-950" />
            <span>Load Demo Mode (3 Reports)</span>
          </button>

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2.5 max-w-md">
            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>Demo tip:</strong> Click <em>&ldquo;+3 Days&rdquo;</em> to fast-forward time and test the auto-escalation & verification features live.
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-[#0c2e22] p-4 rounded-2xl border border-slate-200/80 dark:border-emerald-900/60 shadow-sm">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['All', 'Active', 'Escalated', 'Resolved', 'Fake Fix'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeFilter === filter
                  ? 'bg-[#0B3D2E] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-[#071f16] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-emerald-900/40'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports by area, problem..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-emerald-900/60 bg-slate-50 dark:bg-[#071f16] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="bg-white dark:bg-[#0c2e22] rounded-3xl p-12 text-center border border-slate-200/80 dark:border-emerald-900/60 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
            No matching civic reports
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            You don&apos;t have any reports matching this filter. Switch filters or load the instant demo reports.
          </p>
          <button
            onClick={() => {
              loadDemoMode();
              showToast('⚡ Demo Mode active: Loaded 3 pre-made environmental reports with before/after photos!', 'success');
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0B3D2E] text-xs font-bold transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Load 3 Demo Environmental Reports</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const isExpanded = expandedReportId === report.id;
            const isOverdue =
              report.simulatedDaysPassed >= report.suggestedDeadlineDays &&
              report.status !== 'Resolved';

            return (
              <div
                key={report.id}
                className={`bg-white dark:bg-[#0c2e22] rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ${
                  isExpanded
                    ? 'border-emerald-500/50 shadow-md ring-1 ring-emerald-500/20'
                    : 'border-slate-200/80 dark:border-emerald-900/60 hover:border-emerald-400/40'
                }`}
              >
                {/* Collapsed / Summary Row */}
                <div
                  onClick={() =>
                    setExpandedReportId(isExpanded ? null : report.id)
                  }
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none group"
                >
                  {/* Left: Thumbnail & Core info */}
                  <div className="flex items-start sm:items-center gap-4">
                    <CivicImage
                      src={report.photoUrl}
                      alt={report.problemType}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-emerald-900/60 shadow-sm"
                      isDemo={report.isDemo}
                      demoSceneType={report.demoSceneType}
                      demoState="before"
                      demoLabel="BEFORE"
                    />

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                          {report.id}
                        </span>
                        {getSeverityBadge(report.severity)}
                        {getStatusBadge(report.status)}
                      </div>

                      <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {report.problemType}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span className="truncate max-w-[220px]">{report.location}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Filed: {new Date(report.dateFiled).toLocaleDateString()}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Days Elapsed Counter & Quick Actions */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 ml-20 md:ml-0">
                    {/* Days Elapsed Pill */}
                    <div
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                        isOverdue
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                          : 'bg-slate-100 text-slate-700 dark:bg-[#071f16] dark:text-slate-300 border border-slate-200 dark:border-emerald-900/60'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        {report.simulatedDaysPassed}d elapsed{' '}
                        <span className="opacity-70 font-normal">
                          (SLA: {report.suggestedDeadlineDays}d)
                        </span>
                      </span>
                    </div>

                    {/* Simulate Days Button */}
                    <button
                      onClick={(e) => handleSimulateDays(report, e)}
                      title="Advance report date by 3 days for testing"
                      className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>+3 Days</span>
                    </button>

                    {/* Expand/Collapse Chevron */}
                    <div className="p-1 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Detailed Content */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-slate-100 dark:border-emerald-900/40 space-y-6 bg-slate-50/40 dark:bg-[#082218]/50">
                    {/* Action Bar for Overdue / Unresolved Reports */}
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#0c2e22] border border-slate-200/80 dark:border-emerald-900/60">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Building className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>Assigned Authority: {report.responsibleAuthority}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {isOverdue
                            ? `⚠️ Statutory SLA exceeded by ${
                                report.simulatedDaysPassed - report.suggestedDeadlineDays
                              } days. Bureaucratic escalation is authorized.`
                            : `Within statutory deadline. ${
                                report.suggestedDeadlineDays - report.simulatedDaysPassed
                              } days remaining.`}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Auto-Escalate Button */}
                        {report.status !== 'Resolved' && (
                          <button
                            onClick={(e) => handleEscalate(report, e)}
                            disabled={isEscalatingId === report.id}
                            className="px-4 py-2 rounded-xl text-xs font-extrabold bg-red-600 hover:bg-red-700 text-white shadow-md flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                          >
                            {isEscalatingId === report.id ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Flame className="w-3.5 h-3.5" />
                            )}
                            <span>
                              {report.status === 'Escalated'
                                ? 'Re-Escalate to Higher Authority'
                                : 'Auto-Escalate Grievance'}
                            </span>
                          </button>
                        )}

                        {/* Verify Fix Button */}
                        <button
                          onClick={(e) => handleOpenVerify(report, e)}
                          className="px-4 py-2 rounded-xl text-xs font-extrabold bg-emerald-500 hover:bg-emerald-400 text-[#0B3D2E] shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verify Fix with Photo</span>
                        </button>
                      </div>
                    </div>

                    {/* Side-by-side Before/After Verification Card (if verified) */}
                    {report.verification && (
                      <div
                        className={`p-5 rounded-2xl border ${
                          report.verification.fixed
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                            : 'bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                        } space-y-4`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {report.verification.fixed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <XCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            )}
                            <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                              {report.verification.fixed
                                ? 'AI Verification Verdict: AUTHENTIC RESOLUTION CONFIRMED'
                                : 'AI Verification Verdict: FAKE FIX DETECTED (Problem Still Present)'}
                            </h4>
                          </div>
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-black/10 dark:bg-white/10">
                            Confidence: {report.verification.confidence}%
                          </span>
                        </div>

                        {/* Before vs After Photos */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                              BEFORE (Original Hazard)
                            </span>
                            <CivicImage
                              src={report.photoUrl}
                              alt="Before fix"
                              className="w-full h-40 rounded-xl object-cover border border-slate-200 dark:border-emerald-900/60"
                              isDemo={report.isDemo}
                              demoSceneType={report.demoSceneType}
                              demoState="before"
                              demoLabel="BEFORE"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                              AFTER (Verification Audit)
                            </span>
                            <CivicImage
                              src={report.verification.afterPhotoUrl}
                              alt="After fix"
                              className="w-full h-40 rounded-xl object-cover border border-slate-200 dark:border-emerald-900/60"
                              isDemo={report.isDemo}
                              demoSceneType={report.demoSceneType}
                              demoState="after"
                              demoLabel="AFTER"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white/70 dark:bg-black/30 rounded-xl">
                          <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed flex-1">
                            <strong>AI Audit Findings:</strong> {report.verification.explanation}
                          </p>
                          <div className="shrink-0">
                            <AudioNarrationButton
                              text={`Verification audit verdict: ${report.verification.fixed ? 'Resolution confirmed. Clean-up verified.' : 'Fake fix detected. The hazard is still present.'} Confidence score: ${report.verification.confidence} percent. ${report.verification.explanation}`}
                              language={report.language || 'en'}
                              label="Listen to Audit Verdict"
                              size="sm"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Escalation details card if escalated */}
                    {report.escalation && (
                      <div className="p-5 rounded-2xl bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Flame className="w-4 h-4 text-red-600" />
                            <h4 className="font-heading font-bold text-sm text-red-900 dark:text-red-200">
                              Official Escalation Notice Dispatched
                            </h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-red-700 dark:text-red-300">
                              {report.escalation.escalationReferenceId}
                            </span>
                            <AudioNarrationButton
                              text={report.escalation.escalationLetter}
                              language={report.language || 'en'}
                              label="Listen to Escalation Letter"
                              size="sm"
                            />
                          </div>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300">
                          <strong>Escalated To:</strong> {report.escalation.escalatedTo}
                        </p>
                        <div className="p-3 bg-white dark:bg-[#071f16] rounded-xl border border-red-200 dark:border-red-900/40 text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap max-h-48 overflow-y-auto">
                          {report.escalation.escalationLetter}
                        </div>
                      </div>
                    )}

                    {/* Dedicated Environmental Impact Section */}
                    {report.environmentalImpact && (
                      <div className="p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/30 dark:border-emerald-700/50 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                          <Leaf className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>Environmental Impact (Harm to Air, Water, Soil or Wildlife)</span>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-emerald-100 leading-relaxed">
                          {report.environmentalImpact}
                        </p>
                      </div>
                    )}

                    {/* Timeline View */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold font-heading uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Audit Trail Timeline
                      </h4>

                      <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-emerald-900/60">
                        {report.timeline.map((event) => {
                          const iconMap = {
                            filed: <FileText className="w-3.5 h-3.5 text-blue-500" />,
                            reminder: <Clock className="w-3.5 h-3.5 text-amber-500" />,
                            escalation: <Flame className="w-3.5 h-3.5 text-red-500" />,
                            verification: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
                            status_change: <Sparkles className="w-3.5 h-3.5 text-purple-500" />,
                          };

                          return (
                            <div key={event.id} className="relative flex items-start gap-3 pl-1">
                              <div className="w-6 h-6 rounded-full bg-white dark:bg-[#0c2e22] border-2 border-slate-300 dark:border-emerald-800 flex items-center justify-center shrink-0 z-10 shadow-sm">
                                {iconMap[event.type] || <Sparkles className="w-3 h-3 text-slate-500" />}
                              </div>
                              <div className="bg-white dark:bg-[#071f16] p-3 rounded-xl border border-slate-200/80 dark:border-emerald-900/60 text-xs space-y-1 flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-slate-900 dark:text-white">
                                    {event.title}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    {event.timestamp}
                                  </span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300">
                                  {event.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Original Complaint Letter Toggle / View */}
                    <div className="pt-2">
                      <details className="text-xs text-slate-600 dark:text-slate-300 group">
                        <summary className="font-bold text-emerald-700 dark:text-emerald-400 cursor-pointer hover:underline mb-2">
                          View Original Statutory Petition Submitted to Authority
                        </summary>
                        <div className="p-4 rounded-xl bg-white dark:bg-[#071f16] border border-slate-200 dark:border-emerald-900/60 font-mono whitespace-pre-wrap">
                          {report.formalComplaint}
                        </div>
                      </details>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* VERIFICATION MODAL */}
      {verifyingReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c2e22] rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 dark:border-emerald-900/60 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                Forensic Civic Audit
              </span>
              <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
                Verify Fix for #{verifyingReport.id}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload a newly taken photo of the same location. Gemini will inspect the ground surface to verify whether the problem was genuinely fixed.
              </p>
            </div>

            {/* Before Photo Ref */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#071f16] flex items-center gap-3">
              <CivicImage
                src={verifyingReport.photoUrl}
                alt="Original"
                className="w-14 h-14 rounded-lg object-cover"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Original Issue: {verifyingReport.problemType}
                </span>
                <span className="text-slate-500 dark:text-slate-400 truncate block max-w-xs">
                  {verifyingReport.location}
                </span>
              </div>
            </div>

            {/* After Photo Upload */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Upload New &ldquo;After&rdquo; Photo
              </label>

              {afterPhotoUrl ? (
                <div className="relative rounded-xl overflow-hidden border border-emerald-500/40 max-h-56 bg-slate-950 flex items-center justify-center">
                  <CivicImage
                    src={afterPhotoUrl}
                    alt="After fix"
                    className="w-full h-auto max-h-56 object-contain"
                  />
                  <button
                    onClick={() => setAfterPhotoUrl('')}
                    className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/70 text-rose-300 text-xs font-bold"
                  >
                    Change Photo
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => verificationInputRef.current?.click()}
                    className="w-full p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-emerald-900/60 hover:border-emerald-500 flex flex-col items-center justify-center gap-2 bg-slate-50 dark:bg-[#071f16] cursor-pointer"
                  >
                    <Upload className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Upload from Camera or Gallery
                    </span>
                    <input
                      ref={verificationInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setAfterPhotoMime(file.type);
                          const reader = new FileReader();
                          reader.onload = () => setAfterPhotoUrl(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </button>

                  {/* Demo Pre-fills for Instant Testing */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
                      Or test with sample audit photos:
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const svg = generateCivicSvgImage('Cleaned Pavement & Bin Empty', 'CLEANED & REMEDIATED', 'clean');
                          setAfterPhotoUrl(svg);
                          setAfterPhotoMime('image/svg+xml');
                        }}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 hover:bg-emerald-200 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold border border-emerald-300 dark:border-emerald-800 cursor-pointer"
                      >
                        Sample: Truly Cleaned Site
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const svg = generateCivicSvgImage('Trash Pushed Aside / Still Present', 'FAKE FIX - SLUDGE REMAINS', 'trash');
                          setAfterPhotoUrl(svg);
                          setAfterPhotoMime('image/svg+xml');
                        }}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 text-amber-900 dark:text-amber-300 text-[11px] font-bold border border-amber-300 dark:border-amber-800 cursor-pointer"
                      >
                        Sample: Incomplete / Fake Fix
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setVerifyingReport(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-900/40 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!afterPhotoUrl || isVerifying}
                onClick={handleRunVerification}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0B3D2E] text-xs font-extrabold shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Auditing with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run AI Verification Audit</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
