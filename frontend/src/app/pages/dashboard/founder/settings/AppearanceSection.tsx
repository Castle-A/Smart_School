import { Palette, Sun, Moon, Globe, Type } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const AppearanceSection = () => {
    const { i18n } = useTranslation();
    const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('dark');
    const [accentColor, setAccentColor] = useState('#6366f1');
    const [fontSize, setFontSize] = useState('medium');

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('language', lng);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-slate-900">Apparence</h2>
                <p className="text-slate-600 mt-1">Personnalisez l'interface selon vos préférences</p>
            </div>

            {/* Thème */}
            <div className="bg-white backdrop-blur-sm border border-slate-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Palette className="text-purple-400" size={24} />
                    <h3 className="text-lg font-semibold text-slate-900">Thème</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <ThemeOption
                        icon={<Sun size={20} />}
                        label="Clair"
                        active={theme === 'light'}
                        onClick={() => setTheme('light')}
                    />
                    <ThemeOption
                        icon={<Moon size={20} />}
                        label="Sombre"
                        active={theme === 'dark'}
                        onClick={() => setTheme('dark')}
                    />
                    <ThemeOption
                        icon={<Palette size={20} />}
                        label="Auto"
                        active={theme === 'auto'}
                        onClick={() => setTheme('auto')}
                    />
                </div>
            </div>

            {/* Couleur d'accentuation */}
            <div className="bg-white backdrop-blur-sm border border-slate-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Couleur d'accentuation</h3>
                <div className="grid grid-cols-6 gap-3">
                    {['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'].map(color => (
                        <button
                            key={color}
                            onClick={() => setAccentColor(color)}
                            className={`w-12 h-12 rounded-lg transition-transform ${accentColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110' : ''
                                }`}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
            </div>

            {/* Taille de police */}
            <div className="bg-white backdrop-blur-sm border border-slate-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Type className="text-blue-400" size={24} />
                    <h3 className="text-lg font-semibold text-slate-900">Taille de police</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <SizeOption label="Petit" active={fontSize === 'small'} onClick={() => setFontSize('small')} />
                    <SizeOption label="Moyen" active={fontSize === 'medium'} onClick={() => setFontSize('medium')} />
                    <SizeOption label="Grand" active={fontSize === 'large'} onClick={() => setFontSize('large')} />
                </div>
            </div>

            {/* Langue */}
            <div className="bg-white backdrop-blur-sm border border-slate-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Globe className="text-emerald-400" size={24} />
                    <h3 className="text-lg font-semibold text-slate-900">Langue de l'interface</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { code: 'fr', label: 'Français' },
                        { code: 'en', label: 'English' },
                        { code: 'es', label: 'Español' },
                        { code: 'de', label: 'Deutsch' }
                    ].map(lang => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className={`p-4 rounded-lg border transition-colors ${i18n.language === lang.code
                                ? 'bg-indigo-600 border-indigo-500 text-slate-900'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

interface ThemeOptionProps {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
}

const ThemeOption: React.FC<ThemeOptionProps> = ({ icon, label, active, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`p-4 rounded-lg border transition-colors ${active
                ? 'bg-indigo-600 border-indigo-500 text-slate-900'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
        >
            <div className="flex flex-col items-center gap-2">
                {icon}
                <span className="text-sm font-medium">{label}</span>
            </div>
        </button>
    );
};

interface SizeOptionProps {
    label: string;
    active: boolean;
    onClick: () => void;
}

const SizeOption: React.FC<SizeOptionProps> = ({ label, active, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`p-4 rounded-lg border transition-colors ${active
                ? 'bg-indigo-600 border-indigo-500 text-slate-900'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
        >
            <span className="text-sm font-medium">{label}</span>
        </button>
    );
};

export default AppearanceSection;
