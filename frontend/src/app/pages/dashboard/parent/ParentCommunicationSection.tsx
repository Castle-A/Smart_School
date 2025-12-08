import { Mail, Send, Clock, Bell } from 'lucide-react';

const ParentCommunicationSection = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Communication</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20">
                    <Send size={18} />
                    Contacter un Professeur
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Messages Professeurs */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Mail className="text-blue-400" size={24} />
                        <h3 className="text-xl font-semibold text-white">Messages Professeurs</h3>
                    </div>
                    <div className="space-y-3">
                        {[
                            { teacher: "M. Koffi (Math)", subject: "Résultats DS", date: "Aujourd'hui", unread: true },
                            { teacher: "Mme. Diallo (Français)", subject: "Félicitations", date: "Hier", unread: false },
                        ].map((msg, idx) => (
                            <div key={idx} className={`p-3 rounded-lg border transition-colors cursor-pointer ${msg.unread ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                                <div className="flex justify-between mb-1">
                                    <span className={`text-sm font-medium ${msg.unread ? 'text-white' : 'text-gray-300'}`}>{msg.teacher}</span>
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <Clock size={12} />
                                        {msg.date}
                                    </span>
                                </div>
                                <p className={`text-sm ${msg.unread ? 'text-indigo-200' : 'text-gray-400'}`}>{msg.subject}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Notifications École */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Bell className="text-amber-400" size={24} />
                        <h3 className="text-xl font-semibold text-white">Notifications École</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-white">Réunion Parents-Profs</span>
                                <span className="text-xs text-gray-500">2 jours</span>
                            </div>
                            <p className="text-sm text-gray-300">Samedi 02 Décembre à 14h00</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-white">Paiement Scolarité</span>
                                <span className="text-xs text-gray-500">5 jours</span>
                            </div>
                            <p className="text-sm text-gray-300">Échéance : 05 Décembre 2024</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentCommunicationSection;
