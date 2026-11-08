import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Tournament, Room, GameTitle } from '../types';
import { BracketsModal } from './BracketsModal';
import {
  Trophy,
  ShieldCheck,
  Gamepad2,
  Users,
  Flame,
  Clock,
  KeyRound,
  Plus,
  Coins,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Eye,
  Sliders,
  CheckCircle2,
  Swords,
  AlertTriangle,
} from 'lucide-react';

export const TournamentsView: React.FC = () => {
  const {
    tournaments,
    rooms,
    setSelectedRoom,
    formatCurrency,
    userRole,
    userSquad,
    deductBalance,
    openPaymentModal,
    addToast,
    setIsCreateTournamentModalOpen,
    checkInTournament,
    t,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'official' | 'fun' | 'live'>('all');
  const [selectedGame, setSelectedGame] = useState<'all' | GameTitle>('all');
  const [isBracketsOpen, setIsBracketsOpen] = useState(false);

  const isAdmin = userRole === 'admin';

  const filteredTournaments = tournaments.filter((tourn) => {
    // Game filter
    if (selectedGame !== 'all' && tourn.game !== selectedGame) return false;

    // Type filter
    if (activeFilter === 'all') return true;
    if (activeFilter === 'official') return tourn.isOfficial;
    if (activeFilter === 'fun') return !tourn.isOfficial;
    if (activeFilter === 'live') return tourn.status === 'live';
    return true;
  });

  const handleRegisterTournament = (tournament: Tournament) => {
    if (!tournament.isOfficial || tournament.entryFeeFcfa === 0) {
      addToast('success', 'Inscription Gratuite Validée !', `Votre escouade ${userSquad.name} est inscrite au ${tournament.title}.`);
      return;
    }

    const fee = tournament.entryFeeFcfa;
    const success = deductBalance(fee, `Inscription Tournoi — ${tournament.title}`);
    if (!success) {
      openPaymentModal(fee, `Inscription ${tournament.title}`, 'tournament');
    } else {
      addToast('success', 'Place Confirmée !', `Frais de ${formatCurrency(fee)} validés via Nexus Africa / Solde. (Rappel : Frais non remboursables).`);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <Swords className="w-4 h-4" />
            <span>Moteur Compétitif ARENA ESPORT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t('official_tournaments')} & Scrims Fun
          </h2>
          <p className="text-xs text-slate-400">
            {t('only_admin_can_publish')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsBracketsOpen(true)}
            className="py-2.5 px-4 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>{t('view_bracket')}</span>
          </button>

          <button
            onClick={() => setIsCreateTournamentModalOpen(true)}
            className="py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 via-sky-500 to-purple-600 text-white shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{isAdmin ? 'Publier Tournoi Officiel (Admin)' : 'Créer un Scrim Fun'}</span>
          </button>
        </div>
      </div>

      {/* Game Selector (Free Fire & PUBG Mobile) */}
      <div className="flex items-center gap-3 p-1.5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl text-xs overflow-x-auto">
        <span className="text-slate-400 font-semibold px-2">Jeux Prioritaires :</span>
        {[
          { id: 'all', label: 'Tous les Jeux' },
          { id: 'Free Fire', label: '🔥 Free Fire (Rooms 01-10)' },
          { id: 'PUBG Mobile', label: '🎯 PUBG Mobile (Erangel & Miramar)' },
        ].map((g) => (
          <button
            key={g.id}
            onClick={() => setSelectedGame(g.id as any)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              selectedGame === g.id
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Tournaments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTournaments.map((tourn) => {
          const isLive = tourn.status === 'live';
          const isOfficial = tourn.isOfficial;

          return (
            <div
              key={tourn.id}
              className={`rounded-3xl p-6 border transition-all duration-300 backdrop-blur-2xl bg-gradient-to-br ${tourn.bannerGradient} hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col justify-between space-y-4`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-white/10 text-white border border-white/15">
                      {tourn.game}
                    </span>

                    {isOfficial ? (
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-amber-400" />
                        <span>Officiel Admin</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        Fun & Training
                      </span>
                    )}

                    <span className="text-[11px] text-slate-300 font-medium">Map {tourn.map}</span>
                  </div>

                  {isLive ? (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                      <span>LIVE</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400">{tourn.startTime}</span>
                  )}
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {tourn.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {tourn.description}
                  </p>
                </div>

                {/* Financial and Room Metrics */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-black/40 border border-white/5 text-xs text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{t('cashprize')} :</span>
                    <span className={`font-mono font-extrabold text-xs sm:text-sm ${
                      isOfficial ? 'text-amber-300' : 'text-slate-400'
                    }`}>
                      {isOfficial ? formatCurrency(tourn.cashprizeFcfa) : '0 FCFA (Fun)'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">{t('entry_fee')} :</span>
                    <span className="font-mono font-bold text-white text-xs">
                      {isOfficial ? formatCurrency(tourn.entryFeeFcfa) : 'Gratuit'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">{t('slots')} :</span>
                    <span className="font-mono font-bold text-cyan-300 text-xs">
                      {tourn.registeredSquads}/{tourn.maxSquads}
                    </span>
                  </div>
                </div>

                {/* Non-refundable policy alert */}
                {isOfficial && (
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>Politique : {t('non_refundable')} (Validation Nexus Africa côté serveur).</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => handleRegisterTournament(tourn)}
                  className="flex-1 py-2.5 px-3 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>{isOfficial ? t('register') : 'Participer au Scrim'}</span>
                </button>

                {/* Check-in action */}
                <button
                  onClick={() => checkInTournament(tourn.id)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 ${
                    tourn.checkInOpen
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                  }`}
                  title="Confirmer la présence de la squad"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{tourn.checkInOpen ? 'Check-in OK' : 'Check-in'}</span>
                </button>

                {tourn.roomsCount > 0 && (
                  <button
                    onClick={() => setSelectedRoom(rooms[0])}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-colors"
                    title="Accéder aux identifiants secrets de Room"
                  >
                    <KeyRound className="w-4 h-4 text-cyan-400" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Salons en direct (Rooms 01 à 10) */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <span>Salons Privés en Direct (Rooms 01 à 10)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Serveur 500 HP · Identifiant et Mot de passe délivrés aux capitaines autorisés
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {rooms.slice(0, 10).map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRoom(r)}
              className="p-3.5 rounded-2xl glass-card border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-950/20 text-left transition-all group flex flex-col justify-between min-h-[96px]"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-extrabold text-white group-hover:text-cyan-300">
                  {r.name}
                </span>
                {r.status === 'live' && (
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                )}
              </div>

              <div className="text-[11px] text-slate-400">
                Map {r.map}
              </div>

              <div className="text-[10px] font-mono text-cyan-400 font-bold flex items-center gap-1">
                <KeyRound className="w-2.5 h-2.5" />
                <span>Clés Secrètes</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Brackets Modal */}
      <BracketsModal
        isOpen={isBracketsOpen}
        onClose={() => setIsBracketsOpen(false)}
      />

    </div>
  );
};
