import React from 'react';
import { useApp, ActiveTab } from '../context/AppContext';
import {
  Trophy,
  Users,
  MessageSquare,
  Wallet,
  Award,
  Swords,
  Sliders,
} from 'lucide-react';

export const BottomTaskbar: React.FC = () => {
  const { activeTab, setActiveTab, unreadCommunityCount, userRole, t } = useApp();

  const isAdmin = userRole === 'admin';

  const navItems = [
    {
      id: 'home' as ActiveTab,
      label: t('home'),
      icon: (isActive: boolean) => (
        <Trophy
          className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
            isActive ? 'text-cyan-600 dark:text-cyan-400 scale-110' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-950 dark:group-hover:text-slate-200'
          }`}
        />
      ),
    },
    {
      id: 'tournaments' as ActiveTab,
      label: t('tournaments'),
      icon: (isActive: boolean) => (
        <Swords
          className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
            isActive ? 'text-cyan-600 dark:text-cyan-400 scale-110' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-950 dark:group-hover:text-slate-200'
          }`}
        />
      ),
    },
    {
      id: 'teams' as ActiveTab,
      label: t('teams'),
      icon: (isActive: boolean) => (
        <Users
          className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
            isActive ? 'text-cyan-600 dark:text-cyan-400 scale-110' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-950 dark:group-hover:text-slate-200'
          }`}
        />
      ),
    },
    {
      id: 'wallet' as ActiveTab,
      label: t('wallet'),
      icon: (isActive: boolean) => (
        <Wallet
          className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
            isActive ? 'text-cyan-600 dark:text-cyan-400 scale-110' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-950 dark:group-hover:text-slate-200'
          }`}
        />
      ),
    },
    {
      id: 'community' as ActiveTab,
      label: t('community'),
      badge: unreadCommunityCount,
      icon: (isActive: boolean) => (
        <MessageSquare
          className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
            isActive ? 'text-cyan-600 dark:text-cyan-400 scale-110' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-950 dark:group-hover:text-slate-200'
          }`}
        />
      ),
    },
    {
      id: 'leaderboard' as ActiveTab,
      label: t('leaderboard'),
      icon: (isActive: boolean) => (
        <Award
          className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
            isActive ? 'text-cyan-600 dark:text-cyan-400 scale-110' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-950 dark:group-hover:text-slate-200'
          }`}
        />
      ),
    },
    {
      id: 'profile' as ActiveTab,
      label: t('profile'),
      isAvatar: true,
      icon: (isActive: boolean) => (
        <div className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden border border-slate-300 dark:border-white/40 p-0.2 bg-slate-900 group-hover:border-cyan-500 transition-colors">
          <img
            src="/assets/aistudio/image_34c6e627.jpeg"
            alt="Profil ARENA"
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
          />
          <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#22c55e] ring-1 ring-white dark:ring-black"></span>
        </div>
      ),
    },
    ...(isAdmin
      ? [
          {
            id: 'admin' as ActiveTab,
            label: t('admin_hub'),
            icon: (isActive: boolean) => (
              <Sliders
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
                  isActive ? 'text-amber-500 dark:text-amber-400 scale-110' : 'text-amber-600/80 dark:text-amber-400/70 group-hover:text-amber-600 dark:group-hover:text-amber-300'
                }`}
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="fixed bottom-2 sm:bottom-5 left-1/2 -translate-x-1/2 z-50 pointer-events-auto max-w-[96vw]">
      {/* Liquid Glass Floating Taskbar Container */}
      <nav
        aria-label="Barre de navigation principale ARENA ESPORT"
        className="flex items-center gap-0.5 sm:gap-1.5 p-1 sm:p-1.5 rounded-full bg-white/95 dark:bg-[#121624]/90 border border-slate-200/90 dark:border-white/15 backdrop-blur-3xl shadow-xl shadow-slate-300/40 dark:shadow-2xl dark:shadow-black/85 ring-1 ring-black/5 dark:ring-white/10 overflow-x-auto no-scrollbar"
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group relative flex flex-col items-center justify-center min-w-[56px] sm:min-w-[70px] py-1 sm:py-1.5 px-2 sm:px-2.5 rounded-full transition-all duration-200 select-none ${
                isActive
                  ? 'bg-slate-200/90 dark:bg-white/[0.16] border border-slate-300/70 dark:border-white/25 shadow-sm dark:shadow-lg dark:shadow-black/40 text-slate-900 dark:text-white'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/70 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/[0.05]'
              }`}
            >
              {/* Badge Counter */}
              {item.badge && (
                <span className="absolute -top-1 right-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-[#22c55e] text-white shadow-md shadow-emerald-500/40 animate-pulse">
                  {item.badge}
                </span>
              )}

              {/* Icon */}
              <div className="relative flex items-center justify-center h-5 sm:h-6">
                {item.icon(isActive)}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] sm:text-[11px] font-semibold tracking-tight mt-0.5 transition-colors whitespace-nowrap ${
                  isActive ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {item.label}
              </span>

              {/* Active Indicator Bar */}
              {isActive && (
                <span className="absolute -bottom-0.5 w-5 sm:w-6 h-0.5 rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-purple-500 blur-[0.5px]"></span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
