import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        const { text } = req.body;

        try {
            const response = await fetch(
                `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
                {
                    method: "POST",
                    headers: {
                        Accept: "audio/mpeg",
                        "Content-Type": "application/json",
                        "xi-api-key": process.env.ELEVENLABS_API_KEY!,
                    },
                    body: JSON.stringify({
                        text,
                        model_id: "eleven_monolingual_v1",
                        voice_settings: {
                            stability: 0.5,
                            similarity_boost: 0.5,
                        },
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to generate audio");
            }

            const audioBuffer = await response.arrayBuffer();
            res.setHeader("Content-Type", "audio/mpeg");
            res.send(Buffer.from(audioBuffer));
        } catch (error) {
            console.error("Error generating audio:", error);
            res.status(500).json({ error: "Failed to generate audio" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
