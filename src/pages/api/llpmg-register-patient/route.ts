// import type { NextApiRequest, NextApiResponse } from "next";
// import { IncomingForm } from "formidable";
// import nodemailer from "nodemailer";
// import { renderToString } from "react-dom/server";
// import LLPMGEmailTemplate from "@/components/LLPMG/LLPMGEmailTemplate";
// import { SDK } from "@ringcentral/sdk";

// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

// const rcsdk = new SDK({
//     server: process.env.RC_SERVER_URL,
//     clientId: process.env.RC_CLIENT_ID,
//     clientSecret: process.env.RC_CLIENT_SECRET,
// });

// const platform = rcsdk.platform();

// async function sendSMS(to: string | number, message: string) {
//     try {
//         await platform.login({ jwt: process.env.RC_JWT });

//         // Convert to string and ensure it's in E.164 format
//         const phoneString = String(to);
//         const formattedPhoneNumber = phoneString.startsWith("+1")
//             ? phoneString
//             : `+1${phoneString.replace(/\D/g, "")}`;

//         // Validate the formatted number
//         if (!/^\+1\d{10}$/.test(formattedPhoneNumber)) {
//             throw new Error(
//                 `Invalid phone number format: ${formattedPhoneNumber}`
//             );
//         }

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

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     if (req.method !== "POST") {
//         return res.status(405).json({ error: "Method not allowed" });
//     }

//     try {
//         const form = new IncomingForm();
//         const [fields, files] = await new Promise<[any, any]>(
//             (resolve, reject) => {
//                 form.parse(req, (err, fields, files) => {
//                     if (err) reject(err);
//                     resolve([fields, files]);
//                 });
//             }
//         );

//         const { name, email, phone, reason, suggestedAppointment } = fields;
//         const file = files.pdf ? files.pdf[0] : null;

//         let fileContentBase64 = "";
//         if (file) {
//             const fileContent = await new Promise<Buffer>((resolve, reject) => {
//                 const chunks: Buffer[] = [];
//                 const readStream = require("fs").createReadStream(
//                     file.filepath
//                 );
//                 readStream.on("data", (chunk: Buffer) => chunks.push(chunk));
//                 readStream.on("error", reject);
//                 readStream.on("end", () => resolve(Buffer.concat(chunks)));
//             });
//             fileContentBase64 = fileContent.toString("base64");
//         }

//         let emailTransporter = nodemailer.createTransport({
//             host: process.env.PROTONMAIL_HOST,
//             port: Number(process.env.PROTONMAIL_PORT),
//             secure: false,
//             auth: {
//                 user: process.env.PROTONMAIL_SENDER,
//                 pass: process.env.PROTONMAIL_PASSWORD,
//             },
//             tls: {
//                 rejectUnauthorized: false,
//             },
//         });

//         const date = new Date();
//         const formattedDate = date.toLocaleString("en-US", {
//             timeZoneName: "short",
//         });

//         const patientEmailHtml = renderToString(
//             LLPMGEmailTemplate({
//                 name,
//                 email,
//                 phone,
//                 reason,
//                 suggestedAppointment,
//                 isDoctor: false,
//             })
//         );
//         const doctorEmailHtml = renderToString(
//             LLPMGEmailTemplate({
//                 name,
//                 email,
//                 phone,
//                 reason,
//                 suggestedAppointment,
//                 isDoctor: true,
//             })
//         );

//         await emailTransporter.sendMail({
//             from: `"${process.env.PROTONMAIL_NAME}" <${process.env.PROTONMAIL_SENDER}>`,
//             to: email,
//             subject: `Registration Confirmation - ${formattedDate}`,
//             html: patientEmailHtml,
//         });

//         await emailTransporter.sendMail({
//             from: `"${process.env.PROTONMAIL_NAME}" <${process.env.PROTONMAIL_SENDER}>`,
//             to: process.env.PROTONMAIL_RECIPIENT,
//             subject: `New Patient Registration Details - ${formattedDate}`,
//             html: doctorEmailHtml,
//             attachments: file
//                 ? [
//                       {
//                           filename: `new-patient-registration_${formattedDate}.pdf`,
//                           content: fileContentBase64,
//                           encoding: "base64",
//                       },
//                   ]
//                 : [],
//         });

//         const smsMessage = `Thank you for registering with Loma Linda Psychiatric Medical Group. Your appointment suggestion for ${suggestedAppointment} has been received. We will contact you soon to confirm.`;
//         await sendSMS(phone, smsMessage);

//         res.status(200).json({ message: "Registration successful" });
//     } catch (error) {
//         console.error("Error in API route:", error);
//         res.status(500).json({
//             error: "An unknown error occurred",
//             details: (error as Error).message,
//         });
//     }
// }

import type { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, File } from "formidable";
import nodemailer from "nodemailer";
import { renderToString } from "react-dom/server";
import LLPMGEmailTemplate from "@/components/LLPMG/LLPMGEmailTemplate";
import { SDK } from "@ringcentral/sdk";
import ical from "ical-generator";
import { ICalAttendeeRole, ICalAttendeeStatus } from "ical-generator";
import fs from "fs/promises";
import { createWriteStream } from "fs";
import archiver from "archiver";
import path from "path";

export const config = {
    api: {
        bodyParser: false,
    },
};

const rcsdk = new SDK({
    server: process.env.RC_SERVER_URL,
    clientId: process.env.RC_CLIENT_ID,
    clientSecret: process.env.RC_CLIENT_SECRET,
});

const platform = rcsdk.platform();

async function sendSMS(to: string | number, message: string) {
    try {
        await platform.login({ jwt: process.env.RC_JWT });

        // Convert to string and ensure it's in E.164 format
        const phoneString = String(to);
        const formattedPhoneNumber = phoneString.startsWith("+1")
            ? phoneString
            : `+1${phoneString.replace(/\D/g, "")}`;

        // Validate the formatted number
        if (!/^\+1\d{10}$/.test(formattedPhoneNumber)) {
            throw new Error(
                `Invalid phone number format: ${formattedPhoneNumber}`
            );
        }

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

function formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });
}

async function sendEmailWithCalendar(
    transporter: nodemailer.Transporter,
    to: string,
    subject: string,
    content: string,
    calendarEvent: any,
    attachments?: nodemailer.SendMailOptions["attachments"]
) {
    const mailOptions: nodemailer.SendMailOptions = {
        from: `"${process.env.PROTONMAIL_NAME}" <${process.env.PROTONMAIL_SENDER}>`,
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

    await transporter.sendMail(mailOptions);
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const form = new IncomingForm();
        const [fields, files] = await new Promise<[any, any]>(
            (resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    if (err) reject(err);
                    resolve([fields, files]);
                });
            }
        );

        const { name, email, phone, reason, suggestedAppointment } = fields;
        const file = files.pdf ? files.pdf[0] : null;

        const formattedAppointmentTime = formatDateTime(suggestedAppointment);

        // Create iCal event
        const calendarEvent = ical({
            prodId: { company: "LLPMG", product: "Appointment" },
            name: "LLPMG Appointment",
        });

        calendarEvent.createEvent({
            start: new Date(suggestedAppointment),
            end: new Date(
                new Date(suggestedAppointment).getTime() + 60 * 60 * 1000
            ), // 1 hour duration
            summary: `Appointment with ${name}`,
            description: `Appointment for ${name}\nReason: ${reason}`,
            location: "Loma Linda Psychiatric Medical Group",
            url: "https://lomalindapsych.com",
            organizer: {
                name: "LLPMG",
                email: process.env.PROTONMAIL_SENDER,
            },
            attendees: [
                {
                    name: name,
                    email: email,
                    rsvp: true,
                    role: ICalAttendeeRole.REQ,
                    status: ICalAttendeeStatus.NEEDSACTION,
                },
            ],
        });

        let emailTransporter = nodemailer.createTransport({
            host: process.env.PROTONMAIL_HOST,
            port: Number(process.env.PROTONMAIL_PORT),
            secure: false,
            auth: {
                user: process.env.PROTONMAIL_SENDER,
                pass: process.env.PROTONMAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const patientEmailHtml = renderToString(
            LLPMGEmailTemplate({
                name,
                email,
                phone,
                reason,
                suggestedAppointment: formattedAppointmentTime,
                isDoctor: false,
            })
        );
        const doctorEmailHtml = renderToString(
            LLPMGEmailTemplate({
                name,
                email,
                phone,
                reason,
                suggestedAppointment: formattedAppointmentTime,
                isDoctor: true,
            })
        );

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

        // Send email to patient
        await sendEmailWithCalendar(
            emailTransporter,
            email,
            `Registration Confirmation - ${formattedAppointmentTime}`,
            patientEmailHtml,
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

        // Send email to LLPMG
        await sendEmailWithCalendar(
            emailTransporter,
            process.env.PROTONMAIL_RECIPIENT!,
            `New Patient Registration Details - ${formattedAppointmentTime}`,
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

        const smsMessage = `Hello ${name}, thank you for registering with Loma Linda Psychiatric Medical Group. Your appointment suggestion for ${formattedAppointmentTime} has been received. We will contact you soon to confirm.`;
        await sendSMS(phone, smsMessage);

        res.status(200).json({ message: "Registration successful" });
    } catch (error) {
        console.error("Error in API route:", error);
        res.status(500).json({
            error: "An unknown error occurred",
            details: (error as Error).message,
        });
    }
}
