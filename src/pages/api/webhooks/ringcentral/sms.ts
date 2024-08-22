// // import { ringCentralClient } from "@/lib/ringcentralClient";
// // import type { NextApiRequest, NextApiResponse } from "next";

// // interface MessageDetails {
// //     id: string;
// //     from: { phoneNumber: string };
// //     to: Array<{ phoneNumber: string }>;
// //     subject: string;
// //     direction: "Inbound" | "Outbound";
// //     // Add other properties as needed
// // }

// // // In-memory storage for team IDs (replace with a database in production)
// // const teamIds: { [key: string]: string } = {};

// // async function getMessageDetails(messageId: string): Promise<MessageDetails> {
// //     console.log(`Getting message details for ID: ${messageId}`);
// //     try {
// //         await ringCentralClient.login({ jwt: process.env.RC_JWT });
// //         const response = await ringCentralClient.get(
// //             `/restapi/v1.0/account/~/extension/~/message-store/${messageId}`
// //         );
// //         const data = await response.json();
// //         console.log(
// //             `Message details retrieved:`,
// //             JSON.stringify(data, null, 2)
// //         );
// //         return data;
// //     } catch (error) {
// //         console.error(`Error getting message details:`, error);
// //         throw error;
// //     }
// // }

// // async function sendTeamMessage(teamId: string, text: string): Promise<void> {
// //     console.log(`Sending message to team ${teamId}:`, text);
// //     try {
// //         await ringCentralClient.login({ jwt: process.env.RC_JWT });
// //         const response = await ringCentralClient.post(
// //             `/team-messaging/v1/chats/${teamId}/posts`,
// //             {
// //                 text: text,
// //             }
// //         );
// //         console.log(`Message sent to team`);
// //     } catch (error) {
// //         console.error(`Error sending team message:`, error);
// //         throw error;
// //     }
// // }

// // async function handleNewMessage(messageDetails: MessageDetails) {
// //     const newMessageDetails = JSON.stringify(messageDetails, null, 2);

// //     console.log("Handling new message:", newMessageDetails);
// //     const { from, to, subject } = messageDetails;
// //     const fromNumber = from.phoneNumber;
// //     const toNumber = to[0].phoneNumber;

// //     if (
// //         fromNumber === process.env.RC_PHONE_NUMBER &&
// //         toNumber === process.env.RC_PHONE_NUMBER
// //     ) {
// //         console.log("Internal message, ignoring");
// //         return;
// //     }

// //     const teamId =
// //         teamIds[`${fromNumber}-${toNumber}`] ||
// //         teamIds[`${toNumber}-${fromNumber}`];

// //     if (!teamId) {
// //         console.error(
// //             "No team found for this conversation. Team should have been created during registration."
// //         );
// //         return;
// //     }

// //     try {
// //         await sendTeamMessage(teamId, `${fromNumber}: ${subject}`);
// //         console.log(`Message forwarded to team: ${teamId}`);
// //     } catch (error) {
// //         console.error("Error forwarding message to team:", error);
// //         throw error;
// //     }
// // }

// // export default async function handler(
// //     req: NextApiRequest,
// //     res: NextApiResponse
// // ) {
// //     console.log(`Received ${req.method} request`);
// //     console.log(`Headers:`, JSON.stringify(req.headers, null, 2));
// //     console.log(`Body:`, JSON.stringify(req.body, null, 2));

// //     if (req.method === "POST") {
// //         const validationToken = req.headers["validation-token"];

// //         if (validationToken) {
// //             console.log(`Received validation token: ${validationToken}`);
// //             res.setHeader("Validation-Token", validationToken as string);
// //             return res.status(200).send("OK");
// //         }

// //         const messageData = req.body;

// //         if (messageData && messageData.body && messageData.body.changes) {
// //             try {
// //                 for (const change of messageData.body.changes) {
// //                     // console.log(
// //                     //     "Processing change:",
// //                     //     JSON.stringify(change, null, 2)
// //                     // );

// //                     // const messageId = change.newMessageId || change.messageId;
// //                     // if (!messageId) {
// //                     //     console.error("Message ID is undefined");
// //                     //     continue;
// //                     // }
// //                     // console.log(
// //                     //     `Processing change:`,
// //                     //     JSON.stringify(change, null, 2)
// //                     // );
// //                     // const messageId = change.newMessageId || change.messageId;
// //                     // if (!messageId) {
// //                     //     console.error("Message ID is undefined");
// //                     //     continue;
// //                     // }

// //                     // const messageDetails = await getMessageDetails(messageId);
// //                     // await handleNewMessage(messageDetails);
// //                     const changedObject = JSON.stringify(change, null, 2);
// //                     console.log(
// //                         "Change object:",
// //                         JSON.stringify(change, null, 2)
// //                     );

// //                     const newMessageDetails = JSON.parse(changedObject);
// //                     console.log("New message details:", newMessageDetails);
// //                     const retrievedMessageIDs = newMessageDetails.newMessageIds;
// //                     console.log("Retrieved message IDs:", retrievedMessageIDs);
// //                     const retrievedMessageID = retrievedMessageIDs[0];
// //                     console.log(
// //                         `Retrieved message ID 0: ${retrievedMessageID}`
// //                     );
// //                     const messageIDDetails =
// //                         await getMessageDetails(retrievedMessageID);
// //                     console.log("Message ID details:", messageIDDetails);

// //                     // await handleNewMessage(retrievedMessageID);
// //                     await handleNewMessage(messageIDDetails);

// //                     const messageDetails =
// //                         await getMessageDetails(retrievedMessageID);
// //                     await handleNewMessage(messageDetails);
// //                 }
// //                 console.log(`Message processed successfully`);
// //                 res.status(200).json({ status: "Message processed" });
// //             } catch (error) {
// //                 console.error("Error processing message:", error);
// //                 res.status(500).json({
// //                     error: "Failed to process message",
// //                     details: error,
// //                 });
// //             }
// //         } else {
// //             console.error("Invalid message data");
// //             res.status(400).json({ error: "Invalid message data" });
// //         }
// //     } else {
// //         console.log(`Method ${req.method} not allowed`);
// //         res.setHeader("Allow", ["POST"]);
// //         res.status(405).end(`Method ${req.method} Not Allowed`);
// //     }
// // }

// import type { NextApiRequest, NextApiResponse } from "next";
// import { ringCentralClient } from "@/lib/ringcentralClient";

// interface MessageDetails {
//     id: string;
//     from: { phoneNumber: string };
//     to: Array<{ phoneNumber: string }>;
//     subject: string;
//     direction: "Inbound" | "Outbound";
// }

// // const conversations: {
// //     [key: string]: { patientNumber: string; doctorNumber: string };
// // } = {};

// async function getMessageDetails(messageId: string): Promise<MessageDetails> {
//     try {
//         await ringCentralClient.login({ jwt: process.env.RC_JWT });
//         const response = await ringCentralClient.get(
//             `/restapi/v1.0/account/~/extension/~/message-store/${messageId}`
//         );
//         return await response.json();
//     } catch (error) {
//         console.error(`Error getting message details:`, error);
//         throw error;
//     }
// }

// interface Conversation {
//     patientNumber: string;
//     doctorNumber: string;
// }

// // Use a more descriptive name for the global object
// const activeConversations: { [key: string]: Conversation } = {};

// function createOrUpdateConversation(
//     patientNumber: string,
//     doctorNumber: string
// ): string {
//     const conversationId = `${patientNumber}-${doctorNumber}`;
//     activeConversations[conversationId] = { patientNumber, doctorNumber };
//     console.log(`Conversation created/updated: ${conversationId}`);
//     return conversationId;
// }

// async function sendSMS(to: string, message: string) {
//     try {
//         await ringCentralClient.login({ jwt: process.env.RC_JWT });
//         await ringCentralClient.post(
//             "/restapi/v1.0/account/~/extension/~/sms",
//             {
//                 from: { phoneNumber: process.env.RC_PHONE_NUMBER },
//                 to: [{ phoneNumber: to }],
//                 text: message,
//             }
//         );
//     } catch (error) {
//         console.error("Error sending SMS:", error);
//         throw error;
//     }
// }

// // async function handleNewMessage(messageDetails: MessageDetails) {
// //     const { from, to, subject } = messageDetails;
// //     const fromNumber = from.phoneNumber;
// //     const toNumber = to[0].phoneNumber;

// //     if (fromNumber === process.env.RC_PHONE_NUMBER) {
// //         console.log("Outbound message, ignoring");
// //         return;
// //     }

// //     // Find the conversation this message belongs to
// //     const conversationId = Object.keys(conversations).find(
// //         (id) =>
// //             conversations[id].patientNumber === fromNumber ||
// //             conversations[id].doctorNumber === fromNumber
// //     );

// //     if (!conversationId) {
// //         console.error("No conversation found for this message");
// //         return;
// //     }

// //     const conversation = conversations[conversationId];
// //     const recipientNumber =
// //         fromNumber === conversation.patientNumber
// //             ? conversation.doctorNumber
// //             : conversation.patientNumber;

// //     // Forward the message
// //     await sendSMS(recipientNumber, `(${conversationId}) ${subject}`);
// // }

// async function handleNewMessage(messageDetails: MessageDetails) {
//     const { from, to, subject } = messageDetails;
//     const fromNumber = from.phoneNumber;
//     const toNumber = to[0].phoneNumber;

//     if (fromNumber === process.env.RC_PHONE_NUMBER) {
//         console.log("Outbound message, ignoring");
//         return;
//     }

//     // Find the conversation this message belongs to
//     const conversationId = Object.keys(activeConversations).find(
//         (id) =>
//             activeConversations[id].patientNumber === fromNumber ||
//             activeConversations[id].doctorNumber === fromNumber
//     );

//     if (!conversationId) {
//         console.error("No conversation found for this message");
//         return;
//     }

//     const conversation = activeConversations[conversationId];
//     const recipientNumber =
//         fromNumber === conversation.patientNumber
//             ? conversation.doctorNumber
//             : conversation.patientNumber;

//     // Forward the message
//     await sendSMS(recipientNumber, `(${conversationId}) ${subject}`);
// }

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     console.log(
//         `Webhook received ${req.method} request at ${new Date().toISOString()}`
//     );
//     console.log("Headers:", JSON.stringify(req.headers, null, 2));
//     console.log("Body:", JSON.stringify(req.body, null, 2));

//     if (req.method === "POST") {
//         const validationToken = req.headers["validation-token"];

//         if (validationToken) {
//             console.log(`Received validation token: ${validationToken}`);
//             res.setHeader("Validation-Token", validationToken as string);
//             return res.status(200).send("OK");
//         }

//         const messageData = req.body;

//         if (messageData && messageData.body && messageData.body.changes) {
//             try {
//                 for (const change of messageData.body.changes) {
//                     console.log(
//                         "Processing change:",
//                         JSON.stringify(change, null, 2)
//                     );

//                     const changedObject = JSON.stringify(change, null, 2);
//                     console.log(
//                         "Change object:",
//                         JSON.stringify(change, null, 2)
//                     );

//                     const newMessageDetails = JSON.parse(changedObject);
//                     console.log("New message details:", newMessageDetails);
//                     const retrievedMessageIDs = newMessageDetails.newMessageIds;
//                     console.log("Retrieved message IDs:", retrievedMessageIDs);
//                     const retrievedMessageID = retrievedMessageIDs[0];
//                     console.log(
//                         `Retrieved message ID 0: ${retrievedMessageID}`
//                     );
//                     // const messageIDDetails =
//                     //     await getMessageDetails(retrievedMessageID);
//                     // console.log("Message ID details:", messageIDDetails);

//                     // const messageId = change.newMessageId || change.messageId;
//                     const messageId = retrievedMessageID;
//                     if (!messageId) {
//                         console.error("Message ID is undefined");
//                         continue;
//                     }

//                     console.log(
//                         `Fetching details for message ID: ${messageId}`
//                     );
//                     const messageDetails = await getMessageDetails(messageId);
//                     console.log(
//                         "Message details:",
//                         JSON.stringify(messageDetails, null, 2)
//                     );

//                     await handleNewMessage(messageDetails);
//                 }
//                 console.log("Message processing completed");
//                 res.status(200).json({ status: "Message processed" });
//             } catch (error) {
//                 console.error("Error processing message:", error);
//                 res.status(500).json({
//                     error: "Failed to process message",
//                     details: error,
//                 });
//             }
//         } else {
//             console.log(
//                 "Received POST request with invalid or empty message data"
//             );
//             res.status(400).json({ error: "Invalid message data" });
//         }
//     } else {
//         console.log(`Received non-POST request: ${req.method}`);
//         res.setHeader("Allow", ["POST"]);
//         res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
// }

// export { createOrUpdateConversation };

// import type { NextApiRequest, NextApiResponse } from "next";
// import { ringCentralClient } from "@/lib/ringcentralClient";
// import axios from "axios";

// interface MessageDetails {
//     id: string;
//     from: { phoneNumber: string };
//     to: Array<{ phoneNumber: string }>;
//     subject: string;
//     direction: "Inbound" | "Outbound";
// }

// interface Conversation {
//     patientNumber: string;
//     doctorNumber: string;
// }

// const activeConversations: { [key: string]: Conversation } = {};

// function createOrUpdateConversation(
//     patientNumber: string,
//     doctorNumber: string
// ): string {
//     const conversationId = `${patientNumber}-${doctorNumber}`;
//     activeConversations[conversationId] = { patientNumber, doctorNumber };
//     console.log(`Conversation created/updated: ${conversationId}`);
//     return conversationId;
// }

// async function getMessageDetails(messageId: string): Promise<MessageDetails> {
//     console.log(`Fetching details for message ID: ${messageId}`);
//     try {
//         await ringCentralClient.login({ jwt: process.env.RC_JWT });
//         const response = await ringCentralClient.get(
//             `/restapi/v1.0/account/~/extension/~/message-store/${messageId}`
//         );
//         const details = await response.json();
//         console.log(
//             `Message details retrieved:`,
//             JSON.stringify(details, null, 2)
//         );
//         return details;
//     } catch (error) {
//         console.error(`Error getting message details:`, error);
//         throw error;
//     }
// }

// async function getRecentMessages(
//     count: number = 10
// ): Promise<MessageDetails[]> {
//     console.log(`Fetching ${count} recent messages`);
//     try {
//         await ringCentralClient.login({ jwt: process.env.RC_JWT });
//         const response = await ringCentralClient.get(
//             `/restapi/v1.0/account/~/extension/~/message-store`,
//             {
//                 params: {
//                     dateFrom: new Date(Date.now() - 5 * 60000).toISOString(),
//                     perPage: count,
//                 },
//             }
//         );
//         const data = await response.json();
//         console.log(
//             `Recent messages retrieved:`,
//             JSON.stringify(data.records, null, 2)
//         );
//         return data.records;
//     } catch (error) {
//         console.error(`Error getting recent messages:`, error);
//         throw error;
//     }
// }

// async function sendSMS(to: string, message: string) {
//     console.log(`Sending SMS to ${to}: ${message}`);
//     try {
//         await ringCentralClient.login({ jwt: process.env.RC_JWT });
//         const response = await ringCentralClient.post(
//             "/restapi/v1.0/account/~/extension/~/sms",
//             {
//                 from: { phoneNumber: process.env.RC_PHONE_NUMBER },
//                 to: [{ phoneNumber: to }],
//                 text: message,
//             }
//         );
//         const result = await response.json();
//         console.log(`SMS sent successfully:`, JSON.stringify(result, null, 2));
//     } catch (error) {
//         console.error("Error sending SMS:", error);
//         throw error;
//     }
// }

// async function handleNewMessage(messageDetails: MessageDetails) {
//     console.log(
//         `Handling new message:`,
//         JSON.stringify(messageDetails, null, 2)
//     );
//     const { from, to, subject } = messageDetails;
//     const fromNumber = from.phoneNumber;
//     const toNumber = to[0].phoneNumber;

//     if (fromNumber === process.env.RC_PHONE_NUMBER) {
//         console.log("Outbound message, ignoring");
//         return;
//     }

//     console.log(
//         `Active conversations:`,
//         JSON.stringify(activeConversations, null, 2)
//     );

//     // Find the conversation this message belongs to
//     const conversationId = Object.keys(activeConversations).find(
//         (id) =>
//             activeConversations[id].patientNumber === fromNumber ||
//             activeConversations[id].doctorNumber === fromNumber
//     );

//     if (!conversationId) {
//         console.error(`No conversation found for number: ${fromNumber}`);
//         return;
//     }

//     console.log(`Found conversation: ${conversationId}`);
//     const conversation = activeConversations[conversationId];
//     const recipientNumber =
//         fromNumber === conversation.patientNumber
//             ? conversation.doctorNumber
//             : conversation.patientNumber;

//     console.log(`Forwarding message to: ${recipientNumber}`);
//     // Forward the message
//     await sendSMS(recipientNumber, `(${conversationId}) ${subject}`);
// }

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     console.log(
//         `Webhook received ${req.method} request at ${new Date().toISOString()}`
//     );
//     console.log("Headers:", JSON.stringify(req.headers, null, 2));
//     console.log("Body:", JSON.stringify(req.body, null, 2));

//     if (req.method === "POST") {
//         const validationToken = req.headers["validation-token"];

//         if (validationToken) {
//             console.log(`Received validation token: ${validationToken}`);
//             res.setHeader("Validation-Token", validationToken as string);
//             return res.status(200).send("OK");
//         }

//         const messageData = req.body;

//         if (messageData && messageData.body && messageData.body.changes) {
//             try {
//                 for (const change of messageData.body.changes) {
//                     console.log(
//                         "Processing change:",
//                         JSON.stringify(change, null, 2)
//                     );

//                     if (
//                         change.type === "SMS" &&
//                         (change.newCount > 0 || change.updatedCount > 0)
//                     ) {
//                         const recentMessages = await getRecentMessages(
//                             Math.max(change.newCount, change.updatedCount)
//                         );

//                         for (const message of recentMessages) {
//                             if (message.direction === "Inbound") {
//                                 await handleNewMessage(message);
//                             }
//                         }
//                     }
//                 }
//                 console.log("Message processing completed");
//                 res.status(200).json({ status: "Message processed" });
//             } catch (error) {
//                 console.error("Error processing message:", error);
//                 res.status(500).json({
//                     error: "Failed to process message",
//                     details: error,
//                 });
//             }
//         } else {
//             console.log(
//                 "Received POST request with invalid or empty message data"
//             );
//             res.status(400).json({ error: "Invalid message data" });
//         }
//     } else {
//         console.log(`Received non-POST request: ${req.method}`);
//         res.setHeader("Allow", ["POST"]);
//         res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
// }

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     if (req.method === "POST") {
//         const validationToken = req.headers["validation-token"];

//         if (validationToken) {
//             res.setHeader("Validation-Token", validationToken as string);
//             return res.status(200).send("OK");
//         }

//         const messageData = req.body;

//         if (messageData && messageData.body && messageData.body.changes) {
//             try {
//                 for (const change of messageData.body.changes) {
//                     if (change.type === "SMS" && change.newCount > 0) {
//                         for (const messageId of change.newMessageIds) {
//                             try {
//                                 await axios.post(
//                                     `${process.env.BASE_URL}/api/llpmg/ringcentral/handle-new-message`,
//                                     { messageId }
//                                 );
//                             } catch (error) {
//                                 if (axios.isAxiosError(error)) {
//                                     console.error(
//                                         "Error sending to new message handler:",
//                                         error.response?.data || error.message
//                                     );
//                                 } else {
//                                     console.error("Unexpected error:", error);
//                                 }
//                             }
//                         }
//                     }
//                 }
//                 res.status(200).json({ status: "Messages processed" });
//             } catch (error) {
//                 console.error("Error processing messages:", error);
//                 res.status(500).json({ error: "Failed to process messages" });
//             }
//         } else {
//             res.status(400).json({ error: "Invalid message data" });
//         }
//     } else {
//         res.setHeader("Allow", ["POST"]);
//         res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
// }

import type { NextApiRequest, NextApiResponse } from "next";
import { ringCentralClient } from "@/lib/ringcentralClient";
import axios from "axios";

interface MessageDetails {
    id: string;
    from: { phoneNumber: string };
    to: Array<{ phoneNumber: string }>;
    subject: string;
    direction: "Inbound" | "Outbound";
}

interface Conversation {
    patientNumber: string;
    doctorNumber: string;
}

const activeConversations: { [key: string]: Conversation } = {};

function createOrUpdateConversation(
    patientNumber: string,
    doctorNumber: string
): string {
    const conversationId = `${patientNumber}-${doctorNumber}`;
    activeConversations[conversationId] = { patientNumber, doctorNumber };
    console.log(`Conversation created/updated: ${conversationId}`);
    return conversationId;
}

async function getMessageDetails(messageId: string): Promise<MessageDetails> {
    console.log(`Fetching details for message ID: ${messageId}`);
    try {
        await ringCentralClient.login({ jwt: process.env.RC_JWT });
        const response = await ringCentralClient.get(
            `/restapi/v1.0/account/~/extension/~/message-store/${messageId}`
        );
        const details = await response.json();
        console.log(
            `Message details retrieved:`,
            JSON.stringify(details, null, 2)
        );
        return details;
    } catch (error) {
        console.error(`Error getting message details:`, error);
        throw error;
    }
}

async function getRecentMessages(
    count: number = 10
): Promise<MessageDetails[]> {
    console.log(`Fetching ${count} recent messages`);
    try {
        await ringCentralClient.login({ jwt: process.env.RC_JWT });
        const response = await ringCentralClient.get(
            `/restapi/v1.0/account/~/extension/~/message-store`,
            {
                params: {
                    dateFrom: new Date(Date.now() - 5 * 60000).toISOString(),
                    perPage: count,
                },
            }
        );
        const data = await response.json();
        console.log(
            `Recent messages retrieved:`,
            JSON.stringify(data.records, null, 2)
        );
        return data.records;
    } catch (error) {
        console.error(`Error getting recent messages:`, error);
        throw error;
    }
}

async function sendSMS(to: string, message: string) {
    console.log(`Sending SMS to ${to}: ${message}`);
    try {
        await ringCentralClient.login({ jwt: process.env.RC_JWT });
        const response = await ringCentralClient.post(
            "/restapi/v1.0/account/~/extension/~/sms",
            {
                from: { phoneNumber: process.env.RC_PHONE_NUMBER },
                to: [{ phoneNumber: to }],
                text: message,
            }
        );
        const result = await response.json();
        console.log(`SMS sent successfully:`, JSON.stringify(result, null, 2));
    } catch (error) {
        console.error("Error sending SMS:", error);
        throw error;
    }
}

async function handleNewMessage(messageDetails: MessageDetails) {
    console.log(
        `Handling new message:`,
        JSON.stringify(messageDetails, null, 2)
    );
    const { from, to, subject } = messageDetails;
    const fromNumber = from.phoneNumber;
    const toNumber = to[0].phoneNumber;

    if (fromNumber === process.env.RC_PHONE_NUMBER) {
        console.log("Outbound message, ignoring");
        return;
    }

    console.log(
        `Active conversations:`,
        JSON.stringify(activeConversations, null, 2)
    );

    // Find the conversation this message belongs to
    const conversationId = Object.keys(activeConversations).find(
        (id) =>
            activeConversations[id].patientNumber === fromNumber ||
            activeConversations[id].doctorNumber === fromNumber
    );

    if (!conversationId) {
        console.error(`No conversation found for number: ${fromNumber}`);
        return;
    }

    console.log(`Found conversation: ${conversationId}`);
    const conversation = activeConversations[conversationId];
    const recipientNumber =
        fromNumber === conversation.patientNumber
            ? conversation.doctorNumber
            : conversation.patientNumber;

    console.log(`Forwarding message to: ${recipientNumber}`);
    // Forward the message
    await sendSMS(recipientNumber, `(${conversationId}) ${subject}`);
}

const processedMessageIds: Set<string> = new Set();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        const validationToken = req.headers["validation-token"];

        if (validationToken) {
            res.setHeader("Validation-Token", validationToken as string);
            return res.status(200).send("OK");
        }

        const messageData = req.body;

        if (messageData && messageData.body && messageData.body.changes) {
            try {
                for (const change of messageData.body.changes) {
                    if (change.type === "SMS" && change.newCount > 0) {
                        for (const messageId of change.newMessageIds) {
                            if (!processedMessageIds.has(messageId)) {
                                processedMessageIds.add(messageId);
                                try {
                                    await axios.post(
                                        `${process.env.BASE_URL}/api/llpmg/ringcentral/handle-new-message`,
                                        { messageId }
                                    );
                                } catch (error) {
                                    if (axios.isAxiosError(error)) {
                                        console.error(
                                            "Error sending to new message handler:",
                                            error.response?.data ||
                                                error.message
                                        );
                                    } else {
                                        console.error(
                                            "Unexpected error:",
                                            error
                                        );
                                    }
                                }
                            } else {
                                console.log(
                                    `Message with ID ${messageId} already processed, skipping.`
                                );
                            }
                        }
                    }
                }
                res.status(200).json({ status: "Messages processed" });
            } catch (error) {
                console.error("Error processing messages:", error);
                res.status(500).json({ error: "Failed to process messages" });
            }
        } else {
            res.status(400).json({ error: "Invalid message data" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export { createOrUpdateConversation };
