import { Mail, AlertTriangle, MessageSquare, Megaphone } from 'lucide-react';

const SurveillantCommunicationSection = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Communication & Signalements</h2>
                    <p className="text-gray-400">Messagerie interne et signalements rapides.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors shadow-lg shadow-amber-500/20">
                    <AlertTriangle size={18} />
                    Nouveau Signalement
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Messages Censeur */}
                <div className="bg-[#1e293b] rounded-xl border border-white/10 p-5 flex flex-col h-full hover:border-indigo-500/30 transition-colors">
                    <div className="flex items-center gap-3 mb-4 text-indigo-400">
                        <Mail size={20} />
                        <h3 className="font-bold text-white">Administration / Censeur</h3>
                    </div>
                    <div className="space-y-3 flex-1 overflow-y-auto max-h-64 pr-2 custom-scrollbar">
                        {[
                            { sender: "Censeur", subject: "Surveillance 3ème B - Urgent", date: "10:30", unread: true },
                            { sender: "Directeur", subject: "Réunion Vie Scolaire", date: "Hier", unread: false },
                            { sender: "Censeur", subject: "Planning de surveillance modifié", date: "Lun", unread: false },
                        ].map((msg, idx) => (
                            <div key={idx} className={`p-3 rounded-lg border transition-all cursor-pointer hover:bg-white/5 ${msg.unread ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-transparent border-white/5'}`}>
                                <div className="flex justify-between mb-1">
                                    <span className={`text-sm font-bold ${msg.unread ? 'text-white' : 'text-gray-400'}`}>{msg.sender}</span>
                                    <span className="text-[10px] text-gray-500">{msg.date}</span>
                                </div>
                                <p className={`text-xs ${msg.unread ? 'text-gray-200' : 'text-gray-500'} truncate`}>{msg.subject}</p>
                            </div>
                        ))}
                    </div>
                    <button className="mt-4 w-full py-2 text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 rounded-lg hover:bg-indigo-500/10 transition-colors">
                        Voir tout
                    </button>
                </div>

                {/* Parents / Eleves */}
                <div className="bg-[#1e293b] rounded-xl border border-white/10 p-5 flex flex-col h-full hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-center gap-3 mb-4 text-emerald-400">
                        <MessageSquare size={20} />
                        <h3 className="font-bold text-white">Parents & Élèves</h3>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-3">
                            <MessageSquare size={24} />
                        </div>
                        <p className="text-gray-400 text-sm mb-4">Aucun message non lu.</p>
                        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg transition-colors">
                            Ouvrir la messagerie
                        </button>
                    </div>
                </div>

                {/* Annonces Générales */}
                <div className="bg-[#1e293b] rounded-xl border border-white/10 p-5 flex flex-col h-full hover:border-purple-500/30 transition-colors">
                    <div className="flex items-center gap-3 mb-4 text-purple-400">
                        <Megaphone size={20} />
                        <h3 className="font-bold text-white">Annonces & Notes</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="p-3 rounded-lg border border-purple-500/20 bg-purple-500/5">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-bold text-purple-300 uppercase">Note de Service</span>
                                <span className="text-[10px] text-gray-500">23 Oct</span>
                            </div>
                            <p className="text-sm text-gray-300">Rappel sur les procédures de sortie des élèves.</p>
                        </div>
                        <div className="p-3 rounded-lg border border-white/5 bg-transparent">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-bold text-gray-400 uppercase">Événement</span>
                                <span className="text-[10px] text-gray-500">20 Oct</span>
                            </div>
                            <p className="text-sm text-gray-400">Conseil de classe 3ème A prévu le 25 Oct.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SurveillantCommunicationSection;
