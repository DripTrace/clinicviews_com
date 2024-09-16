import { ringCentralClient } from "@/lib/ringcentralClient";

export async function createSubscription() {
    try {
        await ringCentralClient.login({ jwt: process.env.RC_JWT });

        const response = await ringCentralClient.post(
            "/restapi/v1.0/subscription",
            {
                eventFilters: [
                    "/restapi/v1.0/account/~/extension/~/message-store",
                ],
                deliveryMode: {
                    transportType: "WebHook",
                    address:
                        // Replace with your webhook URL
                        `${process.env.WEBHOOK_URL}/api/webhooks/ringcentral/sms`,
                },
                expiresIn: 3600, // Adjust the subscription duration as needed
            }
        );

        return response.json();
    } catch (error) {
        console.error("Error creating subscription:", error);
        throw error;
    }
}
