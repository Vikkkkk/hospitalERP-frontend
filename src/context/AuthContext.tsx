import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/api';

interface User {
  id: number;
  username: string;
  role: string;
  departmentid?: number;
  isglobalrole?: boolean;
  wecom_userid?: string | null;
}

interface AuthContextProps {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (updatedFields: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  // ✅ Load user & token from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('authToken');

    if (storedUser && storedToken) {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
  }, []);

  // ✅ Function to update user state locally
  const updateUser = useCallback((updatedFields: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;

      const updatedUser = { ...prevUser, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  // ✅ Fetch updated user data from backend
  const refreshUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.user) {
        updateUser(response.data.user);
      }
    } catch (error) {
      console.error("❌ Failed to refresh user data:", error);
      logout(); // Logout on token failure
    }
  }, [updateUser]);

  // ✅ Store token and user on login
  const login = useCallback((token: string, userData: User) => {
    console.log('🔐 Storing new token:', token, "User:", userData);
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    setUser(userData);
    navigate('/dashboard');
  }, [navigate]);

  // ✅ Clear token and user on logout
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/');
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
