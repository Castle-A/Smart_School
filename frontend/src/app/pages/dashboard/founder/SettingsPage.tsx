import { useState } from 'react';
import SettingsLayout, { type SettingsSectionId } from '../../../../shared/components/SettingsLayout';
import ProfileSection from './settings/ProfileSection';
import SecuritySection from './settings/SecuritySection';
import NotificationsSection from './settings/NotificationsSection';
import AppearanceSection from './settings/AppearanceSection';
import AccessibilitySection from './settings/AccessibilitySection';
import AdvancedSection from './settings/AdvancedSection';
import AcademicYearManager from '../../dashboard/components/AcademicYearManager';

interface SettingsPageProps {
    onBackToDashboard?: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onBackToDashboard }) => {
    const [activeSection, setActiveSection] = useState<SettingsSectionId>('profil');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const handleBackToDashboard = () => {
        if (onBackToDashboard) {
            onBackToDashboard();
        }
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'profil':
                return <ProfileSection onDirtyChange={setHasUnsavedChanges} />;
            case 'securite':
                return <SecuritySection />;
            case 'annees_scolaires':
                return <AcademicYearManager />;
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

    return (
        <SettingsLayout
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            onBackToDashboard={handleBackToDashboard}
            hasUnsavedChanges={hasUnsavedChanges}
        >
            {renderSection()}
        </SettingsLayout>
    );
};

export default SettingsPage;
