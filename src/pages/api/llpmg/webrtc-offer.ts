import { NextApiRequest, NextApiResponse } from "next";
import Softphone from "@/ref/soft/src/softphone";
import * as mediasoup from "mediasoup";

let softphone: Softphone | null = null;
let worker: mediasoup.types.Worker | null = null;
let router: mediasoup.types.Router | null = null;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        if (!worker) {
            worker = await mediasoup.createWorker({
                logLevel: "warn",
                logTags: ["info", "ice", "dtls", "rtp", "srtp", "rtcp"],
                rtcMinPort: 10000,
                rtcMaxPort: 10100,
            });
            router = await worker.createRouter({
                mediaCodecs: mediasoup.getSupportedRtpCapabilities(),
            });
        }

        if (!softphone) {
            const sipInfo = {
                username: process.env.SIP_INFO_USERNAME!,
                password: process.env.SIP_INFO_PASSWORD!,
                authorizationId: process.env.SIP_INFO_AUTHORIZATION_ID!,
                domain: process.env.SIP_INFO_DOMAIN!,
            };
            softphone = new Softphone(sipInfo);
            await softphone.register();
        }

        const { offer } = req.body;

        try {
            const webRtcTransport = await router!.createWebRtcTransport({
                listenIps: [{ ip: "0.0.0.0", announcedIp: null }],
                enableUdp: true,
                enableTcp: true,
                preferUdp: true,
            });

            await webRtcTransport.setMaxIncomingBitrate(1500000);

            const producer = await webRtcTransport.produce({
                kind: "audio",
                rtpParameters: offer.rtpParameters,
            });

            await softphone!.setAudioProducer(producer);

            const consumer =
                await softphone!.createAudioConsumer(webRtcTransport);

            const answer = {
                sdp: webRtcTransport.iceCandidates
                    .map(
                        (candidate: mediasoup.types.IceCandidate) =>
                            candidate.candidate
                    )
                    .join("\r\n"),
                type: "answer",
            };

            res.status(200).json({
                answer,
                consumerParameters: consumer.rtpParameters,
            });
        } catch (error) {
            console.error("Error handling WebRTC offer:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
