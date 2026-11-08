import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sliders,
  Radio,
  KeyRound,
  Trophy,
  Send,
  Plus,
  RefreshCw,
  Check,
  ShieldAlert,
} from 'lucide-react';

export const AdminConsoleModal: React.FC = () => {
  const {
    rooms,
    updateRoomStatus,
    updateRoomCredentials,
    squads,
    updateSquadScore,
    setBroadcastNotice,
    addToast,
  } = useApp();

  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0].id);
  const currentRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];

  const [newRoomId, setNewRoomId] = useState(currentRoom.gameRoomId);
  const [newPassword, setNewPassword] = useState(currentRoom.gamePassword);

  const [scoreSquadId, setScoreSquadId] = useState(squads[0].id);
  const [killsToAdd, setKillsToAdd] = useState(3);
  const [placementToAdd, setPlacementToAdd] = useState(12);

  const [broadcastText, setBroadcastText] = useState(
    '⚡ RAPPEL ARBITRAGE : Tous les capitaines de la Room 02 doivent rejoindre le lobby Free Fire sous 5 minutes.'
  );

  const handleUpdateCreds = () => {
    updateRoomCredentials(currentRoom.id, newRoomId, newPassword);
  };

  const handleGenerateRandomCreds = () => {
    const randomId = `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-FF`;
    const randomPass = `ARENA_${Math.random().toString(36).substring(2, 6).toUpperCase()}_${currentRoom.number}`;
    setNewRoomId(randomId);
    setNewPassword(randomPass);
    updateRoomCredentials(currentRoom.id, randomId, randomPass);
  };

  const handleInjectScore = () => {
    updateSquadScore(scoreSquadId, Number(killsToAdd), Number(placementToAdd));
  };

  const handleSendBroadcast = () => {
    if (!broadcastText.trim()) return;
    setBroadcastNotice(broadcastText);
    addToast('success', 'Alerte Flash Diffusée', 'Le message d’arbitrage a été diffusé en direct sur toute la plateforme.');
  };

  return (
    <div className="space-y-8">
      
      {/* Admin Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Sliders className="w-4 h-4" />
            <span>Console Officielle d'Arbitrage & Contrôle</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Gestion des 10 Rooms & Injection de Scores
          </h2>
          <p className="text-xs text-slate-400">
            Réservé aux arbitres et administrateurs tournoi pour la supervision en direct.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Session Arbitre Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COL 1: Room Selector & Status Controller */}
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>Sélectionner la Room (01–10)</span>
          </h3>

          <div className="grid grid-cols-2 gap-2">
            {rooms.map((r) => {
              const isSelected = r.id === selectedRoomId;
              return (
                <button
                  key={r.id}
                  onClick={() => {
                    setSelectedRoomId(r.id);
                    setNewRoomId(r.gameRoomId);
                    setNewPassword(r.gamePassword);
                  }}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-md shadow-cyan-500/15'
                      : 'bg-white/[0.03] border-white/5 text-slate-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <span>{r.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    r.status === 'live' ? 'text-red-400 bg-red-500/20' : 'text-slate-400'
                  }`}>
                    {r.status.toUpperCase()}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/10 space-y-2">
            <label className="text-xs font-semibold text-slate-400">
              Changer le Statut de {currentRoom.name}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => updateRoomStatus(currentRoom.id, 'live')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                  currentRoom.status === 'live'
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                LIVE
              </button>
              <button
                onClick={() => updateRoomStatus(currentRoom.id, 'standby')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                  currentRoom.status === 'standby'
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                STANDBY
              </button>
              <button
                onClick={() => updateRoomStatus(currentRoom.id, 'completed')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                  currentRoom.status === 'completed'
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                TERMINÉ
              </button>
            </div>
          </div>
        </div>

        {/* COL 2: Free Fire Credentials Regenerator */}
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-purple-400" />
              <span>Clés Free Fire ({currentRoom.name})</span>
            </h3>

            <button
              onClick={handleGenerateRandomCreds}
              className="px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-bold flex items-center gap-1 hover:bg-purple-500/30"
              title="Générer de nouvelles clés aléatoires"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Générer</span>
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400">Room ID (Serveur Free Fire)</label>
              <input
                type="text"
                value={newRoomId}
                onChange={(e) => setNewRoomId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input font-mono font-bold text-white text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">Mot de Passe Secret</label>
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input font-mono font-bold text-white text-sm"
              />
            </div>

            <button
              onClick={handleUpdateCreds}
              className="w-full py-2.5 px-4 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/20 hover:brightness-110 active:scale-95 transition-all"
            >
              Sauvegarder & Déployer les Clés
            </button>
          </div>
        </div>

        {/* COL 3: Live Score Injector & Flash Broadcast */}
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span>Injection de Points Squad</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400">Escouade à Créditer</label>
              <select
                value={scoreSquadId}
                onChange={(e) => setScoreSquadId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
              >
                {squads.slice(0, 30).map((s) => (
                  <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                    {s.name} ({s.tag}) — #{s.rank}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-slate-400">+ Kills</label>
                <input
                  type="number"
                  value={killsToAdd}
                  onChange={(e) => setKillsToAdd(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl glass-input font-mono text-center font-bold text-cyan-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">+ Pts Placement</label>
                <input
                  type="number"
                  value={placementToAdd}
                  onChange={(e) => setPlacementToAdd(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl glass-input font-mono text-center font-bold text-emerald-300"
                />
              </div>
            </div>

            <button
              onClick={handleInjectScore}
              className="w-full py-2.5 px-4 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all"
            >
              Injecter dans le Leaderboard
            </button>
          </div>
        </div>

      </div>

      {/* Broadcast Flash Notice Creator */}
      <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Send className="w-4 h-4 text-cyan-400" />
          <span>Diffuser un Flash Live d'Arbitrage</span>
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={broadcastText}
            onChange={(e) => setBroadcastText(e.target.value)}
            placeholder="Message urgent à afficher dans la bannière globale..."
            className="flex-1 px-4 py-2.5 rounded-xl glass-input text-xs text-white"
          />
          <button
            onClick={handleSendBroadcast}
            className="py-2.5 px-5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95 shrink-0"
          >
            Diffuser en Direct
          </button>
        </div>
      </div>

    </div>
  );
};
