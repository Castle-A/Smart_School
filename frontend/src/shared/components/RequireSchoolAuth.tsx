import { Navigate } from 'react-router-dom';
import { useAuth } from '@shared/contexts/AuthContext';

const RequireSchoolAuth = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Chargement...</div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If user has no school role (e.g. platform admin only), redirect to support or login
    if (!user.schoolRole) {
        if (user.platformRole) {
            return <Navigate to="/support" replace />;
        }
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default RequireSchoolAuth;
