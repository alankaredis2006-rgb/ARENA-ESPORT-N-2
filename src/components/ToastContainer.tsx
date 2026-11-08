import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl glass-panel border shadow-2xl flex items-start justify-between gap-3 animate-in slide-in-from-bottom-5 duration-200 ${
              isSuccess
                ? 'border-emerald-500/40 bg-emerald-950/40'
                : isError
                ? 'border-red-500/40 bg-red-950/40'
                : 'border-cyan-500/40 bg-slate-900/80'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {isError && <XCircle className="w-4 h-4 text-red-400" />}
                {isInfo && <Info className="w-4 h-4 text-cyan-400" />}
              </div>

              <div className="space-y-0.5">
                <h5 className="text-xs font-bold text-white">{toast.title}</h5>
                <p className="text-[11px] text-slate-300 leading-snug">{toast.message}</p>
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
