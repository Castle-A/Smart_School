import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, UserCheck, AlertTriangle } from 'lucide-react';
import { DisciplineView } from '../director/components/vie-scolaire/DisciplineView';
import { AttendanceView } from '../director/components/vie-scolaire/AttendanceView';
import IncidentsLogComponent from './IncidentsLogComponent';

export const SurveillantVieScolaireSection = () => {
    const [activeTab, setActiveTab] = useState<'attendance' | 'discipline' | 'incidents'>('attendance');

    const tabs = [
        { id: 'attendance', label: 'Assiduité & Retards', icon: UserCheck },
        { id: 'discipline', label: 'Sanctions & Récompenses', icon: ClipboardList },
        { id: 'incidents', label: 'Main Courante (Incidents)', icon: AlertTriangle },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Vie Scolaire</h2>
                <p className="text-gray-400">Gestion quotidienne de l'assiduité, de la discipline et des incidents.</p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-white/5 p-1 rounded-xl w-fit">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                ${isActive
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }
                            `}
                        >
                            <Icon size={18} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <div className="mt-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'attendance' && <AttendanceView />}
                        {activeTab === 'discipline' && <DisciplineView />}
                        {activeTab === 'incidents' && <IncidentsLogComponent />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
