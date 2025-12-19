import { useState, useEffect } from 'react';
import { AlertTriangle, Plus, Search } from 'lucide-react';
// Simplified interface for Incident
interface Incident {
    id: string;
    description: string;
    studentName: string; // Helper for display, normally linked relation
    date: string;
    severity: string;
}

const IncidentsLogComponent = () => {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [showForm, setShowForm] = useState(false);


    // Placeholder for form state
    const [newIncident, setNewIncident] = useState({
        studentId: '',
        studentName: '',
        title: '',
        description: '',
        severity: 'MINOR',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        // Fetch incidents (mock or real)
        // fetchIncidents();
        // Since backend might fail without server restart, we use placeholder data for now to avoid white screen
        setIncidents([
            { id: '1', description: 'Bagarre dans le couloir', studentName: 'Jean Dupont', date: '2024-10-25', severity: 'MAJOR' },
            { id: '2', description: 'Utilisation de téléphone', studentName: 'Marie Curie', date: '2024-10-25', severity: 'MINOR' }
        ]);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Logic to submit to backend
        alert("Création d'incident simulée (Backend en attente de redémarrage)");
        setShowForm(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="text-orange-500" />
                    Cahier d'Incidents (Main Courante)
                </h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                >
                    <Plus size={18} />
                    Nouvel Incident
                </button>
            </div>

            {/* Quick Form (Expandable) */}
            {showForm && (
                <div className="bg-[#1e293b] p-6 rounded-2xl border border-orange-500/20 animate-slide-down">
                    <h4 className="text-white font-bold mb-4">Saisir un incident</h4>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Élève concerné</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Rechercher élève..."
                                        className="w-full bg-[#0f172a] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-orange-500/50 outline-none"
                                        value={newIncident.studentName}
                                        onChange={(e) => setNewIncident({ ...newIncident, studentName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Gravité</label>
                                <select
                                    className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-orange-500/50 outline-none"
                                    value={newIncident.severity}
                                    onChange={(e) => setNewIncident({ ...newIncident, severity: e.target.value })}
                                >
                                    <option value="MINOR">Mineur</option>
                                    <option value="MAJOR">Majeur</option>
                                    <option value="CRITICAL">Critique</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-gray-400 text-sm mb-1">Description</label>
                                <textarea
                                    className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-orange-500/50 outline-none h-24 resize-none"
                                    placeholder="Décrivez les faits..."
                                    value={newIncident.description}
                                    onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium"
                            >
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Incidents List */}
            <div className="space-y-4">
                {incidents.map((incident) => (
                    <div key={incident.id} className="bg-[#1e293b] p-4 rounded-xl border border-white/5 flex items-start gap-4 hover:border-white/10 transition-colors">
                        <div className={`
                            w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                            ${incident.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                                incident.severity === 'MAJOR' ? 'bg-orange-500/20 text-orange-400' :
                                    'bg-yellow-500/20 text-yellow-400'}
                        `}>
                            <AlertTriangle size={20} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className="text-white font-medium">{incident.description}</h4>
                                <span className="text-sm text-gray-500">{incident.date}</span>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">
                                Concernant : <span className="text-indigo-400">{incident.studentName}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IncidentsLogComponent;
