import React, { useEffect, useState } from 'react';
import Toast from '@/components/Toast';
import { useAuth } from '@/context';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, justLoggedIn, setJustLoggedIn } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const fromSession = sessionStorage.getItem('justLoggedIn') === '1';
    if (justLoggedIn || fromSession) {
      setShowWelcome(true);
      // consommer le flag pour ne pas réafficher au prochain rendu
      setJustLoggedIn(false);
      sessionStorage.removeItem('justLoggedIn');
    }
  }, [justLoggedIn, setJustLoggedIn]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toast Bienvenue (affiché en overlay, en haut à droite) */}
      <Toast
        visible={showWelcome}
        type="success"
        duration={2500}
        onClose={() => setShowWelcome(false)}
        message={`Bienvenue${user?.firstName ? `, ${user.firstName}` : ''} !`}
      />

      
      <main className="p-8 overflow-y-auto">
        <div className="p-0 w-full">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
