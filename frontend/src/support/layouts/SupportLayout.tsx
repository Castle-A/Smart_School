import { Outlet } from 'react-router-dom';
import { useAuth } from '@shared/contexts/AuthContext';
import { LogOut, Shield } from 'lucide-react';

const SupportLayout = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a]">
            {/* Header */}
            <header className="bg-white/5 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield className="text-indigo-400" size={32} />
                        <div>
                            <h1 className="text-xl font-bold text-white">SmartSchool Support</h1>
                            <p className="text-sm text-gray-400">Platform Administration</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-white">{user?.firstName} {user?.lastName}</p>
                            <p className="text-xs text-gray-400">{user?.platformRole}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default SupportLayout;
