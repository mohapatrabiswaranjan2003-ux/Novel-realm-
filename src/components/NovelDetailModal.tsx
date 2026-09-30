import React, { useState, useEffect } from 'react';
import { Novel, ReadingProgress, NovelReview } from '../types/novel';
import { X, BookOpen, Star, Clock, Calendar, CheckCircle2, Heart, Share2, ThumbsUp, Send, MessageSquare, Wallet } from 'lucide-react';
import { getNovelReviews, addNovelReview, toggleReviewLike } from '../utils/communityStorage';
import { getWriterRankByViews } from '../utils/userAuthStorage';
import { ShareModal } from './ShareModal';

interface NovelDetailModalProps {
  novel: Novel | null;
  onClose: () => void;
  onStartReading: (novelId: number, chapterId: number) => void;
  progress?: ReadingProgress;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, novelId: number) => void;
  onOpenAuthorStudio?: (novelId: number) => void;
}

export const NovelDetailModal: React.FC<NovelDetailModalProps> = ({
  novel,
  onClose,
  onStartReading,
  progress,
  isFavorite,
  onToggleFavorite,
  onOpenAuthorStudio,
}) => {
  const [activeTab, setActiveTab] = useState<'chapters' | 'reviews'>('chapters');
  const [reviews, setReviews] = useState<NovelReview[]>([]);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Review Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [reviewSuccessToast, setReviewSuccessToast] = useState(false);

  useEffect(() => {
    if (novel) {
      setReviews(getNovelReviews(novel.id));
    }
  }, [novel]);

  if (!novel) return null;

  const lastChapter = progress
    ? novel.chapters.find((c) => c.id === progress.chapterId)
    : undefined;

  // Compute live average rating
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : novel.rating.toFixed(1);
  const totalReviewCount = reviews.length;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBody.trim()) return;

    const created = addNovelReview(
      novel.id,
      reviewerName,
      reviewRating,
      reviewTitle,
      reviewBody
    );
    setReviews([created, ...reviews]);
    setReviewTitle('');
    setReviewBody('');
    setShowReviewForm(false);
    setReviewSuccessToast(true);
    setTimeout(() => setReviewSuccessToast(false), 3000);
  };

  const handleLikeReview = (reviewId: string) => {
    toggleReviewLike(novel.id, reviewId);
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          const liked = !r.userLiked;
          return {
            ...r,
            likes: liked ? r.likes + 1 : Math.max(0, r.likes - 1),
            userLiked: liked,
          };
        }
        return r;
      })
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-clean-sans">
        <div
          className="w-full max-w-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          role="dialog"
          aria-label="Novel Details"
        >
          {/* Header / Banner */}
          <div className="relative p-6 sm:p-7 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row gap-6 items-start shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Book cover (3:4 aspect) */}
            <div className="w-28 sm:w-36 aspect-[3/4] shrink-0 rounded-lg overflow-hidden bg-slate-800 shadow-md border border-[var(--border-subtle)]">
              {novel.coverImage ? (
                <img
                  src={novel.coverImage}
                  alt={novel.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${novel.fallbackGradient} p-3 flex flex-col justify-between text-white`}>
                  <span className="text-[10px] uppercase font-bold tracking-wider">{novel.genre}</span>
                  <span className="font-display-title text-xs font-bold leading-tight line-clamp-3">{novel.title}</span>
                  <span className="text-[9px] opacity-75">{novel.author}</span>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="flex-1 space-y-3 min-w-0 pr-6">
              <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                <span className="font-semibold text-blue-600 dark:text-blue-400">{novel.genre}</span>
                <span aria-hidden="true">·</span>
                <span>{novel.status}</span>
                <span aria-hidden="true">·</span>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-mono tabular-nums text-xs font-semibold">{avgRating}</span>
                  <span className="text-[var(--text-secondary)] text-[11px]">({totalReviewCount} reviews)</span>
                </div>
              </div>

              <h2 className="font-display-title text-2xl font-bold leading-tight">
                {novel.title}
              </h2>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[var(--text-secondary)]">Author:</span>
                <span className="text-[var(--text-primary)] font-semibold">{novel.author}</span>
                {(() => {
                  const r = getWriterRankByViews(novel.viewCount);
                  return (
                    <span
                      title={`${r.label} - ${r.writerSharePercent > 0 ? `${r.writerSharePercent}% Writer Royalty Share` : 'Novice Starting Rank'}`}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    >
                      <span>{r.badge}</span>
                      <span>{r.label}</span>
                    </span>
                  );
                })()}
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                {novel.synopsis}
              </p>

              <div className="flex items-center gap-2.5 pt-1">
                <button
                  onClick={() => {
                    const targetChapterId = progress ? progress.chapterId : novel.chapters[0]?.id;
                    onStartReading(novel.id, targetChapterId);
                    onClose();
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>
                    {progress
                      ? `Resume: Ch. ${lastChapter?.chapterNumber || 1}`
                      : 'Start Reading Chapter 1'}
                  </span>
                </button>

                <button
                  onClick={(e) => onToggleFavorite(e, novel.id)}
                  className={`p-2 rounded-lg border transition-colors ${
                    isFavorite
                      ? 'border-red-500 text-red-500 bg-red-50/20'
                      : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={() => setIsShareOpen(true)}
                  className="p-2 rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  title="Share novel"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                {onOpenAuthorStudio && (
                  <button
                    onClick={() => {
                      onOpenAuthorStudio(novel.id);
                      onClose();
                    }}
                    className="p-2 rounded-lg border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                    title="Author & Owner Revenue Studio"
                  >
                    <Wallet className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Tabs (Chapters vs Reviews) */}
          <div className="flex border-b border-[var(--border-subtle)] px-6 bg-black/[0.01] dark:bg-white/[0.01]">
            <button
              onClick={() => setActiveTab('chapters')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'chapters'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Chapters ({novel.chapters.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'reviews'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
              <span>Reviews & Ratings ({totalReviewCount})</span>
            </button>
          </div>

          {reviewSuccessToast && (
            <div className="mx-6 mt-3 p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium animate-fade-in">
              ✓ Your review & star rating have been published!
            </div>
          )}

          {/* TAB 1: Chapters Table */}
          {activeTab === 'chapters' && (
            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              {/* Milestone Status Banner */}
              <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                novel.viewCount < 10000
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  : 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400'
              }`}>
                <div className="space-y-0.5">
                  <strong className="block font-semibold">
                    {novel.viewCount < 10000
                      ? `🏆 Early Reader Privilege Active (${novel.totalViews} / 10K Views)`
                      : `🌟 10K+ Readers Milestone (${novel.totalViews} Views)`}
                  </strong>
                  <p className="text-[11px] opacity-90">
                    {novel.viewCount < 10000
                      ? 'All chapters are 100% free! Readers starting now retain permanent free access.'
                      : 'Chapters 1 to 30 remain 100% free forever! Chapters 31+ unlock via Daily Free Pass or $2 VIP Pass.'}
                  </p>
                </div>
                <span className="shrink-0 font-mono font-bold text-xs">
                  {novel.viewCount < 10000 ? 'Free Access' : 'Ch. 1-30 Free'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  Available Chapters ({novel.chapters.length})
                </h3>
                <span className="text-xs text-[var(--text-secondary)] font-mono tabular-nums">
                  Total ~{novel.chapters.reduce((acc, c) => acc + c.wordCount, 0).toLocaleString()} words
                </span>
              </div>

              <div className="divide-y divide-[var(--border-subtle)]">
                {novel.chapters.map((ch) => {
                  const isCurrent = progress?.chapterId === ch.id;
                  const isCompleted = progress?.completedChapters?.includes(ch.id);
                  const isLocked = novel.viewCount >= 10000 && ch.chapterNumber > 30;

                  return (
                    <div
                      key={ch.id}
                      onClick={() => {
                        onStartReading(novel.id, ch.id);
                        onClose();
                      }}
                      className="py-3 px-2 flex items-center justify-between gap-3 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] cursor-pointer rounded-lg transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono text-xs font-bold text-[var(--text-secondary)] group-hover:text-blue-600 transition-colors w-12">
                          #{ch.chapterNumber}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium truncate group-hover:text-blue-600 transition-colors">
                              {ch.title}
                            </h4>
                            {isLocked ? (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                🔒 Locked
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                Free
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-[var(--text-secondary)] mt-0.5">
                            <span className="flex items-center gap-0.5">
                              <Calendar className="w-3 h-3" />
                              {ch.releaseDate}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="flex items-center gap-0.5">
                              <Clock className="w-3 h-3" />
                              {ch.estimatedReadMinutes} min
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isCompleted && (
                          <span title="Completed">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-[10px] font-mono text-blue-600 font-semibold uppercase">
                            {Math.round(progress?.scrollPercent || 0)}%
                          </span>
                        )}
                        <span className="text-xs text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform font-medium">
                          {isLocked ? 'Unlock →' : 'Read →'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Reviews & Community Ratings */}
          {activeTab === 'reviews' && (
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              {/* Score summary banner */}
              <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <span className="text-3xl font-black text-[var(--text-primary)] font-mono">{avgRating}</span>
                    <div className="flex items-center gap-0.5 text-amber-500 justify-center mt-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= Math.round(Number(avgRating)) ? 'fill-current' : 'opacity-30'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-[var(--text-secondary)] block mt-0.5">
                      {totalReviewCount} verified reviews
                    </span>
                  </div>
                  <div className="border-l border-[var(--border-subtle)] pl-4 text-xs text-[var(--text-secondary)] space-y-0.5">
                    <div>🌟 96% of readers recommend this novel</div>
                    <div>📖 Verified reader ratings & discussions</div>
                  </div>
                </div>

                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  {showReviewForm ? 'Cancel' : 'Write a Review'}
                </button>
              </div>

              {/* Review submission form */}
              {showReviewForm && (
                <form
                  onSubmit={handleReviewSubmit}
                  className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-3 animate-fade-in"
                >
                  <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                    Rate & Review "{novel.title}"
                  </h4>

                  {/* Star rating selector */}
                  <div className="space-y-1">
                    <label className="text-[11px] text-[var(--text-secondary)] font-medium">Your Rating</label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = (hoverRating ?? reviewRating) >= star;
                        return (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(null)}
                            onClick={() => setReviewRating(star)}
                            className="p-1 text-amber-500 hover:scale-110 transition-transform"
                          >
                            <Star className={`w-6 h-6 ${isFilled ? 'fill-current' : 'stroke-current'}`} />
                          </button>
                        );
                      })}
                      <span className="text-xs font-bold text-amber-500 ml-2">
                        {reviewRating === 5 ? 'Masterpiece (5/5)' : `${reviewRating} Stars`}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="Your Pen Name (e.g. CelestialReader)"
                      className="px-3 py-1.5 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="Headline (e.g. Incredible worldbuilding!)"
                      className="px-3 py-1.5 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <textarea
                    rows={3}
                    value={reviewBody}
                    onChange={(e) => setReviewBody(e.target.value)}
                    placeholder="Write your honest review... What did you love about the characters, pacing, or plot?"
                    className="w-full p-2.5 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-[var(--border-subtle)] hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!reviewBody.trim()}
                      className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                    >
                      Publish Review
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2 hover:border-slate-400/40 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                          {rev.author.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-semibold text-[var(--text-primary)]">{rev.author}</span>
                          <span className="block text-[10px] text-[var(--text-secondary)]">{rev.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-amber-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${star <= rev.rating ? 'fill-current' : 'opacity-25'}`}
                          />
                        ))}
                      </div>
                    </div>

                    <h5 className="text-xs font-bold text-[var(--text-primary)] pt-1">{rev.title}</h5>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{rev.content}</p>

                    <div className="flex items-center justify-between pt-1 border-t border-[var(--border-subtle)]">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        ✓ Verified Reader
                      </span>

                      <button
                        type="button"
                        onClick={() => handleLikeReview(rev.id)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                          rev.userLiked
                            ? 'text-blue-600 dark:text-blue-400 bg-blue-500/10'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <ThumbsUp className={`w-3 h-3 ${rev.userLiked ? 'fill-current' : ''}`} />
                        <span>{rev.likes} helpful</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={novel.title}
        description={novel.synopsis}
      />
    </>
  );
};
