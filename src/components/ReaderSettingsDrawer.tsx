import React from 'react';
import {
  ReaderSettings,
  ReaderTheme,
  ReaderFontFamily,
  ReaderLineHeight,
  ReaderColumnWidth,
  ReaderAlignment,
} from '../types/novel';
import { X, Type, AlignLeft, AlignJustify, Eye, Zap, Volume2 } from 'lucide-react';

interface ReaderSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReaderSettings;
  onUpdateSettings: (newSettings: Partial<ReaderSettings>) => void;
}

export const ReaderSettingsDrawer: React.FC<ReaderSettingsDrawerProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const themes: { id: ReaderTheme; label: string; bg: string; text: string; border: string }[] = [
    { id: 'light', label: 'Day White', bg: '#ffffff', text: '#1f2937', border: '#e5e7eb' },
    { id: 'sepia', label: 'Warm Sepia', bg: '#fbf2df', text: '#3c2e24', border: '#e3d5be' },
    { id: 'dark', label: 'Night Dark', bg: '#0f172a', text: '#e2e8f0', border: '#334155' },
    { id: 'midnight', label: 'Midnight', bg: '#0a0e17', text: '#cbd5e1', border: '#1e293b' },
    { id: 'sage', label: 'Forest Sage', bg: '#f3f7f1', text: '#223025', border: '#d3dfd1' },
  ];

  const fontFamilies: { id: ReaderFontFamily; label: string; preview: string }[] = [
    { id: 'serif', label: 'Editorial Serif', preview: 'Newsreader' },
    { id: 'book', label: 'Classic Book', preview: 'Lora' },
    { id: 'sans', label: 'Modern Sans', preview: 'Jakarta' },
    { id: 'mono', label: 'Monospace', preview: 'JetBrains' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in">
      <div
        className="w-full max-w-sm sm:max-w-md h-full bg-[var(--bg-surface)] border-l border-[var(--border-subtle)] text-[var(--text-primary)] shadow-2xl p-6 overflow-y-auto flex flex-col space-y-6"
        role="dialog"
        aria-label="Reader Settings"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <div className="flex items-center gap-2">
            <Type className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-display-title text-base font-bold">Display & Reading Preferences</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reading Mode (Paged vs Continuous Scroll) */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            Reading Mode
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onUpdateSettings({ readingMode: 'paged' })}
              className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-all ${
                settings.readingMode !== 'continuous'
                  ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold ring-1 ring-blue-500'
                  : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <div className="font-bold">Paged (Standard)</div>
              <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">Chapter-by-chapter with Next button</div>
            </button>

            <button
              type="button"
              onClick={() => onUpdateSettings({ readingMode: 'continuous' })}
              className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-all ${
                settings.readingMode === 'continuous'
                  ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold ring-1 ring-blue-500'
                  : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <div className="font-bold">Continuous Scroll</div>
              <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">Seamless infinite reading stream</div>
            </button>
          </div>
        </div>

        {/* 1. Theme Palette Selector */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            Color Theme
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {themes.map((t) => {
              const active = settings.theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onUpdateSettings({ theme: t.id })}
                  className={`flex items-center gap-2.5 p-2 rounded-lg text-xs font-medium border transition-all text-left ${
                    active
                      ? 'ring-2 ring-blue-500 shadow-xs'
                      : 'hover:border-slate-400'
                  }`}
                  style={{
                    backgroundColor: t.bg,
                    color: t.text,
                    borderColor: active ? '#3b82f6' : t.border,
                  }}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 border"
                    style={{ backgroundColor: t.bg, borderColor: t.border }}
                  />
                  <span className="truncate">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Font Size Stepper & Slider */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Font Size
            </label>
            <span className="font-mono text-xs font-semibold text-[var(--text-primary)] tabular-nums">
              {settings.fontSize}px
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onUpdateSettings({ fontSize: Math.max(14, settings.fontSize - 1) })}
              className="px-3 py-1.5 text-xs font-semibold rounded-md border border-[var(--border-subtle)] hover:bg-black/5 dark:hover:bg-white/5"
            >
              A-
            </button>
            <input
              type="range"
              min="14"
              max="28"
              step="1"
              value={settings.fontSize}
              onChange={(e) => onUpdateSettings({ fontSize: Number(e.target.value) })}
              className="flex-1 accent-blue-600 cursor-pointer"
            />
            <button
              onClick={() => onUpdateSettings({ fontSize: Math.min(28, settings.fontSize + 1) })}
              className="px-3 py-1.5 text-xs font-semibold rounded-md border border-[var(--border-subtle)] hover:bg-black/5 dark:hover:bg-white/5"
            >
              A+
            </button>
          </div>
        </div>

        {/* 3. Typeface Family */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            Typeface
          </label>
          <div className="grid grid-cols-2 gap-2">
            {fontFamilies.map((f) => {
              const active = settings.fontFamily === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => onUpdateSettings({ fontFamily: f.id })}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                    active
                      ? 'border-blue-500 bg-blue-50/20 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <div className="font-medium">{f.label}</div>
                  <div className="text-[11px] opacity-70 mt-0.5">{f.preview}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Line Spacing & Column Width */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Line Spacing
            </label>
            <div className="flex rounded-lg border border-[var(--border-subtle)] overflow-hidden">
              {(['tight', 'normal', 'relaxed'] as ReaderLineHeight[]).map((lh) => (
                <button
                  key={lh}
                  onClick={() => onUpdateSettings({ lineHeight: lh })}
                  className={`flex-1 py-1.5 text-xs text-center font-medium capitalize transition-colors ${
                    settings.lineHeight === lh
                      ? 'bg-blue-600 text-white'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {lh}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Alignment
            </label>
            <div className="flex rounded-lg border border-[var(--border-subtle)] overflow-hidden">
              <button
                onClick={() => onUpdateSettings({ alignment: 'left' })}
                className={`flex-1 py-1.5 flex items-center justify-center transition-colors ${
                  settings.alignment === 'left'
                    ? 'bg-blue-600 text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                title="Left Align"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => onUpdateSettings({ alignment: 'justify' })}
                className={`flex-1 py-1.5 flex items-center justify-center transition-colors ${
                  settings.alignment === 'justify'
                    ? 'bg-blue-600 text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                title="Justified"
              >
                <AlignJustify className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 5. Reading Column Width */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            Page Width
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {(['compact', 'editorial', 'broad', 'full'] as ReaderColumnWidth[]).map((w) => (
              <button
                key={w}
                onClick={() => onUpdateSettings({ columnWidth: w })}
                className={`py-1.5 text-xs font-medium rounded-md border text-center capitalize transition-colors ${
                  settings.columnWidth === w
                    ? 'border-blue-500 bg-blue-600 text-white'
                    : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        {/* 6. Bionic Reading Assistant */}
        <div className="pt-2 border-t border-[var(--border-subtle)]">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-primary)]">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Bionic Reading Mode</span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Guides eyes by bolding initial letters of words for faster scanning
              </p>
            </div>
            <button
              onClick={() => onUpdateSettings({ bionicReading: !settings.bionicReading })}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                settings.bionicReading ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.bionicReading ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 7. Audio Narration Speed */}
        <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Voice Narration Speed</span>
            </div>
            <span className="font-mono text-xs text-[var(--text-primary)] tabular-nums">
              {settings.speechRate}x
            </span>
          </div>
          <div className="flex gap-2">
            {[0.8, 1.0, 1.25, 1.5].map((rate) => (
              <button
                key={rate}
                onClick={() => onUpdateSettings({ speechRate: rate })}
                className={`flex-1 py-1 text-xs font-medium rounded-md border transition-colors ${
                  settings.speechRate === rate
                    ? 'border-blue-500 bg-blue-600 text-white'
                    : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        {/* Reset to defaults button */}
        <div className="pt-4 border-t border-[var(--border-subtle)] flex justify-end">
          <button
            onClick={() =>
              onUpdateSettings({
                fontSize: 18,
                fontFamily: 'serif',
                lineHeight: 'normal',
                columnWidth: 'editorial',
                alignment: 'left',
                bionicReading: false,
              })
            }
            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline"
          >
            Reset to default typography
          </button>
        </div>

      </div>
    </div>
  );
};
