import React, { useState } from 'react';
import './form.css';
import '../main.css';
import { API } from '../../config';
import { USE_MOCK } from '../../config';
import { request } from '../api/request';

const LoginForm = ({ onAuthSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState('login');
  const [captcha, setCaptcha] = useState('');
  const [captchaKey, setCaptchaKey] = useState(Date.now());

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'register' ? 'login' : 'register'));
    setError('');
    setFormData({ firstName: '', lastName: '', password: '' });
    setSelectedFile(null);
    setCaptcha('');
    setCaptchaKey(Date.now());
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Пожалуйста, выберите изображение (JPG, PNG и т.д.)');
        e.target.value = '';
        return;
      }
      setSelectedFile(file);
      if (error) setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // --- РЕГИСТРАЦИЯ ---
    if (mode === 'register') {
      if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.password.trim()) {
        setError('Заполните имя, фамилию и пароль.');
        setIsSubmitting(false);
        return;
      }

      if (!selectedFile) {
        setError('Пожалуйста, загрузите аватар.');
        setIsSubmitting(false);
        return;
      }

      // в мок-режиме капчу не требуем (картинки нет)
      if (!USE_MOCK && !captcha.trim()) {
        setError('Введите код с картинки.');
        setIsSubmitting(false);
        return;
      }

      const formDataObj = new FormData();
      formDataObj.append('firstName', formData.firstName);
      formDataObj.append('lastName', formData.lastName);
      formDataObj.append('password', formData.password);
      formDataObj.append('avatar', selectedFile);
      if (!USE_MOCK) formDataObj.append('captcha', captcha.trim());

      try {
        const result = await request(API.register, {
          method: 'POST',
          body: formDataObj,
        });

        if (result.success) {
          localStorage.setItem('chat_token', result.token || '');

          onAuthSuccess({
            id: result.id,
            first_name: result.first_name || formData.firstName,
            last_name: result.last_name || formData.lastName,
            avatar_path: result.avatar_path,
            username: `${result.first_name || formData.firstName} ${result.last_name || formData.lastName}`,
          });
        } else {
          throw new Error(result.error || 'Ошибка регистрации');
        }
      } catch (err) {
        setError(err.message);
        setCaptchaKey(Date.now());
        setCaptcha('');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // --- ВХОД ---
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    if (!fullName || !formData.password.trim()) {
      setError('Введите имя/фамилию и пароль.');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      username: fullName,
      password: formData.password,
    };

    try {
      const result = await request(API.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (result.success) {
        localStorage.setItem('chat_token', result.token || '');

        onAuthSuccess({
          id: result.id,
          first_name: result.first_name,
          last_name: result.last_name,
          avatar_path: result.avatar_path,
          username: `${result.first_name} ${result.last_name}`,
        });
      } else {
        throw new Error(result.error || 'Неверный логин или пароль');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2 >{mode === 'register' ? 'Регистрация' : 'Вход'}</h2>

      {error && <p className="error-message">{error}</p>}

      <div className="input-group">
        <label htmlFor="firstName">{mode === 'register' ? 'Имя' : 'Ваше имя'}</label>
        <input
          type="text"
          className='form_for_input'
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
          className='form_for_input'
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
          className='form_for_input'
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder={mode === 'register' ? 'Придумайте пароль' : 'Введите пароль'}
          required
        />
      </div>

      {mode === 'register' && (
        <div className="input-group">
          <label>Капча</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {USE_MOCK ? (
              <div style={{
                border: '1px dashed #999', borderRadius: 4, height: 60, width: 160,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, color: '#666', background: '#f5f5f5',
              }}>
                Капча (мок)
              </div>
            ) : (
              <img
                src={`${API.captcha}?t=${captchaKey}`}
                alt="Капча"
                style={{ border: '1px solid #ccc', borderRadius: 4, height: 60 }}
                onClick={() => setCaptchaKey(Date.now())}
                title="Нажмите, чтобы обновить"
              />
            )}
            <button
              type="button"
              onClick={() => setCaptchaKey(Date.now())}
              style={{ fontSize: 12 }}
            >
              Обновить
            </button>
          </div>
          <input
            type="text"
            value={captcha}
            onChange={(e) => setCaptcha(e.target.value)}
            placeholder={USE_MOCK ? 'В мок-режиме не нужно' : 'Введите код с картинки'}
            required={!USE_MOCK}
            maxLength={5}
            style={{ marginTop: 8 }}
            disabled={USE_MOCK}
          />
        </div>
      )}

      {mode === 'register' && (
        <div className="input-group">
          <label htmlFor="avatar">Аватар</label>
          <input
            type="file"
            id="avatar"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          {selectedFile && (
            <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              Выбран: {selectedFile.name}
            </p>
          )}
        </div>
      )}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Обработка...' : mode === 'register' ? 'Зарегистрироваться' : 'Войти'}
      </button>

      <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
        {mode === 'register' ? (
          <>
            Уже есть аккаунт?{' '}
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); toggleMode(); }}
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
              onClick={(e) => { e.preventDefault(); toggleMode(); }}
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