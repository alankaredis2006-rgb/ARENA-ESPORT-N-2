import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Trophy,
  Crown,
  Flame,
  Award,
  Users,
  Search,
  Sparkles,
  Shield,
  Star,
  Gamepad2,
} from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { squads, t, formatCurrency } = useApp();
  const [gameFilter, setGameFilter] = useState<'all' | 'Free Fire' | 'PUBG Mobile'>('all');
  const [season, setSeason] = useState<'s2' | 's1'>('s2');

  const topSquads = squads.slice(0, 10);

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Trophy className="w-4 h-4" />
            <span>Classements Officiels & Panthéon</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Classement Mondial & Hall of Fame
          </h2>
          <p className="text-xs text-slate-400">
            Scores officiels homologués par l'administration sur Free Fire et PUBG Mobile.
          </p>
        </div>

        {/* Season & Game Selectors */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-1 rounded-2xl bg-slate-900/80 border border-white/10 text-xs font-semibold">
            <button
              onClick={() => setSeason('s2')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                season === 's2'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Saison 2 (En Cours)
            </button>
            <button
              onClick={() => setSeason('s1')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                season === 's1'
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Saison 1 (Archives)
            </button>
          </div>

          <div className="flex items-center p-1 rounded-2xl bg-slate-900/80 border border-white/10 text-xs font-semibold">
            {['all', 'Free Fire', 'PUBG Mobile'].map((g) => (
              <button
                key={g}
                onClick={() => setGameFilter(g as any)}
                className={`px-2.5 py-1.5 rounded-xl transition-all ${
                  gameFilter === g
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {g === 'all' ? 'Tous Jeux' : g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MVP Spotlight Banner (Feature 10: Most Valuable Player) */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-slate-900/80 p-6 sm:p-7 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-500/30 to-purple-500/30 border border-amber-500/40 p-1 flex items-center justify-center text-3xl shadow-xl shadow-amber-500/20">
              👑
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  MVP TOURNOI ACTUEL
                </span>
                <span className="text-xs text-slate-300">Free Fire Champions League</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white">
                Kapt-Vampire (Libreville Wolves)
              </h3>

              <div className="flex items-center gap-3 text-xs text-slate-300">
                <span className="text-cyan-300 font-bold">14 Kills en 1 Room</span>
                <span>·</span>
                <span className="text-amber-300 font-bold">26 Pts de Performance</span>
                <span>·</span>
                <span className="text-slate-400">Arme favorite : AWM Sniper</span>
              </div>
            </div>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-black/40 border border-white/10 text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Récompense MVP</span>
            <span className="text-lg font-black text-amber-300 font-mono">+100 000 FCFA</span>
          </div>
        </div>
      </div>

      {/* Hall of Fame & Legends (Feature 11) */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Crown className="w-4 h-4 text-purple-400" />
          <span>Hall of Fame ARENA ESPORT — Les Légendes Sacrées</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: 'Abidjan Immortals', title: 'Champions Saison 1 Free Fire', flag: '🇨🇮', record: '4 Victoires Majeures consécutives', date: 'Oct 2026' },
            { name: 'Dakar Cyber Apex', title: 'Record Mondial de Kills (68 Kills)', flag: '🇸🇳', record: 'MVP : Ghost_Alpha', date: 'Sept 2026' },
            { name: 'Yaoundé Titans', title: 'Vainqueur Coupe d’Afrique PUBG', flag: '🇨🇲', record: 'Invaincus sur Erangel 500 HP', date: 'Août 2026' },
          ].map((legend, i) => (
            <div key={i} className="p-5 rounded-3xl glass-card border border-purple-500/20 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-2xl leading-none">{legend.flag}</span>
                <span className="text-[10px] font-mono text-purple-300 px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30">
                  {legend.date}
                </span>
              </div>
              <h4 className="font-extrabold text-white text-sm">{legend.name}</h4>
              <p className="text-xs text-amber-300 font-semibold">{legend.title}</p>
              <p className="text-[11px] text-slate-400">{legend.record}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top 10 Leaderboard Table */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-cyan-400" />
          <span>Top 10 Mondial — Saison 2</span>
        </h3>

        <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-bold uppercase text-[11px]">
                <th className="py-3.5 px-4">Rang</th>
                <th className="py-3.5 px-4">Escouade</th>
                <th className="py-3.5 px-4">Pays</th>
                <th className="py-3.5 px-4 text-center">Matchs</th>
                <th className="py-3.5 px-4 text-right">Kills</th>
                <th className="py-3.5 px-4 text-right">Placement</th>
                <th className="py-3.5 px-4 text-right font-bold text-white">Score Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {topSquads.map((squad) => (
                <tr key={squad.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold">
                    {squad.rank === 1 ? '🥇 1' : squad.rank === 2 ? '🥈 2' : squad.rank === 3 ? '🥉 3' : `#${squad.rank}`}
                  </td>
                  <td className="py-3 px-4 font-bold text-white">
                    <div className="flex items-center gap-2">
                      <span>{squad.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-cyan-300 font-mono">
                        {squad.tag}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-1.5">
                      <span>{squad.flag}</span>
                      <span>{squad.country}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-slate-300">{squad.matchesPlayed}</td>
                  <td className="py-3 px-4 text-right font-mono text-cyan-300 font-semibold">{squad.totalKills}</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-300">{squad.placementPoints}</td>
                  <td className="py-3 px-4 text-right font-mono font-black text-amber-300 text-sm">
                    {squad.totalScore}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
