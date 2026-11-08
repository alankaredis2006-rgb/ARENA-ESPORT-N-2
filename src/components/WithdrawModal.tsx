import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ArrowRight,
  Smartphone,
  Building,
  ShieldCheck,
  AlertCircle,
  Coins,
  Lock,
} from 'lucide-react';

export const WithdrawModal: React.FC = () => {
  const {
    isWithdrawModalOpen,
    setIsWithdrawModalOpen,
    balanceFcfa,
    formatCurrency,
    requestWithdrawal,
    addToast,
    t,
  } = useApp();

  const [method, setMethod] = useState<'mobile_money' | 'bank'>('mobile_money');
  const [amount, setAmount] = useState<number>(15000);
  const [accountDetails, setAccountDetails] = useState('Airtel Money (+241 074 12 89 30)');

  if (!isWithdrawModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (amount < 5000) {
      addToast('error', 'Montant Minimum', 'Le montant minimum de retrait est de 5 000 FCFA.');
      return;
    }

    if (amount > balanceFcfa) {
      addToast('error', 'Solde Insuffisant', `Votre solde disponible est de ${formatCurrency(balanceFcfa)}.`);
      return;
    }

    if (!accountDetails.trim()) {
      addToast('error', 'Détails Requis', 'Veuillez saisir votre numéro Mobile Money ou RIB bancaire.');
      return;
    }

    const success = requestWithdrawal(Number(amount), method, accountDetails.trim());
    if (success) {
      setIsWithdrawModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl overflow-hidden glass-panel border border-white/15 shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Coins className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {t('withdraw_funds')}
              </h3>
              <p className="text-xs text-slate-400">
                Décaissement sécurisé vers Mobile Money ou Compte Bancaire
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsWithdrawModalOpen(false)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Balance card */}
          <div className="p-4 rounded-2xl glass-card border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 to-purple-950/30 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 font-medium">Solde Disponible</span>
              <div className="text-2xl font-black text-white tabular-nums tracking-tight">
                {formatCurrency(balanceFcfa)}
              </div>
            </div>
            <div className="text-right text-[11px] text-slate-300">
              <span>Retrait min : 5 000 FCFA</span>
              <span className="block text-cyan-400">Délai : 15 min à 24h</span>
            </div>
          </div>

          {/* Method Selector */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">{t('withdraw_method')}</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMethod('mobile_money');
                  setAccountDetails('Airtel Money (+241 074 12 89 30)');
                }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                  method === 'mobile_money'
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-white shadow-md shadow-cyan-500/20'
                    : 'bg-white/[0.02] border-white/10 text-slate-400'
                }`}
              >
                <Smartphone className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Mobile Money</span>
                  <span className="text-[10px] text-slate-400">Airtel, Moov, MTN, Orange</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMethod('bank');
                  setAccountDetails('Compte Bancaire (IBAN / RIB)');
                }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                  method === 'bank'
                    ? 'bg-purple-500/20 border-purple-500/50 text-white shadow-md shadow-purple-500/20'
                    : 'bg-white/[0.02] border-white/10 text-slate-400'
                }`}
              >
                <Building className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Virement Bancaire</span>
                  <span className="text-[10px] text-slate-400">RIB / IBAN International</span>
                </div>
              </button>
            </div>
          </div>

          {/* Amount to withdraw */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Montant du Retrait (FCFA)</label>
            <input
              type="number"
              step={1000}
              min={5000}
              max={balanceFcfa}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm font-mono font-bold text-cyan-300"
              required
            />
          </div>

          {/* Account Details */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">
              {method === 'mobile_money' ? 'Numéro Mobile Money & Opérateur' : 'RIB / Coordonnées Bancaires'}
            </label>
            <input
              type="text"
              value={accountDetails}
              onChange={(e) => setAccountDetails(e.target.value)}
              placeholder={method === 'mobile_money' ? 'Ex: Airtel Gabon +241 074 12 89 30' : 'Ex: GA39 2000 1004 ...'}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
              required
            />
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-slate-300 flex items-center gap-2 text-[11px]">
            <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Contrôle de conformité automatique côté serveur via Nexus Africa Payouts.</span>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={amount <= 0 || amount > balanceFcfa}
              className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs bg-gradient-to-r from-cyan-500 via-sky-500 to-purple-600 text-white shadow-xl shadow-cyan-500/25 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{t('confirm_withdraw')} de {formatCurrency(amount)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
