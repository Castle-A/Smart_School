import { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeModalProps {
    isOpen: boolean;
    onClose: () => void;
    role: 'FOUNDER' | 'DIRECTOR' | 'ACCOUNTANT' | 'TEACHER';
    userName: string;
    schoolName?: string;
    plan?: string;
}

export default function WelcomeModal({ isOpen, onClose, role, userName, schoolName, plan }: WelcomeModalProps) {
    const [show, setShow] = useState(isOpen);

    useEffect(() => {
        setShow(isOpen);
    }, [isOpen]);

    const handleClose = () => {
        setShow(false);
        onClose();
    };

    const handleDontShowAgain = () => {
        sessionStorage.setItem(`welcome_modal_seen_${role}`, 'true');
        handleClose();
    };

    const getContent = () => {
        switch (role) {
            case 'FOUNDER':
                return {
                    title: `Bienvenue sur SmartSchool, ${schoolName || 'Fondateur'}`,
                    message: `Votre espace de gestion est prêt. Vous êtes actuellement sur le plan ${plan || 'STANDARD'}. Configurez votre école et invitez vos collaborateurs.`,
                    cta: "Gérer mon école"
                };
            case 'DIRECTOR':
                return {
                    title: `Bonjour ${userName}`,
                    message: "Voici un résumé de votre établissement pour aujourd'hui. Vérifiez les absences et validez les bulletins en attente.",
                    cta: "Voir le résumé"
                };
            case 'ACCOUNTANT':
                return {
                    title: `Bonjour ${userName}`,
                    message: "Voici les prochains paiements à surveiller et l'état de la trésorerie de l'école.",
                    cta: "Accéder à la trésorerie"
                };
            case 'TEACHER':
                return {
                    title: `Bonjour ${userName}`,
                    message: "Voici vos cours du jour et les dernières notifications de l'administration.",
                    cta: "Voir mon emploi du temps"
                };
            default:
                return {
                    title: "Bienvenue",
                    message: "Bienvenue sur votre tableau de bord SmartSchool.",
                    cta: "Commencer"
                };
        }
    };

    const content = getContent();

    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Decorative background elements */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-2xl" />

                        <div className="relative p-8">
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg rotate-3">
                                    <Sparkles className="w-8 h-8 text-white" />
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-3">
                                    {content.title}
                                </h2>

                                <p className="text-white/70 mb-8 leading-relaxed">
                                    {content.message}
                                </p>

                                <button
                                    onClick={handleClose}
                                    className="group w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 mb-4 shadow-lg shadow-indigo-500/20"
                                >
                                    {content.cta}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>

                                <button
                                    onClick={handleDontShowAgain}
                                    className="text-sm text-white/40 hover:text-white/60 transition-colors"
                                >
                                    Ne plus afficher ce message
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
