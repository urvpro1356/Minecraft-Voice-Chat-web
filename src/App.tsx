import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  Clock,
  TrendingUp,
  Plus,
  MessageSquarePlus,
  Filter,
  Check,
} from 'lucide-react';
import {
  ActiveVoiceSession,
  ChatMessage,
  CommentItem,
  DiscussionPost,
  FriendUser,
  GroupParty,
  LinkedAccount,
  PlatformEdition,
  ServerItem,
  AppUser,
} from './types';
import {
  CURRENT_USER,
  INITIAL_CHAT_LOBBIES,
  INITIAL_DISCUSSIONS,
  INITIAL_FRIENDS,
  INITIAL_GROUPS,
  INITIAL_LINKED_ACCOUNTS,
  INITIAL_MESSAGES,
  INITIAL_SERVERS,
  POPULAR_CONTRIBUTORS,
  TOPIC_STATS,
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { HeaderBanner, TabType } from './components/HeaderBanner';
import { ConnectTabContent } from './components/ConnectTabContent';
import { OtherTabsContent } from './components/OtherTabsContent';
import { DiscussionCard } from './components/DiscussionCard';
import { RightTopicPanel } from './components/RightTopicPanel';
import { VoiceChannelWidget } from './components/VoiceChannelWidget';
import { ActiveChatContext, ChatWindow } from './components/ChatWindow';
import { AccountLinkModal } from './components/AccountLinkModal';
import { CreateServerModal } from './components/CreateServerModal';
import { CreateGroupModal } from './components/CreateGroupModal';
import { CreateDiscussionModal } from './components/CreateDiscussionModal';
import { AuthModal } from './components/AuthModal';
import { UserDashboard } from './components/UserDashboard';
import { ToastContainer, ToastMessage } from './components/Toast';
import {
  AddTopicModal,
  NotificationModal,
  StoreModal,
} from './components/NavigationModals';
import {
  getSavedUser,
  saveCurrentUser,
  getStoredMessages,
  storeMessage,
  listenToLiveChat,
} from './utils/freeBackend';
import { voiceEngine } from './utils/webrtcVoice';

export default function App() {
  // User Profile & Authentication State
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => getSavedUser());

  // Navigation & Tabs State - if player is logged in, go direct to Dashboard!
  const [activeNav, setActiveNav] = useState(() => (getSavedUser() ? 'dashboard' : 'home'));
  const [activeTab, setActiveTab] = useState<TabType>(() => (getSavedUser() ? 'Dashboard' : 'Connect'));
  const [discussionSubTab, setDiscussionSubTab] = useState<'trending' | 'newest' | 'popular'>('trending');
  const [discussionFilter, setDiscussionFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile drawer states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileTopicPanelOpen, setIsMobileTopicPanelOpen] = useState(false);

  // Modals state
  const [isAccountLinkModalOpen, setIsAccountLinkModalOpen] = useState(false);
  const [isCreateServerModalOpen, setIsCreateServerModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isCreateDiscussionModalOpen, setIsCreateDiscussionModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Notification count
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Data States
  const [linkedAccounts, setLinkedAccounts] = useState<Record<PlatformEdition, LinkedAccount>>(
    INITIAL_LINKED_ACCOUNTS
  );
  const [servers, setServers] = useState<ServerItem[]>(INITIAL_SERVERS);
  const [friends, setFriends] = useState<FriendUser[]>(INITIAL_FRIENDS);
  const [discussions, setDiscussions] = useState<DiscussionPost[]>(INITIAL_DISCUSSIONS);
  const [allMessages, setAllMessages] = useState<Record<string, ChatMessage[]>>(() =>
    getStoredMessages(INITIAL_MESSAGES)
  );

  // Real-time live chat sync across browser windows / tabs
  useEffect(() => {
    const unsubscribe = listenToLiveChat((chatId, incomingMsg) => {
      setAllMessages((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), incomingMsg],
      }));
    });
    return unsubscribe;
  }, []);

  // Active Chat Window State
  const [activeChat, setActiveChat] = useState<ActiveChatContext | null>(null);

  // Active Voice State
  const [voiceSession, setVoiceSession] = useState<ActiveVoiceSession>({
    isConnected: false,
    channelId: '',
    channelName: '',
    isMuted: false,
    isDeafened: false,
    pingMs: 0,
  });

  const [isMicrophoneActive, setIsMicrophoneActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Account Linking handler
  const handleSaveAccount = (edition: PlatformEdition, gamertag: string, isLinked: boolean) => {
    setLinkedAccounts((prev) => ({
      ...prev,
      [edition]: {
        ...prev[edition],
        gamertag: isLinked ? gamertag : '',
        isLinked,
        linkedAt: isLinked ? 'Just now' : undefined,
      },
    }));
  };

  // Server management
  const handleAddServer = (newServer: ServerItem) => {
    setServers((prev) => [newServer, ...prev]);
    showToast(`Added server: ${newServer.name}!`);
  };

  const handleDeleteServer = (id: string) => {
    setServers((prev) => prev.filter((s) => s.id !== id));
    showToast('Server removed from your list.', 'info');
  };

  const handleCopyServerIp = (ip: string) => {
    navigator.clipboard.writeText(ip);
    showToast(`Copied ${ip} to clipboard!`);
  };

  const handleJoinServer = (server: ServerItem) => {
    showToast(`Connecting to ${server.name} (${server.ip})... Launching client handshake!`);
  };

  // Group management
  const handleCreateGroup = (newGroup: GroupParty) => {
    setGroups((prev) => [newGroup, ...prev]);
    showToast(`Created party "${newGroup.name}" [${newGroup.tag}]!`);
    // Open chat with new group immediately
    setActiveChat({
      id: newGroup.id,
      type: 'group',
      title: newGroup.name,
      subtitle: `${newGroup.gamemode} • 1 Member`,
      memberCount: 1,
    });
  };

  // Chat window triggers
  const handleOpenGroupChat = (group: GroupParty) => {
    setActiveChat({
      id: group.id,
      type: 'group',
      title: group.name,
      subtitle: `${group.gamemode} • ${group.members.length} Members`,
      memberCount: group.members.length,
    });
  };

  const handleOpenLobbyChat = (lobby: (typeof chatLobbies)[0]) => {
    setActiveChat({
      id: lobby.id,
      type: 'lobby',
      title: lobby.displayName,
      subtitle: lobby.description,
      memberCount: lobby.onlineCount,
    });
  };

  const handleOpenFriendChat = (friend: FriendUser) => {
    setActiveChat({
      id: friend.id,
      type: 'direct',
      title: friend.name,
      subtitle: friend.activity || (friend.status === 'online' ? 'Online' : 'Offline'),
      avatar: friend.avatar,
      isOnline: friend.status === 'online',
    });
  };

  const handleStartVoiceCallWithFriend = (friend: FriendUser) => {
    setVoiceSession({
      isConnected: true,
      channelId: friend.id,
      channelName: `Call: ${friend.name}`,
      isMuted: false,
      isDeafened: false,
      pingMs: 14,
    });
    showToast(`Started direct voice call with ${friend.name}!`);
  };

  // Sending Chat Message with persistence and live broadcast (100% human-to-human, NO bots)
  const handleSendMessage = (chatId: string, content: string) => {
    const sender = currentUser || CURRENT_USER;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: sender.id,
      senderName: sender.username,
      senderAvatar: sender.avatar,
      content,
      timestamp: 'Just now',
      badge: sender.rankBadge,
    };

    // Store in local storage and broadcast to other tabs (real human chat)
    storeMessage(chatId, newMsg);

    setAllMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMsg],
    }));
  };

  // Voice channel toggles with real WebRTC microphone capture
  const handleToggleVoiceChannel = async (channelId: string, channelName: string) => {
    if (voiceSession.isConnected && voiceSession.channelId === channelId) {
      // Disconnect
      voiceEngine.stopMicrophone();
      setIsMicrophoneActive(false);
      setIsSpeaking(false);
      setVoiceSession((prev) => ({ ...prev, isConnected: false, channelId: null }));
      showToast(`Left voice channel: ${channelName}`, 'info');
    } else {
      // Connect
      setVoiceSession({
        isConnected: true,
        channelId,
        channelName,
        isMuted: false,
        isDeafened: false,
        pingMs: Math.floor(Math.random() * 15) + 12,
      });

      // Try acquiring microphone through WebRTC engine
      try {
        const started = await voiceEngine.startMicrophone((speaking, volume) => {
          setIsSpeaking(speaking);
        });
        if (started) {
          setIsMicrophoneActive(true);
          showToast(`Connected to live voice: ${channelName}! Mic active.`);
        } else {
          showToast(`Connected to ${channelName} (mic muted or permission blocked).`, 'info');
        }
      } catch (err) {
        showToast(`Connected to voice channel: ${channelName}!`);
      }
    }
  };

  // Discussion voting
  const handleVoteDiscussion = (id: string, direction: 'up' | 'down') => {
    setDiscussions((prev) =>
      prev.map((post) => {
        if (post.id !== id) return post;

        let newVote = post.userVote;
        let delta = 0;

        if (direction === 'up') {
          if (post.userVote === 'up') {
            newVote = null;
            delta = -1;
          } else if (post.userVote === 'down') {
            newVote = 'up';
            delta = 2;
          } else {
            newVote = 'up';
            delta = 1;
          }
        } else {
          if (post.userVote === 'down') {
            newVote = null;
            delta = 1;
          } else if (post.userVote === 'up') {
            newVote = 'down';
            delta = -2;
          } else {
            newVote = 'down';
            delta = -1;
          }
        }

        return {
          ...post,
          upvotes: Math.max(0, post.upvotes + delta),
          userVote: newVote,
        };
      })
    );
  };

  const handleAddCommentToDiscussion = (postId: string, comment: CommentItem) => {
    setDiscussions((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          commentCount: post.commentCount + 1,
          comments: [comment, ...post.comments],
          contributors: post.contributors.some((c) => c.id === CURRENT_USER.id)
            ? post.contributors
            : [...post.contributors, { id: CURRENT_USER.id, name: CURRENT_USER.username, avatar: CURRENT_USER.avatar }],
        };
      })
    );
    showToast('Comment posted!');
  };

  const handleToggleSaveDiscussion = (id: string) => {
    setDiscussions((prev) =>
      prev.map((post) => {
        if (post.id !== id) return post;
        const nextSaved = !post.isSaved;
        showToast(nextSaved ? 'Saved to bookmarks' : 'Removed from bookmarks', 'info');
        return { ...post, isSaved: nextSaved };
      })
    );
  };

  const handleSharePost = (post: DiscussionPost) => {
    navigator.clipboard.writeText(`https://minecomm.net/discuss/${post.id}`);
    showToast('Discussion link copied to clipboard!');
  };

  const handleCreatePost = (newPost: DiscussionPost) => {
    setDiscussions((prev) => [newPost, ...prev]);
    showToast('Discussion published successfully!');
  };

  // Filtered discussions by sub-tab and category
  const filteredDiscussions = discussions
    .filter((post) => {
      const matchesCategory = discussionFilter === 'All' || post.category === discussionFilter;
      const matchesSearch =
        searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (discussionSubTab === 'trending') return b.upvotes - a.upvotes;
      if (discussionSubTab === 'newest') return b.id.localeCompare(a.id);
      return b.commentCount - a.commentCount;
    });

  // Current voice channel participants
  const userProfile = currentUser || CURRENT_USER;
  const activeVoiceParticipants = [
    {
      id: userProfile.id,
      name: userProfile.username,
      avatar: userProfile.avatar,
      isSpeaking: !voiceSession.isMuted && isSpeaking,
      isMuted: voiceSession.isMuted,
    },
    {
      id: 'p2',
      name: 'EnderKnight_99',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      isSpeaking: true,
    },
    {
      id: 'p3',
      name: 'DiamondValkyrie',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      isSpeaking: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-neutral-950">
      {/* 3-Column Layout: Left Sidebar, Main Content, Right Sidebar */}
      <div className="flex-1 flex w-full max-w-[1680px] mx-auto">
        {/* 1. Left Sidebar Navigation */}
        <Sidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          unreadNotifications={unreadNotifications}
          onOpenAddTopic={() => setIsAddTopicModalOpen(true)}
          onOpenStoreModal={() => setIsStoreModalOpen(true)}
          onOpenNotificationsModal={() => {
            setIsNotificationsModalOpen(true);
            setUnreadNotifications(0);
          }}
          activeVoiceRoomName={voiceSession.isConnected ? voiceSession.channelName : undefined}
          isMobileOpen={isMobileSidebarOpen}
          setIsMobileOpen={setIsMobileSidebarOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentUser={currentUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onSelectDashboard={() => setActiveTab('Dashboard')}
        />

        {/* 2. Main Center Content Area */}
        <main id="main-content-area" className="flex-1 min-w-0 flex flex-col pb-28">
          {/* Header Banner with Title & Tabs */}
          <HeaderBanner
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
            onOpenMobileTopicPanel={() => setIsMobileTopicPanelOpen(true)}
            onShareHub={() => {
              navigator.clipboard.writeText(window.location.href);
              showToast('Community Hub link copied!');
            }}
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />

          {/* Main Tab View */}
          <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-10">
            {activeTab === 'Dashboard' && currentUser ? (
              <UserDashboard
                currentUser={currentUser}
                linkedAccounts={linkedAccounts}
                onOpenLinkModal={() => setIsAccountLinkModalOpen(true)}
                servers={servers}
                onOpenAddServerModal={() => setIsCreateServerModalOpen(true)}
                onCopyIp={handleCopyServerIp}
                onJoinServer={handleJoinServer}
                onDeleteServer={handleDeleteServer}
                friends={friends}
                onOpenFriendChat={handleOpenFriendChat}
                onStartVoiceCallWithFriend={handleStartVoiceCallWithFriend}
                onLogout={() => {
                  setCurrentUser(null);
                  setActiveTab('Connect');
                  showToast('Logged out successfully', 'info');
                }}
                onExploreHub={() => setActiveTab('Connect')}
              />
            ) : activeTab === 'Connect' ? (
              <ConnectTabContent
                linkedAccounts={linkedAccounts}
                onOpenLinkModal={() => setIsAccountLinkModalOpen(true)}
                servers={servers}
                onOpenAddServerModal={() => setIsCreateServerModalOpen(true)}
                onCopyIp={handleCopyServerIp}
                onJoinServer={handleJoinServer}
                onDeleteServer={handleDeleteServer}
                friends={friends}
                onOpenFriendChat={handleOpenFriendChat}
                onStartVoiceCallWithFriend={handleStartVoiceCallWithFriend}
              />
            ) : (
              <OtherTabsContent
                activeTab={activeTab}
                onSwitchToConnect={() => setActiveTab('Connect')}
                onShowToast={showToast}
              />
            )}

            {/* 4. DISCUSSIONS SECTION (Below Tabs) */}
            <section id="discussions-section" aria-labelledby="heading-discussions" className="pt-4 border-t border-[#2a2a2a]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 id="heading-discussions" className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-400" />
                    Minecraft Community Discussions
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Trending survival tips, redstone innovations, megabuild showcases, and realm recruitment
                  </p>
                </div>

                <button
                  id="btn-create-discussion"
                  type="button"
                  onClick={() => setIsCreateDiscussionModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95 self-start sm:self-auto"
                >
                  <MessageSquarePlus className="w-4 h-4" />
                  <span>Create a Discussion</span>
                </button>
              </div>

              {/* Sub-tabs: Trending, Newest, Most Popular + Category Filter Chips */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2a2a2a]">
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#141414] border border-[#2a2a2a] self-start">
                  <button
                    type="button"
                    onClick={() => setDiscussionSubTab('trending')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      discussionSubTab === 'trending'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Trending</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDiscussionSubTab('newest')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      discussionSubTab === 'newest'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Newest</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDiscussionSubTab('popular')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      discussionSubTab === 'popular'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Most Popular</span>
                  </button>
                </div>

                {/* Category Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {['All', 'Builds', 'Redstone', 'Guides', 'Survival'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setDiscussionFilter(cat)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                        discussionFilter === cat
                          ? 'bg-neutral-800 text-white border border-neutral-700 font-semibold'
                          : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Discussion List */}
              <div className="mt-4 space-y-3.5">
                {filteredDiscussions.length === 0 ? (
                  <div className="p-8 text-center bg-[#141414] rounded-xl border border-[#2a2a2a] text-neutral-400 text-xs">
                    No discussions found matching your filter criteria. Be the first to start one!
                  </div>
                ) : (
                  filteredDiscussions.map((post) => (
                    <DiscussionCard
                      key={post.id}
                      post={post}
                      onVote={handleVoteDiscussion}
                      onAddComment={handleAddCommentToDiscussion}
                      onToggleSave={handleToggleSaveDiscussion}
                      onShare={handleSharePost}
                    />
                  ))
                )}
              </div>
            </section>
          </div>
        </main>

        {/* 3. Right Sidebar ("Topic Panel") */}
        <RightTopicPanel
          stats={TOPIC_STATS}
          contributors={POPULAR_CONTRIBUTORS}
          javaAccount={linkedAccounts.java}
          bedrockAccount={linkedAccounts.bedrock}
          onOpenAccountLinkModal={() => setIsAccountLinkModalOpen(true)}
          onOpenContestDetails={() => {
            showToast('Opening Mega Build Battle rules & entry form!');
          }}
          isOpenMobile={isMobileTopicPanelOpen}
          onCloseMobile={() => setIsMobileTopicPanelOpen(false)}
        />
      </div>

      {/* Floating Active Voice Bar Widget */}
      <VoiceChannelWidget
        voiceSession={voiceSession}
        participants={activeVoiceParticipants}
        onToggleMute={() => {
          setVoiceSession((prev) => ({ ...prev, isMuted: !prev.isMuted }));
          showToast(voiceSession.isMuted ? 'Microphone unmuted' : 'Microphone muted', 'info');
        }}
        onToggleDeafen={() => {
          setVoiceSession((prev) => ({ ...prev, isDeafened: !prev.isDeafened }));
          showToast(voiceSession.isDeafened ? 'Audio undeafened' : 'Audio deafened', 'info');
        }}
        onDisconnect={() => {
          setVoiceSession((prev) => ({ ...prev, isConnected: false, channelId: null }));
          showToast('Disconnected from voice channel', 'info');
        }}
      />

      {/* Chat Window Dialog for DMs, Group Chat, and Channel Lobbies */}
      {activeChat && (
        <ChatWindow
          chatContext={activeChat}
          onClose={() => setActiveChat(null)}
          messages={allMessages[activeChat.id] || []}
          onSendMessage={handleSendMessage}
          isInVoice={voiceSession.isConnected && voiceSession.channelId === activeChat.id}
          onToggleVoiceCall={() => handleToggleVoiceChannel(activeChat.id, activeChat.title)}
          currentUser={currentUser}
        />
      )}

      {/* Interactive Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          setActiveNav('dashboard');
          setActiveTab('Dashboard');
          showToast(`Welcome back, ${user.username}! Direct to Dashboard.`);
        }}
        onLogout={() => {
          setCurrentUser(null);
          setActiveTab('Connect');
          showToast('Logged out successfully', 'info');
        }}
        onShowToast={showToast}
      />
      <AccountLinkModal
        isOpen={isAccountLinkModalOpen}
        onClose={() => setIsAccountLinkModalOpen(false)}
        linkedAccounts={linkedAccounts}
        onSaveAccount={handleSaveAccount}
        onShowToast={showToast}
      />

      <CreateServerModal
        isOpen={isCreateServerModalOpen}
        onClose={() => setIsCreateServerModalOpen(false)}
        onAddServer={handleAddServer}
      />

      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        onCreateGroup={handleCreateGroup}
      />

      <CreateDiscussionModal
        isOpen={isCreateDiscussionModalOpen}
        onClose={() => setIsCreateDiscussionModalOpen(false)}
        onCreatePost={handleCreatePost}
      />

      <NotificationModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        onClear={() => {
          setUnreadNotifications(0);
          showToast('All notifications marked as read', 'info');
        }}
      />

      <StoreModal
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
        onShowToast={showToast}
      />

      <AddTopicModal
        isOpen={isAddTopicModalOpen}
        onClose={() => setIsAddTopicModalOpen(false)}
        onAddTopic={(topic) => showToast(`Added ${topic} to your followed topics!`)}
      />

      {/* Toast Feedback Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
