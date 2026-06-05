
import { useState } from 'react';
import { X, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../../../shared/api/api';

interface TicketCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
    schoolId?: string;
}

export default function TicketCreationModal({ isOpen, onClose, schoolId }: TicketCreationModalProps) {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('TECHNIQUE');
    const [priority, setPriority] = useState('MEDIUM');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus('idle');

        try {
            await api.post('/support/tickets', {
                subject,
                description,
                type,
                priority,
                schoolId,
            });
            setStatus('success');
            setTimeout(() => {
                onClose();
                resetForm();
            }, 2000);
        } catch (error) {
            console.error('Error creating ticket:', error);
            setStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setSubject('');
        setDescription('');
        setType('TECHNIQUE');
        setPriority('MEDIUM');
        setStatus('idle');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1e293b] border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between bg-slate-900/50">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Send size={20} className="text-blue-400" />
                        Nouveau Ticket de Support
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {status === 'success' ? (
                        <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
                            <CheckCircle2 size={48} className="text-emerald-500 mx-auto" />
                            <p className="text-white font-semibold">Ticket créé avec succès !</p>
                            <p className="text-slate-400 text-sm">Un agent vous répondra dans les plus brefs délais.</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase text-slate-500">Sujet</label>
                                <input
                                    required
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Ex: Problème de connexion, Erreur de facturation..."
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase text-slate-500">Type</label>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    >
                                        <option value="TECHNIQUE">Technique</option>
                                        <option value="FONCTIONNEL">Fonctionnel</option>
                                        <option value="FACTURATION">Facturation</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase text-slate-500">Priorité</label>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    >
                                        <option value="LOW">Basse</option>
                                        <option value="MEDIUM">Moyenne</option>
                                        <option value="HIGH">Haute</option>
                                        <option value="CRITICAL">Critique</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase text-slate-500">Description</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Décrivez votre problème en détail..."
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 resize-none"
                                />
                            </div>

                            {status === 'error' && (
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                                    <AlertCircle size={14} />
                                    Une erreur est survenue. Veuillez réessayer.
                                </div>
                            )}

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-950/40 transition-all flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? 'Envoi...' : (
                                        <>
                                            Envoyer ma demande
                                            <Send size={16} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}
