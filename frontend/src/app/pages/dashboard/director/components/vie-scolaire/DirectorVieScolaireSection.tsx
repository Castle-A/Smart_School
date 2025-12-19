import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, AlertTriangle, FileText, Inbox, BookOpen } from 'lucide-react';
import { OverviewView } from './OverviewView';
// Import existing Requests View - check path correctness
import DirectorRequestsView from '../DirectorRequestsView';

import { DisciplineView } from './DisciplineView';
// Placeholders for other views
import { AttendanceView } from './AttendanceView';
const IncidentsView = () => <div className="text-white p-4">Module Incidents en construction</div>;

export const DirectorVieScolaireSection = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: "Vue d'ensemble", icon: BookOpen },
        { id: 'attendance', label: 'Assiduité', icon: Calendar },
        { id: 'discipline', label: 'Discipline', icon: FileText },
        { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
        { id: 'requests', label: 'Requêtes', icon: Inbox },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Vie Scolaire</h2>
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/10 custom-scrollbar">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative flex items-center gap-2 px-4 py-3 rounded-t-lg transition-colors whitespace-nowrap min-w-max 
                            ${activeTab === tab.id
                                ? 'bg-indigo-600 text-white border-b-2 border-indigo-400'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'}
                        `}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'overview' && <OverviewView />}
                    {activeTab === 'attendance' && <AttendanceView />}
                    {activeTab === 'discipline' && <DisciplineView />}
                    {activeTab === 'incidents' && <IncidentsView />}
                    {activeTab === 'requests' && <DirectorRequestsView />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
