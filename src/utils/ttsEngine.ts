/**
 * High-reliability Mobile & Desktop TTS Engine (WTR-Lab Style)
 * Splits text into paragraphs in lockstep with the reader DOM,
 * circumvents mobile browser speech pauses, supports live speed switching,
 * voice switching, and smooth paragraph jumping on click.
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
  private keepAliveInterval: any = null;

  constructor() {
    this.initVoices();
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const load = () => {
      this.availableSystemVoices = window.speechSynthesis.getVoices();
    };

    load();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = load;
    }
  }

  /**
   * Set paragraphs directly in 1:1 lockstep with the Reader DOM paragraphs
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

  public setContent(htmlContent: string) {
    if (typeof window === 'undefined') return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const pElements = Array.from(doc.querySelectorAll('p'));

    if (pElements.length > 0) {
      this.paragraphs = pElements
        .map((p) => (p.textContent || '').trim())
        .filter((text) => text.length > 0);
    } else {
      const rawText = doc.body.textContent || '';
      this.paragraphs = rawText
        .split(/\n+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
    }

    this.currentIndex = 0;
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

    // If currently speaking, immediately switch to the new voice seamlessly
    if (this.isPlaying && !this.isPaused && !langChanged) {
      window.speechSynthesis.cancel();
      this.speakCurrentParagraph();
    }
  }

  public setRate(newRate: number) {
    this.rate = newRate;
    this.emitState();
    // Seamlessly re-apply rate to currently speaking utterance
    if (this.isPlaying && !this.isPaused) {
      window.speechSynthesis.cancel();
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
      this.startKeepAlive();
      window.speechSynthesis.resume();

      // Guard against Chrome browser resume failure
      setTimeout(() => {
        if (!window.speechSynthesis.speaking && this.isPlaying) {
          this.speakCurrentParagraph();
        }
      }, 150);
      return;
    }

    window.speechSynthesis.cancel();
    this.isPlaying = true;
    this.isPaused = false;
    this.emitState();
    this.startKeepAlive();
    this.speakCurrentParagraph();
  }

  public pause() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.isPlaying = false;
    this.isPaused = true;
    this.stopKeepAlive();
    window.speechSynthesis.pause();
    this.emitState();
  }

  public resume() {
    this.play();
  }

  public stop() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.stopKeepAlive();
    window.speechSynthesis.cancel();
    this.isPlaying = false;
    this.isPaused = false;
    this.currentIndex = 0;
    this.emitState();
    if (this.onParagraphChangeCallback) {
      this.onParagraphChangeCallback(-1);
    }
  }

  public nextParagraph() {
    if (this.currentIndex < this.paragraphs.length - 1) {
      this.currentIndex++;
      if (this.isPlaying) {
        window.speechSynthesis.cancel();
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
    if (this.currentIndex > 0) {
      this.currentIndex--;
      if (this.isPlaying) {
        window.speechSynthesis.cancel();
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
    if (index >= 0 && index < this.paragraphs.length) {
      this.currentIndex = index;
      if (this.isPlaying) {
        window.speechSynthesis.cancel();
        this.speakCurrentParagraph();
      } else {
        this.emitState();
        if (this.onParagraphChangeCallback) {
          this.onParagraphChangeCallback(this.currentIndex);
        }
      }
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
      this.nextParagraph();
      return;
    }

    if (this.onParagraphChangeCallback) {
      this.onParagraphChangeCallback(this.currentIndex);
    }
    this.emitState();

    window.speechSynthesis.cancel();

    // Fresh voice list check if not loaded initially
    if (this.availableSystemVoices.length === 0 && 'speechSynthesis' in window) {
      this.availableSystemVoices = window.speechSynthesis.getVoices();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    this.applyVoiceSettings(utterance);

    utterance.onend = () => {
      if (this.isPlaying) {
        if (this.currentIndex < this.paragraphs.length - 1) {
          this.currentIndex++;
          this.speakCurrentParagraph();
        } else {
          this.stop();
          if (this.onEndCallback) this.onEndCallback();
        }
      }
    };

    utterance.onerror = (e) => {
      if (e.error === 'interrupted' || e.error === 'canceled') return;
      console.warn('TTS utterance error:', e.error);
      if (this.isPlaying) {
        this.currentIndex++;
        this.speakCurrentParagraph();
      }
    };

    window.speechSynthesis.speak(utterance);
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

    // Find the best matching device voice
    if (this.availableSystemVoices.length > 0) {
      const langPrefix = this.currentLanguage.split('-')[0].toLowerCase();
      const matches = this.availableSystemVoices.filter((v) =>
        v.lang.toLowerCase().replace('_', '-').startsWith(langPrefix)
      );

      if (matches.length > 0) {
        if (selectedVoiceOption?.gender === 'female') {
          const femaleMatch = matches.find(
            (v) =>
              v.name.toLowerCase().includes('female') ||
              v.name.toLowerCase().includes('woman') ||
              v.name.toLowerCase().includes('zira') ||
              v.name.toLowerCase().includes('samantha') ||
              v.name.toLowerCase().includes('kavya') ||
              v.name.toLowerCase().includes('lekha')
          );
          utterance.voice = femaleMatch || matches[0];
        } else {
          const maleMatch = matches.find(
            (v) =>
              v.name.toLowerCase().includes('male') ||
              v.name.toLowerCase().includes('guy') ||
              v.name.toLowerCase().includes('david') ||
              v.name.toLowerCase().includes('george') ||
              v.name.toLowerCase().includes('rishi') ||
              v.name.toLowerCase().includes('ajay')
          );
          utterance.voice = maleMatch || matches[0];
        }
      }
    }
  }

  public testVoice(langCode: string, voiceId: string, testText: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

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
        const femaleMatch = systemMatches.find(
          (v) =>
            v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('woman')
        );
        utterance.voice = femaleMatch || systemMatches[0];
      } else {
        const maleMatch = systemMatches.find(
          (v) =>
            v.name.toLowerCase().includes('male') ||
            v.name.toLowerCase().includes('guy')
        );
        utterance.voice = maleMatch || systemMatches[0];
      }
    }

    window.speechSynthesis.speak(utterance);
  }

  private startKeepAlive() {
    this.stopKeepAlive();
    // Android & Chrome bug workaround: speech halts after 14s unless refreshed
    this.keepAliveInterval = setInterval(() => {
      if (this.isPlaying && !this.isPaused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);
  }

  private stopKeepAlive() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
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
