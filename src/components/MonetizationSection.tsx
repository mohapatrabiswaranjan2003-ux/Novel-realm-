import React, { useState } from 'react';
import { Novel, Chapter } from '../types/novel';
import { Coffee, Sparkles, ExternalLink, ShieldCheck, Heart, Lock, ArrowRight } from 'lucide-react';
import { TipAuthorModal } from './TipAuthorModal';

interface MonetizationSectionProps {
  novel: Novel;
  chapter: Chapter;
}

export const MonetizationSection: React.FC<MonetizationSectionProps> = ({
  novel,
  chapter,
}) => {
  const [isTipOpen, setIsTipOpen] = useState(false);
  const [simulatedAdClicks, setSimulatedAdClicks] = useState(0);
  const [adClickedToast, setAdClickedToast] = useState(false);

  const handleAdClick = () => {
    setSimulatedAdClicks(prev => prev + 1);
    setAdClickedToast(true);
    setTimeout(() => setAdClickedToast(false), 3000);
  };

  return (
    <section className="my-10 space-y-8 font-clean-sans">
      
      {/* 1. Google AdSense / Sponsored Banner Slot */}
      <div className="relative rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] p-4 text-center overflow-hidden">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border-subtle)] text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-mono">
          <span>Sponsored Advertisement · Google AdSense Slot</span>
          <span>Ad Choice</span>
        </div>

        {/* Realistic High-Value Web Fiction Sponsor Banner (Audiobooks / Books) */}
        <div
          onClick={handleAdClick}
          className="cursor-pointer group relative p-4 rounded-lg bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-purple-900/10 hover:from-blue-900/20 hover:to-purple-900/20 transition-all border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
              🎧
            </div>
            <div>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
                Audible & WebNovels Partner
              </span>
              <h4 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-blue-600 transition-colors">
                Listen to 100,000+ Fantasy & Sci-Fi Audiobooks Free
              </h4>
              <p className="text-xs text-[var(--text-secondary)]">
                Start your 30-day free trial · Keep your books forever
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 group-hover:bg-blue-700 text-white text-xs font-semibold shadow-xs">
            <span>Claim Free Trial</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </div>

        {adClickedToast && (
          <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-mono animate-fade-in">
            ✓ Ad interaction registered! (CPC Revenue credited: +$0.45 USD)
          </div>
        )}

        <div className="mt-2 text-[10px] text-[var(--text-secondary)] opacity-60">
          Ad revenue supports free reading access for all readers worldwide.
        </div>
      </div>

      {/* 2. Reader Tip / Support the Author Box */}
      <div className="p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/5 to-transparent flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="space-y-1.5 max-w-md">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            <Coffee className="w-4 h-4" />
            <span>Support the Author</span>
          </div>
          <h3 className="font-display-title text-base sm:text-lg font-bold text-[var(--text-primary)]">
            Enjoyed Chapter {chapter.chapterNumber}? Buy {novel.author} a Coffee!
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Independent authors rely on community tips to write full-time. Even $1 motivates the release of upcoming chapters.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsTipOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm transition-all"
          >
            <Heart className="w-3.5 h-3.5 fill-current text-red-600" />
            <span>Tip $1 · Coffee</span>
          </button>
          <button
            onClick={() => setIsTipOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg border border-amber-500/40 hover:bg-amber-500/10 text-[var(--text-primary)] transition-all"
          >
            <span>Tip $3</span>
          </button>
          <button
            onClick={() => setIsTipOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg border border-amber-500/40 hover:bg-amber-500/10 text-[var(--text-primary)] transition-all"
          >
            <span>Tip $5</span>
          </button>
        </div>
      </div>

      {/* 3. Advance VIP Chapters Box */}
      <div className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              <span>Advance Chapters · Patreon VIP</span>
            </div>
            <h4 className="text-sm font-bold text-[var(--text-primary)]">
              Can't wait for Chapter {chapter.chapterNumber + 1}?
            </h4>
            <p className="text-xs text-[var(--text-secondary)]">
              Patreon tier members get access to 5+ draft chapters ahead of public release.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsTipOpen(true)}
          className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <span>Unlock Advance Drafts</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tip Modal */}
      <TipAuthorModal
        isOpen={isTipOpen}
        onClose={() => setIsTipOpen(false)}
        authorName={novel.author}
        novelTitle={novel.title}
      />

    </section>
  );
};
