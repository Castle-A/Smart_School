import { CheckSquare, UserCheck, UserX, Clock } from 'lucide-react';

const TeacherSchoolLifeSection = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Vie Scolaire - Mes Classes</h2>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20">
                        <CheckSquare size={18} />
                        Faire l'appel
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Mes Classes */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Mes Classes</h3>
                    <div className="space-y-3">
                        {[
                            { name: "3ème A", subject: "Mathématiques", students: 42, present: 40, absent: 2 },
                            { name: "Tle D", subject: "Mathématiques", students: 35, present: 33, absent: 2 },
                            { name: "1ère C", subject: "Mathématiques", students: 38, present: 38, absent: 0 },
                        ].map((cls, idx) => (
                            <div key={idx} className="p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="text-white font-bold">{cls.name}</h4>
                                        <p className="text-sm text-gray-400">{cls.subject}</p>
                                    </div>
                                    <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full">{cls.students} élèves</span>
                                </div>
                                <div className="flex gap-4 text-xs">
                                    <div className="flex items-center gap-1">
                                        <UserCheck size={14} className="text-emerald-400" />
                                        <span className="text-emerald-400">{cls.present} présents</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <UserX size={14} className="text-red-400" />
                                        <span className="text-red-400">{cls.absent} absents</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Absences à Justifier */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Absences Récentes</h3>
                    <div className="space-y-3">
                        {[
                            { student: "Kouamé Jean", class: "3ème A", date: "Aujourd'hui", time: "08:00" },
                            { student: "Diallo Awa", class: "Tle D", date: "Aujourd'hui", time: "08:00" },
                            { student: "Soro Ali", class: "1ère C", date: "Hier", time: "14:00" },
                        ].map((absence, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                <div>
                                    <p className="text-sm font-medium text-white">{absence.student}</p>
                                    <p className="text-xs text-gray-400">{absence.class}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">{absence.date}</p>
                                    <div className="flex items-center gap-1 text-xs text-amber-400">
                                        <Clock size={12} />
                                        {absence.time}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherSchoolLifeSection;
