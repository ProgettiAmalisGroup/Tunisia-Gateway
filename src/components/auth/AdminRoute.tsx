import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getMyProfile } from '../../services/profiles';

export default function AdminRoute() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkRole() {
      try {
        const profile = await getMyProfile();

        if (!mounted) return;

        setIsAdmin(profile?.role === 'admin');
      } catch (error) {
        console.error('Errore controllo ruolo admin:', error);
        if (mounted) setIsAdmin(false);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    checkRole();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <div className="p-6">Caricamento...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}