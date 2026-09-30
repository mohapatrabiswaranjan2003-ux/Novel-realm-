import React, { useState } from 'react';
import { ReadingStats } from '../utils/readingStorage';
import {
  X,
  Flame,
  BookOpen,
  Clock,
  Award,
  Compass,
  Users,
  Eye,
  TrendingUp,
  Activity,
  Globe,
  ExternalLink,
  Share2,
} from 'lucide-react';
import { getWebsiteMonthlyTraffic } from '../utils/communityStorage';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: ReadingStats;
  totalNovelsCount: number;
  inProgressCount: number;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  totalNovelsCount,
  inProgressCount,
}) => {
  const [activeTab, setActiveTab] = useState<'reading' | 'traffic'>('traffic');

  if (!isOpen) return null;

  const readingHours = (stats.totalWordsRead / 220 / 60).toFixed(1);
  const bookEquivalents = (stats.totalWordsRead / 60000).toFixed(2);
  const traffic = getWebsiteMonthlyTraffic();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-clean-sans">
      <div
        className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-2xl shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto flex flex-col"
        role="dialog"
        aria-label="Platform Statistics"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Activity className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-display-title text-lg font-bold">Analytics & Statistics</h3>
              <p className="text-[11px] text-[var(--text-secondary)]">Traffic insights & reading habits</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 mt-4 p-1 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] border border-[var(--border-subtle)] text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('traffic')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'traffic'
                ? 'bg-[var(--bg-surface)] text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Monthly Visitors & Traffic</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reading')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'reading'
                ? 'bg-[var(--bg-surface)] text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>My Reading Habits</span>
          </button>
        </div>

        {/* TAB 1: Monthly Visitors & Traffic */}
        {activeTab === 'traffic' && (
          <div className="mt-5 space-y-5 animate-fade-in">
            {/* Live active reader highlight banner */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)]">
                    {traffic.activeReadersNow} Readers Live Now
                  </h4>
                  <p className="text-[10px] text-[var(--text-secondary)]">Reading novels across all genres right now</p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                Live
              </span>
            </div>

            {/* 3 Main Traffic Metric Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">Monthly Visitors</span>
                </div>
                <div className="font-display-title text-2xl font-bold font-mono text-[var(--text-primary)]">
                  {traffic.monthlyVisitors.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <TrendingUp className="w-3 h-3" />
                  <span>+{traffic.growthRatePercent}% vs last month</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                  <Eye className="w-4 h-4 text-purple-500" />
                  <span className="font-medium">Monthly Page Views</span>
                </div>
                <div className="font-display-title text-2xl font-bold font-mono text-[var(--text-primary)]">
                  {traffic.monthlyPageViews.toLocaleString()}
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  ~4.2 chapters per reader session
                </p>
              </div>
            </div>

            {/* Daily Views this week */}
            <div className="p-4 rounded-xl border border-[var(--border-subtle)] space-y-3 bg-[var(--bg-surface)]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[var(--text-primary)]">Daily Traffic Trend (This Week)</span>
                <span className="text-[10px] text-[var(--text-secondary)] font-mono">{traffic.currentMonthName}</span>
              </div>

              <div className="flex items-end justify-between gap-2 h-20 pt-2 border-b border-[var(--border-subtle)] pb-1">
                {traffic.dailyViewsThisWeek.map((d) => {
                  const maxView = 850;
                  const heightPercent = Math.max(15, Math.round((d.views / maxView) * 100));
                  return (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-1 group">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-blue-500 hover:bg-blue-600 rounded-t-sm transition-all"
                        title={`${d.day}: ${d.views} views`}
                      />
                      <span className="text-[10px] text-[var(--text-secondary)] font-mono">{d.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Traffic Sources */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Reader Traffic Channels
              </span>
              <div className="space-y-2">
                {traffic.topReferrers.map((ref) => (
                  <div key={ref.source} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-[var(--text-primary)] font-medium">{ref.source}</span>
                      <span className="font-mono text-[var(--text-secondary)]">{ref.percent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${ref.percent}%` }}
                        className="h-full bg-blue-600 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monetag Official Dashboard Link */}
            <div className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/5 text-xs text-[var(--text-secondary)] flex items-start gap-3">
              <Globe className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold text-[var(--text-primary)]">Official Monetag Statistics:</span>
                <p className="text-[11px] leading-relaxed">
                  Your connected Monetag dashboard tracks official ad impressions, countries, and live earnings.
                </p>
                <a
                  href="https://mcp.monetag.com/statistics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold hover:underline pt-0.5"
                >
                  <span>Open Monetag Statistics Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Personal Reading Habits */}
        {activeTab === 'reading' && (
          <div className="mt-5 space-y-6 animate-fade-in">
            {/* Main 4 stat cards */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-medium">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span>Words Read</span>
                </div>
                <div className="font-display-title text-2xl font-bold font-mono tabular-nums text-[var(--text-primary)]">
                  {stats.totalWordsRead.toLocaleString()}
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  ~{bookEquivalents} novel equivalent
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-medium">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  <span>Reading Time</span>
                </div>
                <div className="font-display-title text-2xl font-bold font-mono tabular-nums text-[var(--text-primary)]">
                  {readingHours} <span className="text-sm font-normal">hrs</span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Paced at 220 words / min
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-medium">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>Day Streak</span>
                </div>
                <div className="font-display-title text-2xl font-bold font-mono tabular-nums text-[var(--text-primary)]">
                  {stats.readingStreakDays} <span className="text-sm font-normal">day{stats.readingStreakDays === 1 ? '' : 's'}</span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Consecutive active days
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-medium">
                  <Compass className="w-4 h-4 text-purple-500" />
                  <span>Chapters Done</span>
                </div>
                <div className="font-display-title text-2xl font-bold font-mono tabular-nums text-[var(--text-primary)]">
                  {stats.chaptersCompleted}
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Across {inProgressCount} active serials
                </p>
              </div>
            </div>

            {/* Reading Tip banner */}
            <div className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/5 text-xs text-[var(--text-secondary)] space-y-1">
              <span className="font-semibold text-[var(--text-primary)]">Reader Pro-Tip:</span>
              <p>
                Use the <span className="font-medium text-blue-600 dark:text-blue-400">Bionic Reading mode</span> in the display drawer to train your brain to scan web fiction 25–40% faster with higher retention.
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
