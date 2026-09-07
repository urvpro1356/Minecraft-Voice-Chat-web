import React, { useState } from 'react';
import { X, MessageSquarePlus, Sparkles, Tag, Plus } from 'lucide-react';
import { DiscussionPost } from '../types';
import { CURRENT_USER } from '../data/mockData';

interface CreateDiscussionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (newPost: DiscussionPost) => void;
}

export const CreateDiscussionModal: React.FC<CreateDiscussionModalProps> = ({
  isOpen,
  onClose,
  onCreatePost,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Builds');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('Vanilla 1.21, Showcase');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tagList = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newPost: DiscussionPost = {
      id: `disc-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      author: {
        name: CURRENT_USER.username,
        avatar: CURRENT_USER.avatar,
        rankBadge: CURRENT_USER.rankBadge,
        level: CURRENT_USER.level,
      },
      category,
      createdAt: 'Just now',
      upvotes: 1,
      userVote: 'up',
      commentCount: 0,
      comments: [],
      tags: tagList.length > 0 ? tagList : [category, 'Community'],
      contributors: [{ id: CURRENT_USER.id, name: CURRENT_USER.username, avatar: CURRENT_USER.avatar }],
      isSaved: false,
    };

    onCreatePost(newPost);
    setTitle('');
    setContent('');
    setTags('Vanilla 1.21, Showcase');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        id="create-discussion-modal"
        className="relative w-full max-w-lg bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 shadow-2xl text-neutral-200"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <MessageSquarePlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Create Community Discussion</h2>
              <p className="text-xs text-neutral-400">Share your designs, redstone circuits, or guides</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
              Discussion Title
            </label>
            <input
              id="input-post-title"
              type="text"
              placeholder="e.g. How to automate all Nether items with one portal slice..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Category
              </label>
              <select
                id="select-post-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Builds">Builds & Architecture</option>
                <option value="Redstone">Redstone & Logic</option>
                <option value="Guides">Survival Guides</option>
                <option value="Showcase">Showcase</option>
                <option value="PvP">PvP & Minigames</option>
                <option value="Mods">Mods & Shaders</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Tags (comma separated)
              </label>
              <input
                id="input-post-tags"
                type="text"
                placeholder="Hardcore, Farm, SMP"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
              Post Content & Details
            </label>
            <textarea
              id="input-post-content"
              rows={4}
              placeholder="Describe your design, share coordinates, materials list, or question..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              id="btn-submit-post"
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Discussion</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
