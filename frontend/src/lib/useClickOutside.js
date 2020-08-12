import { useEffect } from 'react';

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useClickOutside(ref, visibleState, toggleFunction) {
    useEffect(() => {
        function handleClickOutside(event) {
            if (visibleState && ref.current && !ref.current.contains(event.target)) {
                toggleFunction();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, visibleState]);
}

export { useClickOutside };
