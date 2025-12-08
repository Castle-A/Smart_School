import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UserRole } from '../types/roles';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    schoolRole?: string;
    platformRole?: string;
    schoolId?: string;
    schoolName?: string;
    phone?: string;
    gender?: string;
    mustChangePassword?: boolean;
    directorType?: string;
    permissions?: string[];
}

// ... (in decodeJWT)




interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fonction pour décoder le JWT (sans bibliothèque externe)
function decodeJWT(token: string): any {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
}

// Fonction pour mapper le rôle du backend vers le type UserRole
function mapRoleToUserRole(role: string): UserRole {
    if (!role) return 'STUDENT';

    const normalizedRole = role.toUpperCase();
    const roleMap: Record<string, UserRole> = {
        'FOUNDER': 'FOUNDER',
        'DIRECTOR': 'DIRECTOR',
        'SECRETARY': 'SECRETARY',
        'SURVEILLANT': 'SURVEILLANT',
        'CENSEUR': 'CENSEUR',
        'ACCOUNTANT': 'ACCOUNTANT',
        'TEACHER': 'TEACHER',
        'MAITRE': 'MAITRE',
        'STUDENT': 'STUDENT',
        'PARENT': 'PARENT',
        // Legacy French support
        'FONDATEUR': 'FOUNDER',
        'DIRECTEUR': 'DIRECTOR',
        'SECRETAIRE': 'SECRETARY',
        'COMPTABLE': 'ACCOUNTANT',
        'PROFESSEUR': 'TEACHER',
        'ELEVE': 'STUDENT',
    };

    const mappedRole = roleMap[normalizedRole];
    if (!mappedRole) {
        console.warn(`⚠️ Unknown role "${role}" mapped to default "STUDENT"`);
        return 'STUDENT';
    }
    return mappedRole;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Vérifier si un token existe au chargement
        const token = localStorage.getItem('access_token');
        if (token) {
            const decoded = decodeJWT(token);
            if (decoded) {
                // Extraire les informations de l'utilisateur du token
                const userData: User = {
                    id: decoded.userId || decoded.sub,
                    email: decoded.email,
                    firstName: decoded.firstName || '',
                    lastName: decoded.lastName || '',
                    role: mapRoleToUserRole(decoded.schoolRole || decoded.role || decoded.roles?.[0]),
                    schoolRole: decoded.schoolRole,
                    platformRole: decoded.platformRole,
                    schoolId: decoded.schoolId,
                    schoolName: decoded.schoolName, // Added missing schoolName
                    gender: decoded.gender,
                    mustChangePassword: decoded.mustChangePassword,
                    directorType: decoded.directorType,
                };
                setUser(userData);
            }
        }
        setIsLoading(false);
    }, []);

    const login = (token: string) => {
        localStorage.setItem('access_token', token);
        const decoded = decodeJWT(token);
        console.log('🔍 Decoded JWT:', decoded);
        if (decoded) {
            const userData: User = {
                id: decoded.userId || decoded.sub,
                email: decoded.email,
                firstName: decoded.firstName || '',
                lastName: decoded.lastName || '',
                role: mapRoleToUserRole(decoded.schoolRole || decoded.role || decoded.roles?.[0]),
                schoolRole: decoded.schoolRole,
                platformRole: decoded.platformRole,
                schoolId: decoded.schoolId,
                schoolName: decoded.schoolName,
                gender: decoded.gender,
                mustChangePassword: decoded.mustChangePassword,
                directorType: decoded.directorType,
            };
            console.log('👤 User data:', userData);
            setUser(userData);
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        if (user) {
            sessionStorage.removeItem(`hasShownWelcome_${user.id}`);
        }
        setUser(null);
        // Redirect to landing page
        window.location.href = '/';
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook personnalisé pour utiliser le contexte
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
