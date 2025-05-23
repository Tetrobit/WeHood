import { useState } from 'react';

interface AuthContext {
  loginWithVK: (code: string, state: string) => Promise<void>;
  isAuthenticated: boolean;
  user: any | null;
}

export const useAuth = (): AuthContext => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  const loginWithVK = async (code: string, state: string) => {
    try {
      // Здесь должна быть логика обмена code на access_token
      const response = await fetch('/api/auth/vk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, state }),
      });

      if (!response.ok) {
        throw new Error('Ошибка авторизации');
      }

      const data = await response.json();
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Ошибка при авторизации через VK:', error);
      throw error;
    }
  };

  return {
    loginWithVK,
    isAuthenticated,
    user,
  };
}; 