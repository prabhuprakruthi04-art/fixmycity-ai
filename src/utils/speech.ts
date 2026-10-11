/**
 * FixMyCity AI Speech & TTS Engine
 * 
 * Supports ElevenLabs Multilingual Neural Text-to-Speech API with seamless,
 * fail-safe fallback to the browser's built-in Web Speech API.
 */

export type AudioPlaybackState = 'idle' | 'loading' | 'playing' | 'paused';

export interface ActiveAudioSession {
  stop: () => void;
  togglePlayPause: () => void;
  isPlaying: boolean;
  engine: 'elevenlabs' | 'browser';
}

const SPEECH_LANG_MAP: Record<string, string> = {
  en: 'en-IN',
  kn: 'kn-IN',
  hi: 'hi-IN',
};

/**
 * Fallback to browser's built-in SpeechSynthesis
 */
function playBrowserSpeech(
  text: string,
  language: 'en' | 'kn' | 'hi' = 'en',
  onStateChange?: (state: AudioPlaybackState, engine: 'elevenlabs' | 'browser') => void
): ActiveAudioSession {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Browser speech synthesis is not supported on this platform.');
    onStateChange?.('idle', 'browser');
    return {
      stop: () => {},
      togglePlayPause: () => {},
      isPlaying: false,
      engine: 'browser',
    };
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = SPEECH_LANG_MAP[language] || 'en-IN';
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(
    (v) =>
      v.lang.toLowerCase() === utterance.lang.toLowerCase() ||
      v.lang.toLowerCase().startsWith(language)
  );
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  let isPlaying = false;

  utterance.onstart = () => {
    isPlaying = true;
    onStateChange?.('playing', 'browser');
  };

  utterance.onend = () => {
    isPlaying = false;
    onStateChange?.('idle', 'browser');
  };

  utterance.onerror = (e) => {
    console.warn('Browser speech utterance error:', e);
    isPlaying = false;
    onStateChange?.('idle', 'browser');
  };

  window.speechSynthesis.speak(utterance);

  return {
    stop: () => {
      window.speechSynthesis.cancel();
      isPlaying = false;
      onStateChange?.('idle', 'browser');
    },
    togglePlayPause: () => {
      if (isPlaying) {
        window.speechSynthesis.pause();
        isPlaying = false;
        onStateChange?.('paused', 'browser');
      } else {
        window.speechSynthesis.resume();
        isPlaying = true;
        onStateChange?.('playing', 'browser');
      }
    },
    isPlaying: true,
    engine: 'browser',
  };
}

export const ELEVENLABS_STORAGE_KEY = 'elevenlabs_api_key';
export const ELEVENLABS_VOICE_ID_KEY = 'elevenlabs_chosen_voice_id';

export function getStoredElevenLabsKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(ELEVENLABS_STORAGE_KEY)?.trim() || '';
}

export function setStoredElevenLabsKey(key: string): void {
  if (typeof window === 'undefined') return;
  if (!key.trim()) {
    localStorage.removeItem(ELEVENLABS_STORAGE_KEY);
    localStorage.removeItem(ELEVENLABS_VOICE_ID_KEY);
  } else {
    localStorage.setItem(ELEVENLABS_STORAGE_KEY, key.trim());
  }
}

export function getStoredElevenLabsVoiceId(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(ELEVENLABS_VOICE_ID_KEY)?.trim() || '';
}

export function setStoredElevenLabsVoiceId(voiceId: string): void {
  if (typeof window === 'undefined') return;
  if (!voiceId.trim()) {
    localStorage.removeItem(ELEVENLABS_VOICE_ID_KEY);
  } else {
    localStorage.setItem(ELEVENLABS_VOICE_ID_KEY, voiceId.trim());
  }
}

/**
 * Fetch available voices for user's account and pick the first available premade or default voice.
 * Caches and returns the voice ID.
 */
export async function getOrFetchAvailableVoiceId(apiKey?: string): Promise<string> {
  const rememberedVoice = getStoredElevenLabsVoiceId();
  if (rememberedVoice) {
    return rememberedVoice;
  }

  const key = apiKey !== undefined ? apiKey.trim() : getStoredElevenLabsKey();
  if (!key) return '';

  try {
    const headers: Record<string, string> = {};
    if (key) {
      headers['x-elevenlabs-key'] = key;
    }

    const res = await fetch('/api/elevenlabs-voices', { headers });
    if (!res.ok) {
      console.warn('Failed to fetch voices from ElevenLabs:', res.status);
      return '';
    }

    const data = await res.json();
    const voices = data?.voices || [];
    if (!Array.isArray(voices) || voices.length === 0) {
      return '';
    }

    // Pick first premade or first available default voice on user's account
    const chosenVoice =
      voices.find((v: { category?: string }) => v.category === 'premade') ||
      voices[0];

    const voiceId = chosenVoice?.voice_id || '';
    if (voiceId) {
      setStoredElevenLabsVoiceId(voiceId);
      console.info(`Selected account voice: ${chosenVoice?.name || voiceId} (${voiceId})`);
    }
    return voiceId;
  } catch (err) {
    console.warn('Error fetching account voices:', err);
    return '';
  }
}

/**
 * Play speech via ElevenLabs Multilingual TTS with instant browser fallback
 */
export async function playTextToSpeech(
  text: string,
  language: 'en' | 'kn' | 'hi' = 'en',
  onStateChange?: (state: AudioPlaybackState, engine: 'elevenlabs' | 'browser', fallbackReason?: string) => void,
  explicitKey?: string
): Promise<ActiveAudioSession> {
  onStateChange?.('loading', 'elevenlabs');

  try {
    const key = explicitKey !== undefined ? explicitKey.trim() : getStoredElevenLabsKey();

    // 1. Get or fetch first available voice on the user's account (never hardcode library voices)
    let voiceId = getStoredElevenLabsVoiceId();
    if (!voiceId && key) {
      try {
        voiceId = await getOrFetchAvailableVoiceId(key);
      } catch (voiceFetchErr) {
        console.warn('Voice lookup error:', voiceFetchErr);
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (key) {
      headers['x-elevenlabs-key'] = key;
    }

    const response = await fetch('/api/elevenlabs-tts', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        text,
        language,
        voiceId: voiceId || undefined,
        apiKey: key || undefined,
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => null);
      const errorMsg =
        errJson?.details ||
        errJson?.error ||
        `ElevenLabs returned HTTP ${response.status}`;
      throw new Error(errorMsg);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('audio')) {
      throw new Error('Response is not audio stream');
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    let isPlaying = false;

    audio.onplay = () => {
      isPlaying = true;
      onStateChange?.('playing', 'elevenlabs');
    };

    audio.onpause = () => {
      if (!audio.ended) {
        isPlaying = false;
        onStateChange?.('paused', 'elevenlabs');
      }
    };

    audio.onended = () => {
      isPlaying = false;
      onStateChange?.('idle', 'elevenlabs');
      URL.revokeObjectURL(audioUrl);
    };

    audio.onerror = (e) => {
      console.warn('Audio playback error, falling back to browser speech:', e);
      URL.revokeObjectURL(audioUrl);
      onStateChange?.('playing', 'browser', 'Switched to browser speech (audio playback fallback)');
      playBrowserSpeech(text, language, onStateChange);
    };

    await audio.play();

    return {
      stop: () => {
        audio.pause();
        audio.currentTime = 0;
        isPlaying = false;
        onStateChange?.('idle', 'elevenlabs');
        URL.revokeObjectURL(audioUrl);
      },
      togglePlayPause: () => {
        if (isPlaying) {
          audio.pause();
        } else {
          audio.play();
        }
      },
      isPlaying: true,
      engine: 'elevenlabs',
    };
  } catch (err: unknown) {
    const error = err as Error;
    const reasonMsg = error?.message || 'ElevenLabs service unavailable';
    console.info('ElevenLabs TTS unavailable, falling back to browser voice:', reasonMsg);
    onStateChange?.('playing', 'browser', 'Using browser speech fallback');
    return playBrowserSpeech(text, language, onStateChange);
  }
}
