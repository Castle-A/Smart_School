import { useState, useEffect } from 'react';
import { Plus, Archive } from 'lucide-react';
import api from '../../../../../shared/api/api';

interface Expense {
    id: string;
    category: string;
    amount: number;
    reason: string;
    beneficiary: string;
    date: string;
    createdBy: { email: string };
}

const EXPENSE_CATEGORIES = [
    'SALAIRE', 'LOYER', 'ELECTRICITE', 'EAU', 'ENTRETIEN', 'FOURNITURES', 'COMMUNICATION', 'AUTRE'
];

const ExpensesManager = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [category, setCategory] = useState("AUTRE");
    const [amount, setAmount] = useState(0);
    const [reason, setReason] = useState("");
    const [beneficiary, setBeneficiary] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const fetchExpenses = async () => {
        try {
            const res = await api.get('/finance/expenses');
            setExpenses(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/finance/expenses', {
                category, amount, reason, beneficiary, date
            });
            setShowForm(false);
            setAmount(0);
            setReason("");
            setBeneficiary("");
            fetchExpenses();
        } catch (error) {
            alert("Erreur lors de l'ajout de la dépense");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Journal des Dépenses</h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded-lg text-white font-medium transition-colors"
                >
                    <Plus size={18} />
                    Nouvelle Dépense
                </button>
            </div>

            {showForm && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 animate-in fade-in slide-in-from-top-4">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Catégorie</label>
                            <select
                                value={category} onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white"
                            >
                                {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Date</label>
                            <input
                                type="date" value={date} onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Montant (FCFA)</label>
                            <input
                                type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Motif / Libellé</label>
                            <input
                                type="text" value={reason} onChange={(e) => setReason(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-400 mb-1">Bénéficiaire (Optionnel)</label>
                            <input
                                type="text" value={beneficiary} onChange={(e) => setBeneficiary(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white"
                            />
                        </div>
                        <div className="md:col-span-2 text-right">
                            <button type="submit" className="px-6 py-2 bg-indigo-600 rounded-lg text-white font-bold hover:bg-indigo-500">
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-white/5 text-gray-200 uppercase font-medium">
                        <tr>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Catégorie</th>
                            <th className="px-6 py-3">Motif</th>
                            <th className="px-6 py-3 text-right">Montant</th>
                            <th className="px-6 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {expenses.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Aucune dépense enregistrée</td></tr>
                        ) : (
                            expenses.map((expense) => (
                                <tr key={expense.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">{new Date(expense.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-white">{expense.reason}</div>
                                        <div className="text-xs">{expense.beneficiary}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-white">
                                        - {expense.amount.toLocaleString()} F
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-500 hover:text-white"><Archive size={16} /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExpensesManager;
