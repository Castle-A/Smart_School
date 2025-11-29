import { DollarSign, TrendingUp, TrendingDown, FileText, Download, AlertCircle } from 'lucide-react';

export default function AccountingSection() {
    // Mock data - in real app, check permissions to see if read-only
    const isReadOnly = true; // Founder is read-only if Accountant exists

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Comptabilité</h2>
                <div className="flex gap-3">
                    {isReadOnly && (
                        <span className="px-3 py-2 bg-yellow-500/10 text-yellow-400 text-xs font-bold rounded-xl border border-yellow-500/20 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Mode Lecture Seule
                        </span>
                    )}
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Exporter
                    </button>
                </div>
            </div>

            {/* Financial Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-green-500/10 text-green-400">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <span className="text-xs text-green-400 font-medium flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> +15%
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">12.5M</h3>
                    <p className="text-white/60 text-sm">Recettes du mois (FCFA)</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-red-500/10 text-red-400">
                            <TrendingDown className="w-6 h-6" />
                        </div>
                        <span className="text-xs text-red-400 font-medium flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> +5%
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">2.1M</h3>
                    <p className="text-white/60 text-sm">Impayés (FCFA)</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                            <FileText className="w-6 h-6" />
                        </div>
                        <span className="text-xs text-white/40 font-medium">85% Recouvrement</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">85%</h3>
                    <p className="text-white/60 text-sm">Taux de recouvrement</p>
                </div>
            </div>

            {/* Recent Transactions & Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-6">Flux de Trésorerie</h3>
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-white/10 rounded-xl">
                        <p className="text-white/40">Graphique des flux (Recettes vs Dépenses)</p>
                    </div>
                </div>

                <div className="lg:col-span-1 bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-6">Dernières Transactions</h3>
                    <div className="space-y-4">
                        {[
                            { label: "Scolarité - Jean K.", amount: "+ 150,000", date: "Aujourd'hui", type: "in" },
                            { label: "Achat matériel", amount: "- 45,000", date: "Hier", type: "out" },
                            { label: "Scolarité - Marie A.", amount: "+ 75,000", date: "Hier", type: "in" },
                            { label: "Salaire Gardien", amount: "- 60,000", date: "26 Nov", type: "out" },
                        ].map((tx, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                <div>
                                    <p className="text-white font-medium text-sm">{tx.label}</p>
                                    <p className="text-white/40 text-xs">{tx.date}</p>
                                </div>
                                <span className={`font-bold text-sm ${tx.type === 'in' ? 'text-green-400' : 'text-red-400'}`}>
                                    {tx.amount}
                                </span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 text-center text-sm text-purple-400 hover:text-purple-300 font-medium">
                        Voir tout l'historique
                    </button>
                </div>
            </div>
        </div>
    );
}
