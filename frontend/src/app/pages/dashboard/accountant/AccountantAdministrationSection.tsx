import { Users, Search } from 'lucide-react';

const AccountantAdministrationSection = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Administration (Consultation)</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        className="pl-10 pr-4 py-2 bg-white/10 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 w-64"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Listes Élèves */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Users className="text-blue-400" size={24} />
                        <h3 className="text-lg font-semibold text-white">Élèves</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-gray-300">Total Élèves</span>
                            <span className="text-white font-bold">1,245</span>
                        </div>
                        <button className="w-full py-2 text-sm text-gray-300 hover:text-white border border-white/10 hover:bg-white/5 rounded-lg transition-colors">
                            Voir la liste complète
                        </button>
                    </div>
                </div>

                {/* Listes Parents */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Users className="text-emerald-400" size={24} />
                        <h3 className="text-lg font-semibold text-white">Parents</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-gray-300">Total Parents</span>
                            <span className="text-white font-bold">892</span>
                        </div>
                        <button className="w-full py-2 text-sm text-gray-300 hover:text-white border border-white/10 hover:bg-white/5 rounded-lg transition-colors">
                            Voir la liste complète
                        </button>
                    </div>
                </div>

                {/* Listes Personnel */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Users className="text-purple-400" size={24} />
                        <h3 className="text-lg font-semibold text-white">Personnel</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-gray-300">Total Personnel</span>
                            <span className="text-white font-bold">84</span>
                        </div>
                        <button className="w-full py-2 text-sm text-gray-300 hover:text-white border border-white/10 hover:bg-white/5 rounded-lg transition-colors">
                            Voir la liste complète
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountantAdministrationSection;
