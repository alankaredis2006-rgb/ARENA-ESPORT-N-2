import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sliders,
  Users,
  Coins,
  ShieldAlert,
  Radio,
  KeyRound,
  CheckCircle2,
  XCircle,
  FileText,
  Send,
  AlertCircle,
  Check,
  RefreshCw,
  Trophy,
} from 'lucide-react';

export const AdminHubView: React.FC = () => {
  const {
    rooms,
    updateRoomStatus,
    updateRoomCredentials,
    squads,
    updateSquadScore,
    withdrawals,
    approveWithdrawal,
    formatCurrency,
    setBroadcastNotice,
    addToast,
    setIsCreateTournamentModalOpen,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'rooms' | 'withdrawals' | 'users' | 'broadcast'>('rooms');

  // Rooms control state
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0].id);
  const currentRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];
  const [newRoomId, setNewRoomId] = useState(currentRoom.gameRoomId);
  const [newPassword, setNewPassword] = useState(currentRoom.gamePassword);

  // Score injection
  const [scoreSquadId, setScoreSquadId] = useState(squads[0].id);
  const [killsToAdd, setKillsToAdd] = useState(3);
  const [placementToAdd, setPlacementToAdd] = useState(12);

  // Broadcast text
  const [broadcastText, setBroadcastText] = useState(
    '⚡ FLASH ARBITRAGE : Les 12 squads de la Room 01 doivent finaliser leur check-in immédiatement.'
  );

  const handleUpdateCreds = () => {
    updateRoomCredentials(currentRoom.id, newRoomId, newPassword);
  };

  const handleGenerateRandomCreds = () => {
    const randomId = `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-ARENA`;
    const randomPass = `SEC_${Math.random().toString(36).substring(2, 6).toUpperCase()}_2026`;
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
    addToast('success', 'Alerte Flash Diffusée', 'L\'alerte d\'arbitrage est active sur toute la plateforme.');
  };

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Sliders className="w-4 h-4" />
            <span>Panneau de Contrôle Suprême</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Centre de Contrôle Super-Administrateur
          </h2>
          <p className="text-xs text-slate-400">
            Gestion globale des tournois officiels, des retraits Nexus Africa et de l'arbitrage en direct.
          </p>
        </div>

        <button
          onClick={() => setIsCreateTournamentModalOpen(true)}
          className="py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
        >
          <Trophy className="w-4 h-4" />
          <span>Publier un Tournoi Officiel (Cashprize)</span>
        </button>
      </div>

      {/* Admin Sub-Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl text-xs font-semibold overflow-x-auto">
        {[
          { id: 'rooms', label: 'Contrôle des 10 Rooms & Clés', icon: <Radio className="w-3.5 h-3.5" /> },
          { id: 'withdrawals', label: `Demandes de Retraits (${withdrawals.filter((w) => w.status === 'pending').length} en attente)`, icon: <Coins className="w-3.5 h-3.5" /> },
          { id: 'users', label: 'Gestion Utilisateurs & Squads', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'broadcast', label: 'Flash Live & Alertes', icon: <Send className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeAdminTab === tab.id
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: ROOMS CONTROL */}
      {activeAdminTab === 'rooms' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Room Selector */}
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span>Salons (Rooms 01 à 10)</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {rooms.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setSelectedRoomId(r.id);
                    setNewRoomId(r.gameRoomId);
                    setNewPassword(r.gamePassword);
                  }}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                    r.id === selectedRoomId
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                      : 'bg-white/[0.03] border-white/5 text-slate-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <span>{r.name}</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                    r.status === 'live' ? 'text-red-400 bg-red-500/20' : 'text-slate-400'
                  }`}>
                    {r.status.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 space-y-2">
              <span className="text-[11px] text-slate-400 font-semibold block">Changer Statut {currentRoom.name}</span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => updateRoomStatus(currentRoom.id, 'live')}
                  className={`py-2 rounded-xl text-xs font-bold ${
                    currentRoom.status === 'live' ? 'bg-red-500 text-white' : 'bg-white/5 text-slate-400'
                  }`}
                >
                  LIVE
                </button>
                <button
                  onClick={() => updateRoomStatus(currentRoom.id, 'standby')}
                  className={`py-2 rounded-xl text-xs font-bold ${
                    currentRoom.status === 'standby' ? 'bg-amber-500 text-white' : 'bg-white/5 text-slate-400'
                  }`}
                >
                  STANDBY
                </button>
                <button
                  onClick={() => updateRoomStatus(currentRoom.id, 'completed')}
                  className={`py-2 rounded-xl text-xs font-bold ${
                    currentRoom.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-400'
                  }`}
                >
                  TERMINÉ
                </button>
              </div>
            </div>
          </div>

          {/* Credentials Manager */}
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-purple-400" />
                <span>Clés Secrètes ({currentRoom.name})</span>
              </h3>
              <button
                onClick={handleGenerateRandomCreds}
                className="px-2 py-1 rounded-lg bg-purple-500/20 text-purple-300 text-[10px] font-bold flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Générer</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400">Room ID (Free Fire / PUBG)</label>
                <input
                  type="text"
                  value={newRoomId}
                  onChange={(e) => setNewRoomId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input font-mono font-bold text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Mot de Passe Secret</label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input font-mono font-bold text-white"
                />
              </div>

              <button
                onClick={handleUpdateCreds}
                className="w-full py-2.5 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/20 active:scale-95 transition-all"
              >
                Déployer Nouveaux Identifiants
              </button>
            </div>
          </div>

          {/* Points Injector */}
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span>Injection de Points au Classement</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400">Escouade Bénéficiaire</label>
                <select
                  value={scoreSquadId}
                  onChange={(e) => setScoreSquadId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                >
                  {squads.slice(0, 25).map((s) => (
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
                  <label className="text-slate-400">+ Placement</label>
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
                className="w-full py-2.5 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
              >
                Injecter les Scores en Direct
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WITHDRAWALS APPROVAL */}
      {activeAdminTab === 'withdrawals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Coins className="w-4 h-4 text-cyan-400" />
              <span>Demandes de Décaissement Nexus Africa en Attente</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Vérification bancaire & Mobile Money obligatoire
            </span>
          </div>

          <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden divide-y divide-white/5">
            {withdrawals.map((w) => (
              <div key={w.id} className="p-5 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-sm">{formatCurrency(w.amountFcfa)}</span>
                    <span className="text-[10px] px-2 py-0.2 rounded-md bg-white/10 font-mono text-cyan-300">
                      {w.reference}
                    </span>
                  </div>
                  <p className="text-slate-300 mt-0.5">Bénéficiaire : {w.accountDetails}</p>
                  <span className="text-[11px] text-slate-500">{w.date} · Mode {w.method}</span>
                </div>

                <div className="flex items-center gap-2">
                  {w.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => approveWithdrawal(w.id)}
                        className="py-1.5 px-3 rounded-xl bg-emerald-500 text-white font-bold text-xs hover:brightness-110 active:scale-95 transition-all flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Valider Décaissement</span>
                      </button>
                    </>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Décaissement Exécuté
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: USERS & SQUADS */}
      {activeAdminTab === 'users' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <span>Supervision des 100 Squads & Sanctions</span>
          </h3>

          <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between text-xs text-slate-400">
              <span>Escouades sous surveillance Anti-Cheat V2</span>
              <span>100 Escouades Homologuées</span>
            </div>

            <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
              {squads.slice(0, 15).map((s) => (
                <div key={s.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{s.flag}</span>
                    <div>
                      <span className="font-bold text-white">{s.name} ({s.tag})</span>
                      <span className="text-[11px] text-slate-400 block">Capitaine : {s.captainName} · {s.pool}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => addToast('success', 'Squad Vérifiée', `${s.name} a reçu le badge certifié.`)}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold"
                    >
                      Certifier
                    </button>
                    <button
                      onClick={() => addToast('warning', 'Avertissement Envoyé', `Avertissement notifié au capitaine de ${s.name}.`)}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[11px] font-bold"
                    >
                      Avertir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BROADCAST */}
      {activeAdminTab === 'broadcast' && (
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-cyan-400" />
            <span>Diffuser une Alerte Flash Arbitre</span>
          </h3>

          <div className="space-y-3">
            <textarea
              value={broadcastText}
              onChange={(e) => setBroadcastText(e.target.value)}
              rows={3}
              className="w-full p-3.5 rounded-2xl glass-input text-xs text-white"
            />
            <button
              onClick={handleSendBroadcast}
              className="py-2.5 px-5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
            >
              Diffuser Immédiatement sur Toute la Plateforme
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
