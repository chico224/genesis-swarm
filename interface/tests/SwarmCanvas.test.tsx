// Genesis-Core UI Tests
// Classification: OMEGA-CORE
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SwarmCanvas } from '../src/components/3d/SwarmCanvas';
import React from 'react';
import { vi, describe, it, expect } from 'vitest';

// Mock partiel de l'environnement WebGL pour les tests Node.js
vi.mock('@react-three/fiber', () => ({
    Canvas: ({ children }: any) => <div data-testid="mock-canvas">{children}</div>,
    useFrame: vi.fn(),
}));

vi.mock('@react-three/drei', () => ({
    OrbitControls: () => null,
    Stars: () => null,
}));

describe('SwarmCanvas 3D UI TDD', () => {
    it('devrait rendre le conteneur principal 4K sans crasher', () => {
        render(<SwarmCanvas nodeCount={500} />);
        const container = screen.getByTestId('swarm-canvas-container');
        expect(container).toBeInTheDocument();

        // Vérifie que le fond est bien le noir profond absolu
        expect(container.style.background).toBe('rgb(5, 5, 5)');
    });

    it('devrait initialiser le moteur de rendu Canvas', () => {
        render(<SwarmCanvas nodeCount={10} />);
        const canvas = screen.getByTestId('mock-canvas');
        expect(canvas).toBeInTheDocument();
    });
});
