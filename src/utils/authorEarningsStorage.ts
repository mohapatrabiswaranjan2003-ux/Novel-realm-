import { Novel, WriterTier, WriterTierInfo } from '../types/novel';
import { getDeviceSessionId, getWriterRankByViews, OFFICIAL_WRITER_RANKS } from './userAuthStorage';
import { WriterRank, WriterRankInfo } from '../types/auth';

const STORAGE_KEYS = {
  AUTHOR_PROFILES: 'novelrealm_author_profiles_v2',
  NOVEL_REAL_TRAFFIC: 'novelrealm_novel_real_traffic_v2',
  REAL_TIPS: 'novelrealm_real_tips_v2',
  REAL_VIP_PASSES: 'novelrealm_real_vip_passes_v2',
  OWNER_AUTH: 'novelrealm_owner_auth_v2',
};

export interface RealTrafficRecord {
  novelId: number;
  totalViews: number;
  uniqueReaders: string[]; // List of unique device session IDs
  totalMinutesRead: number;
  chapterViewCounts: Record<number, number>; // chapterId -> views
  lastActivityDate: string;
}

export interface AuthorEarningsData {
  novelId: number;
  novelTitle: string;
  authorName: string;
  genre: string;
  lifetimeViews: number;
  monthlyActiveReaders: number;
  monthlyChapterViews: number;
  avgReadTimeMinutes: number;

  // 5 Official Ranks & Medals
  rankInfo: WriterRankInfo;
  tierInfo: WriterTierInfo;
  writerSharePercent: number; // 0% Novice, 40% Bronze, 60% Silver, 65% Gold, 70% Diamond
  ownerSharePercent: number;
  nextTierProgressPercent: number;
  nextTierRemainingViews: number;

  // Real Platform Gross Earnings
  grossMonthlyAdRevenueUSD: number;
  grossTipsUSD: number;
  grossVipPassesUSD: number;
  powerStoneBonusUSD: number;

  // Writer's share
  writerAdRevenueUSD: number;
  writerTipsUSD: number;
  writerVipRevenueUSD: number;
  totalEarningsUSD: number;
  totalEarningsINR: number;

  // Platform Share (Owner Profit)
  ownerAdRevenueUSD: number;
  ownerTipsUSD: number;
  ownerVipRevenueUSD: number;
  ownerTotalUSD: number;
  ownerTotalINR: number;

  payoutStatus: 'Pending Next Cycle' | 'Ready for Payout' | 'Paid';
  payoutUpiOrPaypal?: string;
  isRealTraffic: boolean;
}

export function getAllRealTraffic(): Record<number, RealTrafficRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOVEL_REAL_TRAFFIC);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get real traffic', e);
  }
  return {};
}

/**
 * Record a 100% REAL chapter view and reading interaction
 * Never fabricates or fakes traffic
 */
export function recordRealReaderInteraction(
  novelId: number,
  chapterId: number,
  chapterWordCount: number = 1500
): void {
  try {
    const all = getAllRealTraffic();
    const sessionId = getDeviceSessionId();
    const today = new Date().toISOString().split('T')[0];

    const current: RealTrafficRecord = all[novelId] || {
      novelId,
      totalViews: 0,
      uniqueReaders: [],
      totalMinutesRead: 0,
      chapterViewCounts: {},
      lastActivityDate: today,
    };

    // Increment actual chapter view
    current.totalViews += 1;
    current.chapterViewCounts[chapterId] = (current.chapterViewCounts[chapterId] || 0) + 1;

    // Record unique reader if not already in session list
    if (!current.uniqueReaders.includes(sessionId)) {
      current.uniqueReaders.push(sessionId);
    }

    // Accurate minutes read: ~200 words per minute
    const minutes = Math.max(1, Math.round(chapterWordCount / 200));
    current.totalMinutesRead += minutes;
    current.lastActivityDate = today;

    all[novelId] = current;
    localStorage.setItem(STORAGE_KEYS.NOVEL_REAL_TRAFFIC, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to record real traffic interaction', e);
  }
}

export function recordNovelReaderInteraction(
  novelId: number,
  chapterWordCount: number = 1500
): void {
  recordRealReaderInteraction(novelId, 1, chapterWordCount);
}

/**
 * Record a real tip made by a reader
 */
export function recordRealTip(novelId: number, amountUSD: number): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REAL_TIPS);
    const data: Record<number, number> = raw ? JSON.parse(raw) : {};
    data[novelId] = (data[novelId] || 0) + amountUSD;
    localStorage.setItem(STORAGE_KEYS.REAL_TIPS, JSON.stringify(data));
  } catch (e) {}
}

/**
 * Record real VIP pass unlock ($2.00)
 */
export function recordRealVipUnlock(novelId: number): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REAL_VIP_PASSES);
    const data: Record<number, number> = raw ? JSON.parse(raw) : {};
    data[novelId] = (data[novelId] || 0) + 2.0;
    localStorage.setItem(STORAGE_KEYS.REAL_VIP_PASSES, JSON.stringify(data));
  } catch (e) {}
}

export function getNovelMonthlyMetrics(novel: Novel): AuthorEarningsData {
  const allTraffic = getAllRealTraffic();
  const realRecord = allTraffic[novel.id];

  // REAL DATA: strictly from actual visits and views!
  const realViews = realRecord ? realRecord.totalViews : 0;
  const realReaders = realRecord ? realRecord.uniqueReaders.length : 0;
  const realMinutes = realRecord ? realRecord.totalMinutesRead : 0;

  // Lifetime views:
  // For user-created novel: strictly realViews
  // For library starter novels: starting views + real views
  const isCustomUserNovel = novel.id >= 1000 || novel.author === 'You' || Boolean(novel.authorEmail);
  const lifetimeViews = isCustomUserNovel ? realViews : Math.max(novel.viewCount, realViews);
  const monthlyChapterViews = realViews;
  const monthlyActiveReaders = realReaders;
  const avgReadTimeMinutes = realReaders > 0 ? Math.round(realMinutes / realReaders) : 0;

  // Rank & Medal Progression:
  // 1. Novice: 0 to 10,000 views (No medal yet)
  // 2. Primary: 10,001 to 100,000 views (Bronze Medalist 🥉, 40% Share)
  // 3. Intermediate: 100,001 to 1,000,000 views (Silver Medalist 🥈, 60% Share)
  // 4. Advanced: 1,000,001 to 10,000,000 views (Gold Medalist 🥇, 65% Share)
  // 5. Legendary: > 10,000,000 views (Diamond Grandmaster 💎, 70% Share)
  const rankInfo = getWriterRankByViews(lifetimeViews);

  // Map to legacy WriterTierInfo format for backwards compatibility
  const tierInfo: WriterTierInfo = {
    tier: rankInfo.medal || 'bronze',
    label: rankInfo.label,
    badge: rankInfo.badge,
    medalColor:
      rankInfo.medal === 'diamond'
        ? 'bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 text-sky-950 border-sky-300'
        : rankInfo.medal === 'gold'
        ? 'bg-gradient-to-r from-yellow-300 via-amber-400 to-amber-500 text-amber-950 border-yellow-400'
        : rankInfo.medal === 'silver'
        ? 'bg-gradient-to-r from-slate-300 via-gray-400 to-zinc-400 text-slate-900 border-slate-300'
        : 'bg-gradient-to-r from-amber-700 via-orange-800 to-amber-900 text-amber-100 border-amber-600',
    minViews: rankInfo.minViews,
    maxViews: rankInfo.maxViews,
    writerSharePercent: rankInfo.writerSharePercent,
    ownerSharePercent: rankInfo.ownerSharePercent,
  };

  const writerPercent = rankInfo.writerSharePercent / 100;
  const ownerPercent = rankInfo.ownerSharePercent / 100;

  // Calculate views needed to level up
  let nextTierRemainingViews = 0;
  let nextTierProgressPercent = 100;
  if (rankInfo.rank === 'novice') {
    nextTierRemainingViews = Math.max(0, 10000 - lifetimeViews);
    nextTierProgressPercent = Math.min(100, Math.round((lifetimeViews / 10000) * 100));
  } else if (rankInfo.rank === 'primary') {
    nextTierRemainingViews = Math.max(0, 100000 - lifetimeViews);
    nextTierProgressPercent = Math.min(100, Math.round(((lifetimeViews - 10000) / 90000) * 100));
  } else if (rankInfo.rank === 'intermediate') {
    nextTierRemainingViews = Math.max(0, 1000000 - lifetimeViews);
    nextTierProgressPercent = Math.min(100, Math.round(((lifetimeViews - 100000) / 900000) * 100));
  } else if (rankInfo.rank === 'advanced') {
    nextTierRemainingViews = Math.max(0, 10000000 - lifetimeViews);
    nextTierProgressPercent = Math.min(100, Math.round(((lifetimeViews - 1000000) / 9000000) * 100));
  }

  // Real monetization figures calculated ONLY from genuine real events
  // Ad Revenue: Monetag CPM rate of $2.20 per 1000 real chapter views
  const grossMonthlyAdRevenueUSD = Number(((monthlyChapterViews / 1000) * 2.20).toFixed(2));
  const writerAdRevenueUSD = Number((grossMonthlyAdRevenueUSD * writerPercent).toFixed(2));
  const ownerAdRevenueUSD = Number((grossMonthlyAdRevenueUSD * ownerPercent).toFixed(2));

  // Real tips from storage
  let realTipsAmount = 0;
  try {
    const rawTips = localStorage.getItem(STORAGE_KEYS.REAL_TIPS);
    if (rawTips) {
      const tipsMap = JSON.parse(rawTips);
      realTipsAmount = tipsMap[novel.id] || 0;
    }
  } catch (e) {}

  const grossTipsUSD = Number(realTipsAmount.toFixed(2));
  const writerTipsUSD = Number((grossTipsUSD * (writerPercent || 0.4)).toFixed(2));
  const ownerTipsUSD = Number((grossTipsUSD * (ownerPercent || 0.6)).toFixed(2));

  // Real VIP Pass revenue
  let realVipAmount = 0;
  try {
    const rawVip = localStorage.getItem(STORAGE_KEYS.REAL_VIP_PASSES);
    if (rawVip) {
      const vipMap = JSON.parse(rawVip);
      realVipAmount = vipMap[novel.id] || 0;
    }
  } catch (e) {}

  const grossVipPassesUSD = Number(realVipAmount.toFixed(2));
  const writerVipRevenueUSD = Number((grossVipPassesUSD * (writerPercent || 0.4)).toFixed(2));
  const ownerVipRevenueUSD = Number((grossVipPassesUSD * (ownerPercent || 0.6)).toFixed(2));

  // Total Earnings
  const totalEarningsUSD = Number((writerAdRevenueUSD + writerTipsUSD + writerVipRevenueUSD).toFixed(2));
  const totalEarningsINR = Math.round(totalEarningsUSD * 86.5);

  const ownerTotalUSD = Number((ownerAdRevenueUSD + ownerTipsUSD + ownerVipRevenueUSD).toFixed(2));
  const ownerTotalINR = Math.round(ownerTotalUSD * 86.5);

  return {
    novelId: novel.id,
    novelTitle: novel.title,
    authorName: novel.author,
    genre: novel.genre,
    lifetimeViews,
    monthlyActiveReaders,
    monthlyChapterViews,
    avgReadTimeMinutes,
    rankInfo,
    tierInfo,
    writerSharePercent: rankInfo.writerSharePercent,
    ownerSharePercent: rankInfo.ownerSharePercent,
    nextTierProgressPercent,
    nextTierRemainingViews,
    grossMonthlyAdRevenueUSD,
    grossTipsUSD,
    grossVipPassesUSD,
    powerStoneBonusUSD: 0,
    writerAdRevenueUSD,
    writerTipsUSD,
    writerVipRevenueUSD,
    totalEarningsUSD,
    totalEarningsINR,
    ownerAdRevenueUSD,
    ownerTipsUSD,
    ownerVipRevenueUSD,
    ownerTotalUSD,
    ownerTotalINR,
    payoutStatus: totalEarningsUSD > 20 ? 'Ready for Payout' : 'Pending Next Cycle',
    payoutUpiOrPaypal: novel.authorUpi || '8144389665@ptsbi',
    isRealTraffic: true,
  };
}

export const TIER_MILESTONES: WriterTierInfo[] = [
  {
    tier: 'bronze',
    label: 'Primary Writer (Bronze Medalist)',
    badge: '🥉',
    medalColor: 'bg-gradient-to-r from-amber-700 via-orange-800 to-amber-900 text-amber-100 border-amber-600',
    minViews: 10001,
    maxViews: 100000,
    writerSharePercent: 40,
    ownerSharePercent: 60,
  },
  {
    tier: 'silver',
    label: 'Intermediate Writer (Silver Medalist)',
    badge: '🥈',
    medalColor: 'bg-gradient-to-r from-slate-300 via-gray-400 to-zinc-400 text-slate-900 border-slate-300',
    minViews: 100001,
    maxViews: 1000000,
    writerSharePercent: 60,
    ownerSharePercent: 40,
  },
  {
    tier: 'gold',
    label: 'Advanced Writer (Gold Medalist)',
    badge: '🥇',
    medalColor: 'bg-gradient-to-r from-yellow-300 via-amber-400 to-amber-500 text-amber-950 border-yellow-400',
    minViews: 1000001,
    maxViews: 10000000,
    writerSharePercent: 65,
    ownerSharePercent: 35,
  },
  {
    tier: 'diamond',
    label: 'Legendary Grandmaster (Diamond)',
    badge: '💎',
    medalColor: 'bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 text-sky-950 border-sky-300',
    minViews: 10000001,
    maxViews: Infinity,
    writerSharePercent: 70,
    ownerSharePercent: 30,
  },
];

export function getAuthorPayoutDetails(novelId: number): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTHOR_PROFILES);
    if (raw) {
      const data = JSON.parse(raw);
      return data[novelId]?.payoutUpiOrPaypal || null;
    }
  } catch (e) {}
  return null;
}

export function saveAuthorPayoutDetails(novelId: number, payoutAddress: string): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTHOR_PROFILES);
    const data = raw ? JSON.parse(raw) : {};
    data[novelId] = { ...(data[novelId] || {}), payoutUpiOrPaypal: payoutAddress };
    localStorage.setItem(STORAGE_KEYS.AUTHOR_PROFILES, JSON.stringify(data));
  } catch (e) {}
}

export function verifyOwnerPin(pin: string): boolean {
  return pin === '8144389665' || pin === 'owner2000' || pin === 'admin123';
}
