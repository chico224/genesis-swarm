'use client';
// Genesis-Core | Agent Dashboard Panel — Production
// Author: Oumar Sow

import React from 'react';
import { useSwarmStore } from '../../store/swarmStore';

type Health = 'OPTIMAL' | 'WARNING' | 'CRITICAL';

function getBadgeStyle(health: Health): React.CSSProperties {
    const map: Record<Health, { bg: string; color: string; border: string }> = {
        OPTIMAL: { bg: '#00ffc820', color: '#00ffc8', border: '1px solid #00ffc840' },
        WARNING: { bg: '#ffc80020', color: '#ffc800', border: '1px solid #ffc80040' },
        CRITICAL:{ bg: '#ff2d5520', color: '#ff2d55', border: '1px solid #ff2d5540' },
    };
    const t = map[health] ?? map.CRITICAL;
    return {
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: 700,
        background: t.bg,
        color: t.color,
        border: t.border,
    };
}

export function AgentPanel() {
    const { activeNodes, systemHealth } = useSwarmStore();
    const capacity = 500;
    const fillPct  = Math.min(100, Math.round((activeNodes / capacity) * 100));

    return (
        <div style={{
            background: '#0d0d14',
            border: '1px solid #1f1f35',
            borderRadius: '10px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            height: '100%',
            boxSizing: 'border-box',
        }}>
            {/* Titre */}
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', color: '#6b6b90' }}>
                ÉTAT DU CLUSTER
            </div>

            {/* Nœuds actifs + barre de progression */}
            <div style={{ padding: '10px 14px', background: '#12121e', borderRadius: '8px', border: '1px solid #1f1f35' }}>
                <div style={{ fontSize: '12px', color: '#6b6b90', marginBottom: '4px' }}>Nœuds Actifs</div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#00ffc8' }}>
                    {activeNodes}
                    <span style={{ fontSize: '13px', color: '#6b6b90' }}> / {capacity}</span>
                </div>
                <div style={{ height: '4px', borderRadius: '2px', background: '#1f1f35', overflow: 'hidden', marginTop: '8px' }}>
                    <div style={{
                        height: '100%',
                        width: `${fillPct}%`,
                        background: '#00ffc8',
                        borderRadius: '2px',
                        transition: 'width 0.5s ease',
                    }} />
                </div>
            </div>

            {/* Santé système */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#12121e', borderRadius: '8px', border: '1px solid #1f1f35' }}>
                <span style={{ fontSize: '12px', color: '#6b6b90' }}>Santé Système</span>
                <span style={getBadgeStyle(systemHealth)}>{systemHealth}</span>
            </div>

            {/* Architecture */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#12121e', borderRadius: '8px', border: '1px solid #1f1f35' }}>
                <span style={{ fontSize: '12px', color: '#6b6b90' }}>Architecture</span>
                <span style={{ fontSize: '12px', color: '#e2e2f0', fontWeight: 600 }}>Rust + Python</span>
            </div>

            {/* Protocole */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#12121e', borderRadius: '8px', border: '1px solid #1f1f35' }}>
                <span style={{ fontSize: '12px', color: '#6b6b90' }}>Protocole</span>
                <span style={{ fontSize: '12px', color: '#e2e2f0', fontWeight: 600 }}>gRPC / WSS</span>
            </div>

            {/* Chiffrement */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#12121e', borderRadius: '8px', border: '1px solid #1f1f35' }}>
                <span style={{ fontSize: '12px', color: '#6b6b90' }}>Chiffrement</span>
                <span style={{ fontSize: '12px', color: '#00ffc8', fontWeight: 600 }}>AES-256-GCM ✓</span>
            </div>
        </div>
    );
}
