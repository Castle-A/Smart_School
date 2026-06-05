import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supportApi } from '../services/api';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    platformRole: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (identifier: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await supportApi.getProfile();
            setUser(response.user);
        } catch (error) {
            console.error('Not authenticated:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (identifier: string, password: string) => {
        try {
            const response = await supportApi.login(identifier, password);
            setUser(response.user);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await supportApi.logout();
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
