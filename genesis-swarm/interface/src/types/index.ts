// Genesis-Core | Shared Types
export interface Message {
    id: string;
    role: 'user' | 'agent';
    content: string;
    agentId?: string;
    timestamp: number;
}

export interface AgentNode {
    id: string;
    status: 'ONLINE' | 'BUSY' | 'ERROR' | 'SLEEPING';
    currentTask: string;
    cpuUsage: number;
    memoryMb: number;
}
