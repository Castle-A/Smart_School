import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '@/services/authService';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const uploadResponse = await fetch('http://localhost:3000/files/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
        body: formData,
      });
      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok) throw new Error(uploadData.message || 'Échec de l\'upload');
      const updateResponse = await authService.updateAvatar(uploadData.url);
      if (user) {
        const updatedUser = { ...user, avatarUrl: updateResponse.avatarUrl };
        setUser(updatedUser);
      }
      alert('Photo de profil mise à jour !');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  if (!user) return <div>Chargement...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mon Profil</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center space-x-6 mb-6">
          <img
            src={user.avatarUrl || '/default-avatar.svg'}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const t = e.currentTarget as HTMLImageElement;
              t.onerror = null;
              if (t.src && !t.src.includes('/default-avatar.svg')) {
                t.src = '/default-avatar.svg';
              }
            }}
          />
          <div>
            <h2 className="text-xl font-semibold">{user.firstName}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500">Rôle: {user.role}</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Changer ma photo de profil</label>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          {selectedFile && (
            <button onClick={handleUpload} disabled={uploading} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              {uploading ? 'Upload...' : 'Uploader la photo'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
