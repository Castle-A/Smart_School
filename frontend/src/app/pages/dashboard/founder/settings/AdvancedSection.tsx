import { Download, Trash2, Key, Webhook, FileText } from 'lucide-react';

const AdvancedSection = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-slate-900">Avancé</h2>
                <p className="text-slate-600 mt-1">Paramètres avancés et gestion des données</p>
            </div>

            {/* Export des données */}
            <div className="bg-white backdrop-blur-sm border border-slate-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Download className="text-blue-400" size={24} />
                    <h3 className="text-lg font-semibold text-slate-900">Export des données</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                    Téléchargez toutes vos données personnelles (RGPD)
                </p>
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-slate-900 rounded-lg transition-colors flex items-center gap-2">
                    <Download size={18} />
                    Exporter mes données
                </button>
            </div>

            {/* API Keys */}
            <div className="bg-white backdrop-blur-sm border border-slate-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Key className="text-yellow-400" size={24} />
                    <h3 className="text-lg font-semibold text-slate-900">Clés API</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                    Gérez vos clés d'accès API pour les intégrations
                </p>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                        <div>
                            <p className="text-slate-900 font-medium">Production API Key</p>
                            <p className="text-sm text-slate-600 font-mono">sk_prod_••••••••••••••••</p>
                        </div>
                        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-slate-900 rounded-lg transition-colors text-sm">
                            Révoquer
                        </button>
                    </div>
                </div>
                <button className="mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-slate-900 rounded-lg transition-colors">
                    Créer une nouvelle clé
                </button>
            </div>

            {/* Webhooks */}
            <div className="bg-white backdrop-blur-sm border border-slate-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Webhook className="text-purple-400" size={24} />
                    <h3 className="text-lg font-semibold text-slate-900">Webhooks</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                    Configurez des webhooks pour recevoir des notifications d'événements
                </p>
                <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-slate-900 rounded-lg transition-colors">
                    Gérer les webhooks
                </button>
            </div>

            {/* Logs développeur */}
            <div className="bg-white backdrop-blur-sm border border-slate-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <FileText className="text-emerald-400" size={24} />
                    <h3 className="text-lg font-semibold text-slate-900">Logs développeur</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                    Consultez les logs d'activité de votre compte
                </p>
                <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-slate-900 rounded-lg transition-colors">
                    Voir les logs
                </button>
            </div>

            {/* Suppression du compte */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Trash2 className="text-red-400" size={24} />
                    <h3 className="text-lg font-semibold text-red-400">Suppression du compte</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                    Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                </p>
                <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-slate-900 rounded-lg transition-colors flex items-center gap-2">
                    <Trash2 size={18} />
                    Supprimer définitivement mon compte
                </button>
            </div>
        </div>
    );
};

export default AdvancedSection;
