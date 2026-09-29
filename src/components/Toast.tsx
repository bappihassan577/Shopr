import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none animate-bounce-in">
      <div className="flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700/60 backdrop-blur-md">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span className="text-sm font-semibold tracking-wide">{message}</span>
      </div>
    </div>
  );
};
