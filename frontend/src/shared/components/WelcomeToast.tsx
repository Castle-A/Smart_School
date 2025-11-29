import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface WelcomeToastProps {
    userName: string;
    gender?: string;
    onClose: () => void;
}

const WelcomeToast = ({ userName, gender, onClose }: WelcomeToastProps) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for exit animation
        }, 2500);

        return () => clearTimeout(timer);
    }, [onClose]);

    const getGreeting = () => {
        const prefix = gender === 'M' ? 'Monsieur' : gender === 'F' ? 'Madame' : 'Bienvenue';
        return `${prefix} ${userName}`;
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: -50, x: '-50%' }}
                    className="fixed top-8 left-1/2 z-[2000] flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-xl text-white"
                >
                    <div className="bg-emerald-500/20 p-1.5 rounded-full">
                        <CheckCircle size={18} className="text-emerald-400" />
                    </div>
                    <span className="font-medium text-sm sm:text-base whitespace-nowrap">
                        {getGreeting()}
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WelcomeToast;
