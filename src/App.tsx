/**
 * FixMyCity AI - Autonomous Civic Grievance & SLA Accountability
 * Built for CodeRED: Orion
 */

import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { ReportProvider } from './context/ReportContext';
import { Navbar, NavTab } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ReportPage } from './pages/ReportPage';
import { TrackerPage } from './pages/TrackerPage';
import { DashboardPage } from './pages/DashboardPage';
import { AboutPage } from './pages/AboutPage';

function AppContent() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedReportId, setSelectedReportId] = useState<string | undefined>(undefined);

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectReport = (reportId: string) => {
    setSelectedReportId(reportId);
    setActiveTab('tracker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#ECFDF5] dark:bg-[#071d15] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar activeTab={activeTab} setActiveTab={handleTabChange} />

      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            setActiveTab={handleTabChange}
            onSelectReport={handleSelectReport}
          />
        )}
        {activeTab === 'report' && (
          <ReportPage
            setActiveTab={handleTabChange}
            onSelectReport={handleSelectReport}
          />
        )}
        {activeTab === 'tracker' && (
          <TrackerPage
            selectedReportId={selectedReportId}
            onSelectReport={setSelectedReportId}
          />
        )}
        {activeTab === 'dashboard' && (
          <DashboardPage
            setActiveTab={handleTabChange}
            onSelectReport={handleSelectReport}
          />
        )}
        {activeTab === 'about' && (
          <AboutPage setActiveTab={handleTabChange} />
        )}
      </main>

      <Footer setActiveTab={handleTabChange} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <ReportProvider>
            <AppContent />
          </ReportProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
