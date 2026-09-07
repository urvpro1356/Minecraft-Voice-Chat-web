import React, { useState } from 'react';
import {
  Gamepad2,
  Smartphone,
  CheckCircle2,
  Unplug,
  Plus,
  Server,
  MessageCircle,
  Phone,
  Search,
  Filter,
  Radio,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import {
  FriendUser,
  LinkedAccount,
  PlatformEdition,
  ServerItem,
} from '../types';
import { ServerCard } from './ServerCard';

interface ConnectTabContentProps {
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
}

export const ConnectTabContent: React.FC<ConnectTabContentProps> = ({
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
}) => {
  const [serverSearch, setServerSearch] = useState('');
  const [selectedGamemode, setSelectedGamemode] = useState('All');

  const filteredServers = servers.filter((srv) => {
    const matchesSearch =
      srv.name.toLowerCase().includes(serverSearch.toLowerCase()) ||
      srv.ip.toLowerCase().includes(serverSearch.toLowerCase());
    const matchesMode =
      selectedGamemode === 'All' || srv.gamemodes.includes(selectedGamemode);
    return matchesSearch && matchesMode;
  });

  return (
    <div id="connect-tab-content" className="space-y-8">
      {/* 1. Account Linking Section */}
      <section id="account-linking-section" aria-labelledby="heading-account-linking">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
          <div>
            <h2 id="heading-account-linking" className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Minecraft Account Linking
            </h2>
            <p className="text-xs text-neutral-400">
              Connect your official Java and Bedrock accounts via code handshake or email
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenLinkModal}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors self-start sm:self-auto"
          >
            Manage Credentials & Code &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Java Edition Card */}
          <div
            id="card-java-account"
            className="p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-between hover:border-emerald-500/40 transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
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
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.2 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Connected
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-neutral-400 bg-neutral-800 px-2 py-0.2 rounded-full border border-neutral-700">
                      <Unplug className="w-3 h-3" />
                      Not Connected
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-300 font-mono mt-0.5">
                  {linkedAccounts.java.isLinked
                    ? linkedAccounts.java.gamertag
                    : 'Link via code: /link MC-****'}
                </p>
              </div>
            </div>

            <button
              id="btn-link-java"
              type="button"
              onClick={onOpenLinkModal}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                linkedAccounts.java.isLinked
                  ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700'
                  : 'bg-emerald-400 hover:bg-emerald-300 text-neutral-950 shadow-sm shadow-emerald-500/20'
              }`}
            >
              {linkedAccounts.java.isLinked ? 'Settings' : 'Connect'}
            </button>
          </div>

          {/* Bedrock / MCPE Card */}
          <div
            id="card-bedrock-account"
            className="p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-between hover:border-emerald-500/40 transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
                  linkedAccounts.bedrock.isLinked
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                    : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                }`}
              >
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">Bedrock / MCPE</h3>
                  {linkedAccounts.bedrock.isLinked ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.2 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Connected
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-neutral-400 bg-neutral-800 px-2 py-0.2 rounded-full border border-neutral-700">
                      <Unplug className="w-3 h-3" />
                      Not Connected
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-300 font-mono mt-0.5">
                  {linkedAccounts.bedrock.isLinked
                    ? linkedAccounts.bedrock.gamertag
                    : 'Xbox Live / Pocket Edition'}
                </p>
              </div>
            </div>

            <button
              id="btn-link-bedrock"
              type="button"
              onClick={onOpenLinkModal}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                linkedAccounts.bedrock.isLinked
                  ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700'
                  : 'bg-emerald-400 hover:bg-emerald-300 text-neutral-950 shadow-sm shadow-emerald-500/20'
              }`}
            >
              {linkedAccounts.bedrock.isLinked ? 'Settings' : 'Connect'}
            </button>
          </div>
        </div>
      </section>

      {/* 2. Direct Messaging / Friends Active List */}
      <section id="direct-messaging-section" aria-labelledby="heading-direct-messaging">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 id="heading-direct-messaging" className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              Direct Messaging & Friends
            </h2>
            <p className="text-xs text-neutral-400">
              1:1 text chat & direct voice call with your Minecraft squad
            </p>
          </div>
          <span className="text-xs text-neutral-400">
            {friends.filter((f) => f.status !== 'offline').length} online now
          </span>
        </div>

        {friends.length === 0 ? (
          <div className="p-6 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-center">
            <p className="text-xs text-neutral-400">No players added to your friend list yet.</p>
            <p className="text-[11px] text-neutral-500 mt-1">Connect with players on servers or add your squad mates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {friends.map((friend) => (
              <div
                key={friend.id}
                id={`friend-item-${friend.id}`}
                className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-emerald-500/40 hover:bg-[#1f1f1f] transition-all flex items-center justify-between gap-2 group"
              >
                <div
                  className="flex items-center gap-3 min-w-0 cursor-pointer"
                  onClick={() => onOpenFriendChat(friend)}
                >
                  <div className="relative shrink-0">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-10 h-10 rounded-xl object-cover border border-neutral-700 group-hover:border-emerald-400/60"
                    />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#1a1a1a] ${
                        friend.status === 'online'
                          ? 'bg-emerald-400'
                          : friend.status === 'idle'
                          ? 'bg-amber-400'
                          : friend.status === 'dnd'
                          ? 'bg-rose-500'
                          : 'bg-neutral-500'
                      }`}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white truncate group-hover:text-emerald-400">
                        {friend.name}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-800 text-emerald-400 font-semibold border border-neutral-700">
                        Lvl {friend.level}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                      {friend.activity || 'Chilling in lobby'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => onOpenFriendChat(friend)}
                    className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                    title="Open Chat"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onStartVoiceCallWithFriend(friend)}
                    className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                    title="Voice Call"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Server IP Section */}
      <section id="server-ip-section" aria-labelledby="heading-servers">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
          <div>
            <h2 id="heading-servers" className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-400" />
              Community Minecraft Servers
            </h2>
            <p className="text-xs text-neutral-400">
              Live ping, player counts, 1-click IP copy, and verified SMP / Minigame nodes
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-open-add-server"
              type="button"
              onClick={onOpenAddServerModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Server</span>
            </button>
          </div>
        </div>

        {/* Filters and search for servers */}
        <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search servers by name or IP..."
              value={serverSearch}
              onChange={(e) => setServerSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Bedwars', 'Survival', 'Skyblock', 'Creative'].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setSelectedGamemode(mode)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedGamemode === mode
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-[#1a1a1a] text-neutral-400 hover:text-neutral-200 border border-[#2a2a2a]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Server Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredServers.map((server) => (
            <ServerCard
              key={server.id}
              server={server}
              onCopyIp={onCopyIp}
              onJoinServer={onJoinServer}
              onDeleteServer={onDeleteServer}
              isCustom={server.id.startsWith('srv-custom')}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
