import { useState, useEffect } from 'react';

export const useIsDesktop = () => {
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1060);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1060);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isDesktop;
};