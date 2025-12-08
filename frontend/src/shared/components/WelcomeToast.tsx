import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface WelcomeToastProps {
    firstName: string;
    lastName: string;
    gender?: string;
    onClose: () => void;
}

const WelcomeToast = ({ firstName, lastName, gender, onClose }: WelcomeToastProps) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 1000); // Wait for slower exit animation
        }, 6000); // 6 seconds

        return () => clearTimeout(timer);
    }, [onClose]);

    const getGreeting = () => {
        const civility = gender === 'M' ? 'Monsieur' : gender === 'F' ? 'Madame' : '';
        // Helper to capitalize first letter only
        const toTitleCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

        const firstFirstName = firstName.split(' ')[0];
        const formattedLastName = toTitleCase(lastName);
        const formattedFirstName = toTitleCase(firstFirstName);

        return `Bienvenue ${civility ? civility + ' ' : ''}${formattedLastName} ${formattedFirstName}`;
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: -50, x: '-50%', transition: { duration: 0.8 } }} // Slower fade out
                    className="fixed top-8 left-1/2 z-[2000] flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-xl text-white"
                >
                    <div className="bg-emerald-500/20 p-1 rounded-full">
                        <CheckCircle size={16} className="text-emerald-400" />
                    </div>
                    <span className="font-medium text-sm whitespace-nowrap">
                        {getGreeting()}
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WelcomeToast;
