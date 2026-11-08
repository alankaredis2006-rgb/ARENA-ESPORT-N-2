import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Room } from '../types';
import {
  X,
  KeyRound,
  Copy,
  Check,
  ShieldAlert,
  Flame,
  Trophy,
  ExternalLink,
  Lock,
  Unlock,
  Radio,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface Props {
  room: Room;
  onClose: () => void;
}

export const RoomDetailModal: React.FC<Props> = ({ room, onClose }) => {
  const { userRole, activeSubscriptionId, addToast, updateRoomCredentials } = useApp();

  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [activeTab, setActiveTab] = useState<'credentials' | 'scoreboard' | 'killfeed'>('credentials');

  // Can access if Captain, Admin, or Elite/Pro Pass
  const isAuthorized = userRole === 'captain' || userRole === 'admin' || activeSubscriptionId !== 'sub_challenger';

  const [editRoomId, setEditRoomId] = useState(room.gameRoomId);
  const [editPassword, setEditPassword] = useState(room.gamePassword);
  const [isEditingCredentials, setIsEditingCredentials] = useState(false);

  const copyToClipboard = (text: string, type: 'id' | 'pass') => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
      addToast('info', 'ID Copié', 'Identifiant Free Fire copié dans le presse-papier.');
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
      addToast('info', 'Mot de Passe Copié', 'Code secret de la Room copié.');
    }
  };

  const handleSaveCredentials = () => {
    updateRoomCredentials(room.id, editRoomId, editPassword);
    setIsEditingCredentials(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl overflow-hidden glass-panel border border-white/15 shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 font-extrabold text-sm border border-cyan-500/30">
              {room.name}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {room.title}
              </h2>
              <p className="text-xs text-slate-400">
                Map : <strong className="text-slate-200">{room.map}</strong> · {room.stage}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-white/5 bg-slate-950/40">
          {[
            { id: 'credentials', label: 'Identifiants Secrets (Free Fire)', icon: <KeyRound className="w-3.5 h-3.5" /> },
            { id: 'scoreboard', label: 'Tableau des Scores Live', icon: <Trophy className="w-3.5 h-3.5" /> },
            { id: 'killfeed', label: 'Flux Kills Live', icon: <Flame className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-cyan-400 text-cyan-300 bg-white/[0.03]'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* TAB 1: Free Fire Secret Credentials */}
          {activeTab === 'credentials' && (
            <div className="space-y-6">
              
              {/* Access Status Banner */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                isAuthorized
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
              }`}>
                <div className="flex items-center gap-3">
                  {isAuthorized ? (
                    <Unlock className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <Lock className="w-5 h-5 text-amber-400 shrink-0" />
                  )}
                  <div>
                    <h4 className="text-sm font-bold">
                      {isAuthorized
                        ? 'Accès Capitaine Autorisé · Identifiants Secrets Déverrouillés'
                        : 'Accès Réservé aux Capitaines Inscrits & Pass Pro'}
                    </h4>
                    <p className="text-xs text-slate-300">
                      {isAuthorized
                        ? 'Veuillez ne jamais partager ces clés hors de votre escouade sous peine de disqualification.'
                        : 'Basculez votre rôle en Capitaine ou Arbitre pour inspecter immédiatement les clés.'}
                    </p>
                  </div>
                </div>

                {userRole === 'admin' && (
                  <button
                    onClick={() => setIsEditingCredentials(!isEditingCredentials)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-amber-500/30 transition-colors"
                  >
                    {isEditingCredentials ? 'Annuler' : 'Modifier Clés'}
                  </button>
                )}
              </div>

              {/* Secret Credentials Cards */}
              {isAuthorized ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Game Room ID Card */}
                  <div className="p-5 rounded-2xl glass-card border border-cyan-500/30 bg-cyan-950/20 space-y-2">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      Identifiant Salon Free Fire (Room ID)
                    </span>
                    {isEditingCredentials ? (
                      <input
                        type="text"
                        value={editRoomId}
                        onChange={(e) => setEditRoomId(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl glass-input text-sm font-mono text-white"
                      />
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black font-mono tracking-widest text-white">
                          {room.gameRoomId}
                        </span>
                        <button
                          onClick={() => copyToClipboard(room.gameRoomId, 'id')}
                          className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
                        >
                          {copiedId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId ? 'Copié' : 'Copier'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Game Password Card */}
                  <div className="p-5 rounded-2xl glass-card border border-purple-500/30 bg-purple-950/20 space-y-2">
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                      Mot de Passe Secret (Room Password)
                    </span>
                    {isEditingCredentials ? (
                      <input
                        type="text"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl glass-input text-sm font-mono text-white"
                      />
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black font-mono tracking-widest text-white">
                          {room.gamePassword}
                        </span>
                        <button
                          onClick={() => copyToClipboard(room.gamePassword, 'pass')}
                          className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
                        >
                          {copiedPass ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedPass ? 'Copié' : 'Copier'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditingCredentials && (
                    <div className="sm:col-span-2 flex justify-end">
                      <button
                        onClick={handleSaveCredentials}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-xs text-white shadow-lg shadow-cyan-500/20"
                      >
                        Enregistrer les Nouveaux Identifiants
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 rounded-2xl glass-card border border-white/10 text-center space-y-3">
                  <Lock className="w-8 h-8 text-amber-400 mx-auto" />
                  <h4 className="text-base font-bold text-white">
                    Identifiants Masqués
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Pour déverrouiller le Room ID et le Mot de Passe Free Fire, connectez-vous avec un compte Capitaine ou activez votre Pro Squad Pass.
                  </p>
                </div>
              )}

              {/* Free Fire Server Config Specifications */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Paramètres Serveur Free Fire Officiel
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="text-slate-400">Mode de Jeu</span>
                    <p className="font-bold text-white">Battle Royale Squad</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="text-slate-400">Points de Vie (HP)</span>
                    <p className="font-bold text-cyan-300">500 HP</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="text-slate-400">Munitions Limitées</span>
                    <p className="font-bold text-amber-300">Oui (Compétitif)</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="text-slate-400">Système Arbitrage</span>
                    <p className="font-bold text-emerald-300">Anti-Cheat V2</p>
                  </div>
                </div>
              </div>

              {/* Joining Guide */}
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-slate-300 space-y-2">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Guide pour rejoindre le lobby Free Fire :
                </span>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1">
                  <li>Ouvrez l’application <strong>Free Fire</strong> sur votre mobile ou tablette.</li>
                  <li>Dans le sélecteur de mode, cliquez sur <strong>Personnalisé (Custom Room)</strong>.</li>
                  <li>Recherchez le <strong>Room ID</strong> ci-dessus et entrez le <strong>Mot de passe</strong>.</li>
                  <li>Prenez place dans l’emplacement de slot assigné à votre escouade.</li>
                </ol>
              </div>

            </div>
          )}

          {/* TAB 2: Live Scoreboard */}
          {activeTab === 'scoreboard' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Classement en direct de la Room</span>
                <span>Règle : 1 Kill = 1 Pt · Top 1 = 12 Pts</span>
              </div>

              {room.scoreboard.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 font-semibold">
                        <th className="py-2.5 px-3">Rang</th>
                        <th className="py-2.5 px-3">Escouade</th>
                        <th className="py-2.5 px-3 text-center">Statut</th>
                        <th className="py-2.5 px-3 text-right">Kills</th>
                        <th className="py-2.5 px-3 text-right">Placement</th>
                        <th className="py-2.5 px-3 text-right font-bold text-white">Total Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {room.scoreboard.map((entry) => (
                        <tr key={entry.rank} className="hover:bg-white/[0.03] transition-colors">
                          <td className="py-2.5 px-3 font-bold font-mono">
                            {entry.rank === 1 ? '🥇 1' : entry.rank === 2 ? '🥈 2' : entry.rank === 3 ? '🥉 3' : `#${entry.rank}`}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-white">
                            <div className="flex items-center gap-2">
                              <span>{entry.squadName}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                                {entry.squadTag}
                              </span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {entry.isAlive ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                En Vie
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400">
                                Éliminée
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-cyan-300">{entry.kills}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-300">{entry.placementPts}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-white text-sm">
                            {entry.totalPts}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Le match n'a pas encore débuté. Le tableau des scores s'actualisera en direct dès le lancement.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Kill Feed */}
          {activeTab === 'killfeed' && (
            <div className="space-y-3">
              <span className="text-xs text-slate-400">Événements d'éliminations enregistrés par l'Anti-Cheat :</span>
              {room.killsFeed.length > 0 ? (
                <div className="space-y-2">
                  {room.killsFeed.map((kf) => (
                    <div
                      key={kf.id}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 font-mono text-slate-400 text-[11px]">
                        <span>[{kf.timestamp}]</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-cyan-300">{kf.killer}</span>
                        <span className="text-[10px] text-slate-400">({kf.killerSquad})</span>
                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-mono text-[10px] border border-red-500/30">
                          {kf.weapon}
                        </span>
                        <span className="text-slate-400">a éliminé</span>
                        <span className="font-semibold text-white">{kf.victim}</span>
                        <span className="text-[10px] text-slate-400">({kf.victimSquad})</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Aucune élimination pour le moment.
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950/60 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Room ID : <span className="font-mono text-white">{room.gameRoomId}</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
