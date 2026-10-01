import React from 'react';
import { BookOpen, Trophy, Feather, Sparkles, Flame, Compass } from 'lucide-react';
import heroImg from '../assets/images/novelrealm_hero_face_1790859446129.jpg';
import { Novel } from '../types/novel';

interface NovelRealmHeroBannerProps {
  featuredNovel?: Novel;
  onReadFeatured: (novelId: number, chapterId?: number) => void;
  onOpenPowerVotes: () => void;
  onOpenAddNovel: () => void;
  onSelectGenre: (genre: string) => void;
}

export const NovelRealmHeroBanner: React.FC<NovelRealmHeroBannerProps> = ({
  featuredNovel,
  onReadFeatured,
  onOpenPowerVotes,
  onOpenAddNovel,
  onSelectGenre,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-[var(--bg-surface)] shadow-2xl transition-all">
      {/* Background Image with Cinematic Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="NovelRealm Multiverse"
          className="w-full h-full object-cover object-center transform scale-105 filter brightness-95 contrast-105"
        />
        {/* Gradients to blend text cleanly in both light & dark modes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-canvas)] via-[var(--bg-canvas)]/80 to-[var(--bg-canvas)]/40 dark:from-neutral-950 dark:via-neutral-950/80 dark:to-neutral-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-canvas)] via-[var(--bg-canvas)]/60 to-transparent dark:from-neutral-950 dark:via-neutral-950/70 dark:to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-4xl flex flex-col justify-center space-y-6">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-blue-600/90 text-white shadow-md backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
            The Official NovelRealm
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-500 dark:text-amber-400 border border-amber-500/30 backdrop-blur-md">
            <Flame className="w-3.5 h-3.5" />
            5,080+ Web Novels & Serials
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
            2,000,000+ Verified Chapters
          </span>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="space-y-3">
          <h1 className="font-display-title text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.1] text-balance drop-shadow-xs">
            Where Every Chapter <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
              Unlocks a New Universe
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl drop-shadow-2xs">
            Dive into original cultivation sagas, LitRPG adventures, dystopian cyberpunk odysseys, and romantic fantasies written by authors from across the globe.
          </p>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {featuredNovel && (
            <button
              onClick={() => onReadFeatured(featuredNovel.id, featuredNovel.chapters[0]?.id)}
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
            >
              <BookOpen className="w-4 h-4" />
              <span>Read Featured: {featuredNovel.title}</span>
            </button>
          )}

          <button
            onClick={onOpenPowerVotes}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 hover:bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold text-sm transition-all backdrop-blur-md hover:border-amber-500/50 shadow-sm"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Power Rankings</span>
          </button>

          <button
            onClick={onOpenAddNovel}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 hover:bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold text-sm transition-all backdrop-blur-md hover:border-blue-500/50 shadow-sm"
          >
            <Feather className="w-4 h-4 text-blue-500" />
            <span>Publish Your Story</span>
          </button>
        </div>

        {/* Popular Genre Quick Selectors */}
        <div className="pt-4 border-t border-[var(--border-subtle)]/60 flex flex-wrap items-center gap-2 text-xs">
          <span className="flex items-center gap-1 font-semibold text-[var(--text-secondary)] mr-1">
            <Compass className="w-3.5 h-3.5" />
            Quick Explore:
          </span>
          {['Fantasy', 'Action', 'Sci-Fi', 'Romance', 'Mystery', 'Supernatural'].map((genre) => (
            <button
              key={genre}
              onClick={() => onSelectGenre(genre)}
              className="px-3 py-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-[var(--text-secondary)] font-medium transition-all backdrop-blur-2xs"
            >
              {genre}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
