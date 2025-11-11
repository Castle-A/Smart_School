import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
const LandingNews = ({ headline = 'Flux d\'actualités', items = [] }) => {
    const [localItems, setLocalItems] = useState(items || []);
    // Si aucune item n'est passée en prop, tenter de récupérer des actualités depuis l'API
    useEffect(() => {
        if (localItems.length > 0)
            return; // déjà des items
        const fetchNews = async () => {
            try {
                const res = await fetch('/api/news');
                if (!res.ok)
                    return;
                const data = await res.json();
                // On attend un tableau simple de chaînes ou un objet { items: string[] }
                if (Array.isArray(data)) {
                    setLocalItems(data);
                }
                else if (Array.isArray(data.items)) {
                    setLocalItems(data.items);
                }
            }
            catch (err) {
                // silent fail — on affichera le message "Aucune actualité" plus bas
                // console.debug('LandingNews: fetch failed', err);
            }
        };
        fetchNews();
    }, [localItems]);
    // En dev local, fournir un fallback visible pour faciliter le debug
    // Note: le fallback de développement a été retiré — le composant n'ajoute plus d'items automatiquement
    return (_jsxs("section", { children: [_jsx("h2", { className: "text-lg font-semibold mb-2", children: headline }), _jsx("ul", { className: "space-y-2", children: localItems.length === 0 ? (_jsx("li", { className: "text-sm text-gray-500", children: "Aucune actualit\u00E9" })) : (localItems.map((it, i) => (_jsxs("li", { className: "text-sm text-gray-700", children: ["\u2022 ", it] }, i)))) })] }));
};
export default LandingNews;
