import { useState, useEffect } from 'react';
import { Search, Download, Calendar as CalendarIcon, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import api from '../../../../shared/api/api';

interface Transaction {
    id: string;
    date: string;
    type: 'INCOME' | 'EXPENSE';
    category: string;
    amount: number;
    description: string;
    status: string;
    source: string;
    reference?: string;
}

const AccountantHistorySection = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (dateRange.start) params.append('startDate', dateRange.start);
            if (dateRange.end) params.append('endDate', dateRange.end);

            const res = await api.get(`/finance/history?${params.toString()}`);
            setTransactions(res.data);
        } catch (error) {
            console.error("Error fetching history", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [dateRange]);

    const filtered = transactions.filter(t =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.reference && t.reference.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalIncome = filtered.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = filtered.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);
    const balance = totalIncome - totalExpense;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Historique & Archives</h2>
                    <p className="text-gray-400 text-sm">Grand Livre des opérations financières</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/10">
                        <Download size={18} />
                        Export Excel
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20">
                        <Download size={18} />
                        Export PDF
                    </button>
                </div>
            </div>

            {/* Filters & KPI */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-3 bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text" placeholder="Rechercher (Référence, Libellé...)"
                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <CalendarIcon size={18} className="text-gray-400" />
                        <input
                            type="date"
                            className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                            value={dateRange.start}
                            onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
                        />
                        <span className="text-gray-500">-</span>
                        <input
                            type="date"
                            className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                            value={dateRange.end}
                            onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
                        />
                    </div>
                </div>
                <div className={`bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-center ${balance >= 0 ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-red-500'}`}>
                    <span className="text-gray-400 text-xs uppercase font-medium">Solde Période</span>
                    <span className={`text-xl font-bold font-mono ${balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {balance > 0 ? '+' : ''}{balance.toLocaleString()} F
                    </span>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-gray-300 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Catégorie</th>
                                <th className="px-6 py-4">Libellé</th>
                                <th className="px-6 py-4 text-right">Montant</th>
                                <th className="px-6 py-4 text-center">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-8">Chargement...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-8">Aucune transaction trouvée</td></tr>
                            ) : filtered.map((t) => (
                                <tr key={t.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(t.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        <div className="text-xs text-gray-500">{new Date(t.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {t.type === 'INCOME' ? (
                                            <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded text-xs">
                                                <ArrowDownLeft size={12} /> Recette
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-red-400 bg-red-500/10 px-2 py-1 rounded text-xs">
                                                <ArrowUpRight size={12} /> Dépense
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-white font-medium">{t.category}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-white">{t.description}</div>
                                        {t.reference && <div className="text-xs text-gray-500 mt-1">Ref: {t.reference}</div>}
                                    </td>
                                    <td className={`px-6 py-4 text-right font-mono font-bold ${t.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {t.type === 'INCOME' ? '+' : '-'} {t.amount.toLocaleString()} F
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs font-medium border border-emerald-500/20">
                                            {t.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AccountantHistorySection;
