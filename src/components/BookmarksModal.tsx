import React from 'react';
import { Bookmark as BookmarkType } from '../types/novel';
import { X, Bookmark as BookmarkIcon, Trash2, ArrowUpRight } from 'lucide-react';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: BookmarkType[];
  onSelectBookmark: (novelId: number, chapterId: number) => void;
  onDeleteBookmark: (bookmarkId: string) => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onSelectBookmark,
  onDeleteBookmark,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-2xl shadow-2xl p-6 max-h-[85vh] flex flex-col"
        role="dialog"
        aria-label="Bookmarks Library"
      >
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <div className="flex items-center gap-2">
            <BookmarkIcon className="w-5 h-5 text-amber-500 fill-current" />
            <h3 className="font-display-title text-lg font-bold">Saved Bookmarks & Quotes</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[var(--border-subtle)] py-2">
          {bookmarks.length > 0 ? (
            bookmarks.map((bm) => (
              <div
                key={bm.id}
                className="py-3.5 px-2 flex items-start justify-between gap-3 group hover:bg-black/[0.02] dark:hover:bg-white/[0.02] rounded-lg transition-colors"
              >
                <div
                  onClick={() => {
                    onSelectBookmark(bm.novelId, bm.chapterId);
                    onClose();
                  }}
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {bm.novelTitle}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{bm.chapterTitle}</span>
                  </div>

                  {bm.snippet && (
                    <blockquote className="mt-1.5 text-xs italic text-[var(--text-primary)] line-clamp-3 pl-2.5 border-l-2 border-amber-500/60 font-serif">
                      "{bm.snippet}"
                    </blockquote>
                  )}

                  <div className="text-[10px] text-[var(--text-secondary)] mt-1.5 font-mono">
                    {new Date(bm.timestamp).toLocaleDateString()} at{' '}
                    {new Date(bm.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 pt-1">
                  <button
                    onClick={() => {
                      onSelectBookmark(bm.novelId, bm.chapterId);
                      onClose();
                    }}
                    className="p-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                    title="Jump to chapter"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteBookmark(bm.id)}
                    className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    title="Remove bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center space-y-2 text-[var(--text-secondary)]">
              <BookmarkIcon className="w-8 h-8 mx-auto opacity-30" />
              <p className="text-sm font-medium">No bookmarks saved yet</p>
              <p className="text-xs max-w-xs mx-auto font-clean-sans">
                While reading any chapter, click the bookmark icon or highlight text to save favorite passages!
              </p>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] text-right font-mono tabular-nums">
          {bookmarks.length} bookmark{bookmarks.length === 1 ? '' : 's'} recorded
        </div>
      </div>
    </div>
  );
};
