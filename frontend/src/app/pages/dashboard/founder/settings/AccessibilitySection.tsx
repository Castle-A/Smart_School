import { Eye, Keyboard, Volume2 } from 'lucide-react';
import { useState } from 'react';

const AccessibilitySection = () => {
    const [settings, setSettings] = useState({
        highContrast: false,
        reduceMotion: false,
        screenReader: false,
        keyboardNav: true,
        autoSubtitles: false
    });

    const toggleSetting = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-slate-900">Accessibilité</h2>
                <p className="text-slate-600 mt-1">Options pour améliorer votre expérience</p>
            </div>

            {/* Options visuelles */}
            <div className="bg-white backdrop-blur-sm border border-slate-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Eye className="text-blue-400" size={24} />
                    <h3 className="text-lg font-semibold text-slate-900">Options visuelles</h3>
                </div>
                <div className="space-y-3">
                    <AccessibilityToggle
                        label="Mode contraste élevé"
                        description="Augmente le contraste pour une meilleure lisibilité"
                        enabled={settings.highContrast}
                        onChange={() => toggleSetting('highContrast')}
                    />
                    <AccessibilityToggle
                        label="Réduction des animations"
                        description="Réduit les mouvements et animations"
                        enabled={settings.reduceMotion}
                        onChange={() => toggleSetting('reduceMotion')}
                    />
                </div>
            </div>

            {/* Options de navigation */}
            <div className="bg-white backdrop-blur-sm border border-slate-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Keyboard className="text-emerald-400" size={24} />
                    <h3 className="text-lg font-semibold text-slate-900">Navigation</h3>
                </div>
                <div className="space-y-3">
                    <AccessibilityToggle
                        label="Lecteur d'écran optimisé"
                        description="Optimise l'interface pour les lecteurs d'écran"
                        enabled={settings.screenReader}
                        onChange={() => toggleSetting('screenReader')}
                    />
                    <AccessibilityToggle
                        label="Navigation au clavier améliorée"
                        description="Indicateurs visuels pour la navigation au clavier"
                        enabled={settings.keyboardNav}
                        onChange={() => toggleSetting('keyboardNav')}
                    />
                </div>
            </div>

            {/* Options audio */}
            <div className="bg-white backdrop-blur-sm border border-slate-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Volume2 className="text-purple-400" size={24} />
                    <h3 className="text-lg font-semibold text-slate-900">Audio</h3>
                </div>
                <div className="space-y-3">
                    <AccessibilityToggle
                        label="Sous-titres automatiques"
                        description="Active les sous-titres pour les contenus vidéo"
                        enabled={settings.autoSubtitles}
                        onChange={() => toggleSetting('autoSubtitles')}
                    />
                </div>
            </div>
        </div>
    );
};

interface AccessibilityToggleProps {
    label: string;
    description: string;
    enabled: boolean;
    onChange: () => void;
}

const AccessibilityToggle: React.FC<AccessibilityToggleProps> = ({
    label,
    description,
    enabled,
    onChange
}) => {
    return (
        <div className="flex items-center justify-between p-4 bg-white rounded-lg">
            <div>
                <p className="text-slate-900 font-medium">{label}</p>
                <p className="text-sm text-slate-600">{description}</p>
            </div>
            <button
                onClick={onChange}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${enabled ? 'bg-indigo-600' : 'bg-gray-600'
                    }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                />
            </button>
        </div>
    );
};

export default AccessibilitySection;
