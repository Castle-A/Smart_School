import { useState } from 'react';
import { DollarSign, Wallet, TrendingUp, Receipt, Printer, FileText, Smartphone, Crown, Rocket } from 'lucide-react';
import type { SchoolConfig, UpdateSchoolConfigDto } from '../../../../../shared/api/school-config.service';
import { FinanceWizard } from './FinanceWizard';

interface FinanceConfigProps {
    config: SchoolConfig;
    onUpdate: (data: Partial<UpdateSchoolConfigDto>) => Promise<void>;
}

export const FinanceConfig = ({ config, onUpdate }: FinanceConfigProps) => {
    const [currency, setCurrency] = useState(config.currency);
    const [penaltyRate, setPenaltyRate] = useState(config.penaltyRate);
    const [receiptTemplate, setReceiptTemplate] = useState(config.receiptTemplate || 'STANDARD');
    const [isSaving, setIsSaving] = useState(false);
    const [showWizard, setShowWizard] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onUpdate({
                currency,
                penaltyRate,
                receiptTemplate
            });
        } finally {
            setIsSaving(false);
        }
    };

    const templates = [
        {
            id: 'STANDARD',
            name: 'Classique A4',
            description: 'Format standard A4 avec logo et en-tête complet.',
            icon: FileText,
            color: 'text-blue-400',
            borderColor: 'group-hover:border-blue-500/50'
        },
        {
            id: 'THERMAL',
            name: 'Ticket Thermique',
            description: 'Format compact pour imprimantes à reçus (58mm/80mm).',
            icon: Printer,
            color: 'text-amber-400',
            borderColor: 'group-hover:border-amber-500/50'
        },
        {
            id: 'DIGITAL',
            name: 'Reçu Numérique',
            description: 'Optimisé pour l\'envoi par WhatsApp et Email.',
            icon: Smartphone,
            color: 'text-emerald-400',
            borderColor: 'group-hover:border-emerald-500/50'
        },
        {
            id: 'OFFICIAL',
            name: 'Officiel Sécurisé',
            description: 'Avec filigrane et QR Code de vérification.',
            icon: Crown,
            color: 'text-purple-400',
            borderColor: 'group-hover:border-purple-500/50',
            isPremium: true
        }
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/20 rounded-lg">
                            <DollarSign className="text-amber-400" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-white">Politique Financière</h3>
                            <p className="text-sm text-slate-400">Configuration générale de la facturation et des reçus</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowWizard(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-900/40 hover:scale-105 transition-all font-bold text-sm"
                    >
                        <Rocket size={18} /> Configurer la Grille Tarifaire
                    </button>
                </div>

                {showWizard && (
                    <FinanceWizard
                        onClose={() => setShowWizard(false)}
                        onSuccess={() => {
                            setShowWizard(false);
                            // Optionally refresh global settings if updated in wizard
                        }}
                    />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Devise */}
                    <div className="p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/[0.07] transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <Wallet size={20} className="text-blue-400" />
                            </div>
                            <span className="text-white font-medium">Devise Principale</span>
                        </div>
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="XOF">Franc CFA (XOF)</option>
                            <option value="XAF">Franc CFA (XAF)</option>
                            <option value="GNF">Franc Guinéen (GNF)</option>
                            <option value="USD">Dollar Américain (USD)</option>
                            <option value="EUR">Euro (EUR)</option>
                        </select>
                        <p className="text-xs text-slate-500 mt-2 ml-1">
                            Utilisée sur tous les documents financiers
                        </p>
                    </div>

                    {/* Pénalités */}
                    <div className="p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/[0.07] transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-500/20 rounded-lg">
                                <TrendingUp size={20} className="text-red-400" />
                            </div>
                            <span className="text-white font-medium">Pénalité de Retard</span>
                        </div>
                        <div className="relative">
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={penaltyRate}
                                onChange={(e) => setPenaltyRate(Number(e.target.value))}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 pr-12"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 ml-1">
                            Majoration appliquée après la date d'échéance
                        </p>
                    </div>
                </div>

                {/* Modèles de Reçus */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Receipt size={18} className="text-indigo-400" />
                        <h4 className="text-white font-medium">Format des Reçus de Paiement</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {templates.map((template) => (
                            <button
                                key={template.id}
                                onClick={() => setReceiptTemplate(template.id)}
                                className={`relative group p-4 border rounded-xl text-left transition-all duration-200 ${receiptTemplate === template.id
                                    ? 'bg-indigo-500/10 border-indigo-500 ring-1 ring-indigo-500/50'
                                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className={`p-2 rounded-lg bg-white/5 ${template.color}`}>
                                        <template.icon size={20} />
                                    </div>
                                    {template.isPremium && (
                                        <span className="px-2 py-0.5 text-[10px] font-bold text-black bg-gradient-to-r from-amber-200 to-yellow-400 rounded-full">
                                            PRO
                                        </span>
                                    )}
                                </div>
                                <h5 className={`font-medium mb-1 ${receiptTemplate === template.id ? 'text-white' : 'text-slate-300'
                                    }`}>
                                    {template.name}
                                </h5>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    {template.description}
                                </p>

                                {receiptTemplate === template.id && (
                                    <div className="absolute inset-0 border-2 border-indigo-500 rounded-xl pointer-events-none" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-all disabled:opacity-50 shadow-lg shadow-indigo-900/20"
                    >
                        {isSaving ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Enregistrement...</span>
                            </>
                        ) : (
                            <span>Mettre à jour la politique</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
