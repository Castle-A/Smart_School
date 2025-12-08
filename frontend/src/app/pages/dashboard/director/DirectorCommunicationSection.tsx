import { Mail, Bell, Send, Clock, CheckCircle } from 'lucide-react';

const DirectorCommunicationSection = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Communication</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20">
                    <Send size={18} />
                    Nouveau Message
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Messagerie */}
                <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Mail className="text-blue-400" size={24} />
                            <h3 className="text-xl font-semibold text-white">Messagerie</h3>
                        </div>
                        <div className="flex gap-2">
                            <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-full border border-indigo-500/30">Profs</span>
                            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-full border border-emerald-500/30">Parents</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {[
                            { sender: "M. Koffi (Prof Math)", subject: "Absence prévue", preview: "Je ne pourrai pas assurer mon cours de demain...", time: "10:30", unread: true, avatar: "K" },
                            { sender: "Mme. Diallo (Parent)", subject: "Rendez-vous", preview: "Je souhaiterais vous rencontrer concernant...", time: "Hier", unread: false, avatar: "D" },
                        ].map((msg, idx) => (
                            <div key={idx} className={`p-4 rounded-lg cursor-pointer transition-all ${msg.unread ? 'bg-indigo-500/10 border border-indigo-500/30' : 'bg-white/5 hover:bg-white/10 border border-transparent'}`}>
                                <div className="flex gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${msg.unread ? 'bg-indigo-500' : 'bg-gray-700'}`}>
                                        {msg.avatar}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`font-semibold ${msg.unread ? 'text-white' : 'text-gray-300'}`}>{msg.sender}</span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12} /> {msg.time}</span>
                                        </div>
                                        <h4 className={`text-sm font-medium mb-1 truncate ${msg.unread ? 'text-indigo-200' : 'text-gray-400'}`}>{msg.subject}</h4>
                                        <p className="text-xs text-gray-500 line-clamp-2">{msg.preview}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Notifications */}
                <div className="space-y-6">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Bell className="text-amber-400" size={20} />
                            <h3 className="text-lg font-semibold text-white">Notifications</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex gap-3 items-start p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/10">
                                <CheckCircle size={16} className="text-emerald-400 mt-1 shrink-0" />
                                <div>
                                    <p className="text-sm text-white font-medium">Bulletins à valider</p>
                                    <p className="text-xs text-gray-400">3 classes en attente</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DirectorCommunicationSection;
