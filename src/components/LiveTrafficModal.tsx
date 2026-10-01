import React, { useState } from 'react';
import { X, Activity, Smartphone, Monitor, BookOpen, ShieldCheck, Radio, Users, Lock, KeyRound } from 'lucide-react';
import { LiveTrafficData } from '../services/liveTrafficService';
import { UserAccount } from '../types/auth';
import { checkIsOwner, verifyOwnerPasskey, OWNER_EMAIL } from '../utils/ownerAuth';

interface LiveTrafficModalProps {
  isOpen: boolean;
  onClose: () => void;
  trafficData: LiveTrafficData;
  currentUser?: UserAccount | null;
}

export const LiveTrafficModal: React.FC<LiveTrafficModalProps> = ({
  isOpen,
  onClose,
  trafficData,
  currentUser,
}) => {
  const [passkeyInput, setPasskeyInput] = useState('');
  const [passkeyError, setPasskeyError] = useState(false);
  const [unlockedState, setUnlockedState] = useState(false);

  if (!isOpen) return null;

  const isOwner = unlockedState || checkIsOwner(currentUser);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyOwnerPasskey(passkeyInput)) {
      setUnlockedState(true);
      setPasskeyError(false);
    } else {
      setPasskeyError(true);
    }
  };

  // If not owner, display confidential owner gate
  if (!isOwner) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200 font-clean-sans">
        <div 
          className="w-full max-w-md rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b border-[var(--border-subtle)] flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display-title text-base font-bold text-[var(--text-primary)]">
                  Founder Confidential Access
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Live traffic radar is strictly restricted to the platform owner.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleUnlock} className="p-6 space-y-4">
            <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-[var(--text-secondary)] leading-relaxed">
              Real-time reader telemetry, Firebase connection pulses, and platform activity data are private to <strong className="text-[var(--text-primary)]">{OWNER_EMAIL}</strong>.
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                <span>Enter Owner Passkey</span>
              </label>
              <input
                type="password"
                value={passkeyInput}
                onChange={(e) => {
                  setPasskeyInput(e.target.value);
                  setPasskeyError(false);
                }}
                placeholder="Owner secret passkey..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-amber-500"
                autoFocus
              />
              {passkeyError && (
                <p className="text-[11px] text-red-500 font-medium">
                  Incorrect passkey. Access is restricted to the platform owner.
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-xs"
              >
                Unlock Radar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

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
                  OWNER ONLY
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                Confidential founder radar verified via Google Firebase
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
          {/* Main Counter Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Activity className="w-4 h-4 animate-spin" />
              <span>Current Active Readers Worldwide</span>
            </div>
            <div className="text-5xl font-mono font-extrabold text-[var(--text-primary)] tracking-tight">
              {trafficData.totalActiveReaders}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Online right now across the platform</span>
            </div>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-[var(--text-secondary)] font-medium">Mobile Phones</div>
                <div className="text-lg font-bold font-mono text-[var(--text-primary)]">
                  {trafficData.mobileCount}{' '}
                  <span className="text-xs font-normal text-[var(--text-secondary)]">({mobilePct}%)</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 shrink-0">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-[var(--text-secondary)] font-medium">Desktop & Tablets</div>
                <div className="text-lg font-bold font-mono text-[var(--text-primary)]">
                  {trafficData.desktopCount}{' '}
                  <span className="text-xs font-normal text-[var(--text-secondary)]">({desktopPct}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Novels Currently Being Read */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
              <span>Where Readers Are Reading Right Now</span>
            </h4>

            {trafficData.topReadingNovels && trafficData.topReadingNovels.length > 0 ? (
              <div className="space-y-2">
                {trafficData.topReadingNovels.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-[var(--border-subtle)] bg-black/[0.01] dark:bg-white/[0.01] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold font-mono flex items-center justify-center text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-[var(--text-primary)] truncate">
                        {item.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      <Users className="w-3.5 h-3.5" />
                      <span>{item.readerCount} reading</span>
                    </div>
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
                This traffic is verified reader activity. Every count represents an active browser session with an open tab pinging your Google Firebase Firestore cluster every 20 seconds.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Founder Heartbeat: Synchronized</span>
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
