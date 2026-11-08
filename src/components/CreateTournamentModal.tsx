import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Tournament } from '../types';
import {
  X,
  Trophy,
  ShieldCheck,
  Gamepad2,
  Lock,
  Sparkles,
  AlertCircle,
  Plus,
} from 'lucide-react';

export const CreateTournamentModal: React.FC = () => {
  const {
    isCreateTournamentModalOpen,
    setIsCreateTournamentModalOpen,
    userRole,
    addTournament,
    formatCurrency,
    addToast,
  } = useApp();

  const isAdmin = userRole === 'admin';

  // Form states
  const [tournamentType, setTournamentType] = useState<'official' | 'fun'>(isAdmin ? 'official' : 'fun');
  const [game, setGame] = useState<'Free Fire' | 'PUBG Mobile'>('Free Fire');
  const [title, setTitle] = useState('');
  const [map, setMap] = useState<Tournament['map']>('Bermuda');
  const [maxSquads, setMaxSquads] = useState(12);
  const [cashprizeFcfa, setCashprizeFcfa] = useState(500000);
  const [entryFeeFcfa, setEntryFeeFcfa] = useState(1500);
  const [startTime, setStartTime] = useState('Demain à 19:00 GMT');
  const [description, setDescription] = useState('');

  if (!isCreateTournamentModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      addToast('error', 'Titre Requis', 'Veuillez saisir un titre pour le tournoi.');
      return;
    }

    if (tournamentType === 'official' && !isAdmin) {
      addToast('error', 'Accès Refusé', 'Seul l’administrateur suprême a le droit de publier des tournois officiels avec récompenses en argent.');
      return;
    }

    const isOfficial = tournamentType === 'official' && isAdmin;

    const success = addTournament({
      title: title.trim().toUpperCase(),
      subtitle: isOfficial ? 'Tournoi Officiel Cashprize ARENA' : 'Tournoi Communautaire (Fun · Sans Argent)',
      game,
      isOfficial,
      cashprizeFcfa: isOfficial ? Number(cashprizeFcfa) : 0,
      entryFeeFcfa: isOfficial ? Number(entryFeeFcfa) : 0,
      organizerName: isAdmin ? 'ADMINISTRATION OFFICIELLE ARENA' : 'Capitaine Communauté',
      organizerRole: userRole,
      status: 'upcoming',
      map,
      maxSquads: Number(maxSquads),
      startTime,
      roomsCount: isOfficial ? (Number(maxSquads) >= 48 ? 4 : 2) : 1,
      description: description.trim() || (isOfficial ? 'Tournoi officiel organisé avec arbitrage certifié.' : 'Session amicale d’entraînement pour le fun.'),
      bannerGradient: isOfficial
        ? 'from-cyan-900/60 via-purple-950/60 to-slate-950/80 border-cyan-500/30'
        : 'from-slate-900/80 via-blue-950/40 to-slate-950/80 border-white/10',
    });

    if (success) {
      setIsCreateTournamentModalOpen(false);
      setTitle('');
      setDescription('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-3xl overflow-hidden glass-panel border border-white/15 shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Trophy className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Créer & Publier un Tournoi Free Fire
              </h3>
              <p className="text-xs text-slate-400">
                {isAdmin
                  ? 'Contrôle Administrateur : Tournois Officiels avec Cashprize Réel'
                  : 'Tournoi Communautaire : Pour le Fun & l\'Entraînement (Sans Argent)'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCreateTournamentModalOpen(false)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Tournament Type Selector */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Type de Compétition</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTournamentType('official')}
                disabled={!isAdmin}
                className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                  tournamentType === 'official'
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-white shadow-md shadow-cyan-500/20'
                    : 'bg-white/[0.02] border-white/10 text-slate-400 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-cyan-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Tournoi Officiel
                  </span>
                  {!isAdmin && <Lock className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <span className="text-[10px] text-slate-300">
                  Cashprize en FCFA & frais d'inscription (Exclusif Admin)
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTournamentType('fun')}
                className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                  tournamentType === 'fun'
                    ? 'bg-purple-500/20 border-purple-500/50 text-white shadow-md shadow-purple-500/20'
                    : 'bg-white/[0.02] border-white/10 text-slate-400'
                }`}
              >
                <span className="font-extrabold text-purple-300 flex items-center gap-1.5">
                  <Gamepad2 className="w-4 h-4" />
                  Tournoi Fun
                </span>
                <span className="text-[10px] text-slate-300">
                  100% Gratuit, pour le fun et l'entraînement amical
                </span>
              </button>
            </div>

            {!isAdmin && tournamentType === 'official' && (
              <p className="text-[11px] text-amber-300 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Seul l'administrateur a le droit de publier des tournois officiels avec de l'argent.
              </p>
            )}
          </div>

          {/* Game Selection */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Jeu E-Sport Concerné</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setGame('Free Fire');
                  setMap('Bermuda');
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  game === 'Free Fire'
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                    : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                🔥 Free Fire
              </button>

              <button
                type="button"
                onClick={() => {
                  setGame('PUBG Mobile');
                  setMap('Erangel');
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  game === 'PUBG Mobile'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                🎯 PUBG Mobile
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Titre du Tournoi</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex : ARENA FREE FIRE CLASH CUP"
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white uppercase font-bold"
              required
            />
          </div>

          {/* Map and Squads */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Map Free Fire</label>
              <select
                value={map}
                onChange={(e) => setMap(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
              >
                <option value="Bermuda" className="bg-slate-900">Bermuda</option>
                <option value="Purgatory" className="bg-slate-900">Purgatory</option>
                <option value="Kalahari" className="bg-slate-900">Kalahari</option>
                <option value="Alpine" className="bg-slate-900">Alpine</option>
                <option value="NexTerra" className="bg-slate-900">NexTerra</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Nombre d'Escouades</label>
              <select
                value={maxSquads}
                onChange={(e) => setMaxSquads(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
              >
                <option value={12} className="bg-slate-900">12 Squads (1 Room)</option>
                <option value={24} className="bg-slate-900">24 Squads (2 Rooms)</option>
                <option value={48} className="bg-slate-900">48 Squads (4 Rooms)</option>
                <option value={100} className="bg-slate-900">100 Squads (10 Rooms Majeures)</option>
              </select>
            </div>
          </div>

          {/* Cashprize and Entry Fee (only for official tournaments) */}
          {tournamentType === 'official' && (
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/20">
              <div className="space-y-1.5">
                <label className="text-cyan-300 font-semibold">Cashprize Récompense (FCFA)</label>
                <input
                  type="number"
                  step={50000}
                  value={cashprizeFcfa}
                  onChange={(e) => setCashprizeFcfa(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-xs font-mono font-bold text-amber-300"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Frais Inscription (FCFA)</label>
                <input
                  type="number"
                  step={500}
                  value={entryFeeFcfa}
                  onChange={(e) => setEntryFeeFcfa(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-xs font-mono font-bold text-white"
                />
              </div>
            </div>
          )}

          {/* Start Time */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Date et Heure du Lancement</label>
            <input
              type="text"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              placeholder="Ex : Ce soir à 21:00 GMT"
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Règlement et Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Ex : Mode Battle Royale Squad 500 HP, munitions limitées..."
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white resize-none"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 via-sky-500 to-purple-600 text-white shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Publier le Tournoi dans l'Accueil</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
