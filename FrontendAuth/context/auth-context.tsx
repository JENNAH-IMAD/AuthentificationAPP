'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { cookieUtils } from '@/lib/cookies';
import { User, LoginCredentials } from '@/types/auth';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  // Vérifier l'authentification au chargement
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // Vérifier localStorage et cookies
    const tokenLS = localStorage.getItem('auth_token');
    const tokenCookie = cookieUtils.get('auth_token');
    const token = tokenLS || tokenCookie;
    
    if (!token) {
      setIsInitializing(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await authApi.validateToken(token);
      
      if (response.isValid) {
        // Le token est valide, récupérer les informations utilisateur depuis le token
        const userInfo = parseTokenPayload(token);
        setUser(userInfo);
        
        // Synchroniser localStorage et cookies
        if (!tokenLS) localStorage.setItem('auth_token', token);
        if (!tokenCookie) cookieUtils.set('auth_token', token, 7);
      } else {
        // Token invalide, le supprimer des deux endroits
        localStorage.removeItem('auth_token');
        cookieUtils.remove('auth_token');
        setUser(null);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      localStorage.removeItem('auth_token');
      cookieUtils.remove('auth_token');
      setUser(null);
    } finally {
      setIsLoading(false);
      setIsInitializing(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await authApi.login(credentials);
      
      if (response.success) {
        const { token, user } = response.data;
        
        // Stocker le token dans localStorage et cookies
        localStorage.setItem('auth_token', token);
        cookieUtils.set('auth_token', token, 7); // 7 jours d'expiration
        
        // Mettre à jour l'état utilisateur
        setUser(user);
        
        toast.success('Connexion réussie !');
        
        // Rediriger vers la page d'accueil
        router.push('/home');
      } else {
        throw new Error(response.message || 'Erreur de connexion');
      }
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      
      // Gestion des erreurs spécifiques
      if (error.response?.status === 401) {
        throw new Error('Email ou mot de passe incorrect');
      } else if (error.response?.status >= 500) {
        throw new Error('Erreur du serveur. Veuillez réessayer plus tard.');
      } else {
        throw new Error(error.message || 'Erreur de connexion');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Supprimer le token des deux endroits
    localStorage.removeItem('auth_token');
    cookieUtils.remove('auth_token');
    
    // Réinitialiser l'état utilisateur
    setUser(null);
    
    toast.success('Déconnexion réussie');
    
    // Rediriger vers la page de connexion
    router.push('/login');
  };

  // Fonction utilitaire pour parser le payload JWT (basique)
  const parseTokenPayload = (token: string): User | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      return {
        id: parseInt(payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || payload.sub),
        username: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || payload.username,
        email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || payload.email,
        firstName: payload.firstName || '',
        lastName: payload.lastName || '',
        isActive: true,
        roles: Array.isArray(payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) 
          ? payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
          : [payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']].filter(Boolean),
        createdAt: new Date().toISOString(),
        updatedAt: null,
      };
    } catch (error) {
      console.error('Erreur lors du parsing du token:', error);
      return null;
    }
  };

  // Ne pas rendre les enfants tant que l'initialisation n'est pas terminée
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 