import React, { useState, useEffect } from 'react';
import { Novel, Chapter } from '../types/novel';
import { GENRE_LIST } from '../data/novelsData';
import { X, Sparkles, BookOpen, Award, Check } from 'lucide-react';
import { UserAccount } from '../types/auth';

interface AddNovelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNovel: (novel: Novel) => void;
  currentUser?: UserAccount | null;
}

export const AddNovelModal: React.FC<AddNovelModalProps> = ({
  isOpen,
  onClose,
  onAddNovel,
  currentUser,
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState<Novel['genre']>('Fantasy');
  const [synopsis, setSynopsis] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [authorUpi, setAuthorUpi] = useState('');
  const [chapterTitle, setChapterTitle] = useState('The Beginning');
  const [chapterContent, setChapterContent] = useState('');
  const [importedFromExam, setImportedFromExam] = useState(false);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.penName) setAuthor(currentUser.penName);
      else if (currentUser.displayName) setAuthor(currentUser.displayName);

      if (currentUser.bankUpiId) setAuthorUpi(currentUser.bankUpiId);
    }
  }, [currentUser, isOpen]);

  const handleImportExamStory = () => {
    if (!currentUser?.writerCertification) return;
    const cert = currentUser.writerCertification;
    setTitle(cert.title);
    if (['Sci-Fi', 'Fantasy', 'Xianxia', 'Cyberpunk', 'Steampunk', 'LitRPG'].includes(cert.genre)) {
      setGenre(cert.genre as Novel['genre']);
    }
    setChapterTitle('Chapter 1: ' + (cert.title || 'The Beginning'));
    setChapterContent(cert.storyText);
    setSynopsis(`Official debut novel certified by NovelRealm (${cert.marketGrade}). Certificate ID: ${cert.certificateId}`);
    setImportedFromExam(true);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !chapterContent.trim()) return;

    // Split text paragraphs into HTML paragraphs if user typed plain text
    const paragraphs = chapterContent
      .split('\n\n')
      .map(p => p.trim())
      .filter(Boolean)
      .map(p => `<p>${p}</p>`)
      .join('\n');

    const wordCount = chapterContent.trim().split(/\s+/).length;
    const novelId = Date.now();
    const chapterId = novelId + 1;

    const initialChapter: Chapter = {
      id: chapterId,
      novelId,
      chapterNumber: 1,
      title: chapterTitle.trim() || 'Chapter 1',
      content: paragraphs,
      wordCount,
      estimatedReadMinutes: Math.max(1, Math.ceil(wordCount / 200)),
      releaseDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const gradients = [
      'from-indigo-950 via-slate-900 to-blue-950',
      'from-amber-950 via-stone-900 to-rose-950',
      'from-emerald-950 via-teal-950 to-slate-950',
      'from-purple-950 via-slate-900 to-zinc-950',
    ];
    const fallbackGradient = gradients[Math.floor(Math.random() * gradients.length)];

    const newNovel: Novel = {
      id: novelId,
      title: title.trim(),
      author: author.trim(),
      fallbackGradient,
      genre,
      tags: tags.length > 0 ? tags : [genre, 'Original Work'],
      status: 'Ongoing',
      rating: 5.0,
      ratingCount: 1,
      totalViews: '0',
      viewCount: 0,
      publishedYear: new Date().getFullYear(),
      synopsis: synopsis.trim() || 'A compelling new serial written on NovelRealm.',
      chapters: [initialChapter],
      authorUpi: authorUpi.trim() || currentUser?.bankUpiId || undefined,
      authorEmail: currentUser?.email || undefined,
    };

    onAddNovel(newNovel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in font-clean-sans">
      <div
        className="w-full max-w-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-label="Add or Import Web Novel"
      >
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="font-display-title text-xl font-bold">Write & Publish Web Novel</h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                🌱 Starts at Novice Rank · Progresses to Diamond Grandmaster with real readership!
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

        {/* Quick Import from Certification Exam if Available */}
        {currentUser?.writerCertification && (
          <div className="mt-4 p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <strong className="text-amber-800 dark:text-amber-300 block">
                  Certified Exam Story Available: "{currentUser.writerCertification.title}"
                </strong>
                <span className="text-[11px] text-[var(--text-secondary)]">
                  {currentUser.writerCertification.wordCount} words · {currentUser.writerCertification.genre} · Grade: {currentUser.writerCertification.marketGrade}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleImportExamStory}
              className={`px-3.5 py-1.5 rounded-lg font-bold text-xs shrink-0 flex items-center gap-1.5 transition-all shadow-sm ${
                importedFromExam
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              {importedFromExam ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Imported!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Import Exam Story</span>
                </>
              )}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Novel Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Astral Blacksmith"
                className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Author / Pen Name *
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. C. S. Sterling"
                className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Genre
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value as any)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                {GENRE_LIST.filter(g => g !== 'All Genres').map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Tags (Comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Magic Academy, System, Rebirth"
                className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Synopsis / Blurb
            </label>
            <textarea
              rows={2}
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="What is this story about? Give readers a hook..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none"
            />
          </div>

          {/* Author Royalty Payout Field */}
          <div className="space-y-1.5 p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-[var(--border-subtle)]">
            <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center justify-between">
              <span>Author Payout Address (UPI / PayPal)</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">70% Royalty Share</span>
            </label>
            <input
              type="text"
              value={authorUpi}
              onChange={(e) => setAuthorUpi(e.target.value)}
              placeholder="e.g. author@oksbi or paypal.me/author (optional)"
              className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            <p className="text-[11px] text-[var(--text-secondary)]">
              Where the website will disburse your monthly ad shares, VIP unlock revenue, and direct reader tips.
            </p>
          </div>

          <div className="border-t border-[var(--border-subtle)] pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Chapter 1 Title
              </label>
              <span className="text-[11px] text-[var(--text-secondary)] font-mono">
                {chapterContent.trim() ? `${chapterContent.trim().split(/\s+/).length} words` : '0 words'}
              </span>
            </div>

            <input
              type="text"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              placeholder="e.g. The Awakening"
              className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Chapter 1 Story Text (Separate paragraphs with blank lines) *
              </label>
              <textarea
                required
                rows={8}
                value={chapterContent}
                onChange={(e) => setChapterContent(e.target.value)}
                placeholder="Paste or write your story here. Double line break will format into paragraphs for smooth e-reading..."
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/40 font-serif leading-relaxed"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Publish & Start Reading</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
