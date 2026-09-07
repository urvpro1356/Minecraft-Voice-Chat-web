import React from 'react';
import {
  Hash,
  Users,
  Mic,
  MicOff,
  MessageSquare,
  Volume2,
} from 'lucide-react';
import { ChatLobby } from '../types';

interface ChatLobbyCardProps {
  lobby: ChatLobby;
  isInThisVoice: boolean;
  onOpenLobbyChat: (lobby: ChatLobby) => void;
  onToggleVoice: (channelId: string, channelName: string) => void;
}

export const ChatLobbyCard: React.FC<ChatLobbyCardProps> = ({
  lobby,
  isInThisVoice,
  onOpenLobbyChat,
  onToggleVoice,
}) => {
  return (
    <div
      id={`lobby-card-${lobby.id}`}
      className="group relative flex flex-col justify-between p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/20 transition-all duration-200"
    >
      <div>
        {/* Top: Channel Name + Category + Online count */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#121212] border border-[#2a2a2a] group-hover:border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0 transition-colors">
              <Hash className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {lobby.displayName}
                </h4>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
                  {lobby.category}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-neutral-400 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{lobby.onlineCount} online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-neutral-400 mt-2.5 line-clamp-2 leading-relaxed">
          {lobby.description}
        </p>

        {/* Active Voice Participants Stack with Speaking Animation */}
        <div className="mt-3.5 flex items-center justify-between min-h-[32px]">
          {lobby.voiceParticipants.length > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-neutral-400 flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-emerald-400" />
                Voice:
              </span>
              <div className="flex items-center -space-x-2">
                {lobby.voiceParticipants.map((p) => (
                  <div
                    key={p.id}
                    className="relative"
                    title={`${p.name} ${p.isSpeaking ? '(Speaking)' : ''}`}
                  >
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className={`w-6 h-6 rounded-lg object-cover border-2 ${
                        p.isSpeaking
                          ? 'border-emerald-400 speaking-ring ring-1 ring-emerald-400 z-10'
                          : 'border-[#1a1a1a]'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <span className="text-[11px] text-neutral-500 italic">No voice members yet</span>
          )}
        </div>
      </div>

      {/* Buttons: Join Chat & Join Voice */}
      <div className="mt-4 pt-3 border-t border-[#2a2a2a] grid grid-cols-2 gap-2">
        <button
          id={`btn-join-lobby-chat-${lobby.id}`}
          type="button"
          onClick={() => onOpenLobbyChat(lobby)}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-semibold border border-neutral-700/80 transition-all active:scale-95"
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
          <span>Join Chat</span>
        </button>

        <button
          id={`btn-join-lobby-voice-${lobby.id}`}
          type="button"
          onClick={() => onToggleVoice(lobby.id, lobby.displayName)}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
            isInThisVoice
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
              : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
          }`}
        >
          {isInThisVoice ? (
            <>
              <MicOff className="w-3.5 h-3.5" />
              <span>Leave</span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5" />
              <span>Join Voice</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
