import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOBILE_MONEY_COUNTRIES } from '../data/mockData';
import { MobileMoneyCountry, PaymentMethod } from '../types';
import {
  X,
  CreditCard,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Receipt,
  Download,
  Copy,
} from 'lucide-react';

export const PaymentGatewayModal: React.FC = () => {
  const {
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    paymentModalDetails,
    topUpBalance,
    formatCurrency,
    addToast,
    subscribeToTier,
    activeSubscriptionId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'mobile_money' | 'card'>('mobile_money');
  
  // Mobile Money states
  const [selectedCountry, setSelectedCountry] = useState<MobileMoneyCountry>(MOBILE_MONEY_COUNTRIES[0]); // Gabon by default
  const [selectedProvider, setSelectedProvider] = useState<PaymentMethod>('nexus_airtel');
  const [phoneNumber, setPhoneNumber] = useState('074128930');
  
  // Card states
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState('ALAN KAREDIS');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('883');

  // Amount custom or prefilled
  const defaultAmount = paymentModalDetails?.amountFcfa || 10000;
  const [customAmountFcfa, setCustomAmountFcfa] = useState<number>(defaultAmount);

  // Flow steps: 'form' | 'processing' | 'ussd_prompt' | 'success'
  const [step, setStep] = useState<'form' | 'processing' | 'ussd_prompt' | 'success'>('form');
  const [ussdPin, setUssdPin] = useState('');
  const [generatedTxRef, setGeneratedTxRef] = useState('');

  if (!isPaymentModalOpen) return null;

  const currentProviderObj = selectedCountry.providers.find((p) => p.id === selectedProvider) || selectedCountry.providers[0];

  const handleCountryChange = (code: string) => {
    const c = MOBILE_MONEY_COUNTRIES.find((item) => item.code === code) || MOBILE_MONEY_COUNTRIES[0];
    setSelectedCountry(c);
    setSelectedProvider(c.providers[0].id);
  };

  const handleInitiatePayment = () => {
    setStep('processing');

    setTimeout(() => {
      if (activeTab === 'mobile_money') {
        // Show USSD Push dialog
        setStep('ussd_prompt');
      } else {
        // 3D Secure Card simulation success
        completeTransaction();
      }
    }, 1500);
  };

  const handleConfirmUssd = () => {
    setStep('processing');
    setTimeout(() => {
      completeTransaction();
    }, 1200);
  };

  const completeTransaction = () => {
    const txRef = `NX-${selectedCountry.code}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    setGeneratedTxRef(txRef);
    setStep('success');

    const providerTitle =
      activeTab === 'mobile_money'
        ? `Nexus Africa (${currentProviderObj.name})`
        : 'Visa / MasterCard International';

    if (paymentModalDetails?.actionType === 'topup' || !paymentModalDetails) {
      topUpBalance(customAmountFcfa, providerTitle);
    } else if (paymentModalDetails?.actionType === 'sub') {
      // Direct pass activation
      topUpBalance(customAmountFcfa, providerTitle);
      subscribeToTier(activeSubscriptionId);
    } else if (paymentModalDetails?.actionType === 'tournament') {
      topUpBalance(customAmountFcfa, providerTitle);
      addToast('success', 'Inscription Confirmée', 'Votre place dans la Room de qualification est sécurisée.');
    }
  };

  const resetModal = () => {
    setStep('form');
    setIsPaymentModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-3xl overflow-hidden glass-panel border border-white/15 shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Passerelle de Paiement Universelle & Hybride
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  NEXUS AFRICA
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Paiements Panafricains Mobile Money & Cartes Bancaires Mondiales
              </p>
            </div>
          </div>

          <button
            onClick={resetModal}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* STEP 1: FORM */}
          {step === 'form' && (
            <>
              {/* Amount selector / display */}
              <div className="p-4 rounded-2xl glass-card border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-purple-950/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-400">Montant à régler / créditer</span>
                  <div className="text-2xl font-black text-white tabular-nums tracking-tight">
                    {formatCurrency(customAmountFcfa)}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {paymentModalDetails?.title || 'Recharge Portefeuille Gamer'}
                  </div>
                </div>

                {/* Quick amount presets */}
                <div className="flex items-center gap-1.5">
                  {[5000, 10000, 25000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setCustomAmountFcfa(amt)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                        customAmountFcfa === amt
                          ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/50'
                          : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {amt / 1000}k
                    </button>
                  ))}
                </div>
              </div>

              {/* Method Switcher Tabs */}
              <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-slate-950/60 border border-white/10">
                <button
                  onClick={() => setActiveTab('mobile_money')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'mobile_money'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Mobile Money Panafricain</span>
                </button>

                <button
                  onClick={() => setActiveTab('card')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'card'
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/25'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Visa / MasterCard Globale</span>
                </button>
              </div>

              {/* Mobile Money Form (Nexus Africa) */}
              {activeTab === 'mobile_money' && (
                <div className="space-y-4">
                  {/* Country Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Pays & Territoire de Paiement
                    </label>
                    <select
                      value={selectedCountry.code}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-medium text-white"
                    >
                      {MOBILE_MONEY_COUNTRIES.map((country) => (
                        <option key={country.code} value={country.code} className="bg-slate-900 text-white">
                          {country.flag} {country.name} ({country.dialCode})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Provider Radio Options */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Opérateur Mobile Money (Nexus Gateway)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedCountry.providers.map((provider) => {
                        const isSelected = selectedProvider === provider.id;
                        return (
                          <button
                            key={provider.id}
                            type="button"
                            onClick={() => setSelectedProvider(provider.id)}
                            className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                              isSelected
                                ? 'bg-cyan-500/15 border-cyan-500/50 shadow-sm shadow-cyan-500/20'
                                : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: provider.color }}
                              ></span>
                              <span className="text-xs font-bold text-white">
                                {provider.name}
                              </span>
                            </div>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Phone Input with Dial Code */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Numéro de Téléphone Mobile Money
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5 shrink-0">
                        <span>{selectedCountry.flag}</span>
                        <span>{selectedCountry.dialCode}</span>
                      </div>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Ex : 074 12 89 30"
                        className="flex-1 px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono font-medium text-white tracking-wider"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Un push interactif USSD sera instantanément envoyé sur votre mobile pour confirmation du code PIN.
                    </p>
                  </div>
                </div>
              )}

              {/* International Credit Card Form */}
              {activeTab === 'card' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Numéro de Carte Bancaire (Visa / MasterCard)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 •••• •••• 4242"
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono font-medium text-white tracking-widest pl-10"
                      />
                      <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Date d'Expiration
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/AA"
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono font-medium text-white text-center"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Code CVV (3 chiffres)
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono font-medium text-white text-center tracking-widest"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Nom sur la Carte
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Nom et Prénom du porteur"
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-medium text-white uppercase"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-slate-300 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Transactions chiffrées en TLS 1.3 avec protocole 3D-Secure 2.0.</span>
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="button"
                onClick={handleInitiatePayment}
                className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs bg-gradient-to-r from-cyan-500 via-sky-500 to-purple-600 text-white shadow-xl shadow-cyan-500/25 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <span>Payer {formatCurrency(customAmountFcfa)} via {activeTab === 'mobile_money' ? 'Nexus Mobile Money' : 'Carte'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* STEP 2: PROCESSING */}
          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin"></div>
              </div>
              <h4 className="text-base font-bold text-white">
                Communication avec le Serveur Nexus Africa...
              </h4>
              <p className="text-xs text-slate-400 max-w-sm">
                Sécurisation du tunnel de paiement et transmission de la requête de débit en direct.
              </p>
            </div>
          )}

          {/* STEP 3: USSD PUSH PROMPT (SIMULATION DE L'ÉCRAN TÉLÉPHONE) */}
          {step === 'ussd_prompt' && (
            <div className="py-4 space-y-5">
              <div className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/40 text-center space-y-3 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400 animate-pulse"></div>

                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-300 mx-auto flex items-center justify-center border border-cyan-500/30">
                  <Smartphone className="w-5 h-5 text-cyan-400 animate-bounce" />
                </div>

                <h4 className="text-sm font-bold text-white">
                  Notification Push USSD reçue sur votre Téléphone
                </h4>

                <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-cyan-300 text-left space-y-1">
                  <p className="text-slate-400">Message Opérateur ({currentProviderObj.name}) :</p>
                  <p className="font-bold text-white">
                    "Autoriser le débit de {formatCurrency(customAmountFcfa)} pour le marchand ARENA ESPORT V2 ? Entrez votre code PIN secret :"
                  </p>
                </div>

                {/* Simulated PIN input */}
                <div className="max-w-xs mx-auto space-y-2">
                  <input
                    type="password"
                    maxLength={4}
                    value={ussdPin}
                    onChange={(e) => setUssdPin(e.target.value)}
                    placeholder="Tapez votre code PIN (ex : 1234)"
                    className="w-full py-2.5 px-4 text-center rounded-xl glass-input text-base tracking-widest font-mono text-white"
                  />
                  <p className="text-[10px] text-slate-400">
                    Mode simulation : tapez 4 chiffres ou cliquez directement ci-dessous.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/10 text-slate-300 font-semibold text-xs hover:bg-white/15"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleConfirmUssd}
                  className="flex-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all"
                >
                  Valider le Débit Mobile Money
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS RECEIPT */}
          {step === 'success' && (
            <div className="py-4 space-y-6 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-extrabold text-white">
                  Paiement Validé avec Succès !
                </h4>
                <p className="text-xs text-slate-300">
                  Votre transaction a été confirmée et intégrée dans l'arène ARENA ESPORT V2.
                </p>
              </div>

              {/* Receipt Card */}
              <div className="p-4 rounded-2xl glass-card border border-white/10 text-xs text-left space-y-2 font-mono">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400 font-sans">Référence Transaction :</span>
                  <span className="font-bold text-cyan-300">{generatedTxRef}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400 font-sans">Montant Débité :</span>
                  <span className="font-bold text-white">{formatCurrency(customAmountFcfa)}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400 font-sans">Passerelle :</span>
                  <span className="text-slate-200">
                    {activeTab === 'mobile_money' ? `Nexus Africa · ${currentProviderObj.name}` : 'Visa / MasterCard'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Statut :</span>
                  <span className="text-emerald-400 font-bold uppercase">Succès Confirmé</span>
                </div>
              </div>

              <button
                type="button"
                onClick={resetModal}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95"
              >
                Retour à l'Arène
              </button>
            </div>
          )}

        </div>

        {/* Modal Footer info */}
        <div className="p-4 border-t border-white/10 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Agrégateur Nexus Africa API certifié</span>
          </div>
          <span className="text-slate-400 font-mono">PCI-DSS Level 1</span>
        </div>

      </div>
    </div>
  );
};
