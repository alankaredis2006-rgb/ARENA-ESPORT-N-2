import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CURRENCIES, CurrencyCode, UserRole } from '../types';
import { LANGUAGES, LanguageCode } from '../i18n/translations';
import {
  Plus,
  Shield,
  Gamepad2,
  Sliders,
  ChevronDown,
  Database,
  Moon,
  Sun,
  Globe,
  Send,
  Sparkles,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    setActiveTab,
    userRole,
    setUserRole,
    currency,
    setCurrency,
    balanceFcfa,
    formatCurrency,
    openPaymentModal,
    setIsP2PModalOpen,
    setIsDocsModalOpen,
    language,
    setLanguage,
    theme,
    toggleTheme,
    t,
  } = useApp();

  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const roleLabels: Record<UserRole, { label: string; icon: React.ReactNode; color: string }> = {
    player: { label: t('mode_player'), icon: <Gamepad2 className="w-3.5 h-3.5" />, color: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30' },
    captain: { label: t('mode_captain'), icon: <Shield className="w-3.5 h-3.5" />, color: 'text-purple-400 bg-purple-950/40 border-purple-500/30' },
    admin: { label: t('mode_admin'), icon: <Sliders className="w-3.5 h-3.5" />, color: 'text-amber-400 bg-amber-950/40 border-amber-500/30' },
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#060913]/90 backdrop-blur-3xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="relative group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500/40 via-purple-500/40 to-blue-500/40 blur-md opacity-60 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden p-0.5 bg-slate-900 border border-slate-200 dark:border-white/20 shadow-lg shadow-black/20 dark:shadow-black/50">
              <img
                src="/assets/aistudio/image_34c6e627.jpeg"
                alt="ARENA ESPORT Logo"
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-black tracking-wider bg-gradient-to-r from-slate-900 via-cyan-800 to-purple-900 dark:from-white dark:via-cyan-200 dark:to-purple-300 bg-clip-text text-transparent">
              ARENA ESPORT
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Free Fire & PUBG Mobile
            </span>
          </div>
        </div>

        {/* Controls, Balance, Language, Theme, Role */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          {/* Balance Widget */}
          <div className="relative flex items-center gap-2 p-1 pl-2.5 pr-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-inner">
            <div className="flex flex-col text-right">
              <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium">
                {t('balance')}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
                {formatCurrency(balanceFcfa)}
              </span>
            </div>

            {/* Quick Top-up Button */}
            <button
              onClick={() => openPaymentModal(10000, 'Recharge Express Portefeuille', 'topup')}
              className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:brightness-110 active:scale-95 transition-all shadow-md shadow-cyan-500/25"
              title="Recharger via Nexus Africa Mobile Money ou CB"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Quick P2P Transfer Button */}
          <button
            onClick={() => setIsP2PModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/15 hover:bg-cyan-500/20 dark:hover:bg-cyan-500/25 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all"
            title="Transférer des crédits à un autre joueur"
          >
            <Send className="w-3.5 h-3.5" />
            <span>P2P</span>
          </button>

          {/* Language Switcher (FR, EN, ES, AR) */}
          <div className="relative">
            <button
              onClick={() => {
                setIsLangMenuOpen(!isLangMenuOpen);
                setIsCurrencyMenuOpen(false);
                setIsRoleMenuOpen(false);
              }}
              className="px-2 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 transition-colors"
              title="Changer de Langue"
            >
              <span>{LANGUAGES[language].flag}</span>
              <span className="hidden sm:inline">{LANGUAGES[language].code.toUpperCase()}</span>
              <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400" />
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-2xl p-1.5 bg-white/95 dark:bg-[#0e1628]/95 border border-slate-200 dark:border-white/15 backdrop-blur-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95 text-slate-800 dark:text-slate-200">
                {(Object.keys(LANGUAGES) as LanguageCode[]).map((langKey) => (
                  <button
                    key={langKey}
                    onClick={() => {
                      setLanguage(langKey);
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-left transition-colors ${
                      language === langKey
                        ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                    }`}
                  >
                    <span>{LANGUAGES[langKey].flag}</span>
                    <span>{LANGUAGES[langKey].name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dual Theme Switcher (Dark / Light) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors"
            title={theme === 'dark' ? t('theme_light') : t('theme_dark')}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-600" />}
          </button>

          {/* Currency Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setIsCurrencyMenuOpen(!isCurrencyMenuOpen);
                setIsRoleMenuOpen(false);
                setIsLangMenuOpen(false);
              }}
              className="px-2 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <span>{currency}</span>
              <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400" />
            </button>

            {isCurrencyMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-2xl p-1.5 bg-white/95 dark:bg-[#0e1628]/95 border border-slate-200 dark:border-white/15 backdrop-blur-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95 text-slate-800 dark:text-slate-200">
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCurrency(c);
                      setIsCurrencyMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium text-left transition-colors ${
                      currency === c
                        ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                    }`}
                  >
                    <span>{CURRENCIES[c].name}</span>
                    <span className="font-bold font-mono text-slate-500 dark:text-slate-400">{CURRENCIES[c].symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setIsRoleMenuOpen(!isRoleMenuOpen);
                setIsCurrencyMenuOpen(false);
                setIsLangMenuOpen(false);
              }}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${roleLabels[userRole].color}`}
            >
              {roleLabels[userRole].icon}
              <span className="hidden md:inline">{roleLabels[userRole].label}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {isRoleMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl p-1.5 bg-white/95 dark:bg-[#0e1628]/95 border border-slate-200 dark:border-white/15 backdrop-blur-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95 text-slate-800 dark:text-slate-200">
                {(['admin', 'captain', 'player'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setUserRole(r);
                      setIsRoleMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                      userRole === r
                        ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                    }`}
                  >
                    {roleLabels[r].icon}
                    <div className="flex flex-col">
                      <span className="font-semibold">{roleLabels[r].label}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {r === 'admin' && 'Plein contrôle & tournois officiels'}
                        {r === 'captain' && 'Clés Free Fire/PUBG & Squad'}
                        {r === 'player' && 'Joueur compétiteur standard'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Supabase SQL Docs */}
          <button
            onClick={() => setIsDocsModalOpen(true)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors"
            title="Schéma Supabase SQL"
          >
            <Database className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
