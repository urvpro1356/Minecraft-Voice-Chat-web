import React from 'react';
import {
  Compass,
  Trophy,
  Swords,
  BookOpen,
  Radio,
  Menu,
  PanelRight,
  Share2,
  Users,
  User,
  LogIn,
  LayoutDashboard,
} from 'lucide-react';
import { AppUser } from '../types';

export type TabType = 'Dashboard' | 'Connect' | 'Explore' | 'Compete' | 'Practice' | 'Learn';

interface HeaderBannerProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenMobileSidebar: () => void;
  onOpenMobileTopicPanel: () => void;
  onShareHub: () => void;
  onlineCount?: string;
  currentUser?: AppUser | null;
  onOpenAuthModal?: () => void;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  activeTab,
  setActiveTab,
  onOpenMobileSidebar,
  onOpenMobileTopicPanel,
  onShareHub,
  onlineCount = '842.5K',
  currentUser,
  onOpenAuthModal,
}) => {
  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    ...(currentUser
      ? [{ id: 'Dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard, badge: 'Direct' }]
      : []),
    { id: 'Connect', label: 'Connect', icon: Radio, badge: 'Live' },
    { id: 'Explore', label: 'Explore', icon: Compass },
    { id: 'Compete', label: 'Compete', icon: Trophy, badge: 'Tourney' },
    { id: 'Practice', label: 'Practice', icon: Swords },
    { id: 'Learn', label: 'Learn', icon: BookOpen },
  ];

  return (
    <header id="main-header-banner" className="relative w-full overflow-hidden border-b border-[#2a2a2a] bg-[#121212]">
      {/* Background Graphic with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=1600&auto=format&fit=crop&q=80"
          alt="Minecraft Landscape Banner"
          className="w-full h-full object-cover object-center opacity-30 filter saturate-150 brightness-75 scale-105 transition-transform duration-1000"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/90 via-transparent to-[#0a0a0a]/90" />
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-4 pb-0">
        {/* Top bar for mobile actions */}
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <button
              id="mobile-sidebar-toggle"
              type="button"
              onClick={onOpenMobileSidebar}
              className="lg:hidden p-2 rounded-xl bg-[#1a1a1a]/80 text-neutral-300 hover:text-white border border-[#2a2a2a] backdrop-blur-md"
              title="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{onlineCount} Builders Active</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser ? (
              <button
                type="button"
                id="btn-banner-user-profile"
                onClick={() => setActiveTab('Dashboard')}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#1a1a1a]/80 hover:bg-[#252525] border border-[#2a2a2a] text-xs font-medium text-neutral-200 transition-all backdrop-blur-md"
                title="Go to Dashboard"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  className="w-5 h-5 rounded-lg object-cover border border-emerald-500/40"
                />
                <span className="font-bold text-white max-w-[100px] truncate">{currentUser.username}</span>
                <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  {currentUser.rankBadge}
                </span>
              </button>
            ) : (
              <button
                type="button"
                id="btn-banner-login"
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-all backdrop-blur-md"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
            )}

            <button
              id="btn-share-hub"
              type="button"
              onClick={onShareHub}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1a1a1a]/80 hover:bg-[#252525] border border-[#2a2a2a] text-xs font-medium text-neutral-300 hover:text-white transition-all backdrop-blur-md"
            >
              <Share2 className="w-3.5 h-3.5 text-neutral-400" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              id="mobile-topic-toggle"
              type="button"
              onClick={onOpenMobileTopicPanel}
              className="xl:hidden p-2 rounded-xl bg-[#1a1a1a]/80 text-neutral-300 hover:text-white border border-[#2a2a2a] backdrop-blur-md"
              title="Toggle Topic Panel"
            >
              <PanelRight className="w-5 h-5 text-emerald-400" />
            </button>
          </div>
        </div>

        {/* Banner Title & Subtitle Tagline */}
        <div className="mt-2 mb-6 max-w-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 via-emerald-600 to-teal-800 flex items-center justify-center shadow-xl shadow-green-950/60 border border-emerald-400/40">
              <span className="text-2xl font-black text-white">⛏</span>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Minecraft
                </h1>
                <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-neutral-800/90 text-emerald-400 border border-emerald-500/40">
                  Official Hub
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 font-medium">
                The ultimate sandbox universe for survivalists, redstone engineers, and master builders.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Row: Explore, Compete, Practice, Learn, Connect */}
        <nav
          id="header-tabs-row"
          className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar pt-2"
          aria-label="Community Tabs"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id.toLowerCase()}`}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 sm:px-5 py-3 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'text-white'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5 rounded-t-lg'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-emerald-400' : 'text-neutral-400'
                  }`}
                />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                      tab.id === 'Connect'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}

                {/* Underlined indicator in green */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-400 rounded-full shadow-[0_-2px_8px_rgba(74,222,128,0.7)]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
