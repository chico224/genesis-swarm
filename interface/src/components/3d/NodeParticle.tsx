// Genesis-Core 3D Component
// Classification: OMEGA-CORE
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface NodeProps {
    position: [number, number, number];
    isActive: boolean;
}

export const NodeParticle: React.FC<NodeProps> = ({ position, isActive }) => {
    const meshRef = useRef<Mesh>(null);

    // Micro-animation de lévitation (Fluidité absolue 60fps)
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.5;
            meshRef.current.rotation.y += delta * 0.5;
        }
    });

    return (
        <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial 
                color={isActive ? "#00ffcc" : "#ff0055"} 
                emissive={isActive ? "#00ffcc" : "#ff0055"} 
                emissiveIntensity={1.5} 
                roughness={0.2}
                metalness={0.8}
            />
        </mesh>
    );
};
