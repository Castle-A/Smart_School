import { useAuth } from '../contexts/AuthContext';
import FounderDashboard from '@app/pages/dashboard/FounderDashboard';
import DirectorDashboard from '@app/pages/dashboard/DirectorDashboard';
import SecretaryDashboard from '@app/pages/dashboard/SecretaryDashboard';
import SurveillantDashboard from '@app/pages/dashboard/SurveillantDashboard';
import CensorDashboard from '@app/pages/dashboard/CensorDashboard';
import AccountantDashboard from '@app/pages/dashboard/AccountantDashboard';
import TeacherDashboard from '@app/pages/dashboard/TeacherDashboard';
import ParentDashboard from '@app/pages/dashboard/ParentDashboard';

export default function DashboardWrapper() {
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    // Route to appropriate dashboard based on user role
    switch (user.role) {
        case 'FOUNDER':
            return <FounderDashboard />;
        case 'DIRECTOR':
            return <DirectorDashboard />;
        case 'SECRETARY':
            return <SecretaryDashboard />;
        case 'SUPERVISOR':
            return <SurveillantDashboard />;
        case 'CENSOR':
            return <CensorDashboard />;
        case 'ACCOUNTANT':
            return <AccountantDashboard />;
        case 'TEACHER':
            return <TeacherDashboard />;
        case 'STUDENT':
        case 'PARENT':
            return <ParentDashboard />;
        default:
            return <FounderDashboard />;
    }
}
