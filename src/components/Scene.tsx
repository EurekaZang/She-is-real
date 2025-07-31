'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  Stage,
  ContactShadows 
} from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';

type ModelProps = {
  position?: [number, number, number];
  animationName?: string; // 动画名称
};

function Model({ position = [0, 0, 0], animationName }: ModelProps) {
  const { scene, animations } = useGLTF('/lapwing.glb');
  const mixer = useRef<THREE.AnimationMixer | null>(null);

  useEffect(() => {
    if (animations.length > 0) {
      mixer.current = new THREE.AnimationMixer(scene);

      // 查找并播放指定动画
      const action = animations.find((clip) => clip.name === animationName);
      if (action) {
        const animationAction = mixer.current.clipAction(action);
        animationAction.reset().play();
      }
    }

    return () => mixer.current?.stopAllAction(); // 清理动画
  }, [scene, animations, animationName]);

  useFrame((state, delta) => {
    if (mixer.current) {
      mixer.current.update(delta); // 更新动画
    }
  });

  return <primitive object={scene} position={position} />;
}

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [10, 50, 20], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ alpha: true }}
    >
      <Suspense fallback={null}>
        <Stage
          environment="city"
          intensity={0.5}
          adjustCamera={false}
        >
          <Model position={[0, -30, 0]} animationName="Idle" /> {/* 指定动画名称 */}
        </Stage>
        
        <ContactShadows
          position={[0, -30, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4}
        />
      </Suspense>

      <OrbitControls
        target={[0, 20, 0]} // 对准模型头部
        enableZoom={true}
        makeDefault
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}