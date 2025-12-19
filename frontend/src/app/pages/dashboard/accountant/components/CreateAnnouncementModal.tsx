import React, { useState } from 'react';
import { X, Send, Users, Globe, Lock } from 'lucide-react';

interface CreateAnnouncementDto {
    title: string;
    content: string;
    scope: string; // GLOBAL, TEACHERS, ADMINISTRATION, PARENTS
}

interface CreateAnnouncementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateAnnouncementDto) => Promise<void>;
}

const SCOPES = [
    { value: 'GLOBAL', label: 'Toute l\'école (Public)', icon: Globe },
    { value: 'TEACHERS', label: 'Enseignants uniquement', icon: Users },
    { value: 'ADMINISTRATION', label: 'Administration uniquement', icon: Lock },
    { value: 'PARENTS', label: 'Parents d\'élèves', icon: Users },
];

const CreateAnnouncementModal: React.FC<CreateAnnouncementModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<CreateAnnouncementDto>({
        title: '',
        content: '',
        scope: 'GLOBAL'
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error("Error creating announcement", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-[#1a1b23] border border-white/10 rounded-xl w-full max-w-md shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white">Nouvelle Annonce</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Titre</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Sujet du message..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Destinataires</label>
                        <div className="grid grid-cols-1 gap-2">
                            {SCOPES.map(scope => {
                                const Icon = scope.icon;
                                return (
                                    <label key={scope.value} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${formData.scope === scope.value
                                            ? 'bg-indigo-600/20 border-indigo-500/50'
                                            : 'bg-black/20 border-white/5 hover:bg-white/5'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="scope"
                                            value={scope.value}
                                            checked={formData.scope === scope.value}
                                            onChange={e => setFormData({ ...formData, scope: e.target.value })}
                                            className="hidden"
                                        />
                                        <Icon size={18} className={formData.scope === scope.value ? 'text-indigo-400' : 'text-gray-400'} />
                                        <span className={`text-sm ${formData.scope === scope.value ? 'text-white font-medium' : 'text-gray-400'}`}>
                                            {scope.label}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Contenu</label>
                        <textarea
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 min-h-[150px]"
                            value={formData.content}
                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Votre message..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                        >
                            <Send size={16} />
                            {loading ? 'Envoi...' : 'Publier'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAnnouncementModal;
