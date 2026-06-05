import { useState, useEffect } from 'react';
import { supportApi } from '../services/api';
import { UserPlus, Mail, Phone, Copy, Check, Shield, User, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Agent {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    createdAt: string;
}

export default function ManageTeamPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phone: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createdUser, setCreatedUser] = useState<{ user: Agent, tempPassword: string } | null>(null);

    useEffect(() => {
        fetchAgents();
    }, []);

    const fetchAgents = async () => {
        try {
            const data = await supportApi.getSupportAgents();
            setAgents(data);
        } catch (error) {
            console.error('Failed to fetch agents', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const result = await supportApi.createSupportAgent(formData);
            setCreatedUser(result);
            fetchAgents(); // Refresh list
        } catch (error) {
            console.error('Failed to create agent', error);
            alert('Erreur lors de la création (Email peut-être déjà utilisé)');
        } finally {
            setIsSubmitting(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add toast here
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCreatedUser(null);
        setFormData({ email: '', firstName: '', lastName: '', phone: '' });
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white mb-2">Équipe Support</h1>
                    <p className="text-slate-400">Gérez les comptes des techniciens support</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors font-medium shadow-lg shadow-blue-900/20"
                >
                    <UserPlus size={18} />
                    Nouveau Membre
                </button>
            </header>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {agents.map((agent) => (
                        <motion.div
                            key={agent.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 relative group hover:border-blue-500/30 transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500 font-bold text-xl">
                                    {agent.firstName[0]}{agent.lastName[0]}
                                </div>
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${agent.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {agent.isActive ? 'Actif' : 'Inactif'}
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-1">{agent.firstName} {agent.lastName}</h3>

                            <div className="space-y-2 mt-4 text-sm text-slate-400">
                                <div className="flex items-center gap-2">
                                    <Mail size={14} />
                                    <span>{agent.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Shield size={14} />
                                    <span>Support Tech</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-500 flex justify-between">
                                <span>Membre depuis</span>
                                <span>{new Date(agent.createdAt).toLocaleDateString()}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal de Création */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-white">Ajouter un Technicien</h2>
                                <button onClick={closeModal} className="text-slate-400 hover:text-white"><X size={20} /></button>
                            </div>

                            {!createdUser ? (
                                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-400">Prénom</label>
                                            <input
                                                required
                                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={formData.firstName}
                                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-400">Nom</label>
                                            <input
                                                required
                                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={formData.lastName}
                                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Email</label>
                                        <input
                                            required
                                            type="email"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Téléphone (Optionnel)</label>
                                        <input
                                            type="tel"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>

                                    <div className="pt-4 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                                        >
                                            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                                            Créer le compte
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="p-8 text-center space-y-6">
                                    <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Check size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Compte créé avec succès !</h3>
                                    <p className="text-slate-400">
                                        Veuillez transmettre ces informations au technicien immédiatement.
                                        Elles ne seront plus affichées.
                                    </p>

                                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-left space-y-3">
                                        <div className="flex justify-between items-center group">
                                            <span className="text-slate-500 text-sm">Identifiant</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-white select-all">{createdUser.user.email}</span>
                                                <button onClick={() => copyToClipboard(createdUser.user.email)} className="text-slate-600 hover:text-white">
                                                    <Copy size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center group">
                                            <span className="text-slate-500 text-sm">Mot de passe temporaire</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-green-400 font-bold select-all">{createdUser.tempPassword}</span>
                                                <button onClick={() => copyToClipboard(createdUser.tempPassword)} className="text-slate-600 hover:text-white">
                                                    <Copy size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={closeModal}
                                        className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors mt-6"
                                    >
                                        Fermer
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
