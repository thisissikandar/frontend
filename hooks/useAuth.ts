import { useState, useEffect } from 'react';
import { getMe, login, register } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'delivery';
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const { data } = await getMe();
      console.log('User data:', data);
      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const { data } = await login({ email, password });
      localStorage.setItem('token', data.token);
      await fetchUser();
      console.log('User:', user);
      router.push(user?.role === "customer" ? '/customer/dashboard' : '/delivery/dashboard');
      router.refresh()
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  };

  const handleRegister = async (name: string, email: string, password: string, role: string) => {
    try {
      const { data } = await register({ name, email, password, role });
      localStorage.setItem('token', data.token);
      await fetchUser();
      router.push(role === 'customer' ? '/customer/dashboard' : '/delivery/dashboard');
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return { user, loading, handleLogin, handleRegister, logout };
};