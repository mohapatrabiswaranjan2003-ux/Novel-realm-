import React, { useState } from 'react';
import { X, Lock, CheckCircle2, Sparkles, CreditCard, ShieldCheck, Copy, Check, QrCode } from 'lucide-react';
import { Novel } from '../types/novel';

interface VipUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  novel: Novel;
  onSuccess: () => void;
}

export const VipUnlockModal: React.FC<VipUnlockModalProps> = ({
  isOpen,
  onClose,
  novel,
  onSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'paypal'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  const upiId = '8144389665@ptsbi';
  const priceInr = 170; // ~$2.00 USD
  const upiDeepLink = `upi://pay?pa=${upiId}&pn=NovelRealm&am=${priceInr}&cu=INR&tn=VIP%20Pass%20${encodeURIComponent(novel.title)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiDeepLink)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handlePayAndUnlock = () => {
    if (selectedMethod === 'upi') {
      // Attempt to launch UPI intent on mobile
      window.location.href = upiDeepLink;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
      setTimeout(() => {
        onSuccess();
        setIsDone(false);
        onClose();
      }, 1400);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fade-in font-clean-sans">
      <div
        className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[90vh] overflow-y-auto"
        role="dialog"
      >
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-display-title text-base font-bold">
                $2 VIP Book Pass
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Permanent Lifetime Access for "{novel.title}"
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isDone ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-[var(--text-primary)]">
              Pass Activated Successfully!
            </h4>
            <p className="text-xs text-[var(--text-secondary)]">
              All chapters for <strong className="text-[var(--text-primary)]">{novel.title}</strong> are now unlocked permanently on your device. Enjoy reading!
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {/* Price Box */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-500/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-600 dark:text-amber-400">
                  One-Time Top Up
                </span>
                <p className="text-xs font-medium text-[var(--text-primary)]">
                  Unlock All Chapters (Ch. 31 to Finale)
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400">₹{priceInr}</span>
                <span className="block text-[10px] text-[var(--text-secondary)]">($2.00 USD)</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[var(--text-primary)]">
                Choose Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('upi')}
                  className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                    selectedMethod === 'upi'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/20'
                      : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <span className="font-bold text-sm">UPI</span>
                  <span className="text-[10px] opacity-75">GPay / PhonePe</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                    selectedMethod === 'card'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/20'
                      : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="text-[10px]">Debit / Credit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('paypal')}
                  className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                    selectedMethod === 'paypal'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/20'
                      : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <span className="font-bold text-sm">PayPal</span>
                  <span className="text-[10px] opacity-75">International</span>
                </button>
              </div>
            </div>

            {/* UPI Direct Details Box */}
            {selectedMethod === 'upi' && (
              <div className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-secondary)]">Direct Bank UPI ID:</span>
                  <div className="flex items-center gap-1.5">
                    <code className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                      {upiId}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="p-1 rounded text-blue-600 hover:bg-blue-500/20 transition-colors"
                      title="Copy UPI ID"
                    >
                      {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {copiedUpi && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ UPI ID copied! Paste in GPay, PhonePe, or Paytm to pay ₹{priceInr}.
                  </p>
                )}

                {/* QR Code Toggle */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowQr(!showQr)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>{showQr ? 'Hide UPI QR Code' : 'Show UPI QR Code (Scan to Pay)'}</span>
                  </button>

                  {showQr && (
                    <div className="mt-3 p-3 bg-white rounded-xl shadow-xs flex flex-col items-center justify-center space-y-2 max-w-[200px] mx-auto border border-slate-200">
                      <img
                        src={qrCodeUrl}
                        alt="Scan UPI QR Code"
                        className="w-36 h-36 rounded-md"
                      />
                      <span className="text-[10px] text-slate-600 font-medium text-center">
                        Scan with GPay / PhonePe / Paytm (₹{priceInr})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Guarantee Badge */}
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-black/[0.03] dark:bg-white/[0.03] border border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)]">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Direct Author Support · Instant Lifetime Unlock on this Device</span>
            </div>

            {/* Pay Button */}
            <div className="space-y-2">
              <a
                href={upiDeepLink}
                onClick={handlePayAndUnlock}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-2 text-center"
              >
                {isProcessing ? (
                  <span>Unlocking...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹{priceInr} & Unlock All Chapters</span>
                  </>
                )}
              </a>

              <button
                type="button"
                onClick={handlePayAndUnlock}
                className="w-full py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline"
              >
                I Have Sent ₹{priceInr} — Confirm Unlock Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
