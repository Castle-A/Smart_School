// /workspaces/Smart_School/frontend/src/components/Header.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { salutation } from '../utils/salutation';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [greeting, setGreeting] = useState<string | null>(null);
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  // Fermer le menu quand on clique à l’extérieur
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!navRef.current) return;
      if (!navRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  // Gestion du message de salutation
  useEffect(() => {
    try {
      const id = user?.id;
      if (id) {
        const g = sessionStorage.getItem(`greeting_${id}`);
        if (g) setGreeting(g);
        else if (user)
          setGreeting(
            salutation(user).startsWith('Bonjour')
              ? salutation(user)
              : `Bienvenue, ${salutation(user)}`
          );
      } else {
        if (user)
          setGreeting(
            salutation(user).startsWith('Bonjour')
              ? salutation(user)
              : `Bienvenue, ${salutation(user)}`
          );
      }
  } catch { void 0; }

    const onLogin = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail as { user?: unknown } | undefined;
  const u = (detail?.user ?? user) as unknown as import('../types').User | undefined;
        if (!u) return;
        const s = salutation(u);
        const text = s.startsWith('Bonjour') ? s : `Bienvenue, ${s}`;
        setGreeting(text);
        if (u.id) sessionStorage.setItem(`greeting_${u.id}`, text);
  } catch { void 0; }
    };

    window.addEventListener('auth:login', onLogin as EventListener);
    return () => window.removeEventListener('auth:login', onLogin as EventListener);
  }, [user]);

  // ✅ Version corrigée : logout + redirection vers la home
  const handleLogout = async () => {
    try {
      await logout(); // vide la session
    } finally {
      setOpen(false); // ferme le menu
      setGreeting(null); // évite un flash de message
      navigate('/', { replace: true }); // redirection directe vers la home
    }
  };

  return (
    <header className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <div className="flex items-center gap-3">
          {/* Logo type badge */}
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
            SS
          </div>
          <div>
            {/* Lien vers le dashboard (ou remplace par "/" si tu veux aller à la home) */}
            <Link to="/dashboard" className="text-xl font-semibold tracking-tight">
              Smart School
            </Link>
            <div className="text-xs opacity-80">{user?.schoolName ?? ''}</div>
            {greeting && (
              <div
                className="text-sm opacity-90 mt-0.5"
                style={
                  prefersReduced
                    ? undefined
                    : { transition: 'opacity 200ms ease', opacity: 1 }
                }
              >
                {greeting}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4" ref={navRef}>
          <div className="hidden sm:block text-sm opacity-90">{user?.firstName}</div>

          <button
            onClick={() => setOpen((s) => !s)}
            className="relative focus:outline-none"
            aria-expanded={open}
            aria-label="Menu utilisateur"
          >
            <img
              src={user?.avatarUrl ?? '/src/assets/default-avatar.svg'}
              alt="avatar utilisateur"
              className="w-10 h-10 rounded-full border-2 border-white shadow"
              onError={(e) => {
                const t = e.currentTarget as HTMLImageElement;
                if (!t.src.includes('default-avatar.svg'))
                  t.src = '/src/assets/default-avatar.svg';
              }}
            />
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -6 }}
                transition={{ duration: 0.18 }}
                className="absolute top-16 right-4 w-48 bg-white text-gray-800 rounded-lg shadow-lg origin-top-right"
                style={{ zIndex: 60 }}
              >
                <div className="py-2">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                    Mon profil
                  </Link>
                  <Link to="/profile#settings" className="block px-4 py-2 hover:bg-gray-100">
                    Paramètres
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Se déconnecter
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* petite ligne animée */}
      <div className="h-1 bg-gradient-to-r from-white/10 via-white/5 to-white/10 animate-pulse" />
    </header>
  );
};

export default Header;
