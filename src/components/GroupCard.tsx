import React from 'react';
import {
  Users,
  MessageSquare,
  Mic,
  MicOff,
  Radio,
  Sparkles,
  Swords,
  Shield,
  Volume2,
} from 'lucide-react';
import { GroupParty } from '../types';

interface GroupCardProps {
  group: GroupParty;
  isInThisVoice: boolean;
  onOpenChat: (group: GroupParty) => void;
  onToggleVoice: (channelId: string, channelName: string) => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({
  group,
  isInThisVoice,
  onOpenChat,
  onToggleVoice,
}) => {
  return (
    <div
      id={`group-card-${group.id}`}
      className="group relative flex flex-col justify-between p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/20 transition-all duration-200"
    >
      <div>
        {/* Top bar: Name + Tag + Gamemode */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center font-black text-white text-xs border border-emerald-500/30 shrink-0">
              {group.tag}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {group.name}
                </h4>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400/90 flex items-center gap-1">
                <Swords className="w-3 h-3" />
                {group.gamemode}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-neutral-400 bg-[#121212] px-2.5 py-1 rounded-lg border border-[#2a2a2a]">
            <Users className="w-3.5 h-3.5 text-neutral-400" />
            <span className="font-semibold text-neutral-200">
              {group.members.length}/{group.maxMembers}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-neutral-400 mt-2.5 line-clamp-2 leading-relaxed">
          {group.description}
        </p>

        {/* Member Avatars Stack */}
        <div className="mt-3.5 flex items-center justify-between">
          <div className="flex items-center -space-x-2 overflow-hidden">
            {group.members.map((member) => (
              <img
                key={member.id}
                src={member.avatar}
                alt={member.name}
                title={`${member.name} ${member.role ? `(${member.role})` : ''}`}
                className="w-7 h-7 rounded-lg object-cover border-2 border-[#1a1a1a] hover:scale-110 hover:z-10 transition-transform"
              />
            ))}
          </div>

          {/* Active Voice Participants indicator if any */}
          {group.voiceParticipants.length > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{group.voiceParticipants.length} in Voice</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons: Open Chat & Join Voice */}
      <div className="mt-4 pt-3 border-t border-[#2a2a2a] grid grid-cols-2 gap-2">
        <button
          id={`btn-group-chat-${group.id}`}
          type="button"
          onClick={() => onOpenChat(group)}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-semibold border border-neutral-700/80 transition-all active:scale-95"
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
          <span>Open Chat</span>
        </button>

        <button
          id={`btn-group-voice-${group.id}`}
          type="button"
          onClick={() => onToggleVoice(group.id, group.name)}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
            isInThisVoice
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
              : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
          }`}
        >
          {isInThisVoice ? (
            <>
              <MicOff className="w-3.5 h-3.5" />
              <span>Leave Voice</span>
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
