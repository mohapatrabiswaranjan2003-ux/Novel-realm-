import React, { useState } from 'react';
import { X, Heart, Coffee, Sparkles, CheckCircle2, DollarSign, Copy, Check, QrCode } from 'lucide-react';

interface TipAuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  authorName: string;
  novelTitle: string;
}

export const TipAuthorModal: React.FC<TipAuthorModalProps> = ({
  isOpen,
  onClose,
  authorName,
  novelTitle,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(3); // USD
  const [customAmount, setCustomAmount] = useState<string>('');
  const [supporterName, setSupporterName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [showQr, setShowQr] = useState<boolean>(false);

  if (!isOpen) return null;

  const upiId = '8144389665@ptsbi';
  const finalAmountUsd = customAmount ? parseFloat(customAmount) || selectedAmount : selectedAmount;
  const inrAmount = Math.round(finalAmountUsd * 85);

  const upiDeepLink = `upi://pay?pa=${upiId}&pn=NovelRealm&am=${inrAmount}&cu=INR&tn=Tip%20for%20${encodeURIComponent(authorName)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiDeepLink)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handlePayViaUpi = () => {
    window.location.href = upiDeepLink;
    setIsSuccess(true);
  };

  const handleSimulateTip = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  const handleReset = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-clean-sans">
      <div
        className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-2xl shadow-2xl p-6 sm:p-7 overflow-hidden max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-label="Support the Author"
      >
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <div className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-amber-500" />
            <h3 className="font-display-title text-lg font-bold">Support {authorName}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="font-display-title text-xl font-bold text-[var(--text-primary)]">
              Thank You for Your Support!
            </h4>
            <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto leading-relaxed">
              Your contribution directly fuels the writing of <strong className="text-[var(--text-primary)]">{novelTitle}</strong>. 
              {supporterName ? ` Thank you, ${supporterName}!` : ''}
            </p>
            <div className="pt-2">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
              >
                Back to Reading
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSimulateTip} className="mt-5 space-y-4">
            <p className="text-xs text-[var(--text-secondary)]">
              Enjoying this story? Tipping helps the author dedicate more time to writing chapters faster!
            </p>

            {/* Tip preset options */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Select Amount
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { usd: 1, inr: 85, label: '$1 · Coffee ☕' },
                  { usd: 3, inr: 250, label: '$3 · Tea & Snack 🫖' },
                  { usd: 5, inr: 420, label: '$5 · Super Fan 🌟' },
                ].map((item) => (
                  <button
                    key={item.usd}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(item.usd);
                      setCustomAmount('');
                    }}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                      selectedAmount === item.usd && !customAmount
                        ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold ring-1 ring-amber-500/30'
                        : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-slate-400'
                    }`}
                  >
                    <span className="block font-bold">{item.label}</span>
                    <span className="text-[10px] opacity-75">~₹{item.inr}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* UPI Direct Section */}
            <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-secondary)]">Author's Direct Bank UPI:</span>
                <div className="flex items-center gap-1.5">
                  <code className="font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded">
                    {upiId}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="p-1 rounded text-amber-600 hover:bg-amber-500/20 transition-colors"
                    title="Copy UPI ID"
                  >
                    {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {copiedUpi && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  ✓ UPI ID copied! Paste in GPay, PhonePe, or Paytm to tip ₹{inrAmount}.
                </p>
              )}

              {/* QR Code toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowQr(!showQr)}
                  className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>{showQr ? 'Hide QR Code' : 'Show UPI QR Code (Scan to Tip)'}</span>
                </button>

                {showQr && (
                  <div className="mt-2.5 p-3 bg-white rounded-xl shadow-xs flex flex-col items-center justify-center space-y-1.5 max-w-[190px] mx-auto border border-slate-200">
                    <img
                      src={qrCodeUrl}
                      alt="Scan to Tip"
                      className="w-32 h-32 rounded-md"
                    />
                    <span className="text-[10px] text-slate-600 font-medium text-center">
                      Scan with GPay / PhonePe (₹{inrAmount})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Supporter Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Your Name / Pen Name (Optional)
              </label>
              <input
                type="text"
                value={supporterName}
                onChange={(e) => setSupporterName(e.target.value)}
                placeholder="e.g. Fellow Cultivator"
                className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Note */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Encouraging Note for the Author
              </label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Loved this chapter! Keep writing..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Buttons */}
            <div className="space-y-2 pt-2">
              <a
                href={upiDeepLink}
                onClick={handlePayViaUpi}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 text-center"
              >
                <Heart className="w-4 h-4 fill-current text-red-600" />
                <span>Tip ₹{inrAmount} (${finalAmountUsd.toFixed(2)}) via UPI</span>
              </a>

              <button
                type="submit"
                className="w-full py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline"
              >
                I Sent ₹{inrAmount} Directly — Send Author Note
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
