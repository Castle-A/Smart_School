import { Mail, Bell, AlertTriangle } from 'lucide-react';

const CensorCommunicationSection = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Communication Disciplinaire</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-lg shadow-red-500/20">
                    <AlertTriangle size={18} />
                    Alerte Discipline
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Alertes Parents */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Mail className="text-amber-400" size={24} />
                        <h3 className="text-xl font-semibold text-white">Messages aux Parents</h3>
                    </div>
                    <div className="space-y-3">
                        {[
                            { parent: "M. Kouamé", student: "Kouamé Jean", subject: "Convocation urgente", date: "Aujourd'hui", status: "Envoyé" },
                            { parent: "Mme. Soro", student: "Soro Ali", subject: "Information sanction", date: "Hier", status: "Lu" },
                        ].map((msg, idx) => (
                            <div key={idx} className="p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium text-white">À : {msg.parent}</span>
                                    <span className="text-xs text-gray-500">{msg.date}</span>
                                </div>
                                <p className="text-xs text-gray-400 mb-1">Concernant : {msg.student} - {msg.subject}</p>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${msg.status === 'Lu' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'}`}>
                                    {msg.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Alertes Professeurs */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Bell className="text-blue-400" size={24} />
                        <h3 className="text-xl font-semibold text-white">Alertes Professeurs</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                            <div className="flex items-center gap-2 mb-1">
                                <AlertTriangle size={14} className="text-blue-400" />
                                <span className="text-sm font-medium text-white">Rappel Discipline 3ème B</span>
                            </div>
                            <p className="text-xs text-gray-300">Message envoyé aux professeurs de la 3ème B concernant le comportement global de la classe.</p>
                        </div>
                    </div>
                    <button className="w-full mt-4 py-2 text-sm text-gray-300 hover:text-white border border-white/10 hover:bg-white/5 rounded-lg transition-colors">
                        Envoyer un rappel aux professeurs
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CensorCommunicationSection;
