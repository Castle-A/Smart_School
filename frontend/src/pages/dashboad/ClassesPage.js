import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // <-- chemin corrigé
const ClassesPage = () => {
    const { user } = useAuth();
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    useEffect(() => {
        const fetchClasses = async () => {
            setIsLoading(true);
            setError('');
            try {
                // TODO: remplacer par votre vrai appel API
                const mockClasses = [
                    {
                        id: '1',
                        name: '6ème A',
                        level: 'SIXIEME_A',
                        schoolId: user?.schoolId || '',
                        students: [
                            { id: 's1', firstName: 'Amina', lastName: 'K.' },
                            { id: 's2', firstName: 'Idriss', lastName: 'S.' },
                        ],
                    },
                    {
                        id: '2',
                        name: '5ème B',
                        level: 'CINQUIEME_B',
                        schoolId: user?.schoolId || '',
                        students: [{ id: 's3', firstName: 'Irène', lastName: 'B.' }],
                    },
                    {
                        id: '3',
                        name: '4ème A',
                        level: 'QUATRIEME_A',
                        schoolId: user?.schoolId || '',
                        students: [],
                    },
                ];
                setClasses(mockClasses);
            }
            catch {
                setError('Erreur lors du chargement des classes.');
            }
            finally {
                setIsLoading(false);
            }
        };
        if (user)
            fetchClasses();
    }, [user]);
    return (_jsxs("div", { className: "p-6 max-w-6xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800 mb-6", children: "Gestion des Classes" }), error && (_jsx("div", { className: "p-4 mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg", role: "alert", children: error })), isLoading && (_jsx("div", { className: "flex justify-center items-center min-h-[200px]", children: _jsx("div", { className: "animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-blue-500" }) })), !isLoading && !error && (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex justify-end mb-4", children: _jsx("button", { className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500", children: "+ Cr\u00E9er une classe" }) }), _jsx("div", { className: "bg-white shadow-lg rounded-lg overflow-hidden", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Nom" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Niveau" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Nombre d'\u00E9l\u00E8ves" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsxs("tbody", { className: "bg-white divide-y divide-gray-200", children: [classes.map((classItem) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: classItem.name }), _jsx("div", { className: "text-xs text-gray-500", children: classItem.id })] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-700", children: classItem.level }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-700", children: classItem.students?.length ?? 0 }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [_jsx("button", { className: "text-indigo-600 hover:text-indigo-900", children: "Voir" }), _jsx("button", { className: "ml-2 text-yellow-600 hover:text-yellow-900", children: "Modifier" }), _jsx("button", { className: "ml-2 text-red-600 hover:text-red-900", children: "Supprimer" })] })] }, classItem.id))), classes.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "px-6 py-8 text-center text-sm text-gray-500", children: "Aucune classe trouv\u00E9e." }) }))] })] }) })] }))] }));
};
export default ClassesPage;
