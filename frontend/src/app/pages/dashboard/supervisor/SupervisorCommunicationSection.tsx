import { Mail, AlertTriangle } from 'lucide-react';

const SupervisorCommunicationSection = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Signalements</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors shadow-lg shadow-amber-500/20">
                    <AlertTriangle size={18} />
                    Signaler Incident
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Messages Censeur */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Mail className="text-blue-400" size={24} />
                        <h3 className="text-xl font-semibold text-white">Messages Censeur</h3>
                    </div>
                    <div className="space-y-3">
                        {[
                            { sender: "Censeur", subject: "Surveillance 3ème B", date: "Aujourd'hui", unread: true },
                            { sender: "Censeur", subject: "Planning surveillance", date: "Hier", unread: false },
                        ].map((msg, idx) => (
                            <div key={idx} className={`p-3 rounded-lg border transition-colors ${msg.unread ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/5 border-white/5'}`}>
                                <div className="flex justify-between mb-1">
                                    <span className={`text-sm font-medium ${msg.unread ? 'text-white' : 'text-gray-300'}`}>{msg.sender}</span>
                                    <span className="text-xs text-gray-500">{msg.date}</span>
                                </div>
                                <p className="text-xs text-gray-400">{msg.subject}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Historique Signalements */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <AlertTriangle className="text-amber-400" size={24} />
                        <h3 className="text-xl font-semibold text-white">Mes Signalements</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-white">Bagarre cour récréation</span>
                                <span className="text-xs text-gray-500">Hier 10:15</span>
                            </div>
                            <p className="text-xs text-gray-400">Signalement transmis au Censeur.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupervisorCommunicationSection;
