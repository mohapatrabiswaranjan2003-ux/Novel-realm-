import React, { useState, useEffect } from 'react';
import { ChapterReactionType, ChapterReactions } from '../types/novel';
import { getChapterReactions, toggleChapterReaction } from '../utils/readingStorage';

interface ChapterReactionsBarProps {
  chapterId: number;
  chapterNumber: number;
}

const REACTION_CONFIG: { type: ChapterReactionType; emoji: string; label: string }[] = [
  { type: 'fire', emoji: '🔥', label: 'Epic Fight' },
  { type: 'cliffhanger', emoji: '😱', label: 'Cliffhanger!' },
  { type: 'mindblown', emoji: '🤯', label: 'Mind Blown' },
  { type: 'laugh', emoji: '🤣', label: 'Hilarious' },
  { type: 'cry', emoji: '😭', label: 'Emotional' },
  { type: 'heart', emoji: '💖', label: 'Wholesome' },
];

export const ChapterReactionsBar: React.FC<ChapterReactionsBarProps> = ({
  chapterId,
  chapterNumber,
}) => {
  const [reactions, setReactions] = useState<ChapterReactions>(() =>
    getChapterReactions(chapterId)
  );
  const [justReacted, setJustReacted] = useState<ChapterReactionType | null>(null);

  useEffect(() => {
    setReactions(getChapterReactions(chapterId));
  }, [chapterId]);

  const handleReact = (type: ChapterReactionType) => {
    const updated = toggleChapterReaction(chapterId, type);
    setReactions(updated);
    setJustReacted(type);
    setTimeout(() => setJustReacted(null), 1500);
  };

  return (
    <div className="my-6 p-4 rounded-2xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] font-clean-sans">
      <div className="flex items-center justify-between pb-3">
        <div>
          <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
            Chapter {chapterNumber} Reactions
          </h4>
          <p className="text-[11px] text-[var(--text-secondary)]">How did this chapter make you feel?</p>
        </div>
        <span className="text-[10px] text-[var(--text-secondary)] font-mono">
          {Object.values(reactions)
            .filter((v): v is number => typeof v === 'number')
            .reduce((a, b) => a + b, 0)}{' '}
          votes
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {REACTION_CONFIG.map(({ type, emoji, label }) => {
          const isSelected = reactions.userReacted === type;
          const count = reactions[type];
          const isAnimating = justReacted === type;

          return (
            <button
              key={type}
              type="button"
              onClick={() => handleReact(type)}
              className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold shadow-xs scale-105'
                  : 'border-[var(--border-subtle)] hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-secondary)]'
              } ${isAnimating ? 'animate-bounce' : ''}`}
            >
              <span className="text-xl sm:text-2xl select-none" role="img" aria-label={label}>
                {emoji}
              </span>
              <span className="text-[10px] font-medium leading-none truncate max-w-full">
                {label}
              </span>
              <span className="text-[11px] font-mono tabular-nums text-[var(--text-primary)] font-bold">
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
