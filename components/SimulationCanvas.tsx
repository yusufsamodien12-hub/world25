
import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Stars, ContactShadows, Environment } from '@react-three/drei';
import { Bloom, EffectComposer, Noise, Vignette, Scanline } from '@react-three/postprocessing';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { WorldObject, ConstructionPlan } from '../src/types';
import { WorldAsset } from './WorldAssets';
import { Avatar } from './Avatar';

interface SimulationCanvasProps {
  objects: WorldObject[];
  avatarPos: [number, number, number];
  avatarTarget: [number, number, number] | null;
  activePlan?: ConstructionPlan;
}

const Terrain: React.FC = () => {
  const meshRef = React.useRef<THREE.Mesh>(null);
  
  // Create a vertex-based terrain that matches getTerrainHeight logic
  // Vast world scale: 1000x1000
  const geom = useMemo(() => {
    const g = new THREE.PlaneGeometry(1000, 1000, 128, 128);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getY(i);
      // Multi-layered noise for more "vast" look
      const h = (Math.sin(x * 0.1) * Math.cos(z * 0.1) * 2.0) +
                (Math.sin(x * 0.02) * Math.cos(z * 0.02) * 5.0);
      pos.setZ(i, h);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <mesh ref={meshRef} geometry={geom} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <meshStandardMaterial
        color="#1e293b"
        roughness={0.7}
        metalness={0.1}
        flatShading
        emissive="#0ea5e9"
        emissiveIntensity={0.15}
      />
    </mesh>
  );
};

const SimulationCanvas: React.FC<SimulationCanvasProps> = ({ objects, avatarPos, avatarTarget, activePlan }) => {
  const ghostObjects = useMemo(() => {
    if (!activePlan) return [];
    return activePlan.steps.filter(step => step.status !== 'completed');
  }, [activePlan]);

  return (
    <div className="w-full h-full bg-black">
      <Canvas 
        camera={{ position: [20, 20, 20], fov: 45, far: 2000 }} 
        shadows
        gl={{ powerPreference: "high-performance", alpha: false, antialias: false }}
        onCreated={({ gl }) => {
          console.log('[SimulationCanvas] R3F GL Context Created');
        }}
      >
        <color attach="background" args={['#010409']} />
        <fogExp2 attach="fog" args={['#010409', 0.005]} />
        
        <hemisphereLight intensity={0.15} color="#00f2ff" groundColor="#000000" />
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 20, 10]} intensity={0.5} color="#00f2ff" />
        <directionalLight 
          position={[-50, 100, 50]}
          intensity={0.4} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />

        <Stars radius={300} depth={60} count={5000} factor={4} saturation={0} fade speed={0.5} />
        
        <pointLight position={[20, 50, 20]} intensity={0.3} color="#38bdf8" />
        <spotLight position={[50, 100, 50]} angle={0.15} penumbra={1} intensity={0.5} castShadow />

        <Terrain />
        <gridHelper args={[1000, 100, '#1e293b', '#0f172a']} position={[0, -0.05, 0]} />

        {/* Existing Real Objects */}
        {objects.map((obj) => (
          <WorldAsset 
            key={obj.id} 
            type={obj.type} 
            position={obj.position} 
            rotation={obj.rotation} 
            scale={obj.scale} 
            variant="real"
          />
        ))}

        {/* Planned Ghost Objects */}
        {ghostObjects.map((step, idx) => (
          <WorldAsset 
            key={`ghost-${idx}`} 
            type={step.type} 
            position={step.position} 
            variant="ghost"
          />
        ))}

        <Avatar position={avatarPos} targetPosition={avatarTarget} isThinking={activePlan === undefined} />

        <ContactShadows opacity={0.4} scale={100} blur={2.5} far={20} />
        <OrbitControls
          makeDefault
          target={[avatarPos[0], avatarPos[1], avatarPos[2]]}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.1}
        />

        {/* <EffectComposer multisampling={0}>
          <Bloom luminanceThreshold={1.2} mipmapBlur intensity={0.5} radius={0.4} />
          <Noise opacity={0.03} />
          <Vignette offset={0.1} darkness={1.1} />
          <Scanline density={1.2} opacity={0.05} />
        </EffectComposer> */}
      </Canvas>
    </div>
  );
};

export default SimulationCanvas;
