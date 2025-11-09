import React from 'react';
// Outlet removed — not used in this layout

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Barre de navigation latérale */}
      <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-6">Smart School</h2>
        <nav className="flex-1 flex-col space-y-2">
          <a href="/dashboard" className="p-2 rounded hover:bg-gray-700">📊 Tableau de Bord</a>
          <a href="/classes" className="p-2 rounded hover:bg-gray-700">📚 Classes</a>
          <a href="/subjects" className="p-2 rounded hover:bg-gray-700">📚 Matières</a>
          <a href="/students" className="p-2 rounded hover:bg-gray-700">👥 Élèves</a>
          <a href="/teachers" className="p-2 rounded hover:bg-gray-700">👨 Professeurs</a>
          {/* Ajoutez d'autres liens ici */}
        </nav>
      </aside>

      {/* Zone de contenu principale */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;