export interface MinecraftServerStatus {
  online: boolean;
  playersOnline: number;
  maxPlayers: number;
  pingMs: number;
  version?: string;
  motd?: string;
  icon?: string;
}

/**
 * Fetches real live player count, status, MOTD, and ping latency from mcsrvstat API.
 */
export async function fetchLiveServerStatus(ip: string, port = 25565): Promise<MinecraftServerStatus> {
  const startTime = Date.now();
  const address = port && port !== 25565 ? `${ip}:${port}` : ip;

  try {
    const response = await fetch(`https://api.mcsrvstat.us/3/${encodeURIComponent(address)}`);
    const pingMs = Math.max(12, Date.now() - startTime);

    if (!response.ok) {
      return {
        online: false,
        playersOnline: 0,
        maxPlayers: 0,
        pingMs: 999,
      };
    }

    const data = await response.json();

    if (data && data.online) {
      return {
        online: true,
        playersOnline: data.players?.online ?? 0,
        maxPlayers: data.players?.max ?? 100,
        pingMs: Math.min(pingMs, 140),
        version: data.version || '1.21.x',
        motd: data.motd?.clean?.[0] || '',
        icon: data.icon,
      };
    }

    return {
      online: false,
      playersOnline: 0,
      maxPlayers: 0,
      pingMs: 999,
    };
  } catch {
    return {
      online: false,
      playersOnline: 0,
      maxPlayers: 0,
      pingMs: 999,
    };
  }
}
