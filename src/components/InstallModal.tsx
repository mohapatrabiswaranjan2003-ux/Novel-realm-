import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone, Apple, Monitor, CheckCircle2, Share, PlusSquare, ArrowRight } from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onInstalled?: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstalled,
}) => {
  const [deviceType, setDeviceType] = useState<'android' | 'ios' | 'desktop'>('android');
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setDeviceType('ios');
    } else if (/android/.test(ua)) {
      setDeviceType('android');
    } else {
      setDeviceType('desktop');
    }
  }, []);

  if (!isOpen) return null;

  const handleNativePrompt = async () => {
    if (deferredPrompt) {
      setIsInstalling(true);
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      setIsInstalling(false);
      if (choice.outcome === 'accepted') {
        if (onInstalled) onInstalled();
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in font-clean-sans">
      <div
        className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        role="dialog"
        aria-label="Install NovelRealm App"
      >
        {/* Header */}
        <div className="p-5 border-b border-[var(--border-subtle)] flex items-center justify-between shrink-0 bg-black/[0.02] dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display-title text-base font-bold">Install NovelRealm</h3>
              <p className="text-xs text-[var(--text-secondary)]">Available on Android & iOS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Device Switcher Tabs */}
        <div className="flex border-b border-[var(--border-subtle)] bg-black/[0.01] dark:bg-white/[0.01] text-xs">
          <button
            onClick={() => setDeviceType('android')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 font-medium transition-colors ${
              deviceType === 'android'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android</span>
          </button>

          <button
            onClick={() => setDeviceType('ios')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 font-medium transition-colors ${
              deviceType === 'ios'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>iPhone / iPad</span>
          </button>

          <button
            onClick={() => setDeviceType('desktop')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 font-medium transition-colors ${
              deviceType === 'desktop'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>PC / Mac</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 text-xs overflow-y-auto max-h-[60vh]">
          {/* 1-Click Install Button if supported */}
          {deferredPrompt && (
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-blue-600 dark:text-blue-400">1-Click Fast Install</span>
                <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">Ready</span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Your browser supports direct installation. Tap below to add NovelRealm to your device.
              </p>
              <button
                onClick={handleNativePrompt}
                disabled={isInstalling}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>{isInstalling ? 'Installing...' : 'Install App Now'}</span>
              </button>
            </div>
          )}

          {/* Android Guide */}
          {deviceType === 'android' && (
            <div className="space-y-3">
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Follow these simple steps on your Android device (Google Chrome, Edge, or Samsung Internet):
              </p>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    1
                  </div>
                  <div>
                    <strong className="block text-[var(--text-primary)]">Tap the browser menu</strong>
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      Tap the <strong>three dots (⋮)</strong> in the top-right corner of Chrome or Edge.
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    2
                  </div>
                  <div>
                    <strong className="block text-[var(--text-primary)]">Select "Install app" or "Add to Home screen"</strong>
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      Tap <strong>Install app</strong> (or <strong>Add to Home screen</strong>).
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    3
                  </div>
                  <div>
                    <strong className="block text-[var(--text-primary)]">Open NovelRealm from your Home Screen</strong>
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      The app icon will appear alongside your other Android apps for instant full-screen reading!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* iOS iPhone / iPad Guide */}
          {deviceType === 'ios' && (
            <div className="space-y-3">
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Apple requires installing web apps through <strong>Safari</strong>:
              </p>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    1
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
                      <span>Tap the Share button</span>
                      <Share className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      At the bottom of Safari, tap the <strong>Share</strong> icon (the square with an arrow pointing up).
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    2
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
                      <span>Tap "Add to Home Screen"</span>
                      <PlusSquare className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      Scroll down the options list and tap <strong>Add to Home Screen</strong>.
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    3
                  </div>
                  <div>
                    <strong className="block text-[var(--text-primary)]">Tap "Add" in top-right corner</strong>
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      The NovelRealm icon will be added to your iPhone/iPad Home Screen. It runs full-screen without Safari browser bars!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Guide */}
          {deviceType === 'desktop' && (
            <div className="space-y-3">
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Install NovelRealm as a standalone desktop app on Windows, macOS, or ChromeOS:
              </p>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    1
                  </div>
                  <div>
                    <strong className="block text-[var(--text-primary)]">Look at your address bar</strong>
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      In Chrome or Edge, click the <strong>Install computer icon</strong> on the right side of the URL address bar.
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    2
                  </div>
                  <div>
                    <strong className="block text-[var(--text-primary)]">Click "Install"</strong>
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      NovelRealm will launch in its own standalone window with taskbar and desktop shortcuts!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* App Advantages */}
          <div className="p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-[var(--border-subtle)] space-y-1.5">
            <span className="font-bold text-[11px] uppercase tracking-wider text-[var(--text-primary)]">
              App Features & Benefits
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-[var(--text-secondary)]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Zero Browser Bars</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Offline Reading</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Audio Narration (TTS)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Saved Bookmarks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between shrink-0 text-xs">
          <span className="text-[11px] text-[var(--text-secondary)]">
            Free · No App Store account required
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[var(--text-primary)] text-[var(--bg-surface)] text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
