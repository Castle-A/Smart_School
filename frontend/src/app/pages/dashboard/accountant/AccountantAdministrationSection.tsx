import { useState } from 'react';
import { Briefcase, Users, GraduationCap } from 'lucide-react';
import AdminStaffList from './components/AdminStaffList';
import TeacherFinancialList from './components/TeacherFinancialList';
import StudentFinancialList from './components/StudentFinancialList';

const AccountantAdministrationSection = ({ readOnly = false }: { readOnly?: boolean }) => {
    const [activeTab, setActiveTab] = useState<'admin' | 'teachers' | 'students'>('admin');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Administration & RH</h2>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 border-b border-white/10 mb-6 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('admin')}
                    className={`px-4 py-2 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === 'admin' ? 'text-indigo-400' : 'text-gray-400 hover:text-white'}`}
                >
                    <div className="flex items-center gap-2">
                        <Briefcase size={16} />
                        Corps Administratif
                    </div>
                    {activeTab === 'admin' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full" />}
                </button>

                <button
                    onClick={() => setActiveTab('teachers')}
                    className={`px-4 py-2 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === 'teachers' ? 'text-indigo-400' : 'text-gray-400 hover:text-white'}`}
                >
                    <div className="flex items-center gap-2">
                        <Users size={16} />
                        Corps Enseignant
                    </div>
                    {activeTab === 'teachers' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full" />}
                </button>

                <button
                    onClick={() => setActiveTab('students')}
                    className={`px-4 py-2 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === 'students' ? 'text-indigo-400' : 'text-gray-400 hover:text-white'}`}
                >
                    <div className="flex items-center gap-2">
                        <GraduationCap size={16} />
                        Gestion des Élèves
                    </div>
                    {activeTab === 'students' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full" />}
                </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {activeTab === 'admin' && <AdminStaffList readOnly={readOnly} />}
                {activeTab === 'teachers' && <TeacherFinancialList readOnly={readOnly} />}
                {activeTab === 'students' && <StudentFinancialList />}
            </div>
        </div>
    );
};

export default AccountantAdministrationSection;
