// Genesis-Core Frontend Store
// Classification: OMEGA-CORE
import { create } from 'zustand';

interface SwarmState {
    activeNodes: number;
    systemHealth: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
    updateMetrics: (nodes: number, health: 'OPTIMAL' | 'WARNING' | 'CRITICAL') => void;
}

export const useSwarmStore = create<SwarmState>((set) => ({
    activeNodes: 0,
    systemHealth: 'OPTIMAL',
    updateMetrics: (nodes, health) => set({ activeNodes: nodes, systemHealth: health })
}));
