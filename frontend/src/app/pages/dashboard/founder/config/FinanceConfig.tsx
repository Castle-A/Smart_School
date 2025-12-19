import { useState } from 'react';
import { DollarSign, Wallet, TrendingUp } from 'lucide-react';
import type { SchoolConfig } from '../../../../../shared/api/school-config.service';

interface FinanceConfigProps {
    config: SchoolConfig;
    onUpdate: (data: any) => Promise<void>;
}

export const FinanceConfig = ({ config, onUpdate }: FinanceConfigProps) => {
    const [currency, setCurrency] = useState(config.currency);
    const [penaltyRate, setPenaltyRate] = useState(config.penaltyRate);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onUpdate({ currency, penaltyRate });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <DollarSign className="text-amber-400" size={24} />
                    <h3 className="text-xl font-semibold text-white">Paramètres Financiers</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                        <div className="flex items-center gap-3 mb-4 text-amber-400">
                            <Wallet size={20} />
                            <span className="text-white font-medium">Devise de Gestion</span>
                        </div>
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                            <option value="XOF">FCFA (XOF)</option>
                            <option value="EUR">Euro (EUR)</option>
                            <option value="USD">Dollar (USD)</option>
                            <option value="GNF">Franc Guinéen (GNF)</option>
                        </select>
                        <p className="text-xs text-slate-500 mt-2">Utilisée pour tous les reçus et rapports</p>
                    </div>

                    <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                        <div className="flex items-center gap-3 mb-4 text-amber-400">
                            <TrendingUp size={20} />
                            <span className="text-white font-medium">Taux de Pénalité (%)</span>
                        </div>
                        <input
                            type="number"
                            value={penaltyRate}
                            onChange={(e) => setPenaltyRate(Number(e.target.value))}
                            className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <p className="text-xs text-slate-500 mt-2">Appliqué sur les retards de paiement scolaires</p>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
                    >
                        {isSaving ? 'Enregistrement...' : 'Mettre à jour les finances'}
                    </button>
                </div>
            </div>
        </div>
    );
};
