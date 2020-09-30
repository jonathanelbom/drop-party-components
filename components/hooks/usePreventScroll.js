import {useEffect} from 'react';

export default function usePreventScroll(show) {
    useEffect(() => {
        const preventDefault = (e) => e.preventDefault();
        if (typeof document !== 'undefined' && show) {
            document.addEventListener('touchmove', preventDefault, { passive: false });
            document.addEventListener('touchforcechange', preventDefault, { passive: false });
        }
        return () => {   
            if (typeof document !== 'undefined') {
                document.removeEventListener('touchmove', preventDefault, { passive: false });
                document.removeEventListener('touchforcechange', preventDefault, { passive: false });
            }
        }
    }, [show]);
}