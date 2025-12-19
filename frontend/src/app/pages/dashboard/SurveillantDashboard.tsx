import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import type { MenuItemId } from '../../layouts/DashboardLayout';
import SurveillantOverviewSection from './surveillant/SurveillantOverviewSection';
import WelcomeToast from '../../../shared/components/WelcomeToast';

// Placeholder components for other sections
import { SurveillantVieScolaireSection } from './surveillant/SurveillantVieScolaireSection';
import SurveillantAdministrationSection from './surveillant/SurveillantAdministrationSection';
import SurveillantProgrammeSection from './surveillant/SurveillantProgrammeSection';
import SurveillantCommunicationSection from './surveillant/SurveillantCommunicationSection';

// All sections implemented
import SettingsPage from './founder/SettingsPage';


const SurveillantDashboard = () => {
    const { user, logout } = useAuth();
    const [activeSection, setActiveSection] = useState<MenuItemId | 'settings'>('vue_ensemble'); // Default to overview
    const [showWelcome, setShowWelcome] = useState(false);

    const location = useLocation();

    useEffect(() => {
        const hasSeenWelcome = sessionStorage.getItem('welcomeShown');
        if (!hasSeenWelcome) {
            setShowWelcome(true);
            sessionStorage.setItem('welcomeShown', 'true');
        }
    }, []);

    useEffect(() => {
        if (location.state && (location.state as any).section) {
            setActiveSection((location.state as any).section);
        }
    }, [location]);

    // Override default because Surveillant menu usually doesn't have "vue_ensemble" in DashboardLayout config? 
    // Wait, DashboardLayout config for SUPERVISOR: ["administration", "vie_scolaire", "programme_scolaire", "communication"]
    // So "vue_ensemble" might not be available. I should check MenuItemId.

    const renderContent = () => {
        switch (activeSection) {
            // Note: If 'vue_ensemble' is not in the menu list for SUPERVISOR, this case might not be reachable via menu
            case 'vue_ensemble':
                return <SurveillantOverviewSection onNavigate={(section) => setActiveSection(section as MenuItemId)} />;
            case 'administration':
                return <SurveillantAdministrationSection />;
            case 'vie_scolaire':
                return <SurveillantVieScolaireSection />;
            case 'programme_scolaire':
                return <SurveillantProgrammeSection />;
            case 'communication':
                return <SurveillantCommunicationSection />;
            case 'settings':
                return <SettingsPage onBackToDashboard={() => setActiveSection('administration')} />;
            default:
                return <SurveillantAdministrationSection />;
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
                role="SUPERVISOR"
                userName={`${user.firstName} ${user.lastName}`}
                userEmail={user.email}
                onLogout={logout}
                onMenuClick={(item) => setActiveSection(item)}
                activeSection={activeSection}
            >
                <div className="max-w-7xl mx-auto">
                    {renderContent()}
                </div>
            </DashboardLayout>
        </>
    );
};

export default SurveillantDashboard;
