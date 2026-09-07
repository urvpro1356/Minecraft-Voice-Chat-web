import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Gamepad2,
  Smartphone,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { LinkedAccount, PlatformEdition } from '../types';

interface AccountLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  linkedAccounts: Record<PlatformEdition, LinkedAccount>;
  onSaveAccount: (edition: PlatformEdition, gamertag: string, isLinked: boolean) => void;
  onShowToast: (msg: string) => void;
}

export const AccountLinkModal: React.FC<AccountLinkModalProps> = ({
  isOpen,
  onClose,
  linkedAccounts,
  onSaveAccount,
  onShowToast,
}) => {
  const [selectedEdition, setSelectedEdition] = useState<PlatformEdition>('bedrock');
  const [gamertag, setGamertag] = useState('');
  const [step, setStep] = useState<'input' | 'verifying' | 'success'>('input');
  const [hasCopiedCode, setHasCopiedCode] = useState(false);

  if (!isOpen) return null;

  const currentAccount = linkedAccounts[selectedEdition];
  const sampleVerificationCode = `/link MC-${Math.floor(1000 + Math.random() * 9000)}-MINE`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sampleVerificationCode);
    setHasCopiedCode(true);
    setTimeout(() => setHasCopiedCode(false), 2500);
    onShowToast('Verification command copied to clipboard!');
  };

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gamertag.trim()) return;

    setStep('verifying');
    setTimeout(() => {
      onSaveAccount(selectedEdition, gamertag.trim(), true);
      setStep('success');
      onShowToast(`Successfully connected Minecraft ${selectedEdition === 'java' ? 'Java Edition' : 'Bedrock'} account!`);
      setTimeout(() => {
        setStep('input');
        setGamertag('');
        onClose();
      }, 1500);
    }, 1200);
  };

  const handleUnlink = () => {
    onSaveAccount(selectedEdition, '', false);
    onShowToast(`Unlinked ${selectedEdition === 'java' ? 'Java Edition' : 'Bedrock'} account.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        id="account-link-modal"
        className="relative w-full max-w-lg bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 shadow-2xl text-neutral-200 overflow-hidden"
      >
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Connect Minecraft Account</h2>
              <p className="text-xs text-neutral-400">Verify your in-game identity for badges & servers</p>
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

        {/* Edition Selector Tabs */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedEdition('java');
              setStep('input');
            }}
            className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
              selectedEdition === 'java'
                ? 'bg-emerald-500/15 border-emerald-500/60 text-white shadow-md shadow-emerald-950/40'
                : 'bg-[#1a1a1a] border-[#2a2a2a] text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
            }`}
          >
            <Gamepad2 className={`w-6 h-6 ${selectedEdition === 'java' ? 'text-emerald-400' : 'text-neutral-500'}`} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">Java Edition</span>
                {linkedAccounts.java.isLinked && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
              </div>
              <p className="text-[11px] text-neutral-400">PC / Mac / Linux</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedEdition('bedrock');
              setStep('input');
            }}
            className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
              selectedEdition === 'bedrock'
                ? 'bg-emerald-500/15 border-emerald-500/60 text-white shadow-md shadow-emerald-950/40'
                : 'bg-[#1a1a1a] border-[#2a2a2a] text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
            }`}
          >
            <Smartphone className={`w-6 h-6 ${selectedEdition === 'bedrock' ? 'text-emerald-400' : 'text-neutral-500'}`} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">Bedrock / MCPE</span>
                {linkedAccounts.bedrock.isLinked && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
              </div>
              <p className="text-[11px] text-neutral-400">Xbox / PS / Mobile / Win10</p>
            </div>
          </button>
        </div>

        {/* Current status alert */}
        <div className="mt-4 p-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {currentAccount.isLinked ? (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
            ) : (
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-500" />
            )}
            <div>
              <p className="text-xs text-neutral-400">Current Status</p>
              <p className="text-sm font-semibold text-neutral-100">
                {currentAccount.isLinked ? (
                  <span className="text-emerald-400 font-bold">
                    Connected: {currentAccount.gamertag}
                  </span>
                ) : (
                  'Not Connected'
                )}
              </p>
            </div>
          </div>

          {currentAccount.isLinked && (
            <button
              type="button"
              onClick={handleUnlink}
              className="text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all"
            >
              Unlink
            </button>
          )}
        </div>

        {/* Linking Form / Steps */}
        {step === 'verifying' ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin" />
            <h3 className="text-base font-bold text-white">Verifying Mojang / Xbox Auth...</h3>
            <p className="text-xs text-neutral-400 max-w-xs">
              Querying Mojang API & checking verification code handshake.
            </p>
          </div>
        ) : step === 'success' ? (
          <div className="py-10 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 animate-bounce">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Account Linked Successfully!</h3>
            <p className="text-xs text-neutral-400">
              Your profile has been granted verified rank badges and synchronized perks.
            </p>
          </div>
        ) : (
          <form onSubmit={handleLinkSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                {selectedEdition === 'java' ? 'Minecraft Java In-Game Name (IGN)' : 'Xbox Live Gamertag'}
              </label>
              <input
                id="input-gamertag"
                type="text"
                placeholder={selectedEdition === 'java' ? 'e.g. Dream, Technoblade, Notch' : 'e.g. CrafterPro99'}
                value={gamertag}
                onChange={(e) => setGamertag(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
              />
            </div>

            {/* Verification Code Box */}
            <div className="p-3.5 rounded-xl bg-[#121212] border border-[#2a2a2a]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  In-Game Verification Handshake
                </span>
                <span className="text-[10px] text-neutral-400">verify.minehub.net</span>
              </div>
              <p className="text-xs text-neutral-400 mb-2.5">
                Join our verification server or type this command in our lobby:
              </p>
              <div className="flex items-center justify-between bg-black/60 px-3 py-2 rounded-lg border border-neutral-800 font-mono text-xs text-emerald-400">
                <span>{sampleVerificationCode}</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 text-[11px] text-neutral-300 hover:text-white bg-neutral-800 px-2 py-1 rounded transition-colors"
                >
                  {hasCopiedCode ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-neutral-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-link-account"
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Link Account</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
