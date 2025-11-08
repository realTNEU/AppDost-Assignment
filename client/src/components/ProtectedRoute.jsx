import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoute({ children, redirectTo = '/feed' }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_BASE}/users/me`, {
          credentials: 'include',
        });
        
        if (res.ok) {
          // User is authenticated, redirect to feed
          navigate(redirectTo, { replace: true });
        } else {
          // User is not authenticated, show landing page
          setLoading(false);
        }
      } catch (err) {
        // Error checking auth, show landing page
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, redirectTo, API_BASE]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-8 h-8 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return children;
}

