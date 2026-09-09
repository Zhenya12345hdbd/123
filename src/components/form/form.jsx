import React, { useState } from 'react';
import './form.css';

const LoginForm = ({ onAuthSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Переключаем режим: 'register' или 'login'
  const [mode, setMode] = useState('register'); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const toggleMode = () => {
    setMode(prev => prev === 'register' ? 'login' : 'register');
    setError('');
    setFormData({ firstName: '', lastName: '', password: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const url = mode === 'register' ? 'register.php' : 'login.php';
    
    // Формируем данные в зависимости от режима
    let payload;
    if (mode === 'register') {
      if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.password.trim()) {
        setError('Заполните имя, фамилию и пароль.');
        setIsSubmitting(false);
        return;
      }
      payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password
      };
    } else {
      // Для входа нам нужно передать полное имя как "логин"
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      if (!fullName || !formData.password.trim()) {
        setError('Введите имя/фамилию и пароль.');
        setIsSubmitting(false);
        return;
      }
      payload = {
        username: fullName,
        password: formData.password
      };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok || (mode === 'login' && result.success)) {
        onAuthSuccess({
          id: result.id,
          username: result.username
        });
      } else {
        throw new Error(result.error || 'Ошибка авторизации');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>{mode === 'register' ? 'Регистрация' : 'Вход'}</h2>

      {error && <p className="error-message">{error}</p>}

      <div className="input-group">
        <label htmlFor="firstName">{mode === 'register' ? 'Имя' : 'Ваше имя'}</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Введите имя"
          required
        />
      </div>

      <div className="input-group">
        <label htmlFor="lastName">{mode === 'register' ? 'Фамилия' : 'Ваша фамилия'}</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Введите фамилию"
          required
        />
      </div>

      <div className="input-group">
        <label htmlFor="password">Пароль</label>
        <input
          type={mode === 'register' ? 'text' : 'password'}
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder={mode === 'register' ? 'Придумайте пароль' : 'Введите пароль'}
          required
        />
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Обработка...' : mode === 'register' ? 'Зарегистрироваться' : 'Войти'}
      </button>

      <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
  {mode === 'register' ? (
    <>
      Уже есть аккаунт?{' '}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          toggleMode();
        }}
        style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'none' }}
      >
        Войти
      </a>
    </>
  ) : (
    <>
      Нет аккаунта?{' '}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          toggleMode();
        }}
        style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'none' }}
      >
        Зарегистрироваться
      </a>
    </>
  )}
</p>
    </form>
  );
};

export default LoginForm;
