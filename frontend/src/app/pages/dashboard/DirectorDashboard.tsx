import { useState, useEffect } from 'react';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import type { MenuItemId } from '../../layouts/DashboardLayout';
import DirectorOverviewSection from './director/DirectorOverviewSection';
import DirectorAdministrationSection from './director/DirectorAdministrationSection';
import DirectorSchoolLifeSection from './director/DirectorSchoolLifeSection';
import DirectorCurriculumSection from './director/DirectorCurriculumSection';
import DirectorCommunicationSection from './director/DirectorCommunicationSection';
import ConfigurationSection from './founder/ConfigurationSection';
import SettingsPage from './founder/SettingsPage';
import WelcomeToast from '../../../shared/components/WelcomeToast';

const DirectorDashboard = () => {
    const { user, logout } = useAuth();
    const [activeSection, setActiveSection] = useState<MenuItemId | 'settings'>('vue_ensemble');
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        const hasSeenWelcome = sessionStorage.getItem('welcomeShown');
        if (!hasSeenWelcome) {
            setShowWelcome(true);
            sessionStorage.setItem('welcomeShown', 'true');
        }
    }, []);

    const renderContent = () => {
        switch (activeSection) {
            case 'vue_ensemble':
                return <DirectorOverviewSection />;
            case 'administration':
                return <DirectorAdministrationSection />;
            case 'vie_scolaire':
                return <DirectorSchoolLifeSection />;
            case 'programme_scolaire':
                return <DirectorCurriculumSection />;
            case 'communication':
                return <DirectorCommunicationSection />;
            case 'configuration':
                return <ConfigurationSection />;
            case 'settings':
                return <SettingsPage onBackToDashboard={() => setActiveSection('vue_ensemble')} />;
            default:
                return <DirectorOverviewSection />;
        }
    };

    if (!user) return null;

    return (
        <>
            {showWelcome && (
                <WelcomeToast
                    firstName={user.firstName}
                    lastName={user.lastName}
                    gender={user.gender}
                    onClose={() => setShowWelcome(false)}
                />
            )}
            <DashboardLayout
                role="DIRECTOR"
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

export default DirectorDashboard;
