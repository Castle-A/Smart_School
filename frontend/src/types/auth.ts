export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  phoneNumber?: string;
  role: string;
  schoolId: string;
  schoolName: string;
  avatarUrl?: string;
  gender?: Gender;
} | null;

export type AuthContextType = {
  user: AuthUser;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ mustChangePassword?: boolean } | void>;
  setSessionFromToken: (token: string) => void;
  logout: () => void;
  mustChangePassword: boolean;
  setMustChangePassword: (v: boolean) => void;
  setUser: (u: AuthUser) => void;

  // flag éphémère pour le toast de bienvenue
  justLoggedIn: boolean;
  setJustLoggedIn: (v: boolean) => void;
};
