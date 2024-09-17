// [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt
// ServerWebSocketWrapper.ts

import WebSocket from 'ws';

export class ServerWebSocketWrapper {
    private ws: WebSocket;

    constructor(ws: WebSocket) {
        this.ws = ws;
    }

    send(data: WebSocket.Data) {
        this.ws.send(data);
    }

    close() {
        this.ws.close();
    }

    on(event: string, listener: (...args: any[]) => void) {
        this.ws.on(event, listener);
    }

    removeListener(event: string, listener: (...args: any[]) => void) {
        this.ws.removeListener(event, listener);
    }
}
// [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt (final no linting errors)