import { Key, Smartphone, History, AlertTriangle } from 'lucide-react';

const SecuritySection = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-slate-900">Sécurité</h2>
                <p className="text-slate-600 mt-1">Protégez votre compte et vos données</p>
            </div>

            {/* Changement de mot de passe */}
            <div className="bg-white backdrop-blur-sm border border-slate-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Key className="text-indigo-400" size={24} />
                    <h3 className="text-lg font-semibold text-slate-900">Mot de passe</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                    Dernière modification : Il y a 30 jours
                </p>
                <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-slate-900 rounded-lg transition-colors">
                    Changer le mot de passe
                </button>
            </div>

            {/* Authentification à 2 facteurs */}
            <div className="bg-white backdrop-blur-sm border border-slate-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Smartphone className="text-emerald-400" size={24} />
                    <h3 className="text-lg font-semibold text-slate-900">Authentification à deux facteurs (2FA)</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                    Ajoutez une couche de sécurité supplémentaire à votre compte
                </p>
                <div className="flex items-center justify-between p-4 bg-white rounded-lg mb-4">
                    <div>
                        <p className="text-slate-900 font-medium">2FA désactivée</p>
                        <p className="text-sm text-slate-600">Activez pour plus de sécurité</p>
                    </div>
                    <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-slate-900 rounded-lg transition-colors">
                        Activer
                    </button>
                </div>
            </div>

            {/* Sessions actives */}
            <div className="bg-white backdrop-blur-sm border border-slate-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <History className="text-blue-400" size={24} />
                    <h3 className="text-lg font-semibold text-slate-900">Sessions actives</h3>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                        <div>
                            <p className="text-slate-900 font-medium">Windows • Chrome</p>
                            <p className="text-sm text-slate-600">Dernière activité : Maintenant</p>
                            <p className="text-xs text-slate-500">IP: 192.168.1.1 • Abidjan, Côte d'Ivoire</p>
                        </div>
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
                            Session actuelle
                        </span>
                    </div>
                </div>
            </div>

            {/* Zone de danger */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="text-red-400" size={24} />
                    <h3 className="text-lg font-semibold text-red-400">Zone de danger</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                    Actions irréversibles qui affectent votre compte
                </p>
                <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-slate-900 rounded-lg transition-colors">
                    Supprimer mon compte
                </button>
            </div>
        </div>
    );
};

export default SecuritySection;
