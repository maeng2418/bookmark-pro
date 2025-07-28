import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const useAuthGuard = (requireAuth = true) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (requireAuth && !user) {
      navigate('/auth', { replace: true });
    } else if (!requireAuth && user) {
      navigate('/', { replace: true });
    }
  }, [user, loading, requireAuth]);

  return { user, loading, isAuthenticated: !!user };
};