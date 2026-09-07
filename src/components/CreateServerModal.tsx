import React, { useState } from 'react';
import { X, Server, Plus, Globe, Loader2 } from 'lucide-react';
import { ServerItem } from '../types';
import { fetchLiveServerStatus } from '../utils/minecraftPing';

interface CreateServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddServer: (newServer: ServerItem) => void;
}

export const CreateServerModal: React.FC<CreateServerModalProps> = ({
  isOpen,
  onClose,
  onAddServer,
}) => {
  const [name, setName] = useState('');
  const [ip, setIp] = useState('');
  const [port, setPort] = useState('25565');
  const [gamemodes, setGamemodes] = useState('Survival, SMP');
  const [description, setDescription] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !ip.trim()) return;

    setIsChecking(true);
    const parsedPort = parseInt(port, 10) || 25565;
    const modeList = gamemodes
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);

    // Query real live ping and players from real server
    const realStatus = await fetchLiveServerStatus(ip.trim(), parsedPort);

    const newServer: ServerItem = {
      id: `srv-custom-${Date.now()}`,
      name: name.trim(),
      ip: ip.trim(),
      port: parsedPort,
      online: realStatus.online,
      playersOnline: realStatus.playersOnline,
      maxPlayers: realStatus.maxPlayers || 100,
      pingMs: realStatus.pingMs,
      gamemodes: modeList.length > 0 ? modeList : ['Survival'],
      description:
        description.trim() || realStatus.motd || 'Custom community server. High tickrate and vanilla mechanics.',
      version: realStatus.version || '1.21.x',
      iconUrl: realStatus.icon || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=120&auto=format&fit=crop&q=80',
    };

    setIsChecking(false);
    onAddServer(newServer);
    setName('');
    setIp('');
    setPort('25565');
    setGamemodes('Survival, SMP');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        id="create-server-modal"
        className="relative w-full max-w-md bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 shadow-2xl text-neutral-200"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Add Minecraft Server</h2>
              <p className="text-xs text-neutral-400">Save server address to your quick list</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
              Server Name
            </label>
            <input
              id="input-server-name"
              type="text"
              placeholder="e.g. My Vanilla Realm, Nether SMP"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Server IP / Address
              </label>
              <input
                id="input-server-ip"
                type="text"
                placeholder="e.g. play.myserver.net"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Port
              </label>
              <input
                id="input-server-port"
                type="text"
                placeholder="25565"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
              Gamemodes (comma-separated)
            </label>
            <input
              id="input-server-gamemodes"
              type="text"
              placeholder="Survival, Hardcore, Bedwars"
              value={gamemodes}
              onChange={(e) => setGamemodes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
              Short Description (optional)
            </label>
            <textarea
              id="input-server-desc"
              rows={2}
              placeholder="Custom grief protection, friendly staff, custom enchants..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              id="btn-submit-add-server"
              type="submit"
              disabled={isChecking}
              className="px-5 py-2.5 text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              {isChecking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Pinging Server...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add to List</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
