import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SubscriptionSection } from './SubscriptionSection';
import { SupportTicketModal } from './SupportTicketModal';
import { CURRENCIES, CurrencyCode, UserRole } from '../types';
import {
  Wallet,
  Trophy,
  Award,
  Clock,
  Swords,
  Crosshair,
  Shield,
  Smartphone,
  CreditCard,
  Plus,
  Flame,
  CheckCircle2,
  Sliders,
  ChevronDown,
  History,
  ArrowUpRight,
  ArrowDownLeft,
  Crown,
  KeyRound,
  Send,
  Coins,
  Share2,
  Copy,
  Check,
  LifeBuoy,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    balanceFcfa,
    pendingBalanceFcfa,
    formatCurrency,
    currency,
    setCurrency,
    openPaymentModal,
    setIsP2PModalOpen,
    setIsWithdrawModalOpen,
    transactions,
    userRole,
    setUserRole,
    playerBadges,
    playerStats,
    userSquad,
    referralCode,
    referralCount,
    referralEarningsFcfa,
    addToast,
    t,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'wallet' | 'pass'>('overview');
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const isAdmin = userRole === 'admin';

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
    addToast('success', 'Code Copié !', 'Votre code de parrainage a été copié. Partagez-le avec vos amis pour gagner 5 000 FCFA par inscription.');
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      
      {/* Profile Identity Card (iOS Liquid Glass) */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/20 via-purple-500/15 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Avatar matching "Vous" in the user screenshot */}
            <div className="relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden border-2 border-cyan-400/40 p-1 bg-slate-900 shadow-xl shadow-cyan-500/20">
                <img
                  src="/assets/aistudio/image_34c6e627.jpeg"
                  alt="Avatar Joueur"
                  className="w-full h-full object-cover rounded-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 ring-4 ring-[#060913] shadow-md shadow-emerald-500/50 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {userSquad.captainName}
                </h1>
                <span className="px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {userSquad.tag}
                </span>
                <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                  <Crown className="w-3 h-3 text-purple-400" />
                  <span>{t('level')} {playerStats.level}</span>
                </span>
              </div>

              <p className="text-xs text-slate-300 flex items-center gap-2">
                <span>{playerStats.rankTitle}</span>
                <span>·</span>
                <span className="font-mono text-cyan-300">UID: FF-890412</span>
                <span>·</span>
                <span>{userSquad.country} {userSquad.flag}</span>
              </p>

              {/* Role Indicator & Admin Badge */}
              <div className="flex items-center gap-2 pt-1">
                <span className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold uppercase tracking-wider border flex items-center gap-1.5 ${
                  isAdmin
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20'
                    : 'bg-white/10 text-slate-200 border-white/15'
                }`}>
                  <Shield className="w-3.5 h-3.5" />
                  <span>{isAdmin ? 'Super Administrateur & Arbitre Suprême' : 'Capitaine d\'Escouade'}</span>
                </span>

                <button
                  onClick={() => setIsSupportModalOpen(true)}
                  className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-semibold border border-white/10 flex items-center gap-1 transition-colors"
                >
                  <LifeBuoy className="w-3 h-3 text-cyan-400" />
                  <span>Assistance Support</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Balance Box on Profile Header */}
          <div className="p-4 rounded-2xl glass-card border border-white/10 flex flex-col gap-2 min-w-[220px]">
            <span className="text-[11px] text-slate-400 font-medium">{t('available_balance')}</span>
            <div className="text-2xl font-black text-white tabular-nums tracking-tight">
              {formatCurrency(balanceFcfa)}
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                onClick={() => openPaymentModal(10000, 'Recharge Express Mobile Money', 'topup')}
                className="py-1.5 px-2 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Recharger</span>
              </button>

              <button
                onClick={() => setIsP2PModalOpen(true)}
                className="py-1.5 px-2 rounded-xl font-bold text-xs bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 transition-all flex items-center justify-center gap-1"
              >
                <Send className="w-3 h-3" />
                <span>P2P</span>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Internal Tabs */}
        <div className="flex items-center gap-2 pt-6 mt-6 border-t border-white/10 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'overview', label: 'Compte & Statistiques', icon: <Trophy className="w-3.5 h-3.5" /> },
            { id: 'wallet', label: 'Portefeuille & Nexus Mobile Money', icon: <Wallet className="w-3.5 h-3.5" /> },
            { id: 'pass', label: 'Pass Compétition & Avantages', icon: <Crown className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeSubTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SUB-VIEW 1: OVERVIEW & STATS & BADGES & REFERRAL */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Competitive Stats Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Activité sur l'Application & Performances Compétitives</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              <div className="p-4 rounded-2xl glass-card border border-white/10 text-center space-y-1">
                <span className="text-[11px] text-slate-400">{t('hours_played')}</span>
                <p className="text-xl font-black font-mono text-cyan-300">{playerStats.hoursPlayed}h</p>
                <span className="text-[10px] text-slate-500">Cette saison</span>
              </div>

              <div className="p-4 rounded-2xl glass-card border border-white/10 text-center space-y-1">
                <span className="text-[11px] text-slate-400">{t('tournaments_played')}</span>
                <p className="text-xl font-black font-mono text-white">{playerStats.tournamentsParticipated}</p>
                <span className="text-[10px] text-slate-500">Matchs officiels</span>
              </div>

              <div className="p-4 rounded-2xl glass-card border border-white/10 text-center space-y-1">
                <span className="text-[11px] text-slate-400">{t('top1_wins')}</span>
                <p className="text-xl font-black font-mono text-amber-300">{playerStats.top1Victories}</p>
                <span className="text-[10px] text-slate-500">Trophées majeurs</span>
              </div>

              <div className="p-4 rounded-2xl glass-card border border-white/10 text-center space-y-1">
                <span className="text-[11px] text-slate-400">{t('kills_total')}</span>
                <p className="text-xl font-black font-mono text-red-400">{playerStats.totalKills}</p>
                <span className="text-[10px] text-slate-500">Éliminations</span>
              </div>

              <div className="p-4 rounded-2xl glass-card border border-white/10 text-center space-y-1">
                <span className="text-[11px] text-slate-400">Ratio K/D</span>
                <p className="text-xl font-black font-mono text-emerald-400">{playerStats.kdRatio}</p>
                <span className="text-[10px] text-slate-500">Kill / Death</span>
              </div>

              <div className="p-4 rounded-2xl glass-card border border-white/10 text-center space-y-1">
                <span className="text-[11px] text-slate-400">Headshot %</span>
                <p className="text-xl font-black font-mono text-purple-400">{playerStats.headshotRate}%</p>
                <span className="text-[10px] text-slate-500">Précision tir</span>
              </div>
            </div>
          </div>

          {/* Badges Obtenus Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{t('badges_trophies')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {playerBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="p-5 rounded-3xl glass-card border border-white/10 space-y-3 flex flex-col justify-between hover:border-cyan-500/30 transition-all group"
                >
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/15 flex items-center justify-center text-cyan-300 group-hover:scale-105 transition-transform">
                      {badge.icon === 'Flame' && <Flame className="w-6 h-6 text-orange-400" />}
                      {badge.icon === 'Shield' && <Shield className="w-6 h-6 text-cyan-400" />}
                      {badge.icon === 'Crosshair' && <Crosshair className="w-6 h-6 text-purple-400" />}
                      {badge.icon === 'Trophy' && <Trophy className="w-6 h-6 text-amber-400" />}
                    </div>

                    <h4 className="text-sm font-bold text-white">
                      {badge.name}
                    </h4>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/5 text-[10px] text-slate-500 font-mono">
                    Obtenu le {badge.unlockedAt}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Referral & Parrainage Banner (Feature 12) */}
          <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-purple-950/40 to-slate-900/80 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1 max-w-xl">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5" />
                <span>Système de Parrainage Officiel ARENA</span>
              </span>
              <h4 className="text-lg font-black text-white">
                {t('share_referral')}
              </h4>
              <p className="text-xs text-slate-300">
                Gagnez 5 000 FCFA de crédits directement sur votre portefeuille pour chaque squad inscrite avec votre code.
              </p>
              <div className="flex items-center gap-3 pt-1 text-xs text-slate-400">
                <span>Filleuls actifs : <strong className="text-white">{referralCount} escouades</strong></span>
                <span>·</span>
                <span>Bonus cumulés : <strong className="text-emerald-400 font-mono">{formatCurrency(referralEarningsFcfa)}</strong></span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between gap-3 min-w-[260px]">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">Code Unique :</span>
                <span className="font-mono font-bold text-cyan-300 text-sm tracking-wider">{referralCode}</span>
              </div>

              <button
                onClick={copyReferralCode}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                {copiedReferral ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedReferral ? 'Copié' : 'Copier'}</span>
              </button>
            </div>
          </div>

          {/* Role Privilege Controller */}
          <div className="p-5 rounded-3xl glass-card border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Attribution des Droits & Privilèges
              </span>
              <h4 className="text-sm font-bold text-white">
                Contrôle des Permissions de l'Application
              </h4>
              <p className="text-xs text-slate-400">
                Basculez en Administrateur pour gérer les tournois officiels avec récompenses en cash.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {(['player', 'captain', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setUserRole(r)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    userRole === r
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/30'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {r === 'player' && 'Joueur'}
                  {r === 'captain' && 'Capitaine'}
                  {r === 'admin' && 'Administrateur'}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* SUB-VIEW 2: FULL WALLET & NEXUS MOBILE MONEY & P2P & WITHDRAWALS */}
      {activeSubTab === 'wallet' && (
        <div className="space-y-6">
          
          {/* Wallet Balance Hero */}
          <div className="p-6 sm:p-7 rounded-3xl glass-card border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-purple-950/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">
                {t('available_balance')}
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white tabular-nums tracking-tight">
                {formatCurrency(balanceFcfa)}
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>{t('pending_balance')} : <strong className="text-amber-300 font-mono">{formatCurrency(pendingBalanceFcfa)}</strong></span>
                <span>·</span>
                <span className="text-emerald-400">Nexus Africa Payouts Actif</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Currency Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-white flex items-center gap-1.5"
                >
                  <span>{currency}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {isCurrencyDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-2xl p-1.5 bg-[#0e1628]/95 border border-white/15 backdrop-blur-2xl shadow-2xl z-50">
                    {(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCurrency(c);
                          setIsCurrencyDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors ${
                          currency === c
                            ? 'bg-cyan-500/20 text-cyan-300'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span>{CURRENCIES[c].name}</span>
                        <span className="font-mono">{CURRENCIES[c].symbol}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons: Recharge, P2P, Retrait */}
              <button
                onClick={() => openPaymentModal(10000, 'Recharge Mobile Money (Nexus Africa)', 'topup')}
                className="py-2.5 px-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{t('top_up')}</span>
              </button>

              <button
                onClick={() => setIsP2PModalOpen(true)}
                className="py-2.5 px-3.5 rounded-xl font-bold text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 transition-all flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>{t('transfer_btn')}</span>
              </button>

              <button
                onClick={() => setIsWithdrawModalOpen(true)}
                className="py-2.5 px-3.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all flex items-center gap-1.5"
              >
                <Coins className="w-4 h-4 text-amber-400" />
                <span>{t('withdraw_funds')}</span>
              </button>
            </div>
          </div>

          {/* Transactions Statement List */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" />
              <span>{t('financial_history')}</span>
            </h4>

            <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden divide-y divide-white/5">
              {transactions.map((tx) => {
                const isPositive = tx.amountFcfa > 0;
                return (
                  <div key={tx.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                        isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {isPositive ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white">{tx.description}</div>
                        <div className="text-[11px] text-slate-400">{tx.date} · {tx.provider} · Réf: {tx.reference}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`font-mono font-bold text-xs sm:text-sm ${
                        isPositive ? 'text-emerald-400' : 'text-slate-200'
                      }`}>
                        {isPositive ? `+${formatCurrency(tx.amountFcfa)}` : `-${formatCurrency(Math.abs(tx.amountFcfa))}`}
                      </div>
                      <span className="text-[10px] text-emerald-400">Validé</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* SUB-VIEW 3: PASS & SUBSCRIPTIONS */}
      {activeSubTab === 'pass' && (
        <SubscriptionSection />
      )}

      {/* Support Ticket Modal */}
      <SupportTicketModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />

    </div>
  );
};
