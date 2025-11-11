import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../../context';
const SubjectPage = () => {
    const { user } = useAuth();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // Fonction pour créer une matière
    const handleCreateSubject = async (newSubject) => {
        setLoading(true);
        setError(null);
        try {
            // Simuler l'appel API
            const response = await fetch('/api/subjects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify(newSubject),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de la création de la matière.');
            }
            const createdSubject = await response.json();
            setSubjects(prev => [...prev, createdSubject]);
            // On pourrait aussi afficher un message de succès
            alert('Matière créée avec succès !');
        }
        catch (err) {
            const message = typeof err === 'object' && err !== null && 'message' in err ? String(err.message) : 'Erreur lors de la création de la matière.';
            setError(message);
        }
        finally {
            setLoading(false);
        }
    };
    // Fonction pour supprimer une matière
    const handleDeleteSubject = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette matière ?')) {
            try {
                const response = await fetch(`/api/subjects/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Erreur lors de la suppression.');
                }
                setSubjects(prev => prev.filter(subject => subject.id !== id));
                alert('Matière supprimée.');
            }
            catch (err) {
                console.error(err);
            }
        }
    };
    // Simuler le chargement des données au montage
    useEffect(() => {
        const fetchSubjects = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/subjects');
                const data = await response.json();
                setSubjects(data);
            }
            catch {
                setError('Erreur lors du chargement des matières.');
            }
            finally {
                setLoading(false);
            }
        };
        fetchSubjects();
    }, [user?.id]);
    return (_jsxs("div", { className: "p-6 max-w-4xl mx-auto", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800", children: "Gestion des Mati\u00E8res" }), _jsx("button", { onClick: () => handleCreateSubject({ name: 'Philosophie', code: 'PHILO' }), className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700", children: "+ Cr\u00E9er une mati\u00E8re" })] }), error && (_jsx("div", { className: "p-4 mb-4 text-sm text-red-700 bg-red-100 border-l-4 border-red-300 rounded-lg", children: error })), loading && (_jsx("div", { className: "flex justify-center items-center min-h-screen", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300" }) })), !loading && !error && (_jsx("div", { className: "bg-white shadow-lg rounded-lg overflow-hidden", children: _jsxs("table", { className: "min-w-full table-auto", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-gray-100 text-left", children: [_jsx("th", { className: "px-6 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider", children: "Nom" }), _jsx("th", { className: "px-6 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider", children: "Code" }), _jsx("th", { className: "px-6 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { children: subjects.map(subject => (_jsxs("tr", { className: "border-b hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4", children: subject.name }), _jsx("td", { className: "px-6 py-4 text-gray-500", children: subject.code || 'N/A' }), _jsx("td", { className: "px-6 py-4", children: _jsx("button", { onClick: () => handleDeleteSubject(subject.id), className: "text-red-600 hover:text-red-800", children: "Supprimer" }) })] }, subject.id))) })] }) }))] }));
};
export default SubjectPage;
