import React from 'react';
import { Novel } from '../types/novel';
import { Star, BookOpen, Heart } from 'lucide-react';
import { getWriterRankByViews } from '../utils/userAuthStorage';

interface NovelCardProps {
  novel: Novel;
  onSelect: (novelId: number, chapterId?: number) => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, novelId: number) => void;
  progressPercent?: number;
  lastReadChapterTitle?: string;
}

export const NovelCard: React.FC<NovelCardProps> = ({
  novel,
  onSelect,
  isFavorite,
  onToggleFavorite,
  progressPercent,
  lastReadChapterTitle,
}) => {
  const rank = getWriterRankByViews(novel.viewCount);

  return (
    <article
      onClick={() => onSelect(novel.id)}
      className="group flex flex-col cursor-pointer transition-all duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-2 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
    >
      {/* Cover Image Container (Aspect 3:4) */}
      <div className="relative aspect-[3/4] w-full rounded-md overflow-hidden bg-slate-800 shadow-sm border border-[var(--border-subtle)]">
        {novel.coverImage ? (
          <img
            src={novel.coverImage}
            alt={`Cover art for ${novel.title}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              // Graceful fallback to styled gradient container
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.parentElement?.querySelector('.cover-fallback');
              if (fallback) (fallback as HTMLElement).style.display = 'flex';
            }}
          />
        ) : null}

        {/* Fallback container with editorial typography if image is not present or fails */}
        <div
          className={`cover-fallback ${novel.coverImage ? 'hidden' : 'flex'} absolute inset-0 bg-gradient-to-br ${novel.fallbackGradient} p-4 flex-col justify-between text-white`}
        >
          <div className="flex items-center justify-between text-xs tracking-wider uppercase opacity-80">
            <span>{novel.genre}</span>
            <span>{novel.status}</span>
          </div>
          <div>
            <h3 className="font-display-title text-base font-bold leading-snug line-clamp-3">
              {novel.title}
            </h3>
            <p className="text-xs opacity-75 mt-1 font-clean-sans">{novel.author}</p>
          </div>
          <div className="flex items-center gap-1 text-[11px] opacity-70">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{novel.chapters.length} Chapters</span>
          </div>
        </div>

        {/* Favorite quick button */}
        <button
          type="button"
          onClick={(e) => onToggleFavorite(e, novel.id)}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition-all ${
            isFavorite
              ? 'bg-red-500/90 text-white shadow-sm'
              : 'bg-black/40 text-white/80 hover:bg-black/60 hover:text-white'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          aria-label={isFavorite ? 'Remove favorite' : 'Add favorite'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Milestone / Early Bird Badge at Top Left */}
        <div className="absolute top-2.5 left-2.5">
          {novel.viewCount < 10000 ? (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600/90 text-white backdrop-blur-md shadow-xs flex items-center gap-1">
              <span>🏆</span>
              <span>100% Free (&lt;10k)</span>
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-600/90 text-white backdrop-blur-md shadow-xs flex items-center gap-1">
              <span>🌟</span>
              <span>Ch. 1–30 Free</span>
            </span>
          )}
        </div>

        {/* Reading progress ribbon if in progress */}
        {progressPercent !== undefined && progressPercent > 0 && (
          <div className="absolute bottom-0 inset-x-0 bg-black/75 backdrop-blur-xs p-1.5 text-white text-[11px] flex flex-col gap-1">
            <div className="flex justify-between items-center text-[10px] text-white/90">
              <span className="truncate max-w-[120px]">{lastReadChapterTitle || 'Reading'}</span>
              <span className="font-mono tabular-nums">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
              <div
                className="bg-blue-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Card Content & Metadata (Zero-Pill discipline applied) */}
      <div className="mt-3 flex flex-col flex-1">
        {/* Unboxed Metadata Header */}
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
          <span className="font-medium text-[var(--text-primary)]">{novel.genre}</span>
          <span aria-hidden="true" className="opacity-40">·</span>
          <span className="font-mono tabular-nums">{novel.chapters.length} chs</span>
          <span aria-hidden="true" className="opacity-40">·</span>
          <div className="flex items-center gap-0.5 text-amber-500">
            <Star className="w-3 h-3 fill-current" />
            <span className="font-mono tabular-nums text-xs">{novel.rating}</span>
          </div>
        </div>

        {/* Novel Title */}
        <h3 className="font-display-title text-base font-semibold text-[var(--text-primary)] mt-1.5 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {novel.title}
        </h3>

        {/* Author & Medal Badge */}
        <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-clean-sans flex items-center gap-1.5">
          <span>by {novel.author}</span>
          <span
            title={`${rank.label}${rank.writerSharePercent > 0 ? ` (${rank.writerSharePercent}% royalty tier)` : ' (Novice Unranked)'}`}
            className="text-xs cursor-help inline-flex items-center"
          >
            {rank.badge}
          </span>
        </p>

        {/* Synopsis snippet */}
        <p className="text-xs text-[var(--text-secondary)] opacity-85 mt-2 line-clamp-2 leading-relaxed font-clean-sans">
          {novel.synopsis}
        </p>
      </div>
    </article>
  );
};
