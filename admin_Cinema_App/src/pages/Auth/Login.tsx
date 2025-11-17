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

const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError(t('login.invalidCredentials'));
      return;
    }

    const user = mockUsers.find(
      (u: MockUser) => u.username === username && u.password === password
    );

    if (!user) {
      setError(t('login.invalidCredentials'));
      return;
    }

    // اضافه کردن token برای مطابقت با User
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
                type={showPassword ? "text" : "password"}
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
