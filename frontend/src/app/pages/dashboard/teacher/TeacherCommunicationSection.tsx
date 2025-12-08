import { Mail, Send, Clock } from 'lucide-react';

const TeacherCommunicationSection = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Communication</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20">
                    <Send size={18} />
                    Nouveau Message
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Messages Parents */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Mail className="text-blue-400" size={24} />
                        <h3 className="text-xl font-semibold text-white">Messages Parents</h3>
                    </div>
                    <div className="space-y-3">
                        {[
                            { parent: "M. Kouamé", student: "Kouamé Jean (3ème A)", subject: "Résultats DS", date: "Aujourd'hui", unread: true },
                            { parent: "Mme. Diallo", student: "Diallo Awa (Tle D)", subject: "Orientation", date: "Hier", unread: false },
                        ].map((msg, idx) => (
                            <div key={idx} className={`p-3 rounded-lg border transition-colors cursor-pointer ${msg.unread ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                                <div className="flex justify-between mb-1">
                                    <span className={`text-sm font-medium ${msg.unread ? 'text-white' : 'text-gray-300'}`}>{msg.parent}</span>
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <Clock size={12} />
                                        {msg.date}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 mb-1">{msg.student}</p>
                                <p className={`text-sm ${msg.unread ? 'text-indigo-200' : 'text-gray-400'}`}>{msg.subject}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Messages Administration */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Mail className="text-emerald-400" size={24} />
                        <h3 className="text-xl font-semibold text-white">Messages Administration</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-white">Direction</span>
                                <span className="text-xs text-gray-500">Hier</span>
                            </div>
                            <p className="text-sm text-gray-400">Réunion pédagogique - Vendredi 15h00</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-white">Censeur</span>
                                <span className="text-xs text-gray-500">26 Nov</span>
                            </div>
                            <p className="text-sm text-gray-400">Surveillance 3ème B - Rappel discipline</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherCommunicationSection;
