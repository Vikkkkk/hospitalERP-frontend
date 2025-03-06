import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/api';

interface User {
  id: number;
  username: string;
  role: string;
  departmentid?: number;
  isglobalrole?: boolean;
  wecom_userid?: string | null; // ✅ Ensure it's nullable
}

interface AuthContextProps {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (updatedUser: User) => void; // ✅ Allows updating user state immediately
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  // ✅ Load user and token from local storage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('authToken');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
  }, []);

  // ✅ Function to update user state locally
  const updateUser = (updatedFields: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null; // Ensure there's a user to update

      const mergedUser: User = { ...prevUser, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(mergedUser));
      return mergedUser;
    });
  };

  // ✅ Fetch updated user data from backend
  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUser = response.data.user;
      if (updatedUser) {
        updateUser(updatedUser); // ✅ Use updateUser to store new data
      }
    } catch (error) {
      console.error("❌ Failed to refresh user data:", error);
      logout(); // Logout if session is invalid
    }
  };

  // ✅ Store token and user on login
  const login = (token: string, userData: User) => {
    console.log('🔐 Storing new token:', token, "userData:", userData);
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    setUser(userData);
    navigate('/dashboard');
  };

  // ✅ Clear token and user on logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/');
  };

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
