// Genesis-Core | API Route — Chat Endpoint (Production)
// Reçoit le prompt du frontend, le route vers le backend Rust
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const CORE_ENGINE_URL = process.env.CORE_ENGINE_URL ?? 'http://localhost:8080';

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
            return NextResponse.json({ error: 'Prompt invalide.' }, { status: 400 });
        }

        // Transmission au noyau Rust via l'API HTTP (pont gRPC interne)
        const upstream = await fetch(`${CORE_ENGINE_URL}/api/agent/process`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: prompt.trim() }),
            signal: AbortSignal.timeout(30000) // Timeout 30s
        });

        if (!upstream.ok) {
            throw new Error(`Core Engine error: ${upstream.status}`);
        }

        const data = await upstream.json();
        return NextResponse.json({
            response: data.result,
            agentId: data.agent_id
        });

    } catch (error: any) {
        console.error('[API/chat] Error:', error.message);
        return NextResponse.json(
            { error: 'Le noyau Genesis-Core est injoignable.', response: `[CORE-ENGINE OFFLINE] ${error.message}` },
            { status: 503 }
        );
    }
}
