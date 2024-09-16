// splitting to server and client websockets

// // added on [broken outgoing calls, continuing, but latest working is sonnet-3.5 2nd attempt] sonnet-3.5 3rd attempt for rewrite
// import WebSocket from 'ws';

// // still on 3rd
// type SendData = string | Buffer | ArrayBuffer | SharedArrayBuffer;
// // still on 3rd


// export class WebSocketWrapper {
//     private ws: WebSocket | globalThis.WebSocket;

//     constructor(ws: WebSocket | globalThis.WebSocket) {
//         this.ws = ws;
//     }

//     // still 3rd
//     // send(data: string | Buffer): void {
//     //     this.ws.send(data);
//     // }

//     // close(): void {
//     //     this.ws.close();
//     // }

//     // on(event: string, listener: (...args: any[]) => void): void {
//     //     if (this.ws instanceof WebSocket) {
//     //         this.ws.on(event, listener);
//     //     } else {
//     //         (this.ws as any)['on' + event] = listener;
//     //     }
//     // }

//     // removeListener(event: string, listener: (...args: any[]) => void): void {
//     //     if (this.ws instanceof WebSocket) {
//     //         this.ws.removeListener(event, listener);
//     //     } else {
//     //         (this.ws as any)['on' + event] = null;
//     //     }
//     // }

//     send(data: SendData): void {
//         if (this.ws instanceof WebSocket) {
//             this.ws.send(data);
//         } else {
//             (this.ws as globalThis.WebSocket).send(data);
//         }
//     }

//     close(): void {
//         this.ws.close();
//     }

//     on(event: string, listener: (...args: any[]) => void): void {
//         if (this.ws instanceof WebSocket) {
//             this.ws.on(event, listener);
//         } else {
//             (this.ws as any)['on' + event] = listener;
//         }
//     }

//     removeListener(event: string, listener: (...args: any[]) => void): void {
//         if (this.ws instanceof WebSocket) {
//             this.ws.removeListener(event, listener);
//         } else {
//             (this.ws as any)['on' + event] = null;
//         }
//     }

//     // Add additional methods to match WebSocket interface as needed
//     get readyState(): number {
//         return this.ws.readyState;
//     }

//     // Add any other properties or methods you need from WebSocket
//     // still 3rd
// }

// brough back for 3rd
// WebSocketWrapper.ts (or ServerWebSocketWrapper.ts)

import WebSocket from 'ws';

export class WebSocketWrapper {
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