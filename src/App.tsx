/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Novel, ReaderSettings, Bookmark, ReadingProgress, ReaderTheme } from './types/novel';
import { INITIAL_NOVELS } from './data/novelsData';
import { getNovelsFromFirestore, saveUserCloudBookmark } from './services/novelDbService';
import {
  getSavedSettings,
  saveSettings,
  getAllProgress,
  saveProgress,
  getBookmarks,
  saveBookmarks,
  getFavorites,
  toggleFavorite as toggleFavStorage,
  getCustomNovels,
  saveCustomNovel as saveCustomStorage,
  getReadingStats,
  getUnlockedBooks,
  unlockBookPermanently,
  getDailyPassData,
  claimDailyPassForChapter,
  getFounderPrivilegeNovels,
} from './utils/readingStorage';

import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LibraryView } from './components/LibraryView';
import { ReaderView } from './components/ReaderView';
import { GenresView } from './components/GenresView';
import { AddNovelModal } from './components/AddNovelModal';
import { BookmarksModal } from './components/BookmarksModal';
import { StatsModal } from './components/StatsModal';
import { NovelDetailModal } from './components/NovelDetailModal';
import { AboutPolicyModal } from './components/AboutPolicyModal';
import { PowerVoteModal } from './components/PowerVoteModal';
import { AuthorEarningsModal } from './components/AuthorEarningsModal';
import { AuthModal } from './components/AuthModal';
import { WriterCertificationExamModal } from './components/WriterCertificationExamModal';
import { LiveTrafficModal } from './components/LiveTrafficModal';
import { RealmAssistantBot } from './components/RealmAssistantBot';
import { startLiveTrafficMonitoring, updateReaderCurrentNovel, LiveTrafficData } from './services/liveTrafficService';
import { recordWebsiteVisit } from './utils/communityStorage';
import { recordRealReaderInteraction } from './utils/authorEarningsStorage';
import { getCurrentUser, logoutUser } from './utils/userAuthStorage';
import { UserAccount } from './types/auth';
import { checkIsOwner } from './utils/ownerAuth';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<'library' | 'genres' | 'reader'>('library');
  const [activeNovelId, setActiveNovelId] = useState<number | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<number | undefined>(undefined);

  // Authentication & Writer Exam State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getCurrentUser());
  const isOwnerSession = useMemo(() => checkIsOwner(currentUser), [currentUser]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'reader-signup' | 'writer-signup'>('login');
  const [isWriterExamOpen, setIsWriterExamOpen] = useState(false);
  const [isGuestBannerDismissed, setIsGuestBannerDismissed] = useState(false);

  // Modals state
  const [isAddNovelOpen, setIsAddNovelOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isPowerVotesOpen, setIsPowerVotesOpen] = useState(false);
  const [isAuthorStudioOpen, setIsAuthorStudioOpen] = useState(false);
  const [authorStudioNovelId, setAuthorStudioNovelId] = useState<number | undefined>(undefined);
  const [selectedNovelForDetail, setSelectedNovelForDetail] = useState<Novel | null>(null);
  const [policyModalType, setPolicyModalType] = useState<'about' | 'privacy' | 'monetization' | null>(null);
  const [isLiveTrafficOpen, setIsLiveTrafficOpen] = useState(false);
  const [liveTraffic, setLiveTraffic] = useState<LiveTrafficData>({
    totalActiveReaders: 1,
    mobileCount: 1,
    desktopCount: 0,
    topReadingNovels: [],
    lastUpdated: Date.now(),
  });

  // Persistent User State
  const [settings, setSettings] = useState<ReaderSettings>(() => getSavedSettings());
  const [progressMap, setProgressMap] = useState<Record<number, ReadingProgress>>(() =>
    getAllProgress()
  );
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => getBookmarks());
  const [favorites, setFavorites] = useState<number[]>(() => getFavorites());
  const [customNovels, setCustomNovels] = useState<Novel[]>(() => getCustomNovels());
  const [cloudNovels, setCloudNovels] = useState<Novel[]>(INITIAL_NOVELS);
  const [stats, setStats] = useState(() => getReadingStats());
  const [unlockedBooks, setUnlockedBooks] = useState<number[]>(() => getUnlockedBooks());
  const [dailyClaimedChapters, setDailyClaimedChapters] = useState<number[]>(() => getDailyPassData().claimedChapters);
  const [founderNovels, setFounderNovels] = useState<number[]>(() => getFounderPrivilegeNovels());

  // Load latest novels and chapters from Cloud Database (Firestore)
  useEffect(() => {
    getNovelsFromFirestore().then((novels) => {
      if (novels && novels.length > 0) {
        setCloudNovels(novels);
      }
    }).catch((err) => console.warn('Cloud database sync:', err));
  }, []);

  // Real-time genuine live reader tracking via Google Firebase
  useEffect(() => {
    const unsubscribe = startLiveTrafficMonitoring((data) => {
      setLiveTraffic(data);
    });
    return () => unsubscribe();
  }, []);

  const handleUnlockBookPermanently = (novelId: number) => {
    unlockBookPermanently(novelId);
    setUnlockedBooks(getUnlockedBooks());
  };

  const handleClaimDailyPass = (chapterId: number) => {
    claimDailyPassForChapter(chapterId);
    setDailyClaimedChapters([...getDailyPassData().claimedChapters]);
  };

  // Combined Catalog (Cloud Firestore Novels + User Custom Novels)
  const allNovels = useMemo(() => {
    return [...customNovels, ...cloudNovels];
  }, [customNovels, cloudNovels]);

  // Active Novel object when reading
  const activeNovel = useMemo(() => {
    if (!activeNovelId) return null;
    return allNovels.find((n) => n.id === activeNovelId) || null;
  }, [allNovels, activeNovelId]);

  // Update current novel reading context in Firestore presence
  useEffect(() => {
    if (currentView === 'reader' && activeNovel) {
      updateReaderCurrentNovel(activeNovel.id, activeChapterId, activeNovel.title);
    } else {
      updateReaderCurrentNovel(undefined, undefined, 'Browsing Library');
    }
  }, [currentView, activeNovel, activeChapterId]);

  // Synchronize theme to document body attribute for Tailwind / CSS variables
  useEffect(() => {
    document.body.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  // Record initial visit / traffic session
  useEffect(() => {
    recordWebsiteVisit();
  }, []);

  // Update Settings handler
  const handleUpdateSettings = (newSettings: Partial<ReaderSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveSettings(updated);
      return updated;
    });
  };

  // Cycle themes (Light -> Sepia -> Dark -> Midnight -> Sage -> Light)
  const handleThemeCycle = () => {
    const sequence: ReaderTheme[] = ['light', 'sepia', 'dark', 'midnight', 'sage'];
    const nextIdx = (sequence.indexOf(settings.theme) + 1) % sequence.length;
    handleUpdateSettings({ theme: sequence[nextIdx] });
  };

  // Select Novel to Open or View Details
  const handleSelectNovel = (novelId: number, chapterId?: number) => {
    const novel = allNovels.find((n) => n.id === novelId);
    if (!novel) return;

    if (chapterId) {
      // Direct jump to reading that chapter
      const targetNovel = allNovels.find((n) => n.id === novelId);
      const targetChapter = targetNovel?.chapters.find((c) => c.id === chapterId);
      recordRealReaderInteraction(novelId, chapterId, targetChapter?.wordCount || 1500);

      setActiveNovelId(novelId);
      setActiveChapterId(chapterId);
      setCurrentView('reader');
    } else {
      // If user clicked card without specifying chapter, open detail modal
      setSelectedNovelForDetail(novel);
    }
  };

  // Direct start reading from detail modal or marquee
  const handleStartReading = (novelId: number, chapterId: number) => {
    const targetNovel = allNovels.find((n) => n.id === novelId);
    const targetChapter = targetNovel?.chapters.find((c) => c.id === chapterId);
    recordRealReaderInteraction(novelId, chapterId, targetChapter?.wordCount || 1500);

    setActiveNovelId(novelId);
    setActiveChapterId(chapterId);
    setCurrentView('reader');
  };

  // Reading Progress Save
  const handleSaveProgress = (novelId: number, chapterId: number, percent: number) => {
    const prev = progressMap[novelId];
    const completedChapters = prev?.completedChapters || [];

    const updatedProgress: ReadingProgress = {
      novelId,
      chapterId,
      scrollPercent: percent,
      lastReadTimestamp: Date.now(),
      completedChapters,
    };

    saveProgress(updatedProgress);
    if (currentUser?.id) {
      saveUserCloudBookmark(currentUser.id, novelId, chapterId);
    }
    setProgressMap((curr) => ({
      ...curr,
      [novelId]: updatedProgress,
    }));
  };

  // Mark Chapter Completed
  const handleMarkChapterCompleted = (chapterId: number) => {
    if (!activeNovelId) return;
    const prev = progressMap[activeNovelId];
    const completedChapters = prev?.completedChapters || [];
    if (!completedChapters.includes(chapterId)) {
      const updatedCompleted = [...completedChapters, chapterId];
      const updatedProgress: ReadingProgress = {
        novelId: activeNovelId,
        chapterId: prev?.chapterId || chapterId,
        scrollPercent: prev?.scrollPercent || 100,
        lastReadTimestamp: Date.now(),
        completedChapters: updatedCompleted,
      };
      saveProgress(updatedProgress);
      setProgressMap((curr) => ({
        ...curr,
        [activeNovelId]: updatedProgress,
      }));
      setStats(getReadingStats());
    }
  };

  // Favorites Toggle
  const handleToggleFavorite = (e: React.MouseEvent, novelId: number) => {
    e.stopPropagation();
    const isNowFav = toggleFavStorage(novelId);
    setFavorites((prev) =>
      isNowFav ? [...prev, novelId] : prev.filter((id) => id !== novelId)
    );
  };

  // Add Bookmark
  const handleAddBookmark = (newBm: Omit<Bookmark, 'id' | 'timestamp'>) => {
    const fullBookmark: Bookmark = {
      ...newBm,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
    };
    const updated = [fullBookmark, ...bookmarks];
    setBookmarks(updated);
    saveBookmarks(updated);
  };

  // Delete Bookmark
  const handleDeleteBookmark = (bmId: string) => {
    const updated = bookmarks.filter((b) => b.id !== bmId);
    setBookmarks(updated);
    saveBookmarks(updated);
  };

  // Force Update & Purge App Cache
  const handleForceUpdateApp = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.unregister();
        }
      }
      if ('caches' in window) {
        const keys = await caches.keys();
        for (const key of keys) {
          await caches.delete(key);
        }
      }
    } catch {
      // ignore
    }
    window.location.reload();
  };

  // Toggle Bookmark for Current Chapter
  const isCurrentChapterBookmarked = useMemo(() => {
    if (!activeNovelId || !activeChapterId) return false;
    return bookmarks.some(
      (b) => b.novelId === activeNovelId && b.chapterId === activeChapterId && !b.snippet
    );
  }, [bookmarks, activeNovelId, activeChapterId]);

  const handleToggleBookmarkCurrent = () => {
    if (!activeNovel || !activeChapterId) return;
    const currentChapter =
      activeNovel.chapters.find((c) => c.id === activeChapterId) || activeNovel.chapters[0];

    if (isCurrentChapterBookmarked) {
      // Remove chapter bookmark
      const updated = bookmarks.filter(
        (b) => !(b.novelId === activeNovel.id && b.chapterId === activeChapterId && !b.snippet)
      );
      setBookmarks(updated);
      saveBookmarks(updated);
    } else {
      // Add chapter bookmark
      handleAddBookmark({
        novelId: activeNovel.id,
        novelTitle: activeNovel.title,
        chapterId: currentChapter.id,
        chapterTitle: `Chapter ${currentChapter.chapterNumber}: ${currentChapter.title}`,
        snippet: '',
      });
    }
  };

  // Add Custom Novel
  const handleAddNovel = (newNovel: Novel) => {
    saveCustomStorage(newNovel);
    setCustomNovels((prev) => [newNovel, ...prev]);
    // Immediately open in reader
    setActiveNovelId(newNovel.id);
    setActiveChapterId(newNovel.chapters[0]?.id);
    setCurrentView('reader');
  };

  return (
    <div className={`min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] font-clean-sans transition-colors duration-200 overflow-x-hidden w-full max-w-full ${currentView !== 'reader' ? 'pb-16 md:pb-0' : ''}`}>
      
      {/* Navigation Top Bar (hidden only in reader mode to give reader full control) */}
      {currentView !== 'reader' && (
        <Navbar
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          onOpenBookmarks={() => setIsBookmarksOpen(true)}
          onOpenStats={() => {
            setStats(getReadingStats());
            setIsStatsOpen(true);
          }}
          onOpenAddNovel={() => {
            if (!currentUser) {
              setAuthModalMode('writer-signup');
              setIsAuthModalOpen(true);
              return;
            }
            if (currentUser.role === 'writer' && !currentUser.isCertifiedWriter) {
              setIsWriterExamOpen(true);
              return;
            }
            setIsAddNovelOpen(true);
          }}
          onOpenPowerVotes={() => setIsPowerVotesOpen(true)}
          onOpenAuthorStudio={() => {
            if (!currentUser) {
              setAuthModalMode('writer-signup');
              setIsAuthModalOpen(true);
              return;
            }
            setAuthorStudioNovelId(undefined);
            setIsAuthorStudioOpen(true);
          }}
          isOwner={isOwnerSession}
          onOpenLiveTraffic={isOwnerSession ? () => setIsLiveTrafficOpen(true) : undefined}
          liveReadersCount={liveTraffic.totalActiveReaders}
          theme={settings.theme}
          onThemeCycle={handleThemeCycle}
          activeReadingNovelTitle={activeNovel?.title}
          onReturnToReader={() => setCurrentView('reader')}
          currentUser={currentUser}
          onOpenAuth={(mode) => {
            setAuthModalMode(mode || 'login');
            setIsAuthModalOpen(true);
          }}
          onLogout={() => {
            logoutUser();
            setCurrentUser(null);
          }}
          onOpenWriterExam={() => setIsWriterExamOpen(true)}
        />
      )}

      {/* Guest Preview Notification Banner (Dismissible, allows full browsing & Chapter 1-3 reading) */}
      {!currentUser && !isGuestBannerDismissed && currentView !== 'reader' && (
        <aside aria-label="Guest reading preview notice" className="bg-gradient-to-r from-blue-900/90 via-indigo-900/90 to-blue-950/90 text-white text-xs px-4 py-2 border-b border-blue-500/30 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-4xl mx-auto flex-wrap justify-center">
            <span className="text-amber-400 font-bold flex items-center gap-1">
              ✨ <span>Guest Preview:</span>
            </span>
            <span>Enjoy free reading of Chapters 1–3 across all web novels in our library!</span>
            <button
              onClick={() => {
                setAuthModalMode('reader-signup');
                setIsAuthModalOpen(true);
              }}
              className="font-bold underline text-amber-300 hover:text-white ml-1 transition-colors"
            >
              Sign Up Free
            </button>
          </div>
          <button
            onClick={() => setIsGuestBannerDismissed(true)}
            className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors ml-2"
            title="Dismiss notice"
            aria-label="Dismiss notice"
          >
            ✕
          </button>
        </aside>
      )}

      {/* Main Content Area */}
      {currentView === 'library' && (
        <LibraryView
          novels={allNovels}
          onSelectNovel={handleSelectNovel}
          readingProgress={progressMap}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onOpenAddNovel={() => setIsAddNovelOpen(true)}
          onOpenPowerVotes={() => setIsPowerVotesOpen(true)}
        />
      )}

      {currentView === 'genres' && (
        <GenresView
          novels={allNovels}
          onSelectNovel={handleSelectNovel}
          readingProgress={progressMap}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {currentView === 'reader' && activeNovel && (
        <ReaderView
          novel={activeNovel}
          initialChapterId={activeChapterId}
          onBackToLibrary={() => setCurrentView('library')}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onSaveProgress={handleSaveProgress}
          savedProgressPercent={progressMap[activeNovel.id]?.scrollPercent}
          onAddBookmark={handleAddBookmark}
          isBookmarked={isCurrentChapterBookmarked}
          onToggleBookmarkCurrent={handleToggleBookmarkCurrent}
          completedChapterIds={progressMap[activeNovel.id]?.completedChapters || []}
          onMarkChapterCompleted={handleMarkChapterCompleted}
          unlockedBooks={unlockedBooks}
          dailyClaimedChapters={dailyClaimedChapters}
          founderNovels={founderNovels}
          onUnlockBookPermanently={handleUnlockBookPermanently}
          onClaimDailyPass={handleClaimDailyPass}
          currentUser={currentUser}
          onOpenAuth={(mode) => {
            setAuthModalMode(mode || 'login');
            setIsAuthModalOpen(true);
          }}
        />
      )}

      {/* Official Bottom Navigation Bar for Mobile (Home, Genres, Bookmarks, Votes, Account) */}
      <MobileBottomNav
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenPowerVotes={() => setIsPowerVotesOpen(true)}
        onOpenAuthorStudio={() => {
          setAuthorStudioNovelId(undefined);
          setIsAuthorStudioOpen(true);
        }}
        currentUser={currentUser}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode || 'login');
          setIsAuthModalOpen(true);
        }}
      />

      {/* Modals */}
      <AddNovelModal
        isOpen={isAddNovelOpen}
        onClose={() => setIsAddNovelOpen(false)}
        onAddNovel={handleAddNovel}
        currentUser={currentUser}
      />

      <BookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onSelectBookmark={(novelId, chapterId) => {
          setActiveNovelId(novelId);
          setActiveChapterId(chapterId);
          setCurrentView('reader');
        }}
        onDeleteBookmark={handleDeleteBookmark}
      />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        totalNovelsCount={allNovels.length}
        inProgressCount={Object.keys(progressMap).length}
      />

      <NovelDetailModal
        novel={selectedNovelForDetail}
        onClose={() => setSelectedNovelForDetail(null)}
        onStartReading={handleStartReading}
        progress={selectedNovelForDetail ? progressMap[selectedNovelForDetail.id] : undefined}
        isFavorite={selectedNovelForDetail ? favorites.includes(selectedNovelForDetail.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onOpenAuthorStudio={(novelId) => {
          setAuthorStudioNovelId(novelId);
          setIsAuthorStudioOpen(true);
        }}
      />

      {/* About & Policies Modal for AdSense & Trust */}
      {policyModalType && (
        <AboutPolicyModal
          isOpen={true}
          onClose={() => setPolicyModalType(null)}
          type={policyModalType}
        />
      )}

      {/* Power Stones & Community Leaderboard Modal */}
      <PowerVoteModal
        isOpen={isPowerVotesOpen}
        onClose={() => setIsPowerVotesOpen(false)}
        novels={allNovels}
        onSelectNovel={handleSelectNovel}
      />

      {/* Writer & Owner Revenue Studio Modal */}
      <AuthorEarningsModal
        isOpen={isAuthorStudioOpen}
        onClose={() => setIsAuthorStudioOpen(false)}
        novels={allNovels}
        currentNovelId={authorStudioNovelId}
        currentUser={currentUser}
        onOpenCertificationExam={() => {
          setIsAuthorStudioOpen(false);
          setIsWriterExamOpen(true);
        }}
      />

      {/* Universal Login & Sign Up Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authModalMode}
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
        onOpenWriterExam={() => setIsWriterExamOpen(true)}
      />

      {/* 1500-Word Writer Certification Exam Modal */}
      {currentUser && (
        <WriterCertificationExamModal
          isOpen={isWriterExamOpen}
          onClose={() => setIsWriterExamOpen(false)}
          currentUser={currentUser}
          onCertificationComplete={(updatedUser) => {
            setCurrentUser(updatedUser);
            setIsAuthorStudioOpen(true);
          }}
        />
      )}

      {/* Genuine Real-Time Platform Traffic Modal (Restricted to Owner) */}
      <LiveTrafficModal
        isOpen={isLiveTrafficOpen}
        onClose={() => setIsLiveTrafficOpen(false)}
        trafficData={liveTraffic}
        currentUser={currentUser}
      />

      {/* AI Reading & Platform Concierge Assistant */}
      <RealmAssistantBot
        currentView={currentView}
        novels={allNovels}
        isOwner={isOwnerSession}
        onOpenWriterStudio={() => {
          setAuthorStudioNovelId(undefined);
          setIsAuthorStudioOpen(true);
        }}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenLiveTraffic={isOwnerSession ? () => setIsLiveTrafficOpen(true) : () => {}}
        onOpenMonetization={() => setPolicyModalType('monetization')}
        onSwitchTheme={(theme) => handleUpdateSettings({ theme })}
        onSelectNovel={(novel) => handleSelectNovel(novel.id)}
      />

      {/* Footer (only on Library and Genres views) */}
      {currentView !== 'reader' && (
        <footer className="mt-20 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] py-8 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--text-secondary)]">
            <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
              <span className="font-display-title font-semibold text-[var(--text-primary)]">NovelRealm</span>
              <span>— Serialized Web Fiction Platform</span>
              <span className="hidden sm:inline" aria-hidden="true">·</span>
              <span className="text-[10px] text-[var(--text-secondary)] opacity-75">
                © {new Date().getFullYear()} NovelRealm. All rights reserved.
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setPolicyModalType('about')}
                className="hover:text-[var(--text-primary)] underline transition-colors"
              >
                About Us
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => setPolicyModalType('privacy')}
                className="hover:text-[var(--text-primary)] underline transition-colors"
              >
                Privacy & Cookies
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => setPolicyModalType('monetization')}
                className="hover:text-[var(--text-primary)] underline transition-colors"
              >
                Monetization Policy
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => {
                  setAuthorStudioNovelId(undefined);
                  setIsAuthorStudioOpen(true);
                }}
                className="hover:text-emerald-500 font-medium transition-colors"
              >
                Writer & Owner Studio
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={handleForceUpdateApp}
                title="Purges offline device cache and reloads the latest 81 novels and features"
                className="inline-flex items-center gap-1 hover:text-amber-500 font-medium transition-colors"
              >
                <span>🔄 Sync & Update App</span>
              </button>
              {isOwnerSession && (
                <>
                  <span aria-hidden="true">·</span>
                  <button
                    onClick={() => setIsLiveTrafficOpen(true)}
                    className="inline-flex items-center gap-1 text-emerald-500 hover:text-emerald-400 font-semibold transition-colors"
                    title="Live Platform Traffic Radar (Confidential Founder Only)"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Founder Radar</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </footer>
      )}

    </div>
  );
}
