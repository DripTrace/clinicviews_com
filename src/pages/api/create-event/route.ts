// import { NextApiRequest, NextApiResponse } from "next";
// import fetch from "node-fetch";

// interface TokenResponse {
//     access_token: string;
//     error_description?: string;
// }

// interface ErrorResponse {
//     error: {
//         code: string;
//         message: string;
//         innerError?: {
//             date: string;
//             request_id: string;
//             client_request_id: string;
//         };
//     };
// }

// async function getAccessToken(): Promise<string> {
//     const tokenEndpoint = `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID}/oauth2/v2.0/token`;
//     const clientId = `${process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID}`;
//     const clientSecret = `${process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_SECRET}`;
//     const requestBody = new URLSearchParams({
//         grant_type: "client_credentials",
//         client_id: clientId,
//         client_secret: clientSecret,
//         scope: "https://graph.microsoft.com/.default",
//     });

//     const response = await fetch(tokenEndpoint, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//         },
//         body: requestBody.toString(),
//     });

//     if (!response.ok) {
//         const errorData = (await response.json()) as ErrorResponse;
//         throw new Error(
//             `Failed to retrieve access token: ${
//                 errorData.error.message || "Unknown error"
//             }`
//         );
//     }

//     const data = (await response.json()) as TokenResponse;
//     return data.access_token;
// }

// function formatTo12HourTime(dateString: string): string {
//     const date = new Date(dateString);
//     const hours = date.getHours();
//     const minutes = date.getMinutes();
//     const ampm = hours >= 12 ? "PM" : "AM";
//     const formattedHours = hours % 12 || 12;
//     const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
//     return `${formattedHours}:${formattedMinutes} ${ampm}`;
// }

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     if (req.method !== "POST") {
//         return res.status(405).json({ error: "Method Not Allowed" });
//     }

//     try {
//         const { patientName, email, appointmentDate, appointmentTime } =
//             req.body;

//         const appointmentDateTime = `${appointmentDate}T${appointmentTime}:00.000`;
//         const accessToken = await getAccessToken();

//         const eventDetails = {
//             subject: `Appointment with ${patientName}`,
//             body: {
//                 contentType: "HTML",
//                 content: `Appointment details for ${patientName} on ${appointmentDate} at ${formatTo12HourTime(
//                     appointmentDateTime
//                 )}.`,
//             },
//             start: {
//                 dateTime: appointmentDateTime,
//                 timeZone: "Pacific Standard Time",
//             },
//             end: {
//                 dateTime: new Date(
//                     new Date(appointmentDateTime).getTime() + 60 * 60 * 1000
//                 ).toISOString(),
//                 timeZone: "Pacific Standard Time",
//             },
//             attendees: [
//                 {
//                     emailAddress: {
//                         address: email,
//                         name: patientName,
//                     },
//                     type: "required",
//                 },
//                 {
//                     emailAddress: {
//                         address: "rpalm@driptrace.io",
//                         name: "FSClinicals Doctor",
//                     },
//                     type: "required",
//                 },
//             ],
//         };

//         console.log("Event details:", JSON.stringify(eventDetails, null, 2));

//         const createEventResponse = await fetch(
//             `https://graph.microsoft.com/v1.0/users/fsclinicals-com@mail.clinicviews.com/calendar/events`,
//             {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(eventDetails),
//             }
//         );

//         if (!createEventResponse.ok) {
//             const errorData =
//                 (await createEventResponse.json()) as ErrorResponse;
//             throw new Error(
//                 `Failed to create calendar event: ${
//                     errorData.error.message || "Unknown error"
//                 }`
//             );
//         }

//         const eventResult = await createEventResponse.json();
//         res.status(200).json({
//             message: "Event created successfully",
//             event: eventResult,
//         });
//     } catch (error: unknown) {
//         console.error("Error creating event:", error);
//         if (error instanceof Error) {
//             res.status(500).json({
//                 error: "Error creating event",
//                 details: error.message,
//             });
//         } else {
//             res.status(500).json({
//                 error: "Unknown error occurred",
//             });
//         }
//     }
// }

import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { patientName, email, appointmentDate, appointmentTime } = req.body;

    if (!patientName || !email || !appointmentDate || !appointmentTime) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    if (process.env.NODE_ENV === "development") {
        process.env.APP_URL = process.env.DEV_APP_URL;
    } else {
        process.env.APP_URL = process.env.PROD_APP_URL;
    }

    // const tokenResponse = await fetch(
    //     `${process.env.APP_URL}/api/get-token/route`
    // );
    // const { accessToken } = (await tokenResponse.json()) as {
    //     accessToken: string;
    // };

    try {
        const tokenResponse = await fetch(
            `${process.env.APP_URL}/api/get-token/route`
        );
        const { accessToken } = (await tokenResponse.json()) as {
            accessToken: string;
        };

        const appointmentDateTime = new Date(
            `${appointmentDate}T${appointmentTime}:00.000Z`
        );
        const formattedAppointmentTime = appointmentDateTime.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            }
        );

        const eventDetails = {
            subject: `Appointment with ${patientName}`,
            body: {
                contentType: "HTML",
                content: `Appointment details for ${patientName} on ${appointmentDate} at ${formattedAppointmentTime}.`,
            },
            start: {
                dateTime: appointmentDateTime.toISOString(),
                timeZone: "Pacific Standard Time",
            },
            end: {
                dateTime: new Date(
                    appointmentDateTime.getTime() + 60 * 60 * 1000
                ).toISOString(),
                timeZone: "Pacific Standard Time",
            },
            attendees: [
                {
                    emailAddress: {
                        address: email,
                        name: patientName,
                    },
                    type: "required",
                },
                {
                    emailAddress: {
                        address: "rpalm@driptrace.io",
                        name: "FSClinicals Doctor",
                    },
                    type: "required",
                },
            ],
        };

        const eventResponse = await fetch(
            `https://graph.microsoft.com/v1.0/users/fsclinicals-com@mail.clinicviews.com/calendar/events`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(eventDetails),
            }
        );

        if (!eventResponse.ok) {
            const errorData = await eventResponse.json();
            console.error("Event creation error:", errorData);
            return res
                .status(500)
                .json({ error: "Failed to create calendar event" });
        }

        const eventResult = await eventResponse.json();
        console.log("Event created successfully:", eventResult);

        res.status(200).json({ message: "Event created successfully" });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({
            error: "Error creating event",
            details: (error as any).message,
        });
    }
}
