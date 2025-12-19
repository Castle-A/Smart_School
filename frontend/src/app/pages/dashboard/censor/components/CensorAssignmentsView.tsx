import { useState } from 'react';
import { LayoutTemplate, Layers, GitMerge } from 'lucide-react';
import ClassBuilderWizard from './wizard/ClassBuilderWizard';
import SearchFilterBar from '../../../../../shared/components/SearchFilterBar';

interface AssignmentsViewProps {
    classes: any[];
}

const CensorAssignmentsView = ({ classes }: AssignmentsViewProps) => {
    const [wizardActive, setWizardActive] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedCycle, setSelectedCycle] = useState<string | 'ALL'>('ALL');

    const filteredClasses = classes.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCycle = selectedCycle === 'ALL' || c.cycle === selectedCycle;
        return matchesSearch && matchesCycle;
    });

    const handleFilterClick = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const filterContent = (
        <div className="p-2 space-y-1">
            <button
                onClick={() => setSelectedCycle('ALL')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCycle === 'ALL' ? 'bg-indigo-500 text-white' : 'text-gray-300 hover:bg-white/5'}`}
            >
                Tout voir
            </button>
            <button
                onClick={() => setSelectedCycle('PREMIER_CYCLE')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCycle === 'PREMIER_CYCLE' ? 'bg-indigo-500 text-white' : 'text-gray-300 hover:bg-white/5'}`}
            >
                Collège
            </button>
            <button
                onClick={() => setSelectedCycle('SECOND_CYCLE')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCycle === 'SECOND_CYCLE' ? 'bg-indigo-500 text-white' : 'text-gray-300 hover:bg-white/5'}`}
            >
                Lycée
            </button>
        </div>
    );

    if (wizardActive) {
        return (
            <ClassBuilderWizard
                classes={classes} // Pass existing classes to wizard
                onCancel={() => setWizardActive(false)}
                onSuccess={() => {
                    setWizardActive(false);
                    // Trigger refresh if possible
                }}
            />
        );
    }

    return (
        <div className="space-y-6">
            <SearchFilterBar
                onSearch={setSearchTerm}
                placeholder="Rechercher une classe..."
                isFilterEnabled={true}
                isFilterOpen={isFilterOpen}
                onFilterClick={handleFilterClick}
                filterContent={filterContent}
                actions={
                    <button
                        onClick={() => setWizardActive(true)}
                        className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-indigo-500/20 flex items-center gap-2 font-bold transition-all transform hover:scale-105"
                    >
                        <GitMerge size={20} />
                        Assembler une Classe
                    </button>
                }
            />

            {/* Empty State / Dashboard */}
            {classes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="p-6 bg-indigo-500/10 rounded-full mb-6 animate-pulse">
                        <LayoutTemplate size={48} className="text-indigo-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Aucune classe disponible</h3>
                    <p className="text-gray-400 max-w-md text-center mb-8">
                        Veuillez d'abord créer des classes dans l'onglet "Gestion des Classes".
                    </p>
                </div>
            ) : filteredClasses.length === 0 ? (
                <div className="text-center py-20 bg-white/5 border border-white/10 rounded-xl">
                    <p className="text-gray-400">Aucune classe ne correspond à votre recherche.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Compact Class Cards */}
                    {filteredClasses.map(cls => (
                        <div key={cls.id} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors group cursor-pointer relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Layers size={100} />
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded mb-2 inline-block">
                                            {cls.level}
                                        </span>
                                        <h3 className="text-xl font-bold text-white">{cls.name}</h3>
                                    </div>
                                    <div className="bg-black/30 p-2 rounded-lg text-gray-400">
                                        <Layers size={20} />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Prof. Principal</span>
                                        <span className={`font-medium ${cls.mainTeacher ? 'text-indigo-300' : 'text-gray-600 italic'}`}>
                                            {cls.mainTeacher ? `${cls.mainTeacher.user.firstName} ${cls.mainTeacher.user.lastName}` : 'Non défini'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Cycle</span>
                                        <span className="text-gray-300">{cls.cycle === 'PREMIER_CYCLE' ? 'Collège' : cls.cycle}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CensorAssignmentsView;
