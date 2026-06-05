import { DollarSign, TrendingUp, TrendingDown, PieChart, FileText, Download, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import AccountantAdministrationSection from '../accountant/AccountantAdministrationSection';

const ComptabiliteSection = () => {
    const [view, setView] = useState<'dashboard' | 'admin'>('dashboard');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-white">Comptabilité & Finances</h2>
                    <div className="flex bg-white/10 rounded-lg p-1">
                        <button onClick={() => setView('dashboard')} className={`px-3 py-1 text-sm rounded-md transition-colors ${view === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}>Vue d'ensemble</button>
                        <button onClick={() => setView('admin')} className={`px-3 py-1 text-sm rounded-md transition-colors ${view === 'admin' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}>Salaires & RH</button>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/10">
                        <Download size={18} />
                        Export Excel
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20">
                        <FileText size={18} />
                        Rapport PDF
                    </button>
                </div>
            </div>

            {view === 'dashboard' ? (
                <div className="space-y-6">
                    {/* Tableaux de bord financiers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: "Recettes Mensuelles", value: "12.5M FCFA", trend: "+15%", icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                            { label: "Taux de Recouvrement", value: "87%", trend: "+2%", icon: PieChart, color: "text-blue-400", bg: "bg-blue-500/10" },
                            { label: "Impayés", value: "3.2M FCFA", trend: "-5%", icon: TrendingDown, color: "text-red-400", bg: "bg-red-500/10" },
                            { label: "Prévisions (Fin mois)", value: "14.1M FCFA", trend: "+8%", icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/10" }
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <div className={`p-2.5 rounded-lg ${stat.bg} ${stat.color}`}>
                                        <stat.icon size={20} />
                                    </div>
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {stat.trend}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                                <p className="text-xs text-slate-400">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Outils d'analyse */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Graphique Flux de Trésorerie */}
                        <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-white">Flux de Trésorerie</h3>
                                <select className="bg-white/10 border border-white/20 text-xs text-slate-300 rounded px-2 py-1 outline-none">
                                    <option>Cette année</option>
                                    <option>L'année dernière</option>
                                </select>
                            </div>
                            <div className="h-64 flex items-end justify-between gap-2 px-2">
                                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                                    <div key={i} className="w-full flex flex-col justify-end gap-1 group cursor-pointer">
                                        <div className="w-full bg-indigo-500/30 group-hover:bg-indigo-500/50 rounded-t-sm transition-all relative" style={{ height: `${h}%` }}>
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border border-white/20">
                                                {h * 100}k FCFA
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-4 text-xs text-slate-500 uppercase font-medium">
                                {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'].map(m => <span key={m}>{m}</span>)}
                            </div>
                        </div>

                        {/* Répartition & Alertes */}
                        <div className="space-y-6">
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Répartition Paiements</h3>
                                <div className="space-y-4">
                                    {[
                                        { label: "Lycée", value: 45, color: "bg-indigo-500" },
                                        { label: "Collège", value: 30, color: "bg-blue-500" },
                                        { label: "Primaire", value: 25, color: "bg-emerald-500" }
                                    ].map((item, idx) => (
                                        <div key={idx}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-slate-300">{item.label}</span>
                                                <span className="text-white font-medium">{item.value}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-red-500/5 backdrop-blur-sm border border-red-500/20 rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <AlertTriangle className="text-red-400" size={20} />
                                    <h3 className="text-lg font-semibold text-red-300">Alertes Budget</h3>
                                </div>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2 text-sm text-red-200/80">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5"></span>
                                        Dépassement budget maintenance (+12%)
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-red-200/80">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5"></span>
                                        Retard paiements 6ème B (45% impayés)
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Historique & Reporting */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Dernières Transactions</h3>
                            <button className="text-sm text-indigo-400 hover:text-indigo-300">Voir tout l'historique</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="text-xs uppercase bg-white/10 text-slate-300">
                                    <tr>
                                        <th className="px-4 py-3 rounded-l-lg">Date</th>
                                        <th className="px-4 py-3">Libellé</th>
                                        <th className="px-4 py-3">Catégorie</th>
                                        <th className="px-4 py-3">Montant</th>
                                        <th className="px-4 py-3 rounded-r-lg">Statut</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {[
                                        { date: "28 Nov", label: "Scolarité - Jean K.", cat: "Recette", amount: "+ 150.000", status: "Validé" },
                                        { date: "28 Nov", label: "Achat Fournitures", cat: "Dépense", amount: "- 45.000", status: "En attente" },
                                        { date: "27 Nov", label: "Scolarité - Marie A.", cat: "Recette", amount: "+ 75.000", status: "Validé" },
                                    ].map((row, idx) => (
                                        <tr key={idx} className="hover:bg-white/10 transition-colors">
                                            <td className="px-4 py-3">{row.date}</td>
                                            <td className="px-4 py-3 font-medium text-white">{row.label}</td>
                                            <td className="px-4 py-3">{row.cat}</td>
                                            <td className={`px-4 py-3 font-bold ${row.cat === 'Recette' ? 'text-emerald-400' : 'text-red-400'}`}>{row.amount}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded text-xs ${row.status === 'Validé' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <AccountantAdministrationSection readOnly={true} />
            )}
        </div>
    );
};

export default ComptabiliteSection;
