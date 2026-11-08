import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Squad } from '../types';
import {
  Search,
  Filter,
  Trophy,
  Users,
  Target,
  ShieldCheck,
  ChevronRight,
  X,
  Crosshair,
  Award,
  Sparkles,
} from 'lucide-react';

export const SquadsTracker: React.FC = () => {
  const {
    squads,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    poolFilter,
    setPoolFilter,
    selectedSquad,
    setSelectedSquad,
    formatCurrency,
  } = useApp();

  const filteredSquads = useMemo(() => {
    return squads.filter((squad) => {
      // Search
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        squad.name.toLowerCase().includes(query) ||
        squad.tag.toLowerCase().includes(query) ||
        squad.country.toLowerCase().includes(query) ||
        squad.members.some(
          (m) =>
            m.name.toLowerCase().includes(query) ||
            m.inGameId.toLowerCase().includes(query)
        );

      // Status
      const matchesStatus =
        statusFilter === 'toutes' || squad.status === statusFilter;

      // Pool
      const matchesPool =
        poolFilter === 'toutes' || squad.pool === poolFilter;

      return matchesSearch && matchesStatus && matchesPool;
    });
  }, [squads, searchQuery, statusFilter, poolFilter]);

  const qualifiedCount = squads.filter((s) => s.status === 'qualifiée').length;
  const inRaceCount = squads.filter((s) => s.status === 'en_course').length;
  const eliminatedCount = squads.filter((s) => s.status === 'éliminée').length;

  return (
    <div className="space-y-6">
      
      {/* Tracker Top Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <Target className="w-3.5 h-3.5" />
            <span>Suivi des Performances Majeures</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Progressions Tracker — 100 Squads E-Sport
          </h2>
          <p className="text-xs text-slate-400">
            Classement général en direct Free Fire basé sur les éliminations et points de survie.
          </p>
        </div>

        {/* Global Progress Statistics Pills */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
            <span className="font-bold tabular-nums">{qualifiedCount}</span>
            <span>Qualifiées (Top 16)</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 flex items-center gap-1.5">
            <span className="font-bold tabular-nums">{inRaceCount}</span>
            <span>En Course</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-800/40 border border-white/10 text-slate-400 flex items-center gap-1.5">
            <span className="font-bold tabular-nums">{eliminatedCount}</span>
            <span>Éliminées</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-white/10 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une squad, un tag, un pays ou un UID Free Fire..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Segmented Control */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950/60 border border-white/10 text-xs overflow-x-auto">
            {[
              { id: 'toutes', label: 'Toutes' },
              { id: 'qualifiée', label: 'Qualifiées' },
              { id: 'en_course', label: 'En Course' },
              { id: 'éliminée', label: 'Éliminées' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id as any)}
                className={`px-3 py-1.5 font-semibold rounded-lg transition-all whitespace-nowrap ${
                  statusFilter === st.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Pool Selector */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950/60 border border-white/10 text-xs overflow-x-auto">
            {['toutes', 'Pool A', 'Pool B', 'Pool C', 'Pool D'].map((p) => (
              <button
                key={p}
                onClick={() => setPoolFilter(p as any)}
                className={`px-2.5 py-1.5 font-semibold rounded-lg transition-all whitespace-nowrap ${
                  poolFilter === p
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p === 'toutes' ? 'Toutes Poules' : p}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* 100 Squads Tabular List */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Rang</th>
                <th className="py-3.5 px-4">Escouade & Tag</th>
                <th className="py-3.5 px-4">Poule</th>
                <th className="py-3.5 px-4 text-center">Matchs</th>
                <th className="py-3.5 px-4 text-right">Kills Totaux</th>
                <th className="py-3.5 px-4 text-right">Pts Placement</th>
                <th className="py-3.5 px-4 text-right font-bold text-white">Score Global</th>
                <th className="py-3.5 px-4 text-center">Statut</th>
                <th className="py-3.5 px-4 text-right">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredSquads.map((squad) => {
                const isTop3 = squad.rank <= 3;
                const isUserSquad = squad.isUserSquad;

                return (
                  <tr
                    key={squad.id}
                    onClick={() => setSelectedSquad(squad)}
                    className={`group cursor-pointer transition-colors ${
                      isUserSquad
                        ? 'bg-cyan-950/30 hover:bg-cyan-900/40'
                        : 'hover:bg-white/[0.04]'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3 px-4 font-bold font-mono">
                      <div className="flex items-center gap-1.5">
                        {squad.rank === 1 && <span className="text-amber-400 text-sm">🥇</span>}
                        {squad.rank === 2 && <span className="text-slate-300 text-sm">🥈</span>}
                        {squad.rank === 3 && <span className="text-amber-600 text-sm">🥉</span>}
                        <span className={isTop3 ? 'text-amber-300 font-extrabold' : 'text-slate-400'}>
                          #{squad.rank}
                        </span>
                      </div>
                    </td>

                    {/* Squad & Tag */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg leading-none" title={squad.country}>
                          {squad.flag}
                        </span>
                        <div>
                          <div className="font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                            <span>{squad.name}</span>
                            {isUserSquad && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase font-black">
                                Votre Squad
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <span className="font-mono text-cyan-400 font-semibold">{squad.tag}</span>
                            <span>·</span>
                            <span>{squad.country}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Pool */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-white/5 text-slate-300 border border-white/10">
                        {squad.pool}
                      </span>
                    </td>

                    {/* Matches */}
                    <td className="py-3 px-4 text-center font-mono text-slate-300">
                      {squad.matchesPlayed}
                    </td>

                    {/* Kills */}
                    <td className="py-3 px-4 text-right font-mono font-semibold text-cyan-300">
                      {squad.totalKills}
                    </td>

                    {/* Placement */}
                    <td className="py-3 px-4 text-right font-mono text-slate-300">
                      {squad.placementPoints}
                    </td>

                    {/* Total Score */}
                    <td className="py-3 px-4 text-right font-mono font-black text-white text-sm">
                      {squad.totalScore}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      {squad.status === 'qualifiée' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Qualifiée
                        </span>
                      )}
                      {squad.status === 'en_course' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                          En Course
                        </span>
                      )}
                      {squad.status === 'éliminée' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">
                          Éliminée
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSquad(squad);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-white/10 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>
            Affichage de <strong className="text-white">{filteredSquads.length}</strong> sur 100 escouades enregistrées
          </span>
          <span>Actualisation en temps réel via Supabase PostgreSQL</span>
        </div>
      </div>

      {/* Squad Detailed Inspection Modal */}
      {selectedSquad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden glass-panel border border-white/15 p-6 space-y-6">
            
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedSquad.flag}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold text-white">
                      {selectedSquad.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30">
                      {selectedSquad.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {selectedSquad.country} · {selectedSquad.pool} · Rang Actuel : <strong className="text-amber-300">#{selectedSquad.rank}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSquad(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick KPI stats */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="text-slate-400">Matchs</span>
                <p className="text-base font-bold font-mono text-white mt-1">{selectedSquad.matchesPlayed}</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="text-slate-400">Kills</span>
                <p className="text-base font-bold font-mono text-cyan-300 mt-1">{selectedSquad.totalKills}</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="text-slate-400">Placement</span>
                <p className="text-base font-bold font-mono text-slate-300 mt-1">{selectedSquad.placementPoints}</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="text-slate-400">Total Pts</span>
                <p className="text-base font-bold font-mono text-emerald-400 mt-1">{selectedSquad.totalScore}</p>
              </div>
            </div>

            {/* Roster of 4 Players */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>Roster Officiel (4 Joueurs Titulaires)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedSquad.members.map((member) => (
                  <div
                    key={member.id}
                    className="p-3 rounded-2xl bg-slate-900/60 border border-white/10 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{member.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                          {member.role}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        Free Fire UID : <span className="text-cyan-300 font-semibold">{member.inGameId}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400">Kills</span>
                      <p className="font-bold font-mono text-white text-xs">{member.kills}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Close */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedSquad(null)}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs"
              >
                Fermer la Fiche Squad
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
