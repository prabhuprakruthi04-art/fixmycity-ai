import React, { useMemo } from 'react';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Flame,
  RotateCcw,
  Trash2,
  MapPin,
  Building,
  Zap,
} from 'lucide-react';
import { useReports } from '../context/ReportContext';
import { useToast } from '../context/ToastContext';
import { NavTab } from '../components/Navbar';
import { CityLeafletMap } from '../components/CityLeafletMap';
import { SAMPLE_MAP_INCIDENTS } from '../data/mapIncidents';
import { AskFixMyCityBox } from '../components/AskFixMyCityBox';

interface DashboardPageProps {
  setActiveTab: (tab: NavTab) => void;
  onSelectReport?: (reportId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  setActiveTab,
  onSelectReport,
}) => {
  const { reports, stats, resetToSampleData, clearAllReports, loadDemoMode } = useReports();
  const { showToast } = useToast();

  // Group by Environmental Problem Types
  const problemTypeStats = useMemo(() => {
    const counts: Record<string, number> = {};
    reports.forEach((r) => {
      let cat = 'Other Environmental Hazard';
      const text = (r.problemType + ' ' + (r.description || '')).toLowerCase();
      if (text.includes('garbage') || text.includes('dump') || text.includes('leachate') || text.includes('solid waste')) {
        cat = 'Illegal Garbage Dumping';
      } else if (text.includes('burn') || (text.includes('smoke') && !text.includes('industrial'))) {
        cat = 'Burning Waste';
      } else if (text.includes('plastic') || text.includes('pet bottle') || text.includes('culvert')) {
        cat = 'Plastic Pollution';
      } else if (text.includes('lake') || text.includes('river') || text.includes('foam') || text.includes('effluent')) {
        cat = 'Polluted Lakes & Rivers';
      } else if (text.includes('sewage') || text.includes('blackwater') || text.includes('wetland')) {
        cat = 'Sewage in Water Bodies';
      } else if (text.includes('air') || text.includes('emission') || text.includes('soot') || text.includes('industrial')) {
        cat = 'Toxic Air Pollution';
      }
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const total = reports.length || 1;
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percent: Math.round((count / total) * 100),
    })).sort((a, b) => b.count - a.count);
  }, [reports]);

  // Group by Authorities for Accountability Leaderboard
  const authorityLeaderboard = useMemo(() => {
    const groups: Record<
      string,
      { total: number; resolved: number; escalated: number }
    > = {};

    reports.forEach((r) => {
      const auth = r.responsibleAuthority || 'General Municipal Cell';
      if (!groups[auth]) {
        groups[auth] = { total: 0, resolved: 0, escalated: 0 };
      }
      groups[auth].total += 1;
      if (r.status === 'Resolved') groups[auth].resolved += 1;
      if (r.status === 'Escalated' || !!r.escalation) groups[auth].escalated += 1;
    });

    return Object.entries(groups)
      .map(([authority, data]) => {
        const rate = Math.round((data.resolved / data.total) * 100);
        return {
          authority,
          total: data.total,
          resolved: data.resolved,
          escalated: data.escalated,
          rate,
        };
      })
      .sort((a, b) => b.rate - a.rate);
  }, [reports]);

  const handleResetData = () => {
    resetToSampleData();
    showToast('Reset to 8 realistic sample reports', 'info');
  };

  const handleClearData = () => {
    clearAllReports();
    showToast('Cleared all report data', 'warning');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in duration-300">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            Open Civic Governance Data
          </span>
          <h1 className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
            City Accountability Dashboard
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Real-time public grievance resolution rates, contractor performance tracking, and GIS distribution.
          </p>
        </div>

        {/* Data Reset / Clear Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              loadDemoMode();
              showToast('⚡ Demo Mode active: Loaded 3 pre-made environmental reports with before/after photos!', 'success');
            }}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 hover:brightness-110 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-current text-slate-950" />
            <span>⚡ Demo Mode (3 Reports)</span>
          </button>

          <button
            onClick={handleResetData}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#0c2e22] hover:bg-slate-100 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-emerald-200 text-xs font-bold border border-slate-200 dark:border-emerald-800/60 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
            <span>Restore Demo Data</span>
          </button>

          <button
            onClick={handleClearData}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#0c2e22] hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-900/60 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Data</span>
          </button>
        </div>
      </div>

      {/* SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Reports */}
        <div className="bg-white dark:bg-[#0c2e22] rounded-2xl p-5 border border-slate-200/80 dark:border-emerald-900/60 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Reports
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
            {stats.total}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Registered on this network
          </p>
        </div>

        {/* Resolved Percentage */}
        <div className="bg-white dark:bg-[#0c2e22] rounded-2xl p-5 border border-slate-200/80 dark:border-emerald-900/60 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Fix Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-heading text-emerald-600 dark:text-emerald-400">
            {stats.resolvedPercent}%
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {stats.resolved} of {stats.total} verified fixed
          </p>
        </div>

        {/* Avg Resolution Days */}
        <div className="bg-white dark:bg-[#0c2e22] rounded-2xl p-5 border border-slate-200/80 dark:border-emerald-900/60 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Avg. Fix Time
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
            {stats.avgDaysToResolve} <span className="text-sm font-normal text-slate-500">days</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            From complaint to photo audit
          </p>
        </div>

        {/* Escalations */}
        <div className="bg-white dark:bg-[#0c2e22] rounded-2xl p-5 border border-slate-200/80 dark:border-emerald-900/60 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Escalations
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 flex items-center justify-center font-bold">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-heading text-red-600 dark:text-red-400">
            {stats.escalatedCount}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tier-II Commissioner notices
          </p>
        </div>
      </div>

      {/* ASK FIXMYCITY - BACKBOARD PERSISTENT MEMORY COPILOT */}
      <AskFixMyCityBox
        reports={reports}
        onSelectReport={onSelectReport}
      />

      {/* LEAFLET.JS INTERACTIVE CITY MAP SECTION */}
      <div className="bg-white dark:bg-[#0c2e22] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-emerald-900/60 shadow-sm space-y-4">
        <div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            Geographic Information System (GIS)
          </span>
          <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mt-1">
            Live Metropolitan Incident Map (Leaflet.js)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Interactive pins for all reports with precise or approximate civic coordinates. Click any pin to view problem type, resolution status, and inspector details.
          </p>
        </div>

        <CityLeafletMap
          reports={reports}
          additionalReports={SAMPLE_MAP_INCIDENTS}
          onSelectReport={(reportId) => {
            if (onSelectReport) onSelectReport(reportId);
            setActiveTab('tracker');
          }}
        />
      </div>

      {/* TWO COLUMN SECTION: PROBLEM TYPES CHART & AREA ACCOUNTABILITY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* PROBLEM TYPES BAR & DISTRIBUTION CHART */}
        <div className="bg-white dark:bg-[#0c2e22] rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-emerald-900/60 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Categorical Breakdown
            </span>
            <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
              Civic Hazards by Category
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Distribution of complaints filed across environmental domains.
            </p>
          </div>

          {problemTypeStats.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No data available.</p>
          ) : (
            <div className="space-y-4">
              {problemTypeStats.map((item, idx) => {
                const barColors = [
                  'bg-emerald-500',
                  'bg-teal-500',
                  'bg-sky-500',
                  'bg-amber-500',
                  'bg-rose-500',
                  'bg-indigo-500',
                  'bg-purple-500',
                ];
                const color = barColors[idx % barColors.length];

                return (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                      <span>{item.name}</span>
                      <span className="font-mono text-slate-500 dark:text-slate-400">
                        {item.count} reports ({item.percent}%)
                      </span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full h-3 bg-slate-100 dark:bg-[#071f16] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.max(item.percent, 8)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* AREA / AUTHORITY ACCOUNTABILITY LEADERBOARD */}
        <div className="bg-white dark:bg-[#0c2e22] rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-emerald-900/60 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Transparency Rankings
            </span>
            <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
              Authority Accountability Leaderboard
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Resolution rates by municipal authority: Green (&gt;70%), Amber (40-70%), Red (&lt;40%).
            </p>
          </div>

          <div className="space-y-3">
            {authorityLeaderboard.map((item) => {
              let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
              let dotColor = 'bg-emerald-500';

              if (item.rate < 40) {
                badgeColor = 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800';
                dotColor = 'bg-red-500';
              } else if (item.rate <= 70) {
                badgeColor = 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
                dotColor = 'bg-amber-500';
              }

              return (
                <div
                  key={item.authority}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#071f16] border border-slate-200/80 dark:border-emerald-900/60 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${dotColor} shrink-0`} />
                      <span className="font-bold text-slate-900 dark:text-white truncate">
                        {item.authority}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.total} grievances • {item.escalated} escalated
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full font-bold border ${badgeColor}`}
                    >
                      {item.rate}% Fixed
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
