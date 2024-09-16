// // src/pages/api/llpmg/generate-conversation.ts

// import { NextApiRequest, NextApiResponse } from "next";
// import { ElevenLabsClient } from "elevenlabs";
// import { v4 as uuidv4 } from "uuid";
// import path from "path";
// import { createWriteStream, unlink } from "fs";

// // Initialize ElevenLabs client
// const client = new ElevenLabsClient({
//     apiKey: process.env.ELEVENLABS_API_KEY,
// });

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     if (req.method !== "POST") {
//         return res.status(405).json({ error: "Method not allowed" });
//     }

//     try {
//         const { text } = req.body;

//         if (!text) {
//             return res.status(400).json({ error: "Text is required" });
//         }

//         // Generate speech audio using ElevenLabs API
//         const audio = await client.generate({
//             voice: "Rachel",
//             model_id: "eleven_turbo_v2",
//             text: text,
//         });

//         const oggFileName = `${uuidv4()}.ogg`;
//         const oggFilePath = path.join(
//             process.cwd(),
//             "public",
//             "llpmg",
//             "audio",
//             oggFileName
//         );
//         const fileStream = createWriteStream(oggFilePath);

//         await new Promise((resolve, reject) => {
//             audio.pipe(fileStream);
//             fileStream.on("finish", resolve);
//             fileStream.on("error", reject);
//         });

//         // Return the URL to the generated speech audio
//         res.status(200).json({
//             audioUrl: `/llpmg/audio/${oggFileName}`,
//         });
//     } catch (error) {
//         console.error("Error in generate-conversation:", error);
//         res.status(500).json({
//             error: "Failed to generate speech audio for the conversation",
//         });
//     }
// }

// claude
// import { NextApiRequest, NextApiResponse } from "next";
// import { ElevenLabsClient } from "elevenlabs";
// import { v4 as uuidv4 } from "uuid";
// import path from "path";
// import fs from "fs";
// import { promisify } from "util";
// import { Readable } from "stream";

// const writeFile = promisify(fs.writeFile);

// const client = new ElevenLabsClient({
//     apiKey: process.env.ELEVENLABS_API_KEY,
// });

// interface GenerateRequest {
//     text: string;
// }

// interface GenerateResponse {
//     audioUrl: string;
//     suggestionText: GenerateRequest["text"];
// }

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse<GenerateResponse | { error: string; details?: string }>
// ) {
//     if (req.method !== "POST") {
//         return res.status(405).json({ error: "Method not allowed" });
//     }

//     try {
//         const { text } = req.body as GenerateRequest;

//         console.log(
//             "REQUEST BODY FROM GENERATE CONVERSATION: >>>>\n",
//             req.body
//         );

//         if (!text) {
//             return res.status(400).json({ error: "Text is required" });
//         }

//         console.log("CREATING UPDATE FOR CONVERSATION: >>>>\n");

//         const audio = await client.generate({
//             voice: "Rachel",
//             model_id: "eleven_turbo_v2",
//             text: text,
//         });

//         const oggFileName = `${uuidv4()}.ogg`;
//         const oggFilePath = path.join(
//             process.cwd(),
//             "public",
//             "llpmg",
//             "audio",
//             oggFileName
//         );

//         console.log("CONVERSATION AUDIO SAVED AS: >>>>\n", oggFilePath);

//         const audioBuffer = await new Promise<Buffer>((resolve, reject) => {
//             const chunks: Buffer[] = [];
//             (audio as Readable).on("data", (chunk: Buffer) =>
//                 chunks.push(chunk)
//             );
//             (audio as Readable).on("end", () => resolve(Buffer.concat(chunks)));
//             (audio as Readable).on("error", reject);
//         });

//         await writeFile(oggFilePath, audioBuffer);

//         console.log("AUDIO FILE SAVED WITH FILE NAME: >>>>", oggFileName);

//         res.status(200).json({
//             audioUrl: `/llpmg/audio/${oggFileName}`,
//             suggestionText: text,
//         });
//     } catch (error) {
//         console.error("Error in generate-conversation:", error);
//         res.status(500).json({
//             error: "Failed to generate speech audio for the conversation",
//             details: (error as Error).message,
//         });
//     }
// }

// export const config = {
//     api: {
//         bodyParser: {
//             sizeLimit: "10mb",
//         },
//     },
// };

import { NextApiRequest, NextApiResponse } from "next";
import { ElevenLabsClient } from "elevenlabs";
// import { v4 as uuidv4 } from "uuid";
import { v4 as uuid } from "uuid";
import path from "path";
import fs, { createWriteStream, unlink } from "fs";
import { promisify } from "util";
import { Readable } from "stream";
import Ffmpeg from "fluent-ffmpeg";
import OpenAI from "openai";

const writeFile = promisify(fs.writeFile);

const client = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

interface GenerateRequest {
    text: string;
}

interface GenerateResponse {
    audioUrl: string;
    suggestionText: GenerateRequest["text"];
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<GenerateResponse | { error: string; details?: string }>
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { text } = req.body as GenerateRequest;

        console.log(
            "REQUEST BODY FROM GENERATE CONVERSATION: >>>>\n",
            req.body
        );

        if (!text) {
            return res.status(400).json({ error: "Text is required" });
        }

        console.log("CREATING UPDATE FOR CONVERSATION: >>>>\n");

        // const audio = await client.generate({
        //     voice: "Rachel",
        //     model_id: "eleven_turbo_v2",
        //     text: text,
        // });

        const audio = await openai.audio.speech.create({
            // model: "tts-1",
            model: "tts-1-hd",
            voice: "nova",
            input: text,
        });

        const mp3FileName = `${uuid()}.mp3`;
        const mp3FilePath = path.join(
            process.cwd(),
            "public",
            "llpmg",
            "audio",
            mp3FileName
        );

        // const mp3FileStream = createWriteStream(mp3FilePath);

        const buffer = Buffer.from(await audio.arrayBuffer());
        await fs.promises.writeFile(mp3FilePath, buffer);

        // audio.stream_to_file(mp3FileName)

        // const audioBuffer = await new Promise<Buffer>((resolve, reject) => {
        //     const chunks: Buffer[] = [];
        //     (audio as Readable).on("data", (chunk: Buffer) =>
        //         chunks.push(chunk)
        //     );
        //     (audio as Readable).on("end", () => resolve(Buffer.concat(chunks)));
        //     (audio as Readable).on("error", reject);
        // });

        // await writeFile(oggFilePath, audioBuffer);

        // console.log("AUDIO FILE SAVED WITH FILE NAME: >>>>", oggFileName);

        // await new Promise((resolve, reject) => {
        //     audio.pipe(mp3FileStream);
        //     mp3FileStream.on("finish", resolve);
        //     mp3FileStream.on("error", reject);
        // });

        // Now convert the MP3 file to OGG using FFmpeg
        const oggFileName = `${uuid()}.ogg`;
        const oggFilePath = path.join(
            process.cwd(),
            "public",
            "llpmg",
            "audio",
            oggFileName
        );

        await new Promise((resolve, reject) => {
            Ffmpeg(mp3FilePath)
                .toFormat("ogg")
                .on("end", resolve)
                .on("error", reject)
                .save(oggFilePath);
        });

        // Optionally, you can delete the original MP3 file if you don't need it
        unlink(mp3FilePath, (err) => {
            if (err) {
                console.error("Error deleting original MP3 file:", err);
            }
        });

        res.status(200).json({
            audioUrl: `/llpmg/audio/${oggFileName}`,
            suggestionText: text,
        });
    } catch (error) {
        console.error("Error in generate-conversation:", error);
        res.status(500).json({
            error: "Failed to generate speech audio for the conversation",
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
