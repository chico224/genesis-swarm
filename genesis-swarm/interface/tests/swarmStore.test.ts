// Genesis-Core Frontend Tests
// Classification: OMEGA-CORE
// Framework: Vitest / Jest

import { describe, it, expect, beforeEach } from 'vitest';
import { useSwarmStore } from '../src/store/swarmStore';
import { SwarmSocket } from '../src/services/websocket';

describe('Swarm Store & Services TDD', () => {
    
    beforeEach(() => {
        // Reset du store global avant chaque test
        useSwarmStore.setState({ activeNodes: 0, systemHealth: 'OPTIMAL' });
    });

    it('devrait mettre à jour correctement les métriques dans le store global', () => {
        const store = useSwarmStore.getState();
        expect(store.activeNodes).toBe(0);
        
        store.updateMetrics(450, 'WARNING');
        
        const updatedStore = useSwarmStore.getState();
        expect(updatedStore.activeNodes).toBe(450);
        expect(updatedStore.systemHealth).toBe('WARNING');
    });

    it('devrait rejeter une URL WebSocket invalide (Sécurité stricte)', () => {
        const socket = new SwarmSocket('http://localhost:8080');
        expect(() => socket.connect()).toThrow('Invalid WebSocket Protocol. Must be ws:// or wss://');
    });

    it('devrait accepter une connexion WebSocket valide', () => {
        const socket = new SwarmSocket('ws://localhost:8080');
        expect(socket.connect()).toBe(true);
        expect(socket.isConnected).toBe(true);
    });
});
