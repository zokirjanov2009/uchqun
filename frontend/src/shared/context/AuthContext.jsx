import { createContext, useContext, useState, useEffect } from 'react';
import { dataStore } from '../services/dataStore';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Frontend-only authentication
      // Default teacher account: teacher@example.com / password
      // Default parent account: parent@example.com / password
      
      if (email === 'teacher@example.com' && password === 'password') {
        const teacherUser = {
          id: 'teacher-1',
          email: 'teacher@example.com',
          firstName: 'Teacher',
          lastName: 'Admin',
          role: 'teacher',
        };
        setUser(teacherUser);
        localStorage.setItem('user', JSON.stringify(teacherUser));
        return { success: true };
      }
      
      // Check parent accounts from dataStore
      const parents = dataStore.getParents();
      const parent = parents.find(p => p.email === email && p.password === password);
      
      if (parent) {
        const parentUser = {
          id: parent.id,
          email: parent.email,
          firstName: parent.firstName,
          lastName: parent.lastName,
          role: 'parent',
        };
        setUser(parentUser);
        localStorage.setItem('user', JSON.stringify(parentUser));
        return { success: true };
      }
      
      // Fallback to default parent account
      if (email === 'parent@example.com' && password === 'password') {
        const parentUser = {
          id: 'parent-1',
          email: 'parent@example.com',
          firstName: 'Parent',
          lastName: 'User',
          role: 'parent',
        };
        setUser(parentUser);
        localStorage.setItem('user', JSON.stringify(parentUser));
        return { success: true };
      }
      
      return { success: false, error: 'Invalid email or password' };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isTeacher: user?.role === 'teacher',
    isParent: user?.role === 'parent' || !user?.role, // Default to parent if no role
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
