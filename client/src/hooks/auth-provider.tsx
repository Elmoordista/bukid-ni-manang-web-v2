import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { mockUsers, type User } from "@/data/mockData";

export type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('user_data');
        localStorage.removeItem('auth_token');
      }
    }
    setIsLoading(false);
  }, []);

  // Handle login
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (foundUser) {
        // Mock password validation (in real app, this would be handled by backend)
        setUser(foundUser);
        localStorage.setItem('user_data', JSON.stringify(foundUser));
        localStorage.setItem('auth_token', 'mock_jwt_token');
        setIsLoading(false);
        return true;
      }
      
      throw new Error('Invalid credentials');
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      return false;
    }
  }, []);

  // Handle logout
  const logout = useCallback(async () => {
    try {
      setUser(null);
      localStorage.removeItem('user_data');
      localStorage.removeItem('auth_token');
    } catch (err) {
      setError(err as Error);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}