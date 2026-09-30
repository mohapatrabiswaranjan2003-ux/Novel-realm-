import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Novel, Chapter, ReaderSettings, Bookmark } from '../types/novel';
import { applyBionicReading, recordChapterRead } from '../utils/readingStorage';
import { ChapterTocDrawer } from './ChapterTocDrawer';
import { ReaderSettingsDrawer } from './ReaderSettingsDrawer';
import { AudioNarrator } from './AudioNarrator';
import { MonetizationSection } from './MonetizationSection';
import { ChapterPaywall } from './ChapterPaywall';
import { VipUnlockModal } from './VipUnlockModal';
import { ChapterComments } from './ChapterComments';
import { ShareModal } from './ShareModal';
import { ChapterReactionsBar } from './ChapterReactionsBar';
import { checkChapterLockStatus, canClaimDailyPass, registerFounderPrivilege } from '../utils/readingStorage';
import { recordNovelReaderInteraction } from '../utils/authorEarningsStorage';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Bookmark as BookmarkIcon,
  List,
  Volume2,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Clock,
  Share2,
  Sparkles,
} from 'lucide-react';

interface ReaderViewProps {
  novel: Novel;
  initialChapterId?: number;
  onBackToLibrary: () => void;
  settings: ReaderSettings;
  onUpdateSettings: (newSettings: Partial<ReaderSettings>) => void;
  onSaveProgress: (novelId: number, chapterId: number, percent: number) => void;
  savedProgressPercent?: number;
  onAddBookmark: (bookmark: Omit<Bookmark, 'id' | 'timestamp'>) => void;
  isBookmarked: boolean;
  onToggleBookmarkCurrent: () => void;
  completedChapterIds: number[];
  onMarkChapterCompleted: (chapterId: number) => void;
  unlockedBooks?: number[];
  dailyClaimedChapters?: number[];
  founderNovels?: number[];
  onUnlockBookPermanently?: (novelId: number) => void;
  onClaimDailyPass?: (chapterId: number) => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  novel,
  initialChapterId,
  onBackToLibrary,
  settings,
  onUpdateSettings,
  onSaveProgress,
  savedProgressPercent,
  onAddBookmark,
  isBookmarked,
  onToggleBookmarkCurrent,
  completedChapterIds,
  onMarkChapterCompleted,
  unlockedBooks = [],
  dailyClaimedChapters = [],
  founderNovels = [],
  onUnlockBookPermanently,
  onClaimDailyPass,
}) => {
  const [currentChapterId, setCurrentChapterId] = useState<number>(
    initialChapterId || novel.chapters[0]?.id || 1
  );
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAudioOpen, setIsAudioOpen] = useState(false);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(savedProgressPercent || 0);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectionBookmarkToast, setSelectionBookmarkToast] = useState(false);

  // Automatically register Early Reader / Founder privilege if user reads under 10k views
  useEffect(() => {
    if (novel.viewCount < 10000) {
      registerFounderPrivilege(novel.id, novel.viewCount);
    }
  }, [novel.id, novel.viewCount]);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Current Chapter Object
  const currentChapter = useMemo(() => {
    return novel.chapters.find((c) => c.id === currentChapterId) || novel.chapters[0];
  }, [novel, currentChapterId]);

  // Current Chapter index
  const chapterIndex = useMemo(() => {
    return novel.chapters.findIndex((c) => c.id === currentChapterId);
  }, [novel, currentChapterId]);

  const hasPrevChapter = chapterIndex > 0;
  const hasNextChapter = chapterIndex < novel.chapters.length - 1;

  // Evaluate Chapter Lock Status (10,000 views rule, first 30 free, daily pass, $2 VIP pass)
  const lockStatus = useMemo(() => {
    return checkChapterLockStatus(
      novel,
      currentChapter.chapterNumber,
      currentChapter.id,
      unlockedBooks,
      dailyClaimedChapters,
      founderNovels
    );
  }, [novel, currentChapter, unlockedBooks, dailyClaimedChapters, founderNovels]);

  const canClaimToday = useMemo(() => {
    return canClaimDailyPass();
  }, [dailyClaimedChapters]);

  // Track scroll depth and update progress
  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      if (scrollHeight > 0) {
        const percent = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
        setScrollProgress(percent);
        onSaveProgress(novel.id, currentChapter.id, percent);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [novel.id, currentChapter.id, onSaveProgress]);

  // Scroll to saved position or top when chapter changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setScrollProgress(0);
    recordNovelReaderInteraction(novel.id, currentChapter.wordCount);
  }, [currentChapterId, novel.id, currentChapter.wordCount]);

  // Handle keyboard navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTocOpen || isSettingsOpen) return;
      if (e.key === 'ArrowLeft' && hasPrevChapter) {
        goToPrevChapter();
      } else if (e.key === 'ArrowRight' && hasNextChapter) {
        goToNextChapter();
      } else if (e.key === 'Escape') {
        if (settings.zenMode) onUpdateSettings({ zenMode: false });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasPrevChapter, hasNextChapter, isTocOpen, isSettingsOpen, settings.zenMode]);

  const goToPrevChapter = () => {
    if (hasPrevChapter) {
      setCurrentChapterId(novel.chapters[chapterIndex - 1].id);
    }
  };

  const goToNextChapter = () => {
    if (hasNextChapter) {
      onMarkChapterCompleted(currentChapter.id);
      recordChapterRead(currentChapter.wordCount);
      setCurrentChapterId(novel.chapters[chapterIndex + 1].id);
    }
  };

  const handleCompleteCurrent = () => {
    onMarkChapterCompleted(currentChapter.id);
    recordChapterRead(currentChapter.wordCount);
  };

  // Text selection for snippet bookmarking
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 10) {
      setSelectedText(selection.toString().trim());
    } else {
      setSelectedText('');
    }
  };

  const handleBookmarkSelection = () => {
    if (!selectedText) return;
    onAddBookmark({
      novelId: novel.id,
      novelTitle: novel.title,
      chapterId: currentChapter.id,
      chapterTitle: `Chapter ${currentChapter.chapterNumber}: ${currentChapter.title}`,
      snippet: selectedText.length > 200 ? `${selectedText.slice(0, 200)}...` : selectedText,
    });
    setSelectionBookmarkToast(true);
    setSelectedText('');
    setTimeout(() => setSelectionBookmarkToast(false), 2500);
  };

  const handleShare = () => {
    setIsShareOpen(true);
  };

  // Compute column width class
  const columnWidthClass = useMemo(() => {
    switch (settings.columnWidth) {
      case 'compact':
        return 'max-w-xl'; // ~576px
      case 'editorial':
        return 'max-w-2xl'; // ~672px optimal measure
      case 'broad':
        return 'max-w-3xl'; // ~768px
      case 'full':
        return 'max-w-5xl';
      default:
        return 'max-w-2xl';
    }
  }, [settings.columnWidth]);

  // Compute font family class
  const fontFamilyClass = useMemo(() => {
    switch (settings.fontFamily) {
      case 'serif':
        return 'font-editorial-serif';
      case 'book':
        return 'font-book-serif';
      case 'sans':
        return 'font-clean-sans';
      case 'mono':
        return 'font-mono-reader';
      default:
        return 'font-editorial-serif';
    }
  }, [settings.fontFamily]);

  // Compute line-height class
  const lineHeightClass = useMemo(() => {
    switch (settings.lineHeight) {
      case 'tight':
        return 'leading-relaxed';
      case 'normal':
        return 'leading-loose';
      case 'relaxed':
        return 'leading-[2.2]';
      default:
        return 'leading-loose';
    }
  }, [settings.lineHeight]);

  // Rendered HTML content (with optional Bionic Reading)
  const formattedHtml = useMemo(() => {
    if (settings.bionicReading) {
      return applyBionicReading(currentChapter.content);
    }
    return currentChapter.content;
  }, [currentChapter.content, settings.bionicReading]);

  return (
    <div
      ref={containerRef}
      onMouseUp={handleMouseUp}
      className={`min-h-screen transition-colors duration-200 bg-[var(--reader-bg)] text-[var(--reader-text)] selection:bg-blue-200 dark:selection:bg-blue-900 ${
        settings.zenMode ? 'zen-mode' : ''
      }`}
    >
      {/* 1. Subtle Reading Progress Bar at the very top */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-black/10 dark:bg-white/10">
        <div
          className="h-full bg-blue-600 dark:bg-blue-400 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 2. Reader Navigation Header (Auto-hidden in Zen Mode) */}
      {!settings.zenMode && (
        <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md bg-[var(--reader-bg)]/95 border-[var(--border-subtle)] transition-colors">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
            
            {/* Left: Back to library & Chapter quick selector */}
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={onBackToLibrary}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                title="Return to Library"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Library</span>
              </button>

              <span className="text-[var(--border-subtle)]" aria-hidden="true">|</span>

              {/* Table of contents button */}
              <button
                onClick={() => setIsTocOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors truncate max-w-[200px] sm:max-w-xs"
                title="View Table of Contents"
              >
                <List className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  Ch. {currentChapter.chapterNumber}: {currentChapter.title}
                </span>
              </button>
            </div>

            {/* Right: Quick Reader Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Prev Chapter */}
              <button
                onClick={goToPrevChapter}
                disabled={!hasPrevChapter}
                className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                title="Previous Chapter (← key)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Next Chapter */}
              <button
                onClick={goToNextChapter}
                disabled={!hasNextChapter}
                className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                title="Next Chapter (→ key)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Bookmark Toggle */}
              <button
                onClick={onToggleBookmarkCurrent}
                className={`p-1.5 rounded-lg transition-colors ${
                  isBookmarked
                    ? 'text-amber-500 bg-amber-500/10'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark this chapter'}
              >
                <BookmarkIcon className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>

              {/* Audio Narrator Toggle */}
              <button
                onClick={() => setIsAudioOpen(!isAudioOpen)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isAudioOpen
                    ? 'text-blue-600 bg-blue-500/10'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                title="Listen to Chapter (Text-to-Speech)"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              {/* Reader Preferences & Typography Controls */}
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                title="Display Settings"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Format</span>
              </button>

              {/* Zen Mode / Fullscreen Toggle */}
              <button
                onClick={() => onUpdateSettings({ zenMode: !settings.zenMode })}
                className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                title="Zen Mode (Distraction-Free)"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        </header>
      )}

      {/* Floating Exit Zen Mode Button when Zen is active */}
      {settings.zenMode && (
        <div className="fixed top-4 right-4 z-50 opacity-20 hover:opacity-100 transition-opacity">
          <button
            onClick={() => onUpdateSettings({ zenMode: false })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 text-white text-xs backdrop-blur-md shadow-md hover:bg-black/90 transition-all"
            title="Exit Zen Mode (Esc)"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Exit Zen</span>
          </button>
        </div>
      )}

      {/* 3. Main Prose Canvas */}
      <main className="px-4 sm:px-6 py-10 sm:py-16">
        <article className={`mx-auto ${columnWidthClass} space-y-8`}>
          
          {/* Chapter Editorial Header */}
          <header className="border-b border-[var(--border-subtle)] pb-8 text-center space-y-3">
            <div className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-sans">
              <span>{novel.title}</span>
              <span className="mx-2">·</span>
              <span>Volume I</span>
            </div>

            <h1 className="font-display-title text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[var(--reader-text)] leading-tight text-balance">
              Chapter {currentChapter.chapterNumber}: {currentChapter.title}
            </h1>

            <div className="flex items-center justify-center gap-3 text-xs text-[var(--text-secondary)] font-clean-sans">
              <span>By {novel.author}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{currentChapter.wordCount} words</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 font-mono tabular-nums">
                <Clock className="w-3 h-3" />
                ~{currentChapter.estimatedReadMinutes} min read
              </span>
            </div>

            {/* View Count Milestone Status Badge */}
            <div className="pt-1 flex items-center justify-center">
              {novel.viewCount < 10000 ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>🏆 Early Reader Privilege: 100% Free ({novel.totalViews} / 10K Views)</span>
                </div>
              ) : currentChapter.chapterNumber <= 30 ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Free Chapter (1–30 Milestone · {novel.totalViews} Total Views)</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>VIP Chapter (10,000+ Readers Milestone)</span>
                </div>
              )}
            </div>

            {/* Author note if present */}
            {currentChapter.authorNote && (
              <div className="mt-4 p-3.5 rounded-lg bg-black/5 dark:bg-white/5 text-xs text-[var(--text-secondary)] italic border-l-2 border-blue-500 text-left font-clean-sans">
                <span className="font-semibold not-italic">Author's Note:</span> {currentChapter.authorNote}
              </div>
            )}
          </header>

          {/* Text Selection Floating Bookmark Action */}
          {selectedText && (
            <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] shadow-xl rounded-full px-4 py-2 flex items-center gap-3 animate-slide-up">
              <span className="text-xs max-w-[200px] truncate">
                "{selectedText}"
              </span>
              <button
                onClick={handleBookmarkSelection}
                className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-medium transition-colors"
              >
                <BookmarkIcon className="w-3 h-3 fill-current" />
                <span>Bookmark Quote</span>
              </button>
            </div>
          )}

          {/* Toast on quote bookmarked */}
          {selectionBookmarkToast && (
            <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white shadow-xl rounded-full px-4 py-2 text-xs font-medium animate-fade-in">
              Quote saved to your bookmarks!
            </div>
          )}

          {/* Chapter Body Prose OR Paywall if Locked */}
          {lockStatus.isLocked ? (
            <ChapterPaywall
              novel={novel}
              chapter={currentChapter}
              canClaimDaily={canClaimToday}
              onClaimDailyPass={() => {
                if (onClaimDailyPass) {
                  onClaimDailyPass(currentChapter.id);
                }
              }}
              onOpenVipModal={() => setIsVipModalOpen(true)}
              onNavigateChapter={(id) => setCurrentChapterId(id)}
              onOpenToc={() => setIsTocOpen(true)}
            />
          ) : (
            <>
              {/* Chapter Body Prose */}
              <div
                ref={contentRef}
                className={`${fontFamilyClass} ${lineHeightClass} space-y-6 reader-prose`}
                style={{
                  fontSize: `${settings.fontSize}px`,
                  textAlign: settings.alignment,
                }}
                dangerouslySetInnerHTML={{ __html: formattedHtml }}
              />

              {/* Interactive Emoji Reactions (WTR-Lab style) */}
              <ChapterReactionsBar
                chapterId={currentChapter.id}
                chapterNumber={currentChapter.chapterNumber}
              />

              {/* End-of-Chapter Monetization: Google AdSense Slot, Author Tipping, and Advance Drafts */}
              <MonetizationSection novel={novel} chapter={currentChapter} />

              {/* Reader Comments & Chapter Discussion */}
              <ChapterComments
                chapterId={currentChapter.id}
                chapterNumber={currentChapter.chapterNumber}
                novelTitle={novel.title}
              />

              {/* Continuous Scroll Mode Next Chapter Stream Card */}
              {settings.readingMode === 'continuous' && hasNextChapter && (
                <div className="my-8 p-5 rounded-2xl border border-blue-500/30 bg-blue-500/5 text-center space-y-3 font-clean-sans animate-fade-in">
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                    <span>Continuous Reading Mode Active</span>
                  </div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">
                    Ready for Chapter {novel.chapters[chapterIndex + 1].chapterNumber}: {novel.chapters[chapterIndex + 1].title}?
                  </h4>
                  <button
                    onClick={goToNextChapter}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
                  >
                    Scroll Into Chapter {novel.chapters[chapterIndex + 1].chapterNumber} →
                  </button>
                </div>
              )}

              {/* Chapter Ending Separator */}
              <div className="pt-8 pb-6 text-center">
                <div className="inline-flex items-center gap-3 text-xs text-[var(--text-secondary)] opacity-50 uppercase tracking-widest">
                  <span>◆</span>
                  <span>◆</span>
                  <span>◆</span>
                </div>
              </div>
            </>
          )}

          {/* Chapter Completion & Navigation Footer */}
          <footer className="pt-4 border-t border-[var(--border-subtle)] space-y-6">
            
            {/* Status bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)]">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCompleteCurrent}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    completedChapterIds.includes(currentChapter.id)
                      ? 'bg-emerald-600 text-white'
                      : 'border border-[var(--border-subtle)] hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-primary)]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {completedChapterIds.includes(currentChapter.id)
                      ? 'Chapter Finished'
                      : 'Mark Chapter Finished'}
                  </span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  title="Share chapter link"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedNotification ? 'Link Copied!' : 'Share'}</span>
                </button>
              </div>

              <div className="text-xs text-[var(--text-secondary)] font-mono tabular-nums">
                Chapter {chapterIndex + 1} of {novel.chapters.length}
              </div>
            </div>

            {/* Prev / Next Chapter Buttons */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={goToPrevChapter}
                disabled={!hasPrevChapter}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--border-subtle)] text-xs sm:text-sm font-medium text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <div className="text-left">
                  <div className="text-[10px] text-[var(--text-secondary)] uppercase">Previous</div>
                  <div className="font-semibold hidden sm:block">
                    {hasPrevChapter ? `Ch. ${novel.chapters[chapterIndex - 1].chapterNumber}` : 'None'}
                  </div>
                </div>
              </button>

              <button
                onClick={() => setIsTocOpen(true)}
                className="px-3 py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline"
              >
                All Chapters
              </button>

              <button
                onClick={goToNextChapter}
                disabled={!hasNextChapter}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <div className="text-right">
                  <div className="text-[10px] text-blue-200 uppercase">Next</div>
                  <div className="font-semibold hidden sm:block">
                    {hasNextChapter ? `Ch. ${novel.chapters[chapterIndex + 1].chapterNumber}` : 'End of Novel'}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </footer>

        </article>
      </main>

      {/* 4. Table of Contents Drawer */}
      <ChapterTocDrawer
        isOpen={isTocOpen}
        onClose={() => setIsTocOpen(false)}
        novel={novel}
        activeChapterId={currentChapter.id}
        onSelectChapter={(id) => setCurrentChapterId(id)}
        completedChapterIds={completedChapterIds}
        unlockedBooks={unlockedBooks}
        dailyClaimedChapters={dailyClaimedChapters}
        founderNovels={founderNovels}
      />

      {/* 5. Reader Display Preferences Drawer */}
      <ReaderSettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={onUpdateSettings}
      />

      {/* 6. Floating Audio Narrator (Only if not locked) */}
      {isAudioOpen && !lockStatus.isLocked && (
        <AudioNarrator
          textToRead={currentChapter.content}
          chapterTitle={`Ch. ${currentChapter.chapterNumber}: ${currentChapter.title}`}
          rate={settings.speechRate}
          onRateChange={(rate) => onUpdateSettings({ speechRate: rate })}
          onClose={() => setIsAudioOpen(false)}
        />
      )}

      {/* 7. $2 VIP Book Pass Modal */}
      <VipUnlockModal
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
        novel={novel}
        onSuccess={() => {
          if (onUnlockBookPermanently) {
            onUnlockBookPermanently(novel.id);
          }
        }}
      />

      {/* 8. Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={`${novel.title} - Chapter ${currentChapter.chapterNumber}`}
        description={`Read Chapter ${currentChapter.chapterNumber} of ${novel.title} on NovelRealm!`}
      />

    </div>
  );
};
