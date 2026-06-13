'use client';

import { useAnimations, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { CatTrigger } from './use-cat-behavior';

const TRIGGER_CLIP_MAP: Record<CatTrigger, string> = {
  idle: 'idle',
  jump: 'jump',
  crouch: 'crouch',
  roll: 'roll',
  wave: 'wave',
};

useGLTF.preload('/cat.glb');

interface CatModelProps {
  mouseX: number;
  mouseY: number;
  trigger: CatTrigger;
}

function CatModel({ mouseX, mouseY, trigger }: CatModelProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const headRef = useRef<THREE.Object3D | null>(null);

  const { scene, animations } = useGLTF('/cat.glb');

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    // Auto-fit: escala e centra o modelo para caber em 1.8 unidades de altura
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const scale = size.y > 0 ? 1.8 / size.y : 1;
    clone.scale.setScalar(scale);

    const box2 = new THREE.Box3().setFromObject(clone);
    const center2 = box2.getCenter(new THREE.Vector3());
    // Centra horizontalmente, deixa pés na base (bottom at y=0)
    const bottom2 = box2.min.y;
    clone.position.set(-center2.x, -bottom2 - 0.9, -center2.z);

    return clone;
  }, [scene]);

  const { actions, mixer } = useAnimations(animations, groupRef);

  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const head =
      clonedScene.getObjectByName('Head') ??
      clonedScene.getObjectByName('head') ??
      clonedScene.getObjectByName('Cabeca');
    headRef.current = head ?? null;
  }, [clonedScene]);

  useEffect(() => {
    const clipName = TRIGGER_CLIP_MAP[trigger];
    const fallback = TRIGGER_CLIP_MAP['idle'];

    const action = actions[clipName] ?? actions[fallback];
    if (!action) return;

    Object.values(actions).forEach((a) => a?.fadeOut(0.2));
    action
      .reset()
      .fadeIn(0.2)
      .setLoop(
        trigger === 'idle' ? THREE.LoopRepeat : THREE.LoopOnce,
        trigger === 'idle' ? Infinity : 1,
      )
      .play();

    const onFinished = (e: THREE.Event) => {
      if ((e as { action?: THREE.AnimationAction }).action === action) {
        actions[fallback]?.reset().fadeIn(0.2).play();
      }
    };
    mixer.addEventListener('finished', onFinished);
    return () => {
      mixer.removeEventListener('finished', onFinished);
    };
  }, [trigger, actions, mixer]);

  useFrame(() => {
    targetRotation.current.y = mouseX * 0.4;
    targetRotation.current.x = mouseY * 0.2;

    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        targetRotation.current.y,
        0.08,
      );
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        targetRotation.current.x,
        0.08,
      );
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  );
}

export interface CatSceneProps {
  mouseX: number;
  mouseY: number;
  trigger: CatTrigger;
}

export function CatScene(props: CatSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 50 }}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <CatModel {...props} />
    </Canvas>
  );
}

CatScene.preload = () => useGLTF.preload('/cat.glb');
