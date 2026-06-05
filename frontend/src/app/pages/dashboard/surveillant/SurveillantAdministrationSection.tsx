import { useState, useEffect } from 'react';
import { Users, GraduationCap, UserSquare2, Search } from 'lucide-react';
import CensorStudentsView from '../censor/components/CensorStudentsView';
import api from '../../../../shared/api/api';
import Avatar from '../../../../shared/components/Avatar';
import Skeleton from '../../../../shared/components/Skeleton';

interface Teacher {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    contractType: string;
    hireDate: string;
    matricule: string;
    subjects: string[];
    classes?: number;
    role?: string;
    title?: string;
}

interface ClassData {
    id: string;
    name: string;
    cycle: string;
    level: string;
    series?: string;
    studentCount: number;
    mainTeacher?: {
        user: {
            firstName: string;
            lastName: string;
        }
    };
}

const SurveillantAdministrationSection = () => {
    const [activeTab, setActiveTab] = useState<'students' | 'teachers' | 'classes'>('students');

    // Teachers State
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isTeachersLoading, setIsTeachersLoading] = useState(false);
    const [teacherSearchTerm, setTeacherSearchTerm] = useState('');

    // Classes State
    const [classes, setClasses] = useState<ClassData[]>([]);
    const [isClassesLoading, setIsClassesLoading] = useState(false);
    const [classSearchTerm, setClassSearchTerm] = useState('');

    useEffect(() => {
        if (activeTab === 'teachers') fetchTeachers();
        if (activeTab === 'classes') fetchClasses();
    }, [activeTab]);

    const fetchTeachers = async () => {
        setIsTeachersLoading(true);
        try {
            const response = await api.get('/teachers?simple=true'); // Use simple view if available or full
            setTeachers(response.data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        } finally {
            setIsTeachersLoading(false);
        }
    };

    const fetchClasses = async () => {
        setIsClassesLoading(true);
        try {
            const response = await api.get('/classes');
            // Basic sort
            const sorted = response.data.sort((a: any, b: any) => a.name.localeCompare(b.name, undefined, { numeric: true }));
            setClasses(sorted);
        } catch (error) {
            console.error('Error fetching classes:', error);
        } finally {
            setIsClassesLoading(false);
        }
    };

    const renderTeachersTab = () => {
        const filteredTeachers = teachers.filter((t: Teacher) =>
            (t.firstName + ' ' + t.lastName).toLowerCase().includes(teacherSearchTerm.toLowerCase()) ||
            t.email?.toLowerCase().includes(teacherSearchTerm.toLowerCase())
        );

        return (
            <div className="space-y-6">
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher un professeur..."
                            value={teacherSearchTerm}
                            onChange={(e) => setTeacherSearchTerm(e.target.value)}
                            className="w-full bg-[#1e293b] text-white border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {isTeachersLoading ? (
                        Array.from({ length: 12 }).map((_, i) => (
                            <Skeleton key={i} className="h-48 w-full bg-white/5" />
                        ))
                    ) : filteredTeachers.map((teacher: Teacher) => (
                        <div
                            key={teacher.id}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-colors flex flex-col items-center text-center group"
                        >
                            <Avatar firstName={teacher.firstName} lastName={teacher.lastName} size="md" />
                            <h4 className="text-white font-medium text-xs mt-2 line-clamp-1">{teacher.firstName} {teacher.lastName}</h4>
                            <p className="text-gray-400 text-[10px]">{teacher.phone}</p>
                            <div className="mt-2 text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                                {teacher.contractType || 'Enseignant'}
                            </div>
                            {/* Read Only - No Actions */}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderClassesTab = () => {
        const filteredClasses = classes.filter((c: ClassData) => c.name.toLowerCase().includes(classSearchTerm.toLowerCase()));

        return (
            <div className="space-y-6">
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher une classe..."
                            value={classSearchTerm}
                            onChange={(e) => setClassSearchTerm(e.target.value)}
                            className="w-full bg-[#1e293b] text-white border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>
                </div>

                {isClassesLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Skeleton key={i} className="h-32 w-full bg-white/5" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {filteredClasses.map((cls: ClassData) => (
                            <div key={cls.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-white font-bold text-lg">{cls.name}</h4>
                                        <p className="text-sm text-gray-400">{cls.cycle}</p>
                                    </div>
                                    <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full">
                                        {cls.studentCount} élèves
                                    </span>
                                </div>
                                {cls.mainTeacher && (
                                    <div className="mt-3 pt-3 border-t border-white/5">
                                        <p className="text-xs text-gray-500 uppercase">Prof. Principal</p>
                                        <p className="text-sm text-gray-300">{cls.mainTeacher.user.firstName} {cls.mainTeacher.user.lastName}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-2">Administration (Consultation)</h2>

            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/10 custom-scrollbar">
                {[
                    { id: 'students', label: 'Annuaire Élèves', icon: Users },
                    { id: 'teachers', label: 'Corps Enseignant', icon: UserSquare2 },
                    { id: 'classes', label: 'Liste des Classes', icon: GraduationCap },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-t-lg transition-colors whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-indigo-600 text-white border-b-2 border-indigo-400'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="mt-4">
                {activeTab === 'students' && <CensorStudentsView />}
                {activeTab === 'teachers' && renderTeachersTab()}
                {activeTab === 'classes' && renderClassesTab()}
            </div>
        </div>
    );
};

export default SurveillantAdministrationSection;
