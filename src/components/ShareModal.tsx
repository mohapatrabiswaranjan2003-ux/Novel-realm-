import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle, Send, QrCode } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url?: string;
  description?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  url,
  description = 'Read popular serialized web novels with immersive reading tools on NovelRealm!',
}) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  const shareUrl = url || window.location.href;
  const encodedUrl = encodeURIComponent(shareUrl);
  const shareText = encodeURIComponent(`Check out "${title}" on NovelRealm! 📖✨`);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodedUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: description,
        url: shareUrl,
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-clean-sans">
      <div
        className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col space-y-4"
        role="dialog"
        aria-label="Share Novel"
      >
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Share2 className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-display-title text-base font-bold">Share with Readers</h3>
              <p className="text-[11px] text-[var(--text-secondary)]">Invite friends to read together</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Novel Title Card */}
        <div className="p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-[var(--border-subtle)]">
          <h4 className="text-xs font-bold text-[var(--text-primary)] line-clamp-1">{title}</h4>
          <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 mt-0.5">{description}</p>
        </div>

        {/* 1-Click Social Apps */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            Share via App
          </label>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl border border-[var(--border-subtle)] hover:border-emerald-500 hover:bg-emerald-500/10 flex flex-col items-center gap-1.5 transition-all text-emerald-600 dark:text-emerald-400 group"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center font-bold">
                <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-[11px] font-medium text-[var(--text-primary)]">WhatsApp</span>
            </a>

            {/* Telegram */}
            <a
              href={`https://t.me/share/url?url=${encodedUrl}&text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl border border-[var(--border-subtle)] hover:border-sky-500 hover:bg-sky-500/10 flex flex-col items-center gap-1.5 transition-all text-sky-600 dark:text-sky-400 group"
            >
              <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center font-bold">
                <Send className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              </div>
              <span className="text-[11px] font-medium text-[var(--text-primary)]">Telegram</span>
            </a>

            {/* X (Twitter) */}
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl border border-[var(--border-subtle)] hover:border-blue-500 hover:bg-blue-500/10 flex flex-col items-center gap-1.5 transition-all text-blue-600 dark:text-blue-400 group"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center font-bold">
                <span className="text-xs font-black">𝕏</span>
              </div>
              <span className="text-[11px] font-medium text-[var(--text-primary)]">Twitter / 𝕏</span>
            </a>

            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl border border-[var(--border-subtle)] hover:border-indigo-500 hover:bg-indigo-500/10 flex flex-col items-center gap-1.5 transition-all text-indigo-600 dark:text-indigo-400 group"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center font-bold">
                <span className="text-xs font-black">f</span>
              </div>
              <span className="text-[11px] font-medium text-[var(--text-primary)]">Facebook</span>
            </a>
          </div>
        </div>

        {/* Copy Link Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            Or Copy Direct Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] text-[var(--text-primary)] select-all font-mono"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* QR Code Option */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowQr(!showQr)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>{showQr ? 'Hide QR Code' : 'Show QR Code for Mobile Scanning'}</span>
          </button>

          {showQr && (
            <div className="mt-2.5 p-3 bg-white rounded-xl shadow-xs flex flex-col items-center justify-center space-y-1.5 max-w-[190px] mx-auto border border-slate-200">
              <img src={qrUrl} alt="Scan QR Code" className="w-32 h-32 rounded-md" />
              <span className="text-[10px] text-slate-600 font-medium text-center">
                Scan with any phone camera
              </span>
            </div>
          )}
        </div>

        {/* Native mobile sheet button */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-full py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline border-t border-[var(--border-subtle)] pt-3"
          >
            Open Native Device Share Sheet
          </button>
        )}
      </div>
    </div>
  );
};
