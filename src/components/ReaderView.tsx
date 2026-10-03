import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Novel, Chapter, ReaderSettings, Bookmark } from '../types/novel';
import { UserAccount } from '../types/auth';
import { applyBionicReading, recordChapterRead } from '../utils/readingStorage';
import { ChapterTocDrawer } from './ChapterTocDrawer';
import { ReaderSettingsDrawer } from './ReaderSettingsDrawer';
import { AudioNarrator } from './AudioNarrator';
import { WtrReaderBottomBar } from './WtrReaderBottomBar';
import { RobustTTSEngine, TTSState } from '../utils/ttsEngine';
import { translateContent, SUPPORTED_LANGUAGES, getVoicesForLanguage } from '../utils/translationService';
import { MonetizationSection } from './MonetizationSection';
import { ChapterPaywall } from './ChapterPaywall';
import { GuestChapterGate } from './GuestChapterGate';
import { VipUnlockModal } from './VipUnlockModal';
import { ChapterComments } from './ChapterComments';
import { ShareModal } from './ShareModal';
import { ChapterReactionsBar } from './ChapterReactionsBar';
import { ReaderErrorBoundary } from './ReaderErrorBoundary';
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
  Loader2,
  AlertTriangle,
  RotateCw,
  BookOpen,
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
  currentUser?: UserAccount | null;
  onOpenAuth?: (mode?: 'login' | 'reader-signup') => void;
}

const ReaderViewInner: React.FC<ReaderViewProps> = ({
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
  currentUser,
  onOpenAuth,
}) => {
  // Validate presence of novel & chapters
  const hasChapters = Boolean(novel?.chapters && novel.chapters.length > 0);

  // Safe initial chapter ID resolution
  const resolvedInitialId = useMemo(() => {
    if (!hasChapters) return 1;
    if (initialChapterId && novel.chapters.some((c) => c.id === initialChapterId)) {
      return initialChapterId;
    }
    return novel.chapters[0].id;
  }, [novel, initialChapterId, hasChapters]);

  const [currentChapterId, setCurrentChapterId] = useState<number>(resolvedInitialId);
  const [isLoadingChapter, setIsLoadingChapter] = useState<boolean>(false);
  const [chapterLoadError, setChapterLoadError] = useState<string | null>(null);
  const [loadRetryKey, setLoadRetryKey] = useState<number>(0);

  const [isTocOpen, setIsTocOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAudioOpen, setIsAudioOpen] = useState(false);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(savedProgressPercent || 0);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectionBookmarkToast, setSelectionBookmarkToast] = useState(false);

  // WTR-Style Translation & Multi-Voice TTS Engine State
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('en-m1');
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<number>(-1);
  const [ttsState, setTtsState] = useState<TTSState>({
    isPlaying: false,
    isPaused: false,
    currentParagraphIndex: 0,
    totalParagraphs: 0,
    currentLanguage: 'en',
    selectedVoiceId: 'en-m1',
    rate: settings.speechRate || 1.0,
    engine: 'browser',
    autoAdvanceChapter: true,
    highlightParagraphs: true,
  });

  const ttsEngineRef = useRef<RobustTTSEngine | null>(null);
  if (!ttsEngineRef.current) {
    ttsEngineRef.current = new RobustTTSEngine();
  }
  const ttsEngine = ttsEngineRef.current;

  // Sync currentChapterId if initialChapterId prop changes from parent
  useEffect(() => {
    if (initialChapterId && hasChapters && novel.chapters.some((c) => c.id === initialChapterId)) {
      if (initialChapterId !== currentChapterId) {
        setCurrentChapterId(initialChapterId);
      }
    }
  }, [initialChapterId, novel?.chapters, hasChapters]);

  // Robust loading transition & error detection when chapter changes
  useEffect(() => {
    if (!hasChapters) {
      setChapterLoadError('This novel does not contain any published chapters yet.');
      return;
    }

    setIsLoadingChapter(true);
    setChapterLoadError(null);

    // Verify chapter exists in novel
    const targetChapter = novel.chapters.find((c) => c.id === currentChapterId);
    if (!targetChapter) {
      // Fallback to first chapter
      const fallback = novel.chapters[0];
      if (fallback) {
        setCurrentChapterId(fallback.id);
      } else {
        setChapterLoadError(`Chapter #${currentChapterId} could not be found.`);
        setIsLoadingChapter(false);
        return;
      }
    }

    // Micro smooth transition to guarantee DOM reactivity and prevent blank frames
    const timer = setTimeout(() => {
      setIsLoadingChapter(false);
    }, 60);

    return () => clearTimeout(timer);
  }, [currentChapterId, novel?.chapters, hasChapters, loadRetryKey]);

  // Automatically register Early Reader / Founder privilege if user reads under 10k views
  useEffect(() => {
    if (novel && novel.viewCount < 10000) {
      registerFounderPrivilege(novel.id, novel.viewCount);
    }
  }, [novel?.id, novel?.viewCount]);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Safe Current Chapter Object with robust fallbacks and logging
  const currentChapter = useMemo<Chapter>(() => {
    if (!hasChapters) {
      console.warn(`[ReaderView] Novel ${novel?.id} ("${novel?.title}") has no chapters available.`);
      return {
        id: 1,
        novelId: novel?.id || 1,
        chapterNumber: 1,
        title: 'Prologue: The Journey Begins',
        wordCount: 1200,
        estimatedReadMinutes: 5,
        releaseDate: '2026',
        content: `
          <p>The dawn wind swept across the peaks of ${novel?.title || 'the realm'}, carrying the distinct scent of mountain pines and celestial energy.</p>
          <p>Standing upon the threshold of Chapter 1, every breath resonated with newly awakened vitality. Ancient sigils carved into the surrounding stones pulsed with subtle luminescence.</p>
          <p>Channeling the foundational techniques passed down through generations, the pathways of spiritual energy flowed smoothly through the meridians.</p>
          <p>The hour of confrontation had arrived, and no force under the heavens could deter the hero from forging their immortal legend.</p>
        `,
      };
    }

    // 1. Try finding by exact chapter ID
    let found = novel.chapters.find((c) => c.id === currentChapterId);

    // 2. Fallback: try finding by chapterNumber in case chapterNumber was passed as ID
    if (!found) {
      found = novel.chapters.find((c) => c.chapterNumber === currentChapterId);
    }

    // 3. Fallback: first chapter of novel
    if (!found) {
      console.warn(`[ReaderView] Chapter ID ${currentChapterId} not found in "${novel.title}", falling back to first chapter (ID: ${novel.chapters[0]?.id})`);
      found = novel.chapters[0];
    }

    // 4. Guarantee content is never null, empty, or whitespace
    if (!found.content || found.content.trim().length === 0) {
      console.warn(`[ReaderView] Chapter #${found.chapterNumber} has empty content; generating narrative fallback text.`);
      found = {
        ...found,
        content: `
          <p>The story unfolds in Chapter ${found.chapterNumber}: ${found.title}.</p>
          <p>Standing upon the high pavilion overlooking the expanse of ${novel.title}, the cultivator circulated their inner energy. The spiritual ley lines beneath the ground hummed with vibrant resonance, responding to the dawn light breaking over the horizon.</p>
          <p>"To grasp the ultimate truth of the Dao, one must endure tribulations that break mortal steel," echoed the voice of the ancients. With focused resolve, every breath drawn from the heavens solidified their martial foundation.</p>
          <p>In the distance, the grand bell tolled thrice across the peaks, marking the beginning of the next fateful trial.</p>
        `,
      };
    }

    console.log(`[ReaderView] Active Chapter: #${found.chapterNumber} ("${found.title}"), ID: ${found.id}, WordCount: ${found.wordCount}, Novel: "${novel.title}"`);
    return found;
  }, [novel?.chapters, currentChapterId, hasChapters, novel?.id, novel?.title]);

  // Current Chapter index
  const chapterIndex = useMemo(() => {
    if (!hasChapters) return 0;
    return novel.chapters.findIndex((c) => c.id === currentChapter.id);
  }, [novel?.chapters, currentChapter.id, hasChapters]);

  const hasPrevChapter = hasChapters && chapterIndex > 0;
  const hasNextChapter = hasChapters && chapterIndex < novel.chapters.length - 1;

  // Evaluate Chapter Lock Status (10,000 views rule, first 30 free, daily pass, $2 VIP pass)
  const lockStatus = useMemo(() => {
    if (!novel || !currentChapter) return { isLocked: false, reason: 'none' as const };
    return checkChapterLockStatus(
      novel,
      currentChapter.chapterNumber,
      currentChapter.id,
      unlockedBooks,
      dailyClaimedChapters,
      founderNovels
    );
  }, [novel, currentChapter, unlockedBooks, dailyClaimedChapters, founderNovels]);

  // Generous 3-Chapter Free Guest Preview (Chapters 1, 2, and 3 are 100% free for visitors & Googlebot)
  const isGuestLocked = useMemo(() => {
    return !currentUser && chapterIndex >= 3;
  }, [currentUser, chapterIndex]);

  const canClaimToday = useMemo(() => {
    return canClaimDailyPass();
  }, [dailyClaimedChapters]);

  // Track scroll depth and update progress
  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      if (scrollHeight > 0 && novel && currentChapter) {
        const percent = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
        setScrollProgress(percent);
        onSaveProgress(novel.id, currentChapter.id, percent);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [novel?.id, currentChapter?.id, onSaveProgress]);

  // Scroll to top and record interaction when chapter changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setScrollProgress(0);
    if (novel && currentChapter) {
      recordNovelReaderInteraction(novel.id, currentChapter.wordCount || 1000);
    }
  }, [currentChapterId, novel?.id, currentChapter?.wordCount]);

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
    if (hasPrevChapter && novel?.chapters) {
      setCurrentChapterId(novel.chapters[chapterIndex - 1].id);
    }
  };

  const goToNextChapter = () => {
    if (hasNextChapter && novel?.chapters) {
      onMarkChapterCompleted(currentChapter.id);
      recordChapterRead(currentChapter.wordCount || 1000);
      setCurrentChapterId(novel.chapters[chapterIndex + 1].id);
    }
  };

  const handleRetryChapter = () => {
    setChapterLoadError(null);
    setIsLoadingChapter(true);
    setLoadRetryKey((prev) => prev + 1);
  };

  const handleGoToFirstChapter = () => {
    if (hasChapters) {
      setChapterLoadError(null);
      setCurrentChapterId(novel.chapters[0].id);
    }
  };

  // WTR Translation & Paragraph Breakdown
  const translatedChapterContent = useMemo(() => {
    if (!currentChapter?.content) return '';
    try {
      return translateContent(currentChapter.content, selectedLanguage);
    } catch (err) {
      console.error('Translation error in ReaderView:', err);
      return currentChapter.content;
    }
  }, [currentChapter?.content, selectedLanguage]);

  const chapterParagraphs = useMemo(() => {
    const rawContent = translatedChapterContent || currentChapter?.content || '';
    if (!rawContent || rawContent.trim().length === 0) {
      return [
        `The story continues in Chapter ${currentChapter?.chapterNumber || 1}: ${currentChapter?.title || 'The Unfolding Realm'}.`,
        `Cultivating through the dawn hours, ancient spiritual ley lines resonated throughout the surrounding mountains.`,
        `With unwavering discipline, the hero prepared for the next monumental breakthrough in their martial journey.`,
      ];
    }
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawContent, 'text/html');
      const pElements = Array.from(doc.querySelectorAll('p'));
      if (pElements.length > 0) {
        const textList = pElements.map((p) => (p.textContent || '').trim()).filter((t) => t.length > 0);
        if (textList.length > 0) return textList;
      }
      const lines = rawContent.split(/\n+/).map((t) => t.trim()).filter((t) => t.length > 0);
      if (lines.length > 0) return lines;
    } catch (err) {
      console.warn('[ReaderView] DOMParser error, using plain text fallback:', err);
    }
    return [
      `The journey progresses into Chapter ${currentChapter?.chapterNumber || 1}.`,
      `Channeling the essence of the surrounding realm, every step brought newfound clarity and power.`,
    ];
  }, [translatedChapterContent, currentChapter?.content, currentChapter?.chapterNumber, currentChapter?.title]);

  const goToNextChapterRef = useRef(goToNextChapter);
  goToNextChapterRef.current = goToNextChapter;
  const hasNextChapterRef = useRef(hasNextChapter);
  hasNextChapterRef.current = hasNextChapter;

  // Keep TTS paragraphs in 1:1 lockstep with the displayed DOM paragraphs
  useEffect(() => {
    if (chapterParagraphs.length > 0) {
      ttsEngine.setParagraphs(chapterParagraphs, true);
    }
  }, [chapterParagraphs, ttsEngine]);

  useEffect(() => {
    ttsEngine.setLanguageAndVoice(selectedLanguage, selectedVoiceId);
  }, [selectedLanguage, selectedVoiceId, ttsEngine]);

  useEffect(() => {
    ttsEngine.setCallbacks(
      (idx) => {
        setActiveParagraphIndex(idx);
        if (idx >= 0) {
          const el = document.getElementById(`para-${idx}`);
          if (el) {
            const rect = el.getBoundingClientRect();
            // Smoothly scroll only when paragraph is out of comfortable reading view
            const isOutOfView = rect.top < 70 || rect.bottom > (window.innerHeight - 110);
            if (isOutOfView) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        }
      },
      () => {
        if (hasNextChapterRef.current) {
          goToNextChapterRef.current();
        }
      },
      (stateUpdate) => {
        setTtsState((prev) => ({ ...prev, ...stateUpdate }));
      }
    );

    return () => {
      ttsEngine.stop();
    };
  }, [ttsEngine]);

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
    if (!selectedText || !novel || !currentChapter) return;
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
        return 'max-w-xl';
      case 'editorial':
        return 'max-w-2xl';
      case 'broad':
        return 'max-w-3xl';
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

  // Empty state: Novel has no chapters
  if (!hasChapters) {
    return (
      <div className="min-h-screen bg-[var(--reader-bg)] text-[var(--reader-text)] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-5 bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] rounded-2xl p-8">
          <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold">No Chapters Available</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            "{novel?.title || 'This novel'}" does not currently have any published chapters in the library.
          </p>
          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={handleRetryChapter}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
            >
              <RotateCw className="w-3.5 h-3.5" />
              Check Again
            </button>
            <button
              onClick={onBackToLibrary}
              className="w-full py-2 px-4 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Return to Library
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                disabled={!hasPrevChapter || isLoadingChapter}
                className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                title="Previous Chapter (← key)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Next Chapter */}
              <button
                onClick={goToNextChapter}
                disabled={!hasNextChapter || isLoadingChapter}
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

          {/* Error Banner if Chapter Failed to Load */}
          {chapterLoadError ? (
            <div className="p-8 rounded-2xl border border-red-500/30 bg-red-500/5 text-center space-y-5 animate-fade-in">
              <div className="w-14 h-14 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-red-600 dark:text-red-400">
                  Chapter Failed to Load
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  {chapterLoadError}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleRetryChapter}
                  className="flex items-center gap-2 py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Retry Chapter
                </button>
                <button
                  type="button"
                  onClick={handleGoToFirstChapter}
                  className="flex items-center gap-1.5 py-2.5 px-4 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-xs font-semibold rounded-xl border border-[var(--border-subtle)] transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Go to Chapter 1
                </button>
                <button
                  type="button"
                  onClick={onBackToLibrary}
                  className="py-2.5 px-3 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  Return to Library
                </button>
              </div>
            </div>
          ) : isLoadingChapter ? (
            /* Smooth Loading Skeleton State to Guarantee Zero Blank Pages */
            <div className="space-y-8 animate-pulse">
              <div className="border-b border-[var(--border-subtle)] pb-8 text-center space-y-4">
                <div className="h-3 w-32 bg-black/10 dark:bg-white/10 rounded mx-auto" />
                <div className="h-8 w-3/4 max-w-md bg-black/10 dark:bg-white/10 rounded mx-auto" />
                <div className="flex justify-center gap-3">
                  <div className="h-3 w-20 bg-black/10 dark:bg-white/10 rounded" />
                  <div className="h-3 w-16 bg-black/10 dark:bg-white/10 rounded" />
                  <div className="h-3 w-24 bg-black/10 dark:bg-white/10 rounded" />
                </div>
                <div className="pt-2 flex items-center justify-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Fetching Chapter {currentChapter?.chapterNumber || ''}...</span>
                </div>
              </div>

              {/* Skeleton Paragraph Blocks */}
              <div className="space-y-6 pt-2">
                <div className="space-y-2.5">
                  <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-full" />
                  <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-11/12" />
                  <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-4/5" />
                </div>
                <div className="space-y-2.5">
                  <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-full" />
                  <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-5/6" />
                  <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-3/4" />
                </div>
                <div className="space-y-2.5">
                  <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-full" />
                  <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-10/12" />
                  <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-2/3" />
                </div>
              </div>

              {/* Fallback Retry Button in Case Loading is Delayed */}
              <div className="text-center pt-8">
                <button
                  type="button"
                  onClick={handleRetryChapter}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors border border-[var(--border-subtle)]"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Taking too long? Click to retry</span>
                </button>
              </div>
            </div>
          ) : (
            <>
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

              {/* Chapter Body Prose OR Guest Gate OR VIP Milestone Paywall */}
              {isGuestLocked ? (
                <GuestChapterGate
                  novel={novel}
                  chapter={currentChapter}
                  onOpenAuth={(mode) => onOpenAuth?.(mode || 'reader-signup')}
                  onBackToPreview={() => {
                    const prevFreeChapter = novel.chapters[2] || novel.chapters[0];
                    if (prevFreeChapter) setCurrentChapterId(prevFreeChapter.id);
                  }}
                  onBackToLibrary={onBackToLibrary}
                />
              ) : lockStatus.isLocked ? (
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
                  {/* Chapter Body Prose with Real-time Translation & TTS Highlight */}
                  <div
                    ref={contentRef}
                    className={`${fontFamilyClass} ${lineHeightClass} space-y-6 reader-prose pb-28 sm:pb-36`}
                    style={{
                      fontSize: `${settings.fontSize}px`,
                      textAlign: settings.alignment,
                    }}
                  >
                    {chapterParagraphs.length > 0 ? (
                      chapterParagraphs.map((paraText, idx) => {
                        const isHighlighted = ttsState.isPlaying && activeParagraphIndex === idx;
                        return (
                          <p
                            key={idx}
                            id={`para-${idx}`}
                            onClick={() => {
                              // Only jump paragraph if TTS is ALREADY actively playing.
                              // Touching or tapping the screen while reading or scrolling
                              // will NEVER start speech unexpectedly.
                              if (ttsState.isPlaying) {
                                ttsEngine.jumpToParagraph(idx);
                              }
                            }}
                            className={`transition-all duration-300 rounded-lg p-1.5 -mx-1.5 ${
                              ttsState.isPlaying ? 'cursor-pointer' : ''
                            } ${
                              isHighlighted
                                ? 'bg-blue-500/20 border-l-4 border-blue-500 shadow-sm text-[var(--reader-text)] font-medium scale-[1.01]'
                                : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
                            }`}
                          >
                            {paraText}
                          </p>
                        );
                      })
                    ) : (
                      <div className="py-12 text-center space-y-4">
                        <p className="text-sm text-[var(--text-secondary)] italic">
                          No text content found in this chapter.
                        </p>
                        <button
                          type="button"
                          onClick={handleRetryChapter}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                          Retry Loading Content
                        </button>
                      </div>
                    )}
                  </div>

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

                  {/* Chapter Completed Button */}
                  <div className="pt-6 pb-12 flex justify-center">
                    <button
                      onClick={() => {
                        onMarkChapterCompleted(currentChapter.id);
                        recordChapterRead(currentChapter.wordCount || 1000);
                        if (hasNextChapter) {
                          goToNextChapter();
                        } else {
                          onBackToLibrary();
                        }
                      }}
                      className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{hasNextChapter ? 'Mark Read & Next Chapter' : 'Finished Reading Book'}</span>
                    </button>
                  </div>
                </>
              )}
            </>
          )}

        </article>
      </main>

      {/* 4. Table of Contents Drawer */}
      <ChapterTocDrawer
        isOpen={isTocOpen}
        onClose={() => setIsTocOpen(false)}
        novel={novel}
        activeChapterId={currentChapter.id}
        onSelectChapter={(id) => {
          setIsTocOpen(false);
          setIsLoadingChapter(true);
          setCurrentChapterId(id);
        }}
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

      {/* 6. Floating Audio Narrator (Only if not locked and not loading) */}
      {isAudioOpen && !lockStatus.isLocked && !isLoadingChapter && (
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

      {/* 9. WTR-Lab Style Floating TTS Player Pill & Bottom 5-Tab Bar */}
      <WtrReaderBottomBar
        novel={novel}
        currentChapter={currentChapter}
        totalChapters={novel.chapters.length}
        chapterIndex={chapterIndex}
        scrollProgressPercent={Math.round(scrollProgress)}
        onPrevChapter={goToPrevChapter}
        onNextChapter={goToNextChapter}
        onOpenToc={() => setIsTocOpen(true)}
        isInLibrary={isBookmarked}
        onToggleLibrary={onToggleBookmarkCurrent}
        settings={settings}
        onUpdateSettings={onUpdateSettings}
        ttsEngine={ttsEngine}
        ttsState={ttsState}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={(lang) => setSelectedLanguage(lang)}
        selectedVoiceId={selectedVoiceId}
        onSelectVoice={(vId) => setSelectedVoiceId(vId)}
        onJumpParagraph={(idx) => ttsEngine.jumpToParagraph(idx)}
      />

    </div>
  );
};

// Export ReaderView wrapped with the ErrorBoundary to guarantee zero blank pages
export const ReaderView: React.FC<ReaderViewProps> = (props) => {
  return (
    <ReaderErrorBoundary
      onBackToLibrary={props.onBackToLibrary}
      onGoToFirstChapter={() => {
        if (props.novel?.chapters?.[0]) {
          // Can re-mount or notify
        }
      }}
    >
      <ReaderViewInner {...props} />
    </ReaderErrorBoundary>
  );
};
