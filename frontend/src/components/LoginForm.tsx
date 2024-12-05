import React, { useState } from 'react';
import './AuthForm.css';



const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Ошибка при авторизации');
        return;
      }

      const data = await response.json();
      setSuccessMessage('Авторизация прошла успешно!');

      // Сохраняем токен и имя пользователя
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username); // Сохраняем имя пользователя

      // Перенаправление на главную страницу после авторизации
      window.location.href = '/';
    } catch (err) {
      setError('Произошла ошибка. Пожалуйста, попробуйте снова.');
    }
  };

  return (
      <div className="form-container">
        <h2>Вход</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label" htmlFor="email">Электронная почта:</label>
            <input
                type="email"
                id="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="password">Пароль:</label>
            <input
                type="password"
                id="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
          </div>

          <button type="submit" className="button">Войти</button>
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
        </form>
      </div>
  );

};

export default LoginForm;
