import React from 'react';
import { Novel, Chapter } from '../types/novel';
import { Sparkles, ShieldCheck, Bookmark, Zap, BookOpen, ArrowLeft, UserCheck } from 'lucide-react';

interface GuestChapterGateProps {
  novel: Novel;
  chapter: Chapter;
  onOpenAuth: (mode?: 'login' | 'reader-signup') => void;
  onBackToPreview: () => void;
  onBackToLibrary: () => void;
}

export const GuestChapterGate: React.FC<GuestChapterGateProps> = ({
  novel,
  chapter,
  onOpenAuth,
  onBackToPreview,
  onBackToLibrary,
}) => {
  return (
    <div className="max-w-2xl mx-auto my-8 p-6 sm:p-8 rounded-2xl border border-blue-500/30 bg-gradient-to-b from-blue-500/10 via-[var(--bg-surface)] to-[var(--bg-surface)] text-[var(--text-primary)] shadow-2xl text-center space-y-6 animate-fade-in font-clean-sans">
      {/* App Icon / Crown Header */}
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg border-2 border-blue-500/40 relative">
          <img src="/app-icon.jpg" alt="NovelRealm" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-blue-500/10" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Free Guest Preview (Chapters 1–3)</span>
        </div>
        <h2 className="font-display-title text-xl sm:text-2xl font-bold">
          Continue Reading Chapter {chapter.chapterNumber}
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-lg mx-auto leading-relaxed">
          You've completed the <strong className="text-[var(--text-primary)]">3-Chapter Free Guest Preview</strong> for{' '}
          <strong className="text-blue-500">{novel.title}</strong>. 
          Create a free account or sign in to continue reading all chapters and sync your reading journey!
        </p>
      </div>

      {/* Benefits Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span><strong>100% Free</strong> account forever</span>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-500 shrink-0" />
          <span><strong>Instant access</strong> to next chapters</span>
        </div>
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-amber-500 shrink-0" />
          <span><strong>Sync bookmarks</strong> across phone & PC</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-purple-500 shrink-0" />
          <span><strong>Daily Power Stones</strong> to vote for novels</span>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="space-y-3 pt-2">
        <button
          onClick={() => onOpenAuth('reader-signup')}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all transform active:scale-98 flex items-center justify-center gap-2"
        >
          <UserCheck className="w-4 h-4" />
          <span>Sign In / Create Free Account to Continue</span>
        </button>

        <div className="flex items-center justify-center gap-4 text-xs">
          <button
            onClick={onBackToPreview}
            className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Re-read Chapter 3</span>
          </button>
          <span className="text-[var(--text-secondary)] opacity-40">•</span>
          <button
            onClick={onBackToLibrary}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline py-1"
          >
            Browse Other Novels
          </button>
        </div>
      </div>
    </div>
  );
};
