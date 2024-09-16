// // pages/api/llpmg/speech-to-text.ts
// import { NextApiRequest, NextApiResponse } from "next";
// import OpenAI from "openai";
// import fs from "fs";
// import path from "path";
// import { v4 as uuidv4 } from "uuid";

// // Initialize the OpenAI client
// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     // Ensure the request method is POST
//     if (req.method !== "POST") {
//         return res.status(405).json({ error: "Method Not Allowed" });
//     }

//     // Check if the OpenAI API key is configured
//     if (!openai.apiKey) {
//         return res.status(500).json({ error: "OpenAI API key not configured" });
//     }

//     try {
//         const { audio } = req.body;

//         if (!audio) {
//             return res.status(400).json({ error: "Audio data is required" });
//         }

//         // Convert the Base64 audio data back to a Buffer
//         const audioBuffer = Buffer.from(audio, "base64");

//         // Save the buffer to a temporary file
//         const tempFileName = `${uuidv4()}.webm`;
//         const tempFilePath = path.join("/tmp", tempFileName);
//         fs.writeFileSync(tempFilePath, audioBuffer);

//         // Use OpenAI's Whisper model to transcribe the audio
//         const response = await openai.audio.transcriptions.create({
//             file: fs.createReadStream(tempFilePath),
//             model: "whisper-1",
//         });

//         // Remove the temporary file
//         fs.unlinkSync(tempFilePath);

//         // Extract the transcribed text from the response
//         const transcribedText = response.text;

//         // Return the transcribed text
//         res.status(200).json({ result: transcribedText });
//     } catch (error) {
//         console.error("Error in speech-to-text conversion:", error);
//         res.status(500).json({
//             error: "An error occurred during speech-to-text conversion",
//         });
//     }
// }

// // Configure API route to handle larger payloads
// export const config = {
//     api: {
//         bodyParser: {
//             sizeLimit: "10mb", // Adjust this value based on your needs
//         },
//     },
// };

// claude
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    if (!openai.apiKey) {
        return res.status(500).json({ error: "OpenAI API key not configured" });
    }

    try {
        const { audio } = req.body;

        if (!audio) {
            return res.status(400).json({ error: "Audio data is required" });
        }

        const audioBuffer = Buffer.from(audio, "base64");
        const tempFileName = `${uuidv4()}.webm`;
        const tempFilePath = path.join("/tmp", tempFileName);
        fs.writeFileSync(tempFilePath, audioBuffer);

        const response = await openai.audio.transcriptions.create({
            file: fs.createReadStream(tempFilePath),
            model: "whisper-1",
        });

        fs.unlinkSync(tempFilePath);

        const transcribedText = response.text;

        res.status(200).json({ result: transcribedText });
    } catch (error) {
        console.error("Error in speech-to-text conversion:", error);
        res.status(500).json({
            error: "An error occurred during speech-to-text conversion",
            details: (error as Error).message,
        });
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "10mb",
        },
    },
};
