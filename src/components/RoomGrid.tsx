import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Room, RoomStatus } from '../types';
import {
  Users,
  Eye,
  KeyRound,
  Trophy,
  Flame,
  Clock,
  Swords,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const RoomGrid: React.FC = () => {
  const {
    rooms,
    setSelectedRoom,
    userRole,
    userSquad,
    deductBalance,
    openPaymentModal,
    addToast,
    formatCurrency,
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'live' | 'standby' | 'completed'>('all');

  const filteredRooms = rooms.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const getMapGradient = (map: Room['map']) => {
    switch (map) {
      case 'Bermuda':
        return 'from-emerald-950/60 via-teal-900/40 to-slate-900/80 border-emerald-500/20';
      case 'Purgatory':
        return 'from-amber-950/60 via-orange-900/40 to-slate-900/80 border-amber-500/20';
      case 'Kalahari':
        return 'from-yellow-950/60 via-amber-900/40 to-slate-900/80 border-yellow-500/20';
      case 'Alpine':
        return 'from-cyan-950/60 via-blue-900/40 to-slate-900/80 border-cyan-500/20';
      case 'NexTerra':
        return 'from-purple-950/60 via-indigo-900/40 to-slate-900/80 border-purple-500/20';
      default:
        return 'from-slate-900/70 via-slate-800/40 to-slate-900/80 border-white/10';
    }
  };

  const handleRegisterSquad = () => {
    const fee = 2500;
    const success = deductBalance(fee, `Inscription Tournoi — ${userSquad.name}`);
    if (!success) {
      openPaymentModal(fee, `Inscription Tournoi — ${userSquad.name}`, 'tournament');
    } else {
      addToast('success', 'Squad Enregistrée !', `${userSquad.name} est officiellement inscrite aux qualifications Room 03 & 04.`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Tournament Hero Banner (iOS Liquid Glass style) */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/15 via-purple-500/15 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 left-10 w-72 h-72 bg-gradient-to-tr from-blue-600/15 to-transparent rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>FREE FIRE CHAMPIONS LEAGUE · SAISON 2026</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              100 Squads en Compétition dans les{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
                10 Rooms Officielles
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Arène mondiale e-sport avec serveur Free Fire 500 HP, système anti-triche V2 et accès exclusif aux identifiants secrets de Room pour les capitaines et joueurs accrédités.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-white">Cashprize Global :</span>
                <span className="font-bold text-amber-300 tabular-nums">2 500 000 FCFA</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-white">100 Escouades</span>
                <span className="text-slate-400">(400 Joueurs)</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span className="text-slate-300">Anti-Cheat Verifié</span>
              </div>
            </div>
          </div>

          {/* Quick Action Box */}
          <div className="p-5 rounded-2xl glass-card border border-white/10 flex flex-col gap-3 min-w-[280px]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Votre Escouade</span>
              <span className="text-[11px] font-bold text-cyan-300 px-2 py-0.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30">
                {userSquad.tag}
              </span>
            </div>

            <div className="text-sm font-bold text-white truncate">
              {userSquad.name}
            </div>

            <div className="text-xs text-slate-400">
              Frais d'accès : <span className="text-slate-200 font-semibold">{formatCurrency(2500)}</span> / tournoi
            </div>

            <button
              onClick={handleRegisterSquad}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 via-sky-500 to-purple-600 text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Inscrire mon Escouade</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Rooms de Tournoi (01 à 10)
          </h2>
          <p className="text-xs text-slate-400">
            Suivi des matchs en direct, statuts des salons et délivrance des identifiants Free Fire.
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-xl">
          {[
            { id: 'all', label: `Toutes (${rooms.length})` },
            { id: 'live', label: `En Direct (${rooms.filter((r) => r.status === 'live').length})` },
            { id: 'standby', label: `En Attente (${rooms.filter((r) => r.status === 'standby').length})` },
            { id: 'completed', label: `Terminées (${rooms.filter((r) => r.status === 'completed').length})` },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                filter === item.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Rooms 01 to 10 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRooms.map((room) => {
          const isLive = room.status === 'live';
          const isStandby = room.status === 'standby';
          const isCompleted = room.status === 'completed';

          return (
            <div
              key={room.id}
              className={`group relative rounded-3xl p-5 border transition-all duration-300 backdrop-blur-xl ${getMapGradient(
                room.map
              )} hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 flex flex-col justify-between`}
            >
              {/* Header of Card */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-xl text-xs font-extrabold tracking-wider bg-white/10 text-white border border-white/15">
                      {room.name}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      Map {room.map}
                    </span>
                  </div>

                  {/* Status Indicator */}
                  {isLive && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-bold">
                      <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                      <span>LIVE</span>
                    </div>
                  )}
                  {isStandby && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
                      <Clock className="w-3 h-3" />
                      <span>{room.scheduledTime}</span>
                    </div>
                  )}
                  {isCompleted && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                      <Trophy className="w-3 h-3 text-amber-400" />
                      <span>Terminé</span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {room.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {room.stage}
                  </p>
                </div>

                {/* Info Bar */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-black/30 border border-white/5 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>
                      {room.totalSquads}/{room.maxSquads} Escouades
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    {isLive ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-red-400" />
                        <span className="font-semibold text-white tabular-nums">
                          {room.liveViewers?.toLocaleString('fr-FR')} spect.
                        </span>
                      </>
                    ) : (
                      <span className="text-slate-400">Battle Royale</span>
                    )}
                  </div>
                </div>

                {/* Live Kill Ticker snippet if Live */}
                {isLive && room.killsFeed.length > 0 && (
                  <div className="p-2 rounded-xl bg-red-950/30 border border-red-500/20 text-[11px] flex items-center gap-2 text-slate-300 overflow-hidden">
                    <Flame className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span className="truncate">
                      <strong className="text-cyan-300">{room.killsFeed[0].killer}</strong> ({room.killsFeed[0].weapon}){' '}
                      <span className="text-slate-400">a éliminé</span> {room.killsFeed[0].victim}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center gap-2 mt-4">
                <button
                  onClick={() => setSelectedRoom(room)}
                  className="flex-1 py-2.5 px-3 rounded-xl font-bold text-xs bg-white/10 hover:bg-cyan-500/20 text-white hover:text-cyan-200 border border-white/10 hover:border-cyan-500/40 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Identifiants & Scores</span>
                </button>

                <button
                  onClick={() => setSelectedRoom(room)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                  title="Détails du match"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
