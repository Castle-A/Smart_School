import { useState, useEffect } from 'react';
import {
    DollarSign,
    Users,
    Table as TableIcon,
    Calendar,
    ShoppingBag,
    ChevronRight,
    ChevronLeft,
    Plus,
    Trash2,
    Save,
    X,
    Info
} from 'lucide-react';
import { financeConfigService } from '../../../../../shared/api/finance-config.service';
import type { FeeCategory, SchoolProduct, SaveFinanceGridDto } from '../../../../../shared/api/finance-config.service';
import { toastEvents } from '../../../../../shared/utils/toast-events';

interface FinanceWizardProps {
    onClose: () => void;
    onSuccess: () => void;
}

interface PricingRow {
    id: string; // unique internal ID for UI list
    level: string;
    series: string | null;
}

// Predefined Standards
const PRIMARY_LEVELS = ['Maternelle I', 'Maternelle II', 'CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2'];
const COLLEGE_LEVELS = ['6ème', '5ème', '4ème', '3ème'];
const LYCEE_LEVELS = ['2nde', '1ère', 'Terminale'];
// Standard series declared but not used in file for now

export const FinanceWizard = ({ onClose, onSuccess }: FinanceWizardProps) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form State
    const [currency, setCurrency] = useState('XOF');
    const [penaltyRate, setPenaltyRate] = useState(0);
    const [categories, setCategories] = useState<FeeCategory[]>([
        { name: 'Nouveaux Élèves' },
        { name: 'Anciens Élèves' }
    ]);

    // Pricing Rows Management
    const [pricingRows, setPricingRows] = useState<PricingRow[]>([]);

    // Fees Map: Key = `level|series|catId`
    // Value = { tuition: number, registration: number }
    const [fees, setFees] = useState<Record<string, { tuition: number; registration: number }>>({});

    const [installmentsCount, setInstallmentsCount] = useState(3);
    const [installmentConfig, setInstallmentConfig] = useState<{ name: string; percentage: number; dueDate: string }[]>([
        { name: '1ère Tranche', percentage: 40, dueDate: '' },
        { name: '2ème Tranche', percentage: 30, dueDate: '' },
        { name: '3ème Tranche', percentage: 30, dueDate: '' },
    ]);
    const [products, setProducts] = useState<SchoolProduct[]>([]);

    useEffect(() => {
        const init = async () => {
            try {
                // Fetch config only. No more need to fetch classes first!
                const gridRes = await financeConfigService.getConfig();

                if (gridRes.categories.length > 0) {
                    setCategories(gridRes.categories.map(c => ({ id: c.id, name: c.name })));
                    setCurrency(gridRes.currency);
                    setPenaltyRate(gridRes.penaltyRate);
                }

                setProducts(gridRes.products);

                // Initialize Pricing Rows and Fees from existing config
                const loadedRows: PricingRow[] = [];
                const feesMap: any = {};
                const seenKeys = new Set<string>();

                // Helper to add a row if not exists
                const ensureRow = (level: string, series: string | null) => {
                    const key = `${level}|${series || 'null'}`;
                    if (!seenKeys.has(key)) {
                        seenKeys.add(key);
                        loadedRows.push({ id: key, level, series });
                    }
                };

                // 1. Load from Config
                type InstallmentConfigItem = { name: string; percentage: number; dueDate: string };

                // Use find to get the first valid installment config without side-effects in forEach
                let firstValidFee: any = null;

                for (const cat of gridRes.categories) {
                    if (cat.classFees) {
                        for (const f of cat.classFees) {
                            ensureRow(f.level, f.series);
                            const feeKey = `${f.level}|${f.series || 'STANDARD'}|${cat.id}`;
                            feesMap[feeKey] = {
                                tuition: f.tuitionAmount,
                                registration: f.registrationAmount
                            };

                            if (!firstValidFee && f.installments && f.installments.length > 0 && f.tuitionAmount > 0) {
                                firstValidFee = f;
                            }
                        }
                    }
                }

                let inferredInstallments: InstallmentConfigItem[] = [];
                if (firstValidFee) {
                    inferredInstallments = firstValidFee.installments.map((inst: any) => ({
                        name: inst.name,
                        percentage: Math.round((inst.amount / firstValidFee.tuitionAmount) * 100),
                        dueDate: inst.dueDate ? inst.dueDate.split('T')[0] : ''
                    }));
                }

                if (inferredInstallments.length > 0) {
                    setInstallmentConfig(inferredInstallments);
                    setInstallmentsCount(inferredInstallments.length);
                }

                // 2. If no rows loaded (fresh start), populate defaults
                if (loadedRows.length === 0) {
                    // Auto-detect levels based on user type would be ideal, but let's preload common ones
                    [...PRIMARY_LEVELS, ...COLLEGE_LEVELS, ...LYCEE_LEVELS].forEach(lvl => {
                        ensureRow(lvl, null);
                    });
                }

                // Sort rows logic could be added here for better UI order

                setPricingRows(loadedRows);
                setFees(feesMap);

            } catch (error) {
                console.error("Failed to load finance data", error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const feesList: any[] = [];

            pricingRows.forEach(row => {
                categories.forEach(cat => {
                    const catId = cat.id || cat.name;
                    const feeKey = `${row.level}|${row.series || 'STANDARD'}|${catId}`;
                    const f = fees[feeKey];

                    if (f) {
                        // Calculate installments
                        const installments = installmentConfig.map(inst => ({
                            name: inst.name,
                            amount: Math.round((f.tuition * inst.percentage) / 100),
                            dueDate: inst.dueDate || new Date().toISOString()
                        }));

                        feesList.push({
                            level: row.level,
                            series: row.series || 'STANDARD',
                            categoryId: catId,
                            tuitionAmount: f.tuition,
                            registrationAmount: f.registration,
                            installments
                        });
                    }
                });
            });

            const data: SaveFinanceGridDto = {
                currency,
                penaltyRate,
                categories,
                fees: feesList, // Now sends Level/Series based fees
                products
            };

            await financeConfigService.saveConfig(data);
            toastEvents.emit('success', 'Configuration financière enregistrée !');
            onSuccess();
        } catch (error) {
            console.error(error);
            toastEvents.emit('error', 'Erreur lors de l\'enregistrement');
        } finally {
            setSaving(false);
        }
    };

    const nextStep = () => setStep(s => Math.min(s + 1, 4));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    // Action to add a specific variant
    const addPricingVariant = () => {
        // Find High School levels to suggest variants
        const series = prompt("Entrez le nom de la série (ex: A, G2, F3) :");
        if (!series) return;

        const level = prompt("Pour quel niveau ? (ex: Terminale, 2nde) :", "Terminale");
        if (!level) return;

        // Add row
        const newRows = [...pricingRows];
        // Check duplicate
        const exists = newRows.find(r => r.level === level && r.series === series);
        if (exists) {
            toastEvents.emit('error', 'Cette variante existe déjà');
            return;
        }

        setPricingRows([...newRows, { id: `${level}|${series}`, level, series }]);
    };

    if (loading) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <span className="p-2 bg-indigo-500/20 rounded-lg">
                                <DollarSign className="text-indigo-400" size={20} />
                            </span>
                            Configuration Tarifaire Unifiée
                        </h2>
                        <p className="text-sm text-slate-400 mt-1">Définissez vos tarifs par Niveau & Série (ex: Terminale G2)</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Stepper */}
                <div className="px-6 py-4 bg-[#1e293b]/50 flex items-center justify-between border-b border-white/5">
                    {[
                        { id: 1, label: 'Paramètres & Catégories', icon: Users },
                        { id: 2, label: 'Grille Tarifaire', icon: TableIcon },
                        { id: 3, label: 'Échéancier', icon: Calendar },
                        { id: 4, label: 'Articles', icon: ShoppingBag },
                    ].map((s, idx) => (
                        <div key={s.id} className="flex items-center group">
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${step >= s.id ? 'text-indigo-400' : 'text-slate-500'}`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${step >= s.id ? 'bg-indigo-500/10 border-indigo-500/50' : 'border-white/10'}`}>
                                    <s.icon size={16} />
                                </div>
                                <span className="text-xs font-bold hidden md:inline">{s.label}</span>
                            </div>
                            {idx < 3 && <div className={`h-[1px] w-8 md:w-16 mx-2 ${step > s.id ? 'bg-indigo-500/50' : 'bg-white/5'}`} />}
                        </div>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10">

                    {/* STEP 1: Categories & Global */}
                    {step === 1 && (
                        <div className="space-y-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-right-4">
                            <section className="bg-white/5 border border-white/10 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <Info className="text-blue-400" size={18} /> Paramètres Généraux
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider font-bold">Devise</label>
                                        <select
                                            value={currency}
                                            onChange={e => setCurrency(e.target.value)}
                                            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                        >
                                            <option value="XOF">FCFA (XOF)</option>
                                            <option value="EUR">Euro (€)</option>
                                            <option value="USD">Dollar ($)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider font-bold">Pénalité (%)</label>
                                        <input
                                            type="number"
                                            value={penaltyRate}
                                            onChange={e => setPenaltyRate(Number(e.target.value))}
                                            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white/5 border border-white/10 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Catégories d'Élèves</h3>
                                <div className="space-y-3">
                                    {categories.map((cat, idx) => (
                                        <div key={idx} className="flex gap-2 group">
                                            <input
                                                value={cat.name}
                                                onChange={e => {
                                                    const newCats = [...categories];
                                                    newCats[idx].name = e.target.value;
                                                    setCategories(newCats);
                                                }}
                                                placeholder="ex: Nouveaux Élèves"
                                                className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                            />
                                            <button
                                                onClick={() => setCategories(categories.filter((_, i) => i !== idx))}
                                                className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setCategories([...categories, { name: '' }])}
                                        className="w-full py-3 border-2 border-dashed border-white/10 rounded-xl text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all text-sm font-medium flex items-center justify-center gap-2"
                                    >
                                        <Plus size={18} /> Ajouter une catégorie
                                    </button>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* STEP 2: Fee Grid (Level + Series) */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="flex justify-between items-center bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                                <div className="flex gap-3">
                                    <Info className="text-blue-400 shrink-0" size={24} />
                                    <div className="text-sm text-blue-200">
                                        <p className="font-bold mb-1">Architecture Tarifaire "Niveau & Série"</p>
                                        <p>Les tarifs définis ici s'appliqueront automatiquement à toutes les classes correspondantes.
                                            Par exemple, définir un tarif pour "Terminale" (Série G2) s'appliquera aux classes "Tle G2 A", "Tle G2 B", etc.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={addPricingVariant}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold flex items-center gap-2 whitespace-nowrap"
                                >
                                    <Plus size={16} /> Ajouter une variante
                                </button>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-white/10">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-white/5">
                                            <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-white/10">Niveau / Série</th>
                                            {categories.map(cat => (
                                                <th key={cat.name} className="p-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-l border-white/10">
                                                    {cat.name || 'Sans nom'}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pricingRows.map(row => (
                                            <tr key={row.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                                <td className="p-4 font-bold text-white whitespace-nowrap">
                                                    {row.level}
                                                    {row.series ? (
                                                        <span className="ml-2 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] border border-amber-500/30 uppercase">
                                                            Série {row.series}
                                                        </span>
                                                    ) : (
                                                        <span className="ml-2 text-[10px] text-slate-600 italic font-normal">Standard</span>
                                                    )}
                                                </td>
                                                {categories.map(cat => {
                                                    const catId = cat.id || cat.name;
                                                    const feeKey = `${row.level}|${row.series || 'null'}|${catId}`;
                                                    const fee = fees[feeKey] || { tuition: 0, registration: 0 };

                                                    const updateFee = (field: 'tuition' | 'registration', val: number) => {
                                                        const newFees = { ...fees };
                                                        newFees[feeKey] = { ...fee, [field]: val };
                                                        setFees(newFees);
                                                    };

                                                    return (
                                                        <td key={catId} className="p-2 border-l border-white/5">
                                                            <div className="space-y-2">
                                                                <div className="relative group/input">
                                                                    <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-bold">INS</div>
                                                                    <input
                                                                        type="number"
                                                                        value={fee.registration}
                                                                        onChange={e => updateFee('registration', Number(e.target.value))}
                                                                        className="w-full bg-black/40 border border-white/5 rounded-lg px-2 py-1.5 pl-9 text-right text-xs text-white focus:border-indigo-500 outline-none transition-all"
                                                                    />
                                                                </div>
                                                                <div className="relative group/input">
                                                                    <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-indigo-400 font-bold uppercase">Scol.</div>
                                                                    <input
                                                                        type="number"
                                                                        value={fee.tuition}
                                                                        onChange={e => updateFee('tuition', Number(e.target.value))}
                                                                        className="w-full bg-indigo-500/5 border border-indigo-500/10 rounded-lg px-2 py-1.5 pl-9 text-right text-xs text-indigo-100 focus:border-indigo-400 outline-none transition-all"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Installments */}
                    {step === 3 && (
                        <div className="space-y-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-right-4">
                            <section className="bg-white/5 border border-white/10 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-6">Répartition des Tranches de Scolarité</h3>
                                <div className="space-y-6">
                                    <div className="flex gap-4 mb-8">
                                        {[2, 3, 4].map(num => (
                                            <button
                                                key={num}
                                                onClick={() => {
                                                    setInstallmentsCount(num);
                                                    const newConfig = Array.from({ length: num }).map((_, i) => ({
                                                        name: `${i + 1}ère Tranche`,
                                                        percentage: Math.round(100 / num),
                                                        dueDate: ''
                                                    }));
                                                    setInstallmentConfig(newConfig);
                                                }}
                                                className={`flex-1 py-3 rounded-xl border-2 transition-all font-bold ${installmentsCount === num ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900/20' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}
                                            >
                                                {num} Tranches
                                            </button>
                                        ))}
                                    </div>

                                    {installmentConfig.map((inst, idx) => (
                                        <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end p-4 bg-black/20 rounded-xl border border-white/5">
                                            <div className="md:col-span-2">
                                                <label className="block text-xs text-slate-400 mb-1">Nom de l'échéance</label>
                                                <input
                                                    value={inst.name}
                                                    onChange={e => {
                                                        const newC = [...installmentConfig];
                                                        newC[idx].name = e.target.value;
                                                        setInstallmentConfig(newC);
                                                    }}
                                                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-slate-400 mb-1">Pourcentage (%)</label>
                                                <input
                                                    type="number"
                                                    value={inst.percentage}
                                                    onChange={e => {
                                                        const newC = [...installmentConfig];
                                                        newC[idx].percentage = Number(e.target.value);
                                                        setInstallmentConfig(newC);
                                                    }}
                                                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500 text-right"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-slate-400 mb-1">Date limite</label>
                                                <input
                                                    type="date"
                                                    value={inst.dueDate}
                                                    onChange={e => {
                                                        const newC = [...installmentConfig];
                                                        newC[idx].dueDate = e.target.value;
                                                        setInstallmentConfig(newC);
                                                    }}
                                                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    {/* Total check */}
                                    <div className="flex justify-between items-center p-3 px-5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                                        <span className="text-indigo-300 text-sm font-bold">Total Répartition :</span>
                                        <span className={`text-lg font-black ${Math.abs(installmentConfig.reduce((s, c) => s + c.percentage, 0) - 100) < 0.1 ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {installmentConfig.reduce((s, c) => s + c.percentage, 0)}%
                                        </span>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* STEP 4: Products */}
                    {step === 4 && (
                        <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-right-4">
                            <section className="bg-white/5 border border-white/10 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-6 flex justify-between items-center">
                                    Catalogue d'Articles (Uniformes, etc.)
                                    <button
                                        onClick={() => setProducts([...products, { name: '', price: 0, category: 'UNIFORM' }])}
                                        className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/40"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </h3>

                                <div className="space-y-4">
                                    {products.map((prod, idx) => (
                                        <div key={idx} className="flex gap-4 items-center animate-in fade-in slide-in-from-top-2">
                                            <div className="flex-1 grid grid-cols-2 gap-3 p-3 bg-black/20 rounded-xl border border-white/5">
                                                <input
                                                    placeholder="Nom (ex: Uniforme Primaire)"
                                                    value={prod.name}
                                                    onChange={e => {
                                                        const newP = [...products];
                                                        newP[idx].name = e.target.value;
                                                        setProducts(newP);
                                                    }}
                                                    className="bg-transparent border-none text-white text-sm outline-none focus:ring-0"
                                                />
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        placeholder="Prix"
                                                        value={prod.price}
                                                        onChange={e => {
                                                            const newP = [...products];
                                                            newP[idx].price = Number(e.target.value);
                                                            setProducts(newP);
                                                        }}
                                                        className="w-full bg-transparent border-none text-white text-sm outline-none text-right pr-12 focus:ring-0"
                                                    />
                                                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-500 text-[10px] font-bold">{currency}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setProducts(products.filter((_, i) => i !== idx))}
                                                className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}

                                    {products.length === 0 && (
                                        <div className="text-center py-12 text-slate-500 italic text-sm">
                                            Aucun article configuré. Cliquez sur le "+" pour commencer.
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="p-6 border-t border-white/10 flex justify-between items-center bg-white/5">
                    <button
                        onClick={prevStep}
                        disabled={step === 1}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${step === 1 ? 'opacity-0' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
                    >
                        <ChevronLeft size={20} /> Précédent
                    </button>

                    {step < 4 ? (
                        <button
                            onClick={nextStep}
                            className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-500 hover:scale-105 transition-all shadow-xl shadow-indigo-900/40"
                        >
                            Suivant <ChevronRight size={20} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-8 py-2.5 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-500 hover:scale-105 transition-all shadow-xl shadow-emerald-900/40 disabled:opacity-50"
                        >
                            {saving ? 'Enregistrement...' : <>Terminer & Enregistrer <Save size={20} /></>}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
