import { Check, Copy } from 'lucide-react';

interface SuccessCredentialsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onReset: () => void;
    credentials: {
        identifier: string;
        password: string;
    };
}

const SuccessCredentialsModal = ({ isOpen, onClose, onReset, credentials }: SuccessCredentialsModalProps) => {
    if (!isOpen) return null;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add a toast here
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl transform transition-all scale-100 opacity-100">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="text-green-500" size={32} />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">Membre créé avec succès !</h2>
                    <p className="text-white/70 mb-8">
                        Voici les identifiants de connexion pour le nouveau membre.
                        <br />
                        Veuillez les copier et les transmettre à l'utilisateur de manière sécurisée.
                    </p>

                    <div className="bg-black/30 rounded-xl p-6 mb-8 text-left space-y-4 border border-white/5">
                        <div>
                            <label className="text-xs text-white/50 uppercase tracking-wider font-semibold">Identifiant</label>
                            <div className="flex items-center justify-between mt-1 bg-white/5 p-3 rounded-lg border border-white/10">
                                <code className="text-indigo-300 font-mono text-lg">{credentials.identifier}</code>
                                <button
                                    onClick={() => copyToClipboard(credentials.identifier)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
                                    title="Copier l'identifiant"
                                >
                                    <Copy size={18} />
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-white/50 uppercase tracking-wider font-semibold">Mot de passe temporaire</label>
                            <div className="flex items-center justify-between mt-1 bg-white/5 p-3 rounded-lg border border-white/10">
                                <code className="text-indigo-300 font-mono text-lg">{credentials.password}</code>
                                <button
                                    onClick={() => copyToClipboard(credentials.password)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
                                    title="Copier le mot de passe"
                                >
                                    <Copy size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={onReset}
                            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors w-full sm:w-auto"
                        >
                            Créer un autre membre
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors w-full sm:w-auto shadow-lg shadow-indigo-500/20"
                        >
                            Retour à l'administration
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessCredentialsModal;
