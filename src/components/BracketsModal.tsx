import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Trophy,
  Swords,
  CheckCircle2,
  Clock,
  Radio,
  Flame,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const BracketsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { bracketNodes, t } = useApp();

  if (!isOpen) return null;

  const rounds = ['Quarts de Finale', 'Demi-Finales', 'Grande Finale'] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-in fade-in">
      <div className="relative w-full max-w-4xl rounded-3xl overflow-hidden glass-panel border border-white/15 shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Swords className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {t('view_bracket')} — Phase Finale Free Fire & PUBG
              </h3>
              <p className="text-xs text-slate-400">
                Arbre éliminatoire en direct avec validation automatique des scores
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Brackets Content Grid */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rounds.map((roundName) => {
              const nodesInRound = bracketNodes.filter((n) => n.round === roundName);

              return (
                <div key={roundName} className="space-y-4">
                  <div className="text-center p-2 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-300">
                      {roundName}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {nodesInRound.map((node) => {
                      const isLive = node.status === 'live';
                      const isCompleted = node.status === 'completed';

                      return (
                        <div
                          key={node.id}
                          className={`p-4 rounded-2xl border transition-all ${
                            isLive
                              ? 'bg-cyan-950/40 border-cyan-500/50 shadow-lg shadow-cyan-500/15'
                              : 'glass-card border-white/10'
                          } space-y-2.5`}
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                            <span>Match #{node.matchNumber}</span>
                            {isLive && (
                              <span className="text-red-400 font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                                EN DIRECT
                              </span>
                            )}
                            {isCompleted && (
                              <span className="text-emerald-400 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                VALIDÉ
                              </span>
                            )}
                          </div>

                          {/* Team A */}
                          <div
                            className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                              node.teamA.isWinner
                                ? 'bg-emerald-950/40 border-emerald-500/40 text-white font-bold'
                                : 'bg-black/30 border-white/5 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span>{node.teamA.name}</span>
                              <span className="text-[10px] px-1 py-0.2 rounded bg-white/10 text-slate-300 font-mono">
                                {node.teamA.tag}
                              </span>
                            </div>
                            <span className="font-mono font-bold">{node.teamA.score}</span>
                          </div>

                          {/* Team B */}
                          <div
                            className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                              node.teamB.isWinner
                                ? 'bg-emerald-950/40 border-emerald-500/40 text-white font-bold'
                                : 'bg-black/30 border-white/5 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span>{node.teamB.name}</span>
                              <span className="text-[10px] px-1 py-0.2 rounded bg-white/10 text-slate-300 font-mono">
                                {node.teamB.tag}
                              </span>
                            </div>
                            <span className="font-mono font-bold">{node.teamB.score}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Gestionnaire automatique des rencontres ARENA ESPORT</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
