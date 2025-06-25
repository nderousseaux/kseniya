import { useEffect } from 'react';

/**
 * Hook personnalisé pour gérer le comportement d'une modal
 * - Fermeture avec la touche Escape
 * - Prévention du scroll du body quand la modal est ouverte
 */
const useModalBehavior = (isOpen: boolean, onClose: () => void) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
};

export default useModalBehavior;
