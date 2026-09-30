import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2, FastForward, X } from 'lucide-react';

interface AudioNarratorProps {
  textToRead: string;
  chapterTitle: string;
  rate: number;
  onRateChange: (rate: number) => void;
  onClose: () => void;
}

export const AudioNarrator: React.FC<AudioNarratorProps> = ({
  textToRead,
  chapterTitle,
  rate,
  onRateChange,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [supported, setSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSupported(false);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Prepare clean text for narration (strip HTML tags)
  const cleanText = (html: string): string => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const handlePlay = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();
    const plainText = cleanText(textToRead);
    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.rate = rate;

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const cycleRate = () => {
    const rates = [0.8, 1.0, 1.25, 1.5, 2.0];
    const nextIdx = (rates.indexOf(rate) + 1) % rates.length;
    const nextRate = rates[nextIdx >= 0 ? nextIdx : 1];
    onRateChange(nextRate);
    if (isPlaying && !isPaused) {
      // Restart with new rate
      handlePlay();
    }
  };

  if (!supported) {
    return (
      <div className="fixed bottom-6 right-6 z-40 bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-3 rounded-xl shadow-lg text-xs text-[var(--text-secondary)] flex items-center gap-3">
        <span>Audio narration is not supported in this browser.</span>
        <button onClick={onClose} className="p-1 hover:text-[var(--text-primary)]">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm w-full sm:w-auto bg-[var(--bg-surface)]/95 backdrop-blur-md border border-[var(--border-subtle)] p-3 rounded-2xl shadow-xl flex items-center gap-3 text-[var(--text-primary)] animate-slide-up">
      <div className="flex items-center gap-2 pl-1">
        <div className={`p-2 rounded-lg ${isPlaying ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-200 dark:bg-slate-800 text-[var(--text-secondary)]'}`}>
          <Volume2 className="w-4 h-4" />
        </div>
        <div className="flex flex-col min-w-0 pr-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-secondary)]">
            Audio Narrator
          </span>
          <span className="text-xs font-medium truncate max-w-[130px] sm:max-w-[160px]">
            {chapterTitle}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 border-l border-[var(--border-subtle)] pl-2">
        {!isPlaying || isPaused ? (
          <button
            onClick={handlePlay}
            className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            title="Play narration"
          >
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            title="Pause narration"
          >
            <Pause className="w-4 h-4 fill-current" />
          </button>
        )}

        <button
          onClick={handleStop}
          disabled={!isPlaying && !isPaused}
          className="p-2 rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-40 transition-colors"
          title="Stop narration"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
        </button>

        <button
          onClick={cycleRate}
          className="px-2 py-1.5 rounded-lg border border-[var(--border-subtle)] text-xs font-mono tabular-nums text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          title="Change playback speed"
        >
          {rate}x
        </button>

        <button
          onClick={() => {
            handleStop();
            onClose();
          }}
          className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors ml-1"
          title="Close player"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
