import { type FC, type ReactNode } from 'react';
import { ArrowLeft, User, Shield, Bell, Palette, Accessibility, Settings as SettingsIcon, Calendar } from 'lucide-react';
import './SettingsLayout.css';

export type SettingsSectionId = 'profil' | 'securite' | 'notifications' | 'apparence' | 'accessibilite' | 'avance' | 'annees_scolaires';

interface SettingsLayoutProps {
    activeSection: SettingsSectionId;
    onSectionChange: (section: SettingsSectionId) => void;
    onBackToDashboard: () => void;
    hasUnsavedChanges: boolean;
    children: ReactNode;
}

const SETTINGS_SECTIONS = [
    { id: 'profil' as SettingsSectionId, label: 'Profil', icon: User },
    { id: 'securite' as SettingsSectionId, label: 'Sécurité', icon: Shield },
    { id: 'annees_scolaires' as SettingsSectionId, label: 'Années Scolaires', icon: Calendar },
    { id: 'notifications' as SettingsSectionId, label: 'Notifications', icon: Bell },
    { id: 'apparence' as SettingsSectionId, label: 'Apparence', icon: Palette },
    { id: 'accessibilite' as SettingsSectionId, label: 'Accessibilité', icon: Accessibility },
    { id: 'avance' as SettingsSectionId, label: 'Avancé', icon: SettingsIcon },
];

export const SettingsLayout: FC<SettingsLayoutProps> = ({
    activeSection,
    onSectionChange,
    onBackToDashboard,
    hasUnsavedChanges,
    children
}) => {
    const handleSectionChange = (section: SettingsSectionId) => {
        if (hasUnsavedChanges) {
            const confirmed = window.confirm(
                'Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter cette section ?'
            );
            if (!confirmed) return;
        }
        onSectionChange(section);
    };

    const handleBackToDashboard = () => {
        if (hasUnsavedChanges) {
            const confirmed = window.confirm(
                'Vous avez des modifications non sauvegardées. Voulez-vous vraiment retourner au dashboard ?'
            );
            if (!confirmed) return;
        }
        onBackToDashboard();
    };

    return (
        <div className="settings-root">
            {/* Settings Sidebar */}
            <aside className="settings-sidebar">
                {/* Back to Dashboard Button */}
                <button
                    onClick={handleBackToDashboard}
                    className="back-to-dashboard-btn"
                >
                    <ArrowLeft size={20} />
                    <span>Retour au dashboard</span>
                </button>

                {/* Settings Title */}
                <div className="settings-header">
                    <h2>Paramètres</h2>
                    <p>Gérez vos préférences</p>
                </div>

                {/* Settings Navigation */}
                <nav className="settings-nav">
                    {SETTINGS_SECTIONS.map((section) => {
                        const Icon = section.icon;
                        return (
                            <button
                                key={section.id}
                                className={`settings-nav-item ${activeSection === section.id ? 'active' : ''}`}
                                onClick={() => handleSectionChange(section.id)}
                            >
                                <Icon size={20} className="settings-nav-icon" />
                                <span>{section.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Unsaved Changes Indicator */}
                {hasUnsavedChanges && (
                    <div className="unsaved-changes-indicator">
                        <div className="unsaved-dot"></div>
                        <span>Modifications non sauvegardées</span>
                    </div>
                )}
            </aside>

            {/* Settings Content */}
            <main className="settings-content">
                {children}
            </main>
        </div>
    );
};

export default SettingsLayout;
