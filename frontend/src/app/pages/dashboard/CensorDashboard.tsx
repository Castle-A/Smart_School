import { useState, useEffect } from 'react';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import type { MenuItemId } from '../../layouts/DashboardLayout';
import CensorOverviewSection from './censor/CensorOverviewSection';
import CensorAdministrationSection from './censor/CensorAdministrationSection';
import CensorSchoolLifeSection from './censor/CensorSchoolLifeSection';
import CensorCurriculumSection from './censor/CensorCurriculumSection';
import CensorCommunicationSection from './censor/CensorCommunicationSection';
import ProfileSection from './founder/settings/ProfileSection';
import SecuritySection from './founder/settings/SecuritySection';
import NotificationsSection from './founder/settings/NotificationsSection';
import AppearanceSection from './founder/settings/AppearanceSection';
import AccessibilitySection from './founder/settings/AccessibilitySection';
import AdvancedSection from './founder/settings/AdvancedSection';
import WelcomeToast from '../../../shared/components/WelcomeToast';

type SettingsSectionId = 'profil' | 'securite' | 'notifications' | 'apparence' | 'accessibilite' | 'avance';

const CensorDashboard = () => {
    const { user, logout } = useAuth();
    const [activeSection, setActiveSection] = useState<MenuItemId | 'settings'>('vue_ensemble');
    const [activeSettingsSection, setActiveSettingsSection] = useState<SettingsSectionId>('profil');
    const [showWelcome, setShowWelcome] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect(() => {
        if (user) {
            setShowWelcome(true);
        }
    }, [user]);

    const handleBackToDashboard = () => {
        if (hasUnsavedChanges) {
            const confirmed = window.confirm(
                'Vous avez des modifications non sauvegardées. Voulez-vous vraiment retourner au dashboard ?'
            );
            if (!confirmed) return;
        }
        setActiveSection('vue_ensemble');
        setHasUnsavedChanges(false);
    };

    const handleSettingsSectionChange = (section: SettingsSectionId) => {
        if (hasUnsavedChanges) {
            const confirmed = window.confirm(
                'Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter cette section ?'
            );
            if (!confirmed) return;
        }
        setActiveSettingsSection(section);
        setHasUnsavedChanges(false);
    };

    const renderSettingsContent = () => {
        switch (activeSettingsSection) {
            case 'profil':
                return <ProfileSection onDirtyChange={setHasUnsavedChanges} />;
            case 'securite':
                return <SecuritySection />;
            case 'notifications':
                return <NotificationsSection />;
            case 'apparence':
                return <AppearanceSection />;
            case 'accessibilite':
                return <AccessibilitySection />;
            case 'avance':
                return <AdvancedSection />;
            default:
                return <ProfileSection onDirtyChange={setHasUnsavedChanges} />;
        }
    };

    const renderContent = () => {
        if (activeSection === 'settings') {
            return (
                <div className="max-w-7xl mx-auto">
                    {renderSettingsContent()}
                </div>
            );
        }

        switch (activeSection) {
            case 'vue_ensemble':
                return <CensorOverviewSection />;
            case 'administration':
                return <CensorAdministrationSection />;
            case 'vie_scolaire':
                return <CensorSchoolLifeSection />;
            case 'programme_scolaire':
                return <CensorCurriculumSection />;
            case 'communication':
                return <CensorCommunicationSection />;
            default:
                return <CensorOverviewSection />;
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
                role="CENSOR"
                userName={`${user.firstName} ${user.lastName}`}
                userEmail={user.email}
                onLogout={logout}
                onMenuClick={(item) => setActiveSection(item)}
                isSettingsMode={activeSection === 'settings'}
                activeSettingsSection={activeSettingsSection}
                onSettingsSectionChange={(section) => handleSettingsSectionChange(section as any)}
                onBackToDashboard={handleBackToDashboard}
                hasUnsavedChanges={hasUnsavedChanges}
            >
                <div className="max-w-7xl mx-auto">
                    {renderContent()}
                </div>
            </DashboardLayout>
        </>
    );
};

export default CensorDashboard;
