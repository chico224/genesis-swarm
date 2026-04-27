'use client';
// Genesis-Core | Chat Interface — Production
// Author: Oumar Sow

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, type Message } from './ChatMessage';

const s: { [key: string]: React.CSSProperties } = {
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#0d0d14',
        border: '1px solid #1f1f35',
        borderRadius: '10px',
        overflow: 'hidden'
    },
    header: {
        padding: '14px 20px',
        borderBottom: '1px solid #1f1f35',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: '#12121e'
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: '#00ffc8',
        boxShadow: '0 0 8px #00ffc8'
    },
    title: { fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em', color: '#e2e2f0' },
    messages: { flex: 1, overflowY: 'auto', padding: '16px 20px' },
    inputRow: {
        padding: '12px 16px',
        borderTop: '1px solid #1f1f35',
        display: 'flex',
        gap: 10,
        background: '#12121e',
        alignItems: 'center'
    },
    input: {
        flex: 1,
        background: '#05050a',
        border: '1px solid #1f1f35',
        borderRadius: '8px',
        padding: '10px 14px',
        color: '#e2e2f0',
        fontSize: '14px',
        outline: 'none',
        fontFamily: 'inherit',
        resize: 'none' as const
    },
    sendBtn: {
        padding: '10px 18px',
        borderRadius: '8px',
        background: '#00ffc8',
        color: '#05050a',
        fontWeight: 700,
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'opacity 0.2s'
    }
};

const WELCOME: Message = {
    id: '0',
    role: 'agent',
    content: "Genesis-Core Hyperviseur opérationnel. Décrivez l'agent à créer ou la tâche à accomplir.",
    timestamp: Date.now()
};

export function ChatInterface(): React.ReactElement {
    const [messages, setMessages]   = useState<Message[]>([WELCOME]);
    const [input, setInput]         = useState<string>('');
    const [loading, setLoading]     = useState<boolean>(false);
    const bottomRef                 = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const send = useCallback(async (): Promise<void> => {
        const prompt = input.trim();
        if (!prompt || loading) return;

        const userMsg: Message = {
            id: String(Date.now()),
            role: 'user',
            content: prompt,
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res  = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });
            const data = await res.json() as { response: string; agentId?: string };

            const agentMsg: Message = {
                id: String(Date.now() + 1),
                role: 'agent',
                content: data.response ?? 'Aucune réponse reçue.',
                agentId: data.agentId,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, agentMsg]);
        } catch {
            setMessages(prev => [...prev, {
                id: String(Date.now() + 1),
                role: 'agent',
                content: 'ERREUR: Connexion au noyau Genesis-Core interrompue.',
                timestamp: Date.now()
            }]);
        } finally {
            setLoading(false);
        }
    }, [input, loading]);

    const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
    }, [send]);

    const isSendDisabled = loading || input.trim().length === 0;

    return (
        <div style={s.root}>
            <div style={s.header}>
                <div style={s.dot} />
                <span style={s.title}>GENESIS-CORE CHAT INTERFACE</span>
            </div>

            <div style={s.messages}>
                {messages.map(m => <ChatMessage key={m.id} message={m} />)}
                {loading && (
                    <div style={{ padding: '8px 0', color: '#6b6b90', fontSize: '13px', fontStyle: 'italic' }}>
                        Agent en cours de traitement...
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <div style={s.inputRow}>
                <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="Décrivez votre tâche ou créez un nouvel agent..."
                    rows={1}
                    style={s.input}
                    disabled={loading}
                />
                <button
                    onClick={send}
                    disabled={isSendDisabled}
                    style={{ ...s.sendBtn, opacity: isSendDisabled ? 0.4 : 1 }}
                >
                    {loading ? '...' : 'Envoyer'}
                </button>
            </div>
        </div>
    );
}
