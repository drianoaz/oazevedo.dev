import { useEffect, useState } from 'react';

export function useScrollPosition(): number {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(window.pageYOffset);
    };

    window.addEventListener('scroll', updatePosition);

    updatePosition(); // Set initial position

    return () => {
      window.removeEventListener('scroll', updatePosition);
    };
  }, []);

  return scrollPosition;
}
