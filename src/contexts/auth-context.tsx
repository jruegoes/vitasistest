import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { hasStoredToken, validateCurrentToken, clearTokens } from '../api/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  login: () => void;
  logout: () => void;
  setAuthenticatedStatus: (status: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthentication = async () => {
      console.log("Checking authentication status...");
      
      // Check if we have a stored token
      if (hasStoredToken()) {
        try {
          // Validate the token
          const isValid = await validateCurrentToken();
          if (isValid) {
            console.log("Token is valid, user is authenticated");
            setIsAuthenticated(true);
          } else {
            console.log("Token is invalid, clearing tokens");
            clearTokens();
            setIsAuthenticated(false);
          }
        } catch (err) {
          console.error("Token validation failed:", err);
          clearTokens();
          setIsAuthenticated(false);
        }
      } else {
        console.log("No token found, user needs to authenticate");
        setIsAuthenticated(false);
      }
      
      setIsCheckingAuth(false);
    };

    checkAuthentication();
  }, []);

  const login = useCallback(() => {
    setIsAuthenticated(true);
    console.log("User authenticated via context");
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setIsAuthenticated(false);
    console.log("User logged out via context");
  }, []);

  const setAuthenticatedStatus = useCallback((status: boolean) => {
    setIsAuthenticated(status);
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    isCheckingAuth,
    login,
    logout,
    setAuthenticatedStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 