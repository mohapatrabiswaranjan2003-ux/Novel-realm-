import React from 'react';
import { X, Shield, BookOpen, DollarSign, Award, Mail } from 'lucide-react';

interface AboutPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'about' | 'privacy' | 'monetization';
}

export const AboutPolicyModal: React.FC<AboutPolicyModalProps> = ({
  isOpen,
  onClose,
  type,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-clean-sans">
      <div
        className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[85vh] flex flex-col"
        role="dialog"
      >
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4 shrink-0">
          <div className="flex items-center gap-2">
            {type === 'privacy' && <Shield className="w-5 h-5 text-blue-500" />}
            {type === 'about' && <BookOpen className="w-5 h-5 text-amber-500" />}
            {type === 'monetization' && <DollarSign className="w-5 h-5 text-emerald-500" />}
            <h3 className="font-display-title text-base sm:text-lg font-bold">
              {type === 'about' && 'About NovelRealm'}
              {type === 'privacy' && 'Privacy Policy & Cookies'}
              {type === 'monetization' && 'Author Earnings & Ad Disclosure'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 overflow-y-auto space-y-4 text-xs text-[var(--text-secondary)] leading-relaxed pr-1">
          {type === 'about' && (
            <>
              <p>
                <strong className="text-[var(--text-primary)]">NovelRealm</strong> is an independent digital fiction platform dedicated to serial web novels across High Fantasy, LitRPG, Sci-Fi, Cultivation, and Dark Romance.
              </p>
              <h4 className="font-bold text-[var(--text-primary)] text-sm pt-2">Our Mission</h4>
              <p>
                To provide a distraction-free, beautifully typeset reading experience with Bionic reading modes, realistic text-to-speech audio narration, and instant offline chapter bookmarking.
              </p>
              <h4 className="font-bold text-[var(--text-primary)] text-sm pt-2">For Authors & Creators</h4>
              <p>
                We believe creators should own their stories and earn directly from their audience through cost-per-click advertising, direct reader coffees, and advance VIP draft releases.
              </p>
            </>
          )}

          {type === 'privacy' && (
            <>
              <p>
                At NovelRealm, we respect your privacy. This policy describes how data is handled across our web novel reader.
              </p>
              <h4 className="font-bold text-[var(--text-primary)] text-sm pt-2">1. Local Reading Storage</h4>
              <p>
                Your reading progress, bookmarks, dark/light theme choices, and font sizes are saved locally on your device using browser LocalStorage. We do not track personal identifying information without your consent.
              </p>
              <h4 className="font-bold text-[var(--text-primary)] text-sm pt-2">2. Google AdSense & Third-Party Cookies</h4>
              <p>
                Third-party vendors, including Google, use cookies to serve ads based on prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads based on your visit. Users may opt out of personalized advertising by visiting Google Ads Settings.
              </p>
              <h4 className="font-bold text-[var(--text-primary)] text-sm pt-2">3. Contact</h4>
              <p>
                For questions regarding story copyright, DMCA notices, or privacy queries, contact the NovelRealm administrative team.
              </p>
            </>
          )}

          {type === 'monetization' && (
            <>
              <p>
                NovelRealm supports creators and covers hosting infrastructure through ethical monetization practices and an official tiered Writer Partner Program:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-[var(--text-primary)]">Tiered Writer Partner Program:</strong> Writers receive transparent revenue splits based on their novel's performance milestones:
                  <ul className="list-circle pl-5 mt-1 space-y-1 text-[11px] text-[var(--text-secondary)]">
                    <li>🥉 <strong>Bronze Medal (Up to 100K Views):</strong> 40% Writer / 60% Platform</li>
                    <li>🥈 <strong>Silver Medal (100K to 1M Views):</strong> 60% Writer / 40% Platform</li>
                    <li>🥇 <strong>Gold Medal (1M to 10M Views):</strong> 65% Writer / 35% Platform</li>
                    <li>💎 <strong>Diamond Grandmaster (&gt;10M Views):</strong> 70% Writer / 30% Platform</li>
                  </ul>
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Sponsor & Ad Placements:</strong> Non-intrusive ad zones placed at natural chapter break points and library footers to reward creators.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Direct Reader Tipping:</strong> Readers can support authors through direct voluntary contributions and coffee tips.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Advance VIP Chapters:</strong> Early access drafts available to sustaining supporters.
                </li>
              </ul>
            </>
          )}
        </div>

        <div className="mt-5 pt-3 border-t border-[var(--border-subtle)] flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
