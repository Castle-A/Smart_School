import { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { UserRole } from '../types/roles';
import api from '../api/api';

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
    loginIdentifier?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (userData: User) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


// Fonction pour mapper le rôle du backend vers le type UserRole
function mapRoleToUserRole(role: string): UserRole {
    if (!role) return 'STUDENT';

    const normalizedRole = role.toUpperCase();
    const roleMap: Record<string, UserRole> = {
        'FOUNDER': 'FOUNDER',
        'DIRECTOR': 'DIRECTOR',
        'SECRETARY': 'SECRETARY',
        'SUPERVISOR': 'SUPERVISOR',
        'CENSOR': 'CENSOR',
        'ACCOUNTANT': 'ACCOUNTANT',
        'TEACHER': 'TEACHER',
        'STUDENT': 'STUDENT',
        'PARENT': 'PARENT',
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

    const fetchInProgress = useRef(false);

    useEffect(() => {
        // Master Security: Récupération du profil depuis le cookie HttpOnly
        const fetchProfile = async () => {
            if (fetchInProgress.current) return;
            fetchInProgress.current = true;

            try {
                // Utilisation du client API centralisé (gestion auto du préfixe /api)
                // skipGlobalErrorHandler pour éviter les alertes si non connecté
                const response = await api.get('/auth/profile', {
                    skipGlobalErrorHandler: true
                } as any);

                if (response.data && response.data.user) {
                    const data = response.data;
                    const userData: User = {
                        id: data.user.userId,
                        email: data.user.email,
                        firstName: data.user.firstName || '',
                        lastName: data.user.lastName || '',
                        role: mapRoleToUserRole(data.user.schoolRole || data.user.role),
                        schoolRole: data.user.schoolRole,
                        platformRole: data.user.platformRole,
                        schoolId: data.user.schoolId,
                        schoolName: data.user.schoolName,
                        gender: data.user.gender,
                        mustChangePassword: data.user.mustChangePassword,
                        directorType: data.user.directorType,
                        phone: data.user.phone,
                    };
                    setUser(userData);
                }
            } catch (error: any) {
                // Gestion silencieuse des erreurs d'auth
                if (error.response?.status === 401 || error.response?.status === 403) {
                    console.debug('[Auth] Session inactive (expected if not logged in)');
                } else {
                    console.debug('[Auth] Profile check failed (offline or network error)');
                }
            } finally {
                setIsLoading(false);
                fetchInProgress.current = false;
            }
        };

        fetchProfile();
    }, []);

    const login = async (userData: User) => {
        // Master Security: Le backend a déjà défini le cookie HttpOnly
        // On reçoit directement les données utilisateur enrichies depuis /auth/login
        console.log('👤 User logged in:', userData);
        setUser(userData);
    };

    const logout = async () => {
        try {
            // Appel au backend pour effacer le cookie sécurisé via axios
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }

        if (user) {
            sessionStorage.removeItem(`hasShownWelcome_${user.id}`);
        }
        setUser(null);
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
