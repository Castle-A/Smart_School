import { useState, useEffect } from 'react';
import { DollarSign, Check, Download, RefreshCw } from 'lucide-react';
import api from '../../../../../shared/api/api';
import { toastEvents } from '../../../../../shared/utils/toast-events';

interface Payroll {
    id: string;
    month: string;
    year: number;
    baseSalary: number;
    bonus: number;
    deductions: number;
    netSalary: number;
    status: 'DRAFT' | 'PAID';
    teacher: {
        firstName: string;
        lastName: string;
        matricule?: string;
    };
    paymentDate?: string;
}

const MONTHS = [
    { value: '01', label: 'Janvier' }, { value: '02', label: 'Février' }, { value: '03', label: 'Mars' },
    { value: '04', label: 'Avril' }, { value: '05', label: 'Mai' }, { value: '06', label: 'Juin' },
    { value: '07', label: 'Juillet' }, { value: '08', label: 'Août' }, { value: '09', label: 'Septembre' },
    { value: '10', label: 'Octobre' }, { value: '11', label: 'Novembre' }, { value: '12', label: 'Décembre' },
];

const PayrollManager = () => {
    const [payrolls, setPayrolls] = useState<Payroll[]>([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().split('-')[1]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(false);

    // Edit Mode
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValues, setEditValues] = useState({ bonus: 0, deductions: 0 });

    const fetchPayroll = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/finance/payroll?month=${selectedYear}-${selectedMonth}&year=${selectedYear}`);
            setPayrolls(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        if (!confirm(`Générer la paie pour ${selectedMonth}/${selectedYear} ?`)) return;
        setLoading(true);
        try {
            await api.post('/finance/payroll/generate', { month: `${selectedYear}-${selectedMonth}`, year: selectedYear });
            fetchPayroll();
        } catch (error) {
            toastEvents.error("Erreur lors de la génération");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveEdit = async (id: string) => {
        try {
            await api.patch(`/finance/payroll/${id}`, {
                bonus: editValues.bonus,
                deductions: editValues.deductions
            });
            setEditingId(null);
            fetchPayroll();
        } catch (error) {
            toastEvents.error("Erreur sauvegarde modifications");
        }
    };

    const handleMarkPaid = async (id: string) => {
        if (!confirm("Marquer comme PAYÉ ? Cela génère la sortie de caisse.")) return;
        try {
            await api.patch(`/finance/payroll/${id}`, { status: 'PAID' });
            fetchPayroll();
        } catch (error) {
            toastEvents.error("Erreur validation");
        }
    };

    useEffect(() => {
        fetchPayroll();
    }, [selectedMonth, selectedYear]);

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 gap-4">
                <div className="flex items-center gap-4">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white"
                    >
                        {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white"
                    >
                        {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <button onClick={fetchPayroll} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 text-white">
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>

                <button
                    onClick={handleGenerate}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-bold transition-all"
                >
                    <DollarSign size={18} />
                    Générer la Paie ({MONTHS.find(m => m.value === selectedMonth)?.label})
                </button>
            </div>

            {/* Table */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-white/5 text-gray-200 uppercase font-medium">
                        <tr>
                            <th className="px-6 py-3">Enseignant</th>
                            <th className="px-6 py-3 text-right">Base</th>
                            <th className="px-6 py-3 text-right">Primes</th>
                            <th className="px-6 py-3 text-right">Retenues</th>
                            <th className="px-6 py-3 text-right font-bold text-white">Net à Payer</th>
                            <th className="px-6 py-3 text-center">Statut</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {payrolls.length === 0 ? (
                            <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">Aucun bulletin généré pour cette période.</td></tr>
                        ) : (
                            payrolls.map((payroll) => (
                                <tr key={payroll.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-white">{payroll.teacher.firstName} {payroll.teacher.lastName}</div>
                                        <div className="text-xs">{payroll.teacher.matricule || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">{payroll.baseSalary.toLocaleString()} F</td>

                                    {/* Editable Fields */}
                                    {editingId === payroll.id ? (
                                        <>
                                            <td className="px-6 py-4 text-right">
                                                <input
                                                    type="number" className="w-20 bg-black/40 border border-teal-500/50 rounded px-1 text-right text-white"
                                                    value={editValues.bonus} onChange={e => setEditValues({ ...editValues, bonus: Number(e.target.value) })}
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <input
                                                    type="number" className="w-20 bg-black/40 border border-rose-500/50 rounded px-1 text-right text-white"
                                                    value={editValues.deductions} onChange={e => setEditValues({ ...editValues, deductions: Number(e.target.value) })}
                                                />
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-6 py-4 text-right text-teal-400">+{payroll.bonus.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right text-rose-400">-{payroll.deductions.toLocaleString()}</td>
                                        </>
                                    )}

                                    <td className="px-6 py-4 text-right font-bold text-white text-base">
                                        {payroll.netSalary.toLocaleString()} F
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {payroll.status === 'PAID' ? (
                                            <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">PAYÉ</span>
                                        ) : (
                                            <span className="px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs">BROUILLON</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        {payroll.status !== 'PAID' && (
                                            editingId === payroll.id ? (
                                                <button onClick={() => handleSaveEdit(payroll.id)} className="text-emerald-400 hover:text-emerald-300">
                                                    <Check size={18} />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => { setEditingId(payroll.id); setEditValues({ bonus: payroll.bonus, deductions: payroll.deductions }); }}
                                                    className="text-gray-400 hover:text-white"
                                                >
                                                    ✎
                                                </button>
                                            )
                                        )}
                                        {payroll.status !== 'PAID' && (
                                            <button onClick={() => handleMarkPaid(payroll.id)} className="text-indigo-400 hover:text-indigo-300" title="Valider Paiement">
                                                <DollarSign size={18} />
                                            </button>
                                        )}
                                        {payroll.status === 'PAID' && (
                                            <button className="text-gray-500 hover:text-white" title="Télécharger Bulletin">
                                                <Download size={18} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="text-gray-400 text-xs mb-1">Masse Salariale Brute</div>
                    <div className="text-2xl font-bold text-white">{(payrolls.reduce((acc, p) => acc + p.netSalary, 0)).toLocaleString()} F</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="text-gray-400 text-xs mb-1">Total Payé</div>
                    <div className="text-2xl font-bold text-emerald-400">{(payrolls.filter(p => p.status === 'PAID').reduce((acc, p) => acc + p.netSalary, 0)).toLocaleString()} F</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="text-gray-400 text-xs mb-1">Reste à Payer</div>
                    <div className="text-2xl font-bold text-amber-400">{(payrolls.filter(p => p.status !== 'PAID').reduce((acc, p) => acc + p.netSalary, 0)).toLocaleString()} F</div>
                </div>
            </div>
        </div>
    );
};

export default PayrollManager;
