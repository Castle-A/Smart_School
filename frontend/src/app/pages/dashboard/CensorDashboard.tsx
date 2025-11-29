import { useState, useEffect } from 'react';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import type { MenuItemId } from '../../layouts/DashboardLayout';
import OverviewSection from './founder/OverviewSection';
import VieScolaireSection from './founder/VieScolaireSection';
import ProgrammeScolaireSection from './founder/ProgrammeScolaireSection';
import CommunicationSection from './founder/CommunicationSection';
import SettingsPage from './founder/SettingsPage';
import WelcomeToast from '../../../shared/components/WelcomeToast';

const CensorDashboard = () => {
    const { user, logout } = useAuth();
    const [activeSection, setActiveSection] = useState<MenuItemId | 'settings'>('vue_ensemble');
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        const hasShownWelcome = sessionStorage.getItem('hasShownWelcome');
        if (!hasShownWelcome && user) {
            setShowWelcome(true);
            sessionStorage.setItem('hasShownWelcome', 'true');
        }
    }, [user]);

    const renderContent = () => {
        switch (activeSection) {
            case 'vue_ensemble':
                return <OverviewSection />;
            case 'vie_scolaire':
                return <VieScolaireSection />;
            case 'programme_scolaire':
                return <ProgrammeScolaireSection />;
            case 'communication':
                return <CommunicationSection />;
            case 'settings':
                return <SettingsPage onBackToDashboard={() => setActiveSection('vue_ensemble')} />;
            default:
                return <OverviewSection />;
        }
    };

    if (!user) return null;

    return (
        <>
            {showWelcome && (
                <WelcomeToast
                    userName={`${user.firstName} ${user.lastName}`}
                    gender={user.gender}
                    onClose={() => setShowWelcome(false)}
                />
            )}
            <DashboardLayout
                role="censeur"
                userName={`${user.firstName} ${user.lastName}`}
                userEmail={user.email}
                onLogout={logout}
                onMenuClick={(item) => setActiveSection(item)}
            >
                <div className="max-w-7xl mx-auto">
                    {renderContent()}
                </div>
            </DashboardLayout>
        </>
    );
};

export default CensorDashboard;
