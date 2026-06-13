'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { useCatBehavior } from './use-cat-behavior';

const CatScene = dynamic(
  () => import('./cat-scene').then((m) => ({ default: m.CatScene })),
  { ssr: false },
);

export function Cat() {
  const { mouseX, mouseY, trigger } = useCatBehavior();

  return (
    <div
      className="fixed right-0 bottom-0 z-50 h-[280px] w-[240px] md:h-[360px] md:w-[300px]"
      style={{ pointerEvents: 'none' }}
    >
      <Suspense fallback={null}>
        <CatScene mouseX={mouseX} mouseY={mouseY} trigger={trigger} />
      </Suspense>
    </div>
  );
}
