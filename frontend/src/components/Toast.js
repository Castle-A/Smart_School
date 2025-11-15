import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
const Toast = ({ message, type = 'success', visible, duration = 2500, onClose }) => {
    const mountedRef = useRef(false);
    const timerRef = useRef(null);
    const startedAtRef = useRef(null);
    const remainingRef = useRef(duration);
    const [paused, setPaused] = useState(false);
    // respect prefers-reduced-motion
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    useEffect(() => {
        // when visible becomes true, (re)start timer
        if (visible) {
            mountedRef.current = true;
            // reset timers
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            remainingRef.current = duration;
            startedAtRef.current = Date.now();
            timerRef.current = setTimeout(() => {
                startedAtRef.current = null;
                remainingRef.current = duration;
                onClose?.();
            }, duration);
            return () => {
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                    timerRef.current = null;
                }
            };
        }
        // when visible becomes false, clear
        if (!visible) {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            mountedRef.current = false;
            startedAtRef.current = null;
            remainingRef.current = duration;
        }
        return () => { };
    }, [visible, duration, onClose]);
    // pause/resume on hover
    const handleMouseEnter = () => {
        if (prefersReduced)
            return;
        if (!visible)
            return;
        if (timerRef.current) {
            const elapsed = startedAtRef.current ? Date.now() - startedAtRef.current : 0;
            remainingRef.current = Math.max(0, (remainingRef.current - elapsed));
            clearTimeout(timerRef.current);
            timerRef.current = null;
            startedAtRef.current = null;
            setPaused(true);
        }
    };
    const handleMouseLeave = () => {
        if (prefersReduced)
            return;
        if (!visible)
            return;
        if (!timerRef.current) {
            startedAtRef.current = Date.now();
            timerRef.current = setTimeout(() => {
                startedAtRef.current = null;
                remainingRef.current = duration;
                onClose?.();
            }, remainingRef.current);
            setPaused(false);
        }
    };
    const bg = type === 'success' ? 'bg-green-100 border-green-200 text-green-800' : type === 'error' ? 'bg-red-100 border-red-200 text-red-800' : 'bg-blue-100 border-blue-200 text-blue-800';
    // Motion variants — subtle pop + slide
    const variants = {
        hidden: { opacity: 0, y: -8, scale: 0.98 },
        enter: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -8, scale: 0.98 },
    };
    return (_jsx("div", { className: "fixed top-6 right-6 z-50", children: _jsx(AnimatePresence, { children: visible && (_jsx(motion.div, { role: "status", initial: "hidden", animate: "enter", exit: "exit", variants: variants, transition: prefersReduced ? { duration: 0.18 } : { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, className: "pointer-events-auto", children: _jsx("div", { className: `${bg} px-4 py-2 rounded shadow-md border`, children: _jsx("div", { className: "flex items-center gap-3", children: _jsx("div", { className: "text-sm leading-tight", children: message }) }) }) })) }) }));
};
export default Toast;
