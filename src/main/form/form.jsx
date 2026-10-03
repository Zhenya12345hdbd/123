import React, { useState } from 'react';
import './form.css';
import '../main.css';

const LoginForm = ({ onAuthSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
  });
  const [selectedFile, setSelectedFile] = useState(null); // Храним файл
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState('login'); // По умолчанию вход

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
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Проверка типа файла прямо в браузере
      if (!file.type.startsWith('image/')) {
        setError('Пожалуйста, выберите изображение (JPG, PNG и т.д.)');
        e.target.value = ''; // Сброс инпута
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

    // --- ЛОГИКА РЕГИСТРАЦИИ ---
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

      const formDataObj = new FormData();
      formDataObj.append('firstName', formData.firstName);
      formDataObj.append('lastName', formData.lastName);
      formDataObj.append('password', formData.password);
      formDataObj.append('avatar', selectedFile);

      try {
        const response = await fetch('register.php', {
          method: 'POST',
          body: formDataObj, 
        });

        const result = await response.json();

        if (result.success) {
          // ВАЖНО: Приводим к единому формату для родителя
          onAuthSuccess({
            id: result.id,
            first_name: result.firstName || formData.firstName, // Лучше брать из БД, но fallback есть
            last_name: result.lastName || formData.lastName,
            avatar_path: result.avatar_path, // Теперь везде avatar_path
            username: `${result.firstName} ${result.lastName}`
          });
        } else {
          throw new Error(result.error || 'Ошибка регистрации');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // --- ЛОГИКА ВХОДА ---
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
      const response = await fetch('login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok || result.success) {
        // ВАЖНО: Унифицируем поля здесь тоже
        onAuthSuccess({
          id: result.id,
          first_name: result.firstName, 
          last_name: result.lastName,
          avatar_path: result.avatar_path, // Ключевое поле для Sidebar
          username: result.username
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

      {/* Поле загрузки только в режиме регистрации */}
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
