/**
 * High-reliability Mobile TTS Engine
 * Splits text into paragraphs, circumvents mobile Chrome 15-second utterance timeout,
 * and manages real voice synthesis with 5 distinct gender/style profiles per language.
 */

import { VoiceOption, getVoicesForLanguage } from './translationService';

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

  public setContent(htmlContent: string) {
    this.stop();
    // Parse into distinct clean paragraphs
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const pElements = Array.from(doc.querySelectorAll('p'));

    if (pElements.length > 0) {
      this.paragraphs = pElements
        .map((p) => (p.textContent || '').trim())
        .filter((text) => text.length > 0);
    } else {
      // Fallback: split by linebreaks
      const rawText = doc.body.textContent || '';
      this.paragraphs = rawText
        .split(/\n+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
    }

    this.currentIndex = 0;
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
    this.currentLanguage = langCode;
    this.selectedVoiceId = voiceId;
  }

  public setRate(newRate: number) {
    this.rate = newRate;
  }

  public play() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (this.paragraphs.length === 0) return;

    if (this.isPaused) {
      window.speechSynthesis.resume();
      this.isPaused = false;
      this.isPlaying = true;
      this.emitState();
      this.startKeepAlive();
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
    window.speechSynthesis.pause();
    this.isPaused = true;
    this.isPlaying = false;
    this.stopKeepAlive();
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
        if (this.onParagraphChangeCallback) {
          this.onParagraphChangeCallback(this.currentIndex);
        }
      }
    }
  }

  private speakCurrentParagraph() {
    if (!this.isPlaying) return;
    if (this.currentIndex >= this.paragraphs.length) {
      this.stop();
      if (this.onEndCallback) this.onEndCallback();
      return;
    }

    const text = this.paragraphs[this.currentIndex];
    if (!text) {
      this.nextParagraph();
      return;
    }

    if (this.onParagraphChangeCallback) {
      this.onParagraphChangeCallback(this.currentIndex);
    }

    const utterance = new SpeechSynthesisUtterance(text);
    this.applyVoiceSettings(utterance);

    utterance.onend = () => {
      if (this.isPlaying) {
        this.currentIndex++;
        this.speakCurrentParagraph();
      }
    };

    utterance.onerror = (e) => {
      // Ignore normal interruptions (e.g. user tapping next or pause)
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
    const voices = getVoicesForLanguage(this.currentLanguage);
    const selectedVoiceOption =
      voices.find((v) => v.id === this.selectedVoiceId) || voices[0];

    utterance.pitch = selectedVoiceOption?.pitch ?? 1.0;
    utterance.rate = this.rate * (selectedVoiceOption?.rate ?? 1.0);

    // Find the best matching device voice
    if (this.availableSystemVoices.length > 0) {
      // Look for voice matching language code (e.g. 'hi', 'es', 'en')
      const langPrefix = this.currentLanguage.split('-')[0].toLowerCase();
      const matches = this.availableSystemVoices.filter((v) =>
        v.lang.toLowerCase().startsWith(langPrefix)
      );

      if (matches.length > 0) {
        // If female requested, look for female named voice if available
        if (selectedVoiceOption?.gender === 'female') {
          const femaleMatch = matches.find(
            (v) =>
              v.name.toLowerCase().includes('female') ||
              v.name.toLowerCase().includes('woman') ||
              v.name.toLowerCase().includes('zira') ||
              v.name.toLowerCase().includes('samantha')
          );
          utterance.voice = femaleMatch || matches[0];
        } else {
          // Male voice
          const maleMatch = matches.find(
            (v) =>
              v.name.toLowerCase().includes('male') ||
              v.name.toLowerCase().includes('guy') ||
              v.name.toLowerCase().includes('david') ||
              v.name.toLowerCase().includes('george')
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
    const voices = getVoicesForLanguage(langCode);
    const voiceOption = voices.find((v) => v.id === voiceId) || voices[0];

    utterance.pitch = voiceOption?.pitch ?? 1.0;
    utterance.rate = this.rate * (voiceOption?.rate ?? 1.0);

    const langPrefix = langCode.split('-')[0].toLowerCase();
    const systemMatches = window.speechSynthesis
      .getVoices()
      .filter((v) => v.lang.toLowerCase().startsWith(langPrefix));

    if (systemMatches.length > 0) {
      if (voiceOption?.gender === 'female') {
        const femaleMatch = systemMatches.find((v) =>
          v.name.toLowerCase().includes('female')
        );
        utterance.voice = femaleMatch || systemMatches[0];
      } else {
        const maleMatch = systemMatches.find((v) =>
          v.name.toLowerCase().includes('male')
        );
        utterance.voice = maleMatch || systemMatches[0];
      }
    }

    window.speechSynthesis.speak(utterance);
  }

  private startKeepAlive() {
    this.stopKeepAlive();
    // Android Chrome bug workaround: speech halts after 14s unless refreshed
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
      });
    }
  }
}
