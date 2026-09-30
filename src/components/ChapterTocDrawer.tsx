import React, { useState } from 'react';
import { Novel, Chapter } from '../types/novel';
import { X, CheckCircle, Clock, BookOpen, Search, Lock, Unlock, Sparkles, Award } from 'lucide-react';
import { checkChapterLockStatus } from '../utils/readingStorage';

interface ChapterTocDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  novel: Novel;
  activeChapterId: number;
  onSelectChapter: (chapterId: number) => void;
  completedChapterIds: number[];
  unlockedBooks?: number[];
  dailyClaimedChapters?: number[];
  founderNovels?: number[];
}

export const ChapterTocDrawer: React.FC<ChapterTocDrawerProps> = ({
  isOpen,
  onClose,
  novel,
  activeChapterId,
  onSelectChapter,
  completedChapterIds,
  unlockedBooks = [],
  dailyClaimedChapters = [],
  founderNovels = [],
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  const isOver10k = novel.viewCount >= 10000;
  const isEarlyPrivilege = !isOver10k || founderNovels.includes(novel.id);
  const isBookUnlocked = unlockedBooks.includes(novel.id);

  const filteredChapters = novel.chapters.filter((ch) => {
    const q = filterQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      ch.title.toLowerCase().includes(q) ||
      `chapter ${ch.chapterNumber}`.includes(q) ||
      `ch ${ch.chapterNumber}`.includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-start bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in font-clean-sans">
      <div
        className="w-full max-w-sm sm:max-w-md h-full bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] text-[var(--text-primary)] shadow-2xl p-6 overflow-y-auto flex flex-col space-y-4"
        role="dialog"
        aria-label="Table of Contents"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="font-display-title text-base font-bold leading-tight">Table of Contents</h3>
              <p className="text-xs text-[var(--text-secondary)] truncate max-w-[240px]">
                {novel.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Milestone Status Banner */}
        <div className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${
          isEarlyPrivilege
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
            : isBookUnlocked
            ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
            : 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400'
        }`}>
          <div className="flex items-center gap-2">
            {isEarlyPrivilege ? (
              <Award className="w-4 h-4 shrink-0" />
            ) : isBookUnlocked ? (
              <Sparkles className="w-4 h-4 shrink-0" />
            ) : (
              <Lock className="w-4 h-4 shrink-0" />
            )}
            <span className="font-medium">
              {isEarlyPrivilege
                ? `🏆 Early Reader Privilege: All Chapters Free (${novel.totalViews} views)`
                : isBookUnlocked
                ? '⚡ $2 VIP Pass: All Chapters Unlocked'
                : `10K+ Milestone (${novel.totalViews}): Ch. 1-30 Free`}
            </span>
          </div>
        </div>

        {/* Search inside chapters */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search chapters by title or #..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder-[var(--text-secondary)]/60 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Chapter List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[var(--border-subtle)] space-y-1 pr-1">
          {filteredChapters.map((ch: Chapter) => {
            const isCurrent = ch.id === activeChapterId;
            const isCompleted = completedChapterIds.includes(ch.id);
            const lockStatus = checkChapterLockStatus(
              novel,
              ch.chapterNumber,
              ch.id,
              unlockedBooks,
              dailyClaimedChapters,
              founderNovels
            );

            return (
              <div
                key={ch.id}
                onClick={() => {
                  onSelectChapter(ch.id);
                  onClose();
                }}
                className={`py-3 px-2.5 rounded-lg cursor-pointer transition-colors flex items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-primary)]'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-medium">Chapter {ch.chapterNumber}</span>
                    
                    {lockStatus.isLocked ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                        <Lock className="w-2.5 h-2.5" />
                        Locked (Ch. &gt; 30)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        <Unlock className="w-2.5 h-2.5" />
                        {lockStatus.reason === 'daily_pass_unlocked'
                          ? 'Pass Unlocked'
                          : lockStatus.reason === 'vip_pass_unlocked'
                          ? 'VIP Pass'
                          : 'Free'}
                      </span>
                    )}

                    {isCurrent && (
                      <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">
                        Current
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-medium mt-0.5 truncate">{ch.title}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-[var(--text-secondary)] mt-1 font-clean-sans">
                    <span className="font-mono tabular-nums">{ch.wordCount} words</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-3 h-3" />
                      {ch.estimatedReadMinutes} min
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isCompleted && (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  )}
                  {lockStatus.isLocked && (
                    <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-500">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="border-t border-[var(--border-subtle)] pt-3 text-xs text-[var(--text-secondary)] flex justify-between items-center">
          <span className="font-mono tabular-nums">
            {novel.chapters.length} Total Chapters
          </span>
          <span className="font-mono tabular-nums">
            {completedChapterIds.length} Completed
          </span>
        </div>
      </div>
    </div>
  );
};
