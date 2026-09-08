import React, { useState } from 'react';
import './form.css';


const LoginForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Очищаем ошибку при вводе
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Простая валидация
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('Пожалуйста, заполните оба поля: имя и фамилию.');
      return;
    }

    setIsSubmitting(true);
    
    // Здесь будет логика отправки на сервер (fetch/axios)
    console.log('Отправка данных:', formData);
    
    setTimeout(() => {
      alert(`Добро пожаловать, ${formData.firstName} ${formData.lastName}!`);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} >
      <h2 >Авторизация</h2>

      {error && <p>{error}</p>}

      <div>
        <label  htmlFor="firstName">Имя</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Введите ваше имя"
          required
        />
      </div>

      <div>
        <label  htmlFor="lastName">Фамилия</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Введите вашу фамилию"
         
          required
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        
      >
        {isSubmitting ? 'Вход...' : 'Войти'}
      </button>
    </form>
  );
};
export default LoginForm;