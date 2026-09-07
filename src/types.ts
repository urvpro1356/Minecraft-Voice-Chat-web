export type PlatformEdition = 'java' | 'bedrock';

export interface LinkedAccount {
  edition: PlatformEdition;
  gamertag: string;
  uuid?: string;
  skinUrl?: string;
  isLinked: boolean;
  linkedAt?: string;
}

export interface ServerItem {
  id: string;
  name: string;
  ip: string;
  port: number;
  online: boolean;
  playersOnline: number;
  maxPlayers: number;
  pingMs: number;
  gamemodes: string[];
  description: string;
  version: string;
  iconUrl?: string;
}

export interface VoiceParticipant {
  id: string;
  name: string;
  avatar: string;
  isSpeaking: boolean;
  isMuted?: boolean;
}

export interface GroupParty {
  id: string;
  name: string;
  tag: string;
  description: string;
  gamemode: string;
  memberCount: number;
  maxMembers: number;
  members: {
    id: string;
    name: string;
    avatar: string;
    role?: string;
  }[];
  voiceActive: boolean;
  voiceParticipants: VoiceParticipant[];
}

export interface ChatLobby {
  id: string;
  name: string; // e.g. "general-chat"
  displayName: string;
  description: string;
  category: string;
  onlineCount: number;
  voiceActive: boolean;
  voiceParticipants: VoiceParticipant[];
}

export interface FriendUser {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  activity?: string;
  level: number;
  rankBadge: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isSystem?: boolean;
  badge?: string;
}

export interface CommentItem {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorBadge?: string;
  content: string;
  timestamp: string;
  upvotes: number;
}

export interface DiscussionPost {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    rankBadge: string;
    level: number;
  };
  category: string;
  createdAt: string;
  upvotes: number;
  userVote: 'up' | 'down' | null;
  commentCount: number;
  comments: CommentItem[];
  tags: string[];
  contributors: {
    id: string;
    name: string;
    avatar: string;
  }[];
  isSaved: boolean;
}

export interface Contributor {
  id: string;
  username: string;
  avatar: string;
  points: number;
  rank: number;
  badge: string;
  specialty: string;
}

export interface TopicStats {
  subscribers: string;
  projectsThisWeek: string;
  growthPercentage: string;
}

export interface AppUser {
  id: string;
  username: string;
  gamertag: string;
  avatar: string;
  level: number;
  rankBadge: string;
  coins: number;
  xpProgress: number;
  isGuest?: boolean;
}

export interface ActiveVoiceSession {
  isConnected: boolean;
  channelId: string | null;
  channelName: string;
  isMuted: boolean;
  isDeafened: boolean;
  pingMs: number;
}

export type TabType = 'Dashboard' | 'Connect' | 'Explore' | 'Compete' | 'Practice' | 'Learn';

