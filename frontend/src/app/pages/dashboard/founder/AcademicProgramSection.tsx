import { BookOpen, GraduationCap, BarChart2, FileText } from 'lucide-react';

export default function AcademicProgramSection() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Programme Scolaire</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Moyenne Générale", value: "12.5/20", icon: BarChart2, color: "text-blue-400", bg: "bg-blue-500/10" },
                    { label: "Taux de Réussite", value: "88%", icon: GraduationCap, color: "text-green-400", bg: "bg-green-500/10" },
                    { label: "Matières", value: "14", icon: BookOpen, color: "text-purple-400", bg: "bg-purple-500/10" },
                    { label: "Bulletins Générés", value: "100%", icon: FileText, color: "text-yellow-400", bg: "bg-yellow-500/10" },
                ].map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                            <p className="text-white/60 text-sm">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance by Class */}
                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-6">Performance par Classe</h3>
                    <div className="space-y-4">
                        {[
                            { name: "Terminal C", avg: "14.2", trend: "up" },
                            { name: "Terminal D", avg: "11.8", trend: "down" },
                            { name: "3ème A", avg: "13.5", trend: "stable" },
                            { name: "6ème 1", avg: "15.1", trend: "up" },
                        ].map((cls, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                                <span className="w-20 text-sm font-medium text-white">{cls.name}</span>
                                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${parseFloat(cls.avg) >= 14 ? 'bg-green-500' : parseFloat(cls.avg) >= 10 ? 'bg-blue-500' : 'bg-red-500'}`}
                                        style={{ width: `${(parseFloat(cls.avg) / 20) * 100}%` }}
                                    />
                                </div>
                                <span className="w-12 text-right text-sm font-bold text-white">{cls.avg}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Exams */}
                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-6">Prochains Examens</h3>
                    <div className="space-y-4">
                        {[
                            { subject: "Mathématiques", classes: "Tle C, Tle D", date: "02 Déc", type: "Devoir Surveillé" },
                            { subject: "Physique-Chimie", classes: "3ème A, 3ème B", date: "03 Déc", type: "Interrogation" },
                            { subject: "Français", classes: "6ème 1, 6ème 2", date: "05 Déc", type: "Composition" },
                        ].map((exam, idx) => (
                            <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-white">{exam.subject}</h4>
                                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">{exam.type}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-white/60">
                                    <span>{exam.classes}</span>
                                    <span>{exam.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
