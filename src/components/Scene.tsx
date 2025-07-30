'use client';

import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  Stage,
  ContactShadows 
} from '@react-three/drei';
import { Suspense } from 'react';

function Model() {
  const { scene } = useGLTF('/lapwing.glb');
  
  return <primitive object={scene} />;
}

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#000000']} />
      
      <Suspense fallback={null}>
        <Stage
          environment="city"
          intensity={0.5}
          adjustCamera={false}
        >
          <Model />
        </Stage>
        
        <ContactShadows
          position={[0, -1, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4}
        />
      </Suspense>

      <OrbitControls
        autoRotate
        autoRotateSpeed={0.5}
        enableZoom={false}
        makeDefault
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}