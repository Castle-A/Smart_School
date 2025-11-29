import { useEffect, useState, useRef, type FC, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
    Users,
    DollarSign,
    School,
    BookOpen,
    MessageSquare,
    Settings,
    GraduationCap,
    Search,
    ChevronLeft,
    ChevronRight,
    LogOut,
    LayoutDashboard,
    Globe,
    LifeBuoy,
    User,
    Shield,
    Bell,
    Palette,
    Accessibility,
    ArrowLeft
} from "lucide-react";
import "./DashboardLayout.css";

import type { UserRole } from "../../shared/types/roles";

export type { UserRole };

export type MenuItemId =
    | "vue_ensemble"
    | "administration"
    | "comptabilite"
    | "vie_scolaire"
    | "programme_scolaire"
    | "communication"
    | "configuration"
    | "settings";

const MENU_LABELS: Record<MenuItemId, string> = {
    vue_ensemble: "Vue d'ensemble",
    administration: "Administration",
    comptabilite: "Comptabilité",
    vie_scolaire: "Vie scolaire",
    programme_scolaire: "Programme scolaire",
    communication: "Communication",
    configuration: "Configuration",
    settings: "Paramètres",
};

const MENU_ICONS: Record<MenuItemId, any> = {
    vue_ensemble: LayoutDashboard,
    administration: Users,
    comptabilite: DollarSign,
    vie_scolaire: School,
    programme_scolaire: BookOpen,
    communication: MessageSquare,
    configuration: Settings,
    settings: Settings,
};

const MENU_BY_ROLE: Record<UserRole, MenuItemId[]> = {
    fondateur: [
        "vue_ensemble",
        "administration",
        "vie_scolaire",
        "programme_scolaire",
        "comptabilite",
        "communication",
        "configuration",
    ],
    directeur: [
        "administration",
        "vie_scolaire",
        "programme_scolaire",
        "communication",
        "configuration",
    ],
    secretaire: [
        "administration",
        "vie_scolaire",
        "programme_scolaire",
        "communication",
    ],
    surveillant: [
        "administration",
        "vie_scolaire",
        "programme_scolaire",
        "communication",
    ],
    censeur: [
        "administration",
        "vie_scolaire",
        "programme_scolaire",
        "communication",
    ],
    comptable: [
        "administration",
        "programme_scolaire",
        "comptabilite",
        "communication",
    ],
    professeur: [
        "vue_ensemble",
        "vie_scolaire",
        "programme_scolaire",
        "communication",
    ],
    eleve: ["vie_scolaire", "programme_scolaire"],
    parent: ["vie_scolaire", "programme_scolaire"],
};

// Settings menu configuration
const SETTINGS_MENU_ITEMS = [
    { id: 'profil', label: 'Profil', icon: User },
    { id: 'securite', label: 'Sécurité', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'apparence', label: 'Apparence', icon: Palette },
    { id: 'accessibilite', label: 'Accessibilité', icon: Accessibility },
    { id: 'avance', label: 'Avancé', icon: Settings },
];

interface DashboardLayoutProps {
    role: UserRole;
    userName?: string;
    userEmail?: string;
    children?: ReactNode;
    onMenuClick?: (item: MenuItemId) => void;
    onLogout?: () => void;
    // Settings mode props
    isSettingsMode?: boolean;
    activeSettingsSection?: string;
    onSettingsSectionChange?: (section: string) => void;
    onBackToDashboard?: () => void;
    hasUnsavedChanges?: boolean;
}

export const DashboardLayout: FC<DashboardLayoutProps> = ({
    role,
    userName = "Utilisateur",
    userEmail = "user@smartschool.com",
    children,
    onMenuClick,
    onLogout,
    isSettingsMode = false,
    activeSettingsSection = 'profil',
    onSettingsSectionChange,
    onBackToDashboard,
    hasUnsavedChanges = false,
}) => {
    const { t, i18n } = useTranslation();
    const menuItems = MENU_BY_ROLE[role];

    const [activeItem, setActiveItem] = useState<MenuItemId | null>(
        menuItems[0] ?? null
    );
    const [searchQuery, setSearchQuery] = useState("");
    // Initialize collapsed state based on screen width
    const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

    const profileMenuRef = useRef<HTMLDivElement>(null);
    const langMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setActiveItem(menuItems[0] ?? null);
    }, [role, menuItems]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
            if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
                setIsLangMenuOpen(false);
            }
        };

        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsCollapsed(true);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('resize', handleResize);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleClick = (item: MenuItemId) => {
        setActiveItem(item);
        onMenuClick?.(item);
    };

    const getUserInitials = (name: string) => {
        const trimmedName = name.trim();
        if (!trimmedName && userEmail) {
            return userEmail.substring(0, 2).toUpperCase();
        }

        const parts = trimmedName.split(' ').filter(part => part.length > 0);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        } else if (parts.length === 1) {
            return parts[0].substring(0, 2).toUpperCase();
        }
        return "??";
    };

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('language', lng);
        setIsLangMenuOpen(false);
    };

    return (
        <div className={`dashboard-root ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
            {/* SIDEBAR */}
            <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo">
                        <div className="logo-icon">
                            <GraduationCap size={24} />
                        </div>
                        {!isCollapsed && <span className="logo-text">SmartSchool</span>}
                    </div>
                    <button
                        className="menu-toggle"
                        aria-label="Toggle menu"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                    >
                        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                {!isCollapsed && (
                    <div className="search-box">
                        <div style={{ position: 'relative' }}>
                            <Search
                                size={16}
                                style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'rgba(255, 255, 255, 0.4)',
                                }}
                            />
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Rechercher..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ paddingLeft: '36px' }}
                            />
                        </div>
                    </div>
                )}

                <nav className="nav-menu">
                    {isSettingsMode ? (
                        // Settings menu items
                        <>
                            {SETTINGS_MENU_ITEMS.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        className={"nav-item" + (activeSettingsSection === item.id ? " active" : "")}
                                        onClick={() => onSettingsSectionChange?.(item.id)}
                                        type="button"
                                        title={isCollapsed ? item.label : undefined}
                                    >
                                        <Icon className="nav-icon" />
                                        {!isCollapsed && <span>{item.label}</span>}
                                    </button>
                                );
                            })}
                        </>
                    ) : (
                        // Normal dashboard menu items
                        <>
                            {menuItems.map((item) => {
                                const Icon = MENU_ICONS[item];
                                return (
                                    <button
                                        key={item}
                                        className={"nav-item" + (activeItem === item ? " active" : "")}
                                        onClick={() => handleClick(item)}
                                        type="button"
                                        title={isCollapsed ? t(`menu.${item}`, MENU_LABELS[item]) : undefined}
                                    >
                                        <Icon className="nav-icon" />
                                        {!isCollapsed && <span>{t(`menu.${item}`, MENU_LABELS[item])}</span>}
                                    </button>
                                );
                            })}
                        </>
                    )}
                </nav>

                {/* Back to Dashboard button (only shown in settings mode) */}
                {isSettingsMode && !isCollapsed && (
                    <div style={{ padding: '0 8px', marginTop: 'auto' }}>
                        <button
                            onClick={onBackToDashboard}
                            className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white border border-white/10"
                        >
                            <ArrowLeft size={20} />
                            <span className="text-sm font-medium">Retour au dashboard</span>
                        </button>
                        {hasUnsavedChanges && (
                            <div className="mt-2 flex items-center gap-2 text-xs text-yellow-400 px-2">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                <span>Modifications non sauvegardées</span>
                            </div>
                        )}
                    </div>
                )}

                {/* SIDEBAR FOOTER WITH LANGUAGE, SUPPORT AND PROFILE */}
                <div className="sidebar-footer" style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>

                    {/* Language Selector */}
                    <div className="language-selector" style={{ padding: '0 8px', position: 'relative' }} ref={langMenuRef}>
                        <button
                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
                            title="Changer la langue"
                            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                        >
                            <Globe size={20} />
                            {!isCollapsed && <span className="text-sm font-medium">{i18n.language === 'fr' ? 'Français' : i18n.language === 'en' ? 'English' : i18n.language === 'es' ? 'Español' : 'Deutsch'}</span>}
                        </button>

                        {isLangMenuOpen && (
                            <div className="absolute bottom-full left-0 mb-2 w-40 bg-[#1a1f37] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
                                {[
                                    { code: 'fr', label: 'Français' },
                                    { code: 'en', label: 'English' },
                                    { code: 'es', label: 'Español' },
                                    { code: 'de', label: 'Deutsch' }
                                ].map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => changeLanguage(lang.code)}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors ${i18n.language === lang.code ? 'text-white bg-white/5' : 'text-gray-400'}`}
                                    >
                                        {lang.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Support Button */}
                    <div className="support-button" style={{ padding: '0 8px' }}>
                        <button
                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
                            title="Contacter le support"
                        >
                            <LifeBuoy size={20} />
                            {!isCollapsed && <span className="text-sm font-medium">Support</span>}
                        </button>
                    </div>

                    <div
                        className="user-profile"
                        ref={profileMenuRef}
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        style={{ cursor: 'pointer', position: 'relative', marginTop: '8px' }}
                    >
                        <div className="user-avatar">
                            {getUserInitials(userName)}
                        </div>
                        {!isCollapsed && (
                            <div className="user-info">
                                <span className="user-name">{userName}</span>
                                <span className="user-email">{userEmail}</span>
                            </div>
                        )}

                        {/* Profile Menu Popover */}
                        {isProfileMenuOpen && (
                            <div className="profile-menu-popover" style={{
                                position: 'absolute',
                                bottom: '100%',
                                left: '0',
                                width: '100%',
                                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                padding: '8px',
                                marginBottom: '12px',
                                boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)',
                                zIndex: 50
                            }}>
                                <button
                                    className="profile-menu-item"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onMenuClick?.('settings' as MenuItemId);
                                        setIsProfileMenuOpen(false);
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        width: '100%',
                                        padding: '10px',
                                        color: '#e2e8f0',
                                        fontSize: '14px',
                                        borderRadius: '8px',
                                        transition: 'background 0.2s',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        justifyContent: isCollapsed ? 'center' : 'flex-start'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    title={isCollapsed ? "Paramètres" : undefined}
                                >
                                    <Settings size={16} />
                                    {!isCollapsed && <span>Paramètres</span>}
                                </button>
                                <button
                                    className="profile-menu-item"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onLogout?.();
                                        setIsProfileMenuOpen(false);
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        width: '100%',
                                        padding: '10px',
                                        color: '#ef4444',
                                        fontSize: '14px',
                                        borderRadius: '8px',
                                        transition: 'background 0.2s',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        justifyContent: isCollapsed ? 'center' : 'flex-start'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    title={isCollapsed ? "Déconnexion" : undefined}
                                >
                                    <LogOut size={16} />
                                    {!isCollapsed && <span>Déconnexion</span>}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="main-content">
                {children ?? (
                    <div style={{ padding: "24px" }}>
                        <h1 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "16px" }}>
                            {t('dashboard.title', `Dashboard ${role}`)}
                        </h1>
                        <p style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                            {t('dashboard.active_section', 'Section active')} : {activeItem && t(`menu.${activeItem}`, MENU_LABELS[activeItem])}
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default DashboardLayout;
