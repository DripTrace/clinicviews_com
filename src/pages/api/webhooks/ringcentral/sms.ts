// import type { NextApiRequest, NextApiResponse } from "next";
// import { SDK } from "@ringcentral/sdk";
// import { v4 as uuid } from "uuid";
// import { initial } from "lodash";

// const rcsdk = new SDK({
//     server: process.env.RC_SERVER_URL,
//     clientId: process.env.RC_CLIENT_ID,
//     clientSecret: process.env.RC_CLIENT_SECRET,
// });

// const ringCentralClient = rcsdk.platform();

// const sessions: { [key: string]: { patient: string; doctor: string } } = {};

// function formatPhoneNumber(phone: string | number): string {
//     const phoneString = String(phone).replace(/\D/g, "");
//     const formattedPhoneNumber = phoneString.startsWith("1")
//         ? `+1${phoneString}`
//         : `+1${phoneString}`;

//     if (!/^\+1\d{10}$/.test(formattedPhoneNumber)) {
//         throw new Error(`Invalid phone number format: ${formattedPhoneNumber}`);
//     }
//     return formattedPhoneNumber;
// }

// async function listMessages(phoneNumber: string) {
//     try {
//         await platform.login({ jwt: process.env.RC_JWT });
//         const response = await platform.get(
//             `/restapi/v1.0/account/~/extension/~/message-store`,
//             { phoneNumber, direction: "Inbound" }
//         );
//         return response.json();
//     } catch (error) {
//         console.error("Error listing messages:", error);
//         throw error;
//     }
// }

// async function getMessageDetails(messageId: string) {
//     try {
//         await platform.login({ jwt: process.env.RC_JWT });
//         const response = await platform.get(
//             `/restapi/v1.0/account/~/extension/~/message-store/${messageId}`
//         );
//         return response.json();
//     } catch (error) {
//         console.error("Error fetching message details:", error);
//         throw error;
//     }
// }

// async function sendSMS(to: string | number, message: string) {
//     try {
//         await platform.login({ jwt: process.env.RC_JWT });
//         const formattedPhoneNumber = formatPhoneNumber(to);

//         const resp = await platform.post(
//             "/restapi/v1.0/account/~/extension/~/sms",
//             {
//                 from: { phoneNumber: process.env.RC_PHONE_NUMBER },
//                 to: [{ phoneNumber: formattedPhoneNumber }],
//                 text: message,
//             }
//         );

//         return resp.json();
//     } catch (error) {
//         console.error("Error sending SMS:", error);
//         throw error;
//     }
// }

// function identifySender(message: string): "doctor" | "patient" | null {
//     if (message.startsWith("Hello Dr.")) {
//         return "doctor";
//     } else if (message.startsWith("Hello ")) {
//         return "patient";
//     }
//     return null;
// }

// async function handleNewMessage(messageDetails: any) {
//     const { from, to, subject } = messageDetails;
//     const fromNumber = from.phoneNumber;
//     const toNumber = to[0].phoneNumber;

//     let sessionId = `${fromNumber}-${toNumber}`;
//     let targetNumber: string | undefined;

//     if (sessions[sessionId]) {
//         const session = sessions[sessionId];
//         targetNumber =
//             session.doctor === fromNumber ? session.patient : session.doctor;
//     } else {
//         // Fetch the list of messages to determine the initial message
//         const messages = await listMessages(fromNumber);
//         console.log("Messages:", messages);
//         const lastPageUri = await messages.navigation.lastPage.uri;
//         console.log("Last page URI:", lastPageUri);
//         const lastPageResponse = await platform.get(lastPageUri);
//         const lastPageData = await lastPageResponse.json();
//         console.log("Last page data:", lastPageData);
//         const lastPageMessage =
//             lastPageData.records[lastPageData.records.length - 1];
//         console.log("Last page messages:", lastPageMessage);
//         // const firstMessagSent = await getMessageDetails(lastPageMessages.id);
//         // console.log("First message sent:", firstMessagSent);
//         // const firstConversation = await

//         const initialMessage = messages.records.find(
//             (msg: any) => msg.from.phoneNumber === fromNumber
//         );

//         // console.log("Initial message:\n", initialMessage);

//         if (!initialMessage) {
//             console.error("Initial message not found");
//             return;
//         }
//         console.log("Latest message:\n", initialMessage);
//         // const initialMessageDetails = await getMessageDetails(
//         //     initialMessage.id
//         // );

//         // console.log("Initial message details:\n", initialMessageDetails);

//         const initialMessageType = identifySender(initialMessage.subject);
//         if (!initialMessageType) {
//             console.error("Unknown sender type");
//             return;
//         }

//         sessionId = uuid();
//         if (initialMessageType === "doctor") {
//             sessions[sessionId] = { doctor: fromNumber, patient: toNumber };
//             targetNumber = toNumber;
//         } else if (initialMessageType === "patient") {
//             sessions[sessionId] = { doctor: toNumber, patient: fromNumber };
//             targetNumber = toNumber;
//         }
//     }

//     if (targetNumber) {
//         await sendSMS(targetNumber, subject);
//     } else {
//         console.error("Session not found");
//     }
// }

// async function getLastPageMessages(phoneNumber: string) {
//     try {
//         await platform.login({ jwt: process.env.RC_JWT });
//         const response = await platform.get(
//             `/restapi/v1.0/account/~/extension/~/message-store`,
//             { phoneNumber, direction: "Inbound" }
//         );
//         const { navigation, records } = await response.json();

//         const lastPageUri = navigation.lastPage.uri;
//         const lastPageResponse = await platform.get(lastPageUri);
//         const lastPageData = await lastPageResponse.json();

//         return lastPageData.records.pop();
//     } catch (error) {
//         console.error("Error fetching last page of messages:", error);
//         throw error;
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

//         const retrievedData = JSON.stringify(messageData, null, 2);

//         console.log("Received message data:", retrievedData);

//         if (messageData && messageData.body && messageData.body.changes) {
//             try {
//                 for (const change of messageData.body.changes) {
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
//                     const messageIDDetails =
//                         await getMessageDetails(retrievedMessageID);
//                     console.log("Message ID details:", messageIDDetails);

//                     await handleNewMessage(messageIDDetails);
//                 }
//                 res.status(200).json({ status: "Message processed" });
//             } catch (error) {
//                 console.error("Error processing message:", error);
//                 res.status(500).json({ error: "Failed to process message" });
//             }
//         } else {
//             res.status(400).json({ error: "Invalid message data" });
//         }
//     } else {
//         res.setHeader("Allow", ["POST"]);
//         res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
// }

// import type { NextApiRequest, NextApiResponse } from "next";
// import { SDK } from "@ringcentral/sdk";
// import { v4 as uuid } from "uuid";
// import { initial } from "lodash";

// const rcsdk = new SDK({
//     server: process.env.RC_SERVER_URL,
//     clientId: process.env.RC_CLIENT_ID,
//     clientSecret: process.env.RC_CLIENT_SECRET,
// });

// const platform = rcsdk.platform();

// const sessions: { [key: string]: { patient: string; doctor: string } } = {};

// function formatPhoneNumber(phone: string | number): string {
//     const phoneString = String(phone).replace(/\D/g, "");
//     const formattedPhoneNumber = phoneString.startsWith("1")
//         ? `+1${phoneString}`
//         : `+1${phoneString}`;

//     if (!/^\+1\d{10}$/.test(formattedPhoneNumber)) {
//         throw new Error(`Invalid phone number format: ${formattedPhoneNumber}`);
//     }
//     return formattedPhoneNumber;
// }

// async function listMessages(phoneNumber: string) {
//     try {
//         await platform.login({ jwt: process.env.RC_JWT });
//         const response = await platform.get(
//             `/restapi/v1.0/account/~/extension/~/message-store`,
//             { phoneNumber, direction: "Inbound" }
//         );
//         return response.json();
//     } catch (error) {
//         console.error("Error listing messages:", error);
//         throw error;
//     }
// }

// async function getMessageDetails(messageId: string) {
//     try {
//         await platform.login({ jwt: process.env.RC_JWT });
//         const response = await platform.get(
//             `/restapi/v1.0/account/~/extension/~/message-store/${messageId}`
//         );
//         return response.json();
//     } catch (error) {
//         console.error("Error fetching message details:", error);
//         throw error;
//     }
// }

// async function sendSMS(to: string | number, message: string) {
//     try {
//         await platform.login({ jwt: process.env.RC_JWT });
//         const formattedPhoneNumber = formatPhoneNumber(to);

//         const resp = await platform.post(
//             "/restapi/v1.0/account/~/extension/~/sms",
//             {
//                 from: { phoneNumber: process.env.RC_PHONE_NUMBER },
//                 to: [{ phoneNumber: formattedPhoneNumber }],
//                 text: message,
//             }
//         );

//         return resp.json();
//     } catch (error) {
//         console.error("Error sending SMS:", error);
//         throw error;
//     }
// }

// function identifySender(message: string): "doctor" | "patient" | null {
//     if (message.startsWith("Hello Dr.")) {
//         return "doctor";
//     } else if (message.startsWith("Hello ")) {
//         return "patient";
//     }
//     return null;
// }

// async function handleNewMessage(messageDetails: any) {
//     const { from, to, subject } = messageDetails;
//     const fromNumber = from.phoneNumber;
//     const toNumber = to[0].phoneNumber;

//     let sessionId = `${fromNumber}-${toNumber}`;
//     let targetNumber: string | undefined;

//     if (sessions[sessionId]) {
//         const session = sessions[sessionId];
//         targetNumber =
//             session.doctor === fromNumber ? session.patient : session.doctor;
//     } else {
//         // Fetch the list of messages to determine the initial message
//         const messages = await listMessages(fromNumber);
//         console.log("Messages:", messages);
//         const lastPageUri = await messages.navigation.lastPage.uri;
//         console.log("Last page URI:", lastPageUri);
//         const lastPageResponse = await platform.get(lastPageUri);
//         const lastPageData = await lastPageResponse.json();
//         console.log("Last page data:", lastPageData);
//         const lastPageMessage =
//             lastPageData.records[lastPageData.records.length - 1];
//         console.log("Last page messages:", lastPageMessage);
//         // const firstMessagSent = await getMessageDetails(lastPageMessages.id);
//         // console.log("First message sent:", firstMessagSent);
//         // const firstConversation = await

//         const initialMessage = messages.records.find(
//             (msg: any) => msg.from.phoneNumber === fromNumber
//         );

//         // console.log("Initial message:\n", initialMessage);

//         if (!initialMessage) {
//             console.error("Initial message not found");
//             return;
//         }
//         console.log("Latest message:\n", initialMessage);
//         // const initialMessageDetails = await getMessageDetails(
//         //     initialMessage.id
//         // );

//         // console.log("Initial message details:\n", initialMessageDetails);

//         const initialMessageType = identifySender(initialMessage.subject);
//         if (!initialMessageType) {
//             console.error("Unknown sender type");
//             return;
//         }

//         sessionId = uuid();
//         if (initialMessageType === "doctor") {
//             sessions[sessionId] = { doctor: fromNumber, patient: toNumber };
//             targetNumber = toNumber;
//         } else if (initialMessageType === "patient") {
//             sessions[sessionId] = { doctor: toNumber, patient: fromNumber };
//             targetNumber = toNumber;
//         }
//     }

//     if (targetNumber) {
//         await sendSMS(targetNumber, subject);
//     } else {
//         console.error("Session not found");
//     }
// }

// async function getLastPageMessages(phoneNumber: string) {
//     try {
//         await platform.login({ jwt: process.env.RC_JWT });
//         const response = await platform.get(
//             `/restapi/v1.0/account/~/extension/~/message-store`,
//             { phoneNumber, direction: "Inbound" }
//         );
//         const { navigation, records } = await response.json();

//         const lastPageUri = navigation.lastPage.uri;
//         const lastPageResponse = await platform.get(lastPageUri);
//         const lastPageData = await lastPageResponse.json();

//         return lastPageData.records.pop();
//     } catch (error) {
//         console.error("Error fetching last page of messages:", error);
//         throw error;
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

//         const retrievedData = JSON.stringify(messageData, null, 2);

//         console.log("Received message data:", retrievedData);

//         if (messageData && messageData.body && messageData.body.changes) {
//             try {
//                 for (const change of messageData.body.changes) {
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
//                     const messageIDDetails =
//                         await getMessageDetails(retrievedMessageID);
//                     console.log("Message ID details:", messageIDDetails);

//                     await handleNewMessage(messageIDDetails);
//                 }
//                 res.status(200).json({ status: "Message processed" });
//             } catch (error) {
//                 console.error("Error processing message:", error);
//                 res.status(500).json({ error: "Failed to process message" });
//             }
//         } else {
//             res.status(400).json({ error: "Invalid message data" });
//         }
//     } else {
//         res.setHeader("Allow", ["POST"]);
//         res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
// }

// // import type { NextApiRequest, NextApiResponse } from "next";
// // import { SDK } from "@ringcentral/sdk";
// // import { v4 as uuid } from "uuid";
// // import { initial } from "lodash";

// // const rcsdk = new SDK({
// //     server: process.env.RC_SERVER_URL,
// //     clientId: process.env.RC_CLIENT_ID,
// //     clientSecret: process.env.RC_CLIENT_SECRET,
// // });

// // const platform = rcsdk.platform();

// // const sessions: { [key: string]: { patient: string; doctor: string } } = {};

// // function formatPhoneNumber(phone: string | number): string {
// //     const phoneString = String(phone).replace(/\D/g, "");
// //     const formattedPhoneNumber = phoneString.startsWith("1")
// //         ? `+1${phoneString}`
// //         : `+1${phoneString}`;

// //     if (!/^\+1\d{10}$/.test(formattedPhoneNumber)) {
// //         throw new Error(`Invalid phone number format: ${formattedPhoneNumber}`);
// //     }
// //     return formattedPhoneNumber;
// // }

// // async function listMessages(phoneNumber: string) {
// //     try {
// //         await platform.login({ jwt: process.env.RC_JWT });
// //         const response = await platform.get(
// //             `/restapi/v1.0/account/~/extension/~/message-store`,
// //             { phoneNumber, direction: "Inbound" }
// //         );
// //         return response.json();
// //     } catch (error) {
// //         console.error("Error listing messages:", error);
// //         throw error;
// //     }
// // }

// // async function getMessageDetails(messageId: string) {
// //     try {
// //         await platform.login({ jwt: process.env.RC_JWT });
// //         const response = await platform.get(
// //             `/restapi/v1.0/account/~/extension/~/message-store/${messageId}`
// //         );
// //         return response.json();
// //     } catch (error) {
// //         console.error("Error fetching message details:", error);
// //         throw error;
// //     }
// // }

// // async function sendSMS(to: string | number, message: string) {
// //     try {
// //         await platform.login({ jwt: process.env.RC_JWT });
// //         const formattedPhoneNumber = formatPhoneNumber(to);

// //         const resp = await platform.post(
// //             "/restapi/v1.0/account/~/extension/~/sms",
// //             {
// //                 from: { phoneNumber: process.env.RC_PHONE_NUMBER },
// //                 to: [{ phoneNumber: formattedPhoneNumber }],
// //                 text: message,
// //             }
// //         );

// //         return resp.json();
// //     } catch (error) {
// //         console.error("Error sending SMS:", error);
// //         throw error;
// //     }
// // }

// // function identifySender(message: string): "doctor" | "patient" | null {
// //     if (message.startsWith("Hello Dr.")) {
// //         return "doctor";
// //     } else if (message.startsWith("Hello ")) {
// //         return "patient";
// //     }
// //     return null;
// // }

// // async function handleNewMessage(messageDetails: any) {
// //     const { from, to, subject } = messageDetails;
// //     const fromNumber = from.phoneNumber;
// //     const toNumber = to[0].phoneNumber;

// //     let sessionId = `${fromNumber}-${toNumber}`;
// //     let targetNumber: string | undefined;

// //     if (sessions[sessionId]) {
// //         const session = sessions[sessionId];
// //         targetNumber =
// //             session.doctor === fromNumber ? session.patient : session.doctor;
// //     } else {
// //         // Fetch the list of messages to determine the initial message
// //         const messages = await listMessages(fromNumber);
// //         console.log("Messages:", messages);
// //         const lastPageUri = await messages.navigation.lastPage.uri;
// //         console.log("Last page URI:", lastPageUri);
// //         const lastPageResponse = await platform.get(lastPageUri);
// //         const lastPageData = await lastPageResponse.json();
// //         console.log("Last page data:", lastPageData);
// //         const lastPageMessage =
// //             lastPageData.records[lastPageData.records.length - 1];
// //         console.log("Last page messages:", lastPageMessage);
// //         // const firstMessagSent = await getMessageDetails(lastPageMessages.id);
// //         // console.log("First message sent:", firstMessagSent);
// //         // const firstConversation = await

// //         const initialMessage = messages.records.find(
// //             (msg: any) => msg.from.phoneNumber === fromNumber
// //         );

// //         // console.log("Initial message:\n", initialMessage);

// //         if (!initialMessage) {
// //             console.error("Initial message not found");
// //             return;
// //         }
// //         console.log("Latest message:\n", initialMessage);
// //         // const initialMessageDetails = await getMessageDetails(
// //         //     initialMessage.id
// //         // );

// //         // console.log("Initial message details:\n", initialMessageDetails);

// //         const initialMessageType = identifySender(initialMessage.subject);
// //         if (!initialMessageType) {
// //             console.error("Unknown sender type");
// //             return;
// //         }

// //         sessionId = uuid();
// //         if (initialMessageType === "doctor") {
// //             sessions[sessionId] = { doctor: fromNumber, patient: toNumber };
// //             targetNumber = toNumber;
// //         } else if (initialMessageType === "patient") {
// //             sessions[sessionId] = { doctor: toNumber, patient: fromNumber };
// //             targetNumber = toNumber;
// //         }
// //     }

// //     if (targetNumber) {
// //         await sendSMS(targetNumber, subject);
// //     } else {
// //         console.error("Session not found");
// //     }
// // }

// // async function getLastPageMessages(phoneNumber: string) {
// //     try {
// //         await platform.login({ jwt: process.env.RC_JWT });
// //         const response = await platform.get(
// //             `/restapi/v1.0/account/~/extension/~/message-store`,
// //             { phoneNumber, direction: "Inbound" }
// //         );
// //         const { navigation, records } = await response.json();

// //         const lastPageUri = navigation.lastPage.uri;
// //         const lastPageResponse = await platform.get(lastPageUri);
// //         const lastPageData = await lastPageResponse.json();

// //         return lastPageData.records.pop();
// //     } catch (error) {
// //         console.error("Error fetching last page of messages:", error);
// //         throw error;
// //     }
// // }

// // export default async function handler(
// //     req: NextApiRequest,
// //     res: NextApiResponse
// // ) {
// //     if (req.method === "POST") {
// //         const validationToken = req.headers["validation-token"];

// //         if (validationToken) {
// //             res.setHeader("Validation-Token", validationToken as string);
// //             return res.status(200).send("OK");
// //         }

// //         const messageData = req.body;

// //         const retrievedData = JSON.stringify(messageData, null, 2);

// //         console.log("Received message data:", retrievedData);

// //         if (messageData && messageData.body && messageData.body.changes) {
// //             try {
// //                 for (const change of messageData.body.changes) {
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

// //                     await handleNewMessage(messageIDDetails);
// //                 }
// //                 res.status(200).json({ status: "Message processed" });
// //             } catch (error) {
// //                 console.error("Error processing message:", error);
// //                 res.status(500).json({ error: "Failed to process message" });
// //             }
// //         } else {
// //             res.status(400).json({ error: "Invalid message data" });
// //         }
// //     } else {
// //         res.setHeader("Allow", ["POST"]);
// //         res.status(405).end(`Method ${req.method} Not Allowed`);
// //     }
// // }

// import type { NextApiRequest, NextApiResponse } from "next";
// import { SDK } from "@ringcentral/sdk";

// interface Message {
//     subject: string;
//     direction: string;
//     to: Array<{ phoneNumber: string }>;
//     // Add other properties as needed
// }

// const rcsdk = new SDK({
//     server: process.env.RC_SERVER_URL,
//     clientId: process.env.RC_CLIENT_ID,
//     clientSecret: process.env.RC_CLIENT_SECRET,
// });

// const platform = rcsdk.platform();

// // In-memory session storage (replace with a database in production)
// const sessions: { [key: string]: { patient: string; doctor: string } } = {};

// function formatPhoneNumber(phone: string | number): string {
//     const phoneString = String(phone).replace(/\D/g, "");
//     return `+1${phoneString.slice(-10)}`;
// }

// async function getMessageDetails(messageId: string) {
//     console.log(`Getting details for message ${messageId}`);
//     await platform.login({ jwt: process.env.RC_JWT });
//     const response = await platform.get(
//         `/restapi/v1.0/account/~/extension/~/message-store/${messageId}`
//     );
//     const details = await response.json();
//     console.log(`Message details:`, JSON.stringify(details, null, 2));
//     return details;
// }

// async function sendSMS(to: string, message: string) {
//     console.log(`Sending SMS to ${to}: ${message}`);
//     await platform.login({ jwt: process.env.RC_JWT });
//     const formattedPhoneNumber = formatPhoneNumber(to);

//     const resp = await platform.post(
//         "/restapi/v1.0/account/~/extension/~/sms",
//         {
//             from: { phoneNumber: process.env.RC_PHONE_NUMBER },
//             to: [{ phoneNumber: formattedPhoneNumber }],
//             text: message,
//         }
//     );

//     const result = await resp.json();
//     console.log(`SMS sent, response:`, JSON.stringify(result, null, 2));
//     return result;
// }

// async function findInitialMessages(conversationId: string): Promise<Message[]> {
//     await platform.login({ jwt: process.env.RC_JWT });
//     const response = await platform.get(
//         "/restapi/v1.0/account/~/extension/~/message-store",
//         {
//             conversationId,
//             dateFrom: new Date(
//                 Date.now() - 30 * 24 * 60 * 60 * 1000
//             ).toISOString(), // Last 30 days
//             perPage: 1000,
//         }
//     );
//     const messages = await response.json();
//     return messages.records;
// }

// async function handleNewMessage(messageDetails: any) {
//     console.log("New message details:\n", messageDetails);
//     console.log(
//         `Handling new message:`,
//         JSON.stringify(messageDetails, null, 2)
//     );
//     const { from, to, subject, conversationId } = messageDetails;
//     const fromNumber = from.phoneNumber;
//     const toNumber = to[0].phoneNumber;

//     if (
//         fromNumber === process.env.RC_PHONE_NUMBER &&
//         toNumber === process.env.RC_PHONE_NUMBER
//     ) {
//         console.log("Internal message, ignoring");
//         return;
//     }

//     console.log("Conversation ID:\n", conversationId);

//     let sessionId = conversationId;
//     console.log(`Session ID: ${sessionId}`);

//     if (!sessions[sessionId]) {
//         console.log(`No existing session found, determining roles`);
//         const messages = await findInitialMessages(conversationId);
//         console.log("Messages:\n", messages);
//         const patientMessage = messages.find(
//             (m: Message) =>
//                 m.subject.startsWith("Hello") &&
//                 m.subject.includes("thank you for registering") &&
//                 m.direction === "Outbound"
//         );
//         const doctorMessage = messages.find(
//             (m: Message) =>
//                 m.subject.startsWith("Hello") &&
//                 m.subject.includes(
//                     "you have a new patient appointment suggestion"
//                 ) &&
//                 m.direction === "Outbound"
//         );

//         console.log("Doctor's message:\n", doctorMessage);
//         console.log("Patient's message:\n", patientMessage);

//         if (patientMessage && doctorMessage) {
//             const patientNumber = patientMessage.to[0].phoneNumber;
//             const doctorNumber = doctorMessage.to[0].phoneNumber;
//             sessions[sessionId] = {
//                 patient: patientNumber,
//                 doctor: doctorNumber,
//             };
//             console.log(
//                 `New session created: Patient ${patientNumber}, Doctor ${doctorNumber}`
//             );
//         } else {
//             console.error("Couldn't determine roles from initial messages");
//             return;
//         }
//     }

//     const session = sessions[sessionId];
//     console.log(`Session:`, JSON.stringify(session, null, 2));

//     let targetNumber, prefix;
//     if (fromNumber === session.patient) {
//         targetNumber = session.doctor;
//         prefix = "Patient:";
//     } else if (fromNumber === session.doctor) {
//         targetNumber = session.patient;
//         prefix = "Doctor:";
//     } else {
//         console.error("Message from unknown number");
//         return;
//     }

//     console.log(`Routing message to ${targetNumber}`);
//     await sendSMS(targetNumber, `${prefix} ${subject}`);
// }

// // async function findInitialMessages(conversationId: string) {
// //     await platform.login({ jwt: process.env.RC_JWT });
// //     const response = await platform.get('/restapi/v1.0/account/~/extension/~/message-store', {
// //         conversationId,
// //         dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
// //         perPage: 1000,
// //     });
// //     const messages = await response.json();
// //     return messages.records;
// // }

// // async function handleNewMessage(messageDetails: any) {
// //     console.log(`Handling new message:`, JSON.stringify(messageDetails, null, 2));
// //     const { from, to, subject, conversationId } = messageDetails;
// //     const fromNumber = from.phoneNumber;
// //     const toNumber = to[0].phoneNumber;

// //     if (fromNumber === process.env.RC_PHONE_NUMBER && toNumber === process.env.RC_PHONE_NUMBER) {
// //         console.log("Internal message, ignoring");
// //         return;
// //     }

// //     let sessionId = conversationId;
// //     console.log(`Session ID: ${sessionId}`);

// //     if (!sessions[sessionId]) {
// //         console.log(`No existing session found, determining roles`);
// //         const messages = await findInitialMessages(conversationId);
// //         const patientMessage = messages.find(m =>
// //             m.subject.startsWith("Hello") &&
// //             m.subject.includes("thank you for registering") &&
// //             m.direction === "Outbound"
// //         );
// //         const doctorMessage = messages.find(m =>
// //             m.subject.startsWith("Hello") &&
// //             m.subject.includes("you have a new patient appointment suggestion") &&
// //             m.direction === "Outbound"
// //         );

// //         if (patientMessage && doctorMessage) {
// //             const patientNumber = patientMessage.to[0].phoneNumber;
// //             const doctorNumber = doctorMessage.to[0].phoneNumber;
// //             sessions[sessionId] = { patient: patientNumber, doctor: doctorNumber };
// //             console.log(`New session created: Patient ${patientNumber}, Doctor ${doctorNumber}`);
// //         } else {
// //             console.error("Couldn't determine roles from initial messages");
// //             return;
// //         }
// //     }

// //     const session = sessions[sessionId];
// //     console.log(`Session:`, JSON.stringify(session, null, 2));

// //     let targetNumber, prefix;
// //     if (fromNumber === session.patient) {
// //         targetNumber = session.doctor;
// //         prefix = "Patient:";
// //     } else if (fromNumber === session.doctor) {
// //         targetNumber = session.patient;
// //         prefix = "Doctor:";
// //     } else {
// //         console.error("Message from unknown number");
// //         return;
// //     }

// //     console.log(`Routing message to ${targetNumber}`);
// //     await sendSMS(targetNumber, `${prefix} ${subject}`);
// // }

// // async function findInitialMessage(phoneNumber: string) {
// //     console.log(`Finding initial message for ${phoneNumber}`);
// //     await platform.login({ jwt: process.env.RC_JWT });
// //     const response = await platform.get(
// //         "/restapi/v1.0/account/~/extension/~/message-store",
// //         {
// //             phoneNumber,
// //             direction: "Outbound",
// //             dateFrom: new Date(
// //                 Date.now() - 30 * 24 * 60 * 60 * 1000
// //             ).toISOString(), // Last 30 days
// //             perPage: 1000,
// //         }
// //     );
// //     const messages = await response.json();
// //     console.log(`Found ${messages.records.length} messages for ${phoneNumber}`);

// //     for (const message of messages.records) {
// //         if (message.subject.startsWith("Hello ")) {
// //             console.log(
// //                 `Initial message found:`,
// //                 JSON.stringify(message, null, 2)
// //             );
// //             return message;
// //         }
// //     }
// //     console.log(`No initial message found for ${phoneNumber}`);
// //     return null;
// // }

// // async function handleNewMessage(messageDetails: any) {
// //     console.log(
// //         `Handling new message:`,
// //         JSON.stringify(messageDetails, null, 2)
// //     );
// //     const { from, to, subject } = messageDetails;
// //     const fromNumber = from.phoneNumber;
// //     const toNumber = to[0].phoneNumber;

// //     let sessionId = `${fromNumber}-${toNumber}`;
// //     console.log(`Session ID: ${sessionId}`);

// //     if (!sessions[sessionId]) {
// //         console.log(`No existing session found, determining roles`);
// //         // New conversation, determine roles
// //         const initialMessage = await findInitialMessage(fromNumber);
// //         if (!initialMessage) {
// //             console.error("Initial message not found");
// //             return;
// //         }

// //         console.log("Initial message:\n", initialMessage);

// //         if (initialMessage.subject.includes("your appointment suggestion")) {
// //             // This is a patient
// //             sessions[sessionId] = { patient: fromNumber, doctor: toNumber };
// //             console.log(
// //                 `New session created: Patient ${fromNumber}, Doctor ${toNumber}`
// //             );
// //         } else {
// //             // This is a doctor
// //             sessions[sessionId] = { doctor: fromNumber, patient: toNumber };
// //             console.log(
// //                 `New session created: Doctor ${fromNumber}, Patient ${toNumber}`
// //             );
// //         }
// //     }

// //     const session = sessions[sessionId];
// //     console.log(`Session:`, JSON.stringify(session, null, 2));
// //     const targetNumber =
// //         session.doctor === fromNumber ? session.patient : session.doctor;
// //     console.log(`Routing message to ${targetNumber}`);

// //     await sendSMS(targetNumber, subject);
// // }

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     console.log(`Received ${req.method} request`);
//     console.log(`Headers:`, JSON.stringify(req.headers, null, 2));
//     console.log(`Body:`, JSON.stringify(req.body, null, 2));

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
//                     // console.log(
//                     //     `Processing change:`,
//                     //     JSON.stringify(change, null, 2)
//                     // );
//                     // const messageId = change.newMessageId || change.messageId;
//                     // if (!messageId) {
//                     //     console.error("Message ID is undefined");
//                     //     continue;
//                     // }

//                     // const messageDetails = await getMessageDetails(messageId);
//                     // await handleNewMessage(messageDetails);
//                     console.log("Original change:\n", change);
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
//                     const messageIDDetails =
//                         await getMessageDetails(retrievedMessageID);
//                     console.log("Message ID details:", messageIDDetails);

//                     // await handleNewMessage(retrievedMessageID);
//                     await handleNewMessage(messageIDDetails);
//                 }
//                 console.log(`Message processed successfully`);
//                 res.status(200).json({ status: "Message processed" });
//             } catch (error) {
//                 console.error("Error processing message:", error);
//                 res.status(500).json({ error: "Failed to process message" });
//             }
//         } else {
//             console.error("Invalid message data");
//             res.status(400).json({ error: "Invalid message data" });
//         }
//     } else {
//         console.log(`Method ${req.method} not allowed`);
//         res.setHeader("Allow", ["POST"]);
//         res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
// }

// // // import type { NextApiRequest, NextApiResponse } from "next";
// // // import { SDK } from "@ringcentral/sdk";
// // // import { v4 as uuid } from "uuid";
// // // import { initial } from "lodash";

// // // const rcsdk = new SDK({
// // //     server: process.env.RC_SERVER_URL,
// // //     clientId: process.env.RC_CLIENT_ID,
// // //     clientSecret: process.env.RC_CLIENT_SECRET,
// // // });

// // // const platform = rcsdk.platform();

// // // const sessions: { [key: string]: { patient: string; doctor: string } } = {};

// // // function formatPhoneNumber(phone: string | number): string {
// // //     const phoneString = String(phone).replace(/\D/g, "");
// // //     const formattedPhoneNumber = phoneString.startsWith("1")
// // //         ? `+1${phoneString}`
// // //         : `+1${phoneString}`;

// // //     if (!/^\+1\d{10}$/.test(formattedPhoneNumber)) {
// // //         throw new Error(`Invalid phone number format: ${formattedPhoneNumber}`);
// // //     }
// // //     return formattedPhoneNumber;
// // // }

// // // async function listMessages(phoneNumber: string) {
// // //     try {
// // //         await platform.login({ jwt: process.env.RC_JWT });
// // //         const response = await platform.get(
// // //             `/restapi/v1.0/account/~/extension/~/message-store`,
// // //             { phoneNumber, direction: "Inbound" }
// // //         );
// // //         return response.json();
// // //     } catch (error) {
// // //         console.error("Error listing messages:", error);
// // //         throw error;
// // //     }
// // // }

// // // async function getMessageDetails(messageId: string) {
// // //     try {
// // //         await platform.login({ jwt: process.env.RC_JWT });
// // //         const response = await platform.get(
// // //             `/restapi/v1.0/account/~/extension/~/message-store/${messageId}`
// // //         );
// // //         return response.json();
// // //     } catch (error) {
// // //         console.error("Error fetching message details:", error);
// // //         throw error;
// // //     }
// // // }

// // // async function sendSMS(to: string | number, message: string) {
// // //     try {
// // //         await platform.login({ jwt: process.env.RC_JWT });
// // //         const formattedPhoneNumber = formatPhoneNumber(to);

// // //         const resp = await platform.post(
// // //             "/restapi/v1.0/account/~/extension/~/sms",
// // //             {
// // //                 from: { phoneNumber: process.env.RC_PHONE_NUMBER },
// // //                 to: [{ phoneNumber: formattedPhoneNumber }],
// // //                 text: message,
// // //             }
// // //         );

// // //         return resp.json();
// // //     } catch (error) {
// // //         console.error("Error sending SMS:", error);
// // //         throw error;
// // //     }
// // // }

// // // function identifySender(message: string): "doctor" | "patient" | null {
// // //     if (message.startsWith("Hello Dr.")) {
// // //         return "doctor";
// // //     } else if (message.startsWith("Hello ")) {
// // //         return "patient";
// // //     }
// // //     return null;
// // // }

// // // async function handleNewMessage(messageDetails: any) {
// // //     const { from, to, subject } = messageDetails;
// // //     const fromNumber = from.phoneNumber;
// // //     const toNumber = to[0].phoneNumber;

// // //     let sessionId = `${fromNumber}-${toNumber}`;
// // //     let targetNumber: string | undefined;

// // //     if (sessions[sessionId]) {
// // //         const session = sessions[sessionId];
// // //         targetNumber =
// // //             session.doctor === fromNumber ? session.patient : session.doctor;
// // //     } else {
// // //         // Fetch the list of messages to determine the initial message
// // //         const messages = await listMessages(fromNumber);
// // //         console.log("Messages:", messages);
// // //         const lastPageUri = await messages.navigation.lastPage.uri;
// // //         console.log("Last page URI:", lastPageUri);
// // //         const lastPageResponse = await platform.get(lastPageUri);
// // //         const lastPageData = await lastPageResponse.json();
// // //         console.log("Last page data:", lastPageData);
// // //         const lastPageMessage =
// // //             lastPageData.records[lastPageData.records.length - 1];
// // //         console.log("Last page messages:", lastPageMessage);
// // //         // const firstMessagSent = await getMessageDetails(lastPageMessages.id);
// // //         // console.log("First message sent:", firstMessagSent);
// // //         // const firstConversation = await

// // //         const initialMessage = messages.records.find(
// // //             (msg: any) => msg.from.phoneNumber === fromNumber
// // //         );

// // //         // console.log("Initial message:\n", initialMessage);

// // //         if (!initialMessage) {
// // //             console.error("Initial message not found");
// // //             return;
// // //         }
// // //         console.log("Latest message:\n", initialMessage);
// // //         // const initialMessageDetails = await getMessageDetails(
// // //         //     initialMessage.id
// // //         // );

// // //         // console.log("Initial message details:\n", initialMessageDetails);

// // //         const initialMessageType = identifySender(initialMessage.subject);
// // //         if (!initialMessageType) {
// // //             console.error("Unknown sender type");
// // //             return;
// // //         }

// // //         sessionId = uuid();
// // //         if (initialMessageType === "doctor") {
// // //             sessions[sessionId] = { doctor: fromNumber, patient: toNumber };
// // //             targetNumber = toNumber;
// // //         } else if (initialMessageType === "patient") {
// // //             sessions[sessionId] = { doctor: toNumber, patient: fromNumber };
// // //             targetNumber = toNumber;
// // //         }
// // //     }

// // //     if (targetNumber) {
// // //         await sendSMS(targetNumber, subject);
// // //     } else {
// // //         console.error("Session not found");
// // //     }
// // // }

// // // async function getLastPageMessages(phoneNumber: string) {
// // //     try {
// // //         await platform.login({ jwt: process.env.RC_JWT });
// // //         const response = await platform.get(
// // //             `/restapi/v1.0/account/~/extension/~/message-store`,
// // //             { phoneNumber, direction: "Inbound" }
// // //         );
// // //         const { navigation, records } = await response.json();

// // //         const lastPageUri = navigation.lastPage.uri;
// // //         const lastPageResponse = await platform.get(lastPageUri);
// // //         const lastPageData = await lastPageResponse.json();

// // //         return lastPageData.records.pop();
// // //     } catch (error) {
// // //         console.error("Error fetching last page of messages:", error);
// // //         throw error;
// // //     }
// // // }

// // // export default async function handler(
// // //     req: NextApiRequest,
// // //     res: NextApiResponse
// // // ) {
// // //     if (req.method === "POST") {
// // //         const validationToken = req.headers["validation-token"];

// // //         if (validationToken) {
// // //             res.setHeader("Validation-Token", validationToken as string);
// // //             return res.status(200).send("OK");
// // //         }

// // //         const messageData = req.body;

// // //         const retrievedData = JSON.stringify(messageData, null, 2);

// // //         console.log("Received message data:", retrievedData);

// // //         if (messageData && messageData.body && messageData.body.changes) {
// // //             try {
// // //                 for (const change of messageData.body.changes) {
// // //                     const changedObject = JSON.stringify(change, null, 2);
// // //                     console.log(
// // //                         "Change object:",
// // //                         JSON.stringify(change, null, 2)
// // //                     );

// // //                     const newMessageDetails = JSON.parse(changedObject);
// // //                     console.log("New message details:", newMessageDetails);
// // //                     const retrievedMessageIDs = newMessageDetails.newMessageIds;
// // //                     console.log("Retrieved message IDs:", retrievedMessageIDs);
// // //                     const retrievedMessageID = retrievedMessageIDs[0];
// // //                     console.log(
// // //                         `Retrieved message ID 0: ${retrievedMessageID}`
// // //                     );
// // //                     const messageIDDetails =
// // //                         await getMessageDetails(retrievedMessageID);
// // //                     console.log("Message ID details:", messageIDDetails);

// // //                     await handleNewMessage(messageIDDetails);
// // //                 }
// // //                 res.status(200).json({ status: "Message processed" });
// // //             } catch (error) {
// // //                 console.error("Error processing message:", error);
// // //                 res.status(500).json({ error: "Failed to process message" });
// // //             }
// // //         } else {
// // //             res.status(400).json({ error: "Invalid message data" });
// // //         }
// // //     } else {
// // //         res.setHeader("Allow", ["POST"]);
// // //         res.status(405).end(`Method ${req.method} Not Allowed`);
// // //     }
// // // }

// // import type { NextApiRequest, NextApiResponse } from "next";
// // import { SDK } from "@ringcentral/sdk";

// // interface Message {
// //     subject: string;
// //     direction: string;
// //     to: Array<{ phoneNumber: string }>;
// //     // Add other properties as needed
// // }

// // const rcsdk = new SDK({
// //     server: process.env.RC_SERVER_URL,
// //     clientId: process.env.RC_CLIENT_ID,
// //     clientSecret: process.env.RC_CLIENT_SECRET,
// // });

// // const platform = rcsdk.platform();

// // // In-memory session storage (replace with a database in production)
// // const sessions: { [key: string]: { patient: string; doctor: string } } = {};

// // function formatPhoneNumber(phone: string | number): string {
// //     const phoneString = String(phone).replace(/\D/g, "");
// //     return `+1${phoneString.slice(-10)}`;
// // }

// // async function getMessageDetails(messageId: string) {
// //     console.log(`Getting details for message ${messageId}`);
// //     await platform.login({ jwt: process.env.RC_JWT });
// //     const response = await platform.get(
// //         `/restapi/v1.0/account/~/extension/~/message-store/${messageId}`
// //     );
// //     const details = await response.json();
// //     console.log(`Message details:`, JSON.stringify(details, null, 2));
// //     return details;
// // }

// // async function sendSMS(to: string, message: string) {
// //     console.log(`Sending SMS to ${to}: ${message}`);
// //     await platform.login({ jwt: process.env.RC_JWT });
// //     const formattedPhoneNumber = formatPhoneNumber(to);

// //     const resp = await platform.post(
// //         "/restapi/v1.0/account/~/extension/~/sms",
// //         {
// //             from: { phoneNumber: process.env.RC_PHONE_NUMBER },
// //             to: [{ phoneNumber: formattedPhoneNumber }],
// //             text: message,
// //         }
// //     );

// //     const result = await resp.json();
// //     console.log(`SMS sent, response:`, JSON.stringify(result, null, 2));
// //     return result;
// // }

// // // async function findInitialMessages(conversationId: string): Promise<Message[]> {
// // //     await platform.login({ jwt: process.env.RC_JWT });
// // //     const response = await platform.get(
// // //         "/restapi/v1.0/account/~/extension/~/message-store",
// // //         {
// // //             conversationId,
// // //             dateFrom: new Date(
// // //                 Date.now() - 30 * 24 * 60 * 60 * 1000
// // //             ).toISOString(), // Last 30 days
// // //             perPage: 1000,
// // //         }
// // //     );
// // //     const messages = await response.json();
// // //     return messages.records;
// // // }

// // async function findInitialMessages(conversationId: string): Promise<Message[]> {
// //     await platform.login({ jwt: process.env.RC_JWT });

// //     // First, get the conversation details
// //     const conversationResponse = await platform.get(
// //         `/team-messaging/v1/conversations/${conversationId}`
// //     );
// //     const conversationDetails = await conversationResponse.json();
// //     console.log(
// //         "Conversation details:",
// //         JSON.stringify(conversationDetails, null, 2)
// //     );

// //     // Now, get the messages for this conversation
// //     const messagesResponse = await platform.get(
// //         `/team-messaging/v1/conversations/${conversationId}/posts`,
// //         {
// //             recordCount: 1000, // Adjust as needed
// //         }
// //     );
// //     const messages = await messagesResponse.json();
// //     console.log("Conversation messages:", JSON.stringify(messages, null, 2));

// //     return messages.records;
// // }

// // async function handleNewMessage(messageDetails: any) {
// //     console.log("New message details:\n", messageDetails);
// //     console.log(
// //         `Handling new message:`,
// //         JSON.stringify(messageDetails, null, 2)
// //     );
// //     const { from, to, subject, conversationId } = messageDetails;
// //     const fromNumber = from.phoneNumber;
// //     const toNumber = to[0].phoneNumber;

// //     if (
// //         fromNumber === process.env.RC_PHONE_NUMBER &&
// //         toNumber === process.env.RC_PHONE_NUMBER
// //     ) {
// //         console.log("Internal message, ignoring");
// //         return;
// //     }

// //     console.log("Conversation ID:\n", conversationId);

// //     let sessionId = conversationId;
// //     console.log(`Session ID: ${sessionId}`);

// //     if (!sessions[sessionId]) {
// //         console.log(`No existing session found, determining roles`);
// //         const messages = await findInitialMessages(conversationId);
// //         console.log("Messages:\n", messages);
// //         const patientMessage = messages.find(
// //             (m: Message) =>
// //                 m.subject.startsWith("Hello") &&
// //                 m.subject.includes("thank you for registering") &&
// //                 m.direction === "Outbound"
// //         );
// //         const doctorMessage = messages.find(
// //             (m: Message) =>
// //                 m.subject.startsWith("Hello") &&
// //                 m.subject.includes(
// //                     "you have a new patient appointment suggestion"
// //                 ) &&
// //                 m.direction === "Outbound"
// //         );

// //         console.log("Doctor's message:\n", doctorMessage);
// //         console.log("Patient's message:\n", patientMessage);

// //         if (patientMessage && doctorMessage) {
// //             const patientNumber = patientMessage.to[0].phoneNumber;
// //             const doctorNumber = doctorMessage.to[0].phoneNumber;
// //             sessions[sessionId] = {
// //                 patient: patientNumber,
// //                 doctor: doctorNumber,
// //             };
// //             console.log(
// //                 `New session created: Patient ${patientNumber}, Doctor ${doctorNumber}`
// //             );
// //         } else {
// //             console.error("Couldn't determine roles from initial messages");
// //             return;
// //         }
// //     }

// //     const session = sessions[sessionId];
// //     console.log(`Session:`, JSON.stringify(session, null, 2));

// //     let targetNumber, prefix;
// //     if (fromNumber === session.patient) {
// //         targetNumber = session.doctor;
// //         prefix = "Patient:";
// //     } else if (fromNumber === session.doctor) {
// //         targetNumber = session.patient;
// //         prefix = "Doctor:";
// //     } else {
// //         console.error("Message from unknown number");
// //         return;
// //     }

// //     console.log(`Routing message to ${targetNumber}`);
// //     await sendSMS(targetNumber, `${prefix} ${subject}`);
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
// //                 }
// //                 console.log(`Message processed successfully`);
// //                 res.status(200).json({ status: "Message processed" });
// //             } catch (error) {
// //                 console.error("Error processing message:", error);
// //                 res.status(500).json({ error: "Failed to process message" });
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

import { ringCentralClient } from "@/lib/ringcentralClient";
import type { NextApiRequest, NextApiResponse } from "next";

interface MessageDetails {
    id: string;
    from: { phoneNumber: string };
    to: Array<{ phoneNumber: string }>;
    subject: string;
    direction: "Inbound" | "Outbound";
    // Add other properties as needed
}

// In-memory storage for team IDs (replace with a database in production)
const teamIds: { [key: string]: string } = {};

async function getMessageDetails(messageId: string): Promise<MessageDetails> {
    console.log(`Getting message details for ID: ${messageId}`);
    try {
        await ringCentralClient.login({ jwt: process.env.RC_JWT });
        const response = await ringCentralClient.get(
            `/restapi/v1.0/account/~/extension/~/message-store/${messageId}`
        );
        const data = await response.json();
        console.log(
            `Message details retrieved:`,
            JSON.stringify(data, null, 2)
        );
        return data;
    } catch (error) {
        console.error(`Error getting message details:`, error);
        throw error;
    }
}

async function sendTeamMessage(teamId: string, text: string): Promise<void> {
    console.log(`Sending message to team ${teamId}:`, text);
    try {
        await ringCentralClient.login({ jwt: process.env.RC_JWT });
        const response = await ringCentralClient.post(
            `/team-messaging/v1/chats/${teamId}/posts`,
            {
                text: text,
            }
        );
        console.log(`Message sent to team`);
    } catch (error) {
        console.error(`Error sending team message:`, error);
        throw error;
    }
}

async function handleNewMessage(messageDetails: MessageDetails) {
    const newMessageDetails = JSON.stringify(messageDetails, null, 2);

    console.log("Handling new message:", newMessageDetails);
    const { from, to, subject } = messageDetails;
    const fromNumber = from.phoneNumber;
    const toNumber = to[0].phoneNumber;

    if (
        fromNumber === process.env.RC_PHONE_NUMBER &&
        toNumber === process.env.RC_PHONE_NUMBER
    ) {
        console.log("Internal message, ignoring");
        return;
    }

    const teamId =
        teamIds[`${fromNumber}-${toNumber}`] ||
        teamIds[`${toNumber}-${fromNumber}`];

    if (!teamId) {
        console.error(
            "No team found for this conversation. Team should have been created during registration."
        );
        return;
    }

    try {
        await sendTeamMessage(teamId, `${fromNumber}: ${subject}`);
        console.log(`Message forwarded to team: ${teamId}`);
    } catch (error) {
        console.error("Error forwarding message to team:", error);
        throw error;
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log(`Received ${req.method} request`);
    console.log(`Headers:`, JSON.stringify(req.headers, null, 2));
    console.log(`Body:`, JSON.stringify(req.body, null, 2));

    if (req.method === "POST") {
        const validationToken = req.headers["validation-token"];

        if (validationToken) {
            console.log(`Received validation token: ${validationToken}`);
            res.setHeader("Validation-Token", validationToken as string);
            return res.status(200).send("OK");
        }

        const messageData = req.body;

        if (messageData && messageData.body && messageData.body.changes) {
            try {
                for (const change of messageData.body.changes) {
                    // console.log(
                    //     "Processing change:",
                    //     JSON.stringify(change, null, 2)
                    // );

                    // const messageId = change.newMessageId || change.messageId;
                    // if (!messageId) {
                    //     console.error("Message ID is undefined");
                    //     continue;
                    // }
                    // console.log(
                    //     `Processing change:`,
                    //     JSON.stringify(change, null, 2)
                    // );
                    // const messageId = change.newMessageId || change.messageId;
                    // if (!messageId) {
                    //     console.error("Message ID is undefined");
                    //     continue;
                    // }

                    // const messageDetails = await getMessageDetails(messageId);
                    // await handleNewMessage(messageDetails);
                    const changedObject = JSON.stringify(change, null, 2);
                    console.log(
                        "Change object:",
                        JSON.stringify(change, null, 2)
                    );

                    const newMessageDetails = JSON.parse(changedObject);
                    console.log("New message details:", newMessageDetails);
                    const retrievedMessageIDs = newMessageDetails.newMessageIds;
                    console.log("Retrieved message IDs:", retrievedMessageIDs);
                    const retrievedMessageID = retrievedMessageIDs[0];
                    console.log(
                        `Retrieved message ID 0: ${retrievedMessageID}`
                    );
                    const messageIDDetails =
                        await getMessageDetails(retrievedMessageID);
                    console.log("Message ID details:", messageIDDetails);

                    // await handleNewMessage(retrievedMessageID);
                    await handleNewMessage(messageIDDetails);

                    const messageDetails =
                        await getMessageDetails(retrievedMessageID);
                    await handleNewMessage(messageDetails);
                }
                console.log(`Message processed successfully`);
                res.status(200).json({ status: "Message processed" });
            } catch (error) {
                console.error("Error processing message:", error);
                res.status(500).json({
                    error: "Failed to process message",
                    details: error,
                });
            }
        } else {
            console.error("Invalid message data");
            res.status(400).json({ error: "Invalid message data" });
        }
    } else {
        console.log(`Method ${req.method} not allowed`);
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
