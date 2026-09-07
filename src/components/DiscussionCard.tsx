import React, { useState } from 'react';
import {
  ChevronUp,
  ChevronDown,
  MessageSquare,
  Share2,
  Bookmark,
  Send,
  Sparkles,
  Check,
} from 'lucide-react';
import { CommentItem, DiscussionPost } from '../types';
import { CURRENT_USER } from '../data/mockData';

interface DiscussionCardProps {
  post: DiscussionPost;
  onVote: (id: string, direction: 'up' | 'down') => void;
  onAddComment: (postId: string, comment: CommentItem) => void;
  onToggleSave: (id: string) => void;
  onShare: (post: DiscussionPost) => void;
}

export const DiscussionCard: React.FC<DiscussionCardProps> = ({
  post,
  onVote,
  onAddComment,
  onToggleSave,
  onShare,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: CommentItem = {
      id: `comm-${Date.now()}`,
      authorName: CURRENT_USER.username,
      authorAvatar: CURRENT_USER.avatar,
      authorBadge: CURRENT_USER.rankBadge,
      content: newCommentText.trim(),
      timestamp: 'Just now',
      upvotes: 1,
    };

    onAddComment(post.id, newComment);
    setNewCommentText('');
  };

  return (
    <article
      id={`discussion-card-${post.id}`}
      className="p-4 sm:p-5 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-neutral-700 transition-all duration-200"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Left: Upvote Column with Vertical Arrows */}
        <div className="flex flex-col items-center shrink-0 bg-[#121212] p-1 sm:p-1.5 rounded-xl border border-[#2a2a2a]">
          <button
            id={`btn-upvote-${post.id}`}
            type="button"
            onClick={() => onVote(post.id, 'up')}
            className={`p-1.5 rounded-lg transition-colors ${
              post.userVote === 'up'
                ? 'text-emerald-400 bg-emerald-500/20'
                : 'text-neutral-400 hover:text-emerald-400 hover:bg-neutral-800'
            }`}
            title="Upvote"
          >
            <ChevronUp className="w-5 h-5 stroke-[2.5]" />
          </button>

          <span
            className={`text-xs font-bold my-0.5 ${
              post.userVote === 'up'
                ? 'text-emerald-400 font-extrabold'
                : post.userVote === 'down'
                ? 'text-rose-400 font-extrabold'
                : 'text-neutral-200'
            }`}
          >
            {post.upvotes.toLocaleString()}
          </span>

          <button
            id={`btn-downvote-${post.id}`}
            type="button"
            onClick={() => onVote(post.id, 'down')}
            className={`p-1.5 rounded-lg transition-colors ${
              post.userVote === 'down'
                ? 'text-rose-400 bg-rose-500/20'
                : 'text-neutral-400 hover:text-rose-400 hover:bg-neutral-800'
            }`}
            title="Downvote"
          >
            <ChevronDown className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Center: Post Content */}
        <div className="flex-1 min-w-0">
          {/* Post Author Info & Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 mb-1.5">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-5 h-5 rounded-md object-cover border border-neutral-700"
            />
            <span className="font-bold text-neutral-200 hover:text-emerald-400 cursor-pointer">
              {post.author.name}
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 text-emerald-400 font-medium border border-neutral-700">
              {post.author.rankBadge}
            </span>
            <span>•</span>
            <span className="text-neutral-400">{post.createdAt}</span>

            <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-[#121212] text-neutral-300 border border-[#2a2a2a]">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-white hover:text-emerald-400 transition-colors leading-snug cursor-pointer">
            {post.title}
          </h3>

          {/* Content snippet */}
          <p className="text-xs sm:text-sm text-neutral-300 mt-2 leading-relaxed">
            {post.content}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded bg-[#121212] text-neutral-400 border border-[#2a2a2a] hover:text-emerald-400 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Action Row & Contributors Avatars on Right */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#2a2a2a]">
            <div className="flex items-center gap-3 text-xs text-neutral-400">
              <button
                type="button"
                onClick={() => setShowComments(!showComments)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
                  showComments ? 'bg-neutral-800 text-white' : 'hover:bg-neutral-800 hover:text-neutral-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold">{post.commentCount} Comments</span>
              </button>

              <button
                type="button"
                onClick={() => onShare(post)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 hover:text-neutral-200 transition-colors"
                title="Share post"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleSave(post.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors ${
                  post.isSaved ? 'text-amber-400 bg-amber-500/10' : 'hover:bg-neutral-800 hover:text-neutral-200'
                }`}
                title={post.isSaved ? 'Saved' : 'Save post'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${post.isSaved ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">{post.isSaved ? 'Saved' : 'Save'}</span>
              </button>
            </div>

            {/* Small Contributor Avatars on the Right */}
            {post.contributors.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="hidden md:inline text-[11px] text-neutral-400">Discussed by</span>
                <div className="flex items-center -space-x-1.5">
                  {post.contributors.map((contrib) => (
                    <img
                      key={contrib.id}
                      src={contrib.avatar}
                      alt={contrib.name}
                      title={contrib.name}
                      className="w-5 h-5 rounded-full object-cover border border-[#1a1a1a]"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-[#2a2a2a] space-y-3 animate-in fade-in duration-200">
          {/* New Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
            <img
              src={CURRENT_USER.avatar}
              alt={CURRENT_USER.username}
              className="w-7 h-7 rounded-lg object-cover border border-neutral-700 shrink-0"
            />
            <input
              type="text"
              placeholder="Write a constructive reply..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-[#121212] border border-[#2a2a2a] rounded-xl text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!newCommentText.trim()}
              className="px-3 py-1.5 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 text-neutral-950 font-bold text-xs rounded-xl transition-all shrink-0"
            >
              Reply
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-2.5 pt-2">
            {post.comments.map((comm) => (
              <div key={comm.id} className="p-3 rounded-xl bg-[#121212] border border-[#2a2a2a] space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={comm.authorAvatar}
                      alt={comm.authorName}
                      className="w-5 h-5 rounded-md object-cover"
                    />
                    <span className="font-bold text-neutral-200">{comm.authorName}</span>
                    {comm.authorBadge && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-800 text-emerald-400 border border-neutral-700">
                        {comm.authorBadge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-400">{comm.timestamp}</span>
                </div>
                <p className="text-xs text-neutral-300 pl-7 leading-relaxed">{comm.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
