import React from 'react';
import { useApp } from '../context/AppContext';
import { Radio, X, BellRing } from 'lucide-react';

export const FlashBroadcast: React.FC = () => {
  const { broadcastNotice, setBroadcastNotice } = useApp();

  if (!broadcastNotice) return null;

  return (
    <div className="w-full bg-gradient-to-r from-cyan-950/70 via-purple-950/60 to-slate-950/70 border-b border-cyan-500/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 shrink-0 font-bold uppercase tracking-wider text-[10px]">
            <Radio className="w-3 h-3 animate-pulse text-red-400" />
            <span>FLASH LIVE</span>
          </div>
          <p className="text-slate-200 font-medium truncate">
            {broadcastNotice}
          </p>
        </div>

        <button
          onClick={() => setBroadcastNotice(null)}
          className="text-slate-400 hover:text-white transition-colors shrink-0 p-1 rounded-lg hover:bg-white/10"
          title="Masquer l'alerte"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
