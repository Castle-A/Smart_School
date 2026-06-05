import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { toastEvents, type ToastEvent } from '../utils/toast-events';

export interface ToastMessage {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
}

const ToastContainer = () => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    useEffect(() => {
        const unsubscribe = toastEvents.subscribe(({ type, message }: ToastEvent) => {
            const id = Math.random().toString(36).substr(2, 9);
            setToasts(prev => [...prev, { id, type, message }]);

            // Auto remove after 5s
            setTimeout(() => {
                removeToast(id);
            }, 5000);
        });

        return () => unsubscribe();
    }, []);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="fixed top-4 right-4 z-[2000] flex flex-col gap-2">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.9 }}
                        layout
                        className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md border border-white/10 min-w-[300px] max-w-sm ${toast.type === 'success' ? 'bg-[#0f172a]/90 text-emerald-400' :
                            toast.type === 'error' ? 'bg-[#0f172a]/90 text-red-400' :
                                toast.type === 'warning' ? 'bg-[#0f172a]/90 text-amber-400' :
                                    'bg-[#0f172a]/90 text-blue-400'
                            }`}
                    >
                        <div className="mt-0.5">
                            {toast.type === 'success' && <CheckCircle size={18} />}
                            {toast.type === 'error' && <XCircle size={18} />}
                            {toast.type === 'warning' && <AlertCircle size={18} />}
                            {toast.type === 'info' && <Info size={18} />}
                        </div>
                        <p className="text-sm font-medium text-gray-200 flex-1 leading-relaxed">
                            {toast.message}
                        </p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-gray-500 hover:text-white transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ToastContainer;
