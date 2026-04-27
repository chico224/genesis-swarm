// Genesis-Core | Chat Components Tests — Production
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { ChatMessage } from '../src/components/chat/ChatMessage';
import type { Message } from '../src/types';

describe('ChatMessage Component', () => {
    const userMsg: Message = {
        id: '1', role: 'user', content: 'Crée un agent de scraping.', timestamp: 1714176000000
    };
    const agentMsg: Message = {
        id: '2', role: 'agent', content: 'Agent SCRAPER_001 instancié avec succès.', agentId: 'OMEGA_001', timestamp: 1714176001000
    };

    it('devrait afficher le contenu du message utilisateur', () => {
        render(<ChatMessage message={userMsg} />);
        expect(screen.getByText('Crée un agent de scraping.')).toBeDefined();
    });

    it("devrait afficher l'ID de l'agent pour les messages d'agent", () => {
        render(<ChatMessage message={agentMsg} />);
        expect(screen.getByText(/OMEGA_001/)).toBeDefined();
        expect(screen.getByText('Agent SCRAPER_001 instancié avec succès.')).toBeDefined();
    });
});

describe('Chat API Route', () => {
    it('devrait retourner 400 si le prompt est vide', async () => {
        const { POST } = await import('../src/app/api/chat/route');
        const req = new Request('http://localhost/api/chat', {
            method: 'POST',
            body: JSON.stringify({ prompt: '' }),
            headers: { 'Content-Type': 'application/json' }
        });
        const res = await POST(req as any);
        expect(res.status).toBe(400);
    });
});
