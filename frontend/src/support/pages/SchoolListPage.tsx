import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, School, Users, Calendar } from 'lucide-react';

interface SchoolMeta {
    id: string;
    name: string;
    plan: string;
    subscriptionStatus: string;
    isActive: boolean;
    createdAt: string;
    userCount: number;
    studentCount: number;
}

const SchoolListPage = () => {
    const navigate = useNavigate();
    const [schools, setSchools] = useState<SchoolMeta[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSchools();
    }, []);

    const fetchSchools = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://localhost:3000/support/schools', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setSchools(data);
        } catch (error) {
            console.error('Error fetching schools:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredSchools = schools.filter(school =>
        school.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Schools Management</h2>
                <p className="text-gray-400">Manage and monitor all schools on the platform</p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search schools..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
            </div>

            {/* Schools Grid */}
            {loading ? (
                <div className="text-center text-gray-400 py-12">Loading schools...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSchools.map((school) => (
                        <div
                            key={school.id}
                            onClick={() => navigate(`/support/schools/${school.id}`)}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all cursor-pointer group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-indigo-500/20 rounded-xl group-hover:bg-indigo-500/30 transition-colors">
                                    <School className="text-indigo-400" size={24} />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${school.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                                    }`}>
                                    {school.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            <h3 className="text-lg font-semibold text-white mb-2">{school.name}</h3>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Users size={16} />
                                    <span>{school.userCount} staff · {school.studentCount} students</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Calendar size={16} />
                                    <span>Created {new Date(school.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                <span className="text-sm text-gray-400">Plan</span>
                                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-medium">
                                    {school.plan}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {filteredSchools.length === 0 && !loading && (
                <div className="text-center text-gray-400 py-12">No schools found</div>
            )}
        </div>
    );
};

export default SchoolListPage;
