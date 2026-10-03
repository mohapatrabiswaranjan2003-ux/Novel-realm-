/**
 * Ultra-Smooth, Zero-Lag TTS Engine
 * Continuous, uninterrupted paragraph narration across mobile and desktop.
 * Holds persistent utterance reference to prevent Chrome/Safari garbage collection drops.
 */

import { VoiceOption, getVoicesForLanguage, SUPPORTED_LANGUAGES } from './translationService';

export interface TTSState {
  isPlaying: boolean;
  isPaused: boolean;
  currentParagraphIndex: number;
  totalParagraphs: number;
  currentLanguage: string;
  selectedVoiceId: string;
  rate: number;
  engine: 'browser' | 'supertonic' | 'google';
  autoAdvanceChapter: boolean;
  highlightParagraphs: boolean;
}

export class RobustTTSEngine {
  private paragraphs: string[] = [];
  private currentIndex: number = 0;
  private isPlaying: boolean = false;
  private isPaused: boolean = false;
  private rate: number = 1.0;
  private currentLanguage: string = 'en';
  private selectedVoiceId: string = 'en-m1';
  private availableSystemVoices: SpeechSynthesisVoice[] = [];
  private onParagraphChangeCallback?: (index: number) => void;
  private onEndCallback?: () => void;
  private onStateChangeCallback?: (state: Partial<TTSState>) => void;
  
  // CRITICAL: Persistent reference prevents JavaScript GC from killing the utterance mid-sentence
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private nextParagraphTimer: any = null;

  constructor() {
    this.initVoices();
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const load = () => {
      try {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          this.availableSystemVoices = voices;
        }
      } catch {}
    };

    load();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = load;
    }
  }

  /**
   * Set paragraphs directly in 1:1 sync with the Reader
   */
  public setParagraphs(paragraphs: string[], preservePosition: boolean = false) {
    this.paragraphs = paragraphs.filter((p) => p && p.trim().length > 0);
    if (!preservePosition) {
      this.currentIndex = 0;
    } else {
      this.currentIndex = Math.min(this.currentIndex, Math.max(0, this.paragraphs.length - 1));
    }
    this.emitState();
  }

  public setCallbacks(
    onParagraphChange: (index: number) => void,
    onEnd: () => void,
    onStateChange: (state: Partial<TTSState>) => void
  ) {
    this.onParagraphChangeCallback = onParagraphChange;
    this.onEndCallback = onEnd;
    this.onStateChangeCallback = onStateChange;
  }

  public setLanguageAndVoice(langCode: string, voiceId: string) {
    const langChanged = this.currentLanguage !== langCode;
    this.currentLanguage = langCode;
    this.selectedVoiceId = voiceId;
    this.emitState();

    if (this.isPlaying && !this.isPaused && !langChanged) {
      this.cancelAudio();
      this.speakCurrentParagraph();
    }
  }

  public setRate(newRate: number) {
    this.rate = newRate;
    this.emitState();
    if (this.isPlaying && !this.isPaused) {
      this.cancelAudio();
      this.speakCurrentParagraph();
    }
  }

  public play() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (this.paragraphs.length === 0) return;

    if (this.isPaused) {
      this.isPaused = false;
      this.isPlaying = true;
      this.emitState();
      
      // If browser paused speech natively, try resume; if it stalled, re-speak current paragraph
      try {
        window.speechSynthesis.resume();
      } catch {}

      setTimeout(() => {
        if (!window.speechSynthesis.speaking && this.isPlaying) {
          this.speakCurrentParagraph();
        }
      }, 100);
      return;
    }

    this.cancelAudio();
    this.isPlaying = true;
    this.isPaused = false;
    this.emitState();
    this.speakCurrentParagraph();
  }

  public pause() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.clearTimer();
    this.isPlaying = false;
    this.isPaused = true;
    try {
      window.speechSynthesis.pause();
    } catch {}
    this.emitState();
  }

  public resume() {
    this.play();
  }

  public stop() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.clearTimer();
    this.cancelAudio();
    this.isPlaying = false;
    this.isPaused = false;
    this.currentIndex = 0;
    this.emitState();
    if (this.onParagraphChangeCallback) {
      this.onParagraphChangeCallback(-1);
    }
  }

  public nextParagraph() {
    this.clearTimer();
    if (this.currentIndex < this.paragraphs.length - 1) {
      this.currentIndex++;
      if (this.isPlaying) {
        this.cancelAudio();
        this.speakCurrentParagraph();
      } else {
        this.emitState();
        if (this.onParagraphChangeCallback) {
          this.onParagraphChangeCallback(this.currentIndex);
        }
      }
    } else {
      this.stop();
      if (this.onEndCallback) this.onEndCallback();
    }
  }

  public prevParagraph() {
    this.clearTimer();
    if (this.currentIndex > 0) {
      this.currentIndex--;
      if (this.isPlaying) {
        this.cancelAudio();
        this.speakCurrentParagraph();
      } else {
        this.emitState();
        if (this.onParagraphChangeCallback) {
          this.onParagraphChangeCallback(this.currentIndex);
        }
      }
    }
  }

  public jumpToParagraph(index: number) {
    this.clearTimer();
    if (index >= 0 && index < this.paragraphs.length) {
      this.currentIndex = index;
      if (this.isPlaying) {
        this.cancelAudio();
        this.speakCurrentParagraph();
      } else {
        this.emitState();
        if (this.onParagraphChangeCallback) {
          this.onParagraphChangeCallback(this.currentIndex);
        }
      }
    }
  }

  private cancelAudio() {
    try {
      window.speechSynthesis.cancel();
    } catch {}
    this.currentUtterance = null;
  }

  private clearTimer() {
    if (this.nextParagraphTimer) {
      clearTimeout(this.nextParagraphTimer);
      this.nextParagraphTimer = null;
    }
  }

  private speakCurrentParagraph() {
    if (!this.isPlaying) return;
    if (this.paragraphs.length === 0) return;

    if (this.currentIndex >= this.paragraphs.length) {
      this.stop();
      if (this.onEndCallback) this.onEndCallback();
      return;
    }

    const text = this.paragraphs[this.currentIndex];
    if (!text || text.trim().length === 0) {
      this.currentIndex++;
      this.speakCurrentParagraph();
      return;
    }

    if (this.onParagraphChangeCallback) {
      this.onParagraphChangeCallback(this.currentIndex);
    }
    this.emitState();

    this.cancelAudio();

    if (this.availableSystemVoices.length === 0 && 'speechSynthesis' in window) {
      try {
        this.availableSystemVoices = window.speechSynthesis.getVoices();
      } catch {}
    }

    const utterance = new SpeechSynthesisUtterance(text);
    // Keep reference on instance to defeat garbage collection bug
    this.currentUtterance = utterance;

    this.applyVoiceSettings(utterance);

    // Continuous playback: smoothly progress to the next paragraph
    utterance.onend = () => {
      this.currentUtterance = null;
      if (!this.isPlaying || this.isPaused) return;

      if (this.currentIndex < this.paragraphs.length - 1) {
        this.currentIndex++;
        // Clean 40ms micro-pause between paragraphs for natural breathing
        this.clearTimer();
        this.nextParagraphTimer = setTimeout(() => {
          if (this.isPlaying && !this.isPaused) {
            this.speakCurrentParagraph();
          }
        }, 40);
      } else {
        this.stop();
        if (this.onEndCallback) this.onEndCallback();
      }
    };

    utterance.onerror = (e) => {
      this.currentUtterance = null;
      if (e.error === 'interrupted' || e.error === 'canceled') return;
      if (this.isPlaying && !this.isPaused) {
        this.currentIndex++;
        this.clearTimer();
        this.nextParagraphTimer = setTimeout(() => {
          if (this.isPlaying && !this.isPaused) {
            this.speakCurrentParagraph();
          }
        }, 40);
      }
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('SpeechSynthesis error:', err);
    }
  }

  private applyVoiceSettings(utterance: SpeechSynthesisUtterance) {
    const langObj =
      SUPPORTED_LANGUAGES.find((l) => l.code === this.currentLanguage) ||
      SUPPORTED_LANGUAGES[0];
    utterance.lang = langObj.speechCode || 'en-US';

    const voices = getVoicesForLanguage(this.currentLanguage);
    const selectedVoiceOption =
      voices.find((v) => v.id === this.selectedVoiceId) || voices[0];

    utterance.pitch = selectedVoiceOption?.pitch ?? 1.0;
    utterance.rate = this.rate * (selectedVoiceOption?.rate ?? 1.0);

    if (this.availableSystemVoices.length > 0) {
      const langPrefix = this.currentLanguage.split('-')[0].toLowerCase();
      const matches = this.availableSystemVoices.filter((v) =>
        v.lang.toLowerCase().replace('_', '-').startsWith(langPrefix)
      );

      if (matches.length > 0) {
        if (selectedVoiceOption?.gender === 'female') {
          const isFemale2 = selectedVoiceOption.id.endsWith('-f2');
          const femaleMatches = matches.filter(
            (v) =>
              v.name.toLowerCase().includes('female') ||
              v.name.toLowerCase().includes('woman') ||
              v.name.toLowerCase().includes('zira') ||
              v.name.toLowerCase().includes('samantha') ||
              v.name.toLowerCase().includes('kavya') ||
              v.name.toLowerCase().includes('lekha') ||
              v.name.toLowerCase().includes('victoria') ||
              v.name.toLowerCase().includes('monica')
          );
          if (femaleMatches.length > 1 && isFemale2) {
            utterance.voice = femaleMatches[1];
          } else if (femaleMatches.length > 0) {
            utterance.voice = femaleMatches[0];
          } else {
            utterance.voice = matches[isFemale2 && matches.length > 1 ? 1 : 0];
          }
        } else {
          const isM1 = selectedVoiceOption.id.endsWith('-m1');
          const isM2 = selectedVoiceOption.id.endsWith('-m2');
          const isM3 = selectedVoiceOption.id.endsWith('-m3');
          const maleMatches = matches.filter(
            (v) =>
              v.name.toLowerCase().includes('male') ||
              v.name.toLowerCase().includes('guy') ||
              v.name.toLowerCase().includes('david') ||
              v.name.toLowerCase().includes('george') ||
              v.name.toLowerCase().includes('rishi') ||
              v.name.toLowerCase().includes('ajay') ||
              v.name.toLowerCase().includes('daniel')
          );
          if (maleMatches.length >= 3) {
            utterance.voice = isM1 ? maleMatches[0] : isM2 ? maleMatches[1] : maleMatches[2];
          } else if (maleMatches.length === 2) {
            utterance.voice = isM3 ? maleMatches[1] : isM1 ? maleMatches[0] : maleMatches[1];
          } else if (maleMatches.length === 1) {
            utterance.voice = maleMatches[0];
          } else {
            const voiceIdx = isM1 ? 0 : isM2 ? (matches.length > 1 ? 1 : 0) : (matches.length > 2 ? 2 : matches.length - 1);
            utterance.voice = matches[voiceIdx];
          }
        }
      }
    }
  }

  public testVoice(langCode: string, voiceId: string, testText: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.cancelAudio();

    const utterance = new SpeechSynthesisUtterance(testText);
    const langObj =
      SUPPORTED_LANGUAGES.find((l) => l.code === langCode) ||
      SUPPORTED_LANGUAGES[0];
    utterance.lang = langObj.speechCode || 'en-US';

    const voices = getVoicesForLanguage(langCode);
    const voiceOption = voices.find((v) => v.id === voiceId) || voices[0];

    utterance.pitch = voiceOption?.pitch ?? 1.0;
    utterance.rate = this.rate * (voiceOption?.rate ?? 1.0);

    const langPrefix = langCode.split('-')[0].toLowerCase();
    const systemMatches = window.speechSynthesis
      .getVoices()
      .filter((v) => v.lang.toLowerCase().replace('_', '-').startsWith(langPrefix));

    if (systemMatches.length > 0) {
      if (voiceOption?.gender === 'female') {
        const isFemale2 = voiceOption.id.endsWith('-f2');
        const femaleMatches = systemMatches.filter(
          (v) =>
            v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('woman') ||
            v.name.toLowerCase().includes('zira') ||
            v.name.toLowerCase().includes('samantha') ||
            v.name.toLowerCase().includes('kavya') ||
            v.name.toLowerCase().includes('lekha')
        );
        if (femaleMatches.length > 1 && isFemale2) {
          utterance.voice = femaleMatches[1];
        } else if (femaleMatches.length > 0) {
          utterance.voice = femaleMatches[0];
        } else {
          utterance.voice = systemMatches[isFemale2 && systemMatches.length > 1 ? 1 : 0];
        }
      } else {
        const isM1 = voiceOption.id.endsWith('-m1');
        const isM2 = voiceOption.id.endsWith('-m2');
        const isM3 = voiceOption.id.endsWith('-m3');
        const maleMatches = systemMatches.filter(
          (v) =>
            v.name.toLowerCase().includes('male') ||
            v.name.toLowerCase().includes('guy') ||
            v.name.toLowerCase().includes('david') ||
            v.name.toLowerCase().includes('george') ||
            v.name.toLowerCase().includes('rishi') ||
            v.name.toLowerCase().includes('ajay')
        );
        if (maleMatches.length >= 3) {
          utterance.voice = isM1 ? maleMatches[0] : isM2 ? maleMatches[1] : maleMatches[2];
        } else if (maleMatches.length === 2) {
          utterance.voice = isM3 ? maleMatches[1] : maleMatches[0];
        } else if (maleMatches.length === 1) {
          utterance.voice = maleMatches[0];
        } else {
          const voiceIdx = isM1 ? 0 : isM2 ? (systemMatches.length > 1 ? 1 : 0) : (systemMatches.length > 2 ? 2 : systemMatches.length - 1);
          utterance.voice = systemMatches[voiceIdx];
        }
      }
    }

    try {
      window.speechSynthesis.speak(utterance);
    } catch {}
  }

  private emitState() {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback({
        isPlaying: this.isPlaying,
        isPaused: this.isPaused,
        currentParagraphIndex: this.currentIndex,
        totalParagraphs: this.paragraphs.length,
        currentLanguage: this.currentLanguage,
        selectedVoiceId: this.selectedVoiceId,
        rate: this.rate,
      });
    }
  }
}
