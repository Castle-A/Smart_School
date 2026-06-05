import { useState, useEffect } from 'react';
import { Mail, AlertTriangle, MessageSquare, Send, Smartphone } from 'lucide-react';
import api from '../../../../shared/api/api';
import { toastEvents } from '../../../../shared/utils/toast-events';
import CreateAnnouncementModal from './components/CreateAnnouncementModal';

const AccountantCommunicationSection = () => {
    const [activeTab, setActiveTab] = useState<'announcements' | 'reminders'>('announcements');
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock Data for Reminders (Since we don't have a real heavy query for this in MVP yet)
    const [studentsWithDebt] = useState([
        { id: '1', name: 'Kouamé Jean', class: '3ème A', parent: 'M. Kouamé', phone: '+229 97000000', debit: 150000, lastReminder: '2023-12-01' },
        { id: '2', name: 'Diallo Awa', class: 'Tle D', parent: 'Mme. Diallo', phone: '+229 96000000', debit: 75000, lastReminder: null },
        { id: '3', name: 'Mensah Paul', class: '6ème B', parent: 'M. Mensah', phone: '+229 66000000', debit: 25000, lastReminder: '2023-11-20' },
    ]);

    const fetchAnnouncements = async () => {
        try {
            const res = await api.get('/communication/announcements');
            setAnnouncements(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (activeTab === 'announcements') fetchAnnouncements();
    }, [activeTab]);

    const handleCreateAnnouncement = async (data: any) => {
        await api.post('/communication/announcements', data);
        fetchAnnouncements();
    };

    const handleRemind = async (studentId: string, method: 'EMAIL' | 'SMS') => {
        if (!confirm(`Envoyer un rappel par ${method} ?`)) return;
        try {
            await api.post(`/communication/remind/${studentId}`, { method });
            toastEvents.success(`Rappel ${method} envoyé !`);
        } catch (error) {
            toastEvents.error('Erreur lors de l\'envoi');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Communication & Relances</h2>
                    <p className="text-gray-400 text-sm">Gérez les annonces internes et les relances financières</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/10 mb-6">
                <button
                    onClick={() => setActiveTab('announcements')}
                    className={`px-4 py-2 text-sm font-medium transition-colors relative ${activeTab === 'announcements' ? 'text-indigo-400' : 'text-gray-400 hover:text-white'}`}
                >
                    <div className="flex items-center gap-2">
                        <MessageSquare size={16} /> Annonces Interne
                    </div>
                    {activeTab === 'announcements' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full" />}
                </button>
                <button
                    onClick={() => setActiveTab('reminders')}
                    className={`px-4 py-2 text-sm font-medium transition-colors relative ${activeTab === 'reminders' ? 'text-indigo-400' : 'text-gray-400 hover:text-white'}`}
                >
                    <div className="flex items-center gap-2">
                        <AlertTriangle size={16} /> Relances Financières
                    </div>
                    {activeTab === 'reminders' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full" />}
                </button>
            </div>

            {/* Content */}
            {activeTab === 'announcements' ? (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                        >
                            <Send size={16} /> Nouvelle Annonce
                        </button>
                    </div>

                    <div className="grid gap-4">
                        {announcements.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">Aucune annonce publiée.</div>
                        ) : announcements.map((ann: any) => (
                            <div key={ann.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-white">{ann.title}</h3>
                                    <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">{ann.scope}</span>
                                </div>
                                <p className="text-gray-400 text-sm mb-3 whitespace-pre-wrap">{ann.content}</p>
                                <div className="flex justify-between items-center text-xs text-gray-500 border-t border-white/5 pt-3">
                                    <span>Par {ann.author.firstName} {ann.author.lastName} ({ann.author.role})</span>
                                    <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <CreateAnnouncementModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={handleCreateAnnouncement}
                    />
                </div>
            ) : (
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-amber-400">
                            <AlertTriangle size={20} />
                            <span className="font-semibold">Élèves en situation d'impayé (Simulé)</span>
                        </div>
                    </div>
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-gray-300 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Élève</th>
                                <th className="px-6 py-4">Classe</th>
                                <th className="px-6 py-4">Parent</th>
                                <th className="px-6 py-4 text-right">Montant Dû</th>
                                <th className="px-6 py-4 text-center">Dernière Relance</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {studentsWithDebt.map(student => (
                                <tr key={student.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{student.name}</td>
                                    <td className="px-6 py-4">{student.class}</td>
                                    <td className="px-6 py-4">
                                        <div>{student.parent}</div>
                                        <div className="text-xs text-gray-500">{student.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-red-400 font-bold">
                                        {student.debit.toLocaleString()} F
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {student.lastReminder ? new Date(student.lastReminder).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 flex justify-center gap-2">
                                        <button
                                            onClick={() => handleRemind(student.id, 'SMS')}
                                            className="p-2 hover:bg-white/10 rounded-lg text-amber-400 hover:text-amber-300 transition-colors"
                                            title="Envoyer SMS"
                                        >
                                            <Smartphone size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleRemind(student.id, 'EMAIL')}
                                            className="p-2 hover:bg-white/10 rounded-lg text-blue-400 hover:text-blue-300 transition-colors"
                                            title="Envoyer Email"
                                        >
                                            <Mail size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AccountantCommunicationSection;
