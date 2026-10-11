import React, { useState, useRef, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RefreshCw,
  Sparkles,
  Settings,
} from 'lucide-react';
import { AudioPlaybackState, playTextToSpeech, ActiveAudioSession } from '../utils/speech';
import { ElevenLabsSettingsModal } from './ElevenLabsSettingsModal';

interface AudioNarrationButtonProps {
  text: string;
  language?: 'en' | 'kn' | 'hi';
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
  showSettings?: boolean;
}

export const AudioNarrationButton: React.FC<AudioNarrationButtonProps> = ({
  text,
  language = 'en',
  label = 'Listen',
  size = 'md',
  className = '',
  showSettings = true,
}) => {
  const [playbackState, setPlaybackState] = useState<AudioPlaybackState>('idle');
  const [engine, setEngine] = useState<'elevenlabs' | 'browser'>('elevenlabs');
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const sessionRef = useRef<ActiveAudioSession | null>(null);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (sessionRef.current) {
        sessionRef.current.stop();
      }
    };
  }, []);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (playbackState === 'playing') {
      if (sessionRef.current) {
        sessionRef.current.togglePlayPause();
      }
      return;
    }

    if (playbackState === 'paused') {
      if (sessionRef.current) {
        sessionRef.current.togglePlayPause();
      }
      return;
    }

    // Stop any existing session
    if (sessionRef.current) {
      sessionRef.current.stop();
      sessionRef.current = null;
    }

    setFallbackNotice(null);

    try {
      const session = await playTextToSpeech(
        text,
        language,
        (newState, activeEngine, reason) => {
          setPlaybackState(newState);
          setEngine(activeEngine);
          if (activeEngine === 'browser') {
            setFallbackNotice('Playing via browser voice (ElevenLabs fallback)');
          } else if (newState === 'idle') {
            setFallbackNotice(null);
          }
        }
      );
      sessionRef.current = session;
    } catch (err) {
      console.warn('Playback initiation error:', err);
      setPlaybackState('idle');
    }
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessionRef.current) {
      sessionRef.current.stop();
      sessionRef.current = null;
    }
    setPlaybackState('idle');
    setFallbackNotice(null);
  };

  const isSmall = size === 'sm';

  return (
    <>
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <button
          type="button"
          onClick={handleClick}
          disabled={playbackState === 'loading'}
          className={`rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 border select-none ${
            isSmall ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2 text-xs sm:text-sm'
          } ${
            playbackState === 'playing'
              ? 'bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/70 dark:hover:bg-rose-900/70 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-800 shadow-sm'
              : playbackState === 'paused'
              ? 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/70 dark:hover:bg-amber-900/70 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-800'
              : playbackState === 'loading'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 opacity-80 cursor-wait'
              : 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-[#0B3D2E] dark:text-emerald-200 border-emerald-200 dark:border-emerald-800/80 shadow-sm hover:scale-[1.02]'
          }`}
          title={
            playbackState === 'playing'
              ? 'Click to pause narration'
              : playbackState === 'paused'
              ? 'Click to resume narration'
              : 'Listen to AI voice narration (ElevenLabs Multilingual TTS)'
          }
        >
          {playbackState === 'loading' ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400" />
              <span>Generating Voice...</span>
            </>
          ) : playbackState === 'playing' ? (
            <>
              <Pause className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span className="flex items-center gap-1.5">
                <span>Pause</span>
                {/* Animated audio bar indicator */}
                <span className="flex items-center gap-0.5 h-3">
                  <span className="w-0.5 h-2.5 bg-rose-500 animate-pulse" />
                  <span className="w-0.5 h-3.5 bg-rose-500 animate-pulse delay-75" />
                  <span className="w-0.5 h-2 bg-rose-500 animate-pulse delay-150" />
                </span>
              </span>
            </>
          ) : playbackState === 'paused' ? (
            <>
              <Play className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Resume</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{label}</span>
            </>
          )}
        </button>

        {/* Stop button when active */}
        {(playbackState === 'playing' || playbackState === 'paused') && (
          <button
            type="button"
            onClick={handleStop}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#071f16] dark:hover:bg-rose-950/40 text-slate-500 hover:text-rose-500 border border-slate-200 dark:border-emerald-900/60 transition-colors cursor-pointer"
            title="Stop narration completely"
          >
            <VolumeX className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Engine Indicator badge when active */}
        {playbackState !== 'idle' && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                engine === 'elevenlabs'
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-400/20'
                  : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-400/30'
              }`}
              title={
                engine === 'elevenlabs'
                  ? 'Streaming high-fidelity neural voice via ElevenLabs eleven_multilingual_v2'
                  : 'Playing via built-in browser speech fallback'
              }
            >
              <Sparkles className="w-2.5 h-2.5 text-current" />
              {engine === 'elevenlabs' ? 'ElevenLabs' : 'Browser Speech'}
            </span>

            {/* Small friendly fallback message */}
            {fallbackNotice && (
              <span className="text-[10px] text-amber-600 dark:text-amber-300/90 italic bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-900/50">
                Fallback active
              </span>
            )}
          </div>
        )}

        {/* Settings button to paste or update ElevenLabs key */}
        {showSettings && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsSettingsOpen(true);
            }}
            className={`rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer ${
              isSmall ? 'p-1' : 'p-1.5'
            }`}
            title="Configure ElevenLabs API Key"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <ElevenLabsSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};
