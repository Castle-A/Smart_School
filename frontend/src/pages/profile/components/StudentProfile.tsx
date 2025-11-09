import React from 'react';
const StudentProfile: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Mon Espace Élève</h2>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold">📚 Mes Cours et Notes</h3>
            <p className="text-gray-600">Consultez vos cours, téléchargez vos documents et suivez vos notes.</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold">📊 Mes Bulletins</h3>
            <p className="text-gray-600">Accédez à tous vos bulletins scolaires.</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold">📅 Mon Emploi du Temps</h3>
            <p className="text-gray-600">Consultez votre emploi du temps en temps réel.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;