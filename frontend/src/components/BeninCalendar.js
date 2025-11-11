import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import examDatesDefault from '../data/examDates';
import holidaysDefault from '../data/holidays';
const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
function toISO(d) {
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${day}`;
}
export default function BeninCalendar({ year: pYear, month: pMonth, examDates = examDatesDefault, holidays = holidaysDefault, backgroundImageUrl, }) {
    const now = new Date();
    const startYear = pYear ?? now.getFullYear();
    const startMonth = (pMonth ?? now.getMonth() + 1) - 1; // zero-indexed
    const [viewYear, setViewYear] = useState(startYear);
    const [viewMonth, setViewMonth] = useState(startMonth);
    const firstOfMonth = useMemo(() => new Date(viewYear, viewMonth, 1), [viewYear, viewMonth]);
    const lastOfMonth = useMemo(() => new Date(viewYear, viewMonth + 1, 0), [viewYear, viewMonth]);
    // Build grid starting Monday — JS getDay(): 0 (Sun) .. 6 (Sat)
    const startOffset = (firstOfMonth.getDay() + 6) % 7; // 0 = Monday
    const totalDays = lastOfMonth.getDate();
    const cells = [];
    for (let i = 0; i < startOffset; i++)
        cells.push({ date: null });
    for (let d = 1; d <= totalDays; d++)
        cells.push({ date: new Date(viewYear, viewMonth, d) });
    // map exam dates into a lookup
    const examLookup = {};
    examDates.forEach((e) => {
        const key = e.date;
        (examLookup[key] ?? (examLookup[key] = [])).push(e);
    });
    const isWeekend = (date) => {
        const dow = date.getDay();
        return dow === 0 || dow === 6; // Sunday(0) or Saturday(6)
    };
    const todayISO = toISO(now);
    const holidayRanges = holidays;
    const isInHoliday = (date) => {
        const iso = toISO(date);
        return holidayRanges.some((r) => iso >= r.start && iso <= r.end);
    };
    const goPrev = () => {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear((y) => y - 1);
        }
        else
            setViewMonth((m) => m - 1);
    };
    const goNext = () => {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear((y) => y + 1);
        }
        else
            setViewMonth((m) => m + 1);
    };
    return (_jsxs("div", { className: "relative overflow-hidden bg-white rounded-lg shadow-md p-4", children: [backgroundImageUrl ? (_jsx("div", { className: "absolute inset-0 opacity-10 pointer-events-none bg-center bg-no-repeat bg-contain", style: { backgroundImage: `url(${backgroundImageUrl})` }, "aria-hidden": true })) : (_jsx("div", { className: "absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none", children: _jsx("span", { className: "text-6xl font-serif text-gray-600", children: "R\u00E9publique du B\u00E9nin" }) })), _jsxs("div", { className: "relative", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Calendrier scolaire" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: goPrev, "aria-label": "Mois pr\u00E9c\u00E9dent", className: "p-1 rounded hover:bg-gray-100", children: "\u2039" }), _jsx("div", { className: "text-sm text-gray-600", children: firstOfMonth.toLocaleString(undefined, { month: 'long', year: 'numeric' }) }), _jsx("button", { onClick: goNext, "aria-label": "Mois suivant", className: "p-1 rounded hover:bg-gray-100", children: "\u203A" })] })] }), _jsx("div", { className: "grid grid-cols-7 gap-1 text-center text-xs text-gray-600 mb-1", children: dayNames.map((dn) => (_jsx("div", { className: "font-medium", children: dn }, dn))) }), _jsx("div", { className: "grid grid-cols-7 gap-1", children: cells.map((c, idx) => {
                            if (!c.date)
                                return _jsx("div", { className: "h-20" }, `empty-${idx}`);
                            const iso = toISO(c.date);
                            const exams = examLookup[iso] ?? [];
                            const weekend = isWeekend(c.date);
                            const isToday = iso === todayISO;
                            const inHoliday = isInHoliday(c.date);
                            return (_jsxs("div", { className: `h-20 p-1 rounded border border-transparent relative overflow-hidden ${inHoliday ? 'bg-gray-100' : weekend ? 'bg-gray-50' : 'bg-white'}`, "aria-label": `Jour ${c.date.getDate()} ${c.date.toLocaleDateString()}`, children: [_jsx("div", { className: "flex items-start justify-between", children: _jsx("div", { className: "text-sm font-medium", children: _jsx("span", { className: `px-2 py-0.5 rounded ${isToday ? 'bg-red-200 text-red-800' : 'text-gray-800'}`, style: isToday ? { backgroundColor: 'rgba(220,38,38,0.15)' } : undefined, children: c.date.getDate() }) }) }), _jsx("div", { className: "absolute left-1 right-1 bottom-1 text-[10px]", children: exams.slice(0, 2).map((ex) => (_jsx("div", { className: "bg-yellow-50 text-yellow-800 rounded px-1 py-0.5 mb-0.5 truncate", title: ex.label, children: ex.type }, ex.label))) })] }, iso));
                        }) }), _jsx("div", { className: "mt-3 text-sm text-gray-700", children: _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "w-3 h-3 bg-red-200 rounded-full inline-block" }), _jsx("span", { children: "Aujourd'hui" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "w-3 h-3 bg-gray-200 rounded-full inline-block" }), _jsx("span", { children: "Week-end" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "w-3 h-3 bg-gray-300 rounded-full inline-block" }), _jsx("span", { children: "Cong\u00E9s / Vacances" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "w-3 h-3 bg-yellow-100 rounded-full inline-block" }), _jsx("span", { children: "Examens (CEP/BEPC/Baccalaur\u00E9at)" })] })] }) }), _jsxs("div", { className: "mt-4", children: [_jsx("h4", { className: "text-sm font-semibold mb-2", children: "Dates d'examen connues" }), _jsxs("ul", { className: "text-sm list-disc list-inside space-y-1", children: [examDates.length === 0 && _jsx("li", { children: "Aucune date connue" }), examDates.map((e) => (_jsxs("li", { children: [_jsx("strong", { children: e.type }), " \u2014 ", e.label ?? '', " : ", new Date(e.date).toLocaleDateString()] }, e.date)))] })] }), holidayRanges.length > 0 && (_jsxs("div", { className: "mt-4", children: [_jsx("h4", { className: "text-sm font-semibold mb-2", children: "Vacances & jours f\u00E9ri\u00E9s" }), _jsx("ul", { className: "text-sm list-disc list-inside space-y-1", children: holidayRanges.map((h) => (_jsxs("li", { children: [h.label ?? 'Vacances', " \u2014 ", new Date(h.start).toLocaleDateString(), " \u00E0 ", new Date(h.end).toLocaleDateString()] }, `${h.start}-${h.end}`))) })] }))] })] }));
}
