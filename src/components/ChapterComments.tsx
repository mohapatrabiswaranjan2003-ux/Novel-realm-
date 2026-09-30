import React, { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, Send, User, Sparkles } from 'lucide-react';
import { ChapterComment } from '../types/novel';
import { getChapterComments, addChapterComment, toggleCommentLike } from '../utils/communityStorage';

interface ChapterCommentsProps {
  chapterId: number;
  chapterNumber: number;
  novelTitle: string;
}

export const ChapterComments: React.FC<ChapterCommentsProps> = ({
  chapterId,
  chapterNumber,
  novelTitle,
}) => {
  const [comments, setComments] = useState<ChapterComment[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setComments(getChapterComments(chapterId));
  }, [chapterId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    const created = addChapterComment(chapterId, authorName, commentText);
    setComments((prev) => [created, ...prev.filter((c) => c.id !== created.id)]);
    setCommentText('');
    setIsSubmitting(false);

    setToastMessage('Comment posted! Thanks for joining the discussion.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLike = (commentId: string) => {
    toggleCommentLike(chapterId, commentId);
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const liked = !c.userLiked;
          return {
            ...c,
            likes: liked ? c.likes + 1 : Math.max(0, c.likes - 1),
            userLiked: liked,
          };
        }
        return c;
      })
    );
  };

  return (
    <section className="my-10 pt-6 border-t border-[var(--border-subtle)] font-clean-sans">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <MessageSquare className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-display-title text-base sm:text-lg font-bold text-[var(--text-primary)]">
              Chapter {chapterNumber} Discussion
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              {comments.length} comment{comments.length === 1 ? '' : 's'} on this chapter
            </p>
          </div>
        </div>

        <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>Active Readers</span>
        </span>
      </div>

      {toastMessage && (
        <div className="mb-4 p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs animate-fade-in font-medium">
          ✓ {toastMessage}
        </div>
      )}

      {/* Write a Comment Form */}
      <form onSubmit={handleSubmit} className="p-4 rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
            <User className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Your pen name / handle (e.g. DaoSeeker_42)"
            className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <textarea
          rows={3}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={`Share your thoughts, theories, or reactions to Chapter ${chapterNumber}...`}
          className="w-full p-3 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-[var(--text-secondary)]">
            Be respectful and keep spoilers tagged!
          </span>
          <button
            type="submit"
            disabled={!commentText.trim() || isSubmitting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold disabled:opacity-50 transition-colors shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post Comment</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="mt-6 space-y-3">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-slate-400/40 transition-colors space-y-2"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full ${comment.avatarColor} text-white flex items-center justify-center text-[11px] font-bold`}
                >
                  {comment.author.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <span className="font-semibold text-[var(--text-primary)]">
                    {comment.author}
                  </span>
                  <span className="block text-[10px] text-[var(--text-secondary)]">
                    {comment.timestamp}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleLike(comment.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                  comment.userLiked
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                    : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                title="Like comment"
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${comment.userLiked ? 'fill-current' : ''}`} />
                <span className="font-mono text-[11px]">{comment.likes}</span>
              </button>
            </div>

            <p className="text-xs text-[var(--text-primary)] leading-relaxed pl-9">
              {comment.content}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
