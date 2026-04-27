// Genesis-Core WebSocket Service
// Classification: OMEGA-CORE

export class SwarmSocket {
    private url: string;
    public isConnected: boolean = false;
    private _ws: WebSocket | null = null;

    constructor(url: string) {
        this.url = url;
    }

    connect(onMessage: (data: string) => void, onError?: (err: Event) => void): boolean {
        if (!this.url.startsWith('ws://') && !this.url.startsWith('wss://')) {
            throw new Error('Invalid WebSocket Protocol. Must be ws:// or wss://');
        }

        this._ws = new WebSocket(this.url);

        this._ws.onopen = () => {
            this.isConnected = true;
            console.log(`[WSS] Connected to Genesis-Core at ${this.url}`);
        };

        this._ws.onmessage = (event) => {
            onMessage(event.data);
        };

        this._ws.onerror = (event) => {
            console.error('[WSS] Connection error:', event);
            if (onError) onError(event);
        };

        this._ws.onclose = () => {
            this.isConnected = false;
            console.log('[WSS] Connection closed.');
        };

        return true;
    }

    disconnect(): void {
        if (this._ws) {
            this._ws.close();
            this._ws = null;
        }
        this.isConnected = false;
        console.log('[WSS] Connection terminated.');
    }
}
