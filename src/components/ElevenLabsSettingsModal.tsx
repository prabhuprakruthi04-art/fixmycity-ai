import React, { useState, useEffect } from 'react';
import {
  X,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  Volume2,
  Trash2,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import {
  getStoredElevenLabsKey,
  setStoredElevenLabsKey,
  getStoredElevenLabsVoiceId,
  getOrFetchAvailableVoiceId,
  playTextToSpeech,
  ActiveAudioSession,
} from '../utils/speech';
import { useToast } from '../context/ToastContext';

interface ElevenLabsSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ElevenLabsSettingsModal: React.FC<ElevenLabsSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { showToast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [detectedVoiceId, setDetectedVoiceId] = useState('');
  const [activeSession, setActiveSession] = useState<ActiveAudioSession | null>(null);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getStoredElevenLabsKey());
      setDetectedVoiceId(getStoredElevenLabsVoiceId());
    } else {
      if (activeSession) {
        activeSession.stop();
        setActiveSession(null);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    const trimmed = apiKey.trim();
    setStoredElevenLabsKey(trimmed);
    if (trimmed) {
      showToast('ElevenLabs API Key saved to browser storage!', 'success');
      // Proactively detect first available account voice
      getOrFetchAvailableVoiceId(trimmed).then((vId) => {
        if (vId) setDetectedVoiceId(vId);
      });
    } else {
      showToast('ElevenLabs API Key cleared.', 'info');
      setDetectedVoiceId('');
    }
    onClose();
  };

  const handleClear = () => {
    setApiKey('');
    setStoredElevenLabsKey('');
    setDetectedVoiceId('');
    showToast('ElevenLabs API key removed.', 'info');
  };

  const handleTestVoice = async (lang: 'en' | 'hi') => {
    if (activeSession) {
      activeSession.stop();
      setActiveSession(null);
    }

    setIsTesting(true);
    const testText =
      lang === 'hi'
        ? 'नमस्ते! फिक्स माय सिटी ए आई में आपका स्वागत है। इलेवन लैब्स बहुभाषी वॉयस परीक्षण सफल रहा।'
        : 'Welcome to FixMyCity AI. ElevenLabs multilingual voice generation is active and operational.';

    try {
      const session = await playTextToSpeech(
        testText,
        lang,
        (state, engine, fallbackReason) => {
          if (state === 'idle') {
            setIsTesting(false);
          }
          if (engine === 'browser' && fallbackReason) {
            showToast('Fallback active: Playing via browser voice', 'info');
          }
        },
        apiKey.trim() || undefined
      );
      setActiveSession(session);
      const activeVoice = getStoredElevenLabsVoiceId();
      if (activeVoice) setDetectedVoiceId(activeVoice);
    } catch (e) {
      console.warn('Voice test error:', e);
      setIsTesting(false);
      showToast('Switched to browser voice fallback.', 'info');
    }
  };

  const hasKey = Boolean(apiKey.trim());

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0c2e22] rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-slate-200 dark:border-emerald-900/60 shadow-2xl space-y-6 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                <KeyRound className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-extrabold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                  <span>ElevenLabs Voice Settings</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-400/30">
                    Multilingual v2
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Configure text-to-speech voice synthesis for complaints & audit findings
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-emerald-900/40 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* API Key Input Section */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
            ElevenLabs API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your xi-api-key here (e.g. sk_...)"
              className="w-full px-4 py-3 pr-11 rounded-2xl bg-slate-50 dark:bg-[#071f16] border border-slate-200 dark:border-emerald-900/60 text-slate-900 dark:text-white text-xs sm:text-sm font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              title={showKey ? 'Hide key' : 'Show key'}
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Keys are never hardcoded. Stored safely in your local browser session and passed securely via proxy.
          </p>
        </div>

        {/* Status / Features Info */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 space-y-2.5 text-xs">
          <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Multilingual Model & Automatic Fallback</span>
          </div>
          <ul className="space-y-1.5 text-slate-600 dark:text-emerald-100/80 text-[11px] leading-relaxed">
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-500 mt-0.5">•</span>
              <span>
                <strong>English & Hindi Support:</strong> Uses model <code className="font-mono bg-emerald-200/50 dark:bg-emerald-900/60 px-1 py-0.5 rounded text-[10px]">eleven_multilingual_v2</code> for authentic pronunciation and expressive inflection.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-500 mt-0.5">•</span>
              <span>
                <strong>Fail-Safe Fallback:</strong> If no API key is provided or if network/quota errors occur, the app seamlessly switches to your browser&apos;s built-in voice so your demo never breaks.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-500 mt-0.5">•</span>
              <span>
                <strong>Where it plays:</strong> Analysis summary cards, statutory escalation letters, and forensic verification audit verdicts.
              </span>
            </li>
          </ul>
        </div>

        {/* Voice Test Buttons */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Test Audio Output:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleTestVoice('en')}
              disabled={isTesting}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#071f16] dark:hover:bg-emerald-900/50 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-emerald-900/60 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isTesting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
              )}
              <span>Test English Voice</span>
            </button>
            <button
              type="button"
              onClick={() => handleTestVoice('hi')}
              disabled={isTesting}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#071f16] dark:hover:bg-emerald-900/50 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-emerald-900/60 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isTesting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-amber-500" />
              )}
              <span>Test Hindi Voice</span>
            </button>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-emerald-900/40">
          <div>
            {hasKey && (
              <button
                type="button"
                onClick={handleClear}
                className="py-2 px-3 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Key</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-900/40 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0B3D2E] text-xs font-extrabold shadow-md flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Apply</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
