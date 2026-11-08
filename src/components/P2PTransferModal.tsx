import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ArrowRight,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  Coins,
  Send,
  UserCheck,
} from 'lucide-react';

export const P2PTransferModal: React.FC = () => {
  const {
    isP2PModalOpen,
    setIsP2PModalOpen,
    balanceFcfa,
    formatCurrency,
    sendP2PTransfer,
    addToast,
    t,
  } = useApp();

  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState<number>(5000);
  const [note, setNote] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [recipientVerified, setRecipientVerified] = useState<{ name: string; tag: string; country: string } | null>(null);

  if (!isP2PModalOpen) return null;

  // Mock recipient lookup database
  const KNOWN_PLAYERS: Record<string, { name: string; tag: string; country: string }> = {
    'ARENA-890412': { name: 'Kapt_Libreville', tag: 'LBV', country: 'Gabon 🇬🇦' },
    'ARENA-918234': { name: 'Fragger_Abidjan', tag: 'ABJ', country: 'Côte d’Ivoire 🇨🇮' },
    'ARENA-721099': { name: 'Sniper_Dakar', tag: 'DKR', country: 'Sénégal 🇸🇳' },
    'ARENA-634411': { name: 'Rusher_Kinshasa', tag: 'KIN', country: 'RD Congo 🇨🇩' },
    'ARENA-551029': { name: 'Douala_Thunder_K', tag: 'DLA', country: 'Cameroun 🇨🇲' },
  };

  const handleVerify = () => {
    const formatted = recipientId.trim().toUpperCase();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const found = KNOWN_PLAYERS[formatted];
      if (found) {
        setRecipientVerified(found);
      } else {
        // Fallback valid mock player
        setRecipientVerified({
          name: `Joueur_${formatted.slice(-4) || 'Compétiteur'}`,
          tag: 'SQUAD',
          country: 'Afrique 🌍',
        });
      }
    }, 400);
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipientId.trim()) {
      addToast('error', 'Identifiant Requis', 'Veuillez saisir l\'identifiant ARENA du destinataire.');
      return;
    }

    if (amount <= 0) {
      addToast('error', 'Montant Invalide', 'Veuillez saisir un montant supérieur à 0.');
      return;
    }

    const success = sendP2PTransfer(recipientId.trim().toUpperCase(), Number(amount), note.trim());
    if (success) {
      setIsP2PModalOpen(false);
      setRecipientId('');
      setAmount(5000);
      setNote('');
      setRecipientVerified(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl overflow-hidden glass-panel border border-white/15 shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Send className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {t('send_credits')}
              </h3>
              <p className="text-xs text-slate-400">
                Transfert P2P direct et instantané entre joueurs par identifiant ARENA ESPORT
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsP2PModalOpen(false)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleTransfer} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Balance Preview */}
          <div className="p-4 rounded-2xl glass-card border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 to-purple-950/30 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 font-medium">Solde Disponible pour Transfert</span>
              <div className="text-2xl font-black text-white tabular-nums tracking-tight">
                {formatCurrency(balanceFcfa)}
              </div>
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              Opération Atomique 0% Frais
            </div>
          </div>

          {/* Recipient ARENA ID */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Identifiant Unique ARENA du Destinataire</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={recipientId}
                  onChange={(e) => {
                    setRecipientId(e.target.value);
                    setRecipientVerified(null);
                  }}
                  placeholder="Ex : ARENA-918234"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono font-bold text-white uppercase tracking-wider"
                  required
                />
              </div>

              <button
                type="button"
                onClick={handleVerify}
                disabled={!recipientId.trim() || isVerifying}
                className="py-2.5 px-3.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold text-xs flex items-center gap-1.5 shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{isVerifying ? 'Recherche...' : 'Vérifier'}</span>
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
              <span>Joueurs vérifiés :</span>
              <button
                type="button"
                onClick={() => {
                  setRecipientId('ARENA-918234');
                  setRecipientVerified(KNOWN_PLAYERS['ARENA-918234']);
                }}
                className="text-cyan-400 hover:underline font-mono"
              >
                ARENA-918234
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => {
                  setRecipientId('ARENA-721099');
                  setRecipientVerified(KNOWN_PLAYERS['ARENA-721099']);
                }}
                className="text-cyan-400 hover:underline font-mono"
              >
                ARENA-721099
              </button>
            </div>
          </div>

          {/* Recipient Confirmation Box */}
          {recipientVerified && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-extrabold text-white text-xs block">
                    {recipientVerified.name}
                  </span>
                  <span className="text-[11px] text-slate-300">
                    Squad [{recipientVerified.tag}] · {recipientVerified.country}
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-bold text-emerald-300 px-2 py-0.5 rounded-md bg-emerald-500/20">
                Compte Valide
              </span>
            </div>
          )}

          {/* Amount to Send */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">{t('amount_to_send')}</label>
            <input
              type="number"
              step={500}
              max={balanceFcfa}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm font-mono font-bold text-cyan-300"
              required
            />

            {/* Presets */}
            <div className="flex items-center gap-2 pt-1">
              {[2000, 5000, 10000, 25000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                    amount === amt
                      ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/50'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {amt / 1000}k
                </button>
              ))}
            </div>
          </div>

          {/* Note / Reason */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Motif / Commentaire (Optionnel)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ex : Récompense Scrim, Prêt inscription tournoi..."
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={amount <= 0 || amount > balanceFcfa}
              className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs bg-gradient-to-r from-cyan-500 via-sky-500 to-purple-600 text-white shadow-xl shadow-cyan-500/25 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>Confirmer le Transfert de {formatCurrency(amount)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
