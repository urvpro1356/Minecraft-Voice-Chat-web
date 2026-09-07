import React, { useState } from 'react';
import {
  Home,
  LayoutDashboard,
  Bell,
  ShoppingBag,
  Search,
  Plus,
  Compass,
  Layers,
  Sparkles,
  Shield,
  ChevronRight,
  Check,
  X,
  Volume2,
} from 'lucide-react';
import { AppUser } from '../types';
import { CURRENT_USER } from '../data/mockData';

interface SidebarProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
  unreadNotifications: number;
  onOpenAddTopic?: () => void;
  onOpenStoreModal?: () => void;
  onOpenNotificationsModal?: () => void;
  onSelectDashboard?: () => void;
  activeVoiceRoomName?: string;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentUser?: AppUser | null;
  onOpenAuthModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav,
  setActiveNav,
  unreadNotifications,
  onOpenAddTopic,
  onOpenStoreModal,
  onOpenNotificationsModal,
  onSelectDashboard,
  activeVoiceRoomName,
  isMobileOpen = false,
  setIsMobileOpen,
  searchQuery,
  setSearchQuery,
  currentUser,
  onOpenAuthModal,
}) => {
  const [topics, setTopics] = useState([
    { id: 'minecraft', name: 'Minecraft', icon: '🟩', count: '842k', active: true },
    { id: 'roblox', name: 'Roblox', icon: '🟥', count: '620k', active: false },
  ]);

  const navItems = [
    ...(currentUser ? [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }] : []),
    { id: 'home', label: 'Home', icon: Home },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotifications > 0 ? unreadNotifications : undefined,
    },
    { id: 'store', label: 'Store', icon: ShoppingBag, tag: 'SALE' },
  ];

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    if (id === 'dashboard' && onSelectDashboard) {
      onSelectDashboard();
    } else if (id === 'notifications' && onOpenNotificationsModal) {
      onOpenNotificationsModal();
    } else if (id === 'store' && onOpenStoreModal) {
      onOpenStoreModal();
    }
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const content = (
    <div className="flex flex-col h-full bg-[#121212] border-r border-[#2a2a2a] text-neutral-300 w-64 lg:w-72 select-none">
      {/* Top Brand Logo */}
      <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-green-800 flex items-center justify-center shadow-lg shadow-emerald-950/50 border border-emerald-400/30">
            <span className="font-extrabold text-white text-lg tracking-wider">⛏</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-neutral-100 tracking-tight">MINECOMM</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                PRO
              </span>
            </div>
            <p className="text-xs text-neutral-400">Minecraft Community</p>
          </div>
        </div>

        {setIsMobileOpen && (
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Global Search Bar */}
      <div className="px-4 py-3">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
          <input
            id="sidebar-search-input"
            type="text"
            placeholder="Search servers, groups, posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/30 transition-all"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-neutral-400 hover:text-neutral-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="absolute right-2.5 text-[10px] px-1 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
              /
            </span>
          )}
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="px-3 py-2 space-y-1">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 px-3 py-1">
          Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-neutral-300 hover:bg-[#1a1a1a] hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-emerald-400' : 'text-neutral-400 group-hover:text-emerald-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-500 text-neutral-950 shadow-sm shadow-emerald-500/50">
                    {item.badge}
                  </span>
                )}
                {item.tag && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {item.tag}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Voice Bar Mini Status if in voice */}
      {activeVoiceRoomName && (
        <div className="mx-3 my-2 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="truncate">
              <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Voice Connected</p>
              <p className="text-xs text-neutral-200 font-medium truncate">{activeVoiceRoomName}</p>
            </div>
          </div>
        </div>
      )}

      {/* My Topics Section */}
      <div className="px-3 py-3 mt-2 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-3 py-1 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            My Topics
          </span>
          <span className="text-[11px] text-neutral-400">2 Joined</span>
        </div>

        <div className="space-y-1">
          {topics.map((topic) => (
            <button
              key={topic.id}
              id={`topic-${topic.id}`}
              type="button"
              onClick={() => {
                setTopics(
                  topics.map((t) => ({
                    ...t,
                    active: t.id === topic.id,
                  }))
                );
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                topic.active
                  ? 'bg-neutral-800/80 text-white border border-neutral-700/80 shadow-sm'
                  : 'text-neutral-400 hover:bg-[#1a1a1a] hover:text-neutral-200 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{topic.icon}</span>
                <span className="font-semibold">{topic.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {topic.active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                <span className="text-xs text-neutral-400 font-normal">{topic.count}</span>
              </div>
            </button>
          ))}

          {/* Add Interests Link */}
          <button
            id="btn-add-interests"
            type="button"
            onClick={onOpenAddTopic}
            className="w-full mt-2 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Interests</span>
          </button>
        </div>

        {/* Community Quick Links */}
        <div className="mt-6 px-3 pt-3 border-t border-[#2a2a2a]">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">
            Quick Discovery
          </div>
          <div className="space-y-1.5 text-xs text-neutral-400">
            <div className="flex items-center justify-between py-1 px-1 hover:text-neutral-200 cursor-pointer">
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Featured Shaders
              </span>
              <span className="text-[10px] text-neutral-400">New</span>
            </div>
            <div className="flex items-center justify-between py-1 px-1 hover:text-neutral-200 cursor-pointer">
              <span className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                SMP Anti-Cheat
              </span>
              <span className="text-[10px] text-neutral-400">v3.2</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Card Pinned at Bottom */}
      <div className="p-3 border-t border-[#2a2a2a] bg-[#0d0d0d]">
        {currentUser ? (
          <div
            id="user-profile-card"
            onClick={() => {
              setActiveNav('dashboard');
              if (setIsMobileOpen) setIsMobileOpen(false);
            }}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-[#1a1a1a] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  className="w-10 h-10 rounded-xl object-cover border border-neutral-700 group-hover:border-emerald-500/50 transition-colors"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0d0d0d]" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-neutral-100 group-hover:text-emerald-400 transition-colors truncate max-w-[110px]">
                    {currentUser.username}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] px-1.5 py-0.5 font-semibold rounded bg-neutral-800 text-emerald-400 border border-emerald-500/30">
                    {currentUser.rankBadge}
                  </span>
                  <span className="text-[11px] text-neutral-400">Lvl {currentUser.level}</span>
                </div>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenAuthModal}
            id="btn-sidebar-login"
            className="w-full py-2.5 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span>Log In / Sign Up</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop permanent sidebar */}
      <aside id="left-sidebar" className="hidden lg:block shrink-0 h-screen sticky top-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
          />
          <div className="relative z-10 w-72 max-w-[85vw] animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
