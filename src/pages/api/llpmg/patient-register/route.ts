// // // src/app/api/llpmg/patient-register/route.ts

// // import { promises as fs } from "fs";
// // import { NextApiRequest, NextApiResponse } from "next";
// // import nodemailer from "nodemailer";
// // import { renderToString } from "react-dom/server";
// // import LLPMGEmailTemplate from "@/components/LLPMG/LLPMGEmailTemplate";
// // import { SDK } from "@ringcentral/sdk";
// // import ical from "ical-generator";
// // import { ICalAttendeeRole, ICalAttendeeStatus } from "ical-generator";
// // import path from "path";
// // import archiver from "archiver";
// // import { createWriteStream } from "fs";
// // import { IncomingForm, File } from "formidable";

// // const rcsdk = new SDK({
// //     server: process.env.RC_SERVER_URL,
// //     clientId: process.env.RC_CLIENT_ID,
// //     clientSecret: process.env.RC_CLIENT_SECRET,
// // });

// // const platform = rcsdk.platform();

// // async function sendMMS(
// //     to: string | number,
// //     message: string,
// //     attachment?: Buffer
// // ) {
// //     try {
// //         await platform.login({ jwt: process.env.RC_JWT });

// //         const phoneString = String(to);
// //         const formattedPhoneNumber = phoneString.startsWith("+1")
// //             ? phoneString
// //             : `+1${phoneString.replace(/\D/g, "")}`;

// //         if (!/^\+1\d{10}$/.test(formattedPhoneNumber)) {
// //             throw new Error(
// //                 `Invalid phone number format: ${formattedPhoneNumber}`
// //             );
// //         }

// //         const messageParams: any = {
// //             from: { phoneNumber: process.env.RC_PHONE_NUMBER },
// //             to: [{ phoneNumber: formattedPhoneNumber }],
// //             text: message,
// //         };

// //         if (attachment) {
// //             messageParams.attachments = [
// //                 {
// //                     filename: "registration.pdf",
// //                     content: attachment.toString("base64"),
// //                     contentType: "application/pdf",
// //                 },
// //             ];
// //         }

// //         const resp = await platform.post(
// //             "/restapi/v1.0/account/~/extension/~/mms",
// //             messageParams
// //         );

// //         return resp.json();
// //     } catch (error) {
// //         console.error("Error sending MMS:", error);
// //         throw error;
// //     }
// // }

// // async function getMessage(messageId: string) {
// //     try {
// //         await platform.login({ jwt: process.env.RC_JWT });

// //         const resp = await platform.get(
// //             `/restapi/v1.0/account/~/extension/~/message-store/${messageId}`
// //         );
// //         return resp.json();
// //     } catch (error) {
// //         console.error("Error retrieving message:", error);
// //         throw error;
// //     }
// // }

// // async function compressFile(
// //     filePath: string,
// //     originalFilename: string
// // ): Promise<string> {
// //     const zipFilePath = path.join("/tmp", `${originalFilename}.zip`);
// //     const output = createWriteStream(zipFilePath);
// //     const archive = archiver("zip", { zlib: { level: 9 } });

// //     return new Promise((resolve, reject) => {
// //         output.on("close", () => resolve(zipFilePath));
// //         archive.on("error", reject);
// //         archive.pipe(output);
// //         archive.file(filePath, { name: originalFilename });
// //         archive.finalize();
// //     });
// // }

// // function formatDateTime(dateString: string): string {
// //     const date = new Date(dateString);
// //     return date.toLocaleString("en-US", {
// //         weekday: "long",
// //         year: "numeric",
// //         month: "long",
// //         day: "numeric",
// //         hour: "numeric",
// //         minute: "numeric",
// //         hour12: true,
// //     });
// // }

// // // async function sendEmailWithCalendar(
// // //     transporter: nodemailer.Transporter,
// // //     to: string,
// // //     subject: string,
// // //     content: string,
// // //     calendarEvent: any,
// // //     attachments?: nodemailer.SendMailOptions["attachments"]
// // // ) {
// // //     const mailOptions: nodemailer.SendMailOptions = {
// // //         from: `"${process.env.PROTONMAIL_NAME}" <${process.env.PROTONMAIL_SENDER}>`,
// // //         to,
// // //         subject,
// // //         html: content,
// // //         attachments: [
// // //             ...(attachments || []),
// // //             {
// // //                 filename: "event.ics",
// // //                 content: calendarEvent.toString(),
// // //                 contentType: "text/calendar",
// // //             },
// // //         ],
// // //         alternatives: [
// // //             {
// // //                 contentType: "text/calendar",
// // //                 content: Buffer.from(calendarEvent.toString()),
// // //                 contentDisposition: "inline",
// // //             },
// // //         ],
// // //     };

// // //     try {
// // //         await transporter.sendMail(mailOptions);
// // //     } catch (error) {
// // //         console.error("Error sending email:", error);
// // //         throw error;
// // //     }
// // // }

// // async function sendEmailWithCalendar(
// //     transporter: nodemailer.Transporter,
// //     to: string,
// //     subject: string,
// //     content: string,
// //     calendarEvent: any,
// //     attachments?: nodemailer.SendMailOptions["attachments"]
// // ) {
// //     const mailOptions: nodemailer.SendMailOptions = {
// //         from: `"${process.env.PROTONMAIL_NAME}" <${process.env.PROTONMAIL_SENDER}>`,
// //         to,
// //         subject,
// //         html: content,
// //         attachments: [
// //             ...(attachments || []),
// //             {
// //                 filename: "event.ics",
// //                 content: calendarEvent.toString(),
// //                 contentType: "text/calendar",
// //             },
// //         ],
// //         alternatives: [
// //             {
// //                 contentType: "text/calendar",
// //                 content: Buffer.from(calendarEvent.toString()),
// //                 contentDisposition: "inline",
// //             },
// //         ],
// //     };

// //     try {
// //         await transporter.sendMail(mailOptions);
// //     } catch (error) {
// //         console.error("Error sending email:", error);
// //         throw error;
// //     }
// // }

// // async function parseFormData(
// //     formData: FormData
// // ): Promise<Record<string, any[]>> {
// //     const files: Record<string, any[]> = {};

// //     for (const [key, value] of formData.entries()) {
// //         if (value instanceof Blob) {
// //             const buffer = Buffer.from(await value.arrayBuffer());
// //             const filename = value.name;
// //             const filePath = `/tmp/${filename}`;
// //             await fs.writeFile(filePath, buffer);
// //             files[key] = [
// //                 {
// //                     filepath: filePath,
// //                     originalFilename: filename,
// //                     mimetype: value.type,
// //                     size: value.size,
// //                 },
// //             ];
// //         }
// //     }

// //     return files;
// // }

// // // const handleSMSPost = async (request: NextApiRequest) => {
// // //     try {
// // //         const formData = await request.formData();
// // //         const files = await parseFormData(formData);

// // //         const firstName = formData.get("firstName") as string;
// // //         const lastName = formData.get("lastName") as string;
// // //         const email = formData.get("email") as string;
// // //         const phone = formData.get("phone") as string;
// // //         const birthday = formData.get("birthday") as string;
// // //         const insurance = formData.get("insurance") as string;
// // //         const address = formData.get("address") as string;
// // //         const city = formData.get("city") as string;
// // //         const state = formData.get("state") as string;
// // //         const zipCode = formData.get("zipCode") as string;
// // //         const pharmacy = formData.get("pharmacy") as string;
// // //         const reason = formData.get("reason") as string;
// // //         const suggestedAppointment = formData.get(
// // //             "suggestedAppointment"
// // //         ) as string;
// // const handleSMSPost = async (res: NextApiResponse, req: NextApiRequest) => {
// //     // if (req.method !== "POST") {
// //     //     return res.status(405).json({ error: "Method not allowed" });
// //     // }

// //     try {
// //         const form = new IncomingForm();
// //         const [fields, files] = await new Promise<[any, any]>(
// //             (resolve, reject) => {
// //                 form.parse(req, (err, fields, files) => {
// //                     if (err) reject(err);
// //                     resolve([fields, files]);
// //                 });
// //             }
// //         );

// //         const {
// //             firstName,
// //             lastName,
// //             email,
// //             phone,
// //             birthday,
// //             insurance,
// //             address,
// //             city,
// //             state,
// //             zipCode,
// //             pharmacy,
// //             reason,
// //             suggestedAppointment,
// //             providerPhone,
// //             suggestedProvider,
// //             providerEmail,
// //         } = fields;
// //         // const providerPhone = formData.get("providerPhone") as string;
// //         // const suggestedProvider = formData.get("suggestedProvider") as string;
// //         // const providerEmail = formData.get("providerEmail") as string;

// //         const patientName = `${firstName} ${lastName}`.toUpperCase();
// //         const fullAddress = `${address}, ${city}, ${state} ${zipCode}`;

// //         const formattedAppointmentTime = formatDateTime(suggestedAppointment);

// //         const calendarEvent = ical({
// //             prodId: { company: "LLPMG", product: "Appointment" },
// //             name: "LLPMG Appointment",
// //         });

// //         calendarEvent.createEvent({
// //             start: new Date(suggestedAppointment),
// //             end: new Date(
// //                 new Date(suggestedAppointment).getTime() + 60 * 60 * 1000
// //             ),
// //             summary: `Appointment with ${patientName}`,
// //             description: `Appointment for ${patientName}\nReason: ${reason}`,
// //             location: "Loma Linda Psychiatric Medical Group",
// //             url: "https://lomalindapsych.com",
// //             organizer: {
// //                 name: "LLPMG",
// //                 email: process.env.PROTONMAIL_SENDER,
// //             },
// //             attendees: [
// //                 {
// //                     name: patientName,
// //                     email: email,
// //                     rsvp: true,
// //                     role: ICalAttendeeRole.REQ,
// //                     status: ICalAttendeeStatus.NEEDSACTION,
// //                 },
// //             ],
// //         });

// //         let emailTransporter = nodemailer.createTransport({
// //             host: process.env.PROTONMAIL_HOST,
// //             port: Number(process.env.PROTONMAIL_PORT),
// //             secure: false,
// //             auth: {
// //                 user: process.env.PROTONMAIL_SENDER,
// //                 pass: process.env.PROTONMAIL_PASSWORD,
// //             },
// //             tls: {
// //                 rejectUnauthorized: false,
// //             },
// //         });

// //         try {
// //             await emailTransporter.verify();
// //             console.log("SMTP connection verified successfully");
// //         } catch (error) {
// //             console.error("SMTP connection verification failed:", error);
// //             throw new Error("Failed to establish SMTP connection");
// //         }

// //         const patientEmailHtml = renderToString(
// //             LLPMGEmailTemplate({
// //                 name: patientName,
// //                 email,
// //                 phone,
// //                 birthday,
// //                 insurance,
// //                 address: fullAddress,
// //                 pharmacy,
// //                 reason,
// //                 suggestedAppointment: formattedAppointmentTime,
// //                 isDoctor: false,
// //                 suggestedProvider,
// //                 providerPhone,
// //                 providerEmail,
// //             })
// //         );

// //         const doctorEmailHtml = renderToString(
// //             LLPMGEmailTemplate({
// //                 name: patientName,
// //                 email,
// //                 phone,
// //                 birthday,
// //                 insurance,
// //                 address: fullAddress,
// //                 pharmacy,
// //                 reason,
// //                 suggestedAppointment: formattedAppointmentTime,
// //                 isDoctor: true,
// //                 suggestedProvider,
// //                 providerPhone,
// //                 providerEmail,
// //             })
// //         );

// //         let pdfAttachment;
// //         if (files["pdf"]) {
// //             const file = files["pdf"][0];
// //             const zipFilePath = await compressFile(
// //                 file.filepath,
// //                 file.originalFilename
// //             );
// //             pdfAttachment = await fs.readFile(zipFilePath);
// //         }

// //         await sendEmailWithCalendar(
// //             emailTransporter,
// //             email,
// //             `Registration Confirmation - ${formattedAppointmentTime}`,
// //             patientEmailHtml,
// //             calendarEvent
// //         );

// //         await sendEmailWithCalendar(
// //             emailTransporter,
// //             process.env.PROTONMAIL_RECIPIENT!,
// //             `New Patient Registration Details - ${formattedAppointmentTime}`,
// //             doctorEmailHtml,
// //             calendarEvent,
// //             pdfAttachment
// //                 ? [
// //                       {
// //                           filename: `${files["pdf"][0].originalFilename}.zip`,
// //                           content: pdfAttachment,
// //                       },
// //                   ]
// //                 : undefined
// //         );

// //         const smsMessage = `Hello ${firstName}, thank you for registering with Loma Linda Psychiatric Medical Group. Your appointment suggestion for ${formattedAppointmentTime} with ${suggestedProvider} has been received. We will contact you soon to confirm.`;
// //         const patientMMSResponse = await sendMMS(phone, smsMessage);

// //         const providerSMS = `Hello ${suggestedProvider}, a new patient has registered for an appointment suggestion on ${formattedAppointmentTime}. Please review the details in your email and contact the patient to confirm.`;
// //         const providerMMSResponse = await sendMMS(
// //             providerPhone,
// //             providerSMS,
// //             pdfAttachment
// //         );

// //         // Retrieve message details using RingCentral's getMessage functionality
// //         const patientMessageDetails = await getMessage(patientMMSResponse.id);
// //         const providerMessageDetails = await getMessage(providerMMSResponse.id);

// //         // Initiate text session
// //         const initialSessionMessage = `A text session has been initiated between ${firstName} ${lastName} and ${suggestedProvider}. You may now communicate directly.`;
// //         await fetch("/api/sms-session/route", {
// //             method: "POST",
// //             headers: { "Content-Type": "application/json" },
// //             body: JSON.stringify({
// //                 providerPhone,
// //                 patientPhone: phone,
// //                 initialMessage: initialSessionMessage,
// //             }),
// //         });

// //         res.status(200).json({ message: "Registration successful" });
// //     } catch (error) {
// //         console.error("Error in API route:", error);
// //         res.status(500).json({
// //             error: "An unknown error occurred",
// //             details: (error as Error).message,
// //         });
// //     }
// // };
// // //         return NextApiResponse.json({
// // //             message: "Registration successful",
// // //             patientMessageDetails,
// // //             providerMessageDetails,
// // //         });
// // //     } catch (error) {
// // //         console.error("Error in API route:", error);
// // //         return NextApiResponse.json(
// // //             {
// // //                 error: "An unknown error occurred",
// // //                 details: (error as Error).message,
// // //             },
// // //             { status: 500 }
// // //         );
// // //     }
// // // };

// // export default handleSMSPost;

// import type { NextApiRequest, NextApiResponse } from "next";
// import { IncomingForm, File } from "formidable";
// import nodemailer from "nodemailer";
// import { renderToString } from "react-dom/server";
// import LLPMGEmailTemplate from "@/components/LLPMG/LLPMGEmailTemplate";
// import { SDK } from "@ringcentral/sdk";
// import ical from "ical-generator";
// import { ICalAttendeeRole, ICalAttendeeStatus } from "ical-generator";
// import fs from "fs/promises";
// import { createWriteStream } from "fs";
// import archiver from "archiver";
// import path from "path";

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

//         const phoneString = String(to);
//         const formattedPhoneNumber = phoneString.startsWith("+1")
//             ? phoneString
//             : `+1${phoneString.replace(/\D/g, "")}`;

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

// async function compressFile(file: File): Promise<string> {
//     const zipFilePath = path.join("/tmp", `${file.originalFilename}.zip`);
//     const output = createWriteStream(zipFilePath);
//     const archive = archiver("zip", { zlib: { level: 9 } });

//     return new Promise((resolve, reject) => {
//         output.on("close", () => resolve(zipFilePath));
//         archive.on("error", reject);
//         archive.pipe(output);
//         archive.file(file.filepath, { name: file.originalFilename ?? "file" });
//         archive.finalize();
//     });
// }

// function formatDateTime(dateString: string): string {
//     const date = new Date(dateString);
//     return date.toLocaleString("en-US", {
//         weekday: "long",
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//         hour: "numeric",
//         minute: "numeric",
//         hour12: true,
//     });
// }

// async function sendEmailWithCalendar(
//     transporter: nodemailer.Transporter,
//     to: string,
//     subject: string,
//     content: string,
//     calendarEvent: any,
//     attachments?: nodemailer.SendMailOptions["attachments"]
// ) {
//     const mailOptions: nodemailer.SendMailOptions = {
//         from: `"${process.env.PROTONMAIL_NAME}" <${process.env.PROTONMAIL_SENDER}>`,
//         to,
//         subject,
//         html: content,
//         attachments: [
//             ...(attachments || []),
//             {
//                 filename: "event.ics",
//                 content: calendarEvent.toString(),
//                 contentType: "text/calendar",
//             },
//         ],
//         alternatives: [
//             {
//                 contentType: "text/calendar",
//                 content: Buffer.from(calendarEvent.toString()),
//                 contentDisposition: "inline",
//             },
//         ],
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//     } catch (error) {
//         console.error("Error sending email:", error);
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

//         const {
//             firstName,
//             lastName,
//             email,
//             phone,
//             birthday,
//             insurance,
//             address,
//             city,
//             state,
//             zipCode,
//             pharmacy,
//             reason,
//             suggestedAppointment,
//             providerPhone,
//             suggestedProvider,
//             providerEmail,
//         } = fields;

//         const patientName =
//             `${(firstName as string[])[0]} ${(lastName as string[])[0]}`.toUpperCase();
//         const fullAddress = `${address as string}, ${city as string}, ${state as string} ${zipCode as string}`;
//         const file = files.pdf ? (files.pdf[0] as File) : null;

//         const formattedAppointmentTime = formatDateTime(
//             suggestedAppointment as string
//         );

//         const calendarEvent = ical({
//             prodId: { company: "LLPMG", product: "Appointment" },
//             name: "LLPMG Appointment",
//         });

//         calendarEvent.createEvent({
//             start: new Date(suggestedAppointment as string),
//             end: new Date(
//                 new Date(suggestedAppointment as string).getTime() +
//                     60 * 60 * 1000
//             ),
//             summary: `Appointment with ${patientName}`,
//             description: `Appointment for ${patientName}\nReason: ${reason as string}`,
//             location: "Loma Linda Psychiatric Medical Group",
//             url: "https://lomalindapsych.com",
//             organizer: {
//                 name: "LLPMG",
//                 email: process.env.PROTONMAIL_SENDER,
//             },
//             attendees: [
//                 {
//                     name: patientName,
//                     email: email as string,
//                     rsvp: true,
//                     role: ICalAttendeeRole.REQ,
//                     status: ICalAttendeeStatus.NEEDSACTION,
//                 },
//             ],
//         });

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

//         try {
//             await emailTransporter.verify();
//             console.log("SMTP connection verified successfully");
//         } catch (error) {
//             console.error("SMTP connection verification failed:", error);
//             throw new Error("Failed to establish SMTP connection");
//         }

//         const patientEmailHtml = renderToString(
//             LLPMGEmailTemplate({
//                 name: patientName,
//                 email: email as string,
//                 phone: phone as string,
//                 birthday: birthday as string,
//                 insurance: insurance as string,
//                 address: fullAddress,
//                 pharmacy: pharmacy as string,
//                 reason: reason as string,
//                 suggestedAppointment: formattedAppointmentTime,
//                 isDoctor: false,
//                 suggestedProvider: suggestedProvider as string,
//                 providerPhone: providerPhone as string,
//                 providerEmail: providerEmail as string,
//             })
//         );

//         const doctorEmailHtml = renderToString(
//             LLPMGEmailTemplate({
//                 name: patientName,
//                 email: email as string,
//                 phone: phone as string,
//                 birthday: birthday as string,
//                 insurance: insurance as string,
//                 address: fullAddress,
//                 pharmacy: pharmacy as string,
//                 reason: reason as string,
//                 suggestedAppointment: formattedAppointmentTime,
//                 isDoctor: true,
//                 suggestedProvider: suggestedProvider as string,
//                 providerPhone: providerPhone as string,
//                 providerEmail: providerEmail as string,
//             })
//         );

//         let fileContent, fileSize;
//         if (file) {
//             const zipFilePath = await compressFile(file);
//             fileContent = await fs.readFile(zipFilePath);
//             fileSize = fileContent.length;

//             console.log("Compressed file details:", {
//                 name: `${file.originalFilename}.zip`,
//                 size: fileSize,
//             });
//         }

//         await sendEmailWithCalendar(
//             emailTransporter,
//             email as string,
//             `Registration Confirmation - ${formattedAppointmentTime}`,
//             patientEmailHtml,
//             calendarEvent,
//             file
//                 ? [
//                       {
//                           filename: `${file.originalFilename}.zip`,
//                           content: fileContent,
//                       },
//                   ]
//                 : undefined
//         );

//         await sendEmailWithCalendar(
//             emailTransporter,
//             process.env.PROTONMAIL_RECIPIENT!,
//             `New Patient Registration Details - ${formattedAppointmentTime}`,
//             doctorEmailHtml,
//             calendarEvent,
//             file
//                 ? [
//                       {
//                           filename: `${file.originalFilename}.zip`,
//                           content: fileContent,
//                       },
//                   ]
//                 : undefined
//         );

//         const smsMessage = `Hello ${firstName as string}, thank you for registering with Loma Linda Psychiatric Medical Group. Your appointment suggestion for ${formattedAppointmentTime} with ${suggestedProvider as string} has been received. We will contact you soon to confirm.`;
//         const providerSMS = `Hello ${suggestedProvider as string}, a new patient has registered for an appointment suggestion on ${formattedAppointmentTime}. Please review the details in your email and contact the patient to confirm.`;
//         await sendSMS(phone as string, smsMessage);
//         await sendSMS(providerPhone as string, providerSMS);

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

async function createSubscription() {
    try {
        await platform.login({ jwt: process.env.RC_JWT });

        const response = await platform.post("/restapi/v1.0/subscription", {
            eventFilters: ["/restapi/v1.0/account/~/extension/~/message-store"],
            deliveryMode: {
                transportType: "WebHook",
                address:
                    // "https://your-webhook-url/api/webhooks/ringcentral/sms", // Replace with your webhook URL
                    `${process.env.WEBHOOK_URL}/api/webhooks/ringcentral/sms`,
            },
            expiresIn: 3600,
        });

        return response.json();
    } catch (error) {
        console.error("Error creating subscription:", error);
        throw error;
    }
}

async function syncMessages(syncToken: string | null = null) {
    try {
        await platform.login({ jwt: process.env.RC_JWT });

        const queryParams: any = { syncType: syncToken ? "ISync" : "FSync" };
        if (syncToken) queryParams.syncToken = syncToken;

        const response = await platform.get(
            "/restapi/v1.0/account/~/extension/~/message-sync",
            queryParams
        );
        return response.json();
    } catch (error) {
        console.error("Error syncing messages:", error);
        throw error;
    }
}

async function sendSMS(to: string | number, message: string) {
    try {
        await platform.login({ jwt: process.env.RC_JWT });

        const phoneString = String(to);
        const formattedPhoneNumber = phoneString.startsWith("+1")
            ? phoneString
            : `+1${phoneString.replace(/\D/g, "")}`;

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

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
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

        console.log("Parsed fields:", fields);
        console.log("Parsed files:", files);

        const {
            firstName,
            lastName,
            email,
            phone,
            birthday,
            insurance,
            address,
            city,
            state,
            zipCode,
            pharmacy,
            reason,
            suggestedAppointment,
            providerPhone,
            suggestedProvider,
            providerEmail,
        } = fields;

        if (!phone || !providerPhone) {
            throw new Error(
                `Missing required phone numbers. Phone: ${phone}, Provider Phone: ${providerPhone}`
            );
        }

        const patientName =
            `${(firstName as string[])[0]} ${(lastName as string[])[0]}`.toUpperCase();
        const fullAddress = `${address as string}, ${city as string}, ${state as string} ${zipCode as string}`;
        const file = files.pdf ? (files.pdf[0] as File) : null;

        const formattedAppointmentTime = formatDateTime(
            suggestedAppointment as string
        );

        const calendarEvent = ical({
            prodId: { company: "LLPMG", product: "Appointment" },
            name: "LLPMG Appointment",
        });

        calendarEvent.createEvent({
            start: new Date(suggestedAppointment as string),
            end: new Date(
                new Date(suggestedAppointment as string).getTime() +
                    60 * 60 * 1000
            ),
            summary: `Appointment with ${patientName}`,
            description: `Appointment for ${patientName}\nReason: ${reason as string}`,
            location: "Loma Linda Psychiatric Medical Group",
            url: "https://lomalindapsych.com",
            organizer: {
                name: "LLPMG",
                email: process.env.PROTONMAIL_SENDER,
            },
            attendees: [
                {
                    name: patientName,
                    email: email as string,
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

        try {
            await emailTransporter.verify();
            console.log("SMTP connection verified successfully");
        } catch (error) {
            console.error("SMTP connection verification failed:", error);
            throw new Error("Failed to establish SMTP connection");
        }

        const patientEmailHtml = renderToString(
            LLPMGEmailTemplate({
                name: patientName,
                email: email as string,
                phone: phone as string,
                birthday: birthday as string,
                insurance: insurance as string,
                address: fullAddress,
                pharmacy: pharmacy as string,
                reason: reason as string,
                suggestedAppointment: formattedAppointmentTime,
                isDoctor: false,
                suggestedProvider: suggestedProvider as string,
                providerPhone: providerPhone as string,
                providerEmail: providerEmail as string,
            })
        );

        const doctorEmailHtml = renderToString(
            LLPMGEmailTemplate({
                name: patientName,
                email: email as string,
                phone: phone as string,
                birthday: birthday as string,
                insurance: insurance as string,
                address: fullAddress,
                pharmacy: pharmacy as string,
                reason: reason as string,
                suggestedAppointment: formattedAppointmentTime,
                isDoctor: true,
                suggestedProvider: suggestedProvider as string,
                providerPhone: providerPhone as string,
                providerEmail: providerEmail as string,
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

        await sendEmailWithCalendar(
            emailTransporter,
            email as string,
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

        const smsMessage = `Hello ${firstName}, thank you for registering with Loma Linda Psychiatric Medical Group. Your appointment suggestion for ${formattedAppointmentTime} with ${suggestedProvider} has been received. We will contact you soon to confirm.`;
        const providerSMS = `Hello ${suggestedProvider}, a new patient has registered for an appointment suggestion on ${formattedAppointmentTime}. Please review the details in your email and contact the patient to confirm.`;

        // Check the phone number format before sending SMS
        if (!/^\+1\d{10}$/.test(phone as string)) {
            throw new Error(`Invalid phone number format: ${phone}`);
        }

        if (!/^\+1\d{10}$/.test(providerPhone as string)) {
            throw new Error(`Invalid phone number format: ${providerPhone}`);
        }

        await sendSMS(phone as string, smsMessage);
        await sendSMS(providerPhone as string, providerSMS);

        // Create subscription and sync messages
        await createSubscription();
        await syncMessages();

        res.status(200).json({ message: "Registration successful" });
    } catch (error) {
        console.error("Error in API route:", error);
        res.status(500).json({
            error: "An unknown error occurred",
            details: (error as Error).message,
        });
    }
}
