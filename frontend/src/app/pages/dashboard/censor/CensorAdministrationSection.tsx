import { useState, useEffect } from 'react';
import { Users, BookOpen, GraduationCap, Link2, UserSquare2 } from 'lucide-react';
import api from '../../../../shared/api/api';
import CensorTeachersView from './components/CensorTeachersView';
import CensorStudentsView from './components/CensorStudentsView';
import CensorClassesView from './components/CensorClassesView';
import CensorSubjectsView from './components/CensorSubjectsView';
import CensorAssignmentsView from './components/CensorAssignmentsView';

const CensorAdministrationSection = () => {
    const [activeTab, setActiveTab] = useState('teachers');
    const [classes, setClasses] = useState<any[]>([]);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await api.get('/classes');
            setClasses(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const tabs = [
        { id: 'teachers', label: 'Corps Enseignant', icon: UserSquare2 },
        { id: 'students', label: 'Gestion des Élèves', icon: Users },
        { id: 'classes', label: 'Gestion des Classes', icon: GraduationCap },
        { id: 'subjects', label: 'Gestion des Matières', icon: BookOpen },
        { id: 'assignments', label: 'Affectation', icon: Link2 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Administration Scolaire</h2>
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/10 custom-scrollbar">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-t-lg transition-colors whitespace-nowrap min-w-max ${activeTab === tab.id
                            ? 'bg-indigo-600 text-white border-b-2 border-indigo-400'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="py-4">
                {activeTab === 'teachers' && <CensorTeachersView />}
                {activeTab === 'students' && <CensorStudentsView />}
                {activeTab === 'classes' && <CensorClassesView classes={classes} onRefresh={fetchClasses} />}
                {activeTab === 'subjects' && <CensorSubjectsView />}
                {activeTab === 'assignments' && <CensorAssignmentsView classes={classes} />}
            </div>
        </div>
    );
};

export default CensorAdministrationSection;
