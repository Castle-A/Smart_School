import { Navigate } from 'react-router-dom';
import { useAuth } from '@shared/contexts/AuthContext';

interface RequirePlatformRoleProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

const RequirePlatformRole = ({ children, allowedRoles = ['SUPPORT_TECH', 'SUPER_ADMIN_PLATFORM'] }: RequirePlatformRoleProps) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user || !user.platformRole) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.platformRole)) {
        return <Navigate to="/app/dashboard" replace />;
    }

    return <>{children}</>;
};

export default RequirePlatformRole;
