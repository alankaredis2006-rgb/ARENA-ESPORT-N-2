import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  Users,
  Edit2,
  Check,
  Trophy,
  Target,
  Sparkles,
  Gamepad2,
  Lock,
  KeyRound,
} from 'lucide-react';

export const UserSquadView: React.FC = () => {
  const {
    userSquad,
    updateUserSquadName,
    userRole,
    setUserRole,
    setSelectedRoom,
    rooms,
    addToast,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [squadName, setSquadName] = useState(userSquad.name);
  const [squadTag, setSquadTag] = useState(userSquad.tag);

  const handleSave = () => {
    updateUserSquadName(squadName, squadTag);
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      
      {/* Squad Header Profile */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border border-white/20 p-1 flex items-center justify-center text-3xl sm:text-4xl shadow-xl">
              {userSquad.flag}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={squadName}
                      onChange={(e) => setSquadName(e.target.value)}
                      className="px-3 py-1 rounded-xl glass-input text-base font-bold text-white"
                    />
                    <input
                      type="text"
                      value={squadTag}
                      onChange={(e) => setSquadTag(e.target.value)}
                      className="w-20 px-3 py-1 rounded-xl glass-input text-base font-mono uppercase text-cyan-300"
                    />
                    <button
                      onClick={handleSave}
                      className="p-2 rounded-xl bg-cyan-500 text-white hover:brightness-110"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {userSquad.name}
                    </h2>
                    <span className="px-2 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold">
                      {userSquad.tag}
                    </span>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                      title="Modifier le nom de squad"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>Pays : <strong className="text-white">{userSquad.country}</strong></span>
                <span>·</span>
                <span>Poule : <strong className="text-cyan-300">{userSquad.pool}</strong></span>
                <span>·</span>
                <span>Rang Global : <strong className="text-amber-300">#{userSquad.rank}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Roster Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedRoom(rooms[0])}
              className="py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Voir Clés Room Free Fire</span>
            </button>
          </div>
        </div>
      </div>

      {/* Roster Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Composition de l'Escouade (4 Joueurs)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Identifiants officiels Free Fire synchronisés avec le serveur tournoi.
            </p>
          </div>

          <div className="text-xs text-emerald-400 font-semibold px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            Roster Homologué FFE
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {userSquad.members.map((member) => (
            <div
              key={member.id}
              className="p-5 rounded-3xl glass-card border border-white/10 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {member.role}
                  </span>
                  <span className="text-xs font-mono text-cyan-300 font-bold">
                    {member.kills} Kills
                  </span>
                </div>

                <div className="text-base font-extrabold text-white">
                  {member.name}
                </div>

                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 font-mono text-xs">
                  <span className="text-slate-400 text-[10px] block">Free Fire UID :</span>
                  <span className="text-white font-bold tracking-wider">{member.inGameId}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Rôle Tactique</span>
                <span className="text-slate-300 font-medium">Actif</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
