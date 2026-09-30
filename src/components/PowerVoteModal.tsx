import React, { useState, useEffect } from 'react';
import { Novel } from '../types/novel';
import { X, Zap, Trophy, Sparkles, Check, ChevronUp } from 'lucide-react';
import { getPowerVoteData, castPowerVote } from '../utils/readingStorage';

interface PowerVoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  novels: Novel[];
  onSelectNovel: (novelId: number) => void;
}

export const PowerVoteModal: React.FC<PowerVoteModalProps> = ({
  isOpen,
  onClose,
  novels,
  onSelectNovel,
}) => {
  const [voteData, setVoteData] = useState(() => getPowerVoteData());
  const [votedNovelId, setVotedNovelId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setVoteData(getPowerVoteData());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVote = (novelId: number) => {
    const res = castPowerVote(novelId);
    if (res.success) {
      setVoteData(getPowerVoteData());
      setVotedNovelId(novelId);
      setTimeout(() => setVotedNovelId(null), 2000);
    }
  };

  // Rank novels by total votes
  const sortedNovels = [...novels].sort((a, b) => {
    const votesA = voteData.votes[a.id] || 0;
    const votesB = voteData.votes[b.id] || 0;
    return votesB - votesA;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-clean-sans">
      <div
        className="w-full max-w-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-2xl shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto flex flex-col"
        role="dialog"
        aria-label="Power Stone Leaderboard"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
              <Zap className="w-5 h-5 fill-current" />
            </span>
            <div>
              <h3 className="font-display-title text-lg font-bold">Power Stone Leaderboard</h3>
              <p className="text-[11px] text-[var(--text-secondary)]">Vote daily to boost your favorite novel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User's Daily Tickets Card */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 border border-amber-500/20 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-600 dark:text-amber-400">
              Your Daily Power Stones
            </span>
            <div className="text-xl font-black font-mono text-[var(--text-primary)] flex items-center gap-1.5">
              <span>{voteData.dailyTicketsRemaining}</span>
              <span className="text-xs font-normal text-[var(--text-secondary)]">/ 3 Stones available today</span>
            </div>
            <p className="text-[10px] text-[var(--text-secondary)]">
              Refreshes daily at midnight! Use them to push novels up the ranks.
            </p>
          </div>

          <div className="flex items-center gap-1 text-amber-500">
            {[1, 2, 3].map((idx) => (
              <Zap
                key={idx}
                className={`w-5 h-5 ${
                  idx <= voteData.dailyTicketsRemaining
                    ? 'fill-amber-500 text-amber-500 animate-pulse'
                    : 'text-slate-400/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="mt-5 space-y-2.5 flex-1">
          <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
            Community Rankings
          </h4>

          {sortedNovels.map((novel, index) => {
            const votes = voteData.votes[novel.id] || 0;
            const rank = index + 1;
            const isTop3 = rank <= 3;
            const hasVotedThis = votedNovelId === novel.id;

            return (
              <div
                key={novel.id}
                className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-black/[0.01] dark:bg-white/[0.01] hover:border-amber-500/40 flex items-center justify-between gap-3 transition-colors"
              >
                {/* Rank & Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs font-mono shrink-0 ${
                      rank === 1
                        ? 'bg-amber-500 text-white shadow-xs'
                        : rank === 2
                        ? 'bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white'
                        : rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-black/5 dark:bg-white/5 text-[var(--text-secondary)]'
                    }`}
                  >
                    {rank === 1 ? <Trophy className="w-4 h-4" /> : `#${rank}`}
                  </div>

                  <div className="min-w-0 cursor-pointer" onClick={() => { onSelectNovel(novel.id); onClose(); }}>
                    <h5 className="text-xs font-bold text-[var(--text-primary)] hover:text-blue-600 transition-colors truncate">
                      {novel.title}
                    </h5>
                    <div className="flex items-center gap-2 text-[11px] text-[var(--text-secondary)] mt-0.5">
                      <span>{novel.genre}</span>
                      <span>·</span>
                      <span className="font-mono text-amber-600 dark:text-amber-400 font-semibold">
                        {votes.toLocaleString()} Stones
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vote Action */}
                <button
                  type="button"
                  disabled={voteData.dailyTicketsRemaining <= 0}
                  onClick={() => handleVote(novel.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                    hasVotedThis
                      ? 'bg-emerald-600 text-white'
                      : voteData.dailyTicketsRemaining > 0
                      ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs hover:scale-105'
                      : 'bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] opacity-50 cursor-not-allowed'
                  }`}
                >
                  {hasVotedThis ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Voted!</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>Vote +1</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
          <span>Weekly #1 novel receives 5 bonus chapters released!</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-black/5 dark:hover:bg-white/5"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
