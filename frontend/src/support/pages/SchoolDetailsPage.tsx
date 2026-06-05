import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, School, Users, Calendar, Key, CheckCircle } from 'lucide-react';
import api from '../../shared/api/api';

interface SchoolDetails {
    id: string;
    name: string;
    address?: string;
    phone?: string;
    email?: string;
    plan: string;
    subscriptionStatus: string;
    isActive: boolean;
    createdAt: string;
    founderId?: string;
    stats: {
        users: number;
        students: number;
        classes: number;
    };
}

const SchoolDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [school, setSchool] = useState<SchoolDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [resetSuccess, setResetSuccess] = useState(false);

    useEffect(() => {
        fetchSchoolDetails();
    }, [id]);

    const fetchSchoolDetails = async () => {
        try {
            const response = await api.get(`/support/schools/${id}/meta`);
            setSchool(response.data);
        } catch (error) {
            console.error('Error fetching school details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (userId: string) => {
        try {
            const response = await api.post(`/support/users/${userId}/reset-password`);
            console.log('Password reset:', response.data);
            setResetSuccess(true);
            setTimeout(() => setResetSuccess(false), 3000);
        } catch (error) {
            console.error('Error resetting password:', error);
        }
    };

    if (loading) {
        return <div className="text-center text-gray-400 py-12">Loading school details...</div>;
    }

    if (!school) {
        return <div className="text-center text-gray-400 py-12">School not found</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/support')}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h2 className="text-3xl font-bold text-white">{school.name}</h2>
                    <p className="text-gray-400">School Details & Management</p>
                </div>
            </div>

            {/* Success Message */}
            {resetSuccess && (
                <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle className="text-emerald-400" size={24} />
                    <p className="text-emerald-400">Password reset successfully! Temporary password logged in console.</p>
                </div>
            )}

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-indigo-500/20 rounded-xl">
                            <Users size={24} className="text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{school.stats.users}</p>
                            <p className="text-sm text-gray-400">Staff Members</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-emerald-500/20 rounded-xl">
                            <School size={24} className="text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{school.stats.students}</p>
                            <p className="text-sm text-gray-400">Students</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-purple-500/20 rounded-xl">
                            <Calendar size={24} className="text-purple-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{school.stats.classes}</p>
                            <p className="text-sm text-gray-400">Classes</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* School Information */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-6">School Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Address</p>
                        <p className="text-white">{school.address || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Phone</p>
                        <p className="text-white">{school.phone || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Email</p>
                        <p className="text-white">{school.email || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Created</p>
                        <p className="text-white">{new Date(school.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Subscription Plan</p>
                        <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-medium">
                            {school.plan}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Status</p>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${school.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                            {school.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-6">Support Actions</h3>
                <div className="space-y-4">
                    <button
                        onClick={() => school.founderId && handleResetPassword(school.founderId)}
                        disabled={!school.founderId}
                        className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-colors font-medium ${school.founderId
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <Key size={20} />
                        Reset Founder Password
                    </button>
                    <p className="text-sm text-gray-400">
                        ⚠️ This will generate a temporary password and require the founder to change it on next login.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SchoolDetailsPage;
