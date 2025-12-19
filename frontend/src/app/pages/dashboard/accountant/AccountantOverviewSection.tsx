import { DollarSign, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

const AccountantOverviewSection = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Vue d'ensemble Comptable</h2>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                            <DollarSign className="text-indigo-400" size={20} />
                        </div>
                        <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">+12%</span>
                    </div>
                    <p className="text-gray-400 text-sm">Chiffre d'Affaires (Mois)</p>
                    <h3 className="text-2xl font-bold text-white mt-1">0 FCFA</h3>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <TrendingUp className="text-emerald-400" size={20} />
                        </div>
                        <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">78%</span>
                    </div>
                    <p className="text-gray-400 text-sm">Taux de Recouvrement</p>
                    <h3 className="text-2xl font-bold text-white mt-1">0 / 0</h3>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-red-500/10 rounded-lg">
                            <TrendingDown className="text-red-400" size={20} />
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm">Dépenses (Mois)</p>
                    <h3 className="text-2xl font-bold text-white mt-1">0 FCFA</h3>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                            <AlertCircle className="text-amber-400" size={20} />
                        </div>
                        <span className="text-xs font-medium text-amber-400 bg-amber-500/10 px-2 py-1 rounded">Action requise</span>
                    </div>
                    <p className="text-gray-400 text-sm">Paiements en Attente</p>
                    <h3 className="text-2xl font-bold text-white mt-1">0</h3>
                </div>
            </div>

            {/* Quick Actions Placeholder */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Actions Rapides</h3>
                <div className="flex gap-4">
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                        Nouveau Paiement
                    </button>
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg transition-colors">
                        Saisir Dépense
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Charts Placeholder */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-64 flex items-center justify-center text-gray-500">
                    Graphique: Évolution CA (À venir)
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-64 flex items-center justify-center text-gray-500">
                    Graphique: Dépenses par Catégorie (À venir)
                </div>
            </div>
        </div>
    );
};

export default AccountantOverviewSection;
