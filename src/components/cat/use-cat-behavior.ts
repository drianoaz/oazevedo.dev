'use client';

import { useEffect, useRef, useState } from 'react';

export type CatTrigger = 'idle' | 'jump' | 'crouch' | 'roll' | 'wave';

export interface CatBehavior {
  mouseX: number;
  mouseY: number;
  trigger: CatTrigger;
}

export function useCatBehavior(): CatBehavior {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [trigger, setTrigger] = useState<CatTrigger>('idle');

  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isScrolling = useRef(false);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetToIdle = () => {
    if (idleTimer.current) {
      clearTimeout(idleTimer.current);
    }
    idleTimer.current = setTimeout(() => {
      setTrigger('idle');
    }, 3000);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -((e.clientY / window.innerHeight) * 2 - 1);
      setMouseX(x);
      setMouseY(y);

      const target = e.target as Element | null;
      const isInteractive =
        target?.closest('a, button, [role="button"]') !== null;

      if (!isScrolling.current) {
        if (isInteractive) {
          setTrigger('wave');
        } else {
          setTrigger('idle');
        }
        resetToIdle();
      }
    };

    const handleClick = () => {
      setTrigger('jump');
      resetToIdle();
    };

    const handleScroll = () => {
      isScrolling.current = true;
      setTrigger('crouch');

      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
      scrollTimer.current = setTimeout(() => {
        isScrolling.current = false;
        setTrigger('idle');
      }, 600);

      resetToIdle();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);

      if (idleTimer.current) {
        clearTimeout(idleTimer.current);
      }
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, []);

  return { mouseX, mouseY, trigger };
}
