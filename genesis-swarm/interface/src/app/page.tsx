'use client';
// Genesis-Core | Main Page — Production
// Author: Oumar Sow

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { ChatInterface } from '../components/chat/ChatInterface';
import { AgentPanel } from '../components/dashboard/AgentPanel';
import { useSwarmSocket } from '../hooks/useSwarmSocket';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8080/ws';

// Chargement dynamique côté client uniquement (évite SSR crash WebGL)
const SwarmCanvas = dynamic(
    () => import('../components/3d/SwarmCanvas').then(m => m.SwarmCanvas),
    { ssr: false }
);

const layout: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 340px',
    gridTemplateRows: '1fr 320px',
    height: '100dvh',
    gap: '10px',
    padding: '10px',
    background: '#050508',
    overflow: 'hidden'
};

const fallback3d: React.CSSProperties = {
    height: '100%',
    background: '#0d0d14',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6b6b90',
    fontSize: '13px'
};

export default function Home(): React.ReactElement {
    useSwarmSocket(WS_URL);

    return (
        <main style={layout}>
            {/* Zone Chat principale — occupe toute la hauteur */}
            <div style={{ gridRow: '1 / 3', minHeight: 0 }}>
                <ChatInterface />
            </div>

            {/* Métriques Cluster temps réel */}
            <div style={{ minHeight: 0 }}>
                <AgentPanel />
            </div>

            {/* Visualiseur 3D Swarm — WebGL */}
            <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #1f1f35', minHeight: 0 }}>
                <Suspense fallback={<div style={fallback3d}>Chargement du moteur 3D...</div>}>
                    <SwarmCanvas nodeCount={500} />
                </Suspense>
            </div>
        </main>
    );
}
