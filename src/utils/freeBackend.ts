/**
 * Simple, free, zero-config backend persistence layer.
 * Uses localStorage with broadcast channel across tabs + ready for direct Firebase connect.
 */
import { AppUser, ChatMessage, ServerItem, FriendUser, LinkedAccount } from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: 'mcvc_current_user',
  ACCOUNTS_DB: 'mcvc_registered_accounts',
  MESSAGES: 'mcvc_chat_messages',
  SERVERS: 'mcvc_custom_servers',
  FRIENDS: 'mcvc_friends_list',
  LINKED_ACCOUNTS: 'mcvc_linked_accounts',
};

// Cross-tab real-time sync broadcast channel
const chatChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('mcvc_chat_broadcast')
  : null;

export interface RegisteredAccount {
  id: string;
  username: string;
  gamertag: string;
  passwordHash: string;
  avatar: string;
  createdAt: string;
}

// 1. Current Session User
export function getSavedUser(): AppUser | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveCurrentUser(user: AppUser | null) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  } catch (e) {
    console.error(e);
  }
}

// 2. Authentication: Register, Login, Guest
export function registerAccount(username: string, gamertag: string, password: string): { success: boolean; user?: AppUser; message?: string } {
  const cleanUser = username.trim();
  const cleanGamer = (gamertag.trim() || cleanUser).replace(/\s+/g, '_');
  
  if (!cleanUser) return { success: false, message: 'Username is required' };
  if (!password || password.length < 4) return { success: false, message: 'Password must be at least 4 characters' };

  try {
    const accounts: RegisteredAccount[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACCOUNTS_DB) || '[]');
    const exists = accounts.find(a => a.username.toLowerCase() === cleanUser.toLowerCase());
    if (exists) {
      return { success: false, message: 'Username already taken. Please login instead.' };
    }

    const newAccount: RegisteredAccount = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      username: cleanUser,
      gamertag: cleanGamer,
      passwordHash: btoa(password), // simple client hash
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanUser)}`,
      createdAt: new Date().toISOString(),
    };

    accounts.push(newAccount);
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS_DB, JSON.stringify(accounts));

    const appUser: AppUser = {
      id: newAccount.id,
      username: newAccount.username,
      gamertag: newAccount.gamertag,
      avatar: newAccount.avatar,
      level: 1,
      rankBadge: 'Player',
      coins: 250,
      xpProgress: 15,
      isGuest: false,
    };

    saveCurrentUser(appUser);
    return { success: true, user: appUser };
  } catch {
    return { success: false, message: 'Could not create account in browser storage' };
  }
}

export function loginAccount(username: string, password: string): { success: boolean; user?: AppUser; message?: string } {
  const cleanUser = username.trim();
  if (!cleanUser || !password) return { success: false, message: 'Please enter username and password' };

  try {
    const accounts: RegisteredAccount[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACCOUNTS_DB) || '[]');
    const found = accounts.find(a => a.username.toLowerCase() === cleanUser.toLowerCase());

    if (!found || found.passwordHash !== btoa(password)) {
      return { success: false, message: 'Invalid username or password' };
    }

    const appUser: AppUser = {
      id: found.id,
      username: found.username,
      gamertag: found.gamertag,
      avatar: found.avatar,
      level: 12,
      rankBadge: 'Active Miner',
      coins: 680,
      xpProgress: 45,
      isGuest: false,
    };

    saveCurrentUser(appUser);
    return { success: true, user: appUser };
  } catch {
    return { success: false, message: 'Login failed' };
  }
}

export function quickGuestLogin(name: string): AppUser {
  const cleanName = name.trim() || `Player_${Math.floor(Math.random() * 8999 + 1000)}`;
  const guestUser: AppUser = {
    id: `guest-${Date.now()}`,
    username: cleanName,
    gamertag: cleanName.replace(/\s+/g, '_'),
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanName)}`,
    level: 1,
    rankBadge: 'Guest',
    coins: 100,
    xpProgress: 10,
    isGuest: true,
  };
  saveCurrentUser(guestUser);
  return guestUser;
}

// 3. Persistent Messages Storage with Real-Time Cross-Tab Broadcast
export function getStoredMessages(defaultMessages: Record<string, ChatMessage[]>): Record<string, ChatMessage[]> {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (saved) {
      return { ...defaultMessages, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error(e);
  }
  return defaultMessages;
}

export function storeMessage(chatId: string, newMessage: ChatMessage, allMessages?: Record<string, ChatMessage[]>) {
  try {
    let currentMap = allMessages;
    if (!currentMap) {
      currentMap = getStoredMessages({});
    }
    const updated = {
      ...currentMap,
      [chatId]: [...(currentMap[chatId] || []), newMessage],
    };
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updated));

    // Broadcast in real-time to other open tabs
    if (chatChannel) {
      chatChannel.postMessage({ type: 'NEW_MESSAGE', chatId, message: newMessage });
    }
  } catch (e) {
    console.error(e);
  }
}

export function listenToLiveChat(callback: (chatId: string, message: ChatMessage) => void) {
  if (!chatChannel) return () => {};
  const handler = (event: MessageEvent) => {
    if (event.data?.type === 'NEW_MESSAGE' && event.data.chatId && event.data.message) {
      callback(event.data.chatId, event.data.message);
    }
  };
  chatChannel.addEventListener('message', handler);
  return () => chatChannel.removeEventListener('message', handler);
}
