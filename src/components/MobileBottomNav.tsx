import React from 'react';
import { BookOpen, Compass, Bookmark, Zap, Wallet, User } from 'lucide-react';
import { UserAccount } from '../types/auth';

interface MobileBottomNavProps {
  currentView: 'library' | 'genres' | 'reader';
  onNavigate: (view: 'library' | 'genres') => void;
  onOpenBookmarks: () => void;
  onOpenPowerVotes: () => void;
  onOpenAuthorStudio: () => void;
  currentUser?: UserAccount | null;
  onOpenAuth?: (mode?: 'login' | 'reader-signup' | 'writer-signup') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
  onOpenBookmarks,
  onOpenPowerVotes,
  onOpenAuthorStudio,
  currentUser,
  onOpenAuth,
}) => {
  // Only display on mobile viewports (< 768px) and never inside Reader mode
  if (currentView === 'reader') return null;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-surface)]/95 backdrop-blur-lg border-t border-[var(--border-subtle)] pb-safe transition-colors duration-200 shadow-lg"
      aria-label="Mobile Navigation Bar"
    >
      <div className="grid grid-cols-5 h-14 items-center justify-around px-1 max-w-lg mx-auto">
        {/* 1. Library / Home */}
        <button
          onClick={() => onNavigate('library')}
          className={`flex flex-col items-center justify-center py-1 transition-all ${
            currentView === 'library'
              ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Library</span>
        </button>

        {/* 2. Genres */}
        <button
          onClick={() => onNavigate('genres')}
          className={`flex flex-col items-center justify-center py-1 transition-all ${
            currentView === 'genres'
              ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Genres</span>
        </button>

        {/* 3. Bookmarks */}
        <button
          onClick={onOpenBookmarks}
          className="flex flex-col items-center justify-center py-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
        >
          <Bookmark className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Bookmarks</span>
        </button>

        {/* 4. Power Stones */}
        <button
          onClick={onOpenPowerVotes}
          className="flex flex-col items-center justify-center py-1 text-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition-all"
        >
          <Zap className="w-5 h-5 fill-current" />
          <span className="text-[10px] mt-0.5 tracking-tight font-semibold">Votes</span>
        </button>

        {/* 5. Studio or Profile */}
        {currentUser?.role === 'writer' ? (
          <button
            onClick={onOpenAuthorStudio}
            className="flex flex-col items-center justify-center py-1 text-emerald-600 dark:text-emerald-400 transition-all"
          >
            <Wallet className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight font-semibold">Studio</span>
          </button>
        ) : (
          <button
            onClick={() => (currentUser ? onOpenAuthorStudio() : onOpenAuth && onOpenAuth('login'))}
            className="flex flex-col items-center justify-center py-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">
              {currentUser ? 'Account' : 'Sign In'}
            </span>
          </button>
        )}
      </div>
    </nav>
  );
};
