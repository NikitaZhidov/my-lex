import { RefObject, useEffect } from 'react';

export type UseMousedownOutsideOptions = {
  func: VoidFunction;
  condition?: () => boolean;
};

export const useMousedownOutside = (
  containerRef: RefObject<HTMLElement | null>,
  options: UseMousedownOutsideOptions,
  deps?: unknown[],
) => {
  useEffect(() => {
    const shouldAddListener = !options.condition || options.condition();

    if (shouldAddListener) {
      const handleMousedownOutside = (event: MouseEvent) => {
        const container = containerRef.current;

        if (
          container &&
          event.target &&
          !container.contains(event.target as Node)
        ) {
          options.func();
        }
      };

      document.addEventListener('mousedown', handleMousedownOutside);

      return () => {
        document.removeEventListener('mousedown', handleMousedownOutside);
      };
    }

    return;
  }, deps);
};
