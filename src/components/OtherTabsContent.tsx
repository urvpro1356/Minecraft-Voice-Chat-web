import React from 'react';
import {
  Compass,
  Trophy,
  Swords,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Download,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { TabType } from './HeaderBanner';

interface OtherTabsContentProps {
  activeTab: TabType;
  onSwitchToConnect: () => void;
  onShowToast: (msg: string) => void;
}

export const OtherTabsContent: React.FC<OtherTabsContentProps> = ({
  activeTab,
  onSwitchToConnect,
  onShowToast,
}) => {
  if (activeTab === 'Explore') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              Community World & Resource Showcase
            </h2>
            <p className="text-xs text-neutral-400">
              Curated builds, custom shaders, and adventure schematics uploaded by top builders
            </p>
          </div>
          <button
            type="button"
            onClick={onSwitchToConnect}
            className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
          >
            Looking to party up? Open Connect &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Aetherial Sky Citadel',
              author: 'PixieTerra',
              downloads: '18.4K',
              rating: '4.9 ★',
              img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80',
              tag: 'Mega Build',
            },
            {
              title: 'Iris Hyper-Realism Shaders 1.21',
              author: 'ShaderForge',
              downloads: '42.1K',
              rating: '5.0 ★',
              img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
              tag: 'Shaders',
            },
            {
              title: 'Hardcore Underground Vault Hub',
              author: 'RedstoneDoc',
              downloads: '9.2K',
              rating: '4.8 ★',
              img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80',
              tag: 'Redstone Map',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden group hover:border-emerald-500/40 transition-all"
            >
              <div className="h-36 overflow-hidden relative">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/80 text-emerald-400 border border-emerald-500/40">
                  {item.tag}
                </span>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>by {item.author}</span>
                  <span className="text-emerald-400 font-semibold">{item.rating}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#2a2a2a]">
                  <span className="text-[11px] text-neutral-500">{item.downloads} downloads</span>
                  <button
                    type="button"
                    onClick={() => onShowToast(`Downloading ${item.title} schematic...`)}
                    className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Get World</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'Compete') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Ranked Ladders & Tournaments
            </h2>
            <p className="text-xs text-neutral-400">
              Compete in official Bedwars, UHC, and crystal PvP showdowns with cash & coin prizes
            </p>
          </div>
          <button
            type="button"
            onClick={onSwitchToConnect}
            className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
          >
            Find a team in Connect &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Summer Bedwars Championship (Quads)',
              prize: '$2,500 + Netherite Trophy',
              date: 'Saturday, 6:00 PM EST',
              slots: '56 / 64 Teams Registered',
              tier: 'High Elo Tier',
            },
            {
              title: 'Vanilla 1.21 Netherite PvP Solo Cup',
              prize: '5,000 Community Coins',
              date: 'Tomorrow, 8:00 PM EST',
              slots: '112 / 128 Players',
              tier: 'Open Bracket',
            },
          ].map((tourney) => (
            <div
              key={tourney.title}
              className="p-5 rounded-xl bg-[#1a1a1a] border border-amber-500/30 hover:border-amber-500/60 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  {tourney.tier}
                </span>
                <span className="text-xs text-neutral-400">{tourney.date}</span>
              </div>
              <h3 className="text-base font-bold text-white">{tourney.title}</h3>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-[#2a2a2a]">
                <span className="text-amber-400 font-bold">Prize: {tourney.prize}</span>
                <span className="text-neutral-400">{tourney.slots}</span>
              </div>
              <button
                type="button"
                onClick={() => onShowToast(`Team registered for ${tourney.title}!`)}
                className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-amber-950/40"
              >
                Register Squad
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'Practice') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Swords className="w-5 h-5 text-emerald-400" />
            PvP & Parkour Practice Arenas
          </h2>
          <p className="text-xs text-neutral-400">
            Hone your clutch saves, block placement speed, combo tracking, and elytra navigation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Clutch & Bridge Practice', ip: 'bridge.minecomm.net', stat: '99.9% Tickrate' },
            { name: 'Crystal PvP Duels Hub', ip: 'crystal.pvpzone.io', stat: '0-Delay Hits' },
            { name: 'Neo Parkour & Speedrun Training', ip: 'parkour.trainmc.org', stat: 'Ranked Times' },
          ].map((arena) => (
            <div key={arena.name} className="p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] space-y-3">
              <h3 className="text-sm font-bold text-white">{arena.name}</h3>
              <p className="text-xs font-mono text-emerald-400 bg-black/50 p-2 rounded-lg border border-neutral-800">
                {arena.ip}
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-neutral-400">{arena.stat}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(arena.ip);
                    onShowToast(`Copied ${arena.ip} to clipboard!`);
                  }}
                  className="text-xs text-emerald-400 font-bold hover:underline"
                >
                  Copy IP
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'Learn') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            Redstone Academy & Survival Engineering
          </h2>
          <p className="text-xs text-neutral-400">
            Master comparator subtraction, chunk loading, copper bulb tick-delays, and mob caps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Understanding 0-Tick Pistons & Micro-Tick Priority in 1.21',
              difficulty: 'Advanced',
              readTime: '8 min read',
            },
            {
              title: 'How to Build an Automatic 2,400 Iron/Hour Golem Farm',
              difficulty: 'Intermediate',
              readTime: '6 min read',
            },
            {
              title: 'Complete Mob Spawning Mechanics & Perimeter Clearing Guide',
              difficulty: 'Expert',
              readTime: '12 min read',
            },
            {
              title: 'Crafter Block Automation: 10 Essential Compact Recipes',
              difficulty: 'Beginner Friendly',
              readTime: '5 min read',
            },
          ].map((guide) => (
            <div
              key={guide.title}
              className="p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-emerald-500/40 transition-all space-y-2 cursor-pointer"
              onClick={() => onShowToast(`Opening guide: ${guide.title}`)}
            >
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="text-emerald-400 font-semibold">{guide.difficulty}</span>
                <span>{guide.readTime}</span>
              </div>
              <h3 className="text-sm font-bold text-white hover:text-emerald-400 transition-colors">
                {guide.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
