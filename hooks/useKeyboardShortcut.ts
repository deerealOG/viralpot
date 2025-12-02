import { useEffect } from 'react';

export const useKeyboardShortcut = (key: string, callback: () => void, metaKey: boolean = true) => {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === key && (metaKey ? (event.metaKey || event.ctrlKey) : true)) {
        event.preventDefault();
        callback();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback, metaKey]);
};
