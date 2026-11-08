import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Smartphone,
  CreditCard,
  History,
  ShieldCheck,
  RefreshCw,
  Plus,
  Zap,
} from 'lucide-react';

export const WalletView: React.FC = () => {
  const {
    balanceFcfa,
    formatCurrency,
    transactions,
    openPaymentModal,
    currency,
  } = useApp();

  const [filterType, setFilterType] = useState<'all' | 'topup' | 'tournament_entry'>('all');

  const filteredTx = transactions.filter((t) => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  return (
    <div className="space-y-8">
      
      {/* Wallet Balance Hero Card */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/20 via-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              <Wallet className="w-4 h-4" />
              <span>Portefeuille Compétiteur ARENA</span>
            </div>

            <div className="text-3xl sm:text-5xl font-black text-white tabular-nums tracking-tight">
              {formatCurrency(balanceFcfa)}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span>Devise d'affichage : <strong className="text-white">{currency}</strong></span>
              <span>·</span>
              <span className="text-emerald-400 font-semibold">Compte Vérifié & Sécurisé</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openPaymentModal(10000, 'Recharge Mobile Money (Nexus Africa)', 'topup')}
              className="py-3 px-5 rounded-2xl font-bold text-xs bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white shadow-xl shadow-cyan-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              <span>Recharge Mobile Money</span>
            </button>

            <button
              onClick={() => openPaymentModal(20000, 'Recharge Carte Bancaire (Visa/MasterCard)', 'topup')}
              className="py-3 px-5 rounded-2xl font-bold text-xs bg-white/10 hover:bg-white/15 text-white border border-white/10 hover:border-cyan-500/30 transition-all flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4 text-purple-400" />
              <span>Carte Visa / MasterCard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Panafrican Supported Channels Banner */}
      <div className="p-4 rounded-2xl glass-card border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
          <div>
            <span className="font-bold text-white">Passerelle Officielle Nexus Africa Connect</span>
            <p className="text-slate-400">
              Débits instantanés Airtel Money, Moov Money, Orange Money, MTN MoMo dans 10 pays d'Afrique.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] shrink-0">
          <span className="px-2 py-1 rounded bg-white/5 border border-white/10">Webhook SSL</span>
          <span className="px-2 py-1 rounded bg-white/5 border border-white/10">3DSv2</span>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-400" />
            <h3 className="text-base font-bold text-white">
              Historique des Mouvements & Facturations
            </h3>
          </div>

          <div className="flex items-center p-1 rounded-xl bg-slate-900/70 border border-white/10 text-xs">
            {[
              { id: 'all', label: 'Toutes' },
              { id: 'topup', label: 'Recharges' },
              { id: 'tournament_entry', label: 'Inscriptions' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id as any)}
                className={`px-3 py-1 font-semibold rounded-lg transition-all ${
                  filterType === f.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table / Cards */}
        <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-xl">
          <div className="divide-y divide-white/5">
            {filteredTx.map((tx) => {
              const isPositive = tx.amountFcfa > 0;

              return (
                <div
                  key={tx.id}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                        isPositive
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {isPositive ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white">
                        {tx.description}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{tx.date}</span>
                        <span>·</span>
                        <span className="font-mono text-slate-400">{tx.reference}</span>
                        <span>·</span>
                        <span className="text-cyan-400">{tx.provider}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-xs sm:text-sm font-extrabold font-mono tabular-nums ${
                        isPositive ? 'text-emerald-400' : 'text-slate-200'
                      }`}
                    >
                      {isPositive ? `+${formatCurrency(tx.amountFcfa)}` : `-${formatCurrency(Math.abs(tx.amountFcfa))}`}
                    </div>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      Confirmé
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
};
