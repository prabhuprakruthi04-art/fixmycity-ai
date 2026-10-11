import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  MapPin,
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Download,
  Mail,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  RefreshCw,
  Send,
  Building,
  ShieldCheck,
  Languages,
  Clock,
  Trash2,
  FileText,
  Globe,
  Leaf,
  Zap,
} from 'lucide-react';
import { NavTab } from '../components/Navbar';
import { useReports } from '../context/ReportContext';
import { useToast } from '../context/ToastContext';
import { CivicImage } from '../components/CivicImage';
import { AnalysisResult, CivicReport, Severity } from '../types';
import { generateCivicSvgImage } from '../data/sampleReports';
import { AudioNarrationButton } from '../components/AudioNarrationButton';

interface ReportPageProps {
  setActiveTab: (tab: NavTab) => void;
  onSelectReport?: (reportId: string) => void;
}

const PRESET_SAMPLE_PHOTOS = [
  {
    name: 'Illegal Garbage Dumping & Leachate',
    type: 'GARBAGE DUMP',
    color: 'trash' as const,
    defaultLocation: '12th Main Road, Indiranagar, Bengaluru',
  },
  {
    name: 'Open Burning Waste & Toxic Smoke',
    type: 'BURNING WASTE',
    color: 'smoke' as const,
    defaultLocation: '24th Main, Sector 2, HSR Layout, Bengaluru',
  },
  {
    name: 'Choked Single-Use Plastic Pollution',
    type: 'PLASTIC POLLUTION',
    color: 'trash' as const,
    defaultLocation: '27th Main Road, Sector 1, HSR Layout, Bengaluru',
  },
  {
    name: 'Polluted Lake & Chemical Foam',
    type: 'POLLUTED LAKE',
    color: 'water' as const,
    defaultLocation: 'Bellandur Lake South Spillway, Outer Ring Road, Bengaluru',
  },
  {
    name: 'Raw Sewage Inflow in Water Body',
    type: 'SEWAGE IN WATER',
    color: 'sewage' as const,
    defaultLocation: 'Kaikondrahalli Wetland Inflow Canal, Sarjapur Road, Bengaluru',
  },
  {
    name: 'Toxic Industrial Air Emissions',
    type: 'AIR POLLUTION',
    color: 'smoke' as const,
    defaultLocation: '10th Cross, Peenya Industrial Area, Bengaluru',
  },
];

export const ReportPage: React.FC<ReportPageProps> = ({ setActiveTab, onSelectReport }) => {
  const { addReport, reports, loadDemoMode } = useReports();
  const { showToast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [photoDataUrl, setPhotoDataUrl] = useState<string>('');
  const [photoMimeType, setPhotoMimeType] = useState<string>('image/jpeg');
  const [location, setLocation] = useState<string>('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState<boolean>(false);
  const [language, setLanguage] = useState<'en' | 'kn' | 'hi'>('en');

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [editableComplaint, setEditableComplaint] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Geolocation handling
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'error');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });

        try {
          // Attempt reverse geocoding via OpenStreetMap Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          if (res.ok) {
            const data = await res.json();
            const formatted =
              data.display_name?.split(',').slice(0, 3).join(', ') ||
              `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
            setLocation(formatted);
          } else {
            setLocation(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
          }
        } catch {
          setLocation(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
        } finally {
          setIsGettingLocation(false);
          showToast('Location captured via GPS', 'success');
        }
      },
      (err) => {
        setIsGettingLocation(false);
        showToast(`Could not access GPS: ${err.message}`, 'warning');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Photo handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error');
      return;
    }

    setPhotoMimeType(file.type);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setPhotoDataUrl(base64);
      setResult(null);
      setErrorMsg(null);
      showToast('Photo uploaded successfully', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset: typeof PRESET_SAMPLE_PHOTOS[0]) => {
    const svgUrl = generateCivicSvgImage(preset.name, preset.type, preset.color);
    setPhotoDataUrl(svgUrl);
    setPhotoMimeType('image/svg+xml');
    if (!location) {
      setLocation(preset.defaultLocation);
    }
    setResult(null);
    setErrorMsg(null);
    showToast(`Loaded sample: ${preset.name}`, 'info');
  };

  // AI Analysis Call
  const handleAnalyzeWithAI = async () => {
    if (!photoDataUrl) {
      showToast('Please take or upload a photo first', 'warning');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);

    const steps = [
      'Scanning image pixels for civic hazards...',
      'Assessing environmental risk & waste composition...',
      'Matching statutory jurisdiction & civic bylaws...',
      `Drafting legally framed complaint in ${language.toUpperCase()}...`,
    ];

    let stepIdx = 0;
    setAnalysisStep(steps[0]);
    const stepInterval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setAnalysisStep(steps[stepIdx]);
      }
    }, 1200);

    try {
      const response = await fetch('/api/analyze-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: photoDataUrl,
          mimeType: photoMimeType,
          location: location.trim() || 'Civic Ward Sector, Public Area',
          language,
          pastReports: reports,
        }),
      });

      clearInterval(stepInterval);

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Failed to analyze photo');
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
      setEditableComplaint(data.formalComplaint);
      showToast('AI Analysis completed!', 'success');
    } catch (err: unknown) {
      clearInterval(stepInterval);
      const error = err as Error;
      console.error(error);
      setErrorMsg(error.message || 'Error occurred while contacting Gemini API. Please try again.');
      showToast('Analysis failed. Please retry.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Copy formal complaint
  const handleCopyComplaint = () => {
    if (!editableComplaint) return;
    navigator.clipboard.writeText(editableComplaint);
    showToast('Formal complaint copied to clipboard!', 'success');
  };

  // Short summary reading: problem type, severity, authority addressed to, and deadline
  const getResultSummarySpeechText = () => {
    if (!result) return '';
    const envImpactSummary = result.environmentalImpact ? ` Environmental harm: ${result.environmentalImpact}` : '';
    if (language === 'hi') {
      return `पर्यावरणीय शिकायत सारांश: समस्या का प्रकार: ${result.problemType}। गंभीरता स्तर: ${result.severity}। उत्तरदायी प्राधिकरण: ${result.responsibleAuthority}। कार्रवाई की समय सीमा: ${result.suggestedDeadlineDays} दिन।${envImpactSummary}`;
    }
    if (language === 'kn') {
      return `ಪರಿಸರ ದೂರು ಸಾರಾಂಶ: ಸಮಸ್ಯೆಯ ಪ್ರಕಾರ: ${result.problemType}. ತೀವ್ರತೆಯ ಮಟ್ಟ: ${result.severity}. ಜವಾಬ್ದಾರಿಯುತ ಪ್ರಾಧಿಕಾರ: ${result.responsibleAuthority}. ಕ್ರಮ ಕೈಗೊಳ್ಳಲು ಗಡುವು: ${result.suggestedDeadlineDays} ದಿನಗಳು.${envImpactSummary}`;
    }
    return `Environmental hazard assessment: ${result.problemType}. Severity level: ${result.severity}. Responsible authority: ${result.responsibleAuthority}. Statutory action deadline: ${result.suggestedDeadlineDays} days.${envImpactSummary}`;
  };

  // Open in email (mailto link)
  const handleOpenEmail = () => {
    if (!result) return;
    const subject = encodeURIComponent(
      `[STATUTORY GRIEVANCE] Urgent Action Requested: ${result.problemType} at ${location || 'Civic Ward'}`
    );
    const body = encodeURIComponent(
      `${editableComplaint}\n\n---\nReported via FixMyCity AI Autonomous Public Grievance Network`
    );
    window.location.href = `mailto:grievances@municipal.gov.in?subject=${subject}&body=${body}`;
    showToast('Opened email client', 'info');
  };

  // Download printable PDF / View
  const handleDownloadPDF = () => {
    if (!result) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('Please allow popups to generate print copy', 'warning');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Civic Complaint Notice - FixMyCity AI</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; line-height: 1.6; }
            .header { border-bottom: 3px solid #0b3d2e; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; }
            .badge { background: #fee2e2; color: #991b1b; padding: 4px 10px; border-radius: 999px; font-weight: bold; font-size: 12px; }
            .box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .env-box { background: #ecfdf5; border: 2px solid #10b981; padding: 15px; border-radius: 8px; margin: 15px 0; color: #064e3b; }
            .content { white-space: pre-wrap; font-size: 14px; background: #ffffff; border: 1px solid #cbd5e1; padding: 20px; border-radius: 8px; }
            .footer { margin-top: 30px; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h2 style="color: #0b3d2e; margin: 0;">FIXMYCITY AI</h2>
              <p style="margin: 3px 0 0; font-size: 12px; color: #64748b;">Autonomous Environmental Grievance Notice</p>
            </div>
            <div class="badge">SEVERITY: ${result.severity.toUpperCase()}</div>
          </div>
          <div class="box">
            <strong>Target Authority:</strong> ${result.responsibleAuthority}<br/>
            <strong>Location:</strong> ${location || 'Unspecified'}<br/>
            <strong>Mandatory SLA:</strong> Remediation within ${result.suggestedDeadlineDays} days
          </div>
          ${
            result.environmentalImpact
              ? `<div class="env-box">
                  <strong>ENVIRONMENTAL IMPACT (Air, Water, Soil & Wildlife):</strong><br/>
                  ${result.environmentalImpact}
                </div>`
              : ''
          }
          <div class="content">${editableComplaint}</div>
          <div class="footer">
            Generated autonomously by FixMyCity AI • Citing Solid Waste Management Rules 2016, Water Act 1974 & Air Act 1981.
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  // Submit and Track
  const handleSubmitAndTrack = () => {
    if (!result) return;

    const newId = `FMC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newReport: CivicReport = {
      id: newId,
      problemType: result.problemType,
      severity: result.severity,
      description: result.description,
      likelyCause: result.likelyCause,
      healthOrEnvironmentalRisk: result.healthOrEnvironmentalRisk,
      responsibleAuthority: result.responsibleAuthority,
      formalComplaint: editableComplaint,
      suggestedDeadlineDays: result.suggestedDeadlineDays,
      keyHighlights: result.keyHighlights || [],
      environmentalImpact: result.environmentalImpact,
      isRepeatIssue: result.isRepeatIssue,
      repeatWarning: result.repeatWarning,
      location: location.trim() || 'Civic Area',
      coordinates: coords || undefined,
      photoUrl: photoDataUrl,
      dateFiled: new Date().toISOString(),
      simulatedDaysPassed: 0,
      status: 'Filed',
      timeline: [
        {
          id: `ev-${Date.now()}`,
          title: 'Grievance Registered with AI',
          timestamp: new Date().toLocaleString(),
          description: `Formal notice drafted and dispatched for ${result.responsibleAuthority}. SLA set to ${result.suggestedDeadlineDays} days.`,
          type: 'filed',
        },
      ],
      language,
    };

    addReport(newReport);
    showToast(`Report ${newId} submitted and tracked!`, 'success');
    if (onSelectReport) onSelectReport(newId);
    setActiveTab('tracker');
  };

  const getSeverityBadge = (severity: Severity) => {
    switch (severity) {
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300 border border-red-300 dark:border-red-800">
            <AlertOctagon className="w-3.5 h-3.5" /> CRITICAL SEVERITY
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <AlertTriangle className="w-3.5 h-3.5" /> HIGH SEVERITY
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
            MEDIUM SEVERITY
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            LOW SEVERITY
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/60">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Multimodal Civic Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 dark:text-white">
          Report a Problem
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
          Upload or snap a photo of any civic or environmental hazard. Gemini writes the formal petition and pinpoints the responsible agency.
        </p>
      </div>

      {/* Main Upload & Configuration Card */}
      <div className="bg-white dark:bg-[#0c2e22] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-emerald-900/60 shadow-lg space-y-6">
        {/* Photo Input Area */}
        <div className="space-y-3">
          <label className="block text-sm font-bold font-heading text-slate-900 dark:text-white">
            1. Evidence Photo <span className="text-rose-500">*</span>
          </label>

          {photoDataUrl ? (
            <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-slate-950 max-h-96 flex items-center justify-center group">
              <CivicImage
                src={photoDataUrl}
                alt="Civic hazard evidence"
                className="w-full h-auto max-h-96 object-contain"
              />
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  onClick={() => {
                    setPhotoDataUrl('');
                    setResult(null);
                  }}
                  className="p-2 rounded-xl bg-black/70 hover:bg-black/90 text-rose-300 border border-white/20 backdrop-blur-md text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Remove photo"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Remove</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Take Photo button for mobile camera */}
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-emerald-500/40 hover:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <span className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                  Take Photo with Camera
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Launch mobile device camera
                </span>
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </button>

              {/* Upload photo button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-emerald-900/60 hover:border-emerald-500 bg-slate-50 dark:bg-black/20 hover:bg-emerald-50/40 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-emerald-900/60 text-slate-700 dark:text-emerald-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                  Upload Existing Photo
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  JPEG, PNG, WebP or HEIC
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </button>
            </div>
          )}

          {/* Quick Preset Selector for instant demo testing */}
          <div className="pt-2 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Or pick an environmental scenario to test:
              </span>
              <button
                type="button"
                onClick={() => {
                  loadDemoMode();
                  showToast('Demo Mode active: Loaded 3 pre-made environmental reports with before/after photos!', 'success');
                  setActiveTab('tracker');
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 hover:brightness-110 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer hover:scale-105 active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Demo Mode (3 Verified Reports)</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_SAMPLE_PHOTOS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-slate-700 dark:text-emerald-200 border border-slate-200 dark:border-emerald-800/60 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Location & Language row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-emerald-900/40">
          {/* Location input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold font-heading text-slate-700 dark:text-slate-200">
              2. Street / Area Location (Optional)
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. 12th Main Road, Indiranagar"
                className="w-full pl-3 pr-24 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-900/60 bg-white dark:bg-[#071f16] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isGettingLocation}
                className="absolute right-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1 border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isGettingLocation ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <MapPin className="w-3.5 h-3.5" />
                )}
                <span>GPS</span>
              </button>
            </div>
          </div>

          {/* Language selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold font-heading text-slate-700 dark:text-slate-200">
              3. Official Complaint Language
            </label>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'kn' | 'hi')}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-900/60 bg-white dark:bg-[#071f16] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer font-medium"
              >
                <option value="en">English (Official Standard)</option>
                <option value="kn">ಕನ್ನಡ (Kannada - Karnataka State)</option>
                <option value="hi">हिंदी (Hindi - Central/North Standard)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Button: Analyze with AI */}
        <div className="pt-2">
          <button
            type="button"
            disabled={!photoDataUrl || isAnalyzing}
            onClick={handleAnalyzeWithAI}
            className="w-full py-4 rounded-2xl bg-[#0B3D2E] hover:bg-[#093226] text-white font-extrabold text-base flex items-center justify-center gap-3 transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
                <span>{analysisStep || 'Analyzing with Gemini...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Analyse with Gemini AI</span>
              </>
            )}
          </button>
        </div>

        {/* Error notification if any */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
            <div className="flex-1">
              <p className="font-semibold">{errorMsg}</p>
              <button
                onClick={handleAnalyzeWithAI}
                className="mt-2 text-xs font-bold underline hover:no-underline"
              >
                Retry Analysis
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ANALYSIS RESULT CARD */}
      {result && (
        <div className="bg-white dark:bg-[#0c2e22] rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/30 dark:border-emerald-600/30 shadow-xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-emerald-900/40">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {getSeverityBadge(result.severity)}
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
                  SLA: {result.suggestedDeadlineDays} Days
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
                {result.problemType}
              </h2>
            </div>

            {/* ElevenLabs Multilingual Neural TTS Listen Button */}
            <AudioNarrationButton
              text={getResultSummarySpeechText()}
              language={language}
              label="Listen to Summary"
            />
          </div>

          {/* Backboard Memory Repeat Area Warning Banner */}
          {result.isRepeatIssue && (
            <div className="p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs sm:text-sm flex items-start gap-3 animate-pulse">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-heading font-extrabold block">
                  Repeat Civic Hazard Detected (Backboard Memory)
                </span>
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  Our persistent memory records show previous unresolved reports for this area ({location}).
                  The generated complaint has been automatically escalated to cite repeat administrative non-compliance under Section 133 CrPC.
                </p>
              </div>
            </div>
          )}

          {/* Civic Assessment Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071f16] border border-slate-200/80 dark:border-emerald-900/60 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <Building className="w-3.5 h-3.5 text-emerald-600" />
                <span>Responsible Authority</span>
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {result.responsibleAuthority}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071f16] border border-slate-200/80 dark:border-emerald-900/60 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Health & Environmental Hazard</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                {result.healthOrEnvironmentalRisk}
              </p>
            </div>
          </div>

          {/* Likely Cause & Key Highlights */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-2">
            <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
              OBSERVED CAUSE: <span className="font-normal text-slate-700 dark:text-slate-300">{result.likelyCause}</span>
            </div>
            {result.keyHighlights && result.keyHighlights.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {result.keyHighlights.map((hl, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white dark:bg-[#082a1f] border border-emerald-300/40 dark:border-emerald-800 text-slate-800 dark:text-slate-200"
                  >
                    • {hl}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Dedicated Environmental Impact Section */}
          {result.environmentalImpact && (
            <div className="p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border-2 border-emerald-500/40 dark:border-emerald-600/50 space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Environmental Impact Assessment (Air • Water • Soil • Wildlife)</span>
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-emerald-100 leading-relaxed">
                {result.environmentalImpact}
              </p>
            </div>
          )}

          {/* Editable Formal Complaint */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-heading text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>Formal Statutory Petition (Editable)</span>
              </label>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Language: {language.toUpperCase()}
              </span>
            </div>

            <textarea
              value={editableComplaint}
              onChange={(e) => setEditableComplaint(e.target.value)}
              rows={8}
              className="w-full p-4 rounded-2xl border border-slate-300 dark:border-emerald-900/60 bg-slate-50/50 dark:bg-[#071f16] text-slate-900 dark:text-white font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <AudioNarrationButton
              text={editableComplaint}
              language={language}
              label="Listen to Full Petition"
              size="md"
            />

            <button
              onClick={handleCopyComplaint}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#071f16] dark:hover:bg-emerald-950/60 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-emerald-900/60 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Complaint</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#071f16] dark:hover:bg-emerald-950/60 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-emerald-900/60 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Notice (PDF)</span>
            </button>

            <button
              onClick={handleOpenEmail}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#071f16] dark:hover:bg-emerald-950/60 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-emerald-900/60 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Open in Email</span>
            </button>

            <div className="w-full sm:w-auto sm:ml-auto">
              <button
                onClick={handleSubmitAndTrack}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0B3D2E] text-sm font-extrabold shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit and Track This Report</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
