import React, { useState } from 'react';
import {
  Play,
  Pause,
  Square,
  ChevronLeft,
  ChevronRight,
  Settings as SettingsIcon,
  ChevronDown,
  ChevronUp,
  Volume2,
  BookOpen,
  Sliders,
  Type,
  MoreHorizontal,
  Bookmark,
  Check,
  Globe,
  Sparkles,
  RefreshCw,
  AlertCircle,
  FileText,
  Layers,
} from 'lucide-react';
import { Novel, Chapter, ReaderSettings } from '../types/novel';
import {
  SUPPORTED_LANGUAGES,
  LanguageOption,
  getVoicesForLanguage,
  VoiceOption,
  getVoiceTestPhrase,
} from '../utils/translationService';
import { RobustTTSEngine, TTSState } from '../utils/ttsEngine';

interface WtrReaderBottomBarProps {
  novel: Novel;
  currentChapter: Chapter;
  totalChapters: number;
  chapterIndex: number;
  scrollProgressPercent: number;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  onOpenToc: () => void;
  isInLibrary: boolean;
  onToggleLibrary: () => void;
  settings: ReaderSettings;
  onUpdateSettings: (newSettings: Partial<ReaderSettings>) => void;
  ttsEngine: RobustTTSEngine;
  ttsState: TTSState;
  selectedLanguage: string;
  onSelectLanguage: (langCode: string) => void;
  selectedVoiceId: string;
  onSelectVoice: (voiceId: string) => void;
  onJumpParagraph: (index: number) => void;
}

export const WtrReaderBottomBar: React.FC<WtrReaderBottomBarProps> = ({
  novel,
  currentChapter,
  totalChapters,
  chapterIndex,
  scrollProgressPercent,
  onPrevChapter,
  onNextChapter,
  onOpenToc,
  isInLibrary,
  onToggleLibrary,
  settings,
  onUpdateSettings,
  ttsEngine,
  ttsState,
  selectedLanguage,
  onSelectLanguage,
  selectedVoiceId,
  onSelectVoice,
}) => {
  const [activeTab, setActiveTab] = useState<'read' | 'display' | 'speech' | 'settings' | 'more'>('read');
  const [isTtsPillCollapsed, setIsTtsPillCollapsed] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [testVoiceSuccess, setTestVoiceSuccess] = useState(false);

  const availableVoices = getVoicesForLanguage(selectedLanguage);
  const currentVoice = availableVoices.find((v) => v.id === selectedVoiceId) || availableVoices[0];
  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  const handleTestVoice = () => {
    const testPhrase = getVoiceTestPhrase(selectedLanguage);
    ttsEngine.testVoice(selectedLanguage, selectedVoiceId, testPhrase);
    setTestVoiceSuccess(true);
    setTimeout(() => setTestVoiceSuccess(false), 2000);
  };

  return (
    <>
      {/* 1. Floating WTR-Style TTS Widget Pill (Exactly as shown in Screenshot 1) */}
      <div className="fixed bottom-28 sm:bottom-32 right-3 z-40 select-none animate-fade-in">
        <div className="bg-[#181b22]/95 text-white border border-slate-700/80 rounded-2xl shadow-2xl p-2 backdrop-blur-md flex flex-col items-center gap-1.5 min-w-[210px]">
          {/* Top Status Badges */}
          <div className="flex items-center justify-between w-full px-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  ttsState.isPlaying
                    ? 'bg-emerald-500 animate-pulse'
                    : ttsState.isPaused
                    ? 'bg-amber-400'
                    : 'bg-red-500'
                }`}
              />
              <span className="text-[11px] font-medium text-slate-300">
                {ttsState.isPlaying ? 'Playing' : ttsState.isPaused ? 'Paused' : 'Stopped'}
              </span>
            </div>

            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-600/90 text-purple-100 shadow-xs">
              Browser
            </span>
          </div>

          {/* Action Row */}
          {!isTtsPillCollapsed && (
            <div className="flex items-center justify-between w-full gap-1 pt-0.5 px-1">
              {/* Prev Paragraph */}
              <button
                onClick={() => ttsEngine.prevParagraph()}
                className="p-1.5 rounded-lg hover:bg-white/10 active:scale-95 transition-all text-slate-300 hover:text-white"
                title="Previous paragraph"
                aria-label="Previous paragraph"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Play / Pause */}
              {ttsState.isPlaying ? (
                <button
                  onClick={() => ttsEngine.pause()}
                  className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 active:scale-95 transition-all shadow-md"
                  title="Pause speech"
                  aria-label="Pause speech"
                >
                  <Pause className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => ttsEngine.play()}
                  className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 active:scale-95 transition-all shadow-md"
                  title="Play speech"
                  aria-label="Play speech"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
              )}

              {/* Stop */}
              <button
                onClick={() => ttsEngine.stop()}
                className="p-1.5 rounded-lg hover:bg-red-500/20 active:scale-95 transition-all text-slate-300 hover:text-red-400"
                title="Stop speech"
                aria-label="Stop speech"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>

              {/* Next Paragraph */}
              <button
                onClick={() => ttsEngine.nextParagraph()}
                className="p-1.5 rounded-lg hover:bg-white/10 active:scale-95 transition-all text-slate-300 hover:text-white"
                title="Next paragraph"
                aria-label="Next paragraph"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Open Speech Settings */}
              <button
                onClick={() => setActiveTab(activeTab === 'speech' ? 'read' : 'speech')}
                className={`p-1.5 rounded-lg transition-all ${
                  activeTab === 'speech'
                    ? 'text-blue-400 bg-blue-500/20'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
                title="Speech Settings"
                aria-label="Speech Settings"
              >
                <SettingsIcon className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Collapse pill arrow */}
          <button
            onClick={() => setIsTtsPillCollapsed(!isTtsPillCollapsed)}
            className="w-full flex items-center justify-center pt-0.5 text-slate-400 hover:text-slate-200 transition-colors"
            title={isTtsPillCollapsed ? 'Expand audio bar' : 'Collapse audio bar'}
          >
            {isTtsPillCollapsed ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* 2. Top Drawers for Active Tabs (Display, Speech, Settings, More) */}
      {activeTab !== 'read' && (
        <div className="fixed bottom-14 left-0 right-0 z-40 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] shadow-2xl p-4 max-h-[70vh] overflow-y-auto font-clean-sans animate-fade-in text-[var(--text-primary)]">
          <div className="max-w-xl mx-auto space-y-4">
            
            {/* TAB: DISPLAY (Screenshot 2) */}
            {activeTab === 'display' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                  <h3 className="font-display-title text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    Display Settings
                  </h3>
                  <button
                    onClick={() => setActiveTab('read')}
                    className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold"
                  >
                    Close
                  </button>
                </div>

                {/* Font selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">
                    Font
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[
                      { id: 'sans', label: 'Nunito', fontClass: 'font-clean-sans' },
                      { id: 'roboto', label: 'Roboto', fontClass: 'font-sans' },
                      { id: 'serif', label: 'Lora', fontClass: 'font-editorial-serif' },
                      { id: 'lexend', label: 'Lexend', fontClass: 'font-sans' },
                      { id: 'dyslexic', label: 'Dyslexic', fontClass: 'font-mono' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => onUpdateSettings({ fontFamily: f.id as any })}
                        className={`py-2 px-1 text-xs rounded-lg border text-center transition-all ${
                          settings.fontFamily === f.id
                            ? 'bg-blue-600 text-white border-blue-600 font-bold'
                            : 'border-[var(--border-subtle)] hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-secondary)]'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Size */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">
                    Font Size
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateSettings({ fontSize: Math.max(12, settings.fontSize - 2) })}
                      className="flex-1 py-2 rounded-lg border border-[var(--border-subtle)] text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-primary)]"
                    >
                      A-
                    </button>
                    <span className="w-14 text-center font-mono font-bold text-sm text-[var(--text-primary)]">
                      {settings.fontSize}px
                    </span>
                    <button
                      onClick={() => onUpdateSettings({ fontSize: Math.min(36, settings.fontSize + 2) })}
                      className="flex-1 py-2 rounded-lg border border-[var(--border-subtle)] text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-primary)]"
                    >
                      A+
                    </button>
                  </div>
                </div>

                {/* Line Height */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">
                    Line Height
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'tight', label: 'Height -' },
                      { id: 'normal', label: 'Default' },
                      { id: 'relaxed', label: 'Height +' },
                    ].map((lh) => (
                      <button
                        key={lh.id}
                        onClick={() => onUpdateSettings({ lineHeight: lh.id as any })}
                        className={`py-2 text-xs rounded-lg border text-center font-medium transition-all ${
                          settings.lineHeight === lh.id
                            ? 'bg-blue-600 text-white border-blue-600 font-bold'
                            : 'border-[var(--border-subtle)] hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-secondary)]'
                        }`}
                      >
                        {lh.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SPEECH (Screenshot 3 & 4) */}
            {activeTab === 'speech' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                  <h3 className="font-display-title text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    Speech Narration (TTS)
                  </h3>
                  <button
                    onClick={() => setActiveTab('read')}
                    className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold"
                  >
                    Close
                  </button>
                </div>

                {/* TTS Engine */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">
                    TTS Engine
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Browser TTS', 'Supertonic', 'Google'].map((eng, idx) => (
                      <button
                        key={eng}
                        className={`py-2 text-xs rounded-lg border text-center font-semibold transition-all ${
                          idx === 0
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-[var(--border-subtle)] text-[var(--text-secondary)] opacity-80'
                        }`}
                      >
                        {eng}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Playback Row */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">
                      Playback
                    </label>
                    <span className="text-xs text-emerald-500 font-mono font-medium">
                      {ttsState.isPlaying ? 'Narrating...' : ttsState.isPaused ? 'Paused' : 'Ready'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => (ttsState.isPlaying ? ttsEngine.pause() : ttsEngine.play())}
                      className="py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-blue-700 active:scale-95 shadow-md"
                    >
                      {ttsState.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                      <span>{ttsState.isPlaying ? 'Pause' : 'Play'}</span>
                    </button>
                    <button
                      onClick={() => ttsEngine.stop()}
                      className="py-2.5 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Stop</span>
                    </button>
                  </div>
                </div>

                {/* Voice Selection (Screenshot 4) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">
                      Voice & Language ({availableVoices.length} Voices Available)
                    </label>
                    <button
                      onClick={() => setIsVoiceModalOpen(true)}
                      className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
                    >
                      Switch Language ({currentLangObj.flag})
                    </button>
                  </div>

                  {/* Curated 5 Voices dropdown (3 male, 2 female) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {availableVoices.map((voice) => {
                      const isSelected = voice.id === selectedVoiceId;
                      return (
                        <button
                          key={voice.id}
                          onClick={() => {
                            onSelectVoice(voice.id);
                            ttsEngine.setLanguageAndVoice(selectedLanguage, voice.id);
                          }}
                          className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                            isSelected
                              ? 'border-blue-600 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold shadow-xs'
                              : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--text-primary)]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)]">
                              <span>{voice.gender === 'male' ? '👨' : '👩'}</span>
                              <span>{voice.name}</span>
                            </div>
                            <span className="text-[10px] text-[var(--text-secondary)]">
                              {voice.style}
                            </span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Speed & Test Voice */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">
                    Speed
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      value={ttsState.rate}
                      onChange={(e) => {
                        const r = parseFloat(e.target.value);
                        ttsEngine.setRate(r);
                      }}
                      className="flex-1 p-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] focus:outline-none"
                    >
                      <option value="0.75">0.75x (Slower)</option>
                      <option value="1">1x (Normal)</option>
                      <option value="1.25">1.25x (Fast)</option>
                      <option value="1.5">1.5x (Faster)</option>
                      <option value="2">2x (Speed Reader)</option>
                    </select>

                    <button
                      onClick={handleTestVoice}
                      className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-600/10 text-xs font-semibold active:scale-95 transition-all"
                    >
                      {testVoiceSuccess ? '✓ Speaking...' : 'Test Voice'}
                    </button>
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)] text-xs">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-[var(--text-primary)] font-medium">Auto-advance to next chapter</span>
                    <input
                      type="checkbox"
                      checked={ttsState.autoAdvanceChapter}
                      onChange={(e) => {
                        // Will advance when chapter completes
                      }}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-[var(--text-primary)] font-medium">Highlight paragraphs while reading</span>
                    <input
                      type="checkbox"
                      checked={ttsState.highlightParagraphs}
                      onChange={(e) => {
                        // Enabled
                      }}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* TAB: SETTINGS & TRANSLATION (Screenshot 5) */}
            {activeTab === 'settings' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                  <h3 className="font-display-title text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    Translation & Themes
                  </h3>
                  <button
                    onClick={() => setActiveTab('read')}
                    className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold"
                  >
                    Close
                  </button>
                </div>

                {/* Translation Service */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">
                    Translation Service
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Web', 'Web+', 'AI'].map((srv, idx) => (
                      <button
                        key={srv}
                        className={`py-2 text-xs rounded-lg border text-center font-semibold ${
                          idx === 0
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-[var(--border-subtle)] text-[var(--text-secondary)]'
                        }`}
                      >
                        {srv}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reader Language */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase flex items-center justify-between">
                    <span>Reader Language (Instant Translation)</span>
                    <span className="text-blue-600 font-bold">{currentLangObj.flag} {currentLangObj.name}</span>
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => {
                      onSelectLanguage(e.target.value);
                      const newVoices = getVoicesForLanguage(e.target.value);
                      onSelectVoice(newVoices[0].id);
                      ttsEngine.setLanguageAndVoice(e.target.value, newVoices[0].id);
                    }}
                    className="w-full p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name} ({lang.localName})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reader Theme swatches */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase">
                    Reader Themes
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      { id: 'light', label: 'Aa', bg: 'bg-white text-slate-900 border-slate-300' },
                      { id: 'dark', label: 'Aa', bg: 'bg-slate-900 text-slate-100 border-slate-700' },
                      { id: 'sepia', label: 'Aa', bg: 'bg-[#fbf2df] text-[#423226] border-[#e3d5be]' },
                      { id: 'midnight', label: 'Aa', bg: 'bg-black text-slate-200 border-slate-800' },
                      { id: 'sage', label: 'Aa', bg: 'bg-[#edf2eb] text-[#253328] border-[#d3dfd1]' },
                      { id: 'dark', label: 'Aa', bg: 'bg-blue-950 text-blue-100 border-blue-900' },
                    ].map((th, idx) => (
                      <button
                        key={idx}
                        onClick={() => onUpdateSettings({ theme: th.id as any })}
                        className={`py-2 text-xs rounded-lg border font-serif font-bold transition-all shadow-xs flex items-center justify-center ${th.bg}`}
                      >
                        {th.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: MORE (Screenshot 6) */}
            {activeTab === 'more' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                  <h3 className="font-display-title text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    Novel Actions & Raw Source
                  </h3>
                  <button
                    onClick={() => setActiveTab('read')}
                    className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold"
                  >
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => alert(`Raw Chapter Text Length: ${currentChapter.wordCount} words`)}
                    className="p-3 rounded-xl border border-[var(--border-subtle)] text-left hover:bg-black/5 dark:hover:bg-white/5 space-y-1"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span>Raw Chapter</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)]">View raw unformatted source</p>
                  </button>

                  <button
                    onClick={() => alert('Issue report logged successfully to novel editors.')}
                    className="p-3 rounded-xl border border-[var(--border-subtle)] text-left hover:bg-black/5 dark:hover:bg-white/5 space-y-1"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-red-500">
                      <AlertCircle className="w-4 h-4" />
                      <span>Report Issue</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)]">Report typo or missing text</p>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 3. Bottom WTR-Style Reader Toolbar (Screenshot 1) */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-[#12161f]/95 text-slate-200 border-t border-slate-800 shadow-2xl backdrop-blur-lg select-none pb-safe">
        {/* Row 1: Chapter Nav & Percentage */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800/80 text-xs max-w-4xl mx-auto">
          <button
            onClick={onPrevChapter}
            disabled={chapterIndex <= 0}
            className="flex items-center gap-1 px-3 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-all font-semibold"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          <div className="flex flex-col items-center">
            <span className="font-mono font-bold text-xs text-white">
              Ch. {currentChapter.chapterNumber} / {totalChapters}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {scrollProgressPercent}% read
            </span>
          </div>

          <button
            onClick={onNextChapter}
            disabled={chapterIndex >= totalChapters - 1}
            className="flex items-center gap-1 px-3 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-all font-semibold"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Row 2: Contents & Add to Library Shortcut */}
        <div className="flex items-center justify-between gap-2 px-3 py-1.5 border-b border-slate-800/80 text-xs max-w-4xl mx-auto">
          <button
            onClick={onOpenToc}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 transition-colors font-medium text-slate-200"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Contents</span>
          </button>

          <button
            onClick={onToggleLibrary}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isInLibrary
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>{isInLibrary ? '✓ In Library' : '+ Add to Library'}</span>
          </button>
        </div>

        {/* Row 3: 5 WTR Bottom Tabs (Read, Display, Speech, Settings, More) */}
        <div className="grid grid-cols-5 h-12 items-center justify-around px-2 max-w-xl mx-auto text-[11px]">
          <button
            onClick={() => setActiveTab('read')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              activeTab === 'read' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="mt-0.5">Read</span>
          </button>

          <button
            onClick={() => setActiveTab(activeTab === 'display' ? 'read' : 'display')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              activeTab === 'display' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Type className="w-4 h-4" />
            <span className="mt-0.5">Display</span>
          </button>

          <button
            onClick={() => setActiveTab(activeTab === 'speech' ? 'read' : 'speech')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              activeTab === 'speech' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span className="mt-0.5">Speech</span>
          </button>

          <button
            onClick={() => setActiveTab(activeTab === 'settings' ? 'read' : 'settings')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              activeTab === 'settings' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span className="mt-0.5">Settings</span>
          </button>

          <button
            onClick={() => setActiveTab(activeTab === 'more' ? 'read' : 'more')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              activeTab === 'more' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MoreHorizontal className="w-4 h-4" />
            <span className="mt-0.5">More</span>
          </button>
        </div>
      </footer>

      {/* 4. Full Language Selection Modal (Screenshot 4) */}
      {isVoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-clean-sans animate-fade-in">
          <div className="w-full max-w-md bg-[#181d28] text-white border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-slate-700/80 flex items-center justify-between">
              <h3 className="font-display-title font-bold text-base flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <span>Select Reading & Speech Language</span>
              </h3>
              <button
                onClick={() => setIsVoiceModalOpen(false)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1"
              >
                Close
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4">
              {/* English Group */}
              <div className="space-y-2">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">English</span>
                {SUPPORTED_LANGUAGES.filter((l) => l.code.startsWith('en')).map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onSelectLanguage(lang.code);
                      const voices = getVoicesForLanguage(lang.code);
                      onSelectVoice(voices[0].id);
                      ttsEngine.setLanguageAndVoice(lang.code, voices[0].id);
                      setIsVoiceModalOpen(false);
                    }}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      selectedLanguage === lang.code
                        ? 'border-blue-500 bg-blue-500/20 text-blue-300 font-bold'
                        : 'border-slate-800 hover:bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedLanguage === lang.code ? 'border-blue-400' : 'border-slate-600'
                      }`}
                    >
                      {selectedLanguage === lang.code && (
                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                      )}
                    </span>
                  </button>
                ))}
              </div>

              {/* Other Languages */}
              <div className="space-y-2">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Other Languages</span>
                {SUPPORTED_LANGUAGES.filter((l) => !l.code.startsWith('en')).map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onSelectLanguage(lang.code);
                      const voices = getVoicesForLanguage(lang.code);
                      onSelectVoice(voices[0].id);
                      ttsEngine.setLanguageAndVoice(lang.code, voices[0].id);
                      setIsVoiceModalOpen(false);
                    }}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      selectedLanguage === lang.code
                        ? 'border-blue-500 bg-blue-500/20 text-blue-300 font-bold'
                        : 'border-slate-800 hover:bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.name} <span className="opacity-70 text-xs">({lang.localName})</span></span>
                    </span>
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedLanguage === lang.code ? 'border-blue-400' : 'border-slate-600'
                      }`}
                    >
                      {selectedLanguage === lang.code && (
                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
