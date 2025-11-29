import { CreditCard, Shield, Settings, History, Lock, Database, Palette, FileText, CheckSquare } from 'lucide-react';

const ConfigurationSection = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Configuration & Abonnement</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Abonnement */}
                <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-sm border border-indigo-500/30 rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <CreditCard size={120} />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <CreditCard className="text-indigo-400" size={24} />
                            <h3 className="text-xl font-semibold text-white">Mon Abonnement</h3>
                        </div>

                        <div className="mb-6">
                            <p className="text-sm text-indigo-200 mb-1">Plan Actuel</p>
                            <div className="flex items-baseline gap-2">
                                <h4 className="text-3xl font-bold text-white">PREMIUM</h4>
                                <span className="text-sm text-indigo-300">/ an</span>
                            </div>
                            <p className="text-xs text-indigo-300 mt-2 flex items-center gap-1">
                                <CheckSquare size={12} /> Renouvellement le 15 Septembre 2025
                            </p>
                        </div>

                        <div className="space-y-3 mb-6">
                            {['Gestion multi-cycles', 'Support prioritaire 24/7', 'Stockage illimité', 'Module SMS inclus'].map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm text-indigo-100">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                    {feature}
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button className="flex-1 py-2 bg-white text-indigo-900 font-semibold rounded-lg hover:bg-indigo-50 transition-colors shadow-lg">
                                Changer de plan
                            </button>
                            <button className="px-4 py-2 bg-indigo-800/50 text-white rounded-lg hover:bg-indigo-800 transition-colors border border-indigo-500/30">
                                Factures
                            </button>
                        </div>
                    </div>
                </div>

                {/* Paramètres & Sécurité */}
                <div className="space-y-6">
                    {/* Paramètres École */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Settings className="text-gray-400" size={20} />
                            <h3 className="text-lg font-semibold text-white">Paramètres de l'école</h3>
                        </div>
                        <div className="space-y-2">
                            <button className="w-full flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-left group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 group-hover:bg-purple-500/30 transition-colors">
                                        <Palette size={18} />
                                    </div>
                                    <div>
                                        <span className="text-gray-200 block text-sm font-medium">Identité Visuelle</span>
                                        <span className="text-gray-500 text-xs">Logo, Couleurs, Thème</span>
                                    </div>
                                </div>
                                <Settings size={16} className="text-gray-500 group-hover:text-white transition-colors" />
                            </button>

                            <button className="w-full flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-left group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 group-hover:bg-blue-500/30 transition-colors">
                                        <FileText size={18} />
                                    </div>
                                    <div>
                                        <span className="text-gray-200 block text-sm font-medium">Documents Académiques</span>
                                        <span className="text-gray-500 text-xs">Bulletins, Certificats, Attestations</span>
                                    </div>
                                </div>
                                <Settings size={16} className="text-gray-500 group-hover:text-white transition-colors" />
                            </button>
                        </div>
                    </div>

                    {/* Sécurité */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="text-emerald-400" size={20} />
                            <h3 className="text-lg font-semibold text-white">Sécurité & Données</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                                <div className="flex items-center gap-2 mb-2 text-gray-400">
                                    <History size={16} />
                                    <span className="text-xs">Connexions</span>
                                </div>
                                <p className="text-white font-medium text-sm">Voir l'historique</p>
                            </div>
                            <div className="p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                                <div className="flex items-center gap-2 mb-2 text-gray-400">
                                    <Lock size={16} />
                                    <span className="text-xs">Mot de passe</span>
                                </div>
                                <p className="text-white font-medium text-sm">Politique de sécurité</p>
                            </div>
                            <div className="col-span-2 p-3 bg-white/5 rounded-lg border border-white/5 flex justify-between items-center hover:bg-white/10 transition-colors cursor-pointer">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Database size={16} />
                                    <span className="text-xs">Export RGPD</span>
                                </div>
                                <button className="text-xs text-indigo-400 hover:text-indigo-300">Télécharger les données</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfigurationSection;
