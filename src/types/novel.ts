export interface Chapter {
  id: number;
  novelId: number;
  chapterNumber: number;
  title: string;
  content: string; // HTML paragraphs or prose
  wordCount: number;
  estimatedReadMinutes: number;
  releaseDate: string;
  authorNote?: string;
}

export interface Novel {
  id: number;
  title: string;
  author: string;
  coverImage?: string;
  fallbackGradient: string;
  genre:
    | 'Sci-Fi'
    | 'Fantasy'
    | 'Xianxia'
    | 'Cyberpunk'
    | 'Steampunk'
    | 'LitRPG'
    | 'Romance'
    | 'Mystery'
    | 'Wuxia'
    | 'Action'
    | 'Horror'
    | 'Historical'
    | 'Adventure'
    | 'Supernatural'
    | 'Thriller'
    | (string & {});
  tags: string[];
  status: 'Ongoing' | 'Completed';
  rating: number;
  ratingCount: number;
  totalViews: string;
  viewCount: number; // Numeric views for 10k threshold check
  synopsis: string;
  publishedYear: number;
  chapters: Chapter[];
  featured?: boolean;
  authorUpi?: string;
  authorEmail?: string;
}

export type ReaderTheme = 'light' | 'dark' | 'sepia' | 'midnight' | 'sage';
export type ReaderFontFamily = 'serif' | 'sans' | 'book' | 'mono';
export type ReaderLineHeight = 'tight' | 'normal' | 'relaxed';
export type ReaderColumnWidth = 'compact' | 'editorial' | 'broad' | 'full';
export type ReaderAlignment = 'left' | 'justify';

export interface ReaderSettings {
  theme: ReaderTheme;
  fontSize: number; // 14 to 28
  fontFamily: ReaderFontFamily;
  lineHeight: ReaderLineHeight;
  columnWidth: ReaderColumnWidth;
  alignment: ReaderAlignment;
  bionicReading: boolean;
  zenMode: boolean;
  speechRate: number; // 0.75 to 2.0
  readingMode?: 'paged' | 'continuous';
}

export type ReadingShelf = 'all' | 'reading' | 'want_to_read' | 'completed' | 'on_hold';

export type WriterTier = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface WriterTierInfo {
  tier: WriterTier;
  label: string;
  badge: string;
  medalColor: string;
  minViews: number;
  maxViews: number;
  writerSharePercent: number; // 40%, 60%, 65%, 70%
  ownerSharePercent: number;  // 60%, 40%, 35%, 30%
}

export type ChapterReactionType = 'fire' | 'cliffhanger' | 'mindblown' | 'laugh' | 'cry' | 'heart';

export interface ChapterReactions {
  fire: number;
  cliffhanger: number;
  mindblown: number;
  laugh: number;
  cry: number;
  heart: number;
  userReacted?: ChapterReactionType | null;
}

export interface PowerVoteRecord {
  dailyTicketsRemaining: number;
  lastResetDate: string;
  votes: Record<number, number>; // novelId -> vote count
}

export interface ReadingProgress {
  novelId: number;
  chapterId: number;
  scrollPercent: number;
  lastReadTimestamp: number;
  completedChapters: number[];
}

export interface Bookmark {
  id: string;
  novelId: number;
  chapterId: number;
  chapterTitle: string;
  novelTitle: string;
  snippet: string;
  timestamp: number;
  note?: string;
}

export interface ChapterComment {
  id: string;
  chapterId: number;
  author: string;
  avatarColor: string;
  content: string;
  timestamp: string;
  likes: number;
  userLiked?: boolean;
}

export interface NovelReview {
  id: string;
  novelId: number;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  likes: number;
  userLiked?: boolean;
}
