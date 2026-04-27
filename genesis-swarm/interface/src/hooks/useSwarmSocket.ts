'use client';
// Genesis-Core | Production WebSocket Hook
import { useEffect, useRef, useCallback } from 'react';
import { useSwarmStore } from '../store/swarmStore';

export function useSwarmSocket(url: string) {
    const wsRef = useRef<WebSocket | null>(null);
    const { updateMetrics } = useSwarmStore();

    const connect = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) return;

        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('[WS] Genesis-Core connected.');
            updateMetrics(0, 'OPTIMAL');
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'METRICS_UPDATE') {
                    updateMetrics(data.activeNodes, data.systemHealth);
                }
            } catch {
                console.error('[WS] Invalid message format:', event.data);
            }
        };

        ws.onerror = () => updateMetrics(0, 'CRITICAL');

        ws.onclose = () => {
            console.log('[WS] Disconnected. Reconnecting in 3s...');
            setTimeout(connect, 3000); // Auto-reconnect
        };
    }, [url, updateMetrics]);

    useEffect(() => {
        connect();
        return () => {
            wsRef.current?.close();
        };
    }, [connect]);

    const sendMessage = useCallback((payload: object) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(payload));
        }
    }, []);

    return { sendMessage };
}
