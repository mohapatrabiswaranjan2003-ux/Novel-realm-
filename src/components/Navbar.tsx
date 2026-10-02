import React, { useState, useEffect } from 'react';
import { BookOpen, Bookmark, BarChart3, Plus, Moon, Sun, Coffee, Zap, Download, Wallet, User, LogOut, Award, Sparkles, Feather, Menu, X, Compass } from 'lucide-react';
import { ReaderTheme } from '../types/novel';
import { InstallModal } from './InstallModal';
import { UserAccount } from '../types/auth';

interface NavbarProps {
  currentView: 'library' | 'reader' | 'genres';
  onNavigate: (view: 'library' | 'genres') => void;
  onOpenBookmarks: () => void;
  onOpenStats: () => void;
  onOpenAddNovel: () => void;
  onOpenPowerVotes?: () => void;
  onOpenAuthorStudio?: () => void;
  onOpenLiveTraffic?: () => void;
  liveReadersCount?: number;
  theme: ReaderTheme;
  onThemeCycle: () => void;
  activeReadingNovelTitle?: string;
  onReturnToReader?: () => void;
  currentUser?: UserAccount | null;
  isOwner?: boolean;
  onOpenAuth?: (mode?: 'login' | 'reader-signup' | 'writer-signup') => void;
  onLogout?: () => void;
  onOpenWriterExam?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenBookmarks,
  onOpenStats,
  onOpenAddNovel,
  onOpenPowerVotes,
  onOpenAuthorStudio,
  onOpenLiveTraffic,
  liveReadersCount,
  theme,
  onThemeCycle,
  activeReadingNovelTitle,
  onReturnToReader,
  currentUser,
  isOwner = false,
  onOpenAuth,
  onLogout,
  onOpenWriterExam,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallPwa = () => {
    setIsInstallModalOpen(true);
  };

  const handleWriteStoryClick = () => {
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth('writer-signup');
      return;
    }
    if (currentUser.role === 'reader') {
      if (onOpenAuth) onOpenAuth('writer-signup');
      return;
    }
    if (currentUser.role === 'writer' && !currentUser.isCertifiedWriter) {
      if (onOpenWriterExam) onOpenWriterExam();
      return;
    }
    onOpenAddNovel();
  };
  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors duration-200 bg-[var(--bg-surface)]/95 border-[var(--border-subtle)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('library')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md p-1"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm group-hover:scale-105 transition-transform border border-blue-500/30">
              <img src="/app-icon.jpg" alt="NovelRealm Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-display-title text-xl font-bold tracking-tight text-[var(--text-primary)]">
              NovelRealm
            </span>
          </button>

          {activeReadingNovelTitle && currentView !== 'reader' && (
            <button
              onClick={onReturnToReader}
              className="hidden lg:flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline ml-2 max-w-[200px] truncate"
              title={`Resume reading ${activeReadingNovelTitle}`}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="truncate">Resume: {activeReadingNovelTitle}</span>
            </button>
          )}
        </div>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--text-secondary)]">
          <button
            onClick={() => onNavigate('library')}
            className={`transition-colors hover:text-[var(--text-primary)] focus-visible:outline-none ${
              currentView === 'library' ? 'text-[var(--text-primary)] font-semibold' : ''
            }`}
          >
            Library
          </button>
          <button
            onClick={() => onNavigate('genres')}
            className={`transition-colors hover:text-[var(--text-primary)] focus-visible:outline-none ${
              currentView === 'genres' ? 'text-[var(--text-primary)] font-semibold' : ''
            }`}
          >
            Browse Genres
          </button>
          <button
            onClick={onOpenBookmarks}
            className="flex items-center gap-1.5 transition-colors hover:text-[var(--text-primary)] focus-visible:outline-none"
          >
            <Bookmark className="w-4 h-4" />
            <span>Bookmarks</span>
          </button>
          <button
            onClick={onOpenStats}
            className="flex items-center gap-1.5 transition-colors hover:text-[var(--text-primary)] focus-visible:outline-none"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Monthly Visitors & Stats</span>
          </button>
          {onOpenPowerVotes && (
            <button
              onClick={onOpenPowerVotes}
              className="flex items-center gap-1.5 text-amber-500 hover:text-amber-600 dark:hover:text-amber-400 font-semibold transition-colors focus-visible:outline-none"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Power Stones</span>
            </button>
          )}
          {onOpenAuthorStudio && (
            <button
              onClick={onOpenAuthorStudio}
              className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold transition-colors focus-visible:outline-none"
            >
              <Wallet className="w-4 h-4" />
              <span>Writer Studio</span>
            </button>
          )}

          {/* Real-time Genuine Live Traffic Indicator (Desktop - Owner Only) */}
          {isOwner && onOpenLiveTraffic && (
            <button
              onClick={onOpenLiveTraffic}
              title="Verified Genuine Live Traffic via Google Firebase (Founder Only)"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/20 transition-all shadow-2xs"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono tabular-nums font-bold">{liveReadersCount ?? 1}</span>
              <span>Live Readers (Founder)</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Desktop Shortcuts */}
          <div className="hidden md:flex items-center gap-2">
            {onOpenAuthorStudio && (
              <button
                onClick={onOpenAuthorStudio}
                title="Writer Studio & Earnings"
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg text-emerald-600 hover:bg-emerald-500/10 font-semibold transition-colors"
              >
                <Wallet className="w-4 h-4" />
                <span>Studio</span>
              </button>
            )}

            {onOpenPowerVotes && (
              <button
                onClick={onOpenPowerVotes}
                title="Daily Power Stones"
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg text-amber-500 hover:bg-amber-500/10 font-semibold transition-colors"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Power Stones</span>
              </button>
            )}

            <button
              onClick={onOpenStats}
              title="Monthly Visitors & Stats"
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>

          {/* PWA Install Button (Available on both desktop & mobile) */}
          <button
            onClick={handleInstallPwa}
            title="Install NovelRealm App"
            className="p-1.5 sm:p-2 rounded-lg text-[var(--text-secondary)] hover:text-blue-600 hover:bg-blue-500/10 transition-colors"
            aria-label="Install App"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Theme Toggle (Available on both desktop & mobile) */}
          <button
            onClick={onThemeCycle}
            title={`Switch theme (Current: ${theme})`}
            className="p-1.5 sm:p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Sun className="w-4 h-4" />
            ) : theme === 'sepia' ? (
              <Coffee className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* User Account / Profile Button */}
          {!currentUser ? (
            <button
              onClick={() => onOpenAuth && onOpenAuth('login')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] text-xs font-semibold hover:border-blue-500 transition-colors"
              >
                {currentUser.role === 'writer' ? (
                  <>
                    <span className="text-amber-500">✍️</span>
                    <span className="max-w-[60px] sm:max-w-[110px] truncate font-bold text-[var(--text-primary)]">
                      {currentUser.penName || currentUser.displayName}
                    </span>
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5 text-blue-500" />
                    <span className="max-w-[60px] sm:max-w-[110px] truncate text-[var(--text-primary)]">
                      {currentUser.displayName}
                    </span>
                  </>
                )}
              </button>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl p-2 z-50 text-xs space-y-1 animate-fade-in">
                  <div className="p-2 border-b border-[var(--border-subtle)] space-y-0.5">
                    <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider block">
                      {currentUser.role === 'writer' ? 'Writer Account' : 'Reader Account'}
                    </span>
                    <strong className="block text-[var(--text-primary)] truncate font-semibold">
                      {currentUser.displayName}
                    </strong>
                    <span className="text-[11px] text-[var(--text-secondary)] block truncate">
                      {currentUser.email}
                    </span>
                  </div>

                  {currentUser.role === 'writer' && (
                    <>
                      {currentUser.isCertifiedWriter ? (
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] space-y-0.5">
                          <div className="flex items-center gap-1 font-bold">
                            <Award className="w-3.5 h-3.5" />
                            <span>Certified Novice Writer</span>
                          </div>
                          <span className="text-[10px] opacity-80 block truncate">
                            ID: {currentUser.writerCertification?.certificateId}
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            if (onOpenWriterExam) onOpenWriterExam();
                          }}
                          className="w-full text-left p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold hover:bg-amber-500/20 transition-colors flex items-center justify-between"
                        >
                          <span>Take Certification Exam</span>
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {onOpenAuthorStudio && (
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            onOpenAuthorStudio();
                          }}
                          className="w-full text-left p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-2"
                        >
                          <Wallet className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Writer Studio & Earnings</span>
                        </button>
                      )}
                    </>
                  )}

                  {currentUser.role === 'reader' && (
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        if (onOpenAuth) onOpenAuth('writer-signup');
                      }}
                      className="w-full text-left p-2 rounded-lg text-amber-600 dark:text-amber-400 font-semibold hover:bg-amber-500/10 transition-colors flex items-center gap-2"
                    >
                      <Feather className="w-3.5 h-3.5" />
                      <span>Become a Certified Writer</span>
                    </button>
                  )}

                  {onLogout && (
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onLogout();
                      }}
                      className="w-full text-left p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2 border-t border-[var(--border-subtle)]"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Write Story Button - hidden on tiny mobile, accessible via mobile menu */}
          <button
            onClick={handleWriteStoryClick}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all whitespace-nowrap focus:ring-2 focus:ring-blue-500/50"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Write Story</span>
          </button>

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 space-y-2.5 shadow-xl animate-fade-in">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-[var(--border-subtle)]">
            <button
              onClick={() => {
                onNavigate('library');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2 rounded-lg text-xs font-semibold text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 text-left"
            >
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Library</span>
            </button>
            <button
              onClick={() => {
                onNavigate('genres');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2 rounded-lg text-xs font-semibold text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 text-left"
            >
              <Compass className="w-4 h-4 text-blue-600" />
              <span>Genres</span>
            </button>
            <button
              onClick={() => {
                onOpenBookmarks();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2 rounded-lg text-xs font-semibold text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 text-left"
            >
              <Bookmark className="w-4 h-4 text-purple-600" />
              <span>Bookmarks</span>
            </button>
            <button
              onClick={() => {
                if (onOpenPowerVotes) onOpenPowerVotes();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2 rounded-lg text-xs font-semibold text-amber-500 hover:bg-amber-500/10 text-left"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Power Stones</span>
            </button>
          </div>

          <div className="space-y-1 pt-1">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleWriteStoryClick();
              }}
              className="w-full flex items-center justify-between p-2 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-500/10"
            >
              <span className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>Write New Story</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20">Publish</span>
            </button>

            {onOpenAuthorStudio && (
              <button
                onClick={() => {
                  onOpenAuthorStudio();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-2 rounded-lg text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
              >
                <span className="flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  <span>Writer Studio & Royalties</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20">Studio</span>
              </button>
            )}

            <button
              onClick={() => {
                onOpenStats();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-2 rounded-lg text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5"
            >
              <span className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span>Monthly Visitors & Analytics</span>
              </span>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">Live</span>
            </button>

            {isOwner && onOpenLiveTraffic && (
              <button
                onClick={() => {
                  onOpenLiveTraffic();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-2 rounded-lg text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
              >
                <span className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Live Readers Online</span>
                </span>
                <span className="font-mono font-bold text-xs">{liveReadersCount ?? 1} active</span>
              </button>
            )}
          </div>
        </div>
      )}

      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        deferredPrompt={deferredPrompt}
        onInstalled={() => setDeferredPrompt(null)}
      />
    </header>
  );
};
