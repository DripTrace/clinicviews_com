// 3.1 (audio logs don't go away after hangup)
import { InboundMessage, ResponseMessage } from "../sip-message";
import { randomInt } from "../utils";
import type Softphone from "../softphone";
import CallSession from ".";

class InboundCallSession extends CallSession {
    constructor(softphone: Softphone, inviteMessage: InboundMessage) {
        super(softphone, inviteMessage);
        this.localPeer = inviteMessage.headers.To;
        this.remotePeer = inviteMessage.headers.From;
    }

    public async answer() {
        const answerSDP = `
v=0
o=- ${randomInt()} 0 IN IP4 127.0.0.1
s=rc-softphone-ts
c=IN IP4 127.0.0.1
t=0 0
m=audio ${randomInt()} RTP/AVP 0 101
a=rtpmap:0 PCMU/8000
a=rtpmap:101 telephone-event/8000
a=fmtp:101 0-15
a=sendrecv
`.trim();
        const newMessage = new ResponseMessage(
            this.sipMessage,
            200,
            {
                "Content-Type": "application/sdp",
            },
            answerSDP
        );
        this.softphone.send(newMessage);

        await this.startLocalServices();
    }
}

export default InboundCallSession;
// 3.1
