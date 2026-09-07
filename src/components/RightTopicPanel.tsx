import React from 'react';
import {
  Trophy,
  ShieldCheck,
  TrendingUp,
  Users,
  Award,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Flame,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Contributor, LinkedAccount, TopicStats } from '../types';

interface RightTopicPanelProps {
  stats: TopicStats;
  contributors: Contributor[];
  javaAccount: LinkedAccount;
  bedrockAccount: LinkedAccount;
  onOpenAccountLinkModal: () => void;
  onOpenContestDetails: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const RightTopicPanel: React.FC<RightTopicPanelProps> = ({
  stats,
  contributors,
  javaAccount,
  bedrockAccount,
  onOpenAccountLinkModal,
  onOpenContestDetails,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const isAnyAccountLinked = javaAccount.isLinked || bedrockAccount.isLinked;

  const content = (
    <div className="flex flex-col h-full bg-[#121212] border-l border-[#2a2a2a] p-4 space-y-4 overflow-y-auto w-80 select-none">
      {/* Mobile close button */}
      {onCloseMobile && (
        <div className="flex items-center justify-between xl:hidden pb-2 border-b border-[#2a2a2a]">
          <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Topic Panel</span>
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* 1. Contest / Announcement Banner Card */}
      <div
        id="contest-banner-card"
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-500/20 via-neutral-900 to-[#181818] border border-amber-500/40 p-4 shadow-lg shadow-amber-950/20 group"
      >
        <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
            <Trophy className="w-3 h-3 text-amber-400" />
            Official Contest
          </span>
          <span className="text-[11px] font-semibold text-neutral-400">4 Days Left</span>
        </div>

        <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
          Mega Build Battle 2026: Castles in the Aether
        </h4>

        <p className="text-xs text-neutral-300 mt-1.5 line-clamp-2 leading-relaxed">
          Submit your fantasy celestial sky castles. Top 3 creations get featured in the community trailer!
        </p>

        <div className="mt-3 pt-2.5 border-t border-amber-500/20 flex items-center justify-between">
          <div className="text-[11px] text-amber-400 font-semibold">
            Prize: 10,000 Coins + Trophy
          </div>
          <button
            type="button"
            onClick={onOpenContestDetails}
            className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs transition-colors flex items-center gap-1"
          >
            <span>Enter</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 2. Connect Your Minecraft Account Prompt Card */}
      <div
        id="account-linking-prompt-card"
        className={`rounded-xl p-4 border transition-all ${
          isAnyAccountLinked
            ? 'bg-emerald-950/20 border-emerald-500/40'
            : 'bg-gradient-to-br from-emerald-950/40 to-[#181818] border-emerald-500/40'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
              isAnyAccountLinked
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            {isAnyAccountLinked ? (
              <>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white">Account Linked</h4>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-[11px] text-emerald-400/90 font-medium truncate mt-0.5">
                  {javaAccount.isLinked ? javaAccount.gamertag : bedrockAccount.gamertag}
                </p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Verified Minecraft identity synced with live stats & server badges.
                </p>
                <button
                  type="button"
                  onClick={onOpenAccountLinkModal}
                  className="mt-2 text-xs font-semibold text-neutral-300 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  Manage Linking <ChevronRight className="w-3 h-3" />
                </button>
              </>
            ) : (
              <>
                <h4 className="text-xs font-bold text-white">Connect Your Account</h4>
                <p className="text-[11px] text-neutral-300 mt-1 leading-relaxed">
                  Link your Java or Bedrock account to unlock VIP badges, server sync, and tournament entry.
                </p>
                <button
                  id="btn-sidebar-link-cta"
                  type="button"
                  onClick={onOpenAccountLinkModal}
                  className="mt-3 w-full py-2 px-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Connect Account</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 3. Topic Stats */}
      <div id="topic-stats-card" className="p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Community Stats
          </span>
          <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {stats.growthPercentage}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-2.5 rounded-lg bg-[#121212] border border-[#2a2a2a]">
            <p className="text-[11px] text-neutral-400">Total Builders</p>
            <p className="text-base font-extrabold text-white mt-0.5">{stats.subscribers}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#121212] border border-[#2a2a2a]">
            <p className="text-[11px] text-neutral-400">Projects This Wk</p>
            <p className="text-base font-extrabold text-white mt-0.5">{stats.projectsThisWeek}</p>
          </div>
        </div>
      </div>

      {/* 4. Top Contributor Avatars Row */}
      <div className="p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a]">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Top Contributors
          </span>
          <span className="text-[11px] text-neutral-400">This Month</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          {contributors.slice(0, 5).map((c, idx) => (
            <div key={c.id} className="relative group cursor-pointer text-center">
              <div className="relative">
                <img
                  src={c.avatar}
                  alt={c.username}
                  className="w-10 h-10 rounded-xl object-cover border-2 border-neutral-700 group-hover:border-emerald-400 transition-colors"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-neutral-900 border border-neutral-700 text-[10px] font-bold flex items-center justify-center text-emerald-400">
                  {idx + 1}
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 mt-1 truncate max-w-[48px]">{c.username}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Popular Contributors Detailed List */}
      <div id="popular-contributors-list" className="p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Popular Contributors
          </span>
          <span className="text-[11px] text-neutral-400">XP Points</span>
        </div>

        <div className="space-y-2.5 pt-1">
          {contributors.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-[#121212] transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={c.avatar}
                    alt={c.username}
                    className="w-9 h-9 rounded-xl object-cover border border-neutral-700 group-hover:border-emerald-400/50"
                  />
                  <span className="absolute -top-1 -left-1 w-3.5 h-3.5 rounded bg-neutral-800 text-[9px] font-bold text-neutral-300 flex items-center justify-center border border-neutral-700">
                    {c.rank}
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                    {c.username}
                  </p>
                  <p className="text-[10px] text-emerald-400/90 truncate font-medium">
                    {c.badge}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-extrabold text-neutral-200">
                  {c.points.toLocaleString()}
                </span>
                <p className="text-[10px] text-neutral-400">pts</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop permanent right panel */}
      <aside id="right-topic-panel" className="hidden xl:block shrink-0 h-screen sticky top-0 z-30">
        {content}
      </aside>

      {/* Mobile drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 xl:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-80 max-w-[85vw] animate-in slide-in-from-right duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
