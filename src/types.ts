export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';

export type ReportStatus =
  | 'Filed'
  | 'Reminder Sent'
  | 'Escalated'
  | 'Resolved'
  | 'Not Actually Fixed';

export interface TimelineEvent {
  id: string;
  title: string;
  timestamp: string;
  description: string;
  type: 'filed' | 'reminder' | 'escalation' | 'verification' | 'status_change';
}

export interface EscalationData {
  escalatedTo: string;
  escalationReferenceId: string;
  escalationLetter: string;
  recommendedAction: string;
  dateEscalated: string;
}

export interface VerificationData {
  afterPhotoUrl: string;
  fixed: boolean;
  confidence: number;
  explanation: string;
  verdict: 'RESOLVED' | 'NOT_ACTUALLY_FIXED' | 'PARTIALLY_CLEARED';
  dateVerified: string;
}

export interface CivicReport {
  id: string;
  problemType: string;
  severity: Severity;
  description: string;
  likelyCause: string;
  healthOrEnvironmentalRisk: string;
  responsibleAuthority: string;
  formalComplaint: string;
  suggestedDeadlineDays: number;
  keyHighlights: string[];
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  userId?: string;
  photoUrl: string;
  dateFiled: string;
  simulatedDaysPassed: number;
  status: ReportStatus;
  timeline: TimelineEvent[];
  escalation?: EscalationData;
  verification?: VerificationData;
  language: 'en' | 'kn' | 'hi';
  environmentalImpact?: string;
  isRepeatIssue?: boolean;
  repeatWarning?: string | null;
  isDemo?: boolean;
  demoSceneType?: 'lake' | 'garbage' | 'burning';
}

export interface AnalysisResult {
  problemType: string;
  severity: Severity;
  description: string;
  likelyCause: string;
  healthOrEnvironmentalRisk: string;
  environmentalImpact: string;
  responsibleAuthority: string;
  formalComplaint: string;
  suggestedDeadlineDays: number;
  keyHighlights: string[];
  isRepeatIssue?: boolean;
  repeatWarning?: string | null;
}
