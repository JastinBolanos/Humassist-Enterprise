import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
            toast.type === 'success'
              ? 'bg-emerald-900/90 border-emerald-700/50 text-white'
              : toast.type === 'error'
              ? 'bg-rose-900/90 border-rose-700/50 text-white'
              : toast.type === 'warning'
              ? 'bg-amber-900/90 border-amber-700/50 text-white'
              : 'bg-slate-900/90 border-slate-700/50 text-white'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-300" />}
            {toast.type === 'error' && <XCircle className="w-5 h-5 text-rose-300" />}
            {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-300" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-sky-300" />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold tracking-wide">{toast.title}</h4>
            <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">{toast.message}</p>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-300 hover:text-white transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
