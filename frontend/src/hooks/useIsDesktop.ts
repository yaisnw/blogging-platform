import { useState, useEffect } from 'react';

export const useIsDesktop = () => {
    const [width, setWidth] = useState(
        typeof window !== 'undefined' ? window.innerWidth : 1200
    );

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isDesktop = width >= 1060;
    const isMobile = width < 600;
    const isTablet = width >= 600 && width < 1060;

    return {
        isDesktop,
        isTablet,
        isMobile,
        width
    };
};