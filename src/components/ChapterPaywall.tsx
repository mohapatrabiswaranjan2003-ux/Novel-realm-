import React, { useState } from 'react';
import { Lock, Sparkles, Clock, CheckCircle, ArrowLeft, BookOpen, ShieldCheck } from 'lucide-react';
import { Novel, Chapter } from '../types/novel';

interface ChapterPaywallProps {
  novel: Novel;
  chapter: Chapter;
  canClaimDaily: boolean;
  onClaimDailyPass: () => void;
  onOpenVipModal: () => void;
  onNavigateChapter: (chapterId: number) => void;
  onOpenToc: () => void;
}

export const ChapterPaywall: React.FC<ChapterPaywallProps> = ({
  novel,
  chapter,
  canClaimDaily,
  onClaimDailyPass,
  onOpenVipModal,
  onNavigateChapter,
  onOpenToc,
}) => {
  const [claimSuccess, setClaimSuccess] = useState(false);

  const handleClaim = () => {
    onClaimDailyPass();
    setClaimSuccess(true);
  };

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 sm:p-8 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/5 via-[var(--bg-surface)] to-[var(--bg-surface)] text-[var(--text-primary)] shadow-xl text-center space-y-6 animate-fade-in font-clean-sans">
      
      {/* Lock Icon Header */}
      <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shadow-inner">
        <Lock className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>10,000+ Readers Milestone Reached</span>
        </div>
        <h2 className="font-display-title text-xl sm:text-2xl font-bold">
          Chapter {chapter.chapterNumber}: {chapter.title} is Locked
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-lg mx-auto leading-relaxed">
          <strong className="text-[var(--text-primary)]">{novel.title}</strong> has surpassed{' '}
          <strong className="text-amber-500">{novel.totalViews} views</strong>! 
          As part of our reader privilege rules, <strong className="text-[var(--text-primary)]">Chapters 1 to 30 remain 100% free forever</strong>. 
          Chapters beyond Chapter 30 can be unlocked below:
        </p>
      </div>

      {/* Unlock Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-2">
        
        {/* Option 1: Daily Free Pass */}
        <div className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-blue-500/40 transition-colors flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Option 1: Daily Free Pass</span>
            </div>
            <h4 className="text-sm font-bold text-[var(--text-primary)] mt-1">
              Read 1 New Chapter Every Day
            </h4>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Every reader receives 1 free pass every 24 hours to unlock their next chapter for free!
            </p>
          </div>

          <div>
            {canClaimDaily ? (
              <button
                onClick={handleClaim}
                className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Claim Today's Free Pass (Unlock Ch. {chapter.chapterNumber})</span>
              </button>
            ) : (
              <div className="p-2.5 rounded-lg bg-black/[0.03] dark:bg-white/[0.03] text-center text-xs text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                <span className="font-medium text-amber-600 dark:text-amber-400 block mb-0.5">
                  ✓ Today's Pass Claimed
                </span>
                <span>Next free pass resets tomorrow!</span>
              </div>
            )}
          </div>
        </div>

        {/* Option 2: Top Up $2 VIP Pass */}
        <div className="p-5 rounded-xl border-2 border-amber-500/40 bg-amber-500/[0.03] hover:border-amber-500 transition-colors flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider">
            Best Value
          </div>
          <div>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Option 2: Top Up $2</span>
            </div>
            <h4 className="text-sm font-bold text-[var(--text-primary)] mt-1">
              VIP Book Pass ($2.00)
            </h4>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Unlock ALL remaining chapters (Ch. 31 to final) for <strong className="text-[var(--text-primary)]">{novel.title}</strong> permanently with zero waiting!
            </p>
          </div>

          <button
            onClick={onOpenVipModal}
            className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Top Up $2 (Unlock Entire Novel)</span>
          </button>
        </div>

      </div>

      {/* Early Reader Rule Transparency Box */}
      <div className="p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] flex items-start gap-2.5 text-left">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-[var(--text-primary)] block mb-0.5">
            🏆 Early Reader Privilege Rule
          </strong>
          <span>
            Any reader who starts reading a book before it crosses 10,000 views is permanently granted Founding Reader access with 100% free reading forever. Check out books with the Early Reader badge in our library to enjoy full access!
          </span>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <button
          onClick={() => {
            // Navigate back to Chapter 30
            const ch30 = novel.chapters.find((c) => c.chapterNumber === 30) || novel.chapters[0];
            if (ch30) onNavigateChapter(ch30.id);
          }}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Read Free Chapter 30</span>
        </button>
        <span className="text-[var(--text-secondary)] opacity-40">·</span>
        <button
          onClick={onOpenToc}
          className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>View Table of Contents</span>
        </button>
      </div>

    </div>
  );
};
