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
