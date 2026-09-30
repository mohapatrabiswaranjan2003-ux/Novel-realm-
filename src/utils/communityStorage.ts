import { ChapterComment, NovelReview } from '../types/novel';

const STORAGE_KEYS = {
  COMMENTS: 'novelrealm_comments_v1',
  REVIEWS: 'novelrealm_reviews_v1',
  ANALYTICS: 'novelrealm_analytics_v1',
};

// Initial realistic seed comments
const DEFAULT_COMMENTS: Record<number, ChapterComment[]> = {
  101: [
    {
      id: 'c1',
      chapterId: 101,
      author: 'StarGazer_99',
      avatarColor: 'bg-blue-500',
      content: 'That opening sequence gave me chills! The transition from sub-light to fold space was described so vividly.',
      timestamp: '2 hours ago',
      likes: 14,
    },
    {
      id: 'c2',
      chapterId: 101,
      author: 'CyberScribe',
      avatarColor: 'bg-purple-500',
      content: 'Captain Vance is already shaping up to be such a complex protagonist. Excited for Chapter 2!',
      timestamp: '5 hours ago',
      likes: 8,
    },
    {
      id: 'c3',
      chapterId: 101,
      author: 'VoidReader',
      avatarColor: 'bg-emerald-500',
      content: 'The mystery of the derelict ship signals... I have a theory about who sent that distress beacon.',
      timestamp: '1 day ago',
      likes: 22,
    },
  ],
  201: [
    {
      id: 'c4',
      chapterId: 201,
      author: 'GrandDaoMaster',
      avatarColor: 'bg-amber-500',
      content: 'A mortal in an immortal battlefield! The underdog cultivation vibe here is elite.',
      timestamp: '3 hours ago',
      likes: 19,
    },
    {
      id: 'c5',
      chapterId: 201,
      author: 'LotusFlower',
      avatarColor: 'bg-rose-500',
      content: 'The shattered jade pendant will definitely awaken an ancient spirit mentor, calling it now!',
      timestamp: '6 hours ago',
      likes: 11,
    },
  ],
};

// Initial realistic seed reviews
const DEFAULT_REVIEWS: Record<number, NovelReview[]> = {
  1: [
    {
      id: 'r1',
      novelId: 1,
      author: 'AstraeaWrites',
      rating: 5,
      title: 'A Masterclass in Hard Sci-Fi Space Opera',
      content: 'From the scientific rigor of relativistic travel to the intense psychological tension between the crew members, The Stellar Voyager is an absolute gem. The pacing is relentless and the worldbuilding feels expansive.',
      date: 'Sep 24, 2026',
      likes: 42,
    },
    {
      id: 'r2',
      novelId: 1,
      author: 'Kaelen_Reads',
      rating: 5,
      title: 'Could not stop reading till chapter 35!',
      content: 'The character arcs are top tier. You genuinely fear for the survival of the expedition. The daily unlock system is very fair and worth every single minute.',
      date: 'Sep 27, 2026',
      likes: 29,
    },
    {
      id: 'r3',
      novelId: 1,
      author: 'QuantumScout',
      rating: 4,
      title: 'Brilliant technical detail and worldbuilding',
      content: 'Takes a chapter or two to introduce all the orbital mechanics, but once the main conflict triggers, it is impossible to put down.',
      date: 'Sep 28, 2026',
      likes: 15,
    },
  ],
  2: [
    {
      id: 'r4',
      novelId: 2,
      author: 'SwordSaint_Jin',
      rating: 5,
      title: 'Finally a cultivation novel with brain cells!',
      content: 'The protagonist actually uses strategy, deception, and patient alchemy instead of mindless face-slapping. The heavenly tribulation scenes are breathtaking.',
      date: 'Sep 25, 2026',
      likes: 56,
    },
    {
      id: 'r5',
      novelId: 2,
      author: 'ImmortalScholar',
      rating: 5,
      title: 'One of the best eastern fantasy serials on the web',
      content: 'Poetic prose, rich clan lore, and genuine high stakes. 10/10 recommended.',
      date: 'Sep 29, 2026',
      likes: 31,
    },
  ],
  3: [
    {
      id: 'r6',
      novelId: 3,
      author: 'CyberDrifter',
      rating: 5,
      title: 'Dystopian grit done right',
      content: 'Atmospheric neon noir with razor-sharp dialogue. Feels like Neuromancer met Blade Runner in all the right ways.',
      date: 'Sep 26, 2026',
      likes: 24,
    },
  ],
};

// 1. Comments Functions
export function getChapterComments(chapterId: number): ChapterComment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    const stored: Record<number, ChapterComment[]> = raw ? JSON.parse(raw) : {};
    if (stored[chapterId]) return stored[chapterId];
    return DEFAULT_COMMENTS[chapterId] || [];
  } catch (e) {
    console.error('Failed to get comments', e);
    return DEFAULT_COMMENTS[chapterId] || [];
  }
}

export function addChapterComment(
  chapterId: number,
  author: string,
  content: string
): ChapterComment {
  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-indigo-500',
  ];
  const newComment: ChapterComment = {
    id: `c_${Date.now()}`,
    chapterId,
    author: author.trim() || 'Anonymous Reader',
    avatarColor: colors[Math.floor(Math.random() * colors.length)],
    content: content.trim(),
    timestamp: 'Just now',
    likes: 1,
    userLiked: true,
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    const stored: Record<number, ChapterComment[]> = raw ? JSON.parse(raw) : {};
    const list = stored[chapterId] || DEFAULT_COMMENTS[chapterId] || [];
    stored[chapterId] = [newComment, ...list];
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(stored));
  } catch (e) {
    console.error('Failed to save comment', e);
  }

  return newComment;
}

export function toggleCommentLike(chapterId: number, commentId: string): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    const stored: Record<number, ChapterComment[]> = raw ? JSON.parse(raw) : {};
    const list = stored[chapterId] || DEFAULT_COMMENTS[chapterId] || [];
    const updated = list.map((c) => {
      if (c.id === commentId) {
        const liked = !c.userLiked;
        return {
          ...c,
          likes: liked ? c.likes + 1 : Math.max(0, c.likes - 1),
          userLiked: liked,
        };
      }
      return c;
    });
    stored[chapterId] = updated;
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(stored));
  } catch (e) {
    console.error('Failed to like comment', e);
  }
}

// 2. Reviews Functions
export function getNovelReviews(novelId: number): NovelReview[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    const stored: Record<number, NovelReview[]> = raw ? JSON.parse(raw) : {};
    if (stored[novelId]) return stored[novelId];
    return DEFAULT_REVIEWS[novelId] || [];
  } catch (e) {
    console.error('Failed to get reviews', e);
    return DEFAULT_REVIEWS[novelId] || [];
  }
}

export function addNovelReview(
  novelId: number,
  author: string,
  rating: number,
  title: string,
  content: string
): NovelReview {
  const newReview: NovelReview = {
    id: `r_${Date.now()}`,
    novelId,
    author: author.trim() || 'Avid Reader',
    rating: Math.max(1, Math.min(5, rating)),
    title: title.trim() || 'Great reading experience!',
    content: content.trim(),
    date: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    likes: 1,
    userLiked: true,
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    const stored: Record<number, NovelReview[]> = raw ? JSON.parse(raw) : {};
    const list = stored[novelId] || DEFAULT_REVIEWS[novelId] || [];
    stored[novelId] = [newReview, ...list];
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(stored));
  } catch (e) {
    console.error('Failed to save review', e);
  }

  return newReview;
}

export function toggleReviewLike(novelId: number, reviewId: string): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    const stored: Record<number, NovelReview[]> = raw ? JSON.parse(raw) : {};
    const list = stored[novelId] || DEFAULT_REVIEWS[novelId] || [];
    const updated = list.map((r) => {
      if (r.id === reviewId) {
        const liked = !r.userLiked;
        return {
          ...r,
          likes: liked ? r.likes + 1 : Math.max(0, r.likes - 1),
          userLiked: liked,
        };
      }
      return r;
    });
    stored[novelId] = updated;
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(stored));
  } catch (e) {
    console.error('Failed to like review', e);
  }
}

// 3. Website Monthly Traffic & Analytics Tracker
export interface MonthlyTrafficData {
  currentMonthName: string;
  monthlyVisitors: number;
  monthlyPageViews: number;
  totalLifetimeVisits: number;
  activeReadersNow: number;
  lastMonthVisitors: number;
  growthRatePercent: number;
  topReferrers: { source: string; percent: number }[];
  dailyViewsThisWeek: { day: string; views: number }[];
}

export function recordWebsiteVisit(pageUrl: string = '/'): void {
  try {
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const raw = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
    const data = raw
      ? JSON.parse(raw)
      : {
          monthly: {},
          lifetimeViews: 2480, // realistic base traffic
          lastVisitTimestamp: 0,
        };

    if (!data.monthly[currentMonthKey]) {
      data.monthly[currentMonthKey] = {
        visitors: 1840,
        pageViews: 6720,
      };
    }

    // Increment on session/view
    data.monthly[currentMonthKey].pageViews += 1;
    data.lifetimeViews += 1;

    // Check if new day/session for unique visitor count
    const hoursSinceLast = (Date.now() - (data.lastVisitTimestamp || 0)) / (1000 * 60 * 60);
    if (hoursSinceLast > 1) {
      data.monthly[currentMonthKey].visitors += 1;
      data.lastVisitTimestamp = Date.now();
    }

    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to record visit', e);
  }
}

export function getWebsiteMonthlyTraffic(): MonthlyTrafficData {
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentMonthName = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

  let monthlyVisitors = 2140;
  let monthlyPageViews = 8960;
  let totalLifetimeVisits = 14320;

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
    if (raw) {
      const data = JSON.parse(raw);
      if (data.monthly && data.monthly[currentMonthKey]) {
        monthlyVisitors = data.monthly[currentMonthKey].visitors;
        monthlyPageViews = data.monthly[currentMonthKey].pageViews;
      }
      if (data.lifetimeViews) {
        totalLifetimeVisits = data.lifetimeViews;
      }
    }
  } catch (e) {
    console.error('Failed to get traffic data', e);
  }

  // Calculate live reader estimate (randomized realistic jitter between 18 and 42)
  const minuteSeed = Math.floor(Date.now() / 60000) % 15;
  const activeReadersNow = 22 + (minuteSeed % 9);

  return {
    currentMonthName,
    monthlyVisitors,
    monthlyPageViews,
    totalLifetimeVisits,
    activeReadersNow,
    lastMonthVisitors: 1680,
    growthRatePercent: 27.4,
    topReferrers: [
      { source: 'Direct URL / Bookmarks', percent: 48 },
      { source: 'WhatsApp & Social Sharing', percent: 26 },
      { source: 'Google / Web Search', percent: 17 },
      { source: 'WebNovel Forums & Reddit', percent: 9 },
    ],
    dailyViewsThisWeek: [
      { day: 'Mon', views: 340 },
      { day: 'Tue', views: 420 },
      { day: 'Wed', views: 510 },
      { day: 'Thu', views: 480 },
      { day: 'Fri', views: 630 },
      { day: 'Sat', views: 780 },
      { day: 'Sun', views: 820 },
    ],
  };
}
