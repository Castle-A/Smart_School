import { useState, useEffect, useCallback, useRef } from 'react';
import { Phone, AlertCircle, CheckCircle, ChevronDown, Search } from 'lucide-react';

interface Country {
    code: string;
    name: string;
    dialCode: string;
    flag: string;
    digitCount: number;
    format: string; // Format d'affichage pour le placeholder
}

const COUNTRIES: Country[] = [
    { code: 'CI', name: 'Côte d\'Ivoire', dialCode: '+225', flag: '🇨🇮', digitCount: 10, format: '01 23 45 67 89' },
    { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', digitCount: 9, format: '01 23 45 67 8' },
    { code: 'ES', name: 'Espagne', dialCode: '+34', flag: '🇪🇸', digitCount: 9, format: '612 34 56 78' },
    { code: 'DE', name: 'Allemagne', dialCode: '+49', flag: '🇩🇪', digitCount: 10, format: '0151 1234567' },
    { code: 'GB', name: 'Royaume-Uni', dialCode: '+44', flag: '🇬🇧', digitCount: 10, format: '0712 345 678' },
    { code: 'SN', name: 'Sénégal', dialCode: '+221', flag: '🇸🇳', digitCount: 9, format: '70 123 45 67' },
    { code: 'BJ', name: 'Bénin', dialCode: '+229', flag: '🇧🇯', digitCount: 10, format: '01 97 55 24 01' },
    { code: 'TG', name: 'Togo', dialCode: '+228', flag: '🇹🇬', digitCount: 10, format: '90 12 34 56 78' },
    { code: 'BF', name: 'Burkina Faso', dialCode: '+226', flag: '🇧🇫', digitCount: 10, format: '01 23 45 67 89' },
    { code: 'ML', name: 'Mali', dialCode: '+223', flag: '🇲🇱', digitCount: 10, format: '76 12 34 56 78' },
    { code: 'NE', name: 'Niger', dialCode: '+227', flag: '🇳🇪', digitCount: 10, format: '93 12 34 56 78' },
    { code: 'GN', name: 'Guinée', dialCode: '+224', flag: '🇬🇳', digitCount: 10, format: '601 12 34 56' },
    { code: 'CM', name: 'Cameroun', dialCode: '+237', flag: '🇨🇲', digitCount: 9, format: '6 12 34 56 78' },
    { code: 'US', name: 'États-Unis', dialCode: '+1', flag: '🇺🇸', digitCount: 10, format: '201 555 0123' },
    { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', digitCount: 10, format: '506 234 5678' },
];

interface PhoneInputProps {
    value?: string;
    onChange: (value: string) => void;
    required?: boolean;
    className?: string;
    label?: string;
    errorMessage?: string;
    disabled?: boolean;
}

const PhoneInput = ({
    value = '',
    onChange,
    required = false,
    className = '',
    label,
    errorMessage,
    disabled = false
}: PhoneInputProps) => {
    const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [touched, setTouched] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Filtrer les pays selon la recherche
    const filteredCountries = COUNTRIES.filter(country =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.dialCode.includes(searchQuery) ||
        country.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Fonction pour extraire le code pays et le numéro
    const parsePhoneNumber = useCallback((fullNumber: string) => {
        if (!fullNumber) return { country: COUNTRIES[0], number: '' };

        // Chercher le pays correspondant au préfixe (le plus long match d'abord)
        const matchedCountry = COUNTRIES
            .filter(c => fullNumber.startsWith(c.dialCode))
            .sort((a, b) => b.dialCode.length - a.dialCode.length)[0] || COUNTRIES[0];

        const number = fullNumber.slice(matchedCountry.dialCode.length);

        return { country: matchedCountry, number };
    }, []);

    // Synchroniser avec la prop value
    useEffect(() => {
        const { country, number } = parsePhoneNumber(value);
        setSelectedCountry(country);

        // Formater le numéro avec uniquement des chiffres et espaces
        const digits = number.replace(/\D/g, '');
        let formatted = '';
        if (digits.length > 0) {
            // Ajouter des espaces tous les 2 chiffres
            formatted = digits.match(/.{1,2}/g)?.join(' ') || digits;
        }
        setPhoneNumber(formatted);
    }, [value, parsePhoneNumber]);

    // Fermer le dropdown en cliquant à l'extérieur
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
                setSearchQuery('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCountrySelect = (country: Country) => {
        setSelectedCountry(country);
        setIsDropdownOpen(false);
        setSearchQuery('');

        // Garder les chiffres existants
        const currentDigits = phoneNumber.replace(/\s/g, '');
        let formatted = '';
        if (currentDigits.length > 0) {
            // Reformater avec des espaces tous les 2 chiffres
            formatted = currentDigits.match(/.{1,2}/g)?.join(' ') || currentDigits;
        }
        setPhoneNumber(formatted);

        // Mettre à jour le numéro complet
        const fullNumber = currentDigits ? `${country.dialCode}${currentDigits}` : '';
        onChange(fullNumber);

        // Focus sur le champ de saisie
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;

        // AUTORISER UNIQUEMENT LES CHIFFRES ET LES ESPACES
        const cleaned = input.replace(/[^\d\s]/g, '');

        // Ne pas permettre les espaces multiples consécutifs
        const singleSpaced = cleaned.replace(/\s+/g, ' ');

        // Supprimer l'espace au début si présent
        const trimmed = singleSpaced.trimStart();

        // Pour faciliter la saisie, formater automatiquement avec des espaces tous les 2 chiffres
        let formatted = trimmed;
        if (trimmed.replace(/\s/g, '').length > 0) {
            // Enlever tous les espaces existants
            const digitsOnly = trimmed.replace(/\s/g, '');
            // Ajouter des espaces tous les 2 chiffres
            formatted = digitsOnly.match(/.{1,2}/g)?.join(' ') || digitsOnly;

            // Limiter au nombre maximum de chiffres
            if (digitsOnly.length > selectedCountry.digitCount) {
                const limitedDigits = digitsOnly.substring(0, selectedCountry.digitCount);
                formatted = limitedDigits.match(/.{1,2}/g)?.join(' ') || limitedDigits;
            }
        }

        setPhoneNumber(formatted);

        // Mettre à jour le numéro complet (sans les espaces)
        const digits = formatted.replace(/\s/g, '');
        const fullNumber = digits ? `${selectedCountry.dialCode}${digits}` : '';
        onChange(fullNumber);

        // Marquer comme touché seulement si l'utilisateur a vraiment tapé quelque chose
        if (input !== '' && !touched) {
            setTouched(true);
        }
    };

    const handleBlur = () => {
        setTouched(true);
        // Nettoyer l'espace à la fin si présent
        if (phoneNumber.endsWith(' ')) {
            setPhoneNumber(phoneNumber.trimEnd());
        }
    };

    const getDigitCount = () => {
        return phoneNumber.replace(/\s/g, '').length;
    };

    const isValid = () => {
        if (!required && phoneNumber.replace(/\s/g, '') === '') return true;
        const digitCount = getDigitCount();
        return digitCount === selectedCountry.digitCount;
    };

    const showValidation = touched && phoneNumber.replace(/\s/g, '') !== '';
    const isError = showValidation && !isValid();

    // Calculer la longueur maximale du champ
    const getMaxLength = () => {
        // Nombre de chiffres + nombre d'espaces (tous les 2 chiffres)
        return selectedCountry.digitCount + Math.floor(selectedCountry.digitCount / 2);
    };

    // Obtenir le placeholder exact avec l'exemple du pays
    const getPlaceholder = () => {
        return selectedCountry.format;
    };

    // Gestion des touches pour améliorer l'UX
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Empêcher la saisie de caractères non autorisés
        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
            e.preventDefault();
        }

        // Permettre les raccourcis standards
        if (e.ctrlKey || e.metaKey || e.key === 'Backspace' || e.key === 'Delete' ||
            e.key === 'Tab' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' ||
            e.key === 'Home' || e.key === 'End') {
            return;
        }

        // Empêcher les caractères non numériques (sauf espace)
        if (!/\d|\s/.test(e.key) && e.key.length === 1) {
            e.preventDefault();
        }
    };

    return (
        <div className={className}>
            {label && (
                <label className="block text-white/90 mb-2 text-sm font-medium">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="flex flex-row gap-2 w-full">
                {/* Sélecteur de pays avec dropdown personnalisé */}
                <div className="relative flex-shrink-0" ref={dropdownRef}>
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`w-full sm:w-[115px] flex items-center justify-between px-3 py-3 bg-white/5 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isDropdownOpen ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-white/10 hover:border-white/20'}`}
                    >
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="flex-shrink-0">
                                <img
                                    src={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png`}
                                    srcSet={`https://flagcdn.com/w80/${selectedCountry.code.toLowerCase()}.png 2x`}
                                    width="24"
                                    height="16"
                                    alt={selectedCountry.name}
                                    className="rounded-sm object-cover border border-white/10"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 24 16"><rect width="24" height="16" fill="%23333"/><text x="12" y="10" font-size="8" fill="white" text-anchor="middle">${selectedCountry.code}</text></svg>`;
                                    }}
                                />
                            </div>
                            <span className="font-medium truncate">{selectedCountry.dialCode}</span>
                        </div>
                        <ChevronDown
                            size={16}
                            className={`text-gray-400 transition-transform flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {/* Dropdown des pays */}
                    {isDropdownOpen && (
                        <div className="absolute z-[100] mt-1 w-full sm:w-[320px] max-h-80 overflow-hidden bg-slate-900 border border-white/10 rounded-lg shadow-lg backdrop-blur-sm">
                            {/* Barre de recherche */}
                            <div className="p-2 border-b border-white/10">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Rechercher un pays..."
                                        className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Liste des pays */}
                            <div className="overflow-y-auto max-h-64">
                                {filteredCountries.length > 0 ? (
                                    filteredCountries.map((country) => (
                                        <button
                                            key={country.code}
                                            type="button"
                                            onClick={() => handleCountrySelect(country)}
                                            className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/10 transition-colors ${selectedCountry.code === country.code ? 'bg-white/10' : ''}`}
                                        >
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                                                    srcSet={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png 2x`}
                                                    width="24"
                                                    height="16"
                                                    alt={country.name}
                                                    className="rounded-sm object-cover border border-white/10"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 24 16"><rect width="24" height="16" fill="%23333"/><text x="12" y="10" font-size="8" fill="white" text-anchor="middle">${country.code}</text></svg>`;
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-white truncate">{country.name}</div>
                                                <div className="text-sm text-gray-400 truncate">
                                                    {country.dialCode} • {country.digitCount} chiffres
                                                </div>
                                            </div>
                                            {selectedCountry.code === country.code && (
                                                <CheckCircle size={16} className="text-green-500 flex-shrink-0 ml-2" />
                                            )}
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-3 py-4 text-center text-gray-500">
                                        Aucun pays trouvé
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Champ numéro de téléphone */}
                <div className="relative flex-1">
                    <div className="relative w-full">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            ref={inputRef}
                            type="tel"
                            inputMode="numeric"
                            required={required}
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                            onKeyDown={handleKeyDown}
                            onBlur={handleBlur}
                            disabled={disabled}
                            className={`w-full pl-10 pr-10 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isError
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                : showValidation && isValid()
                                    ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
                                    : 'border-white/10 focus:border-indigo-500 hover:border-white/20'
                                }`}
                            placeholder={getPlaceholder()}
                            maxLength={getMaxLength()}
                        />
                        {showValidation && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {isValid() ? (
                                    <CheckCircle className="text-green-500" size={18} />
                                ) : (
                                    <AlertCircle className="text-red-500" size={18} />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages d'erreur */}
            {isError && (
                <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded">
                    <p className="text-red-400 text-sm">
                        {errorMessage || `Le numéro doit contenir exactement ${selectedCountry.digitCount} chiffres pour ${selectedCountry.name}. Exemple : ${selectedCountry.format}`}
                    </p>
                </div>
            )}
        </div>
    );
};

export default PhoneInput;