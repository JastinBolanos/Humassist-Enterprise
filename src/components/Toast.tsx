import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useScreenType } from '../hooks/useScreenType';

export interface ToastScreenConfig {
  isMobile: boolean;
  isSmallMobile: boolean;
  positionClasses: string;
  containerClasses: string;
  maxWidth: string;
}

/**
 * Función que detecta el ancho de pantalla y calcula la disposición geométrica óptima 
 * para las notificaciones toast en la web, garantizando que el mensaje completo,
 * el icono de confirmación y el botón de cierre sean 100% visibles tanto en celulares
 * como en pantallas grandes sin desbordamiento ni recortes en los bordes.
 */
export function getToastLayout(width: number): ToastScreenConfig {
  const isMobile = width < 768;
  const isSmallMobile = width < 400;

  if (isSmallMobile) {
    // Pantallas móviles muy compactas (< 400px, ej. iPhone SE, Androids compactos)
    return {
      isMobile: true,
      isSmallMobile: true,
      positionClasses: 'bottom-3 inset-x-2.5 mx-auto',
      containerClasses: 'w-[calc(100vw-20px)] max-w-full',
      maxWidth: '100%',
    };
  }

  if (isMobile) {
    // Celulares estándar (400px - 767px)
    return {
      isMobile: true,
      isSmallMobile: false,
      positionClasses: 'bottom-4 inset-x-3.5 mx-auto',
      containerClasses: 'w-[calc(100vw-28px)] max-w-md',
      maxWidth: '28rem',
    };
  }

  // Pantallas grandes (tablets horizontales, laptops, monitores >= 768px)
  return {
    isMobile: false,
    isSmallMobile: false,
    positionClasses: 'bottom-6 right-6 left-auto',
    containerClasses: 'w-full max-w-md',
    maxWidth: '28rem',
  };
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  const { width } = useScreenType();
  const layout = getToastLayout(width);

  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-notification-container"
      className={`fixed z-50 flex flex-col gap-2.5 pointer-events-none ${layout.positionClasses} ${layout.containerClasses}`}
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            id={toast.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border shadow-2xl backdrop-blur-md w-full min-w-0 transition-colors ${
              toast.type === 'success'
                ? 'bg-[#062419]/95 border-emerald-500/50 text-white shadow-emerald-950/50'
                : toast.type === 'error'
                ? 'bg-[#2b0c10]/95 border-rose-500/50 text-white shadow-rose-950/50'
                : toast.type === 'warning'
                ? 'bg-[#2b1a06]/95 border-amber-500/50 text-white shadow-amber-950/50'
                : 'bg-[#121216]/95 border-zinc-700/60 text-white shadow-black/60'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
              {toast.type === 'error' && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
            </div>
            
            <div className="flex-1 min-w-0 pr-1">
              <h4 className="text-xs sm:text-sm font-bold tracking-wide text-white break-words leading-snug">
                {toast.title}
              </h4>
              <p className="text-[11px] sm:text-xs text-zinc-200 mt-0.5 leading-relaxed break-words">
                {toast.message}
              </p>
            </div>

            <button
              id={`btn-dismiss-${toast.id}`}
              onClick={() => onDismiss(toast.id)}
              className="text-zinc-400 hover:text-white transition-colors p-1.5 -mr-1 -mt-1 rounded-lg hover:bg-white/10 shrink-0 cursor-pointer"
              title="Cerrar notificación"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4 shrink-0" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

