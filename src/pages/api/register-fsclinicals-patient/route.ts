// //single
// import type { NextApiRequest, NextApiResponse } from "next";
// import { IncomingForm, File } from "formidable";
// import fs from "fs/promises";
// import { createWriteStream } from "fs";
// import fetch from "node-fetch";
// import archiver from "archiver";
// import path from "path";
// import { renderToString } from "react-dom/server";
// import EmailTemplate from "@/components/FSClinicals/EmailTemplate";

// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

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

// async function sendEmail(
//     accessToken: string,
//     to: string,
//     subject: string,
//     content: string,
//     attachmentContent?: string
// ) {
//     console.log(`Sending email to ${to}`);
//     const mailBody: any = {
//         message: {
//             subject,
//             body: {
//                 contentType: "HTML",
//                 content,
//             },
//             toRecipients: [{ emailAddress: { address: to } }],
//             attachments: attachmentContent
//                 ? [
//                       {
//                           "@odata.type": "#microsoft.graph.fileAttachment",
//                           name: "patient_document.zip",
//                           contentType: "application/zip",
//                           contentBytes: attachmentContent,
//                       },
//                   ]
//                 : [],
//         },
//         saveToSentItems: true,
//     };

//     const mailUrl = `https://graph.microsoft.com/v1.0/users/fsclinicals-com@mail.clinicviews.com/sendMail`;
//     const emailResponse = await fetch(mailUrl, {
//         method: "POST",
//         headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(mailBody),
//     });

//     if (!emailResponse.ok) {
//         const errorData = (await emailResponse.json()) as ErrorResponse;
//         console.error("Email sending error:", errorData);
//         throw new Error(
//             `Failed to send email: ${
//                 errorData.error?.message || "Unknown error"
//             }`
//         );
//     }

//     console.log(`Email sent successfully to ${to}`);
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

//     const form = new IncomingForm();

//     try {
//         const [fields, files] = await new Promise<[any, any]>(
//             (resolve, reject) => {
//                 form.parse(req, (err, fields, files) => {
//                     if (err) reject(err);
//                     resolve([fields, files]);
//                 });
//             }
//         );

//         console.log("Received form data:", fields);
//         console.log("Received files:", files);

//         const file = files.file[0] as File;
//         const zipFilePath = await compressFile(file);
//         const fileContent = await fs.readFile(zipFilePath);
//         const fileSize = fileContent.length;

//         console.log("Compressed file details:", {
//             name: `${file.originalFilename}.zip`,
//             size: fileSize,
//         });

//         const attachmentContent = fileContent.toString("base64");

//         const patientName = Array.isArray(fields.patientName)
//             ? fields.patientName[0]
//             : fields.patientName;
//         const email = Array.isArray(fields.email)
//             ? fields.email[0]
//             : fields.email;
//         const phone = Array.isArray(fields.phone)
//             ? fields.phone[0]
//             : fields.phone;
//         const reason = Array.isArray(fields.reason)
//             ? fields.reason[0]
//             : fields.reason;
//         const suggestAppointment = Array.isArray(fields.suggestAppointment)
//             ? fields.suggestAppointment[0]
//             : fields.suggestAppointment;
//         const appointmentDate = Array.isArray(fields.appointmentDate)
//             ? fields.appointmentDate[0]
//             : fields.appointmentDate;
//         const appointmentTime = Array.isArray(fields.appointmentTime)
//             ? fields.appointmentTime[0]
//             : fields.appointmentTime;

//         const appointmentDateTime = `${appointmentDate}T${appointmentTime}`;
//         const formattedAppointmentTime =
//             formatTo12HourTime(appointmentDateTime);

//         console.log("Parsed form data:", {
//             patientName,
//             email,
//             phone,
//             reason,
//             suggestAppointment,
//             appointmentDate,
//             appointmentTime,
//             appointmentDateTime,
//             formattedAppointmentTime,
//         });

//         if (process.env.NODE_ENV === "development") {
//             process.env.APP_URL = process.env.DEV_APP_URL;
//         } else {
//             process.env.APP_URL = process.env.PROD_APP_URL;
//         }

//         const tokenResponse = await fetch(
//             `${process.env.APP_URL}/api/get-token/route`
//         );
//         const { accessToken } = (await tokenResponse.json()) as {
//             accessToken: string;
//         };

//         const patientData = {
//             displayName: patientName,
//             emailAddresses: [{ address: email }],
//             mobilePhone: phone,
//         };

//         const patientResponse = await fetch(
//             "https://graph.microsoft.com/v1.0/users/fsclinicals-com@mail.clinicviews.com/contacts",
//             {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(patientData),
//             }
//         );

//         if (!patientResponse.ok) {
//             const errorData = (await patientResponse.json()) as ErrorResponse;
//             console.error("Patient creation error:", errorData);
//             throw new Error(
//                 `Failed to create patient record: ${
//                     errorData.error?.message || "Unknown error"
//                 }`
//             );
//         }

//         const patient = await patientResponse.json();
//         console.log("Patient record created:", patient);

//         let appointmentResult = null;
//         if (
//             suggestAppointment === "true" &&
//             appointmentDate &&
//             appointmentTime
//         ) {
//             const appointmentDateTime = new Date(
//                 `${appointmentDate}T${appointmentTime}`
//             );
//             const now = new Date();
//             const minAllowedTime = new Date(
//                 now.getTime() + 72 * 60 * 60 * 1000
//             );

//             if (appointmentDateTime < minAllowedTime) {
//                 return res.status(400).json({
//                     error: "Appointment must be at least 72 hours in the future",
//                 });
//             }

//             const eventUrl = `https://graph.microsoft.com/v1.0/users/fsclinicals-com@mail.clinicviews.com/calendar/events`;
//             const appointmentResponse = await fetch(eventUrl, {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     subject: `Appointment with ${patientName}`,
//                     start: {
//                         dateTime: appointmentDateTime.toISOString(),
//                         timeZone: "Pacific Standard Time",
//                     },
//                     end: {
//                         dateTime: new Date(
//                             new Date(appointmentDateTime).getTime() +
//                                 60 * 60 * 1000
//                         ).toISOString(),
//                         timeZone: "Pacific Standard Time",
//                     },
//                     attendees: [
//                         {
//                             emailAddress: {
//                                 address: email,
//                                 name: patientName,
//                             },
//                             type: "required",
//                         },
//                         {
//                             emailAddress: {
//                                 address: "steven@fsclinicals.com",
//                                 name: "FSClinicals Doctor",
//                             },
//                             type: "required",
//                         },
//                     ],
//                 }),
//             });

//             if (!appointmentResponse.ok) {
//                 const errorData =
//                     (await appointmentResponse.json()) as ErrorResponse;
//                 console.error("Appointment creation error:", errorData);
//                 throw new Error(
//                     `Failed to create appointment: ${
//                         errorData.error?.message || "Unknown error"
//                     }`
//                 );
//             }

//             appointmentResult = await appointmentResponse.json();
//             console.log("Appointment created successfully:", appointmentResult);
//         } else {
//             console.log("No appointment was created, skipping email sending.");
//         }

//         const patientEmailHtml = renderToString(
//             EmailTemplate({
//                 name: patientName,
//                 email,
//                 phone,
//                 reason,
//                 appointmentDate,
//                 appointmentTime: formattedAppointmentTime,
//                 isDoctor: false,
//             })
//         );

//         const doctorEmailHtml = renderToString(
//             EmailTemplate({
//                 name: patientName,
//                 email,
//                 phone,
//                 reason,
//                 appointmentDate,
//                 appointmentTime: formattedAppointmentTime,
//                 isDoctor: true,
//             })
//         );

//         // Send a single email to the doctor including the PDF and appointment details
//         await sendEmail(
//             accessToken,
//             "steven@fsclinicals.com",
//             "New Patient Registration and Appointment",
//             doctorEmailHtml,
//             attachmentContent
//         );

//         // Send the confirmation email to the patient
//         await sendEmail(
//             accessToken,
//             email,
//             "Registration Confirmation",
//             patientEmailHtml
//         );

//         res.status(200).json({ message: "Patient registered successfully" });
//     } catch (error) {
//         console.error("Error registering patient:", error);
//         res.status(500).json({
//             error: "Error registering patient",
//             details: (error as Error).message,
//         });
//     }
// }

// import nodemailer from "nodemailer";
// import { NextApiRequest, NextApiResponse } from "next";
// import fetch from "node-fetch";
// import { IncomingForm, File } from "formidable";
// import fs from "fs/promises";
// import { createWriteStream } from "fs";
// import archiver from "archiver";
// import path from "path";
// import { renderToString } from "react-dom/server";
// import EmailTemplate from "@/components/FSClinicals/EmailTemplate";

// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

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

// interface PatientResponse {
//     id: string;
//     displayName: string;
//     emailAddresses: Array<{ name: string; address: string }>;
//     mobilePhone: string;
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

//     const form = new IncomingForm();

//     try {
//         const [fields, files] = await new Promise<[any, any]>(
//             (resolve, reject) => {
//                 form.parse(req, (err, fields, files) => {
//                     if (err) reject(err);
//                     resolve([fields, files]);
//                 });
//             }
//         );

//         console.log("Received form data:", fields);
//         console.log("Received files:", files);

//         const file = files.file[0] as File;
//         const zipFilePath = await compressFile(file);
//         const fileContent = await fs.readFile(zipFilePath);
//         const fileSize = fileContent.length;

//         console.log("Compressed file details:", {
//             name: `${file.originalFilename}.zip`,
//             size: fileSize,
//         });

//         const attachmentContent = fileContent.toString("base64");

//         const patientName = Array.isArray(fields.patientName)
//             ? fields.patientName[0]
//             : fields.patientName;
//         const email = Array.isArray(fields.email)
//             ? fields.email[0]
//             : fields.email;
//         const phone = Array.isArray(fields.phone)
//             ? fields.phone[0]
//             : fields.phone;
//         const reason = Array.isArray(fields.reason)
//             ? fields.reason[0]
//             : fields.reason;
//         const suggestAppointment = Array.isArray(fields.suggestAppointment)
//             ? fields.suggestAppointment[0]
//             : fields.suggestAppointment;
//         const appointmentDate = Array.isArray(fields.appointmentDate)
//             ? fields.appointmentDate[0]
//             : fields.appointmentDate;
//         const appointmentTime = Array.isArray(fields.appointmentTime)
//             ? fields.appointmentTime[0]
//             : fields.appointmentTime;
//         const appointmentDateTime = `${appointmentDate}T${appointmentTime}:00.000`;

//         console.log("Parsed form data:", {
//             patientName,
//             email,
//             phone,
//             reason,
//             suggestAppointment,
//             appointmentDate,
//             appointmentTime,
//             appointmentDateTime,
//         });

//         const accessToken = await getAccessToken();

//         const patientData = {
//             displayName: patientName,
//             emailAddresses: [{ address: email }],
//             mobilePhone: phone,
//         };

//         const patientResponse = await fetch(
//             "https://graph.microsoft.com/v1.0/users/fsclinicals-com@mail.clinicviews.com/contacts",
//             {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(patientData),
//             }
//         );

//         if (!patientResponse.ok) {
//             const errorData = (await patientResponse.json()) as ErrorResponse;
//             throw new Error(
//                 `Failed to create patient record: ${errorData.error.message}`
//             );
//         }

//         const patient = (await patientResponse.json()) as PatientResponse;
//         console.log("Patient record created:", patient);

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
//                         address: "steven@fsclinicals.com",
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
//             console.error("Error creating event:", errorData);
//             throw new Error(
//                 `Failed to create calendar event: ${errorData.error.message}`
//             );
//         }

//         const event = await createEventResponse.json();
//         console.log("Event created successfully:", event);

//         const transporter = nodemailer.createTransport({
//             host: process.env.SMTP_HOST,
//             port: parseInt(process.env.SMTP_PORT!, 10),
//             secure: false, // true for 465, false for other ports
//             auth: {
//                 user: process.env.SMTP_USER,
//                 pass: process.env.SMTP_PASSWORD,
//             },
//         });

//         const patientEmailHtml = renderToString(
//             EmailTemplate({
//                 name: patientName,
//                 email,
//                 phone,
//                 reason,
//                 isDoctor: false,
//                 appointmentDate,
//                 appointmentTime: formatTo12HourTime(appointmentDateTime),
//             })
//         );
//         const doctorEmailHtml = renderToString(
//             EmailTemplate({
//                 name: patientName,
//                 email,
//                 phone,
//                 reason,
//                 isDoctor: true,
//                 appointmentDate,
//                 appointmentTime: formatTo12HourTime(appointmentDateTime),
//             })
//         );

//         const mailOptions = {
//             from: `"FSClinicals Mail" <${process.env.SMTP_USER}>`,
//             to: email,
//             subject: "Registration Confirmation",
//             html: patientEmailHtml,
//         };

//         const mailOptionsDoctor = {
//             from: `"FSClinicals Mail" <${process.env.SMTP_USER}>`,
//             to: "steven@fsclinicals.com",
//             subject: "New Patient Registration",
//             html: doctorEmailHtml,
//             attachments: [
//                 {
//                     filename: "patient_document.zip",
//                     content: attachmentContent,
//                     encoding: "base64",
//                 },
//             ],
//         };

//         await transporter.sendMail(mailOptions);
//         await transporter.sendMail(mailOptionsDoctor);

//         res.status(200).json({ message: "Patient registered successfully" });
//     } catch (error: unknown) {
//         console.error("Error registering patient:", error);
//         if (error instanceof Error) {
//             res.status(500).json({
//                 error: "Error registering patient",
//                 details: error.message,
//             });
//         } else {
//             res.status(500).json({
//                 error: "Unknown error occurred",
//             });
//         }
//     }
// }

//no file upload
// import { NextApiRequest, NextApiResponse } from "next";
// import fetch from "node-fetch";
// import { IncomingForm, File } from "formidable";
// import fs from "fs/promises";
// import { createWriteStream } from "fs";
// import archiver from "archiver";
// import path from "path";

// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

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

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     if (req.method !== "POST") {
//         return res.status(405).json({ error: "Method Not Allowed" });
//     }

//     const form = new IncomingForm();

//     try {
//         const [fields, files] = await new Promise<[any, any]>(
//             (resolve, reject) => {
//                 form.parse(req, (err, fields, files) => {
//                     if (err) reject(err);
//                     resolve([fields, files]);
//                 });
//             }
//         );

//         console.log("Received form data:", fields);
//         console.log("Received files:", files);

//         const file = files.file[0] as File;
//         const zipFilePath = await compressFile(file);
//         const fileContent = await fs.readFile(zipFilePath);
//         const fileSize = fileContent.length;

//         console.log("Compressed file details:", {
//             name: `${file.originalFilename}.zip`,
//             size: fileSize,
//         });

//         const attachmentContent = fileContent.toString("base64");

//         const patientName = Array.isArray(fields.patientName)
//             ? fields.patientName[0]
//             : fields.patientName;
//         const email = Array.isArray(fields.email)
//             ? fields.email[0]
//             : fields.email;
//         const phone = Array.isArray(fields.phone)
//             ? fields.phone[0]
//             : fields.phone;
//         const reason = Array.isArray(fields.reason)
//             ? fields.reason[0]
//             : fields.reason;
//         const suggestAppointment = Array.isArray(fields.suggestAppointment)
//             ? fields.suggestAppointment[0]
//             : fields.suggestAppointment;
//         const appointmentDate = Array.isArray(fields.appointmentDate)
//             ? fields.appointmentDate[0]
//             : fields.appointmentDate;
//         const appointmentTime = Array.isArray(fields.appointmentTime)
//             ? fields.appointmentTime[0]
//             : fields.appointmentTime;

//         const appointmentDateTime = `${appointmentDate}T${appointmentTime}`;
//         const formattedAppointmentTime = new Date(
//             appointmentDateTime
//         ).toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//             hour12: true,
//         });

//         console.log("Parsed form data:", {
//             patientName,
//             email,
//             phone,
//             reason,
//             suggestAppointment,
//             appointmentDate,
//             appointmentTime,
//             appointmentDateTime,
//             formattedAppointmentTime,
//         });

//         const patientData = {
//             displayName: patientName,
//             emailAddresses: [{ address: email }],
//             mobilePhone: phone,
//         };

//         if (process.env.NODE_ENV === "development") {
//             process.env.APP_URL = process.env.DEV_APP_URL;
//         } else {
//             process.env.APP_URL = process.env.PROD_APP_URL;
//         }

//         const tokenResponse = await fetch(
//             `${process.env.APP_URL}/api/get-token/route`
//         );
//         const { accessToken } = (await tokenResponse.json()) as {
//             accessToken: string;
//         };

//         const patientResponse = await fetch(
//             "https://graph.microsoft.com/v1.0/users/fsclinicals-com@mail.clinicviews.com/contacts",
//             {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(patientData),
//             }
//         );

//         if (!patientResponse.ok) {
//             const errorData = await patientResponse.json();
//             throw new Error(
//                 `Failed to create patient record: ${
//                     (errorData as any).error.message
//                 }`
//             );
//         }

//         const patient = await patientResponse.json();
//         console.log("Patient record created:", patient);

//         if (suggestAppointment === "true") {
//             await fetch(`${process.env.APP_URL}/api/create-event/route`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     patientName,
//                     email,
//                     appointmentDate,
//                     appointmentTime,
//                 }),
//             });
//         }

//         await fetch(`${process.env.APP_URL}/api/send-email/route`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 patientName,
//                 email,
//                 phone,
//                 reason,
//                 appointmentDate,
//                 appointmentTime,
//                 attachmentContent,
//             }),
//         });

//         res.status(200).json({ message: "Patient registered successfully" });
//     } catch (error: unknown) {
//         console.error("Error registering patient:", error);
//         if (error instanceof Error) {
//             res.status(500).json({
//                 error: "Error registering patient",
//                 details: error.message,
//             });
//         } else {
//             res.status(500).json({
//                 error: "Unknown error occurred",
//             });
//         }
//     }
// }

// iterally the same
// import { NextApiRequest, NextApiResponse } from "next";
// import nodemailer from "nodemailer";
// import fetch from "node-fetch";
// import { IncomingForm, File } from "formidable";
// import fs from "fs/promises";
// import { createWriteStream } from "fs";
// import archiver from "archiver";
// import path from "path";
// import { renderToString } from "react-dom/server";
// import EmailTemplate from "@/components/FSClinicals/EmailTemplate";

// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

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

// interface TokenResponse {
//     accessToken: string;
// }

// async function sendEmail(
//     accessToken: string,
//     to: string,
//     subject: string,
//     content: string,
//     attachmentContent?: string
// ) {
//     console.log(`Sending email to ${to}`);
//     const mailBody: any = {
//         message: {
//             subject,
//             body: {
//                 contentType: "HTML",
//                 content,
//             },
//             toRecipients: [{ emailAddress: { address: to } }],
//             attachments: attachmentContent
//                 ? [
//                       {
//                           "@odata.type": "#microsoft.graph.fileAttachment",
//                           name: "patient_document.zip",
//                           contentType: "application/zip",
//                           contentBytes: attachmentContent,
//                       },
//                   ]
//                 : [],
//         },
//         saveToSentItems: true,
//     };

//     const mailUrl = `https://graph.microsoft.com/v1.0/users/fsclinicals-com@mail.clinicviews.com/sendMail`;
//     const emailResponse = await fetch(mailUrl, {
//         method: "POST",
//         headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(mailBody),
//     });

//     if (!emailResponse.ok) {
//         const errorData = (await emailResponse.json()) as ErrorResponse;
//         console.error("Email sending error:", errorData);
//         throw new Error(
//             `Failed to send email: ${
//                 errorData.error?.message || "Unknown error"
//             }`
//         );
//     }

//     console.log(`Email sent successfully to ${to}`);
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

//     const form = new IncomingForm();

//     try {
//         const [fields, files] = await new Promise<[any, any]>(
//             (resolve, reject) => {
//                 form.parse(req, (err, fields, files) => {
//                     if (err) reject(err);
//                     resolve([fields, files]);
//                 });
//             }
//         );

//         console.log("Received form data:", fields);
//         console.log("Received files:", files);

//         const file = files.file[0] as File;
//         const zipFilePath = await compressFile(file);
//         const fileContent = await fs.readFile(zipFilePath);
//         const fileSize = fileContent.length;

//         console.log("Compressed file details:", {
//             name: `${file.originalFilename}.zip`,
//             size: fileSize,
//         });

//         const attachmentContent = fileContent.toString("base64");

//         const patientName = Array.isArray(fields.patientName)
//             ? fields.patientName[0]
//             : fields.patientName;
//         const email = Array.isArray(fields.email)
//             ? fields.email[0]
//             : fields.email;
//         const phone = Array.isArray(fields.phone)
//             ? fields.phone[0]
//             : fields.phone;
//         const reason = Array.isArray(fields.reason)
//             ? fields.reason[0]
//             : fields.reason;
//         const suggestAppointment = Array.isArray(fields.suggestAppointment)
//             ? fields.suggestAppointment[0]
//             : fields.suggestAppointment;
//         const appointmentDate = Array.isArray(fields.appointmentDate)
//             ? fields.appointmentDate[0]
//             : fields.appointmentDate;
//         const appointmentTime = Array.isArray(fields.appointmentTime)
//             ? fields.appointmentTime[0]
//             : fields.appointmentTime;

//         const appointmentDateTime = new Date(
//             `${appointmentDate}T${appointmentTime}`
//         );
//         const formattedAppointmentTime = formatTo12HourTime(
//             appointmentDateTime.toISOString()
//         );

//         console.log("Parsed form data:", {
//             patientName,
//             email,
//             phone,
//             reason,
//             suggestAppointment,
//             appointmentDate,
//             appointmentTime,
//             appointmentDateTime,
//             formattedAppointmentTime,
//         });

//         const tokenResponse = await fetch(
//             `${process.env.APP_URL}/api/get-token/route`
//         );
//         const { accessToken } = (await tokenResponse.json()) as TokenResponse;

//         const patientData = {
//             displayName: patientName,
//             emailAddresses: [{ address: email }],
//             mobilePhone: phone,
//         };

//         const patientResponse = await fetch(
//             "https://graph.microsoft.com/v1.0/users/fsclinicals-com@mail.clinicviews.com/contacts",
//             {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(patientData),
//             }
//         );

//         if (!patientResponse.ok) {
//             const errorData = (await patientResponse.json()) as ErrorResponse;
//             console.error("Patient creation error:", errorData);
//             throw new Error(
//                 `Failed to create patient record: ${
//                     errorData.error?.message || "Unknown error"
//                 }`
//             );
//         }

//         const patient = await patientResponse.json();
//         console.log("Patient record created:", patient);

//         if (
//             suggestAppointment === "true" &&
//             appointmentDate &&
//             appointmentTime
//         ) {
//             const eventUrl = `https://graph.microsoft.com/v1.0/users/fsclinicals-com@mail.clinicviews.com/calendar/events`;
//             const appointmentResponse = await fetch(eventUrl, {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     subject: `Appointment with ${patientName}`,
//                     body: {
//                         contentType: "HTML",
//                         content: `Appointment details for ${patientName} on ${appointmentDate} at ${formattedAppointmentTime}.`,
//                     },
//                     start: {
//                         dateTime: appointmentDateTime.toISOString(),
//                         timeZone: "Pacific Standard Time",
//                     },
//                     end: {
//                         dateTime: new Date(
//                             appointmentDateTime.getTime() + 60 * 60 * 1000
//                         ).toISOString(),
//                         timeZone: "Pacific Standard Time",
//                     },
//                     attendees: [
//                         {
//                             emailAddress: {
//                                 address: email,
//                                 name: patientName,
//                             },
//                             type: "required",
//                         },
//                         {
//                             emailAddress: {
//                                 address: "steven@fsclinicals.com",
//                                 name: "FSClinicals Doctor",
//                             },
//                             type: "required",
//                         },
//                     ],
//                 }),
//             });

//             if (!appointmentResponse.ok) {
//                 const errorData =
//                     (await appointmentResponse.json()) as ErrorResponse;
//                 console.error("Appointment creation error:", errorData);
//                 throw new Error(
//                     `Failed to create appointment: ${
//                         errorData.error?.message || "Unknown error"
//                     }`
//                 );
//             }

//             const appointmentResult = await appointmentResponse.json();
//             console.log("Appointment created successfully:", appointmentResult);
//         } else {
//             console.log("No appointment was created, skipping email sending.");
//         }

//         const patientEmailHtml = renderToString(
//             EmailTemplate({
//                 name: patientName,
//                 email,
//                 phone,
//                 reason,
//                 appointmentDate,
//                 appointmentTime: formattedAppointmentTime,
//                 isDoctor: false,
//             })
//         );

//         const doctorEmailHtml = renderToString(
//             EmailTemplate({
//                 name: patientName,
//                 email,
//                 phone,
//                 reason,
//                 appointmentDate,
//                 appointmentTime: formattedAppointmentTime,
//                 isDoctor: true,
//             })
//         );

//         await sendEmail(
//             accessToken,
//             "steven@fsclinicals.com",
//             "New Patient Registration and Appointment",
//             doctorEmailHtml,
//             attachmentContent
//         );

//         await sendEmail(
//             accessToken,
//             email,
//             "Registration Confirmation",
//             patientEmailHtml
//         );

//         res.status(200).json({ message: "Patient registered successfully" });
//     } catch (error) {
//         console.error("Error registering patient:", error);
//         res.status(500).json({
//             error: "Error registering patient",
//             details: (error as Error).message,
//         });
//     }
// }

import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import fetch from "node-fetch";
import { IncomingForm, File } from "formidable";
import fs from "fs/promises";
import { createWriteStream } from "fs";
import archiver from "archiver";
import path from "path";
import { renderToString } from "react-dom/server";
import EmailTemplate from "@/components/FSClinicals/EmailTemplate";

export const config = {
    api: {
        bodyParser: false,
    },
};

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

interface ErrorResponse {
    error: {
        code: string;
        message: string;
        innerError?: {
            date: string;
            request_id: string;
            client_request_id: string;
        };
    };
}

interface TokenResponse {
    accessToken: string;
}

async function sendEmail(
    transporter: nodemailer.Transporter,
    to: string,
    subject: string,
    content: string,
    attachments?: nodemailer.SendMailOptions["attachments"]
) {
    console.log(`Sending email to ${to}`);

    const mailOptions: nodemailer.SendMailOptions = {
        from: `"FSClinicals Mail" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html: content,
        attachments,
    };

    await transporter.sendMail(mailOptions);

    console.log(`Email sent successfully to ${to}`);
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

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
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

        const file = files.file[0] as File;
        const zipFilePath = await compressFile(file);
        const fileContent = await fs.readFile(zipFilePath);
        const fileSize = fileContent.length;

        console.log("Compressed file details:", {
            name: `${file.originalFilename}.zip`,
            size: fileSize,
        });

        const attachmentContent = fileContent.toString("base64");

        const patientName = Array.isArray(fields.patientName)
            ? fields.patientName[0]
            : fields.patientName;
        const email = Array.isArray(fields.email)
            ? fields.email[0]
            : fields.email;
        const phone = Array.isArray(fields.phone)
            ? fields.phone[0]
            : fields.phone;
        const reason = Array.isArray(fields.reason)
            ? fields.reason[0]
            : fields.reason;
        const suggestAppointment = Array.isArray(fields.suggestAppointment)
            ? fields.suggestAppointment[0]
            : fields.suggestAppointment;
        const appointmentDate = Array.isArray(fields.appointmentDate)
            ? fields.appointmentDate[0]
            : fields.appointmentDate;
        const appointmentTime = Array.isArray(fields.appointmentTime)
            ? fields.appointmentTime[0]
            : fields.appointmentTime;

        const appointmentDateTime = new Date(
            `${appointmentDate}T${appointmentTime}`
        );
        const formattedAppointmentTime = formatTo12HourTime(
            appointmentDateTime.toISOString()
        );

        console.log("Parsed form data:", {
            patientName,
            email,
            phone,
            reason,
            suggestAppointment,
            appointmentDate,
            appointmentTime,
            appointmentDateTime,
            formattedAppointmentTime,
        });

        if (process.env.NODE_ENV === "development") {
            process.env.APP_URL = process.env.DEV_APP_URL;
        } else {
            process.env.APP_URL = process.env.PROD_APP_URL;
        }

        const tokenResponse = await fetch(
            `${process.env.APP_URL}/api/get-token/route`
        );
        const { accessToken } = (await tokenResponse.json()) as TokenResponse;

        const patientData = {
            displayName: patientName,
            emailAddresses: [{ address: email }],
            mobilePhone: phone,
        };

        const patientResponse = await fetch(
            "https://graph.microsoft.com/v1.0/users/fsclinicals-com@mail.clinicviews.com/contacts",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(patientData),
            }
        );

        if (!patientResponse.ok) {
            const errorData = (await patientResponse.json()) as ErrorResponse;
            console.error("Patient creation error:", errorData);
            throw new Error(
                `Failed to create patient record: ${
                    errorData.error?.message || "Unknown error"
                }`
            );
        }

        const patient = await patientResponse.json();
        console.log("Patient record created:", patient);

        if (
            suggestAppointment === "true" &&
            appointmentDate &&
            appointmentTime
        ) {
            const eventUrl = `https://graph.microsoft.com/v1.0/users/fsclinicals-com@mail.clinicviews.com/calendar/events`;
            const appointmentResponse = await fetch(eventUrl, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
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
                                address: "steven@fsclinicals.com",
                                name: "FSClinicals Doctor",
                            },
                            type: "required",
                        },
                    ],
                }),
            });

            if (!appointmentResponse.ok) {
                const errorData =
                    (await appointmentResponse.json()) as ErrorResponse;
                console.error("Appointment creation error:", errorData);
                throw new Error(
                    `Failed to create appointment: ${
                        errorData.error?.message || "Unknown error"
                    }`
                );
            }

            const appointmentResult = await appointmentResponse.json();
            console.log("Appointment created successfully:", appointmentResult);
        } else {
            console.log("No appointment was created, skipping email sending.");
        }

        const patientEmailHtml = renderToString(
            EmailTemplate({
                name: patientName,
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
                name: patientName,
                email,
                phone,
                reason,
                appointmentDate,
                appointmentTime: formattedAppointmentTime,
                isDoctor: true,
            })
        );

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT!, 10),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
            tls: {
                ciphers: "SSLv3",
                rejectUnauthorized: false,
            },
            debug: true,
            logger: true,
        });

        await sendEmail(
            transporter,
            "steven@fsclinicals.com",
            "New Patient Registration and Appointment",
            doctorEmailHtml,
            [
                {
                    filename: `${file.originalFilename}.zip`,
                    content: fileContent,
                },
            ]
        );

        await sendEmail(
            transporter,
            email,
            "Registration Confirmation",
            patientEmailHtml
        );

        res.status(200).json({ message: "Patient registered successfully" });
    } catch (error) {
        console.error("Error registering patient:", error);
        res.status(500).json({
            error: "Error registering patient",
            details: (error as Error).message,
        });
    }
}
