import { useState, useEffect } from 'react';
import { Shield, CheckCircle, AlertTriangle, Lock, Banknote, GraduationCap } from 'lucide-react';
import { useAuth } from '../../../../shared/contexts/AuthContext';
import api from '../../../../shared/api/api';
import { toastEvents } from '../../../../shared/utils/toast-events';

const YearEndClosure = () => {
    const { user } = useAuth();
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        setLoading(true);
        try {
            const res = await api.get('/transitions/closure-status');
            setStatus(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCertify = async (type: 'FINANCE' | 'ACADEMIC') => {
        if (!confirm(`Confirmez-vous la validation de l'audit ${type === 'FINANCE' ? 'Financier' : 'Académique'} ? Cette action est traçée.`)) return;
        setActionLoading(true);
        try {
            await api.post(type === 'FINANCE' ? '/transitions/certify-finance' : '/transitions/certify-academic');
            await fetchStatus();
        } catch (e) {
            toastEvents.error("Erreur lors de la certification.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleCloseYear = async () => {
        if (!confirm("ATTENTION : Vous allez clôturer définitivement l'année scolaire active. Assurez-vous d'avoir tout vérifié. Continuer ?")) return;
        setActionLoading(true);
        try {
            await api.post('/transitions/close-year');
            toastEvents.success("Année clôturée avec succès ! Le système est prêt pour la bascule.");
            fetchStatus();
        } catch (e) {
            toastEvents.error("Erreur critique lors de la clôture.");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="text-white text-center p-10">Chargement de l'audit...</div>;
    if (!status?.hasActiveYear) return <div className="text-gray-400 text-center p-10">Aucune année scolaire active. Veuillez en créer ou activer une dans les Paramètres.</div>;

    // Permissions
    const canCertifyFinance = ['ACCOUNTANT', 'DIRECTOR', 'FOUNDER'].includes(user?.role || '');
    const canCertifyAcademic = ['CENSOR', 'DIRECTOR', 'FOUNDER'].includes(user?.role || '');
    const canCloseYear = ['DIRECTOR', 'FOUNDER'].includes(user?.role || '');

    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-500/20 rounded-lg text-red-400">
                        <Lock size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Clôture Annuelle {status.yearName}</h2>
                        <p className="text-gray-400 mt-1">
                            Processus de verrouillage définitif de l'année scolaire. Nécessite la double validation (Finance + Académique).
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                {/* Connector Lines (Visual Only, tough in grid) */}

                {/* Step 1: Finance */}
                <div className={`p-6 rounded-xl border ${status.financeCertified ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10'} relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 p-2 text-6xl opacity-10 font-bold select-none">1</div>
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-2 rounded-lg ${status.financeCertified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                            <Banknote size={24} />
                        </div>
                        {status.financeCertified && <CheckCircle className="text-emerald-500" size={24} />}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">Audit Financier</h3>
                    <p className="text-sm text-gray-400 mb-6">
                        Certification de soldes et gestion des impayés.
                    </p>

                    <div className="space-y-2 mb-6 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Dettes en attente :</span>
                            <span className="text-white font-mono">{status.debtsCount} Dossiers</span>
                        </div>
                        {status.debtsCount > 0 && <span className="text-xs text-amber-500 italic block">Attention aux impayés !</span>}
                    </div>

                    {!status.financeCertified ? (
                        <button
                            onClick={() => handleCertify('FINANCE')}
                            disabled={!canCertifyFinance || actionLoading}
                            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${canCertifyFinance
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {canCertifyFinance ? 'Certifier les Comptes' : 'Réservé au Comptable'}
                        </button>
                    ) : (
                        <div className="bg-emerald-500/20 text-emerald-300 text-center py-2 rounded-lg text-sm font-medium border border-emerald-500/30">
                            Certifié Conforme
                        </div>
                    )}
                </div>

                {/* Step 2: Academic */}
                <div className={`p-6 rounded-xl border ${status.academicCertified ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10'} relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 p-2 text-6xl opacity-10 font-bold select-none">2</div>
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-2 rounded-lg ${status.academicCertified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-400'}`}>
                            <GraduationCap size={24} />
                        </div>
                        {status.academicCertified && <CheckCircle className="text-emerald-500" size={24} />}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">Audit Académique</h3>
                    <p className="text-sm text-gray-400 mb-6">
                        Validation des décisions de passage et examens.
                    </p>

                    <div className="space-y-2 mb-6 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Effectif total (Actif) :</span>
                            <span className="text-white font-mono">{status.activeStudentsCount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Sans décision :</span>
                            <span className={`font-mono ${status.pendingDecisionsCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                {status.pendingDecisionsCount}
                            </span>
                        </div>
                        {status.pendingDecisionsCount > 0 && <span className="text-xs text-red-400 block mt-1">Tous les élèves doivent avoir une décision.</span>}
                    </div>

                    {!status.academicCertified ? (
                        <button
                            onClick={() => handleCertify('ACADEMIC')}
                            disabled={!canCertifyAcademic || actionLoading || status.pendingDecisionsCount > 0}
                            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${canCertifyAcademic && status.pendingDecisionsCount === 0
                                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {status.pendingDecisionsCount > 0
                                ? 'Décisions Manquantes'
                                : canCertifyAcademic ? 'Valider les Passations' : 'Réservé au Censeur'}
                        </button>
                    ) : (
                        <div className="bg-emerald-500/20 text-emerald-300 text-center py-2 rounded-lg text-sm font-medium border border-emerald-500/30">
                            Validé Conforme
                        </div>
                    )}
                </div>

                {/* Step 3: Executive Closure */}
                <div className={`p-6 rounded-xl border ${status.financeCertified && status.academicCertified ? 'bg-gradient-to-b from-[#1e293b] to-red-900/20 border-red-500/50' : 'bg-white/5 border-white/10 opacity-50'} relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 p-2 text-6xl opacity-10 font-bold select-none">3</div>
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-2 rounded-lg ${status.financeCertified && status.academicCertified ? 'bg-red-500/20 text-red-500' : 'bg-gray-700 text-gray-400'}`}>
                            <Shield size={24} />
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">Exécution Finale</h3>
                    <p className="text-sm text-gray-400 mb-6">
                        Clôture irréversible et archivage de l'année.
                    </p>

                    <div className="flex flex-col gap-2 mb-6 text-sm">
                        <div className="flex items-center gap-2">
                            {status.financeCertified ? <CheckCircle size={16} className="text-emerald-500" /> : <AlertTriangle size={16} className="text-amber-500" />}
                            <span className={status.financeCertified ? "text-gray-300" : "text-gray-500"}>Audit Financier</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {status.academicCertified ? <CheckCircle size={16} className="text-emerald-500" /> : <AlertTriangle size={16} className="text-amber-500" />}
                            <span className={status.academicCertified ? "text-gray-300" : "text-gray-500"}>Audit Académique</span>
                        </div>
                    </div>

                    <button
                        onClick={handleCloseYear}
                        disabled={!canCloseYear || actionLoading || !status.financeCertified || !status.academicCertified}
                        className={`w-full py-3 px-4 rounded-lg font-bold transition-all shadow-lg ${canCloseYear && status.financeCertified && status.academicCertified
                            ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20'
                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {canCloseYear ? "CLÔTURER L'ANNÉE" : "Réservé au Directeur"}
                    </button>
                    {status.financeCertified && status.academicCertified && canCloseYear && (
                        <p className="text-xs text-red-400 text-center mt-3">
                            Action irréversible.
                        </p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default YearEndClosure;
