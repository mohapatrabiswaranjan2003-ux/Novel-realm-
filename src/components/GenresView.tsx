import React from 'react';
import { Novel, ReadingProgress } from '../types/novel';
import { NovelCard } from './NovelCard';
import { Sparkles } from 'lucide-react';

interface GenresViewProps {
  novels: Novel[];
  onSelectNovel: (novelId: number, chapterId?: number) => void;
  readingProgress: Record<number, ReadingProgress>;
  favorites: number[];
  onToggleFavorite: (e: React.MouseEvent, novelId: number) => void;
}

const GENRE_METADATA: Record<
  string,
  { description: string; tropeSnippet: string }
> = {
  'Sci-Fi': {
    description: 'Deep-space exploratory cruisers, anomalous Dyson lattices, synthetic intelligence, and relativistic physics.',
    tropeSnippet: 'Hard Sci-Fi · Quantum Singularities · Space Exploration',
  },
  'Fantasy': {
    description: 'Ancient catacombs, crimson eclipse prophecies, slumbering drakes, and forgotten bloodline keys.',
    tropeSnippet: 'Dark Fantasy · Dragon Catacombs · Sovereign Relics',
  },
  'Xianxia': {
    description: 'Daoist alchemy cauldrons, severed spirit roots, nascent qi cultivation, and immortal tribulation lightning.',
    tropeSnippet: 'Cultivation · Alchemy Cauldrons · Dantian Mastery',
  },
  'Cyberpunk': {
    description: 'Rain-soaked dystopian megalopolises, illegal neural ghost extractions, megacorp cartels, and cyberware.',
    tropeSnippet: 'Cyber Noir · Neural Diving · Corporate Bounties',
  },
  'Steampunk': {
    description: 'Brass horology, alchemical mercury automatons, smog-choked Victorian workshops, and escapement gears.',
    tropeSnippet: 'Steampunk · Clockwork Automatons · Liquid Mercury',
  },
  'LitRPG': {
    description: 'System apocalypse notifications, soul container debugger classes, skill tree hacks, and leveling mechanics.',
    tropeSnippet: 'System Apocalypse · Error 404 · Uncapped Progression',
  },
  'Romance': {
    description: 'Enemies-to-lovers royal court intrigue, dragon shifter lords, magical vows, and high-stakes passion.',
    tropeSnippet: 'Royal Romance · Dragon Shifter · Court Intrigue',
  },
  'Mystery': {
    description: 'Eldritch occult murders, fog-shrouded 1920s harbors, forbidden grimoires, and relentless detective noir.',
    tropeSnippet: 'Occult Detective · Arkham Noir · Forbidden Tomes',
  },
  'Wuxia': {
    description: 'Lone wanderers with rusted blades, misty taverns in the rain, autumn leaf sword stances, and clan vengeance.',
    tropeSnippet: 'Martial Jianghu · Lone Swordsman · Blade Mastery',
  },
  'Action': {
    description: 'Deep-sea leviathan evolution, genetic mutations, apex predator clashes, and superpower awakening.',
    tropeSnippet: 'Leviathan Evolution · Monster Rebirth · Deep Abyss',
  },
};

export const GenresView: React.FC<GenresViewProps> = ({
  novels,
  onSelectNovel,
  readingProgress,
  favorites,
  onToggleFavorite,
}) => {
  const genres = Object.keys(GENRE_METADATA);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <div className="border-b border-[var(--border-subtle)] pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Genre Compendium</span>
        </div>
        <h1 className="font-display-title text-3xl font-bold tracking-tight text-[var(--text-primary)]">
          Explore by Realm & Literary Sub-Genre
        </h1>
        <p className="text-xs text-[var(--text-secondary)] max-w-2xl font-clean-sans">
          From cosmic starships charting silent nebulae to Daoist immortals defying heavenly tribulations, discover serialized web fiction across your favorite genres.
        </p>
      </div>

      <div className="space-y-12">
        {genres.map((genre) => {
          const genreNovels = novels.filter((n) => n.genre === genre);
          if (genreNovels.length === 0) return null;

          const meta = GENRE_METADATA[genre];

          return (
            <section key={genre} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-[var(--border-subtle)] pb-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-3">
                    <h2 className="font-display-title text-xl font-bold text-[var(--text-primary)]">
                      {genre}
                    </h2>
                    <span className="text-xs font-mono text-[var(--text-secondary)] tabular-nums">
                      ({genreNovels.length} title{genreNovels.length > 1 ? 's' : ''})
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] font-clean-sans">
                    {meta?.description}
                  </p>
                </div>
                <span className="text-[11px] font-mono text-[var(--text-secondary)]">
                  {meta?.tropeSnippet}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {genreNovels.map((novel) => {
                  const progress = readingProgress[novel.id];
                  const lastChapter = progress
                    ? novel.chapters.find((c) => c.id === progress.chapterId)
                    : undefined;

                  return (
                    <NovelCard
                      key={novel.id}
                      novel={novel}
                      onSelect={onSelectNovel}
                      isFavorite={favorites.includes(novel.id)}
                      onToggleFavorite={onToggleFavorite}
                      progressPercent={progress?.scrollPercent}
                      lastReadChapterTitle={
                        lastChapter ? `Ch. ${lastChapter.chapterNumber}` : undefined
                      }
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
