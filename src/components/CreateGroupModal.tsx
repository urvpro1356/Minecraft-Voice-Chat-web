import React, { useState } from 'react';
import { X, Users, Plus, Shield, Swords } from 'lucide-react';
import { GroupParty } from '../types';
import { CURRENT_USER } from '../data/mockData';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (newGroup: GroupParty) => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  onCreateGroup,
}) => {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [gamemode, setGamemode] = useState('Bedwars Squads');
  const [maxMembers, setMaxMembers] = useState('4');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedMax = parseInt(maxMembers, 10) || 4;
    const generatedTag = tag.trim().toUpperCase() || name.substring(0, 4).toUpperCase();

    const newGroup: GroupParty = {
      id: `grp-${Date.now()}`,
      name: name.trim(),
      tag: generatedTag,
      description: description.trim() || 'Casual and competitive squad. Looking for friendly and active teammates!',
      gamemode,
      memberCount: 1,
      maxMembers: parsedMax,
      members: [
        {
          id: CURRENT_USER.id,
          name: CURRENT_USER.username,
          avatar: CURRENT_USER.avatar,
          role: 'Leader',
        },
      ],
      voiceActive: false,
      voiceParticipants: [],
    };

    onCreateGroup(newGroup);
    setName('');
    setTag('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        id="create-group-modal"
        className="relative w-full max-w-md bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 shadow-2xl text-neutral-200"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Create Minecraft Party</h2>
              <p className="text-xs text-neutral-400">Assemble your squad for minigames & SMPs</p>
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
          <div className="grid grid-cols-3 gap-2.5">
            <div className="col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Group / Squad Name
              </label>
              <input
                id="input-group-name"
                type="text"
                placeholder="e.g. Netherite Guild, Bedwars Pros"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Tag (3-4 chars)
              </label>
              <input
                id="input-group-tag"
                type="text"
                maxLength={5}
                placeholder="PROS"
                value={tag}
                onChange={(e) => setTag(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 font-mono text-center"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Game Mode
              </label>
              <select
                id="select-group-gamemode"
                value={gamemode}
                onChange={(e) => setGamemode(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Bedwars Squads">Bedwars Squads</option>
                <option value="Hardcore Survival SMP">Hardcore Survival SMP</option>
                <option value="Skyblock Co-Op">Skyblock Co-Op</option>
                <option value="UHC Competitive">UHC Competitive</option>
                <option value="Creative Mega Build">Creative Mega Build</option>
                <option value="Speedrunning Duos">Speedrunning Duos</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Party Size Limit
              </label>
              <select
                id="select-group-limit"
                value={maxMembers}
                onChange={(e) => setMaxMembers(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="2">2 Players (Duo)</option>
                <option value="4">4 Players (Trio/Squad)</option>
                <option value="6">6 Players (Raid Team)</option>
                <option value="8">8 Players (Full Team)</option>
                <option value="12">12 Players (Guild)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
              Squad Goal / Description
            </label>
            <textarea
              id="input-group-desc"
              rows={2}
              placeholder="e.g. Grinding weekly tournaments, daily Discord voice chat..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 resize-none"
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
              id="btn-confirm-create-group"
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Party</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
