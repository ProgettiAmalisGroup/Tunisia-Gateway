import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getMyProfile } from '../../services/profiles';

export default function ClientRoute() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkRole() {
      try {
        const profile = await getMyProfile();

        if (!mounted) return;

        setIsAdmin(profile?.role === 'admin');
        setIsClient(profile?.role === 'client');
      } catch (error) {
        console.error('Errore controllo ruolo client:', error);
        if (mounted) {
          setIsAdmin(false);
          setIsClient(false);
        }
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

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  if (!isClient) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}