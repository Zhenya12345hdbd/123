import React, { useState, useEffect } from 'react';
import LoginForm from './main/form/MessageInput';
import Main from './main/main';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('chat_user');
    if (stored) setCurrentUser(JSON.parse(stored));
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = (userData) => {
    localStorage.setItem('chat_user', JSON.stringify(userData));
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('chat_user');
    setCurrentUser(null);
  };

  if (isLoading) return <div>Загрузка...</div>;

  return currentUser ? (
  <Main onLogout={handleLogout} initialUser={currentUser} />
  
) : (
  <LoginForm onAuthSuccess={handleAuthSuccess} />
);
}

export default App;

