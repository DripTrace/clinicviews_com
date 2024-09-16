// src/pages/api/llpmg/update-conversation.ts

import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import path from "path";

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { audio } = req.body;

        console.log("REQUEST BODY FROM UPDATE CONVERSATION: >>>>\n", req.body);

        if (!audio) {
            return res.status(400).json({ error: "Audio data is required" });
        }

        // Convert base64 audio to buffer and save it temporarily
        const audioBuffer = Buffer.from(audio, "base64");
        const tempFileName = `${uuidv4()}.webm`;
        const tempFilePath = path.join("/tmp", tempFileName);
        fs.writeFileSync(tempFilePath, audioBuffer);

        // Transcribe audio to text using OpenAI Whisper model
        const response = await openai.audio.transcriptions.create({
            file: fs.createReadStream(tempFilePath),
            model: "whisper-1",
        });

        fs.unlinkSync(tempFilePath);

        // Get transcribed text
        const transcribedText = response.text;

        if (!transcribedText) {
            return res
                .status(500)
                .json({ error: "Failed to transcribe audio" });
        }

        res.status(200).json({ transcription: transcribedText });
    } catch (error) {
        console.error("Error in update-conversation:", error);
        res.status(500).json({
            error: "Failed to transcribe and update conversation",
        });
    }
}

// claude
// import { NextApiRequest, NextApiResponse } from "next";
// import { updateConversationInIndexedDB } from "@/lib/llpmg/idb/convoDB";

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     if (req.method !== "POST") {
//         return res.status(405).json({ error: "Method not allowed" });
//     }

//     try {
//         const { conversation, systemResponse } = req.body;

//         if (!conversation || !systemResponse) {
//             return res
//                 .status(400)
//                 .json({
//                     error: "Conversation and system response are required",
//                 });
//         }

//         // Update the conversation in IndexedDB
//         await updateConversationInIndexedDB(conversation, systemResponse);

//         res.status(200).json({ message: "Conversation updated successfully" });
//     } catch (error) {
//         console.error("Error in update-conversation:", error);
//         res.status(500).json({
//             error: "Failed to update conversation",
//             details: (error as Error).message,
//         });
//     }
// }
