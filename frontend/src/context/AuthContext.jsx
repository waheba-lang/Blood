import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.get('/user')
        .then(res => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('/login', { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    localStorage.setItem('token', res.data.token);
    return res.data;
  };

  const register = async (data) => {
    const res = await axios.post('/register', data);
    setToken(res.data.token);
    setUser(res.data.user);
    localStorage.setItem('token', res.data.token);
    return res.data;
  };

  const logout = async () => {
    try {
      await axios.post('/logout');
    } catch (e) {
      console.error('Logout error', e);
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const value = { user, token, login, register, logout, loading };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
