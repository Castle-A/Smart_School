import { Mail, Send, FileText } from 'lucide-react';

const SecretaryCommunicationSection = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Communication Administrative</h2>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20">
                        <FileText size={18} />
                        Envoyer Convocation
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/10">
                        <Send size={18} />
                        Message Parents
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Historique Convocations */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <FileText className="text-amber-400" size={24} />
                        <h3 className="text-xl font-semibold text-white">Convocations Envoyées</h3>
                    </div>
                    <div className="space-y-3">
                        {[
                            { parent: "M. Kouamé", student: "Kouamé Jean (3ème)", reason: "Discipline", date: "12 Nov", status: "Envoyée" },
                            { parent: "Mme. Diallo", student: "Diallo Awa (Tle)", reason: "Absences", date: "10 Nov", status: "Reçue" },
                        ].map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                                <div>
                                    <p className="text-sm font-medium text-white">{item.parent}</p>
                                    <p className="text-xs text-gray-400">Pour: {item.student} • Motif: {item.reason}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-gray-500 block">{item.date}</span>
                                    <span className="text-[10px] text-emerald-400">{item.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Messages Parents */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Mail className="text-blue-400" size={24} />
                        <h3 className="text-xl font-semibold text-white">Messages Administratifs</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-white">Rappel Inscription Cantine</span>
                                <span className="text-xs text-gray-500">Hier</span>
                            </div>
                            <p className="text-xs text-gray-400 line-clamp-2">Message envoyé à tous les parents concernant la date limite d'inscription à la cantine...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecretaryCommunicationSection;
