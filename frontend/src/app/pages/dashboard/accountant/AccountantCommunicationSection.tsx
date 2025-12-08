import { Mail, AlertTriangle, DollarSign } from 'lucide-react';

const AccountantCommunicationSection = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Communication Financière</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-lg shadow-red-500/20">
                    <AlertTriangle size={18} />
                    Alerte Impayés
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Rappels de Paiement */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <DollarSign className="text-amber-400" size={24} />
                        <h3 className="text-xl font-semibold text-white">Rappels de Paiement</h3>
                    </div>
                    <div className="space-y-3">
                        {[
                            { parent: "M. Kouamé", student: "Kouamé Jean (3ème)", amount: "150,000 FCFA", date: "Envoyé hier", status: "En attente" },
                            { parent: "Mme. Diallo", student: "Diallo Awa (Tle)", amount: "75,000 FCFA", date: "Envoyé il y a 3j", status: "Lu" },
                        ].map((item, idx) => (
                            <div key={idx} className="p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium text-white">{item.parent}</span>
                                    <span className="text-xs text-gray-500">{item.date}</span>
                                </div>
                                <p className="text-xs text-gray-400 mb-1">{item.student} - {item.amount}</p>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${item.status === 'Lu' ? 'bg-blue-500/20 text-blue-300' : 'bg-amber-500/20 text-amber-300'}`}>
                                    {item.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Alertes Financières */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Mail className="text-blue-400" size={24} />
                        <h3 className="text-xl font-semibold text-white">Alertes Financières</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                            <div className="flex items-center gap-2 mb-1">
                                <AlertTriangle size={14} className="text-red-400" />
                                <span className="text-sm font-medium text-white">Impayés 6ème B</span>
                            </div>
                            <p className="text-xs text-gray-300">45% des élèves de la classe ont des impayés dépassant 30 jours.</p>
                        </div>
                        <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                            <div className="flex items-center gap-2 mb-1">
                                <AlertTriangle size={14} className="text-amber-400" />
                                <span className="text-sm font-medium text-white">Échéance proche</span>
                            </div>
                            <p className="text-xs text-gray-300">Salaires du personnel à verser dans 5 jours.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountantCommunicationSection;
