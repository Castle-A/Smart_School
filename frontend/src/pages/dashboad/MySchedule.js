import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuth } from '../../context';
import { salutation } from '../../utils/salutation';
const WEEK_DATA = [
    {
        day: 'Lundi',
        lessons: [
            { time: '08:00 - 09:00', subject: 'Mathématiques' },
            { time: '09:00 - 10:00', subject: 'Français' },
            { time: '11:00 - 12:00', subject: 'Anglais' },
            { time: '13:00 - 14:00', subject: 'Histoire' },
            { time: '14:00 - 15:00', subject: 'Philosophie' },
        ],
    },
    {
        day: 'Mardi',
        lessons: [
            { time: '08:00 - 10:00', subject: 'Physique-Chimie' },
            { time: '11:00 - 12:00', subject: 'Chimie' },
            { time: '13:00 - 14:00', subject: 'Géographie' },
        ],
    },
    {
        day: 'Mercredi',
        lessons: [
            { time: '08:00 - 09:00', subject: 'SVT' },
            { time: '09:00 - 11:00', subject: 'Informatique' },
        ],
    },
    {
        day: 'Jeudi',
        lessons: [
            { time: '08:00 - 10:00', subject: 'Histoire-Géo' },
            { time: '14:00 - 15:00', subject: 'Sport' },
        ],
    },
    {
        day: 'Vendredi',
        lessons: [
            { time: '09:00 - 10:00', subject: 'Arts plastiques' },
            { time: '11:00 - 12:00', subject: 'Musique' },
        ],
    },
];
const MySchedule = () => {
    const { user } = useAuth();
    const [currentView, setCurrentView] = useState('week');
    return (_jsxs("div", { className: "p-6 max-w-6xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800 mb-2", children: "Mon Emploi du Temps" }), _jsxs("p", { className: "text-gray-600 mb-6", children: [salutation(user), user?.firstName ? (user.gender ? ', ' : ', ') : '', "consultez votre emploi du temps", user?.schoolName ? ` à ${user.schoolName}` : '', "."] }), _jsxs("div", { className: "flex justify-center gap-2 mb-6", children: [_jsx("button", { onClick: () => setCurrentView('week'), "aria-pressed": currentView === 'week', className: `px-4 py-2 rounded-md font-medium transition ${currentView === 'week'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`, children: "Vue Semaine" }), _jsx("button", { onClick: () => setCurrentView('month'), "aria-pressed": currentView === 'month', className: `px-4 py-2 rounded-md font-medium transition ${currentView === 'month'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`, children: "Vue Mensuelle" })] }), _jsx("div", { className: "bg-white p-6 rounded-lg shadow", children: currentView === 'week' ? (_jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-xl font-bold text-gray-800", children: "Emploi du temps de la semaine" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-4", children: WEEK_DATA.map((col) => (_jsxs("div", { className: "p-4 border rounded-lg", children: [_jsx("p", { className: "text-center text-sm text-gray-500 mb-2", children: col.day }), _jsx("ul", { className: "space-y-3", children: col.lessons.map((l, i) => (_jsxs("li", { className: "rounded-lg border-l-4 border-gray-200 pl-3", children: [_jsx("p", { className: "text-xs text-gray-500", children: l.time }), _jsx("p", { className: "text-sm text-gray-700", children: l.subject })] }, `${col.day}-${i}`))) })] }, col.day))) })] })) : (_jsxs("div", { className: "text-center py-16", children: [_jsx("h2", { className: "text-xl font-bold text-gray-800 mb-2", children: "Vue mensuelle" }), _jsx("p", { className: "text-gray-600", children: "La vue mensuelle sera bient\u00F4t disponible." })] })) })] }));
};
export default MySchedule;
