import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Phone,
  PhoneOff,
  Smile,
  Paperclip,
  MoreVertical,
  Volume2,
  Users,
  Shield,
  Sparkles,
} from 'lucide-react';
import { ChatMessage, FriendUser, AppUser } from '../types';
import { CURRENT_USER } from '../data/mockData';

export interface ActiveChatContext {
  id: string;
  type: 'direct' | 'group' | 'lobby';
  title: string;
  subtitle?: string;
  avatar?: string;
  isOnline?: boolean;
  memberCount?: number;
}

interface ChatWindowProps {
  chatContext: ActiveChatContext | null;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (chatId: string, content: string) => void;
  isInVoice: boolean;
  onToggleVoiceCall: () => void;
  currentUser?: AppUser | null;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chatContext,
  onClose,
  messages,
  onSendMessage,
  isInVoice,
  onToggleVoiceCall,
  currentUser,
}) => {
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!chatContext) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(chatContext.id, inputText.trim());
    setInputText('');
  };

  const quickEmojis = ['⛏', '💎', '🔥', '🛡️', '⚔️', '🟩', '👑', '💀', 'gg', 'ez'];

  return (
    <div
      id="chat-window-modal"
      className="fixed bottom-0 right-2 sm:right-6 z-50 w-full sm:w-[460px] h-[540px] max-h-[90vh] bg-[#141414] border border-[#2a2a2a] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200"
    >
      {/* Header */}
      <div className="px-4 py-3 bg-[#181818] border-b border-[#2a2a2a] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            {chatContext.avatar ? (
              <img
                src={chatContext.avatar}
                alt={chatContext.title}
                className="w-10 h-10 rounded-xl object-cover border border-neutral-700"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm">
                {chatContext.type === 'lobby' ? '#' : '⛏'}
              </div>
            )}
            {chatContext.isOnline && (
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#181818]" />
            )}
          </div>

          <div>
            <h3 className="text-sm font-bold text-white tracking-wide truncate max-w-[200px]">
              {chatContext.title}
            </h3>
            <p className="text-[11px] text-neutral-400 truncate max-w-[200px]">
              {chatContext.subtitle || (chatContext.memberCount ? `${chatContext.memberCount} members active` : 'Direct Messaging')}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            id="btn-chat-toggle-call"
            type="button"
            onClick={onToggleVoiceCall}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isInVoice
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
            }`}
            title={isInVoice ? 'End Voice Call' : 'Start Voice Call'}
          >
            {isInVoice ? <PhoneOff className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
          </button>

          <button
            id="btn-chat-close"
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
            title="Close Chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#0f0f0f]">
        {/* Welcome note */}
        <div className="text-center py-2">
          <span className="text-[11px] text-neutral-500 bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800">
            Encrypted community session • Today
          </span>
        </div>

        {messages.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 text-xs">
            No messages yet. Say hello and start the conversation!
          </div>
        ) : (
          messages.map((msg) => {
            const currentUserId = currentUser?.id || CURRENT_USER.id;
            const isMe = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {!isMe && (
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-7 h-7 rounded-lg object-cover shrink-0 border border-neutral-800 mt-0.5"
                  />
                )}
                <div className={`max-w-[75%] space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                  {!isMe && (
                    <div className="flex items-center gap-1.5 px-0.5">
                      <span className="text-[11px] font-bold text-neutral-300">{msg.senderName}</span>
                      {msg.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                          {msg.badge}
                        </span>
                      )}
                      <span className="text-[10px] text-neutral-500">{msg.timestamp}</span>
                    </div>
                  )}

                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      isMe
                        ? 'bg-emerald-500 text-neutral-950 font-medium rounded-tr-xs'
                        : 'bg-[#1c1c1c] text-neutral-200 border border-[#2a2a2a] rounded-tl-xs'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {isMe && (
                    <div className="text-right text-[10px] text-neutral-500 pr-1">
                      {msg.timestamp}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <div className="px-3 py-2 bg-[#181818] border-t border-[#2a2a2a] flex items-center gap-1.5 overflow-x-auto">
          {quickEmojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                setInputText((prev) => prev + ' ' + emoji);
                setShowEmojiPicker(false);
              }}
              className="px-2 py-1 rounded-lg bg-[#222] hover:bg-neutral-700 text-xs text-neutral-200 transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <form onSubmit={handleSend} className="p-3 bg-[#141414] border-t border-[#2a2a2a] flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-xl transition-colors"
          title="Add Reaction"
        >
          <Smile className="w-4 h-4" />
        </button>

        <input
          id="chat-message-input"
          type="text"
          placeholder={`Message ${chatContext.title}...`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-3.5 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
        />

        <button
          id="btn-send-chat-message"
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 disabled:hover:bg-emerald-400 text-neutral-950 font-bold shadow-md shadow-emerald-500/20 transition-all"
          title="Send"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
