import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { useAuth } from '../context/useAuth';
import { authService } from '@/services/authService';
// Importez tous vos composants de profil
// Profile subcomponents imports removed — not used directly in this file yet
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2 Mo
const MIN_WIDTH = 100;
const MIN_HEIGHT = 100;
async function getImageDimensions(file) {
    const blobUrl = URL.createObjectURL(file);
    try {
        const img = await new Promise((resolve, reject) => {
            const i = new Image();
            i.onload = () => resolve(i);
            i.onerror = reject;
            i.src = blobUrl;
        });
        return { width: img.naturalWidth, height: img.naturalHeight };
    }
    finally {
        URL.revokeObjectURL(blobUrl);
    }
}
function formatBytes(bytes) {
    const units = ['o', 'Ko', 'Mo', 'Go'];
    let i = 0;
    let val = bytes;
    while (val >= 1024 && i < units.length - 1) {
        val /= 1024;
        i++;
    }
    return `${val.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}
const ProfilePage = () => {
    const { user, setUser } = useAuth();
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const fileInputRef = useRef(null);
    const validateFile = async (file) => {
        if (!ACCEPTED_TYPES.includes(file.type)) {
            return 'Format non pris en charge. Formats autorisés : JPEG, PNG, WebP.';
        }
        if (file.size > MAX_SIZE_BYTES) {
            return `Fichier trop volumineux (${formatBytes(file.size)}). Limite : ${formatBytes(MAX_SIZE_BYTES)}.`;
        }
        try {
            const { width, height } = await getImageDimensions(file);
            if (width < MIN_WIDTH || height < MIN_HEIGHT) {
                return `Image trop petite (${width}×${height}). Dimensions minimales : ${MIN_WIDTH}×${MIN_HEIGHT}px.`;
            }
        }
        catch {
            return 'Impossible de lire l’image. Réessaie avec un autre fichier.';
        }
        return null;
    };
    const handleFileChange = async (event) => {
        setErrorMsg(null);
        setSuccessMsg(null);
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const err = await validateFile(file);
            if (err) {
                setSelectedFile(null);
                setErrorMsg(err);
                if (fileInputRef.current)
                    fileInputRef.current.value = '';
                return;
            }
            setSelectedFile(file);
        }
        else {
            setSelectedFile(null);
        }
    };
    const handleUpload = async () => {
        if (!selectedFile || uploading)
            return;
        // Revalide au cas où (sécurité côté client supplémentaire)
        setErrorMsg(null);
        setSuccessMsg(null);
        const err = await validateFile(selectedFile);
        if (err) {
            setErrorMsg(err);
            return;
        }
        setUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        try {
            const uploadResponse = await fetch('http://localhost:3000/files/upload', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
                    // Ne PAS fixer Content-Type ici : le navigateur le gère pour FormData
                },
                body: formData,
            });
            const uploadData = await uploadResponse.json();
            if (!uploadResponse.ok) {
                throw new Error(uploadData?.message || 'Échec de l’envoi du fichier.');
            }
            const updateResponse = await authService.updateAvatar(uploadData.url);
            if (user) {
                const updatedUser = { ...user, avatarUrl: updateResponse.avatarUrl };
                setUser(updatedUser);
            }
            setSuccessMsg('Photo de profil mise à jour avec succès !');
            setSelectedFile(null);
            if (fileInputRef.current)
                fileInputRef.current.value = '';
        }
        catch (error) {
            // Affiche le message d'erreur si présent, sinon un message générique
            const message = typeof error === 'object' && error !== null && 'message' in error ? String(error.message) : 'Une erreur est survenue lors de la mise à jour de la photo.';
            setErrorMsg(message);
        }
        finally {
            setUploading(false);
        }
    };
    if (!user)
        return _jsx("div", { children: "Chargement\u2026" });
    return (_jsxs("div", { className: "p-6 max-w-2xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800 mb-6", children: "Mon profil" }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [_jsxs("div", { className: "flex items-center space-x-6 mb-6", children: [_jsx("img", { src: user.avatarUrl || '/default-avatar.svg', alt: "Avatar", className: "w-24 h-24 rounded-full object-cover border-2 border-gray-300", crossOrigin: "anonymous", referrerPolicy: "no-referrer", onError: (e) => {
                                    const t = e.currentTarget;
                                    t.onerror = null;
                                    if (t.src && !t.src.includes('/default-avatar.svg')) {
                                        t.src = '/default-avatar.svg';
                                    }
                                } }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold", children: user.firstName }), _jsx("p", { className: "text-gray-600", children: user.email }), _jsxs("p", { className: "text-sm text-gray-500", children: ["R\u00F4le\u00A0: ", user.role] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Changer ma photo de profil" }), _jsx("input", { type: "file", ref: fileInputRef, onChange: handleFileChange, accept: ACCEPTED_TYPES.join(','), className: "block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100", "aria-describedby": "upload-help" }), _jsxs("p", { id: "upload-help", className: "mt-2 text-xs text-gray-500", children: ["Formats accept\u00E9s\u00A0: JPEG, PNG, WebP \u2014 Taille max\u00A0: ", formatBytes(MAX_SIZE_BYTES), " \u2014 Dimensions min\u00A0: ", MIN_WIDTH, "\u00D7", MIN_HEIGHT, "px."] }), selectedFile && (_jsxs("div", { className: "mt-3 text-sm text-gray-600", children: ["Fichier s\u00E9lectionn\u00E9\u00A0: ", _jsx("span", { className: "font-medium", children: selectedFile.name }), " (", formatBytes(selectedFile.size), ")"] })), _jsx("div", { className: "mt-4", children: _jsx("button", { onClick: handleUpload, disabled: !selectedFile || uploading, className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50", children: uploading ? 'Envoi…' : 'Envoyer la photo' }) }), errorMsg && (_jsx("div", { role: "alert", className: "mt-4 rounded-md bg-red-50 p-3 text-sm text-red-800 border border-red-200", children: errorMsg })), successMsg && (_jsx("div", { role: "status", className: "mt-4 rounded-md bg-green-50 p-3 text-sm text-green-800 border border-green-200", children: successMsg }))] })] })] }));
};
export default ProfilePage;
