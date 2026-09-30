import React, { useState, useEffect } from 'react';
import { 
  X, Feather, CheckCircle2, Award, Sparkles, AlertCircle, 
  BookOpen, Compass, Flame, Shield, ArrowRight, RefreshCw, BarChart2 
} from 'lucide-react';
import { UserAccount, WriterExamSubmission } from '../types/auth';
import { completeWriterCertification, evaluateWriterSubmission, OFFICIAL_WRITER_RANKS } from '../utils/userAuthStorage';

interface WriterCertificationExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onCertificationComplete: (updatedUser: UserAccount) => void;
}

const GENRE_OPTIONS = [
  {
    name: 'Fantasy',
    icon: '⚔️',
    description: 'Magic systems, mythical realms, epic quests, swords & sorcery.',
    popularHook: 'High global demand for original magic systems and kingdom building.',
  },
  {
    name: 'Sci-Fi',
    icon: '🚀',
    description: 'Space exploration, AI singularities, cybernetics, cosmic mysteries.',
    popularHook: 'Strong recurring readership for hard sci-fi and galactic warfare.',
  },
  {
    name: 'Xianxia / Cultivation',
    icon: '🐉',
    description: 'Daoist alchemy, heavenly tribulations, martial progression, sect wars.',
    popularHook: 'Top binge-reading metrics globally with loyal serialization fans.',
  },
  {
    name: 'LitRPG & Progression',
    icon: '🎮',
    description: 'Level systems, stat screens, dungeon raids, tower climbing.',
    popularHook: 'Fastest-growing genre with exceptional reader retention rates.',
  },
  {
    name: 'Romance & Drama',
    icon: '💖',
    description: 'Enemies to lovers, royal contracts, emotional tension, palace intrigue.',
    popularHook: 'Massive viral sharing potential and active community commentary.',
  },
  {
    name: 'Mystery & Thriller',
    icon: '🕵️',
    description: 'Detective procedurals, supernatural puzzles, plot twists, suspense.',
    popularHook: 'High chapter-to-chapter cliffhanger engagement and reader votes.',
  },
  {
    name: 'Urban Fantasy & Supernatural',
    icon: '🌙',
    description: 'Modern day hidden societies, vampires, occult investigators.',
    popularHook: 'Evergreen popularity with broad global demographic appeal.',
  },
  {
    name: 'Historical & Wuxia',
    icon: '🏯',
    description: 'Dynastic politics, martial arts honor, ancient warfare.',
    popularHook: 'Rich worldbuilding appeal with high respect among connoisseurs.',
  },
];

export const WriterCertificationExamModal: React.FC<WriterCertificationExamModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onCertificationComplete,
}) => {
  const [step, setStep] = useState<'genre' | 'write' | 'grading' | 'certified'>('genre');
  const [selectedGenre, setSelectedGenre] = useState<string>('Fantasy');
  const [novelTitle, setNovelTitle] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [gradingProgress, setGradingProgress] = useState(0);
  const [gradingStatusText, setGradingStatusText] = useState('Initializing linguistic evaluation...');
  const [examResult, setExamResult] = useState<WriterExamSubmission | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Compute live word count
  const words = storyContent.trim() ? storyContent.trim().split(/\s+/).length : 0;
  const isOverLimit = words > 1500;
  const isTooShort = words < 40;

  // Simulate evaluation sequence when in 'grading' step
  useEffect(() => {
    if (step !== 'grading') return;

    const stages = [
      { pct: 15, text: 'Scanning narrative structure and pacing...' },
      { pct: 40, text: 'Analyzing vocabulary diversity and grammatical syntax...' },
      { pct: 65, text: `Benchmarking reader hook potential in ${selectedGenre}...` },
      { pct: 85, text: 'Simulating Global Market serialization retention metrics...' },
      { pct: 100, text: 'Verification complete! Issuing Official Writer Certificate...' },
    ];

    let currentStageIndex = 0;
    const interval = setInterval(() => {
      currentStageIndex += 1;
      if (currentStageIndex < stages.length) {
        setGradingProgress(stages[currentStageIndex].pct);
        setGradingStatusText(stages[currentStageIndex].text);
      } else {
        clearInterval(interval);
        // Complete exam
        const result = evaluateWriterSubmission({
          genre: selectedGenre,
          title: novelTitle.trim(),
          storyText: storyContent.trim(),
          wordCount: words,
        });

        const updatedUser = completeWriterCertification(currentUser.id, result);
        setExamResult(result);
        setStep('certified');
        if (updatedUser) {
          onCertificationComplete(updatedUser);
        }
      }
    }, 600);

    return () => clearInterval(interval);
  }, [step]);

  if (!isOpen) return null;

  const handleStartWriting = () => {
    if (!selectedGenre) {
      setError('Please select a genre to continue.');
      return;
    }
    setError(null);
    setStep('write');
  };

  const handleSubmitForGrading = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novelTitle.trim()) {
      setError('Please enter a title for your novel.');
      return;
    }
    if (words < 40) {
      setError('Your story must have at least 40 words so our evaluation portal can analyze your writing skill.');
      return;
    }
    if (words > 1500) {
      setError('Word count must not exceed 1,500 words. Please trim your text before submitting.');
      return;
    }

    setError(null);
    setGradingProgress(5);
    setStep('grading');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs animate-fade-in font-clean-sans">
      <div
        className="w-full max-w-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
        role="dialog"
        aria-label="Official Writer Certification Exam"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--border-subtle)] flex items-center justify-between shrink-0 bg-black/[0.02] dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md font-bold text-lg">
              ✍️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display-title text-base font-bold">Writer Certification Exam</h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Official Portal
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                Author Pen Name: <strong className="text-[var(--text-primary)]">{currentUser.penName || currentUser.displayName}</strong>
              </p>
            </div>
          </div>
          {step !== 'grading' && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Exam Steps Indicator */}
        <div className="grid grid-cols-3 border-b border-[var(--border-subtle)] bg-black/[0.01] dark:bg-white/[0.01] text-xs font-semibold shrink-0">
          <div className={`py-2.5 text-center border-b-2 transition-colors ${
            step === 'genre'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-bold'
              : 'border-transparent text-[var(--text-secondary)]'
          }`}>
            1. Select Genre
          </div>
          <div className={`py-2.5 text-center border-b-2 transition-colors ${
            step === 'write' || step === 'grading'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-bold'
              : 'border-transparent text-[var(--text-secondary)]'
          }`}>
            2. Write & Submit (≤ 1500w)
          </div>
          <div className={`py-2.5 text-center border-b-2 transition-colors ${
            step === 'certified'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
              : 'border-transparent text-[var(--text-secondary)]'
          }`}>
            3. Verification & Rank
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 flex items-start gap-2.5 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: SELECT GENRE */}
          {step === 'genre' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[var(--text-primary)]">
                  Step 1: Choose the Genre You Wish to Specialize In
                </h4>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  Our evaluation system tests your story pacing, vocabulary, and market hook according to the international benchmarks of your chosen genre.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {GENRE_OPTIONS.map((g) => {
                  const isSelected = selectedGenre === g.name;
                  return (
                    <button
                      key={g.name}
                      type="button"
                      onClick={() => setSelectedGenre(g.name)}
                      className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30 shadow-sm'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-main)] hover:border-amber-500/50'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1.5">
                        <span className="text-lg">{g.icon}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-black/5 dark:bg-white/5 text-[var(--text-secondary)]'
                        }`}>
                          {g.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-primary)] font-medium leading-tight mb-2">
                        {g.description}
                      </p>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                        ✦ {g.popularHook}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  onClick={handleStartWriting}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center gap-2 shadow-md transition-all"
                >
                  <span>Continue to Title & Writing</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: WRITE NOVEL (MAX 1500 WORDS) */}
          {step === 'write' && (
            <form onSubmit={handleSubmitForGrading} className="space-y-4">
              <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 tracking-wider">
                    Selected Specialization
                  </span>
                  <div className="font-bold text-xs text-[var(--text-primary)]">
                    {selectedGenre}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('genre')}
                  className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                >
                  Change Genre
                </button>
              </div>

              {/* Title Field */}
              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1">
                  Choose a Title for Your Novel / Story
                </label>
                <input
                  type="text"
                  required
                  value={novelTitle}
                  onChange={(e) => setNovelTitle(e.target.value)}
                  placeholder="e.g. Chronicles of the Void Sovereign, The Jade Sovereign's Return"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Story Editor Field with Word Count Limit */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[var(--text-primary)]">
                    Write Your Short Novel / Story Prologue
                  </label>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      isOverLimit
                        ? 'bg-red-500/20 text-red-500'
                        : words >= 100
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-black/5 dark:bg-white/5 text-[var(--text-secondary)]'
                    }`}>
                      {words} / 1,500 words
                    </span>
                  </div>
                </div>

                {/* Word limit progress bar */}
                <div className="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 mb-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isOverLimit ? 'bg-red-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, (words / 1500) * 100)}%` }}
                  />
                </div>

                <p className="text-[11px] text-[var(--text-secondary)] mb-2">
                  Write the opening scene or small novel below. <strong>Must not exceed 1,500 words.</strong> Showcase dialogue, world-building, and conflict.
                </p>

                <textarea
                  rows={10}
                  required
                  value={storyContent}
                  onChange={(e) => setStoryContent(e.target.value)}
                  placeholder="Write your story here... The cold wind whipped across the Obsidian Citadel as Lord Arthur drew his blade..."
                  className={`w-full p-3.5 rounded-xl border bg-[var(--bg-main)] text-[var(--text-primary)] font-serif text-xs leading-relaxed focus:outline-none focus:ring-2 ${
                    isOverLimit
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-[var(--border-subtle)] focus:ring-amber-500'
                  }`}
                />

                {isOverLimit && (
                  <p className="text-[11px] text-red-500 font-semibold mt-1">
                    ⚠️ Your story exceeds the 1,500-word limit by {words - 1500} words. Please edit before submitting.
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('genre')}
                  className="px-4 py-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isOverLimit || isTooShort}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold flex items-center gap-2 shadow-md transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Submit Story for Global Market Evaluation</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: GRADING IN PROGRESS (< 2 MINUTES) */}
          {step === 'grading' && (
            <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-2xl">
                  📜
                </div>
              </div>

              <div className="space-y-2 max-w-md">
                <h4 className="text-base font-bold font-display-title text-[var(--text-primary)]">
                  Evaluating Your Story Submission
                </h4>
                <p className="text-xs text-[var(--text-secondary)]">
                  {gradingStatusText}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-sm space-y-2">
                <div className="w-full h-2.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-300"
                    style={{ width: `${gradingProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[var(--text-secondary)] font-semibold">
                  <span>Verification in progress</span>
                  <span>{gradingProgress}%</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)] max-w-sm">
                Evaluating pacing, dialogue tags, suspense curve, and commercial viability for international serialization.
              </div>
            </div>
          )}

          {/* STEP 4: CERTIFIED RESULT & OFFICIAL CERTIFICATE */}
          {step === 'certified' && examResult && (
            <div className="space-y-5 animate-fade-in">
              {/* Official Digital Certificate */}
              <div className="p-6 rounded-2xl border-2 border-amber-500/40 bg-gradient-to-b from-amber-500/10 via-black/[0.02] to-amber-500/5 relative overflow-hidden shadow-xl">
                <div className="flex items-center justify-between border-b border-amber-500/30 pb-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <Award className="w-6 h-6 text-amber-500" />
                    <div>
                      <h4 className="font-display-title text-base font-bold text-[var(--text-primary)]">
                        NovelRealm Writer Certification
                      </h4>
                      <p className="text-[10px] text-[var(--text-secondary)]">
                        Certificate ID: <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{examResult.certificateId}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-end">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Certified
                    </span>
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                      Score: {examResult.overallScore}/100
                    </span>
                  </div>
                </div>

                {/* Candidate & Story Info */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-[var(--text-secondary)] block">Certified Pen Name</span>
                    <strong className="text-[var(--text-primary)]">{currentUser.penName || currentUser.displayName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-secondary)] block">Novel Title</span>
                    <strong className="text-[var(--text-primary)] truncate block">{examResult.title}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-secondary)] block">Genre</span>
                    <strong className="text-amber-600 dark:text-amber-400">{examResult.genre}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-secondary)] block">Initial Rank</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">🌱 Novice Writer</strong>
                  </div>
                </div>

                {/* Linguistic Strengths */}
                <div className="p-3.5 rounded-xl bg-black/5 dark:bg-white/5 border border-amber-500/20 space-y-2 text-[11px]">
                  <div className="font-bold text-amber-600 dark:text-amber-400">
                    ✦ Global Market Evaluation: {examResult.marketGrade}
                  </div>
                  <p className="text-[var(--text-secondary)]">
                    {examResult.feedback.marketFit}
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    {examResult.feedback.pacingAndFlow}
                  </p>
                </div>
              </div>

              {/* 5-Tier Writer Rank & Medal Roadmap */}
              <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-xs text-[var(--text-primary)]">
                    Official 5-Tier Writer Rank & Medal System
                  </h5>
                  <span className="text-[10px] text-[var(--text-secondary)]">
                    Rank increases with genuine view count
                  </span>
                </div>

                <div className="space-y-2">
                  {/* Novice */}
                  <div className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🌱</span>
                      <div>
                        <strong className="text-emerald-700 dark:text-emerald-300">Novice Rank (Your Current Rank)</strong>
                        <span className="text-[10px] block text-[var(--text-secondary)]">
                          Starting Rank · No medals yet · 0 to 10,000 views
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>

                  {/* Primary / Bronze */}
                  <div className="p-2.5 rounded-lg border border-[var(--border-subtle)] bg-black/[0.01] dark:bg-white/[0.01] flex items-center justify-between text-xs opacity-90">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🥉</span>
                      <div>
                        <strong className="text-[var(--text-primary)]">Primary Rank (Bronze Medal)</strong>
                        <span className="text-[10px] block text-[var(--text-secondary)]">
                          10,001 to 100,000 views · Unlocks 40% Writer Royalty Share
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-[var(--text-secondary)]">Next Rank</span>
                  </div>

                  {/* Intermediate / Silver */}
                  <div className="p-2.5 rounded-lg border border-[var(--border-subtle)] bg-black/[0.01] dark:bg-white/[0.01] flex items-center justify-between text-xs opacity-80">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🥈</span>
                      <div>
                        <strong className="text-[var(--text-primary)]">Intermediate Rank (Silver Medal)</strong>
                        <span className="text-[10px] block text-[var(--text-secondary)]">
                          100,001 to 1,000,000 views · Unlocks 60% Writer Royalty Share
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-[var(--text-secondary)]">Tier 3</span>
                  </div>

                  {/* Advanced / Gold */}
                  <div className="p-2.5 rounded-lg border border-[var(--border-subtle)] bg-black/[0.01] dark:bg-white/[0.01] flex items-center justify-between text-xs opacity-75">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🥇</span>
                      <div>
                        <strong className="text-[var(--text-primary)]">Advanced Rank (Gold Medal)</strong>
                        <span className="text-[10px] block text-[var(--text-secondary)]">
                          1,000,001 to 10,000,000 views · Unlocks 65% Writer Royalty Share
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-[var(--text-secondary)]">Tier 4</span>
                  </div>

                  {/* Legendary / Diamond */}
                  <div className="p-2.5 rounded-lg border border-[var(--border-subtle)] bg-black/[0.01] dark:bg-white/[0.01] flex items-center justify-between text-xs opacity-70">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">💎</span>
                      <div>
                        <strong className="text-[var(--text-primary)]">Legendary Rank (Diamond Grandmaster)</strong>
                        <span className="text-[10px] block text-[var(--text-secondary)]">
                          Above 10,000,000 views · Unlocks 70% Writer Royalty Share
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-[var(--text-secondary)]">Pinnacle</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Feather className="w-4 h-4" />
                  <span>Enter Writer Studio & Publish Chapter 1</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
