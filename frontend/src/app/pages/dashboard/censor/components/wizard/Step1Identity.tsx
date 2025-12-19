import { useState } from 'react';
import type { WizardData } from './types';
import { Search, CheckCircle } from 'lucide-react';

interface StepProps {
    data: WizardData;
    updateData: React.Dispatch<React.SetStateAction<WizardData>>;
    availableClasses?: any[];
}

export const Step1Identity = ({ data, updateData, availableClasses = [] }: StepProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(data.classId || null);

    const filteredClasses = availableClasses.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (cls: any) => {
        setSelectedId(cls.id);
        updateData(prev => ({
            ...prev,
            classId: cls.id,
            identity: {
                cycle: cls.cycle,
                level: cls.level,
                series: cls.series || '',
                name: cls.name,
                room: cls.room || ''
            },
            // Reset subjects if switching class? Maybe safest.
            subjects: [],
            mainTeacherId: cls.mainTeacherId || null
        }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Sélectionner une Classe à Assembler</h3>
                <p className="text-gray-400">Choisissez une classe existante pour lui assigner des matières et des professeurs.</p>
            </div>

            {/* Search */}
            <div className="relative max-w-md mx-auto mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Rechercher une classe..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredClasses.length === 0 ? (
                    <div className="col-span-full text-center py-10 text-gray-500">
                        Aucune classe trouvée.
                    </div>
                ) : (
                    filteredClasses.map(cls => (
                        <div
                            key={cls.id}
                            onClick={() => handleSelect(cls)}
                            className={`relative border rounded-xl p-4 cursor-pointer transition-all ${selectedId === cls.id
                                ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/10'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold bg-white/10 text-gray-300 px-2 py-1 rounded">
                                    {cls.level}
                                </span>
                                {selectedId === cls.id && <CheckCircle className="text-indigo-400" size={20} />}
                            </div>
                            <h4 className="text-lg font-bold text-white mb-1">{cls.name}</h4>
                            <p className="text-sm text-gray-400">{cls.cycle === 'PREMIER_CYCLE' ? 'Collège' : 'Lycée'}</p>
                            {cls.mainTeacher && (
                                <p className="text-xs text-indigo-300 mt-2">
                                    PP: {cls.mainTeacher.user.firstName}
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Selected Summary */}
            {selectedId && (
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex items-center gap-4 animate-fade-in mt-6">
                    <div className="p-3 bg-indigo-500 flex items-center justify-center rounded-lg text-white font-bold text-xl">
                        {data.identity.name.charAt(0)}
                    </div>
                    <div>
                        <p className="text-indigo-200 text-sm font-medium">Classe sélectionnée</p>
                        <h4 className="text-white font-bold text-lg">{data.identity.name}</h4>
                    </div>
                </div>
            )}
        </div>
    );
};

