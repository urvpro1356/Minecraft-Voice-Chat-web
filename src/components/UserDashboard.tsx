import React, { useState } from 'react';
import {
  ShieldCheck,
  Gamepad2,
  Smartphone,
  CheckCircle2,
  Unplug,
  Copy,
  ExternalLink,
  Coins,
  Sparkles,
  Trophy,
  Server,
  Users,
  MessageCircle,
  Radio,
  Mic,
  Plus,
  ArrowRight,
  LogOut,
  Hash,
  Wifi,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { AppUser, LinkedAccount, PlatformEdition, ServerItem, FriendUser } from '../types';

interface UserDashboardProps {
  currentUser: AppUser;
  linkedAccounts: Record<PlatformEdition, LinkedAccount>;
  onOpenLinkModal: () => void;
  servers: ServerItem[];
  onOpenAddServerModal: () => void;
  onCopyIp: (ip: string) => void;
  onJoinServer: (server: ServerItem) => void;
  onDeleteServer?: (id: string) => void;
  friends: FriendUser[];
  onOpenFriendChat: (friend: FriendUser) => void;
  onStartVoiceCallWithFriend: (friend: FriendUser) => void;
  onLogout: () => void;
  onExploreHub: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  linkedAccounts,
  onOpenLinkModal,
  servers,
  onOpenAddServerModal,
  onCopyIp,
  onJoinServer,
  onDeleteServer,
  friends,
  onOpenFriendChat,
  onStartVoiceCallWithFriend,
  onLogout,
  onExploreHub,
}) => {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(key);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const isAnyAccountLinked = linkedAccounts.java.isLinked || linkedAccounts.bedrock.isLinked;

  return (
    <div id="user-dashboard-view" className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Dashboard Welcome Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#182a20] via-[#121815] to-[#0f1412] border border-emerald-500/30 p-6 sm:p-8 shadow-2xl shadow-emerald-950/30">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-400/80 shadow-lg shadow-emerald-950/60"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#121815]" />
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {currentUser.username}
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  {currentUser.rankBadge}
                </span>
                {currentUser.isGuest && (
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Guest Account
                  </span>
                )}
              </div>

              <p className="text-xs text-neutral-400 mt-1 font-mono">
                Minecraft ID: <span className="text-neutral-200">@{currentUser.gamertag}</span>
              </p>

              {/* Level & XP Progress bar */}
              <div className="mt-3 flex items-center gap-3 w-full max-w-xs">
                <span className="text-xs font-bold text-neutral-300 whitespace-nowrap">Lvl {currentUser.level}</span>
                <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${currentUser.xpProgress}%` }}
                  />
                </div>
                <span className="text-[11px] text-neutral-400 whitespace-nowrap">{currentUser.xpProgress}% XP</span>
              </div>
            </div>
          </div>

          {/* Quick Stat Pills & Action */}
          <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto justify-start md:justify-end">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#141414]/90 border border-[#2a2a2a] backdrop-blur-md">
              <Coins className="w-4 h-4 text-amber-400" />
              <div>
                <p className="text-[10px] uppercase font-bold text-neutral-400">Emeralds</p>
                <p className="text-sm font-black text-white">{currentUser.coins.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#141414]/90 border border-[#2a2a2a] backdrop-blur-md">
              <Server className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-[10px] uppercase font-bold text-neutral-400">Servers</p>
                <p className="text-sm font-black text-white">{servers.length} Available</p>
              </div>
            </div>

            <button
              type="button"
              id="btn-dashboard-logout"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-neutral-800/80 hover:bg-rose-950/40 text-neutral-300 hover:text-rose-400 border border-neutral-700 hover:border-rose-500/40 text-xs font-semibold transition-all"
              title="Log out of account"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Connected Minecraft Accounts Section */}
      <section id="dashboard-accounts-section">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Linked Minecraft Editions
            </h2>
            <p className="text-xs text-neutral-400">
              Synchronize your official Java & Bedrock Gamertags for in-game stats and server whitelisting
            </p>
          </div>

          <button
            type="button"
            id="btn-dashboard-manage-linking"
            onClick={onOpenLinkModal}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
          >
            <span>{isAnyAccountLinked ? 'Manage Credentials' : '+ Link Account'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Java Edition Card */}
          <div className="p-4 rounded-xl bg-[#161616] border border-[#262626] hover:border-emerald-500/40 transition-all flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                  linkedAccounts.java.isLinked
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                    : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                }`}
              >
                <Gamepad2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">Java Edition</h3>
                  {linkedAccounts.java.isLinked ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Linked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded-full border border-neutral-700">
                      <Unplug className="w-3 h-3" />
                      Unlinked
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-300 font-mono mt-0.5">
                  {linkedAccounts.java.isLinked ? linkedAccounts.java.gamertag : 'Not connected yet'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenLinkModal}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-all"
            >
              {linkedAccounts.java.isLinked ? 'Change' : 'Link Java'}
            </button>
          </div>

          {/* Bedrock Edition Card */}
          <div className="p-4 rounded-xl bg-[#161616] border border-[#262626] hover:border-emerald-500/40 transition-all flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                  linkedAccounts.bedrock.isLinked
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                    : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                }`}
              >
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">Bedrock / Pocket Edition</h3>
                  {linkedAccounts.bedrock.isLinked ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Linked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded-full border border-neutral-700">
                      <Unplug className="w-3 h-3" />
                      Unlinked
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-300 font-mono mt-0.5">
                  {linkedAccounts.bedrock.isLinked ? linkedAccounts.bedrock.gamertag : 'Not connected yet'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenLinkModal}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-all"
            >
              {linkedAccounts.bedrock.isLinked ? 'Change' : 'Link Bedrock'}
            </button>
          </div>
        </div>
      </section>

      {/* 3. Real Real-Time Minecraft Servers Grid */}
      <section id="dashboard-servers-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-400" />
              Live Minecraft Servers (Real Pinging)
            </h2>
            <p className="text-xs text-neutral-400">
              Live ping latency, active player counts, and 1-click IP copy directly to your clipboard
            </p>
          </div>

          <button
            type="button"
            id="btn-dashboard-add-server"
            onClick={onOpenAddServerModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Minecraft Server</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {servers.map((server) => (
            <div
              key={server.id}
              className="p-4 rounded-xl bg-[#161616] border border-[#262626] hover:border-emerald-500/30 transition-all flex flex-col justify-between gap-4 group"
            >
              <div className="flex items-start gap-3">
                <img
                  src={server.iconUrl}
                  alt={server.name}
                  className="w-12 h-12 rounded-xl object-cover border border-neutral-700 group-hover:border-emerald-400/50 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-white truncate">{server.name}</h3>
                    <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
                      <Wifi className="w-3 h-3 text-emerald-400" />
                      {server.pingMs}ms
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 line-clamp-2 mt-1">{server.description}</p>

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                      {server.playersOnline.toLocaleString()} / {server.maxPlayers.toLocaleString()} Online
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {server.version}
                    </span>
                  </div>
                </div>
              </div>

              {/* IP Bar & Join Button */}
              <div className="pt-3 border-t border-[#262626] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#111] border border-[#2a2a2a] text-xs font-mono text-neutral-300 truncate max-w-[200px] sm:max-w-[260px]">
                  <span className="text-emerald-400 font-bold">$</span>
                  <span className="truncate">{server.ip}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onCopyIp(server.ip)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 border border-neutral-700 transition-all"
                    title="Copy server IP"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onJoinServer(server)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-xs font-bold text-neutral-950 shadow-sm shadow-emerald-500/20 transition-all"
                  >
                    <span>Connect</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Squad Friends & 1:1 Live Chat Section */}
      <section id="dashboard-friends-section">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              Direct Chat & Voice
            </h2>
            <p className="text-xs text-neutral-400">
              100% free live messaging with synchronized cross-tab chat and peer WebRTC microphone voice
            </p>
          </div>
        </div>

        {friends.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#161616] border border-[#262626] text-center">
            <p className="text-sm font-semibold text-neutral-300">No teammates added yet</p>
            <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
              You can start direct chats or voice calls anytime. Search for players in community discussions or connect on servers!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="p-3.5 rounded-xl bg-[#161616] border border-[#262626] hover:border-emerald-500/40 transition-all flex items-center justify-between gap-2"
              >
                <div
                  className="flex items-center gap-3 min-w-0 cursor-pointer"
                  onClick={() => onOpenFriendChat(friend)}
                >
                  <div className="relative shrink-0">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-10 h-10 rounded-xl object-cover border border-neutral-700"
                    />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#161616] ${
                        friend.status === 'online'
                          ? 'bg-emerald-400'
                          : friend.status === 'idle'
                          ? 'bg-amber-400'
                          : friend.status === 'dnd'
                          ? 'bg-rose-400'
                          : 'bg-neutral-600'
                      }`}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white truncate">{friend.name}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 truncate">{friend.activity || friend.status}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onOpenFriendChat(friend)}
                    className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs"
                    title="Open Live Chat"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onStartVoiceCallWithFriend(friend)}
                    className="p-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs"
                    title="Live Voice Call"
                  >
                    <Radio className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
