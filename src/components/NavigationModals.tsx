import React, { useState } from 'react';
import {
  X,
  Bell,
  ShoppingBag,
  Sparkles,
  Check,
  Plus,
  Zap,
  Shield,
  Layers,
} from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  onClear,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'n1',
      title: 'Squad Invitation',
      desc: 'EnderKnight_99 invited you to Bedwars Sweats 4v4 party',
      time: '12m ago',
      unread: true,
    },
    {
      id: 'n2',
      title: 'Discussion Upvote',
      desc: 'RedstoneDoc and 24 others upvoted your RISC CPU comment',
      time: '1h ago',
      unread: true,
    },
    {
      id: 'n3',
      title: 'Contest Notice',
      desc: 'Castles in the Aether submissions close in 4 days!',
      time: '3h ago',
      unread: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#141414] border border-[#2a2a2a] rounded-2xl p-5 shadow-2xl text-neutral-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClear}
              className="text-xs text-emerald-400 hover:underline"
            >
              Mark all read
            </button>
            <button type="button" onClick={onClose} className="p-1 hover:text-white text-neutral-400">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-3 space-y-2.5">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="p-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-start justify-between gap-3"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white">{n.title}</h4>
                  {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">{n.desc}</p>
                <span className="text-[10px] text-neutral-500 block pt-1">{n.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const StoreModal: React.FC<StoreModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const items = [
    { name: 'Netherite VIP Rank', price: '1,500 Coins', perk: 'Custom animated glowing username & server queue bypass' },
    { name: 'Emerald Cape Particle Effect', price: '800 Coins', perk: 'Custom in-game aura synced across linked servers' },
    { name: 'Community Server Boost (30 Days)', price: '2,200 Coins', perk: 'Pin your community server to top of Explore list' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 shadow-2xl text-neutral-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Community Store</h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                  SUMMER SALE
                </span>
              </div>
              <p className="text-xs text-neutral-400">Balance: 3,450 MineCoins</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 hover:text-white text-neutral-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div
              key={item.name}
              className="p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">{item.name}</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">{item.perk}</p>
                <span className="text-xs text-amber-400 font-bold block">{item.price}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onShowToast(`Purchased ${item.name}! Applied to your linked Minecraft account.`);
                  onClose();
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs shrink-0 transition-all shadow-md shadow-emerald-500/20"
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface AddTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTopic: (topicName: string) => void;
}

export const AddTopicModal: React.FC<AddTopicModalProps> = ({
  isOpen,
  onClose,
  onAddTopic,
}) => {
  if (!isOpen) return null;

  const suggestions = [
    { name: 'Terraria', icon: '🌳', count: '410k' },
    { name: 'Hytale', icon: '⚔️', count: '290k' },
    { name: 'Stardew Valley', icon: '🌾', count: '380k' },
    { name: 'Valorant', icon: '🎯', count: '780k' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#141414] border border-[#2a2a2a] rounded-2xl p-5 shadow-2xl text-neutral-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#2a2a2a]">
          <h3 className="text-sm font-bold text-white">Add Game Interests</h3>
          <button type="button" onClick={onClose} className="p-1 hover:text-white text-neutral-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-2.5">
          {suggestions.map((sug) => (
            <div
              key={sug.name}
              className="p-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{sug.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-white">{sug.name}</h4>
                  <span className="text-[10px] text-neutral-400">{sug.count} members</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onAddTopic(sug.name);
                  onClose();
                }}
                className="px-3 py-1 bg-neutral-800 hover:bg-emerald-500 hover:text-neutral-950 text-neutral-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Follow</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
