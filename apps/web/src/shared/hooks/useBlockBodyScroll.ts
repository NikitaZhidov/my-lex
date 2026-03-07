import { useEffect } from 'react';

export const useBlockBodyScroll = (block: boolean) => {
  useEffect(() => {
    if (block) {
      window.document.body.style.overflow = 'hidden';
    } else {
      window.document.body.style.overflow = '';
    }
  }, [block]);
};
