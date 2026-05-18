"use client";

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

export interface SpaceshipSceneProps {
  onComplete: () => void;
}

function SpaceshipModel() {
  const groupRef = useRef<THREE.Group>(null);

  // Particles
  const particlesCount = 300;
  const [particlePositions] = useState(() => {
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1.8;
      positions[i * 3 + 1] = Math.random() * 0.3 - 0.2;
      positions[i * 3 + 2] = 1.5 + Math.random() * 0.3;
    }
    return positions;
  });

  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
      groupRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.02;
    }

    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particlesCount; i++) {
        positions[i * 3 + 2] += 0.08;

        // slight spread
        positions[i * 3] += (positions[i * 3] * 0.01);
        positions[i * 3 + 1] += (positions[i * 3 + 1] * 0.01);

        if (positions[i * 3 + 2] > 8) {
          positions[i * 3] = (Math.random() - 0.5) * 1.8;
          positions[i * 3 + 1] = Math.random() * 0.3 - 0.2;
          positions[i * 3 + 2] = 1.5 + Math.random() * 0.3;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  // Materials
  const materials = useMemo(() => {
    return {
      body: new THREE.MeshStandardMaterial({ color: '#1a1a2e', metalness: 0.9, roughness: 0.2 }),
      cockpit: new THREE.MeshPhysicalMaterial({
        color: '#050510',
        transmission: 0.6,
        metalness: 0.1,
        roughness: 0,
        emissive: '#0033aa',
        emissiveIntensity: 0.3
      }),
      engine: new THREE.MeshStandardMaterial({ color: '#0d0d1a', metalness: 1, roughness: 0.1 }),
      engineCone: new THREE.MeshBasicMaterial({ color: '#88aaff', transparent: true, opacity: 0.8 }),
      engineBloom: new THREE.MeshBasicMaterial({ color: '#2244ff', transparent: true, opacity: 0.3 })
    };
  }, []);

  // Geometries
  const geometries = useMemo(() => {
    return {
      mainBody: new THREE.CylinderGeometry(0.3, 0.5, 3.5, 8),
      noseCone: new THREE.ConeGeometry(0.3, 1.2, 8),
      cockpitDome: new THREE.SphereGeometry(0.28, 16, 8),
      wing: new THREE.BoxGeometry(1.8, 0.06, 0.9),
      enginePod: new THREE.CylinderGeometry(0.18, 0.22, 0.9, 12),
      centerEngine: new THREE.CylinderGeometry(0.22, 0.28, 0.7, 12),
      engineCone: new THREE.CircleGeometry(0.18, 16),
      engineBloom: new THREE.CircleGeometry(0.35, 16)
    };
  }, []);

  useEffect(() => {
    return () => {
      Object.values(materials).forEach(m => m.dispose());
      Object.values(geometries).forEach(g => g.dispose());
    };
  }, [materials, geometries]);

  return (
    <group ref={groupRef}>
      {/* Main Body */}
      <mesh material={materials.body} geometry={geometries.mainBody} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]} />

      {/* Nose Cone */}
      <mesh material={materials.body} geometry={geometries.noseCone} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -2.35]} />

      {/* Cockpit Dome */}
      <mesh material={materials.cockpit} geometry={geometries.cockpitDome} position={[0, 0.28, -0.5]} scale={[1, 0.5, 0.8]} />

      {/* Left Wing */}
      <mesh material={materials.body} geometry={geometries.wing} position={[-1.1, -0.1, 0.4]} rotation={[0, -0.2, -0.15]} />

      {/* Right Wing */}
      <mesh material={materials.body} geometry={geometries.wing} position={[1.1, -0.1, 0.4]} rotation={[0, 0.2, 0.15]} />

      {/* Left Engine Pod */}
      <mesh material={materials.engine} geometry={geometries.enginePod} position={[-0.9, -0.12, 1.2]} rotation={[Math.PI / 2, 0, 0]} />

      {/* Right Engine Pod */}
      <mesh material={materials.engine} geometry={geometries.enginePod} position={[0.9, -0.12, 1.2]} rotation={[Math.PI / 2, 0, 0]} />

      {/* Center Engine */}
      <mesh material={materials.engine} geometry={geometries.centerEngine} position={[0, -0.05, 1.4]} rotation={[Math.PI / 2, 0, 0]} />

      {/* Left Engine Glow */}
      <pointLight color="#4488ff" intensity={3} distance={4} position={[-0.9, -0.12, 1.8]} />
      {/* Right Engine Glow */}
      <pointLight color="#4488ff" intensity={3} distance={4} position={[0.9, -0.12, 1.8]} />
      {/* Center Engine Glow */}
      <pointLight color="#6699ff" intensity={4} distance={5} position={[0, -0.05, 1.9]} />

      {/* Engine Cone Effects */}
      <mesh position={[-0.9, -0.12, 1.66]} rotation={[Math.PI / 2, 0, 0]} material={materials.engineCone} geometry={geometries.engineCone} />
      <mesh position={[-0.9, -0.12, 1.67]} rotation={[Math.PI / 2, 0, 0]} material={materials.engineBloom} geometry={geometries.engineBloom} />

      <mesh position={[0.9, -0.12, 1.66]} rotation={[Math.PI / 2, 0, 0]} material={materials.engineCone} geometry={geometries.engineCone} />
      <mesh position={[0.9, -0.12, 1.67]} rotation={[Math.PI / 2, 0, 0]} material={materials.engineBloom} geometry={geometries.engineBloom} />

      <mesh position={[0, -0.05, 1.76]} rotation={[Math.PI / 2, 0, 0]} material={materials.engineCone} geometry={geometries.engineCone} />
      <mesh position={[0, -0.05, 1.77]} rotation={[Math.PI / 2, 0, 0]} material={materials.engineBloom} geometry={geometries.engineBloom} />

      {/* Engine Particle Trail */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#4466ff" size={0.04} transparent opacity={0.6} sizeAttenuation />
      </points>
    </group>
  );
}

function StarField() {
  const starsCount = 2000;
  const [starsPositions] = useState(() => {
    const positions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount; i++) {
      const radius = 80;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    return positions;
  });

  const starsRef = useRef<THREE.Points>(null);

  useFrame(() => {
    if (starsRef.current) {
      const positions = starsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < starsCount; i++) {
        positions[i * 3 + 2] += 0.02;
        if (positions[i * 3 + 2] > 50) {
          const radius = 80;
          const theta = 2 * Math.PI * Math.random();
          const phi = Math.acos(2 * Math.random() - 1);
          positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[i * 3 + 2] = -50; // Reset to far away
        }
      }
      starsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[starsPositions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.08} transparent opacity={0.8} />
    </points>
  );
}

function CameraAnimation() {
  useFrame((state) => {
    state.camera.position.lerp(new THREE.Vector3(0, 0.8, 3), 0.008);
  });
  return null;
}

function ShipScene() {
  return (
    <>
      <ambientLight color="#000820" intensity={0.4} />
      <directionalLight color="#2244aa" intensity={1.5} position={[3, 2, -5]} />
      <directionalLight color="#4466ff" intensity={0.8} position={[-2, -1, 3]} />

      <SpaceshipModel />
      <StarField />
      <CameraAnimation />
    </>
  );
}

export default function SpaceshipScene({ onComplete }: SpaceshipSceneProps) {
  const [showSystemText, setShowSystemText] = useState(false);
  const [showVesselText, setShowVesselText] = useState(false);
  const [showHudText, setShowHudText] = useState(false);
  const [fadeAll, setFadeAll] = useState(false);
  const [blackScreen, setBlackScreen] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowHudText(true), 500);
    const t2 = setTimeout(() => setShowSystemText(true), 1000);
    const t3 = setTimeout(() => setShowVesselText(true), 2000);
    const t4 = setTimeout(() => setFadeAll(true), 6000);
    const t5 = setTimeout(() => setBlackScreen(true), 7500);
    const t6 = setTimeout(() => onComplete(), 8000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [onComplete]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: '#000008' }}>
      <Canvas
        camera={{ position: [0, 1.5, 12], fov: 60 }}
        gl={{ antialias: true }}
      >
        <ShipScene />
      </Canvas>

      {/* Cinematic Text Overlay */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 101, overflow: 'hidden' }}>
        <AnimatePresence>
          {showHudText && !fadeAll && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                fontFamily: '"Space Mono", monospace',
                fontSize: '9px',
                color: 'rgba(0,255,136,0.4)',
                letterSpacing: '0.3em',
              }}
            >
              ━━ NAV SYSTEMS ONLINE ━━
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSystemText && !fadeAll && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              style={{
                position: 'absolute',
                bottom: 40,
                left: 20,
                fontFamily: '"Space Mono", monospace',
                fontSize: '10px',
                color: 'rgba(100,150,255,0.5)',
                letterSpacing: '0.5em',
              }}
            >
              SYSTEM X-07 EXPEDITION
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showVesselText && !fadeAll && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              style={{
                position: 'absolute',
                bottom: 20,
                left: 20,
                fontFamily: '"Space Mono", monospace',
                fontSize: '9px',
                color: 'rgba(100,150,255,0.3)',
                letterSpacing: '0.3em',
              }}
            >
              VESSEL: RANGER-7 · DEPARTING KNOWN SPACE
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {blackScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: '#000008',
              zIndex: 102
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
