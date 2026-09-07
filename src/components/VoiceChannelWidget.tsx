import React from 'react';
import {
  Mic,
  MicOff,
  Headphones,
  PhoneOff,
  Volume2,
  Signal,
  Radio,
  Users,
} from 'lucide-react';
import { ActiveVoiceSession, VoiceParticipant } from '../types';

interface VoiceChannelWidgetProps {
  voiceSession: ActiveVoiceSession;
  participants: VoiceParticipant[];
  onToggleMute: () => void;
  onToggleDeafen: () => void;
  onDisconnect: () => void;
}

export const VoiceChannelWidget: React.FC<VoiceChannelWidgetProps> = ({
  voiceSession,
  participants,
  onToggleMute,
  onToggleDeafen,
  onDisconnect,
}) => {
  if (!voiceSession.isConnected) return null;

  return (
    <aside
      id="active-voice-channel-bar"
      aria-label="Active voice channel controls"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-2xl bg-[#141414]/95 border border-emerald-500/50 rounded-2xl p-3.5 sm:p-4 shadow-2xl shadow-emerald-950/40 backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Channel Info & Ping */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Radio className="w-4 h-4 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide truncate max-w-[180px] sm:max-w-[220px]">
                  {voiceSession.channelName}
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  VOICE ACTIVE
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <Signal className="w-3 h-3" /> {voiceSession.pingMs}ms RTC
                </span>
                <span>•</span>
                <span>{participants.length} in channel</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Speaking Participants Avatar Stack with green pulsing ring */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
          <div className="flex items-center -space-x-2">
            {participants.map((p) => (
              <div
                key={p.id}
                className="relative group cursor-pointer"
                title={`${p.name} ${p.isSpeaking ? '(Speaking)' : ''}`}
              >
                <img
                  src={p.avatar}
                  alt={p.name}
                  className={`w-8 h-8 rounded-xl object-cover border-2 transition-all ${
                    p.isSpeaking
                      ? 'border-emerald-400 speaking-ring ring-2 ring-emerald-400/80 scale-105 z-10'
                      : 'border-neutral-800 opacity-80 group-hover:opacity-100'
                  }`}
                />
                {p.isSpeaking && (
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-neutral-900 flex items-center justify-center">
                    <Volume2 className="w-2 h-2 text-neutral-950" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Controls: Mute, Deafen, Hang Up */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            id="btn-voice-mute"
            type="button"
            onClick={onToggleMute}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              voiceSession.isMuted
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700 border border-neutral-700'
            }`}
            title={voiceSession.isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          >
            {voiceSession.isMuted ? (
              <>
                <MicOff className="w-4 h-4" />
                <span className="hidden sm:inline">Muted</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Mute</span>
              </>
            )}
          </button>

          <button
            id="btn-voice-deafen"
            type="button"
            onClick={onToggleDeafen}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              voiceSession.isDeafened
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700 border border-neutral-700'
            }`}
            title={voiceSession.isDeafened ? 'Undeafen' : 'Deafen'}
          >
            <Headphones className={`w-4 h-4 ${voiceSession.isDeafened ? 'text-rose-400' : 'text-neutral-300'}`} />
          </button>

          <button
            id="btn-voice-disconnect"
            type="button"
            onClick={onDisconnect}
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/40 transition-all flex items-center gap-1.5"
            title="Disconnect Voice"
          >
            <PhoneOff className="w-4 h-4" />
            <span className="hidden sm:inline">Leave</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
