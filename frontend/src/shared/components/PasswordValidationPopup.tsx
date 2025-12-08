import { Check, X } from 'lucide-react';

interface PasswordRequirement {
    label: string;
    test: (password: string) => boolean;
}

const requirements: PasswordRequirement[] = [
    { label: 'Au moins 8 caractères', test: (pwd) => pwd.length >= 8 },
    { label: 'Une lettre majuscule', test: (pwd) => /[A-Z]/.test(pwd) },
    { label: 'Une lettre minuscule', test: (pwd) => /[a-z]/.test(pwd) },
    { label: 'Un chiffre', test: (pwd) => /\d/.test(pwd) },
];

interface PasswordValidationPopupProps {
    password: string;
    show: boolean;
}

const PasswordValidationPopup = ({ password, show }: PasswordValidationPopupProps) => {
    if (!show) return null;

    return (
        <div className="absolute left-0 bottom-full mb-2 w-full bg-slate-900/95 backdrop-blur-lg border border-white/20 rounded-xl p-4 z-10 shadow-xl">
            <p className="text-white font-medium text-sm mb-3">Votre mot de passe doit contenir :</p>
            <div className="space-y-2">
                {requirements.map((req, index) => {
                    const isValid = req.test(password);
                    return (
                        <div key={index} className="flex items-center gap-2">
                            {isValid ? (
                                <Check className="text-green-400 flex-shrink-0" size={16} />
                            ) : (
                                <X className="text-red-400 flex-shrink-0" size={16} />
                            )}
                            <span className={`text-sm ${isValid ? 'text-green-300' : 'text-gray-300'}`}>
                                {req.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PasswordValidationPopup;
