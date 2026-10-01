import React, { useState, useMemo, useEffect } from 'react';
import { Novel, ReadingProgress, ReadingShelf } from '../types/novel';
import { NovelCard } from './NovelCard';
import { GENRE_LIST } from '../data/novelsData';
import {
  Search,
  BookOpen,
  Clock,
  ArrowRight,
  Sparkles,
  Filter,
  Zap,
  BookmarkCheck,
  CheckCircle2,
  PauseCircle,
  SlidersHorizontal,
} from 'lucide-react';
import { getAllShelves, setNovelShelf, getPowerVoteData } from '../utils/readingStorage';
import { NovelRealmHeroBanner } from './NovelRealmHeroBanner';

interface LibraryViewProps {
  novels: Novel[];
  onSelectNovel: (novelId: number, chapterId?: number) => void;
  readingProgress: Record<number, ReadingProgress>;
  favorites: number[];
  onToggleFavorite: (e: React.MouseEvent, novelId: number) => void;
  onOpenAddNovel: () => void;
  onOpenPowerVotes: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  novels,
  onSelectNovel,
  readingProgress,
  favorites,
  onToggleFavorite,
  onOpenAddNovel,
  onOpenPowerVotes,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All Genres');
  const [activeShelf, setActiveShelf] = useState<ReadingShelf>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Ongoing' | 'Completed'>('all');
  const [minChapters, setMinChapters] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'rating' | 'views' | 'chapters' | 'newest' | 'votes'>('votes');
  const [shelvesState, setShelvesState] = useState<Record<number, ReadingShelf>>(() => getAllShelves());
  const [visibleCount, setVisibleCount] = useState<number>(36);
  const powerVoteData = getPowerVoteData();

  // Reset pagination when any filter or query changes for snappy UX
  useEffect(() => {
    setVisibleCount(36);
  }, [searchQuery, selectedGenre, activeShelf, statusFilter, minChapters, sortBy]);

  // Featured novel for marquee showcase
  const featuredNovel = useMemo(() => {
    return novels.find((n) => n.featured) || novels[0];
  }, [novels]);

  // Novels with active reading progress
  const inProgressNovels = useMemo(() => {
    return novels
      .filter((n) => readingProgress[n.id] !== undefined)
      .map((n) => ({
        novel: n,
        progress: readingProgress[n.id],
      }))
      .sort((a, b) => (b.progress?.lastReadTimestamp || 0) - (a.progress?.lastReadTimestamp || 0));
  }, [novels, readingProgress]);

  // Shelf counts
  const shelfCounts = useMemo(() => {
    const counts = { all: novels.length, reading: 0, want_to_read: 0, completed: 0, on_hold: 0 };
    novels.forEach((n) => {
      // If user has reading progress, treat as reading unless custom shelf set
      const assigned = shelvesState[n.id] || (readingProgress[n.id] ? 'reading' : undefined);
      if (assigned && assigned in counts) {
        counts[assigned as keyof typeof counts]++;
      }
    });
    return counts;
  }, [novels, shelvesState, readingProgress]);

  // Filtered and sorted novels
  const filteredNovels = useMemo(() => {
    return novels
      .filter((novel) => {
        // Genre filter
        const matchesGenre = selectedGenre === 'All Genres' || novel.genre === selectedGenre;

        // Shelf filter
        let matchesShelf = true;
        if (activeShelf !== 'all') {
          const assigned = shelvesState[novel.id] || (readingProgress[novel.id] ? 'reading' : undefined);
          matchesShelf = assigned === activeShelf;
        }

        // Status filter
        const matchesStatus = statusFilter === 'all' || novel.status === statusFilter;

        // Min chapters filter
        const matchesChapters = novel.chapters.length >= minChapters;

        // Search Query
        const query = searchQuery.toLowerCase().trim();
        let matchesSearch = true;
        if (query) {
          matchesSearch =
            novel.title.toLowerCase().includes(query) ||
            novel.author.toLowerCase().includes(query) ||
            novel.tags.some((t) => t.toLowerCase().includes(query)) ||
            novel.synopsis.toLowerCase().includes(query);
        }

        return matchesGenre && matchesShelf && matchesStatus && matchesChapters && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'votes') {
          const votesA = powerVoteData.votes[a.id] || 0;
          const votesB = powerVoteData.votes[b.id] || 0;
          return votesB - votesA;
        }
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'chapters') return b.chapters.length - a.chapters.length;
        if (sortBy === 'newest') return b.publishedYear - a.publishedYear;
        return b.ratingCount - a.ratingCount;
      });
  }, [novels, selectedGenre, activeShelf, statusFilter, minChapters, searchQuery, sortBy, shelvesState, readingProgress, powerVoteData]);

  // Paginated/windowed novels slice to keep DOM node count low on mobile
  const displayedNovels = useMemo(() => {
    return filteredNovels.slice(0, visibleCount);
  }, [filteredNovels, visibleCount]);

  const handleShelfChange = (novelId: number, shelf: ReadingShelf) => {
    setNovelShelf(novelId, shelf);
    setShelvesState(getAllShelves());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 font-clean-sans">
      
      {/* NovelRealm Grand Cinematic Hero Face */}
      {!searchQuery && selectedGenre === 'All Genres' && activeShelf === 'all' && (
        <NovelRealmHeroBanner
          featuredNovel={featuredNovel}
          onReadFeatured={(novelId, chapterId) => onSelectNovel(novelId, chapterId)}
          onOpenPowerVotes={onOpenPowerVotes}
          onOpenAddNovel={onOpenAddNovel}
          onSelectGenre={(genre) => setSelectedGenre(genre)}
        />
      )}

      {/* Featured Marquee Section */}
      {featuredNovel && !searchQuery && selectedGenre === 'All Genres' && activeShelf === 'all' && (
        <section className="relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 lg:p-10 items-center">
            
            {/* Left text & CTA */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
              <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)]">
                <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Editor's Recommendation
                </span>
                <span aria-hidden="true">·</span>
                <span>{featuredNovel.genre}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{featuredNovel.chapters.length} Chapters</span>
              </div>

              <h1 className="font-display-title text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.15] text-balance">
                {featuredNovel.title}
              </h1>

              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                {featuredNovel.synopsis}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onSelectNovel(featuredNovel.id, featuredNovel.chapters[0]?.id)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500/50"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Start Reading Chapter 1</span>
                </button>

                <button
                  onClick={() => onSelectNovel(featuredNovel.id)}
                  className="px-4 py-2.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  Table of Contents
                </button>
              </div>
            </div>

            {/* Right cover art */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div
                onClick={() => onSelectNovel(featuredNovel.id)}
                className="w-48 sm:w-56 lg:w-64 aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border border-[var(--border-subtle)] cursor-pointer group hover:scale-[1.02] transition-transform"
              >
                {featuredNovel.coverImage ? (
                  <img
                    src={featuredNovel.coverImage}
                    alt={featuredNovel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${featuredNovel.fallbackGradient} p-6 flex flex-col justify-between text-white`}>
                    <span className="text-xs uppercase font-bold tracking-wider">{featuredNovel.genre}</span>
                    <h3 className="font-display-title text-xl font-bold leading-tight">{featuredNovel.title}</h3>
                    <span className="text-xs opacity-75">{featuredNovel.author}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Community Power Stones & Early Reader Announcement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Power Stone Daily Voting Banner */}
        <section
          onClick={onOpenPowerVotes}
          className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 border border-amber-500/30 flex items-center justify-between gap-4 cursor-pointer hover:border-amber-500 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-xs group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                  Daily Power Stones
                </strong>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-white">
                  {powerVoteData.dailyTicketsRemaining} left
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                Vote for your favorite serials to unlock bonus chapters!
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 shrink-0 group-hover:translate-x-1 transition-transform">
            Vote Now →
          </span>
        </section>

        {/* Early Reader Privilege */}
        <section className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-blue-500/5 border border-emerald-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <div>
              <strong className="text-xs sm:text-sm font-bold text-[var(--text-primary)] block">
                Early Reader Privilege
              </strong>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                All serials under 10k views are 100% free forever for early readers!
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white font-bold text-[11px] shrink-0">
            Free Pass Active
          </span>
        </section>
      </div>

      {/* READING SHELVES TABS (WTR-Lab / RoyalRoad Style) */}
      <div className="border-b border-[var(--border-subtle)] pb-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveShelf('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeShelf === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <span>All Serials</span>
            <span className="text-[10px] font-mono opacity-80">({shelfCounts.all})</span>
          </button>

          <button
            onClick={() => setActiveShelf('reading')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeShelf === 'reading'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Currently Reading</span>
            <span className="text-[10px] font-mono opacity-80">({shelfCounts.reading})</span>
          </button>

          <button
            onClick={() => setActiveShelf('want_to_read')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeShelf === 'want_to_read'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Want to Read</span>
            <span className="text-[10px] font-mono opacity-80">({shelfCounts.want_to_read})</span>
          </button>

          <button
            onClick={() => setActiveShelf('completed')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeShelf === 'completed'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed</span>
            <span className="text-[10px] font-mono opacity-80">({shelfCounts.completed})</span>
          </button>

          <button
            onClick={() => setActiveShelf('on_hold')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeShelf === 'on_hold'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <PauseCircle className="w-3.5 h-3.5" />
            <span>On Hold</span>
            <span className="text-[10px] font-mono opacity-80">({shelfCounts.on_hold})</span>
          </button>
        </div>
      </div>

      {/* Main Catalog Header & Advanced Filter Controls */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display-title text-2xl font-bold text-[var(--text-primary)]">
              {activeShelf === 'all'
                ? 'Explore Serials Catalog'
                : activeShelf === 'reading'
                ? 'Currently Reading'
                : activeShelf === 'want_to_read'
                ? 'Plan to Read List'
                : activeShelf === 'completed'
                ? 'Finished Serials'
                : 'On Hold Serials'}
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Showing {filteredNovels.length} novel{filteredNovels.length === 1 ? '' : 's'}
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, author, tag..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder-[var(--text-secondary)]/60 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Multi-Filters Toolbar (Genres + Status + Length + Sort) */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-[var(--border-subtle)]">
          {/* Genre Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none max-w-full sm:max-w-xl">
            {GENRE_LIST.map((genre) => {
              const active = selectedGenre === genre;
              return (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    active
                      ? 'bg-blue-600 text-white'
                      : 'border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>

          {/* Secondary Filters: Status & Sort */}
          <div className="flex items-center gap-2 text-xs">
            {/* Status dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] text-xs focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>

            {/* Min Chapters */}
            <select
              value={minChapters}
              onChange={(e) => setMinChapters(Number(e.target.value))}
              className="px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] text-xs focus:outline-none"
            >
              <option value={0}>Any Length</option>
              <option value={10}>10+ Chapters</option>
              <option value={30}>30+ Chapters</option>
              <option value={50}>50+ Chapters</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] text-xs font-semibold focus:outline-none"
            >
              <option value="votes">⚡ Power Stones (Leaderboard)</option>
              <option value="rating">★ Highest Rated</option>
              <option value="views">🔥 Most Popular</option>
              <option value="chapters">📖 Most Chapters</option>
              <option value="newest">✨ Newest Releases</option>
            </select>
          </div>
        </div>

        {/* Novels Grid */}
        {filteredNovels.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-[var(--border-subtle)] rounded-2xl space-y-3">
            <p className="text-sm text-[var(--text-secondary)]">
              No novels match your current filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGenre('All Genres');
                setActiveShelf('all');
                setStatusFilter('all');
                setMinChapters(0);
              }}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {displayedNovels.map((novel) => {
                const currentShelf = shelvesState[novel.id] || (readingProgress[novel.id] ? 'reading' : 'all');
                return (
                  <div key={novel.id} className="flex flex-col group">
                    <NovelCard
                      novel={novel}
                      onSelect={(id) => onSelectNovel(id)}
                      isFavorite={favorites.includes(novel.id)}
                      onToggleFavorite={onToggleFavorite}
                      progressPercent={readingProgress[novel.id]?.scrollPercent}
                      lastReadChapterTitle={
                        readingProgress[novel.id]?.chapterId
                          ? `Ch. ${
                              novel.chapters.find((c) => c.id === readingProgress[novel.id].chapterId)
                                ?.chapterNumber || ''
                            }`
                          : undefined
                      }
                    />

                    {/* Shelf selector dropdown on card hover / tap */}
                    <div className="mt-1 px-1">
                      <select
                        value={currentShelf}
                        onChange={(e) => handleShelfChange(novel.id, e.target.value as ReadingShelf)}
                        className="w-full text-[10px] py-0.5 px-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:outline-none"
                      >
                        <option value="all">📁 Shelf: None</option>
                        <option value="reading">📖 Reading</option>
                        <option value="want_to_read">🔖 Want to Read</option>
                        <option value="completed">✅ Completed</option>
                        <option value="on_hold">⏸️ On Hold</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More button for ultra-smooth mobile performance */}
            {visibleCount < filteredNovels.length && (
              <div className="flex flex-col items-center justify-center pt-8 pb-4 space-y-2">
                <button
                  onClick={() => setVisibleCount((prev) => Math.min(prev + 36, filteredNovels.length))}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>
                    Load More Stories ({Math.min(visibleCount, filteredNovels.length)} of {filteredNovels.length.toLocaleString()})
                  </span>
                </button>
                <span className="text-xs text-[var(--text-secondary)]">
                  Optimized for fast, battery-efficient mobile browsing
                </span>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};
