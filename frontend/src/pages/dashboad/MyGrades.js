import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { salutation } from '../../utils/salutation';
const classesMock = [
    { id: '1', name: '6ème A' },
    { id: '2', name: '6ème B' },
    { id: '3', name: '5ème A' },
];
const MyGrades = () => {
    const { user } = useAuth();
    const [selectedClass, setSelectedClass] = useState(null);
    return (_jsxs("div", { className: "p-6 max-w-6xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800 mb-2", children: "G\u00E9rer les Notes" }), _jsxs("p", { className: "text-gray-600", children: [salutation(user), user?.firstName ? (user.gender ? '' : '.') : '', " Consultez et g\u00E9rez les notes des \u00E9l\u00E8ves par classe et par mati\u00E8re."] }), _jsxs("div", { className: "mt-6", children: [selectedClass ? (_jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [_jsxs("h2", { className: "text-xl font-semibold text-gray-800 mb-4", children: ["Notes pour ", _jsx("span", { className: "text-blue-700", children: selectedClass.name })] }), _jsx("div", { className: "mt-6", children: _jsx("button", { onClick: () => setSelectedClass(null), className: "px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300", children: "Changer de classe" }) })] })) : (_jsx("div", { className: "bg-yellow-50 p-4 border-l-4 border-yellow-400 rounded-lg", children: _jsx("p", { className: "text-center text-yellow-800", children: "Veuillez s\u00E9lectionner une classe pour g\u00E9rer ses notes." }) })), _jsxs("div", { className: "mt-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-800 mb-3", children: "Classes disponibles" }), _jsx("ul", { className: "space-y-2", children: classesMock.map((cls) => (_jsx("li", { children: _jsx("button", { onClick: () => setSelectedClass(cls), className: "w-full text-left px-4 py-2 bg-white rounded-md shadow hover:bg-gray-100", children: cls.name }) }, cls.id))) })] })] })] }));
};
export default MyGrades;
