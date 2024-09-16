// out (didn't make copy)
// declare module "@/ref/soft/src/softphone" {
//     export interface InboundMessage {
//         subject: string;
//         headers: Record<string, string>;
//         body: string;
//     }

//     export interface CallSession {
//         terminate(): Promise<void>;
//     }

//     export default class Softphone {
//         constructor(sipInfo: any);
//         enableDebugMode(): void;
//         register(): Promise<void>;
//         call(number: number): Promise<CallSession>;
//         answer(inviteMessage: InboundMessage): Promise<void>;
//         decline(inviteMessage: InboundMessage): Promise<void>;
//         on(event: string, callback: (message: InboundMessage) => void): void;
//         lastInviteMessage?: InboundMessage;
//         currentCallSession?: CallSession;
//     }
// }
