import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SupportTicket } from '../types';
import {
  X,
  LifeBuoy,
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportTicketModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { supportTickets, createSupportTicket, t } = useApp();

  const [category, setCategory] = useState<SupportTicket['category']>('payment');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    createSupportTicket(category, subject.trim(), message.trim());
    setSubject('');
    setMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden glass-panel border border-white/15 shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <LifeBuoy className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {t('support_center')}
              </h3>
              <p className="text-xs text-slate-400">
                Assistance officielle pour paiements Nexus Africa, litiges et réclamations
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          
          {/* New Ticket Form */}
          <form onSubmit={handleSubmit} className="p-4 rounded-2xl glass-card border border-white/10 space-y-3">
            <h4 className="font-bold text-white flex items-center gap-2 text-sm">
              <Send className="w-4 h-4 text-cyan-400" />
              <span>{t('open_ticket')}</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Catégorie</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                >
                  <option value="payment" className="bg-slate-900">Paiement / Nexus Africa</option>
                  <option value="match_dispute" className="bg-slate-900">Litige Score de Match</option>
                  <option value="anti_cheat" className="bg-slate-900">Signalement Anti-Triche</option>
                  <option value="account" className="bg-slate-900">Gestion de Compte</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Objet de la demande</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ex : Réclamation gain tournoi..."
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Message & Explication</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Décrivez votre problème en précisant les références de transaction ou le numéro de Room..."
                className="w-full p-3 rounded-xl glass-input text-xs text-white resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all"
            >
              Envoyer le Ticket au Support
            </button>
          </form>

          {/* Existing Tickets History */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Vos Demandes Récentes</span>
            </h4>

            <div className="space-y-3">
              {supportTickets.map((ticket) => (
                <div key={ticket.id} className="p-4 rounded-2xl glass-card border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{ticket.subject}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      ticket.status === 'resolved'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {ticket.status === 'resolved' ? 'Résolu' : 'En Cours d\'Analyse'}
                    </span>
                  </div>

                  <p className="text-slate-300 text-xs">{ticket.message}</p>

                  {ticket.adminReply && (
                    <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 mt-2 space-y-1">
                      <span className="text-[10px] font-bold text-cyan-400 block uppercase">
                        Réponse de l'Administration :
                      </span>
                      <p>{ticket.adminReply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Support officiel 24/7 pour les compétiteurs ARENA ESPORT</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 text-white font-semibold"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
