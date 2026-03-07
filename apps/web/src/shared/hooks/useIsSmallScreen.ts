import { useEffect, useState } from 'react';

export const DEFAULT_SMALL_SCREEN_THRESHOLD = 768;

export const useIsSmallScreen = (
  threshold = DEFAULT_SMALL_SCREEN_THRESHOLD,
) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const smallScreenHandler = () => {
      setIsSmallScreen(window.innerWidth < threshold);
    };

    window.addEventListener('resize', smallScreenHandler);
    smallScreenHandler();

    return () => window.removeEventListener('resize', smallScreenHandler);
  }, [threshold]);

  return isSmallScreen;
};
