// //first share attempt
// import type { NextApiRequest, NextApiResponse } from "next";

// interface AppointmentResponse {
//     id: string;
//     subject: string;
//     start: {
//         dateTime: string;
//         timeZone: string;
//     };
//     end: {
//         dateTime: string;
//         timeZone: string;
//     };
//     attendees: {
//         emailAddress: {
//             address: string;
//             name: string;
//         };
//         type: string;
//     }[];
// }

// interface ErrorResponse {
//     error: {
//         code: string;
//         message: string;
//     };
// }

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     if (req.method !== "POST") {
//         return res.status(405).json({ error: "Method Not Allowed" });
//     }

//     const { accessToken, patientName, email, appointmentDateTime } = req.body;

//     if (!accessToken || !patientName || !email || !appointmentDateTime) {
//         return res.status(400).json({ error: "Missing required fields" });
//     }

//     const eventUrl = `https://graph.microsoft.com/v1.0/users/fsclinicals-com@mail.clinicviews.com/calendar/events`;

//     try {
//         const appointmentResponse = await fetch(eventUrl, {
//             method: "POST",
//             headers: {
//                 Authorization: `Bearer ${accessToken}`,
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 subject: `Appointment with ${patientName}`,
//                 start: {
//                     dateTime: appointmentDateTime,
//                     timeZone: "Pacific Standard Time",
//                 },
//                 end: {
//                     dateTime: new Date(
//                         new Date(appointmentDateTime).getTime() + 60 * 60 * 1000
//                     ).toISOString(),
//                     timeZone: "Pacific Standard Time",
//                 },
//                 attendees: [
//                     {
//                         emailAddress: {
//                             address: email,
//                             name: patientName,
//                         },
//                         type: "required",
//                     },
//                     {
//                         emailAddress: {
//                             address: "rpalm@driptrace.io",
//                             name: "Dr. Steven",
//                         },
//                         type: "required",
//                     },
//                 ],
//                 allowNewTimeProposals: true,
//             }),
//         });

//         if (!appointmentResponse.ok) {
//             const errorData =
//                 (await appointmentResponse.json()) as ErrorResponse;
//             console.error("Appointment creation error:", errorData);
//             throw new Error(
//                 `Failed to create appointment: ${
//                     errorData.error?.message || "Unknown error"
//                 }`
//             );
//         }

//         const appointmentResult =
//             (await appointmentResponse.json()) as AppointmentResponse;
//         res.status(200).json(appointmentResult);
//     } catch (error) {
//         console.error("Error creating appointment:", error);
//         res.status(500).json({
//             error: "Error creating appointment",
//             details: (error as Error).message,
//         });
//     }
// }

import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { IncomingForm, File } from "formidable";
import fs from "fs/promises";
import { createWriteStream } from "fs";
import archiver from "archiver";
import path from "path";
import { renderToString } from "react-dom/server";
import EmailTemplate from "@/components/FSClinicals/EmailTemplate";
import ical from "ical-generator";
import { ICalAttendeeRole, ICalAttendeeStatus } from "ical-generator";

export const config = {
    api: {
        bodyParser: false,
    },
};

const local = process.env;
export const devMode = local.NODE_ENV === "development";
export const smtpAuthUser =
    local.FSCLINICALS_CLINICVIEWS_USER_ENDPOINT as string;
export const smtpAuthPass =
    local.FSCLINICALS_CLINICVIEWS_USER_PASSWORD as string;
export const smtpRecipient = devMode
    ? (local.RUSSELLPALMA_USER_ENDPOINT as string)
    : (local.FSCLINICALS_USER_ENDPOINT as string);
export const smtpHost = local.OFFICE365_SMTP_DOMAIN as string;
export const smtpPort = local.OFFICE365_SMTP_PORT as string;

async function compressFile(file: File): Promise<string> {
    const zipFilePath = path.join("/tmp", `${file.originalFilename}.zip`);
    const output = createWriteStream(zipFilePath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    return new Promise((resolve, reject) => {
        output.on("close", () => resolve(zipFilePath));
        archive.on("error", reject);
        archive.pipe(output);
        archive.file(file.filepath, { name: file.originalFilename ?? "file" });
        archive.finalize();
    });
}

function formatTo12HourTime(dateString: string): string {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

async function sendEmailWithCalendar(
    transporter: nodemailer.Transporter,
    to: string,
    subject: string,
    content: string,
    calendarEvent: any,
    attachments?: nodemailer.SendMailOptions["attachments"]
) {
    console.log(`Attempting to send email to ${to}`);

    const mailOptions: nodemailer.SendMailOptions = {
        from: `"FSClinicals Mail" <${smtpAuthUser}>`,
        to,
        subject,
        html: content,
        attachments: [
            ...(attachments || []),
            {
                filename: "event.ics",
                content: calendarEvent.toString(),
                contentType: "text/calendar",
            },
        ],
        alternatives: [
            {
                contentType: "text/calendar",
                content: Buffer.from(calendarEvent.toString()),
                contentDisposition: "inline",
            },
        ],
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(
            `Email sent successfully to ${to}. Message ID: ${info.messageId}`
        );
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        throw error;
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log("Received request to /api/register-patient");
    console.log("Headers:", req.headers);

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const form = new IncomingForm();

    try {
        const [fields, files] = await new Promise<[any, any]>(
            (resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    if (err) reject(err);
                    resolve([fields, files]);
                });
            }
        );

        console.log("Received form data:", fields);
        console.log("Received files:", files);

        const { name, email, phone, reason, appointmentDate, appointmentTime } =
            fields;
        const file = files.pdf ? files.pdf[0] : null;

        const appointmentDateTime = new Date(
            `${appointmentDate}T${appointmentTime}`
        );
        const formattedAppointmentTime = formatTo12HourTime(
            appointmentDateTime.toISOString()
        );

        console.log("Parsed form data:", {
            name,
            email,
            phone,
            reason,
            appointmentDate,
            appointmentTime,
            appointmentDateTime,
            formattedAppointmentTime,
        });

        // Create iCal event
        const calendarEvent = ical({
            prodId: { company: "FSClinicals", product: "Appointment" },
            name: "FSClinicals Appointment",
        });

        calendarEvent.createEvent({
            start: appointmentDateTime,
            end: new Date(appointmentDateTime.getTime() + 60 * 60 * 1000), // 1 hour duration
            summary: `Appointment with ${name}`,
            description: `Appointment details for ${name} on ${appointmentDate} at ${formattedAppointmentTime}.\nReason: ${reason}`,
            location: "FSClinicals Office",
            url: "https://fsclinicals.com",
            organizer: {
                name: "FSClinicals Connect",
                email: smtpRecipient,
            },
            attendees: [
                {
                    name,
                    email,
                    rsvp: true,
                    role: ICalAttendeeRole.REQ,
                    status: ICalAttendeeStatus.NEEDSACTION,
                },
            ],
        });

        console.log("Creating nodemailer transporter with following config:");
        console.log({
            host: smtpHost,
            port: parseInt(smtpPort!, 10),
            secure: false,
            auth: {
                user: smtpAuthUser,
                pass: "********", // Mask the password in logs
            },
        });

        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: parseInt(smtpPort!, 10),
            secure: false,
            auth: {
                user: smtpAuthUser,
                pass: smtpAuthPass,
            },
            tls: {
                ciphers: "SSLv3",
                rejectUnauthorized: false,
            },
        });

        // Verify SMTP connection configuration
        try {
            await transporter.verify();
            console.log("SMTP connection verified successfully");
        } catch (error) {
            console.error("SMTP connection verification failed:", error);
            throw new Error("Failed to establish SMTP connection");
        }

        let fileContent, fileSize;
        if (file) {
            const zipFilePath = await compressFile(file);
            fileContent = await fs.readFile(zipFilePath);
            fileSize = fileContent.length;

            console.log("Compressed file details:", {
                name: `${file.originalFilename}.zip`,
                size: fileSize,
            });
        }

        const patientEmailHtml = renderToString(
            EmailTemplate({
                name,
                email,
                phone,
                reason,
                appointmentDate,
                appointmentTime: formattedAppointmentTime,
                isDoctor: false,
            })
        );

        const doctorEmailHtml = renderToString(
            EmailTemplate({
                name,
                email,
                phone,
                reason,
                appointmentDate,
                appointmentTime: formattedAppointmentTime,
                isDoctor: true,
            })
        );

        // Send email to doctor
        await sendEmailWithCalendar(
            transporter,
            smtpRecipient,
            `New Patient Registration and Appointment`,
            doctorEmailHtml,
            calendarEvent,
            file
                ? [
                      {
                          filename: `${file.originalFilename}.zip`,
                          content: fileContent,
                      },
                  ]
                : undefined
        );

        // Send email to patient
        await sendEmailWithCalendar(
            transporter,
            email,
            `Registration Confirmation`,
            patientEmailHtml,
            calendarEvent
        );

        res.status(200).json({
            message: "Patient registered successfully",
        });
    } catch (error) {
        console.error("Error in patient registration process:", error);
        res.status(500).json({
            error: "Error processing patient registration",
            details: (error as Error).message,
        });
    }
}
