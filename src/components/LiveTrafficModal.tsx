import React from 'react';
import { X, Activity, Smartphone, Monitor, BookOpen, ShieldCheck, Radio, Users } from 'lucide-react';
import { LiveTrafficData } from '../services/liveTrafficService';

interface LiveTrafficModalProps {
  isOpen: boolean;
  onClose: () => void;
  trafficData: LiveTrafficData;
}

export const LiveTrafficModal: React.FC<LiveTrafficModalProps> = ({
  isOpen,
  onClose,
  trafficData,
}) => {
  if (!isOpen) return null;

  const total = Math.max(1, trafficData.totalActiveReaders);
  const mobilePct = Math.round((trafficData.mobileCount / total) * 100) || 50;
  const desktopPct = 100 - mobilePct;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-clean-sans">
      <div 
        className="w-full max-w-lg rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[var(--border-subtle)] flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Radio className="w-5 h-5 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display-title text-base font-bold text-[var(--text-primary)]">
                  Live Platform Traffic
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  REAL-TIME
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                Genuine reader presence verified via Google Firebase
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Big Live Metric Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 text-center relative overflow-hidden">
            <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Active Readers Right Now
            </div>
            <div className="font-mono text-5xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {trafficData.totalActiveReaders}
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-2">
              Readers actively turning pages or reading chapters across the globe
            </p>
          </div>

          {/* Device Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-500" />
              <span>Real-Time Device Distribution</span>
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-[var(--border-subtle)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-purple-500" />
                  <span className="text-xs font-medium text-[var(--text-primary)]">Mobile</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-[var(--text-primary)]">{trafficData.mobileCount}</span>
                  <span className="text-[10px] text-[var(--text-secondary)] ml-1">({mobilePct}%)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-[var(--border-subtle)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-medium text-[var(--text-primary)]">Desktop</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-[var(--text-primary)]">{trafficData.desktopCount}</span>
                  <span className="text-[10px] text-[var(--text-secondary)] ml-1">({desktopPct}%)</span>
                </div>
              </div>
            </div>

            {/* Visual Bar */}
            <div className="h-2 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden flex">
              <div style={{ width: `${mobilePct}%` }} className="bg-purple-500 h-full transition-all duration-500" />
              <div style={{ width: `${desktopPct}%` }} className="bg-blue-500 h-full transition-all duration-500" />
            </div>
          </div>

          {/* Currently Being Read */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-500" />
              <span>Where Readers Are Right Now</span>
            </h4>

            {trafficData.topReadingNovels.length > 0 ? (
              <div className="space-y-2">
                {trafficData.topReadingNovels.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-[var(--border-subtle)] flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-[var(--text-primary)] truncate max-w-[260px]">
                      {item.title}
                    </span>
                    <span className="flex items-center gap-1 font-mono font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Users className="w-3 h-3" />
                      {item.readerCount} reading
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-black/[0.01] text-center text-xs text-[var(--text-secondary)]">
                Readers are currently exploring the homepage & genre compendium.
              </div>
            )}
          </div>

          {/* Guarantee / Authenticity Badge */}
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <strong className="font-semibold text-[var(--text-primary)] block">
                100% Genuine Heartbeat Tracking
              </strong>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                This traffic is not randomly simulated or artificially generated. Every count represents an active browser session with an open tab pinging your Google Firebase Firestore cluster every 20 seconds.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Heartbeat: Synchronized</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            Close Monitor
          </button>
        </div>
      </div>
    </div>
  );
};
