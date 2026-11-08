import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUBSCRIPTION_TIERS } from '../data/mockData';
import {
  Check,
  Zap,
  Crown,
  Shield,
  Sparkles,
  Flame,
  ArrowRight,
} from 'lucide-react';

export const SubscriptionSection: React.FC = () => {
  const {
    activeSubscriptionId,
    subscribeToTier,
    formatCurrency,
    openPaymentModal,
  } = useApp();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'season'>('monthly');

  const handleSelectPlan = (tierId: string, priceFcfa: number, name: string) => {
    if (tierId === 'sub_challenger') {
      subscribeToTier(tierId);
      return;
    }
    const success = subscribeToTier(tierId);
    if (!success) {
      openPaymentModal(priceFcfa, `Pass Abonnement — ${name}`, 'sub');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <Crown className="w-3.5 h-3.5" />
          <span>Pass Compétition & Avantages VIP</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Passez au Niveau Supérieur avec les{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
            Pass ARENA Pro & Elite
          </span>
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Accès prioritaire aux 10 Rooms officielles, déverrouillage anticipé des codes secrets Free Fire, cashprize bonifié et arbitrage prioritaire.
        </p>

        {/* Billing cycle toggle */}
        <div className="pt-2 inline-flex items-center p-1 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl text-xs font-semibold">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-xl transition-all ${
              billingCycle === 'monthly'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Abonnement Mensuel
          </button>
          <button
            onClick={() => setBillingCycle('season')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              billingCycle === 'season'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Pass Saison Entière</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold">
              -25%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SUBSCRIPTION_TIERS.map((tier) => {
          const isActive = activeSubscriptionId === tier.id;
          const isPro = tier.id === 'sub_pro';
          const isElite = tier.id === 'sub_elite';
          const price = billingCycle === 'monthly' ? tier.priceFcfaMonthly : tier.priceFcfaSeason;

          return (
            <div
              key={tier.id}
              className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                isPro
                  ? 'glass-panel border-cyan-500/50 shadow-2xl shadow-cyan-500/10'
                  : isElite
                  ? 'glass-panel border-purple-500/50 shadow-2xl shadow-purple-500/10'
                  : 'glass-card border-white/10'
              } hover:translate-y-[-4px]`}
            >
              {/* Badge for popular / elite */}
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-lg ${
                      isPro
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/30'
                        : isElite
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-purple-500/30'
                        : 'bg-slate-800 text-slate-300 border border-white/10'
                    }`}
                  >
                    {tier.badge}
                  </span>
                </div>
              )}

              {/* Top part */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-extrabold text-white">
                    {tier.name}
                  </h3>
                  {isElite && <Crown className="w-5 h-5 text-purple-400" />}
                  {isPro && <Zap className="w-5 h-5 text-cyan-400" />}
                  {!isElite && !isPro && <Shield className="w-5 h-5 text-slate-400" />}
                </div>

                <p className="text-xs text-slate-300 min-h-[36px]">
                  {tier.description}
                </p>

                {/* Price Display */}
                <div className="py-2 border-y border-white/10">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-white tabular-nums tracking-tight">
                      {price === 0 ? 'Gratuit' : formatCurrency(price)}
                    </span>
                    {price > 0 && (
                      <span className="text-xs text-slate-400 font-medium">
                        / {billingCycle === 'monthly' ? 'mois' : 'saison'}
                      </span>
                    )}
                  </div>
                  {price > 0 && (
                    <div className="text-[11px] text-cyan-400 mt-0.5">
                      Règlement via Nexus Africa Mobile Money ou Carte CB
                    </div>
                  )}
                </div>

                {/* Features List */}
                <ul className="space-y-2.5 pt-2 text-xs text-slate-300">
                  {tier.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <div className="p-0.5 rounded-full bg-cyan-500/20 text-cyan-400 mt-0.5 shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="leading-tight">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => handleSelectPlan(tier.id, price, tier.name)}
                  disabled={isActive}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : isPro
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-95'
                      : isElite
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/25 hover:brightness-110 active:scale-95'
                      : 'bg-white/10 hover:bg-white/15 text-white'
                  }`}
                >
                  {isActive ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Pass Actuellement Actif</span>
                    </>
                  ) : (
                    <>
                      <span>Activer le {tier.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
