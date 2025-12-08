// Composant d'indicateur de force de mot de passe
import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
    password: string;
    showRequirements?: boolean;
}

const PasswordStrengthIndicator = ({ password, showRequirements = true }: PasswordStrengthIndicatorProps) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    const criteriaMetCount = [hasMinLength, hasUpperCase, hasNumber].filter(Boolean).length;

    const getStrength = () => {
        if (criteriaMetCount === 0) return { label: '', color: 'bg-gray-300', width: '0%' };
        if (criteriaMetCount === 1) return { label: 'Faible', color: 'bg-red-500', width: '33%' };
        if (criteriaMetCount === 2) return { label: 'Moyen', color: 'bg-orange-500', width: '66%' };
        return { label: 'Fort', color: 'bg-green-500', width: '100%' };
    };

    const strength = getStrength();

    return (
        <div className="space-y-2">
            {/* Barre de force */}
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                    className={`h-full transition-all duration-300 ${strength.color}`}
                    style={{ width: strength.width }}
                />
            </div>

            {strength.label && (
                <p className={`text-sm font-medium ${strength.label === 'Fort' ? 'text-green-400' :
                    strength.label === 'Moyen' ? 'text-orange-400' :
                        'text-red-400'
                    }`}>
                    {strength.label}
                </p>
            )}

            {/* Recommandations */}
            {showRequirements && (
                <div className="space-y-1 text-sm">
                    <p className="text-gray-400 font-medium mb-2">Le mot de passe doit contenir :</p>
                    <div className="space-y-1">
                        <div className={`flex items-center gap-2 ${hasMinLength ? 'text-green-400' : 'text-gray-500'}`}>
                            {hasMinLength ? <Check size={16} /> : <X size={16} />}
                            <span>Au moins 8 caractères</span>
                        </div>
                        <div className={`flex items-center gap-2 ${hasUpperCase ? 'text-green-400' : 'text-gray-500'}`}>
                            {hasUpperCase ? <Check size={16} /> : <X size={16} />}
                            <span>Au moins une majuscule</span>
                        </div>
                        <div className={`flex items-center gap-2 ${hasNumber ? 'text-green-400' : 'text-gray-500'}`}>
                            {hasNumber ? <Check size={16} /> : <X size={16} />}
                            <span>Au moins un chiffre</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PasswordStrengthIndicator;
