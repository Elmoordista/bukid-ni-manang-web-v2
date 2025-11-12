"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { mockLogin, mockRegister, mockLogout, mockCheckAuth, initMockAuth } from "@/lib/mock-auth";
import HttpClient from "@/lib/axiosInstance";
import Notiflix from "notiflix";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (userData: Omit<User, "id"> & { password: string }) => Promise<User>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  handleSetUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  const checkAuth = async () => {
    try {
      const userData = await mockCheckAuth();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    console.log('Login attempt:', { email });
    try {
      const userData = await mockLogin(email, password);
      console.log('Login successful:', userData);
      setUser(userData);
      return userData;
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    }
  };

  const register = async (userData: Omit<User, "id"> & { password: string }): Promise<User> => {
    try {
      console.log('Registration attempt:', { ...userData, password: '[REDACTED]' });
      const newUser = await mockRegister(userData);
      console.log('Registration successful:', { ...newUser, password: '[REDACTED]' });
      setUser(newUser);
      return newUser;
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw new Error(error.message || "Registration failed");
    }
  };

  const handleSetUser = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  }

  const logout = async () => {
    try {
      Notiflix.Loading.standard('Logging out...');
      await HttpClient.post(`/auth/sign-out`, {});
      Notiflix.Loading.remove();
      // toast({ title: "Logout Successful", description: "You have been logged out." });
      // await mockLogout();
      localStorage.removeItem("current_user");
      localStorage.removeItem("mock_users");
      setUser(null);
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    initMockAuth();
    checkAuth();
  }, []);

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAuthenticated,
      login,
      register,
      checkAuth, 
      handleSetUser, 
      logout 
    }}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
}