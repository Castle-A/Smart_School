import { useState } from 'react';
import { Search, CreditCard, Check } from 'lucide-react';
import api from '../../../../../shared/api/api';

// Interface for Student Finance Summary (To be defined in backend)
interface StudentFinanceSummary {
    id: string;
    firstName: string;
    lastName: string;
    matricule: string;
    class: { name: string };
    totalDue: number;
    totalPaid: number;
    balance: number; // Positive = Due, Negative or Zero = Paid
    lastPaymentDate?: string;
}

const TuitionManager = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState<StudentFinanceSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<StudentFinanceSummary | null>(null);

    // Payment Form State
    const [paymentAmount, setPaymentAmount] = useState<number>(0);
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [paymentReason, setPaymentReason] = useState('SCOLARITE_MENSUELLE');
    const [paymentReference, setPaymentReference] = useState('');
    const [processingPayment, setProcessingPayment] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setLoading(true);
        try {
            const res = await api.get(`/finance/students?search=${searchTerm}`);
            setStudents(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectStudent = (student: StudentFinanceSummary) => {
        setSelectedStudent(student);
        setPaymentAmount(Math.max(0, student.balance)); // Default to remaining balance
    };

    const handleSubmitPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStudent || paymentAmount <= 0) return;

        setProcessingPayment(true);
        try {
            const res = await api.post('/finance/payments', {
                studentId: selectedStudent.id,
                amount: paymentAmount,
                method: paymentMethod,
                reason: paymentReason,
                reference: paymentReference
            });
            alert(`Paiement de ${paymentAmount} FCFA enregistré pour ${selectedStudent.firstName} ! Reçu généré.`);

            // Download PDF from Backend
            try {
                const pdfRes = await api.get(`/finance/receipt/${res.data.id}`, { responseType: 'blob' });
                const url = window.URL.createObjectURL(new Blob([pdfRes.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Recu_${selectedStudent.matricule}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            } catch (err) {
                console.error("Erreur téléchargement reçu", err);
            }

            setSelectedStudent(null);
            setPaymentAmount(0);
            setPaymentReference('');
            handleSearch({ preventDefault: () => { } } as any); // Refresh
        } catch (error) {
            alert("Erreur lors du paiement");
        } finally {
            setProcessingPayment(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Left: Search & List */}
                <div className="w-full md:w-1/2 space-y-6">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Rechercher par Nom ou Matricule..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                        <Search className="absolute left-3 top-3.5 text-gray-500" size={18} />
                        <button type="submit" disabled={loading} className="absolute right-2 top-2 px-3 py-1.5 bg-indigo-600 rounded text-xs text-white">
                            {loading ? '...' : 'Chercher'}
                        </button>
                    </form>

                    <div className="space-y-3">
                        {students.map(student => (
                            <div
                                key={student.id}
                                onClick={() => handleSelectStudent(student)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedStudent?.id === student.id
                                    ? 'bg-indigo-600/20 border-indigo-500'
                                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                            {student.firstName[0]}{student.lastName[0]}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-medium">{student.firstName} {student.lastName}</h4>
                                            <p className="text-xs text-gray-400">{student.class.name} • {student.matricule}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-sm font-bold ${student.balance > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                            {student.balance > 0 ? `Reste: ${student.balance.toLocaleString()} F` : 'Payé ✅'}
                                        </div>
                                        {student.balance > 0 && <span className="text-[10px] text-gray-500">Sur {student.totalDue.toLocaleString()} F</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Payment Interface */}
                <div className="w-full md:w-1/2">
                    {selectedStudent ? (
                        <div className="bg-[#1e293b] border border-white/10 rounded-xl p-6 shadow-xl sticky top-6">
                            <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Nouveau Paiement</h3>
                                    <p className="text-gray-400 text-sm">Pour {selectedStudent.firstName} {selectedStudent.lastName}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-gray-500 block">Dernier versement</span>
                                    <span className="text-white font-mono">{selectedStudent.lastPaymentDate || 'Jamais'}</span>
                                </div>
                            </div>

                            <form onSubmit={handleSubmitPayment} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Montant à verser (FCFA)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={paymentAmount}
                                            onChange={(e) => setPaymentAmount(Number(e.target.value))}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg pl-4 pr-12 py-3 text-white text-lg font-bold focus:outline-none focus:border-indigo-500"
                                        />
                                        <span className="absolute right-4 top-4 text-gray-500 text-xs">FCFA</span>
                                    </div>
                                    <p className="text-xs text-amber-400 mt-1">Reste à payer: {selectedStudent.balance.toLocaleString()} FCFA</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1">Motif</label>
                                        <select
                                            value={paymentReason}
                                            onChange={(e) => setPaymentReason(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                                        >
                                            <option value="SCOLARITE_MENSUELLE">Scolarité Mensuelle</option>
                                            <option value="INSCRIPTION">Frais Inscription</option>
                                            <option value="CANTINE">Cantine</option>
                                            <option value="TRANSPORT">Transport</option>
                                            <option value="UNIFORME">Uniforme / Kit</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1">Moyen de Paiement</label>
                                        <select
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                                        >
                                            <option value="CASH">Espèces 💵</option>
                                            <option value="MTN_MOMO">MTN MoMo 🟡</option>
                                            <option value="MOOV_MONEY">Moov Money 🔵</option>
                                            <option value="CELTIIS_CASH">Celtiis Cash 🟣</option>
                                            <option value="VIREMENT">Virement Bancaire 🏦</option>
                                            <option value="CHEQUE">Chèque 📝</option>
                                        </select>
                                    </div>
                                </div>

                                {paymentMethod !== 'CASH' && (
                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                                        <label className="block text-xs font-medium text-blue-300 mb-1">
                                            {paymentMethod === 'CHEQUE' ? 'Numéro du Chèque' :
                                                paymentMethod === 'VIREMENT' ? 'Référence du Virement' :
                                                    `ID Transaction (${paymentMethod.replace('_', ' ')})`}
                                        </label>
                                        <input
                                            type="text"
                                            value={paymentReference}
                                            onChange={(e) => setPaymentReference(e.target.value)}
                                            placeholder={paymentMethod === 'CHEQUE' ? "Ex: CHQ-2023-001" : "Ex: CI2205..."}
                                            className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-sm"
                                        />
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={processingPayment}
                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-indigo-900/20 mt-4 flex justify-center items-center gap-2"
                                >
                                    {processingPayment ? 'Traitement...' : (
                                        <>
                                            <Check size={18} />
                                            Valider le Paiement
                                        </>
                                    )}
                                </button>
                                <p className="text-center text-xs text-gray-500">Un reçu sera généré automatiquement.</p>
                            </form>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 border border-dashed border-white/10 rounded-xl p-12">
                            <CreditCard size={48} className="mb-4 opacity-30" />
                            <p>Sélectionnez un élève pour encaisser un paiement.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TuitionManager;
