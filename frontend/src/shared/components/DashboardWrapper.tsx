import { useAuth } from '../contexts/AuthContext';
import FounderDashboard from '@app/pages/dashboard/FounderDashboard';
import DirectorDashboard from '@app/pages/dashboard/DirectorDashboard';
import SecretaryDashboard from '@app/pages/dashboard/SecretaryDashboard';
import SupervisorDashboard from '@app/pages/dashboard/SupervisorDashboard';
import CensorDashboard from '@app/pages/dashboard/CensorDashboard';
import AccountantDashboard from '@app/pages/dashboard/AccountantDashboard';
import TeacherDashboard from '@app/pages/dashboard/TeacherDashboard';

export default function DashboardWrapper() {
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    // Route to appropriate dashboard based on user role
    switch (user.role) {
        case 'fondateur':
            return <FounderDashboard />;
        case 'directeur':
            return <DirectorDashboard />;
        case 'secretaire':
            return <SecretaryDashboard />;
        case 'surveillant':
            return <SupervisorDashboard />;
        case 'censeur':
            return <CensorDashboard />;
        case 'comptable':
            return <AccountantDashboard />;
        case 'professeur':
            return <TeacherDashboard />;
        case 'eleve':
        case 'parent':
            // TODO: Implement Student and Parent dashboards
            return <div className="p-8 text-white">Dashboard en construction</div>;
        default:
            return <FounderDashboard />;
    }
}
