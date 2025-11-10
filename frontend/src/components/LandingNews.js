import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const LandingNews = ({ headline = 'Neuigkeiten', items = [] }) => {
    return (_jsxs("section", { children: [_jsx("h2", { className: "text-lg font-semibold mb-2", children: headline }), _jsx("ul", { className: "space-y-2", children: items.length === 0 ? (_jsx("li", { className: "text-sm text-gray-500", children: "Keine Neuigkeiten" })) : (items.map((it, i) => (_jsxs("li", { className: "text-sm text-gray-700", children: ["\u2022 ", it] }, i)))) })] }));
};
export default LandingNews;
