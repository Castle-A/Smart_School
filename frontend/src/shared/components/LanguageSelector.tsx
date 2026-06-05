import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

interface Language {
    code: string;
    countryCode: string; // Used for flagcdn (e.g., 'en' -> 'gb')
    name: string;
    flag: string;
}

const languages: Language[] = [
    { code: 'fr', countryCode: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', countryCode: 'gb', name: 'English', flag: '🇬🇧' },
    { code: 'es', countryCode: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', countryCode: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

export default function LanguageSelector() {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    const changeLanguage = (langCode: string) => {
        i18n.changeLanguage(langCode);
        localStorage.setItem('language', langCode);
        setIsOpen(false);
    };

    // Fermer le dropdown quand on clique ailleurs
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all border border-white/20 backdrop-blur-sm"
                aria-label="Select language"
            >
                <Globe className="w-3.5 h-3.5 text-white/80" />
                <img
                    src={`https://flagcdn.com/w40/${currentLanguage.countryCode}.png`}
                    srcSet={`https://flagcdn.com/w80/${currentLanguage.countryCode}.png 2x`}
                    width="20"
                    alt={currentLanguage.name}
                    className="rounded-sm object-cover"
                />
                <span className="text-white/90 font-medium text-sm hidden sm:inline">{currentLanguage.code.toUpperCase()}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {languages.map((language) => (
                        <button
                            key={language.code}
                            onClick={() => changeLanguage(language.code)}
                            className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-indigo-50 transition-colors ${currentLanguage.code === language.code ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''
                                }`}
                        >
                            <img
                                src={`https://flagcdn.com/w40/${language.countryCode}.png`}
                                srcSet={`https://flagcdn.com/w80/${language.countryCode}.png 2x`}
                                width="20"
                                alt={language.name}
                                className="rounded-sm object-cover"
                            />
                            <span className="text-gray-800 font-medium text-sm">{language.name}</span>
                            {currentLanguage.code === language.code && (
                                <span className="ml-auto text-indigo-600 text-sm">✓</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
