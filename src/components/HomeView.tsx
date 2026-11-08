import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Tournament, Room } from '../types';
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
} from 'lucide-react';

export const HomeView: React.FC = () => {
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
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'official' | 'fun' | 'live'>('all');

  const isAdmin = userRole === 'admin';

  const filteredTournaments = tournaments.filter((t) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'official') return t.isOfficial;
    if (activeFilter === 'fun') return !t.isOfficial;
    if (activeFilter === 'live') return t.status === 'live';
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
      addToast('success', 'Place Confirmée !', `Votre slot pour le tournoi officiel est réservé. Clés Free Fire accessibles dans vos rooms.`);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Hero Welcome & Tournament Spotlight */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/20 via-purple-500/15 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>ARENA E-SPORT · HUB TOURNOIS OFFICIELS & COMMUNAUTAIRES</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Arène Mondiale de Tournois Free Fire{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
                Cashprizes & Scrims Fun
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Consultez tous les tournois officiels avec récompenses en cash garanties publiés par l'administrateur, ou participez aux tournois funs amicals créés par la communauté.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-white">Cashprizes Officiels :</span>
                <span className="font-bold text-amber-300 tabular-nums">3 250 000 FCFA</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-white">100 Escouades</span>
                <span className="text-slate-400">en compétition</span>
              </div>
            </div>
          </div>

          {/* Quick Publish CTA based on Role */}
          <div className="p-5 rounded-2xl glass-card border border-white/10 flex flex-col gap-3 min-w-[280px]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Panneau d'Organisation</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${
                isAdmin ? 'text-amber-300 bg-amber-950/60 border-amber-500/30' : 'text-cyan-300 bg-cyan-950/60 border-cyan-500/30'
              }`}>
                {isAdmin ? 'Plein Contrôle Admin' : 'Mode Joueur'}
              </span>
            </div>

            <p className="text-xs text-slate-300">
              {isAdmin
                ? 'En tant que Super Administrateur, vous seul avez le pouvoir de publier des tournois officiels avec cashprizes en argent réel.'
                : 'Les joueurs peuvent organiser des tournois funs et des scrims d\'entraînement sans argent.'}
            </p>

            <button
              onClick={() => setIsCreateTournamentModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 via-sky-500 to-purple-600 text-white shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{isAdmin ? 'Créer un Tournoi Officiel (Admin)' : 'Organiser un Scrim Fun'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tournaments Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Tournois Disponibles & En Cours
          </h2>
          <p className="text-xs text-slate-400">
            Filtrez les compétitions officielles de l'administration et les scrims funs.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl text-xs overflow-x-auto">
          {[
            { id: 'all', label: `Tous (${tournaments.length})` },
            { id: 'official', label: 'Officiels Cashprize' },
            { id: 'fun', label: 'Tournois Fun' },
            { id: 'live', label: 'En Direct (Live)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1.5 font-semibold rounded-xl transition-all whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tournaments List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTournaments.map((tourn) => {
          const isLive = tourn.status === 'live';
          const isOfficial = tourn.isOfficial;

          return (
            <div
              key={tourn.id}
              className={`rounded-3xl p-6 border transition-all duration-300 backdrop-blur-2xl bg-gradient-to-br ${tourn.bannerGradient} hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col justify-between space-y-4`}
            >
              <div className="space-y-3">
                {/* Badges */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isOfficial ? (
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>Tournoi Officiel Admin</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase flex items-center gap-1.5">
                        <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
                        <span>Tournoi Fun Communautaire</span>
                      </span>
                    )}

                    <span className="text-[11px] font-semibold text-slate-300">
                      Map {tourn.map}
                    </span>
                  </div>

                  {isLive ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-bold">
                      <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                      <span>LIVE EN COURS</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/5 text-slate-400 text-[10px] font-medium">
                      <Clock className="w-3 h-3" />
                      <span>{tourn.startTime}</span>
                    </div>
                  )}
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight">
                    {tourn.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {tourn.description}
                  </p>
                </div>

                {/* Financial and Room Metrics */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-black/40 border border-white/5 text-xs text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Récompense Cash :</span>
                    <span className={`font-mono font-extrabold text-sm ${
                      isOfficial ? 'text-amber-300' : 'text-slate-400'
                    }`}>
                      {isOfficial ? formatCurrency(tourn.cashprizeFcfa) : 'Pour le Fun'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">Frais Inscription :</span>
                    <span className="font-mono font-bold text-white text-xs">
                      {isOfficial ? formatCurrency(tourn.entryFeeFcfa) : '100% Gratuit'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Slots Squads :</span>
                    <span className="font-mono font-bold text-cyan-300 text-xs">
                      {tourn.registeredSquads}/{tourn.maxSquads}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => handleRegisterTournament(tourn)}
                  className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>{isOfficial ? 'S\'inscrire au Tournoi' : 'Rejoindre le Scrim'}</span>
                </button>

                {tourn.roomsCount > 1 && (
                  <button
                    onClick={() => setSelectedRoom(rooms[0])}
                    className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                    title="Voir les Rooms associées"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Rooms ({tourn.roomsCount})</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Rooms 01 to 10 Quick Carousel / Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <span>Salons Free Fire Officiels (Rooms 01 à 10)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Accédez directement aux identifiants secrets de Room et aux scores en temps réel.
            </p>
          </div>

          <span className="text-xs text-emerald-400 font-semibold px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            Serveur 500 HP Actif
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
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

    </div>
  );
};
