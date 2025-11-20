import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import '../../i18n';
import LoginNavbar from './LoginNavbar';
import LoginFooter from './LoginFooter';
import { useAuth } from '../../context/AuthContext';
import mockUsers from './mockUsers';
import type { MockUser } from './mockUsers';
import type { User } from '../../context/AuthContext';
import { FiEye, FiEyeOff } from "react-icons/fi";
import api from '../../api/axios';

// ...existing code...
const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // single handler that prevents default, validates, calls API and falls back to mock
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError(t('login.invalidCredentials'));
      return;
    }

    // Try real API login first
    try {
      const res = await api.post('/api/v6/admins/login', { username, password });

      const token = res?.data?.token;
      const apiUser = res?.data?.admin; // adjust if your API returns user info under a different key

      if (!token) {
        throw new Error('No token returned');
      }

      localStorage.setItem('adminToken', token);

      // If API returns user info, use it; otherwise attempt to infer role from response or fallback to admin
      const loggedUser: User = {
        username: apiUser?.username ?? username,
        role: apiUser?.role ?? 'admin',
        cinemaId: apiUser?.cinemaId ?? undefined,
        token
      };

      setUser(loggedUser);
      localStorage.setItem('user', JSON.stringify(loggedUser));

      // navigate based on role
      if (loggedUser.role === 'admin') navigate('/admin/dashboard');
      else navigate('/employee');

      return;
    } catch (apiErr) {
      // If API fails, try the local mockUsers (useful for development)
      const user = mockUsers.find(
        (u: MockUser) => u.username === username && u.password === password
      );

      if (user) {
        const userWithToken: User = {
          username: user.username,
          role: user.role,
          cinemaId: user.cinemaId,
          token: 'mock-token'
        };

        setUser(userWithToken);
        localStorage.setItem('user', JSON.stringify(userWithToken));
        if (user.role === 'admin') navigate('/admin');
        else navigate('/employee');
        return;
      }

      // show error from response if available, otherwise generic message
      const message =
        (apiErr as any)?.response?.data?.message ||
        (apiErr as Error).message ||
        t('login.invalidCredentials');

      setError(message);
    }
  };

  return (
    <div className="login-page">
      <LoginNavbar />

      <div className="login-card">
        <div className="login-left"></div>

        <div className="login-form">
          <h1>{t('login.loginButton')}</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder={t('login.username')}
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={t('login.password')}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <span
                className="toggle-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>

            <button type="submit">{t('login.submit_button')}</button>
          </form>
          <p className="forgot-password">{t('login.forgotPassword')}</p>
          {error && <p className="error">{error}</p>}
        </div>
      </div>

      <LoginFooter />
    </div>
  );
};

export default Login;