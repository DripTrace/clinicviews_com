// // import { NextApiRequest, NextApiResponse } from "next";
// // import { ElevenLabsClient } from "elevenlabs";
// // import { createWriteStream } from "fs";
// // import { v4 as uuid } from "uuid";
// // import path from "path";

// // const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

// // const client = new ElevenLabsClient({
// //     apiKey: ELEVENLABS_API_KEY,
// // });

// // export default async function handler(
// //     req: NextApiRequest,
// //     res: NextApiResponse
// // ) {
// //     if (req.method !== "POST") {
// //         return res.status(405).json({ error: "Method not allowed" });
// //     }

// //     const { callerNumber } = req.body;

// //     const phoneNumber = callerNumber.remoteNumber;
// //     // const phoneNumber = "9092895924";

// //     console.log("remote number: >>> \n", phoneNumber);

// //     if (!phoneNumber) {
// //         return res.status(400).json({ error: "Phone number is required" });
// //     }

// //     const greetingText = `Welcome to the Loma Linda Psychiatric Medical Group. I see that I'm being called from ${phoneNumber}.
// //     We're here to assist you with your mental health needs. Please briefly describe the reason for your call.
// //     Are you a new or returning patient? Do you need help with billing, appointments, prescriptions, or general information?
// //     Your well-being is our priority, and we're here to provide the support you need.`;

// //     try {
// //         const audio = await client.generate({
// //             voice: "Rachel",
// //             model_id: "eleven_turbo_v2",
// //             text: greetingText,
// //         });

// //         const fileName = `${uuid()}.mp3`;
// //         const filePath = path.join(
// //             process.cwd(),
// //             "public",
// //             "llpmg",
// //             "audio",
// //             fileName
// //         );
// //         console.log("creating audio: ", filePath);
// //         const fileStream = createWriteStream(filePath);

// //         await new Promise((resolve, reject) => {
// //             audio.pipe(fileStream);
// //             fileStream.on("finish", resolve);
// //             fileStream.on("error", reject);
// //         });

// //         res.status(200).json({ audioUrl: `/llpmg/audio/${fileName}` });
// //     } catch (error) {
// //         console.error("Error generating audio:", error);
// //         res.status(500).json({ error: "Failed to generate audio greeting" });
// //     }
// // }

// import { NextApiRequest, NextApiResponse } from "next";
// import { ElevenLabsClient } from "elevenlabs";
// import { createWriteStream } from "fs";
// import { v4 as uuid } from "uuid";
// import path from "path";

// const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

// const client = new ElevenLabsClient({
//     apiKey: ELEVENLABS_API_KEY,
// });

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     if (req.method !== "POST") {
//         return res.status(405).json({ error: "Method not allowed" });
//     }

//     const { callerNumber } = req.body;

//     console.log("Received callerNumber object:", callerNumber);

//     const phoneNumber = callerNumber?.remoteNumber;

//     console.log("Extracted phone number:", phoneNumber);

//     if (!phoneNumber) {
//         return res.status(400).json({ error: "Phone number is required" });
//     }

//     const greetingText = `Welcome to the Loma Linda Psychiatric Medical Group. I see that I'm being called from ${phoneNumber}.
//     We're here to assist you with your mental health needs. Please briefly describe the reason for your call.
//     Are you a new or returning patient? Do you need help with billing, appointments, prescriptions, or general information?
//     Your well-being is our priority, and we're here to provide the support you need.`;

//     try {
//         const audio = await client.generate({
//             voice: "Rachel",
//             model_id: "eleven_turbo_v2",
//             text: greetingText,
//         });

//         const fileName = `${uuid()}.mp3`;
//         const filePath = path.join(
//             process.cwd(),
//             "public",
//             "llpmg",
//             "audio",
//             fileName
//         );
//         console.log("Creating audio file:", filePath);
//         const fileStream = createWriteStream(filePath);

//         await new Promise((resolve, reject) => {
//             audio.pipe(fileStream);
//             fileStream.on("finish", resolve);
//             fileStream.on("error", reject);
//         });

//         console.log("Audio file created successfully");
//         res.status(200).json({ audioUrl: `/llpmg/audio/${fileName}` });
//     } catch (error) {
//         console.error("Error generating audio:", error);
//         res.status(500).json({ error: "Failed to generate audio greeting" });
//     }
// }

import { NextApiRequest, NextApiResponse } from "next";
import { ElevenLabsClient } from "elevenlabs";
import fs, { createWriteStream, unlink } from "fs";
import { v4 as uuid } from "uuid";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import OpenAI from "openai";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

const client = new ElevenLabsClient({
    apiKey: ELEVENLABS_API_KEY,
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

interface RemoteCaller {
    remoteCaller: {
        remoteNumber: string;
        // {
        // callerNumber: string;
        // };
    };
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { remoteCaller }: RemoteCaller = req.body;
    console.log("REQUEST BODY: >>>>\n", req.body);

    const phoneNumber = remoteCaller.remoteNumber;

    console.log("CALLER PHONE NUMBER: >>>>\n", phoneNumber);

    if (!phoneNumber) {
        return res.status(400).json({ error: "Phone number is required" });
    }

    const greetingText = `Welcome to Loma Linda Psychiatric Medical Group. I see that I'm being called from ${phoneNumber}.
    We're here to assist you with your mental health needs. Please briefly describe the reason for your call.
    Are you a new or returning patient? Do you need help with billing, appointments, prescriptions, or general information?
    Your well-being is our priority, and we're here to provide the support you need.`;

    // const greetingText = `Welcome to Loma Linda Psychiatric Medical Group, ${phoneNumber}`;

    try {
        // const audio = await client.generate({
        //     voice: "Rachel",
        //     model_id: "eleven_turbo_v2",
        //     text: greetingText,
        // });

        const audio = await openai.audio.speech.create({
            // model: "tts-1",
            model: "tts-1-hd",
            voice: "nova",
            input: greetingText,
        });

        const buffer = Buffer.from(await audio.arrayBuffer());

        console.log("returned audio: >>>>\n", audio);

        // Save the file as an MP3 initially
        const mp3FileName = `${uuid()}.mp3`;
        const mp3FilePath = path.join(
            process.cwd(),
            "public",
            "llpmg",
            "audio",
            mp3FileName
        );

        await fs.promises.writeFile(mp3FilePath, buffer);

        // const mp3FileStream = createWriteStream(mp3FilePath);

        // audio.stream_to_file(mp3FilePath)

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
            ffmpeg(mp3FilePath)
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
            greetingText: greetingText,
        });
    } catch (error) {
        console.error("Error generating or converting audio:", error);
        res.status(500).json({
            error: "Failed to generate or convert audio greeting",
        });
    }
}

// import { NextApiRequest, NextApiResponse } from "next";
// import { ElevenLabsClient } from "elevenlabs";
// import { createWriteStream, unlink } from "fs";
// import { v4 as uuid } from "uuid";
// import path from "path";
// import ffmpeg from "fluent-ffmpeg";

// const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

// const client = new ElevenLabsClient({
//     apiKey: ELEVENLABS_API_KEY,
//     });
//     export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
//     ) {
//     if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//     }
//     const { callerNumber } = req.body;

// if (!callerNumber) {
//     return res.status(400).json({ error: "Caller number is required" });
// }

// const greetingText = `Welcome to the Loma Linda Psychiatric Medical Group. I see that I'm being called from ${callerNumber}.
// We're here to assist you with your mental health needs. Please briefly describe the reason for your call.
// Are you a new or returning patient? Do you need help with billing, appointments, prescriptions, or general information?
// Your well-being is our priority, and we're here to provide the support you need.`;

// try {
//     const audio = await client.generate({
//         voice: "Rachel",
//         model_id: "eleven_turbo_v2",
//         text: greetingText,
//     });

//     const oggFileName = `${uuid()}.ogg`;
//     const oggFilePath = path.join(
//         process.cwd(),
//         "public",
//         "llpmg",
//         "audio",
//         oggFileName
//     );

//     const oggFileStream = createWriteStream(oggFilePath);

//     await new Promise((resolve, reject) => {
//         audio.pipe(oggFileStream);
//         oggFileStream.on("finish", resolve);
//         oggFileStream.on("error", reject);
//     });

//     console.log("Greeting audio generated and saved:", oggFilePath);

//     res.status(200).json({ audioUrl: `/llpmg/audio/${oggFileName}` });
// } catch (error) {
//     console.error("Error generating audio greeting:", error);
//     res.status(500).json({
//         error: "Failed to generate audio greeting",
//     });
// }}
// export const config = {
// api: {
// bodyParser: {
// sizeLimit: "10mb",
// },
// },
// };
