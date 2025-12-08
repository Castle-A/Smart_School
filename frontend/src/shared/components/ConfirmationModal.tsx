import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isDanger?: boolean;
}

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirmer',
    cancelLabel = 'Annuler',
    isDanger = false
}: ConfirmationModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl max-w-md w-full relative shadow-2xl overflow-hidden scale-100 animate-in fade-in zoom-in duration-200">
                {/* Header with Icon */}
                <div className={`h-2 ${isDanger ? 'bg-red-500' : 'bg-indigo-500'}`}></div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors"
                >
                    <X size={18} />
                </button>

                <div className="p-6 text-center">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDanger ? 'bg-red-500/20 text-red-500' : 'bg-indigo-500/20 text-indigo-400'}`}>
                        <AlertTriangle size={32} />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>

                    <div className="text-gray-300 text-sm mb-8 whitespace-pre-wrap leading-relaxed">
                        {message}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors font-medium border border-white/5"
                        >
                            {cancelLabel}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`flex-1 px-4 py-2.5 text-white rounded-lg transition-colors font-medium shadow-lg ${isDanger
                                    ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
                                }`}
                        >
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
