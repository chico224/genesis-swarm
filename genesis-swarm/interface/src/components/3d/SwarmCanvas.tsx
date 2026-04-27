// Genesis-Core 3D Canvas
// Classification: OMEGA-CORE
import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { NodeParticle } from './NodeParticle';

interface SwarmCanvasProps {
    nodeCount: number;
}

export const SwarmCanvas: React.FC<SwarmCanvasProps> = ({ nodeCount }) => {
    // Calcul de la topologie spatiale des nœuds
    const nodes = useMemo(() => {
        const temp = [];
        for (let i = 0; i < nodeCount; i++) {
            temp.push({
                id: i,
                position: [
                    (Math.random() - 0.5) * 15,
                    (Math.random() - 0.5) * 15,
                    (Math.random() - 0.5) * 15,
                ] as [number, number, number],
                isActive: Math.random() > 0.1 // 90% de nœuds actifs
            });
        }
        return temp;
    }, [nodeCount]);

    return (
        <div data-testid="swarm-canvas-container" style={{ width: '100vw', height: '100vh', background: '#050505', overflow: 'hidden' }}>
            <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={2} color="#00ffcc" />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={0.5} />
                
                {nodes.map(node => (
                    <NodeParticle key={node.id} position={node.position} isActive={node.isActive} />
                ))}
            </Canvas>
        </div>
    );
};
