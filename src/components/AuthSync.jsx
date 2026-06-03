import { useEffect } from 'react';
import { supabase, ensureUserProfile } from '../lib/supabase';

const syncUserToStorage = (session) => {
  try {
    if (session?.user) {
      localStorage.setItem('user', JSON.stringify({
        id: session.user.id,
        name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')?.[0] || 'User',
        email: session.user.email || '',
        role: session.user.user_metadata?.role || session.user.app_metadata?.role || 'user',
      }));
    } else {
      localStorage.removeItem('user');
    }
  } catch (error) {
    console.error('Unable to sync Supabase session to localStorage', error);
  }
};

const AuthSync = () => {
  useEffect(() => {
    if (!supabase) {
      console.warn('Supabase is not configured. AuthSync is disabled.');
      return;
    }
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      syncUserToStorage(data.session);
      if (data.session?.user) {
        ensureUserProfile(data.session.user).catch((error) => {
          console.error('Unable to ensure Supabase profile', error);
        });
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      syncUserToStorage(session);
      if (session?.user) {
        ensureUserProfile(session.user).catch((error) => {
          console.error('Unable to ensure Supabase profile', error);
        });
      }
    });

    return () => {
      isMounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  return null;
};

export default AuthSync;
