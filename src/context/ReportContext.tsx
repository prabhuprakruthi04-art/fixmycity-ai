import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { CivicReport, ReportStatus, TimelineEvent } from '../types';
import { SAMPLE_REPORTS, DEMO_MODE_REPORTS } from '../data/sampleReports';
import { useAuth } from './AuthContext';
import { db } from '../firebase/config';

interface ReportContextType {
  reports: CivicReport[];
  addReport: (report: CivicReport) => Promise<void>;
  updateReport: (id: string, updates: Partial<CivicReport>) => Promise<void>;
  deleteReport: (id: string) => void;
  simulateTimePassing: (reportId: string, daysToAdd?: number) => void;
  resetToSampleData: () => void;
  loadDemoMode: () => void;
  clearAllReports: () => void;
  stats: {
    total: number;
    resolved: number;
    resolvedPercent: number;
    avgDaysToResolve: number;
    escalatedCount: number;
    pendingCount: number;
  };
}

const STORAGE_KEY = 'fixmycity_reports_v1';

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, sendPushNotification } = useAuth();

  const [reports, setReports] = useState<CivicReport[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_REPORTS));
      return SAMPLE_REPORTS;
    } catch (e) {
      console.error('Error loading reports from localStorage:', e);
      return SAMPLE_REPORTS;
    }
  });

  // Sync user's cloud reports from Firestore when logged in
  useEffect(() => {
    if (!user) return;

    const syncCloudReports = async () => {
      try {
        const q = query(collection(db, 'reports'), where('userId', '==', user.uid));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const cloudReports: CivicReport[] = [];
          snap.forEach((d) => {
            cloudReports.push(d.data() as CivicReport);
          });

          setReports((prev) => {
            const combinedMap = new Map<string, CivicReport>();
            // Add existing
            prev.forEach((r) => combinedMap.set(r.id, r));
            // Overwrite / add cloud reports
            cloudReports.forEach((r) => combinedMap.set(r.id, r));
            const merged = Array.from(combinedMap.values());
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            return merged;
          });
        }
      } catch (err) {
        console.warn('Could not sync reports from Firestore:', err);
      }
    };

    syncCloudReports();
  }, [user]);

  // Persist locally
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch (e) {
      console.error('Failed to save reports to localStorage:', e);
    }
  }, [reports]);

  // Trigger push notification helper on status changes
  const checkAndNotifyStatusChange = useCallback(
    async (report: CivicReport, oldStatus: ReportStatus, newStatus: ReportStatus) => {
      if (oldStatus === newStatus) return;

      if (newStatus === 'Resolved') {
        await sendPushNotification(
          'Report Resolved! 🎉',
          `Your report for ${report.problemType} at ${report.location} has been resolved.`,
          report.id
        );
      } else if (newStatus === 'Escalated') {
        await sendPushNotification(
          'Report Escalated 🚨',
          `Your report for ${report.problemType} at ${report.location} has been escalated to higher municipal authorities.`,
          report.id
        );
      } else if (newStatus === 'Not Actually Fixed') {
        await sendPushNotification(
          'Fake Fix Detected ⚠️',
          `The submitted fix for ${report.problemType} at ${report.location} was verified as incomplete or fake. Re-escalation recommended.`,
          report.id
        );
      } else if (newStatus === 'Reminder Sent') {
        await sendPushNotification(
          'SLA Warning Dispatched ⏱️',
          `Statutory deadline for ${report.problemType} at ${report.location} passed without contractor resolution. Reminder sent.`,
          report.id
        );
      }
    },
    [sendPushNotification]
  );

  const addReport = async (newReport: CivicReport) => {
    const reportToSave: CivicReport = {
      ...newReport,
      userId: user?.uid || newReport.userId,
    };

    setReports((prev) => [reportToSave, ...prev]);

    // Store in Backboard persistent memory
    fetch('/api/memory/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ report: reportToSave }),
    }).catch((e) => console.warn('Backboard memory sync failed:', e));

    // If authenticated, sync to Firestore
    if (user) {
      try {
        await setDoc(doc(db, 'reports', reportToSave.id), reportToSave);
      } catch (err) {
        console.warn('Error writing report to Firestore:', err);
      }
    }
  };

  const updateReport = async (id: string, updates: Partial<CivicReport>) => {
    let targetReport: CivicReport | undefined;
    let oldStatus: ReportStatus | undefined;

    setReports((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          targetReport = r;
          oldStatus = r.status;
          return { ...r, ...updates };
        }
        return r;
      })
    );

    const mergedUpdated = targetReport ? { ...targetReport, ...updates } : undefined;

    // Update Backboard persistent memory
    if (mergedUpdated) {
      fetch('/api/memory/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report: mergedUpdated }),
      }).catch((e) => console.warn('Backboard memory update failed:', e));
    }

    if (targetReport && oldStatus && updates.status && updates.status !== oldStatus) {
      await checkAndNotifyStatusChange(
        { ...targetReport, ...updates },
        oldStatus,
        updates.status
      );
    }

    // Sync update to Firestore if report belongs to user or user is authenticated
    if (user) {
      try {
        await setDoc(doc(db, 'reports', id), { ...targetReport, ...updates }, { merge: true });
      } catch (err) {
        console.warn('Error updating report in Firestore:', err);
      }
    }
  };

  const deleteReport = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  const simulateTimePassing = (reportId: string, daysToAdd = 3) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;

        const oldStatus = r.status;
        const newDaysPassed = r.simulatedDaysPassed + daysToAdd;
        let newStatus: ReportStatus = r.status;
        const newTimeline = [...r.timeline];

        if (r.status !== 'Resolved') {
          if (newDaysPassed >= r.suggestedDeadlineDays && r.status === 'Filed') {
            newStatus = 'Reminder Sent';
            const reminderEvent: TimelineEvent = {
              id: `rem-${Date.now()}`,
              title: `Statutory SLA Warning (+${newDaysPassed} days)`,
              timestamp: new Date().toLocaleString(),
              description: `Deadline of ${r.suggestedDeadlineDays} days exceeded without contractor remediation. Auto-reminder dispatched.`,
              type: 'reminder',
            };
            newTimeline.push(reminderEvent);
          }
        }

        const simEvent: TimelineEvent = {
          id: `sim-${Date.now()}`,
          title: `Simulated Time Advanced (+${daysToAdd} days)`,
          timestamp: new Date().toLocaleString(),
          description: `Total days elapsed on this ticket is now ${newDaysPassed} days.`,
          type: 'status_change',
        };
        newTimeline.push(simEvent);

        const updated: CivicReport = {
          ...r,
          simulatedDaysPassed: newDaysPassed,
          status: newStatus,
          timeline: newTimeline,
        };

        if (newStatus !== oldStatus) {
          checkAndNotifyStatusChange(updated, oldStatus, newStatus);
        }

        return updated;
      })
    );
  };

  const resetToSampleData = () => {
    setReports(SAMPLE_REPORTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_REPORTS));
  };

  const loadDemoMode = () => {
    setReports(DEMO_MODE_REPORTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_MODE_REPORTS));
    // Index into Backboard memory
    DEMO_MODE_REPORTS.forEach((rep) => {
      fetch('/api/memory/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report: rep }),
      }).catch((e) => console.warn('Demo mode memory sync:', e));
    });
  };

  const clearAllReports = () => {
    setReports([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const stats = useMemo(() => {
    const total = reports.length;
    const resolvedReports = reports.filter((r) => r.status === 'Resolved');
    const resolved = resolvedReports.length;
    const resolvedPercent = total > 0 ? Math.round((resolved / total) * 100) : 0;

    let avgDaysToResolve = 0;
    if (resolvedReports.length > 0) {
      const sumDays = resolvedReports.reduce(
        (acc, r) => acc + (r.simulatedDaysPassed || 1),
        0
      );
      avgDaysToResolve = parseFloat((sumDays / resolvedReports.length).toFixed(1));
    } else {
      avgDaysToResolve = 3.5;
    }

    const escalatedCount = reports.filter(
      (r) => r.status === 'Escalated' || !!r.escalation
    ).length;

    const pendingCount = reports.filter(
      (r) => r.status === 'Filed' || r.status === 'Reminder Sent'
    ).length;

    return {
      total,
      resolved,
      resolvedPercent,
      avgDaysToResolve,
      escalatedCount,
      pendingCount,
    };
  }, [reports]);

  return (
    <ReportContext.Provider
      value={{
        reports,
        addReport,
        updateReport,
        deleteReport,
        simulateTimePassing,
        resetToSampleData,
        loadDemoMode,
        clearAllReports,
        stats,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
};
