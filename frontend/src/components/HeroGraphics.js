import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
const items = [
    {
        id: 'planning',
        title: 'Planning & Emplois du temps',
        subtitle: "Gérez les emplois du temps et évitez les conflits",
        lottieUrl: 'https://assets8.lottiefiles.com/packages/lf20_x62chJ.json',
        anchor: '#planning',
    },
    {
        id: 'presence',
        title: 'Présences & Absences',
        subtitle: 'Saisie rapide et rapports détaillés',
        lottieUrl: 'https://assets8.lottiefiles.com/packages/lf20_sF7H5u.json',
        anchor: '#presence',
    },
    {
        id: 'grades',
        title: 'Notes & Bulletins',
        subtitle: 'Saisie, calculs et export des bulletins',
        lottieUrl: 'https://assets8.lottiefiles.com/packages/lf20_jcikwtux.json',
        anchor: '#grades',
    },
    // 5 additional cards to rotate continuously
    {
        id: 'tasks',
        title: 'Tâches & Devoirs',
        subtitle: 'Assignez et suivez les tâches des élèves',
        lottieUrl: 'https://assets8.lottiefiles.com/packages/lf20_touohxv6.json',
        anchor: '#tasks',
    },
    {
        id: 'comms',
        title: 'Communication',
        subtitle: 'Messagerie entre enseignants, parents et élèves',
        lottieUrl: 'https://assets8.lottiefiles.com/packages/lf20_9wpyhdzo.json',
        anchor: '#comms',
    },
    {
        id: 'docs',
        title: 'Documents & Ressources',
        subtitle: 'Centralisez PDF, devoirs et supports de cours',
        lottieUrl: 'https://assets8.lottiefiles.com/packages/lf20_5ngs2ksb.json',
        anchor: '#docs',
    },
    {
        id: 'reports',
        title: 'Rapports & Analyses',
        subtitle: 'Tableaux de bord et indicateurs clés',
        lottieUrl: 'https://assets8.lottiefiles.com/packages/lf20_ktm6z9fh.json',
        anchor: '#reports',
    },
    {
        id: 'parents',
        title: 'Portail Parents',
        subtitle: 'Accès dédié aux parents et responsables',
        lottieUrl: 'https://assets8.lottiefiles.com/packages/lf20_sbyf16vz.json',
        anchor: '#parents',
    },
];
function LottiePlayer({ url, containerId }) {
    const containerRef = useRef(null);
    useEffect(() => {
        let anim = null;
        let cancelled = false;
        if (!url)
            return;
        (async () => {
            try {
                // ensure lottie is available on window — load script dynamically if needed
                const ensureLottie = async () => {
                    const win = window;
                    if (win.lottie)
                        return win.lottie;
                    await new Promise((resolve, reject) => {
                        const s = document.createElement('script');
                        s.src = 'https://cdn.jsdelivr.net/npm/lottie-web@5.10.1/build/player/lottie.min.js';
                        s.async = true;
                        s.onload = () => resolve();
                        s.onerror = () => reject(new Error('Failed to load lottie'));
                        document.head.appendChild(s);
                    });
                    return window.lottie;
                };
                const lottie = await ensureLottie();
                if (!lottie)
                    return;
                const res = await fetch(url);
                const json = await res.json();
                if (cancelled)
                    return;
                anim = lottie.loadAnimation({ container: containerRef.current, renderer: 'svg', loop: true, autoplay: true, animationData: json });
            }
            catch {
                // swallow; fallback to static
            }
        })();
        return () => {
            cancelled = true;
            try {
                anim?.destroy?.();
            }
            catch {
                void 0;
            }
        };
    }, [url, containerId]);
    return _jsx("div", { id: containerId, ref: containerRef, className: "w-full h-48 flex items-center justify-center" });
}
export default function HeroGraphics() {
    const [index, setIndex] = useState(0);
    const shouldReduceMotion = useReducedMotion();
    useEffect(() => {
        const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 5000);
        return () => clearInterval(t);
    }, []);
    const goPrev = () => setIndex((i) => (i - 1 + items.length) % items.length);
    const goNext = () => setIndex((i) => (i + 1) % items.length);
    // display window size (number of cards visible at once)
    const windowSize = 4;
    return (_jsx("div", { className: "my-10", children: _jsx("div", { className: "container mx-auto px-6 lg:px-20", children: _jsxs("div", { className: "relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-indigo-50 p-6 shadow-lg", children: [_jsx("h3", { className: "text-xl font-semibold text-gray-800 mb-4 text-center", children: "D\u00E9couvrir Smart School" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch", children: (() => {
                            const visibleItems = [];
                            for (let i = 0; i < windowSize; i++) {
                                const idx = (index + i) % items.length;
                                visibleItems.push({ item: items[idx], idx });
                            }
                            return visibleItems.map(({ item, idx }, pos) => {
                                const variants = {
                                    hidden: { opacity: 0.4, y: 8, scale: 0.97 },
                                    visible: { opacity: 1, y: 0, scale: 1 },
                                };
                                const transition = shouldReduceMotion
                                    ? { duration: 0.12 }
                                    : { duration: 0.45, ease: [0.2, 0.8, 0.2, 1], delay: pos * 0.06 };
                                return (_jsxs(motion.div, { className: `p-4 rounded-xl bg-white border border-gray-100 shadow-sm`, initial: shouldReduceMotion ? undefined : 'hidden', animate: 'visible', variants: variants, transition: transition, whileHover: shouldReduceMotion ? {} : { scale: 1.03 }, children: [_jsx("div", { className: "h-48 flex items-center justify-center", children: item.lottieUrl ? _jsx(LottiePlayer, { url: item.lottieUrl, containerId: `lottie-${item.id}` }) : _jsx("div", { className: "w-20 h-20 rounded-full bg-indigo-500" }) }), _jsxs("div", { className: "mt-4", children: [_jsx("div", { className: "text-lg font-semibold text-gray-800", children: item.title }), _jsx("div", { className: "text-sm text-gray-500", children: item.subtitle })] }), _jsxs("div", { className: "mt-4 flex items-center justify-between", children: [_jsx("a", { href: item.anchor ?? '#', className: "text-indigo-600 font-medium hover:underline", children: "En savoir plus" }), _jsxs("div", { className: "text-xs text-gray-400", children: [idx + 1, "/", items.length] })] })] }, item.id));
                            });
                        })() }), _jsx("div", { className: "absolute left-4 top-1/2 -translate-y-1/2", children: _jsx("button", { onClick: goPrev, "aria-label": "Pr\u00E9c\u00E9dent", className: "bg-white p-2 rounded-full shadow", children: "\u2039" }) }), _jsx("div", { className: "absolute right-4 top-1/2 -translate-y-1/2", children: _jsx("button", { onClick: goNext, "aria-label": "Suivant", className: "bg-white p-2 rounded-full shadow", children: "\u203A" }) }), _jsx("div", { className: "mt-4 flex justify-center gap-2", children: items.map((_, i) => (_jsx("button", { "aria-label": `Aller à ${i + 1}`, onClick: () => setIndex(i), className: `w-3 h-3 rounded-full ${i === index ? 'bg-indigo-600' : 'bg-gray-300'}` }, i))) })] }) }) }));
}
