import { useEffect, useState } from 'react';

import { useSettingsChecked } from '../store';

import { cn } from '@/shared/utils';

export interface TermLookupSettingsCheckedMarkerProps {
  className?: string;
}

export const TermLookupSettingsCheckedMarker = ({
  className,
}: TermLookupSettingsCheckedMarkerProps) => {
  const [mounted, setIsMounted] = useState(false);
  const settingsChecked = useSettingsChecked();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!mounted) return <></>;

  return (
    <span
      className={cn(
        className,
        'bg-warning h-2.5 w-2.5 rounded-full pointer-events-none',
        settingsChecked === false ? '' : 'hidden',
      )}
    ></span>
  );
};
