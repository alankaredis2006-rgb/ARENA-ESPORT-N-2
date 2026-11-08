import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SquadsTracker } from './SquadsTracker';
import { UserSquadView } from './UserSquadView';
import { Users, Shield, Trophy } from 'lucide-react';

export const TeamsView: React.FC = () => {
  const [subTab, setSubTab] = useState<'tracker' | 'my_squad'>('tracker');

  return (
    <div className="space-y-6 pb-12">
      {/* Segmented Sub-Navigation for Teams */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>Gestion des Équipes & Progressions 100 Squads</span>
          </h2>
          <p className="text-xs text-slate-400">
            Suivi officiel des escouades en compétition et composition du roster titulaire.
          </p>
        </div>

        {/* Segmented Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl text-xs font-semibold">
          <button
            onClick={() => setSubTab('tracker')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              subTab === 'tracker'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Classement des 100 Squads</span>
          </button>

          <button
            onClick={() => setSubTab('my_squad')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              subTab === 'my_squad'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Mon Escouade & Roster</span>
          </button>
        </div>
      </div>

      {/* Render sub-view */}
      {subTab === 'tracker' ? <SquadsTracker /> : <UserSquadView />}
    </div>
  );
};
