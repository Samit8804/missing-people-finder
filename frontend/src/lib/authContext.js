"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from './api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user on mount if token exists
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          }
        } catch (error) {
          console.error("Auth fetch failed", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      router.push('/dashboard');
    }
    return res.data;
  };

  const signup = async (userData) => {
    const res = await api.post('/auth/signup', userData);
    // Do not log in yet; OTP verification is required before login
    return res.data;
  };

  const verifyOTP = async (otp, email) => {
    // Include email for signup OTP flow if not authenticated
    const payload = email ? { otp, email } : { otp };
    const res = await api.post('/auth/verify-otp', payload);
    if (res.data.success) {
      // If token is returned (signup flow), store it and set user
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        router.push('/dashboard');
        return res.data;
      }
      // Otherwise just mark verified in client state and navigate
      setUser({ ...user, isVerified: true });
      router.push('/dashboard');
    }
    return res.data;
  };

  const googleLogin = async (idToken) => {
    const res = await api.post('/auth/google-login', { token: idToken });
    if (res.data.success) {
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      router.push('/dashboard');
    }
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, verifyOTP, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
