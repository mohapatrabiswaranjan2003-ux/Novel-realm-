import React, { useState, useMemo } from 'react';
import { Novel } from '../types/novel';
import {
  X,
  Users,
  DollarSign,
  TrendingUp,
  Award,
  Lock,
  Unlock,
  ShieldCheck,
  CheckCircle2,
  Wallet,
  Sparkles,
  ArrowRight,
  Eye,
  Clock,
  HelpCircle,
  Gem,
  ChevronRight,
  Zap,
} from 'lucide-react';
import {
  getNovelMonthlyMetrics,
  saveAuthorPayoutDetails,
  getAuthorPayoutDetails,
  AuthorEarningsData,
  TIER_MILESTONES,
} from '../utils/authorEarningsStorage';

import { UserAccount } from '../types/auth';

interface AuthorEarningsModalProps {
  isOpen: boolean;
  onClose: () => void;
  novels: Novel[];
  currentNovelId?: number;
  currentUser?: UserAccount | null;
  onOpenCertificationExam?: () => void;
}

export const AuthorEarningsModal: React.FC<AuthorEarningsModalProps> = ({
  isOpen,
  onClose,
  novels,
  currentNovelId,
  currentUser,
  onOpenCertificationExam,
}) => {
  const [selectedNovelId, setSelectedNovelId] = useState<number>(() => {
    return currentNovelId || novels[0]?.id || 1;
  });

  // Owner vs Writer Mode
  const [isOwnerMode, setIsOwnerMode] = useState(false);
  const [ownerKeyInput, setOwnerKeyInput] = useState('');
  const [ownerKeyError, setOwnerKeyError] = useState(false);
  const [showKeyPrompt, setShowKeyPrompt] = useState(false);

  // Author Payout Address
  const [payoutInput, setPayoutInput] = useState('');
  const [payoutSavedToast, setPayoutSavedToast] = useState(false);

  // Selected Novel Metrics
  const activeNovel = useMemo(() => {
    return novels.find((n) => n.id === selectedNovelId) || novels[0];
  }, [novels, selectedNovelId]);

  const metrics: AuthorEarningsData | null = useMemo(() => {
    if (!activeNovel) return null;
    const m = getNovelMonthlyMetrics(activeNovel);
    const customPayout = getAuthorPayoutDetails(activeNovel.id);
    if (customPayout) m.payoutUpiOrPaypal = customPayout;
    return m;
  }, [activeNovel]);

  // Aggregate All Novels for Owner Mode
  const allNovelsMetrics = useMemo(() => {
    return novels.map((n) => getNovelMonthlyMetrics(n));
  }, [novels]);

  const platformTotals = useMemo(() => {
    const totalMonthlyReaders = allNovelsMetrics.reduce((acc, m) => acc + m.monthlyActiveReaders, 0);
    const totalMonthlyViews = allNovelsMetrics.reduce((acc, m) => acc + m.monthlyChapterViews, 0);
    const totalAuthorPayoutsUSD = allNovelsMetrics.reduce((acc, m) => acc + m.totalEarningsUSD, 0);
    const totalOwnerProfitUSD = allNovelsMetrics.reduce((acc, m) => acc + m.ownerTotalUSD, 0);
    const grossPlatformRevenueUSD = Number((totalAuthorPayoutsUSD + totalOwnerProfitUSD).toFixed(2));

    return {
      totalMonthlyReaders,
      totalMonthlyViews,
      totalAuthorPayoutsUSD: Number(totalAuthorPayoutsUSD.toFixed(2)),
      totalOwnerProfitUSD: Number(totalOwnerProfitUSD.toFixed(2)),
      grossPlatformRevenueUSD,
      totalAuthorPayoutsINR: Math.round(totalAuthorPayoutsUSD * 84),
      totalOwnerProfitINR: Math.round(totalOwnerProfitUSD * 84),
    };
  }, [allNovelsMetrics]);

  if (!isOpen) return null;

  const handleUnlockOwner = (e: React.FormEvent) => {
    e.preventDefault();
    // Verification passkey for website owner (biswaranjanmohapatra2000@gmail.com)
    if (ownerKeyInput.trim().toLowerCase() === 'owner2000' || ownerKeyInput.trim() === '8144389665') {
      setIsOwnerMode(true);
      setShowKeyPrompt(false);
      setOwnerKeyError(false);
    } else {
      setOwnerKeyError(true);
    }
  };

  const handleSavePayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutInput.trim() || !activeNovel) return;
    saveAuthorPayoutDetails(activeNovel.id, payoutInput.trim());
    setPayoutSavedToast(true);
    setTimeout(() => setPayoutSavedToast(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in font-clean-sans">
      <div
        className="w-full max-w-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        role="dialog"
        aria-label="Author Revenue & Monthly Readers Dashboard"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[var(--border-subtle)] flex items-center justify-between shrink-0 bg-black/[0.02] dark:bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display-title text-lg font-bold">
                  {isOwnerMode ? 'Website Owner Platform Earnings' : 'Writer Medal Rank & Revenue Studio'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  Private & Confidential
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                {isOwnerMode
                  ? 'Owner administration overview: Tiered commission and payouts'
                  : 'Track monthly views, medal rank & tiered royalty income'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Owner Mode */}
            {!isOwnerMode ? (
              <button
                type="button"
                onClick={() => setShowKeyPrompt(!showKeyPrompt)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                title="Enter Owner Passkey"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Owner Portal</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsOwnerMode(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Switch to Writer View</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Owner Key Unlock Prompt */}
        {showKeyPrompt && !isOwnerMode && (
          <form
            onSubmit={handleUnlockOwner}
            className="p-3 bg-amber-500/10 border-b border-amber-500/20 flex flex-wrap items-center justify-between gap-3 text-xs animate-fade-in"
          >
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <Lock className="w-4 h-4" />
              <span>Enter Website Owner PIN (e.g. <code>owner2000</code> or your mobile number):</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="password"
                value={ownerKeyInput}
                onChange={(e) => setOwnerKeyInput(e.target.value)}
                placeholder="Owner PIN..."
                className="px-2.5 py-1 text-xs rounded border border-amber-500/30 bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1 rounded bg-amber-600 text-white font-bold text-xs"
              >
                Unlock Owner Mode
              </button>
              <button
                type="button"
                onClick={() => setShowKeyPrompt(false)}
                className="text-[11px] text-[var(--text-secondary)] hover:underline ml-1"
              >
                Cancel
              </button>
            </div>
            {ownerKeyError && (
              <div className="w-full text-red-500 font-semibold text-[11px]">
                Invalid key. Hint: use <code>owner2000</code> or your mobile UPI <code>8144389665</code>.
              </div>
            )}
          </form>
        )}

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* OWNER MODE OVERVIEW */}
          {isOwnerMode ? (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Platform Financials & Tiered Commission</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  You earn <strong>60% from Bronze</strong>, <strong>40% from Silver</strong>, <strong>35% from Gold</strong>, and <strong>30% from Diamond</strong> writers on all novel monthly view impressions and reader tips!
                </p>
              </div>

              {/* Owner high-level cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] space-y-1">
                  <span className="text-[11px] text-[var(--text-secondary)]">Total Monthly Readers</span>
                  <div className="text-xl font-bold font-mono text-[var(--text-primary)]">
                    {platformTotals.totalMonthlyReaders.toLocaleString()}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] space-y-1">
                  <span className="text-[11px] text-[var(--text-secondary)]">Monthly Chapter Views</span>
                  <div className="text-xl font-bold font-mono text-[var(--text-primary)]">
                    {platformTotals.totalMonthlyViews.toLocaleString()}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-1">
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Total Writer Payouts</span>
                  <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    ${platformTotals.totalAuthorPayoutsUSD}
                  </div>
                  <span className="text-[10px] text-[var(--text-secondary)]">
                    ~₹{platformTotals.totalAuthorPayoutsINR.toLocaleString()} INR
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-1">
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">Your Platform Profit</span>
                  <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400">
                    ${platformTotals.totalOwnerProfitUSD}
                  </div>
                  <span className="text-[10px] text-[var(--text-secondary)]">
                    ~₹{platformTotals.totalOwnerProfitINR.toLocaleString()} INR
                  </span>
                </div>
              </div>

              {/* All authors breakdown table with Medals */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  Author Roster, Medal Tiers & Commission Cuts
                </h4>
                <div className="border border-[var(--border-subtle)] rounded-xl overflow-hidden divide-y divide-[var(--border-subtle)]">
                  {allNovelsMetrics.map((nov) => (
                    <div key={nov.novelId} className="p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                      <div className="min-w-0 flex items-center gap-2.5">
                        <span className="text-xl shrink-0" role="img" aria-label={nov.tierInfo.label}>
                          {nov.tierInfo.badge}
                        </span>
                        <div>
                          <strong className="block text-[var(--text-primary)] font-semibold truncate">{nov.novelTitle}</strong>
                          <span className="text-[11px] text-[var(--text-secondary)]">
                            {nov.authorName} · {nov.tierInfo.label} ({nov.lifetimeViews.toLocaleString()} views)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-5 text-right shrink-0">
                        <div>
                          <span className="text-[10px] text-[var(--text-secondary)] block">Split (Writer / You)</span>
                          <span className="font-mono font-bold text-[var(--text-primary)]">
                            {nov.writerSharePercent}% / {nov.ownerSharePercent}%
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[var(--text-secondary)] block">Your Commission</span>
                          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                            ${nov.ownerTotalUSD} (₹{nov.ownerTotalINR})
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[var(--text-secondary)] block">Writer Receives</span>
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            ${nov.totalEarningsUSD} (₹{nov.totalEarningsINR})
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* WRITER VIEW */
            <div className="space-y-6">
              
              {/* WRITER CERTIFICATION STATUS & ORIGINAL TRAFFIC BANNER */}
              {currentUser?.role === 'writer' && (
                <div className="space-y-2">
                  {currentUser.isCertifiedWriter ? (
                    <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <div>
                          <strong className="text-emerald-800 dark:text-emerald-300 block">
                            Official Certified Writer · Pen Name: {currentUser.penName}
                          </strong>
                          <span className="text-[11px] text-[var(--text-secondary)]">
                            Certificate ID: <code className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{currentUser.writerCertification?.certificateId}</code> · Rank: <span className="font-bold">🌱 Novice Writer</span>
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold uppercase shrink-0">
                        Certified
                      </span>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <Award className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                        <div>
                          <strong className="text-amber-800 dark:text-amber-300 block">
                            Writer Certification Exam Required
                          </strong>
                          <span className="text-[11px] text-[var(--text-secondary)]">
                            Take our short 1,500-word genre exam to certify your storytelling skill and unlock full publisher rank privileges.
                          </span>
                        </div>
                      </div>
                      {onOpenCertificationExam && (
                        <button
                          onClick={onOpenCertificationExam}
                          className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 shadow-sm"
                        >
                          Take Certification Exam
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* REAL VERIFIED TRAFFIC BADGE */}
              <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-[var(--text-primary)]">
                    100% Original & Real Traffic
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)]">
                    (Zero simulated/fake traffic · Verified real device readers)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                  Live Counter Active
                </span>
              </div>

              {/* Novel Selector for Writer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  Select Your Published Novel:
                </label>
                <select
                  value={selectedNovelId}
                  onChange={(e) => setSelectedNovelId(Number(e.target.value))}
                  className="px-3 py-1.5 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {novels.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.title} (by {n.author})
                    </option>
                  ))}
                </select>
              </div>

              {metrics && (
                <>
                  {/* WRITER MEDAL BADGE & TIER CARD */}
                  <div className="p-4 sm:p-5 rounded-2xl border border-[var(--border-subtle)] bg-gradient-to-r from-black/[0.03] via-transparent to-black/[0.03] dark:from-white/[0.03] dark:to-white/[0.03] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                          {metrics.tierInfo.badge}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-[var(--text-primary)]">
                              {metrics.tierInfo.label}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30">
                              {metrics.writerSharePercent}% Writer Royalty Split
                            </span>
                          </div>
                          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                            Total Views: <strong className="text-[var(--text-primary)] font-mono">{metrics.lifetimeViews.toLocaleString()}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider block">
                          Current Revenue Share
                        </span>
                        <div className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
                          {metrics.writerSharePercent}% <span className="text-xs font-normal text-[var(--text-secondary)]">(Writer)</span> / {metrics.ownerSharePercent}% <span className="text-xs font-normal text-[var(--text-secondary)]">(Platform)</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress to Next Medal Tier */}
                    {metrics.tierInfo.tier !== 'diamond' ? (
                      <div className="space-y-1.5 pt-2 border-t border-[var(--border-subtle)]">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[var(--text-secondary)]">
                            Progress toward{' '}
                            <strong>
                              {metrics.tierInfo.tier === 'bronze'
                                ? '🥈 Silver Medal (60% Share)'
                                : metrics.tierInfo.tier === 'silver'
                                ? '🥇 Gold Medal (65% Share)'
                                : '💎 Diamond Medal (70% Share)'}
                            </strong>
                          </span>
                          <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                            {metrics.nextTierRemainingViews.toLocaleString()} views needed
                          </span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${metrics.nextTierProgressPercent}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-[var(--border-subtle)] text-xs text-sky-600 dark:text-sky-400 font-semibold flex items-center gap-1.5">
                        <Gem className="w-4 h-4" />
                        <span>Maximum Diamond Level achieved! You receive the top 70% revenue share tier.</span>
                      </div>
                    )}
                  </div>

                  {/* CORE PERFORMANCE CARDS */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {/* Monthly Active Readers */}
                    <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-medium">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span>Active Readers</span>
                      </div>
                      <div className="font-display-title text-2xl font-bold font-mono text-[var(--text-primary)]">
                        {metrics.monthlyActiveReaders.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" />
                        <span>This Month</span>
                      </span>
                    </div>

                    {/* Monthly Chapter Views */}
                    <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-medium">
                        <Eye className="w-4 h-4 text-purple-500" />
                        <span>Monthly Views</span>
                      </div>
                      <div className="font-display-title text-2xl font-bold font-mono text-[var(--text-primary)]">
                        {metrics.monthlyChapterViews.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-[var(--text-secondary)]">
                        ~{metrics.avgReadTimeMinutes} min avg read
                      </span>
                    </div>

                    {/* Total Estimated Earnings USD */}
                    <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        <DollarSign className="w-4 h-4 text-emerald-500" />
                        <span>Your Take-Home</span>
                      </div>
                      <div className="font-display-title text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        ${metrics.totalEarningsUSD}
                      </div>
                      <span className="text-[10px] text-[var(--text-secondary)] font-mono">
                        ≈ ₹{metrics.totalEarningsINR.toLocaleString()} INR
                      </span>
                    </div>

                    {/* Platform Share Kept */}
                    <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-medium">
                        <ShieldCheck className="w-4 h-4 text-blue-500" />
                        <span>Platform Share</span>
                      </div>
                      <div className="font-display-title text-2xl font-bold font-mono text-[var(--text-primary)]">
                        ${metrics.ownerTotalUSD}
                      </div>
                      <span className="text-[10px] text-[var(--text-secondary)]">
                        {metrics.ownerSharePercent}% website upkeep
                      </span>
                    </div>
                  </div>

                  {/* HOW WRITERS EARN FROM YOUR WEBSITE (Detailed breakdown by tier) */}
                  <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4">
                    <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                      <div>
                        <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                          Earnings Breakdown for "{activeNovel.title}"
                        </h4>
                        <p className="text-[11px] text-[var(--text-secondary)]">
                          Calculated at your {metrics.tierInfo.label} rate ({metrics.writerSharePercent}% Writer / {metrics.ownerSharePercent}% Owner)
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        {metrics.payoutStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      {/* 1. Monthly Views Ad Revenue */}
                      <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[var(--text-primary)]">1. Monthly Views & Ads</span>
                          <span className="font-bold text-emerald-600">{metrics.writerSharePercent}%</span>
                        </div>
                        <div className="text-base font-bold font-mono text-[var(--text-primary)]">
                          ${metrics.writerAdRevenueUSD}
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                          Your {metrics.writerSharePercent}% share from {metrics.monthlyChapterViews.toLocaleString()} monthly chapter impressions.
                        </p>
                      </div>

                      {/* 2. Reader Tips */}
                      <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[var(--text-primary)]">2. Reader Tips</span>
                          <span className="font-bold text-emerald-600">{metrics.writerSharePercent}%</span>
                        </div>
                        <div className="text-base font-bold font-mono text-[var(--text-primary)]">
                          ${metrics.writerTipsUSD}
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                          Tips given by readers directly on this novel split according to your medal tier.
                        </p>
                      </div>

                      {/* 3. VIP Chapter Passes & Bonus */}
                      <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[var(--text-primary)]">3. VIP Passes & Bonus</span>
                          <span className="font-bold text-emerald-600">{metrics.writerSharePercent}%</span>
                        </div>
                        <div className="text-base font-bold font-mono text-[var(--text-primary)]">
                          ${(metrics.writerVipRevenueUSD + metrics.powerStoneBonusUSD).toFixed(2)}
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                          Advance VIP chapter pass unlocks and leaderboard Power Stone prizes.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* OFFICIAL WRITER TIER & REVENUE SHARING ROADMAP */}
                  <div className="p-4 sm:p-5 rounded-2xl border border-[var(--border-subtle)] bg-black/[0.01] dark:bg-white/[0.01] space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span>Official Writer Medal Ranking & Revenue Roadmap</span>
                      </h4>
                      <span className="text-[10px] text-[var(--text-secondary)]">Automated Upgrades</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
                      {TIER_MILESTONES.map((tm) => {
                        const isCurrent = metrics.tierInfo.tier === tm.tier;
                        return (
                          <div
                            key={tm.tier}
                            className={`p-3 rounded-xl border transition-all ${
                              isCurrent
                                ? 'border-amber-500 bg-amber-500/10 shadow-xs ring-1 ring-amber-500'
                                : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] opacity-80'
                            }`}
                          >
                            <div className="flex items-center justify-between pb-1">
                              <span className="text-2xl">{tm.badge}</span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500 text-white">
                                  Your Rank
                                </span>
                              )}
                            </div>
                            <strong className="block text-xs font-bold text-[var(--text-primary)] mt-1">
                              {tm.label}
                            </strong>
                            <span className="text-[10px] text-[var(--text-secondary)] block">
                              {tm.maxViews === Infinity ? 'Above 10M views' : `Up to ${tm.maxViews.toLocaleString()} views`}
                            </span>
                            <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                              {tm.writerSharePercent}% Writer / {tm.ownerSharePercent}% Owner
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Author Payout Settings (UPI / PayPal) */}
                  <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[var(--text-primary)]">
                        Author Royalty Payout Destination (UPI / PayPal / Bank)
                      </span>
                      <span className="text-[11px] text-blue-600 dark:text-blue-400 font-mono">
                        Current: {metrics.payoutUpiOrPaypal}
                      </span>
                    </div>

                    <form onSubmit={handleSavePayout} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={payoutInput}
                        onChange={(e) => setPayoutInput(e.target.value)}
                        placeholder="Enter your UPI ID (e.g. yourname@oksbi) or PayPal email"
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        disabled={!payoutInput.trim()}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold disabled:opacity-50 transition-colors shadow-xs"
                      >
                        Update Payout Address
                      </button>
                    </form>

                    {payoutSavedToast && (
                      <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] animate-fade-in">
                        ✓ Payout address saved successfully! Your monthly earnings will be disbursed here.
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between shrink-0 text-xs">
          <span className="text-[11px] text-[var(--text-secondary)]">
            Payout threshold: $10 (₹840) · Disbursed every 1st of the month
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
