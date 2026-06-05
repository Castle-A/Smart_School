
import { useCallback } from 'react';
import api from '../api/api';

/**
 * Hook personnalisé pour tracker les événements utilisateurs
 * Utilise l'API backend /analytics/track
 */
export const useAnalytics = () => {

    const track = useCallback(async (
        type: string,
        metadata?: Record<string, any>
    ) => {
        try {
            await api.post('/analytics/track', {
                type,
                metadata
            });
        } catch (error) {
            // On ne veut pas casser l'app si le tracking échoue
            console.error('Analytics tracking failed:', error);
        }
    }, []);

    const trackPageView = useCallback((pageName: string) => {
        track('PAGE_VIEW', { page: pageName });
    }, [track]);

    const trackClick = useCallback((elementId: string) => {
        track('CLICK', { element: elementId });
    }, [track]);

    return {
        track,
        trackPageView,
        trackClick
    };
};
