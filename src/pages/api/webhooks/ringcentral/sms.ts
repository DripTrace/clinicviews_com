import type { NextApiRequest, NextApiResponse } from "next";
import { SDK } from "@ringcentral/sdk";
import { v4 as uuid } from "uuid";
import { initial } from "lodash";

const rcsdk = new SDK({
    server: process.env.RC_SERVER_URL,
    clientId: process.env.RC_CLIENT_ID,
    clientSecret: process.env.RC_CLIENT_SECRET,
});

const platform = rcsdk.platform();

const sessions: { [key: string]: { patient: string; doctor: string } } = {};

function formatPhoneNumber(phone: string | number): string {
    const phoneString = String(phone).replace(/\D/g, "");
    const formattedPhoneNumber = phoneString.startsWith("1")
        ? `+1${phoneString}`
        : `+1${phoneString}`;

    if (!/^\+1\d{10}$/.test(formattedPhoneNumber)) {
        throw new Error(`Invalid phone number format: ${formattedPhoneNumber}`);
    }
    return formattedPhoneNumber;
}

async function listMessages(phoneNumber: string) {
    try {
        await platform.login({ jwt: process.env.RC_JWT });
        const response = await platform.get(
            `/restapi/v1.0/account/~/extension/~/message-store`,
            { phoneNumber, direction: "Inbound" }
        );
        return response.json();
    } catch (error) {
        console.error("Error listing messages:", error);
        throw error;
    }
}

async function getMessageDetails(messageId: string) {
    try {
        await platform.login({ jwt: process.env.RC_JWT });
        const response = await platform.get(
            `/restapi/v1.0/account/~/extension/~/message-store/${messageId}`
        );
        return response.json();
    } catch (error) {
        console.error("Error fetching message details:", error);
        throw error;
    }
}

async function sendSMS(to: string | number, message: string) {
    try {
        await platform.login({ jwt: process.env.RC_JWT });
        const formattedPhoneNumber = formatPhoneNumber(to);

        const resp = await platform.post(
            "/restapi/v1.0/account/~/extension/~/sms",
            {
                from: { phoneNumber: process.env.RC_PHONE_NUMBER },
                to: [{ phoneNumber: formattedPhoneNumber }],
                text: message,
            }
        );

        return resp.json();
    } catch (error) {
        console.error("Error sending SMS:", error);
        throw error;
    }
}

function identifySender(message: string): "doctor" | "patient" | null {
    if (message.startsWith("Hello Dr.")) {
        return "doctor";
    } else if (message.startsWith("Hello ")) {
        return "patient";
    }
    return null;
}

async function handleNewMessage(messageDetails: any) {
    const { from, to, subject } = messageDetails;
    const fromNumber = from.phoneNumber;
    const toNumber = to[0].phoneNumber;

    let sessionId = `${fromNumber}-${toNumber}`;
    let targetNumber: string | undefined;

    if (sessions[sessionId]) {
        const session = sessions[sessionId];
        targetNumber =
            session.doctor === fromNumber ? session.patient : session.doctor;
    } else {
        // Fetch the list of messages to determine the initial message
        const messages = await listMessages(fromNumber);
        console.log("Messages:", messages);
        const lastPageUri = await messages.navigation.lastPage.uri;
        console.log("Last page URI:", lastPageUri);
        const lastPageResponse = await platform.get(lastPageUri);
        const lastPageData = await lastPageResponse.json();
        console.log("Last page data:", lastPageData);
        const lastPageMessage =
            lastPageData.records[lastPageData.records.length - 1];
        console.log("Last page messages:", lastPageMessage);
        // const firstMessagSent = await getMessageDetails(lastPageMessages.id);
        // console.log("First message sent:", firstMessagSent);
        // const firstConversation = await

        const initialMessage = messages.records.find(
            (msg: any) => msg.from.phoneNumber === fromNumber
        );

        // console.log("Initial message:\n", initialMessage);

        if (!initialMessage) {
            console.error("Initial message not found");
            return;
        }
        console.log("Latest message:\n", initialMessage);
        // const initialMessageDetails = await getMessageDetails(
        //     initialMessage.id
        // );

        // console.log("Initial message details:\n", initialMessageDetails);

        const initialMessageType = identifySender(initialMessage.subject);
        if (!initialMessageType) {
            console.error("Unknown sender type");
            return;
        }

        sessionId = uuid();
        if (initialMessageType === "doctor") {
            sessions[sessionId] = { doctor: fromNumber, patient: toNumber };
            targetNumber = toNumber;
        } else if (initialMessageType === "patient") {
            sessions[sessionId] = { doctor: toNumber, patient: fromNumber };
            targetNumber = toNumber;
        }
    }

    if (targetNumber) {
        await sendSMS(targetNumber, subject);
    } else {
        console.error("Session not found");
    }
}

async function getLastPageMessages(phoneNumber: string) {
    try {
        await platform.login({ jwt: process.env.RC_JWT });
        const response = await platform.get(
            `/restapi/v1.0/account/~/extension/~/message-store`,
            { phoneNumber, direction: "Inbound" }
        );
        const { navigation, records } = await response.json();

        const lastPageUri = navigation.lastPage.uri;
        const lastPageResponse = await platform.get(lastPageUri);
        const lastPageData = await lastPageResponse.json();

        return lastPageData.records.pop();
    } catch (error) {
        console.error("Error fetching last page of messages:", error);
        throw error;
    }
}

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

        const retrievedData = JSON.stringify(messageData, null, 2);

        console.log("Received message data:", retrievedData);

        if (messageData && messageData.body && messageData.body.changes) {
            try {
                for (const change of messageData.body.changes) {
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

                    await handleNewMessage(messageIDDetails);
                }
                res.status(200).json({ status: "Message processed" });
            } catch (error) {
                console.error("Error processing message:", error);
                res.status(500).json({ error: "Failed to process message" });
            }
        } else {
            res.status(400).json({ error: "Invalid message data" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
