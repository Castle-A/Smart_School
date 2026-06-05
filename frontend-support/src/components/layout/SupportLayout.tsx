
import type { ReactNode } from 'react';
import SupportSidebar from './SupportSidebar';
import { motion } from 'framer-motion';

interface SupportLayoutProps {
    children: ReactNode;
}

export default function SupportLayout({ children }: SupportLayoutProps) {
    return (
        <div className="flex h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
            <SupportSidebar />
            <main className="flex-1 relative overflow-hidden bg-slate-950 flex flex-col">
                {/* Subtle background glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-600/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex-1 flex flex-col relative z-10"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
}
