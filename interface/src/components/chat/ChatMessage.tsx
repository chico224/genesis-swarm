'use client';
// Genesis-Core | Chat Message Component — Production
// Author: Oumar Sow

import React from 'react';

export interface Message {
    id: string;
    role: 'user' | 'agent';
    content: string;
    agentId?: string;
    timestamp: number;
}

const avatarBase: React.CSSProperties = {
    width: 36, height: 36, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '14px', fontWeight: 700, flexShrink: 0
};

const bubbleBase: React.CSSProperties = {
    maxWidth: '75%', padding: '10px 16px', borderRadius: '12px',
    fontSize: '14px', lineHeight: '1.6', wordBreak: 'break-word'
};

export function ChatMessage({ message }: { message: Message }): React.ReactElement {
    const isUser = message.role === 'user';

    return (
        <div style={{ display: 'flex', gap: '12px', padding: '10px 0', alignItems: 'flex-start', flexDirection: isUser ? 'row-reverse' : 'row' }}>
            <div style={{
                ...avatarBase,
                background: isUser ? '#00ffc820' : '#7b2fff20',
                color:      isUser ? '#00ffc8'   : '#9b5fff',
                border: `1px solid ${isUser ? '#00ffc840' : '#7b2fff40'}`
            }}>
                {isUser ? 'U' : '⚡'}
            </div>

            <div style={{
                ...bubbleBase,
                background: isUser ? '#00ffc810' : '#12121e',
                border: `1px solid ${isUser ? '#00ffc830' : '#1f1f35'}`,
                color: '#e2e2f0',
                alignSelf: isUser ? 'flex-end' : 'flex-start'
            }}>
                {!isUser && (
                    <div style={{ fontSize: '11px', color: '#6b6b90', marginBottom: 6 }}>
                        AGENT {message.agentId ?? 'OMEGA'}
                    </div>
                )}
                <p style={{ margin: 0 }}>{message.content}</p>
                <div style={{ fontSize: '10px', color: '#6b6b90', marginTop: 6, textAlign: 'right' }}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                </div>
            </div>
        </div>
    );
}
