import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  Signal,
  Users,
  Play,
  ExternalLink,
  Shield,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { ServerItem } from '../types';
import { fetchLiveServerStatus } from '../utils/minecraftPing';

interface ServerCardProps {
  server: ServerItem;
  onCopyIp: (ip: string, port?: number) => void;
  onJoinServer: (server: ServerItem) => void;
  onDeleteServer?: (id: string) => void;
  isCustom?: boolean;
}

export const ServerCard: React.FC<ServerCardProps> = ({
  server,
  onCopyIp,
  onJoinServer,
  onDeleteServer,
  isCustom = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [liveData, setLiveData] = useState<{
    online: boolean;
    playersOnline: number;
    maxPlayers: number;
    pingMs: number;
    version?: string;
  }>({
    online: server.online,
    playersOnline: server.playersOnline,
    maxPlayers: server.maxPlayers,
    pingMs: server.pingMs,
    version: server.version,
  });

  // Query real live ping and players from real Minecraft server API
  const refreshLivePing = async () => {
    setIsPinging(true);
    try {
      const res = await fetchLiveServerStatus(server.ip, server.port);
      if (res.online) {
        setLiveData({
          online: true,
          playersOnline: res.playersOnline,
          maxPlayers: res.maxPlayers || server.maxPlayers,
          pingMs: res.pingMs,
          version: res.version || server.version,
        });
      } else {
        setLiveData((prev) => ({
          ...prev,
          online: false,
          pingMs: 999,
        }));
      }
    } catch {
      // Keep existing data
    } finally {
      setIsPinging(false);
    }
  };

  useEffect(() => {
    refreshLivePing();
  }, [server.ip, server.port]);

  const fullAddress = server.port === 25565 ? server.ip : `${server.ip}:${server.port}`;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopyIp(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate percentage of max players with real live data
  const playerPercent = Math.min(
    100,
    Math.round((liveData.playersOnline / Math.max(1, liveData.maxPlayers)) * 100)
  );

  return (
    <div
      id={`server-card-${server.id}`}
      className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/20 transition-all duration-200"
    >
      <div>
        {/* Top Header: Icon + Name + Status Dot + Ping */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-neutral-800 border border-neutral-700 overflow-hidden shrink-0 flex items-center justify-center">
              {server.iconUrl ? (
                <img
                  src={server.iconUrl}
                  alt={server.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <span className="text-xl">🏰</span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {server.name}
                </h3>
                {liveData.online ? (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Online
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    Offline
                  </span>
                )}
              </div>

              {/* Version & Real Ping */}
              <div className="flex items-center gap-2.5 text-xs text-neutral-400 mt-1">
                <span>{liveData.version || server.version}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-400/90 font-mono">
                  <Signal className="w-3 h-3" />
                  {liveData.pingMs}ms
                </span>
                <button
                  type="button"
                  onClick={refreshLivePing}
                  disabled={isPinging}
                  className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-emerald-400 transition-colors"
                  title="Ping server again"
                >
                  <RefreshCw className={`w-3 h-3 ${isPinging ? 'animate-spin text-emerald-400' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {isCustom && onDeleteServer && (
            <button
              type="button"
              onClick={() => onDeleteServer(server.id)}
              className="text-neutral-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
              title="Remove server from list"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Server Description */}
        <p className="text-xs text-neutral-300 mt-3 line-clamp-2 leading-relaxed">
          {server.description}
        </p>

        {/* Gamemode Badges */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {server.gamemodes.map((mode) => (
            <span
              key={mode}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#121212] text-neutral-300 border border-[#2a2a2a]"
            >
              {mode}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Area: Players bar + IP Box + Actions */}
      <div className="mt-4 pt-3 border-t border-[#2a2a2a] space-y-3">
        {/* Real Player Count Bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-neutral-400" />
              Real Players Online
            </span>
            <span className="font-semibold font-mono text-neutral-200">
              {liveData.playersOnline.toLocaleString()} / {liveData.maxPlayers.toLocaleString()}
            </span>
          </div>
          <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-500"
              style={{ width: `${playerPercent}%` }}
            />
          </div>
        </div>

        {/* IP address pill with Copy + Join Button */}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center justify-between px-3 py-2 rounded-xl bg-[#121212] border border-[#2a2a2a] font-mono text-xs text-neutral-300 overflow-hidden">
            <span className="truncate">{fullAddress}</span>
            <button
              id={`btn-copy-ip-${server.id}`}
              type="button"
              onClick={handleCopy}
              className="ml-2 flex items-center gap-1 text-[11px] font-sans font-medium text-emerald-400 hover:text-emerald-300 shrink-0 hover:underline"
              title="Copy server IP"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy IP</span>
                </>
              )}
            </button>
          </div>

          <button
            id={`btn-join-server-${server.id}`}
            type="button"
            onClick={() => onJoinServer(server)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all shrink-0 active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Join</span>
          </button>
        </div>
      </div>
    </div>
  );
};
