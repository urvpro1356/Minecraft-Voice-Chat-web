import React, { useState } from 'react';
import { X, User, Lock, Gamepad2, ShieldCheck, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { AppUser } from '../types';
import { registerAccount, loginAccount, quickGuestLogin } from '../utils/freeBackend';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AppUser, message: string) => void;
  currentUser: AppUser | null;
  onLogout?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentUser,
  onLogout,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'guest'>('login');
  const [username, setUsername] = useState('');
  const [gamertag, setGamertag] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = registerAccount(username, gamertag, password);
    if (res.success && res.user) {
      onSuccess(res.user, `Welcome, ${res.user.username}! Account created.`);
      onClose();
    } else {
      setErrorMsg(res.message || 'Could not register');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = loginAccount(username, password);
    if (res.success && res.user) {
      onSuccess(res.user, `Welcome back, ${res.user.username}!`);
      onClose();
    } else {
      setErrorMsg(res.message || 'Login failed');
    }
  };

  const handleGuest = (e: React.FormEvent) => {
    e.preventDefault();
    const guest = quickGuestLogin(username);
    onSuccess(guest, `Signed in as Guest: ${guest.username}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 shadow-2xl relative text-neutral-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {currentUser && !currentUser.isGuest ? (
          <div className="text-center py-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              className="w-16 h-16 rounded-2xl mx-auto border-2 border-emerald-400 object-cover shadow-lg shadow-emerald-500/20"
            />
            <h2 className="text-lg font-bold text-white mt-3">{currentUser.username}</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Gamertag: {currentUser.gamertag}</p>
            <span className="inline-block mt-2 text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {currentUser.rankBadge} • Lvl {currentUser.level}
            </span>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors"
              >
                Close
              </button>
              {onLogout && (
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-colors"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-white">Player Account</h2>
            </div>
            <p className="text-xs text-neutral-400 mb-5">
              100% Free login. Store your Minecraft gamertags, voice chat, and servers.
            </p>

            {/* Mode Switcher */}
            <div className="flex bg-neutral-900 border border-neutral-800 rounded-xl p-1 mb-4">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'login' ? 'bg-neutral-800 text-emerald-400 shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg('');
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'register' ? 'bg-neutral-800 text-emerald-400 shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                Register
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('guest');
                  setErrorMsg('');
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'guest' ? 'bg-neutral-800 text-emerald-400 shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Guest
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {errorMsg}
              </div>
            )}

            {mode === 'guest' ? (
              <form onSubmit={handleGuest} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Your Nickname / Gamer Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. DiamondMiner99"
                      className="w-full bg-[#1e1e1e] border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Enter as Guest
                </button>
              </form>
            ) : (
              <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Username</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter account username"
                      className="w-full bg-[#1e1e1e] border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Minecraft Gamertag (Optional)
                    </label>
                    <div className="relative">
                      <Gamepad2 className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={gamertag}
                        onChange={(e) => setGamertag(e.target.value)}
                        placeholder="e.g. Steve_Crafts"
                        className="w-full bg-[#1e1e1e] border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 4 characters"
                      className="w-full bg-[#1e1e1e] border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mt-2"
                >
                  {mode === 'login' ? (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Log In</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Create Free Account</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
