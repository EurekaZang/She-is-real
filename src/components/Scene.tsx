'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, ContactShadows } from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Persona } from '@/app/types';

type SceneProps = {
  persona: Persona;
};

const MODEL_CONFIG: Record<string, {
  glb: string;
  camera: { position: [number, number, number]; fov: number };
  modelPosition: [number, number, number];
  orbitTarget: [number, number, number];
}> = {
  Lapwing: {
    glb: '/lapwing.glb',
    camera: { position: [10, 50, 20], fov: 45 },
    modelPosition: [0, -30, 0],
    orbitTarget: [0, 20, 0],
  },
  Nia: {
    glb: '/nia.glb',
    camera: { position: [0, 0.1, 0.1], fov: 45 },
    modelPosition: [0, -0.06, 0],
    orbitTarget: [0, 0, 0],
  },
  Momoi: {
    glb: '/momoi1k.glb',
    camera: { position: [0, 0.1, 0.1], fov: 45 },
    modelPosition: [0, -0.06, 0],
    orbitTarget: [0, 0, 0],
  },
};

function Model({ url, position }: { url: string; position: [number, number, number] }) {
  const { scene, animations } = useGLTF(url);
  const mixer = useRef<THREE.AnimationMixer | null>(null);

  useEffect(() => {
    if (animations && animations.length > 0) {
      mixer.current = new THREE.AnimationMixer(scene);
      const action = mixer.current.clipAction(animations[0]);
      action.reset().play();
      return () => {
        mixer.current?.stopAllAction();
      };
    }
  }, [scene, animations]);

  useFrame((_, delta) => {
    mixer.current?.update(delta);
  });

  return <primitive object={scene} position={position} />;
}

export default function Scene({ persona }: SceneProps) {
  const config = MODEL_CONFIG[persona?.name || 'Lapwing'] || MODEL_CONFIG.Lapwing;

  return (
    <Canvas
      camera={config.camera}
      style={{ width: '100%', height: '100%' }}
      gl={{ alpha: true }}
    >
      {/* 手动添加光源 */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 20, 10]} intensity={3.0} castShadow />
      <Suspense fallback={null}>
        <Model url={config.glb} position={config.modelPosition} />
        <ContactShadows
          position={config.modelPosition}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4}
        />
      </Suspense>
      <OrbitControls
        target={config.orbitTarget}
        enableZoom={true}
        makeDefault
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}