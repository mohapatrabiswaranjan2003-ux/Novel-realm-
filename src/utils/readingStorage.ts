import { ReaderSettings, ReadingProgress, Bookmark, Novel, ReadingShelf, ChapterReactionType, ChapterReactions, PowerVoteRecord } from '../types/novel';

const STORAGE_KEYS = {
  SETTINGS: 'novelrealm_settings_v1',
  PROGRESS: 'novelrealm_progress_v1',
  BOOKMARKS: 'novelrealm_bookmarks_v1',
  CUSTOM_NOVELS: 'novelrealm_custom_novels_v1',
  STATS: 'novelrealm_stats_v1',
  FAVORITES: 'novelrealm_favorites_v1',
  UNLOCKED_BOOKS: 'novelrealm_unlocked_books_v1',
  DAILY_PASSES: 'novelrealm_daily_passes_v1',
  FOUNDER_NOVELS: 'novelrealm_founder_novels_v1',
  SHELVES: 'novelrealm_shelves_v1',
  POWER_VOTES: 'novelrealm_power_votes_v1',
  REACTIONS: 'novelrealm_reactions_v1',
};

export const DEFAULT_SETTINGS: ReaderSettings = {
  theme: 'light',
  fontSize: 18,
  fontFamily: 'serif',
  lineHeight: 'normal',
  columnWidth: 'editorial',
  alignment: 'left',
  bionicReading: false,
  zenMode: false,
  speechRate: 1.0,
  readingMode: 'paged',
};

export interface ReadingStats {
  totalWordsRead: number;
  chaptersCompleted: number;
  readingStreakDays: number;
  lastActiveDate: string;
}

export function getSavedSettings(): ReaderSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load settings', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: ReaderSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function getAllProgress(): Record<number, ReadingProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load progress', e);
  }
  return {};
}

export function saveProgress(progress: ReadingProgress): void {
  try {
    const current = getAllProgress();
    current[progress.novelId] = progress;
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to save progress', e);
  }
}

export function getBookmarks(): Bookmark[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load bookmarks', e);
  }
  return [];
}

export function saveBookmarks(bookmarks: Bookmark[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  } catch (e) {
    console.error('Failed to save bookmarks', e);
  }
}

export function getFavorites(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load favorites', e);
  }
  return [];
}

export function toggleFavorite(novelId: number): boolean {
  try {
    const favs = getFavorites();
    const exists = favs.includes(novelId);
    const updated = exists ? favs.filter(id => id !== novelId) : [...favs, novelId];
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
    return !exists;
  } catch (e) {
    console.error('Failed to toggle favorite', e);
    return false;
  }
}

export function getCustomNovels(): Novel[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_NOVELS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load custom novels', e);
  }
  return [];
}

export function saveCustomNovel(novel: Novel): void {
  try {
    const current = getCustomNovels();
    const updated = [novel, ...current.filter(n => n.id !== novel.id)];
    localStorage.setItem(STORAGE_KEYS.CUSTOM_NOVELS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save custom novel', e);
  }
}

export function getReadingStats(): ReadingStats {
  const today = new Date().toISOString().split('T')[0];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    if (raw) {
      const stats: ReadingStats = JSON.parse(raw);
      return stats;
    }
  } catch (e) {
    console.error('Failed to load stats', e);
  }
  return {
    totalWordsRead: 0,
    chaptersCompleted: 0,
    readingStreakDays: 1,
    lastActiveDate: today,
  };
}

export function recordChapterRead(wordCount: number): void {
  try {
    const stats = getReadingStats();
    const today = new Date().toISOString().split('T')[0];
    
    let streak = stats.readingStreakDays || 1;
    if (stats.lastActiveDate !== today) {
      const lastDate = new Date(stats.lastActiveDate);
      const currentDate = new Date(today);
      const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        streak += 1;
      } else if (diffDays > 1) {
        streak = 1;
      }
    }

    const updated: ReadingStats = {
      totalWordsRead: (stats.totalWordsRead || 0) + wordCount,
      chaptersCompleted: (stats.chaptersCompleted || 0) + 1,
      readingStreakDays: streak,
      lastActiveDate: today,
    };
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to record chapter read', e);
  }
}

/**
 * Transforms plain text or HTML into Bionic Reading format
 * Bolding the first half of words to improve saccadic eye movement
 */
export function applyBionicReading(htmlContent: string): string {
  if (!htmlContent) return '';
  
  // Replace text inside paragraphs while preserving HTML tags
  return htmlContent.replace(/>([^<]+)</g, (_match, text) => {
    const words = text.split(' ');
    const transformed = words.map((word: string) => {
      if (word.length <= 1) return word;
      const mid = Math.ceil(word.length * 0.45);
      const boldPart = word.slice(0, mid);
      const restPart = word.slice(mid);
      return `<strong class="font-bold opacity-100">${boldPart}</strong>${restPart}`;
    }).join(' ');
    return `>${transformed}<`;
  });
}

/**
 * Unlocked VIP Books ($2 top-up permanently unlocks all chapters of that book)
 */
export function getUnlockedBooks(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.UNLOCKED_BOOKS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load unlocked books', e);
  }
  return [];
}

export function unlockBookPermanently(novelId: number): void {
  try {
    const list = getUnlockedBooks();
    if (!list.includes(novelId)) {
      list.push(novelId);
      localStorage.setItem(STORAGE_KEYS.UNLOCKED_BOOKS, JSON.stringify(list));
    }
  } catch (e) {
    console.error('Failed to unlock book', e);
  }
}

/**
 * Daily Free Chapter Passes
 * Reader gets 1 free pass every day to unlock any locked chapter beyond Ch. 30!
 */
interface DailyPassData {
  lastClaimDate: string; // YYYY-MM-DD
  claimedChapters: number[]; // chapter IDs unlocked via daily pass
}

export function getDailyPassData(): DailyPassData {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_PASSES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load daily pass data', e);
  }
  return { lastClaimDate: '', claimedChapters: [] };
}

export function canClaimDailyPass(): boolean {
  const data = getDailyPassData();
  const today = new Date().toISOString().split('T')[0];
  return data.lastClaimDate !== today;
}

export function claimDailyPassForChapter(chapterId: number): boolean {
  try {
    const data = getDailyPassData();
    const today = new Date().toISOString().split('T')[0];
    
    // Add chapter to claimed list
    if (!data.claimedChapters.includes(chapterId)) {
      data.claimedChapters.push(chapterId);
    }
    data.lastClaimDate = today;
    localStorage.setItem(STORAGE_KEYS.DAILY_PASSES, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Failed to claim daily pass', e);
    return false;
  }
}

/**
 * Early Reader Privilege
 * If a reader accessed a book while its total views were under 10,000,
 * they are registered as a Founding Reader with permanent free chapter access!
 */
export function getFounderPrivilegeNovels(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FOUNDER_NOVELS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load founder privilege novels', e);
  }
  return [];
}

export function registerFounderPrivilege(novelId: number, currentViews: number): boolean {
  if (currentViews >= 10000) return false;
  try {
    const list = getFounderPrivilegeNovels();
    if (!list.includes(novelId)) {
      list.push(novelId);
      localStorage.setItem(STORAGE_KEYS.FOUNDER_NOVELS, JSON.stringify(list));
      return true;
    }
  } catch (e) {
    console.error('Failed to save founder privilege', e);
  }
  return false;
}

export interface ChapterLockStatus {
  isLocked: boolean;
  reason: 'early_bird_free' | 'founder_privilege' | 'under_30_free' | 'vip_pass_unlocked' | 'daily_pass_unlocked' | 'locked_paywall';
}

/**
 * Core Rule Evaluator:
 * 1. If novel has < 10,000 views -> 100% Free!
 * 2. If reader visited under 10k views -> Permanent Founder Privilege Free!
 * 3. If chapter number <= 30 -> 100% Free!
 * 4. If reader unlocked book with $2 pass -> 100% Free!
 * 5. If reader claimed with Daily Free Pass -> Free!
 * 6. Otherwise -> LOCKED!
 */
export function checkChapterLockStatus(
  novel: Novel,
  chapterNumber: number,
  chapterId: number,
  unlockedBooks: number[],
  dailyClaimedChapters: number[],
  founderNovels: number[]
): ChapterLockStatus {
  // Rule 1: Book has fewer than 10,000 views -> All chapters free!
  if (novel.viewCount < 10000) {
    return { isLocked: false, reason: 'early_bird_free' };
  }

  // Rule 2: Reader is a registered Founding Early Reader for this book
  if (founderNovels.includes(novel.id)) {
    return { isLocked: false, reason: 'founder_privilege' };
  }

  // Rule 3: Chapters 1 to 30 are always free to hook readers
  if (chapterNumber <= 30) {
    return { isLocked: false, reason: 'under_30_free' };
  }

  // Rule 4: Reader unlocked all chapters with $2 VIP pass
  if (unlockedBooks.includes(novel.id)) {
    return { isLocked: false, reason: 'vip_pass_unlocked' };
  }

  // Rule 5: Reader unlocked this chapter using Daily Free Pass
  if (dailyClaimedChapters.includes(chapterId)) {
    return { isLocked: false, reason: 'daily_pass_unlocked' };
  }

  // Rule 6: Chapter 31+ is locked
  return { isLocked: true, reason: 'locked_paywall' };
}

// ----------------- READING SHELVES -----------------
export function getAllShelves(): Record<number, ReadingShelf> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SHELVES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get shelves', e);
  }
  return {};
}

export function getNovelShelf(novelId: number): ReadingShelf {
  const all = getAllShelves();
  return all[novelId] || 'all';
}

export function setNovelShelf(novelId: number, shelf: ReadingShelf): void {
  try {
    const all = getAllShelves();
    if (shelf === 'all') {
      delete all[novelId];
    } else {
      all[novelId] = shelf;
    }
    localStorage.setItem(STORAGE_KEYS.SHELVES, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to set shelf', e);
  }
}

// ----------------- POWER VOTING / TICKETS -----------------
const DEFAULT_VOTE_RECORD: PowerVoteRecord = {
  dailyTicketsRemaining: 3,
  lastResetDate: '',
  votes: {
    1: 428,
    2: 512,
    3: 310,
    4: 185,
    5: 240,
    6: 195,
  },
};

export function getPowerVoteData(): PowerVoteRecord {
  const today = new Date().toISOString().split('T')[0];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.POWER_VOTES);
    if (raw) {
      const data: PowerVoteRecord = JSON.parse(raw);
      if (data.lastResetDate !== today) {
        data.dailyTicketsRemaining = 3;
        data.lastResetDate = today;
        localStorage.setItem(STORAGE_KEYS.POWER_VOTES, JSON.stringify(data));
      }
      return data;
    }
  } catch (e) {
    console.error('Failed to get power vote data', e);
  }

  const initial = { ...DEFAULT_VOTE_RECORD, lastResetDate: today };
  try {
    localStorage.setItem(STORAGE_KEYS.POWER_VOTES, JSON.stringify(initial));
  } catch (e) {}
  return initial;
}

export function castPowerVote(novelId: number): { success: boolean; ticketsLeft: number; totalVotes: number } {
  const data = getPowerVoteData();
  if (data.dailyTicketsRemaining <= 0) {
    return {
      success: false,
      ticketsLeft: 0,
      totalVotes: data.votes[novelId] || 0,
    };
  }

  data.dailyTicketsRemaining -= 1;
  data.votes[novelId] = (data.votes[novelId] || 0) + 1;

  try {
    localStorage.setItem(STORAGE_KEYS.POWER_VOTES, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save power vote', e);
  }

  return {
    success: true,
    ticketsLeft: data.dailyTicketsRemaining,
    totalVotes: data.votes[novelId],
  };
}

// ----------------- CHAPTER REACTIONS -----------------
const DEFAULT_REACTIONS: Record<number, ChapterReactions> = {
  101: { fire: 48, cliffhanger: 62, mindblown: 34, laugh: 8, cry: 2, heart: 27 },
  102: { fire: 55, cliffhanger: 79, mindblown: 41, laugh: 5, cry: 3, heart: 32 },
  201: { fire: 82, cliffhanger: 45, mindblown: 53, laugh: 14, cry: 1, heart: 38 },
};

export function getChapterReactions(chapterId: number): ChapterReactions {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REACTIONS);
    if (raw) {
      const all: Record<number, ChapterReactions> = JSON.parse(raw);
      if (all[chapterId]) return all[chapterId];
    }
  } catch (e) {
    console.error('Failed to get chapter reactions', e);
  }

  return DEFAULT_REACTIONS[chapterId] || {
    fire: 12 + (chapterId % 15),
    cliffhanger: 18 + (chapterId % 20),
    mindblown: 9 + (chapterId % 11),
    laugh: 3 + (chapterId % 6),
    cry: 1 + (chapterId % 4),
    heart: 8 + (chapterId % 9),
  };
}

export function toggleChapterReaction(
  chapterId: number,
  type: ChapterReactionType
): ChapterReactions {
  const current = getChapterReactions(chapterId);
  const wasReacted = current.userReacted === type;

  // If user previously reacted with something else, decrease that
  if (current.userReacted && current.userReacted !== type) {
    current[current.userReacted] = Math.max(0, current[current.userReacted] - 1);
  }

  if (wasReacted) {
    current[type] = Math.max(0, current[type] - 1);
    current.userReacted = null;
  } else {
    current[type] = current[type] + 1;
    current.userReacted = type;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REACTIONS);
    const all = raw ? JSON.parse(raw) : {};
    all[chapterId] = current;
    localStorage.setItem(STORAGE_KEYS.REACTIONS, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to save chapter reaction', e);
  }

  return { ...current };
}

