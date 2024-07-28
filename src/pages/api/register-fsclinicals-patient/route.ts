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
// import ical from "ical-generator";

// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

// const local = process.env;
// export const devMode = local.NODE_ENV === "development";
// // export const mode = devMode
// //     ? (local.LOCAL_DEVELOPMENT_MODE as string)
// //     : (local.DRIPTRACE_MEDICAL_PRODUCTION_MODE as string);
// // const mode = `http${local.NEXT_PUBLIC_ROOT_DOMAIN}`;
// // export const mode = `http://${local.NEXT_PUBLIC_APP_CONTEXT}`;
// export const smtpAuthUser =
//     local.FSCLINICALS_CLINICVIEWS_USER_ENDPOINT as string;
// export const smtpAuthPass =
//     local.FSCLINICALS_CLINICVIEWS_USER_PASSWORD as string;
// export const smtpRecipient = devMode
//     ? (local.RUSSELLPALMA_USER_ENDPOINT as string)
//     : (local.FSCLINICALS_USER_ENDPOINT as string);
// export const graphCalendarEvent =
//     local.MICROSOFT_GRAPH_CALENDAR_EVENT_ENDPOINT as string;
// export const graphContacts = local.MICROSOFT_GRAPH_CONTACTS_ENDPOINT as string;
// export const smtpHost = local.OFFICE365_SMTP_DOMAIN as string;
// export const smtpPort = local.OFFICE365_SMTP_PORT as string;

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
//     transporter: nodemailer.Transporter,
//     to: string,
//     subject: string,
//     content: string,
//     attachments?: nodemailer.SendMailOptions["attachments"]
// ) {
//     console.log(`Sending email to ${to}`);

//     const mailOptions: nodemailer.SendMailOptions = {
//         from: `"FSClinicals Mail" <${smtpAuthUser}>`,
//         to,
//         subject,
//         html: content,
//         attachments,
//     };

//     await transporter.sendMail(mailOptions);

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

// async function sendEmailWithCalendar(
//     transporter: nodemailer.Transporter,
//     to: string,
//     subject: string,
//     content: string,
//     calendarEvent: any,
//     attachments?: nodemailer.SendMailOptions["attachments"]
// ) {
//     console.log(`Sending email to ${to}`);

//     const mailOptions: nodemailer.SendMailOptions = {
//         from: `"FSClinicals Mail" <${smtpAuthUser}>`,
//         to,
//         subject,
//         html: content,
//         attachments: [
//             ...(attachments || []),
//             {
//                 filename: 'event.ics',
//                 content: calendarEvent.toString(),
//                 contentType: 'text/calendar',
//             },
//         ],
//         alternatives: [
//             {
//                 contentType: 'text/calendar',
//                 content: Buffer.from(calendarEvent.toString()),
//                 contentDisposition: 'inline',
//             },
//         ],
//     };

//     await transporter.sendMail(mailOptions);

//     console.log(`Email sent successfully to ${to}`);
// }

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     console.log("Received request to /api/register-fsclinicals-patient");
//     console.log("Headers:", req.headers);

//     const retrivedFullUrl =
//         (req.headers["x-full-url"] as string) || `http://${req.headers.host}`;
//     console.log("Full URL:", retrivedFullUrl);

//     if (req.method !== "POST") {
//         return res.status(405).json({ error: "Method Not Allowed" });
//     }

//     console.log("Received request to /api/register-fsclinicals-patient");

//     const fullUrl = req.headers["x-full-url"] as string;
//     if (!fullUrl) {
//         return res.status(500).json({ error: "Full URL not available" });
//     }

//     console.log("Full URL being used:", fullUrl);

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

//         const patientName = Array.isArray(fields.patientName)
//             ? fields.patientName[0]
//             : fields.patientName;
//         const email = Array.isArray(fields.email)
//             ? fields.email[0]
//             : fields.email;
//         const phone = Array.isArray(fields.phone)
//             ? fields.phone[0]
//             : fields.phone;

//         const gad7_score = Array.isArray(fields.gad7_score)
//             ? fields.gad7_score[0]
//             : fields.gad7_score;

//         const phq9_score = Array.isArray(fields.phq9_score)
//             ? fields.phq9_score[0]
//             : fields.phq9_score;

//         const asrs_score = Array.isArray(fields.asrs_score)
//             ? fields.asrs_score[0]
//             : fields.asrs_score;

//         const dast_score = Array.isArray(fields.dast_score)
//             ? fields.dast_score[0]
//             : fields.dast_score;

//         const reason = Array.isArray(fields.reason)
//             ? fields.reason[0]
//             : fields.reason;
//         const appointmentDate = Array.isArray(fields.appointmentDate)
//             ? fields.appointmentDate[0]
//             : fields.appointmentDate;
//         const appointmentTime = Array.isArray(fields.appointmentTime)
//             ? fields.appointmentTime[0]
//             : fields.appointmentTime;

//         // formData.append("gad7_score", formResults["gad7_score"]);
//         // formData.append("phq9_score", formResults["phq9_score"]);
//         // formData.append("asrs_score", formResults["asrs_score"]);
//         // formData.append("dast_score", formResults["dast_score"]);

//         const isNewPatient = !!files.file;

//         let fileContent, fileSize;
//         if (isNewPatient) {
//             const file = files.file[0] as File;
//             const zipFilePath = await compressFile(file);
//             fileContent = await fs.readFile(zipFilePath);
//             fileSize = fileContent.length;

//             console.log("Compressed file details:", {
//                 name: `${file.originalFilename}.zip`,
//                 size: fileSize,
//             });
//         }

//         // const appointmentDateTime = new Date(
//         //     `${appointmentDate}T${appointmentTime}`
//         // );
//         // const formattedAppointmentTime = formatTo12HourTime(
//         //     appointmentDateTime.toISOString()
//         // );

//         // console.log("Parsed form data:", {
//         //     patientName,
//         //     email,
//         //     phone,
//         //     gad7_score,
//         //     phq9_score,
//         //     asrs_score,
//         //     dast_score,
//         //     reason,
//         //     appointmentDate,
//         //     appointmentTime,
//         //     appointmentDateTime,
//         //     formattedAppointmentTime,
//         //     isNewPatient,
//         // });

//         // console.log("Mode:\n", mode);

//         console.log("Full URL:", fullUrl);
//         const tokenResponse = await fetch(`${fullUrl}/api/get-token/route`);
//         const { accessToken } = (await tokenResponse.json()) as TokenResponse;
//         // const tokenResponse = await fetch(`${mode}/api/get-token/route`);
//         // const { accessToken } = (await tokenResponse.json()) as TokenResponse;

//         if (isNewPatient) {
//             const patientData = {
//                 displayName: patientName,
//                 emailAddresses: [{ address: email }],
//                 mobilePhone: phone,
//             };

//             const patientResponse = await fetch(`${graphContacts}`, {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(patientData),
//             });

//             if (!patientResponse.ok) {
//                 const errorData =
//                     (await patientResponse.json()) as ErrorResponse;
//                 console.error("Patient creation error:", errorData);
//                 throw new Error(
//                     `Failed to create patient record: ${
//                         errorData.error?.message || "Unknown error"
//                     }`
//                 );
//             }

//             const patient = await patientResponse.json();
//             console.log("Patient record created:", patient);
//         }

//         // const eventUrl = `${graphCalendarEvent}`;
//         // const appointmentResponse = await fetch(eventUrl, {
//         //     method: "POST",
//         //     headers: {
//         //         Authorization: `Bearer ${accessToken}`,
//         //         "Content-Type": "application/json",
//         //     },
//         //     body: JSON.stringify({
//         //         subject: `Appointment with ${patientName}`,
//         //         body: {
//         //             contentType: "HTML",
//         //             content: `Appointment details for ${patientName} on ${appointmentDate} at ${formattedAppointmentTime}.`,
//         //         },
//         //         start: {
//         //             dateTime: appointmentDateTime.toISOString(),
//         //             timeZone: "Pacific Standard Time",
//         //         },
//         //         end: {
//         //             dateTime: new Date(
//         //                 appointmentDateTime.getTime() + 60 * 60 * 1000
//         //             ).toISOString(),
//         //             timeZone: "Pacific Standard Time",
//         //         },
//         //         attendees: [
//         //             {
//         //                 emailAddress: {
//         //                     address: email,
//         //                     name: patientName,
//         //                 },
//         //                 type: "required",
//         //             },
//         //             {
//         //                 emailAddress: {
//         //                     address: `${smtpRecipient}`,
//         //                     name: "FSClinicals Connect",
//         //                 },
//         //                 type: "required",
//         //             },
//         //         ],
//         //     }),
//         // });

//         // if (!appointmentResponse.ok) {
//         //     const errorData =
//         //         (await appointmentResponse.json()) as ErrorResponse;
//         //     console.error("Appointment creation error:", errorData);
//         //     throw new Error(
//         //         `Failed to create appointment: ${
//         //             errorData.error?.message || "Unknown error"
//         //         }`
//         //     );
//         // }

//         // const appointmentResult = await appointmentResponse.json();
//         // console.log("Appointment created successfully:", appointmentResult);

//         // const patientEmailHtml = renderToString(
//         //     EmailTemplate({
//         //         name: patientName,
//         //         email,
//         //         phone,
//         //         reason,
//         //         gad7_score,
//         //         phq9_score,
//         //         asrs_score,
//         //         dast_score,
//         //         appointmentDate,
//         //         appointmentTime: formattedAppointmentTime,
//         //         isDoctor: false,
//         //         isNewPatient,
//         //     })
//         // );

//         // const doctorEmailHtml = renderToString(
//         //     EmailTemplate({
//         //         name: patientName,
//         //         email,
//         //         phone,
//         //         reason,
//         //         gad7_score,
//         //         phq9_score,
//         //         asrs_score,
//         //         dast_score,
//         //         appointmentDate,
//         //         appointmentTime: formattedAppointmentTime,
//         //         isDoctor: true,
//         //         isNewPatient,
//         //     })
//         // );

//         // const transporter = nodemailer.createTransport({
//         //     host: smtpHost,
//         //     port: parseInt(smtpPort!, 10),
//         //     secure: false,
//         //     auth: {
//         //         user: smtpAuthUser,
//         //         pass: smtpAuthPass,
//         //     },
//         //     tls: {
//         //         ciphers: "SSLv3",
//         //         rejectUnauthorized: false,
//         //     },
//         //     debug: true,
//         //     logger: true,
//         // });

//         // await sendEmail(
//         //     transporter,
//         //     `${smtpRecipient}`,
//         //     isNewPatient
//         //         ? "New Patient Registration and Appointment"
//         //         : "New Appointment Suggestion",
//         //     doctorEmailHtml,
//         //     isNewPatient
//         //         ? [
//         //               {
//         //                   filename: `${
//         //                       (files.file[0] as File).originalFilename
//         //                   }.zip`,
//         //                   content: fileContent,
//         //               },
//         //           ]
//         //         : undefined
//         // );

//         // await sendEmail(
//         //     transporter,
//         //     email,
//         //     isNewPatient
//         //         ? "Registration Confirmation"
//         //         : "Appointment Suggestion Confirmation",
//         //     patientEmailHtml
//         // );

//         const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
//         const formattedAppointmentTime = formatTo12HourTime(appointmentDateTime.toISOString());

//         // Create iCal event
//         const calendarEvent = ical({
//             domain: 'fsclinicals.com',
//             name: 'FSClinicals Appointment',
//         });

//         calendarEvent.createEvent({
//             start: appointmentDateTime,
//             end: new Date(appointmentDateTime.getTime() + 60 * 60 * 1000),
//             summary: `Appointment with ${patientName}`,
//             description: `Appointment details for ${patientName} on ${appointmentDate} at ${formattedAppointmentTime}.\nReason: ${reason}`,
//             location: 'FSClinicals Office',
//             url: 'https://fsclinicals.com',
//             organizer: {
//                 name: 'FSClinicals Connect',
//                 email: smtpRecipient,
//             },
//             attendees: [
//                 {
//                     name: patientName,
//                     email: email,
//                     rsvp: true,
//                     partstat: 'NEEDS-ACTION',
//                     role: 'REQ-PARTICIPANT',
//                 },
//             ],
//         });

//         const transporter = nodemailer.createTransport({
//             host: smtpHost,
//             port: parseInt(smtpPort!, 10),
//             secure: false,
//             auth: {
//                 user: smtpAuthUser,
//                 pass: smtpAuthPass,
//             },
//             tls: {
//                 ciphers: "SSLv3",
//                 rejectUnauthorized: false,
//             },
//         });

//         const patientEmailHtml = renderToString(
//             EmailTemplate({
//                 name: patientName,
//                 email,
//                 phone,
//                 reason,
//                 gad7_score,
//                 phq9_score,
//                 asrs_score,
//                 dast_score,
//                 appointmentDate,
//                 appointmentTime: formattedAppointmentTime,
//                 isDoctor: false,
//                 isNewPatient,
//             })
//         );

//         const doctorEmailHtml = renderToString(
//             EmailTemplate({
//                 name: patientName,
//                 email,
//                 phone,
//                 reason,
//                 gad7_score,
//                 phq9_score,
//                 asrs_score,
//                 dast_score,
//                 appointmentDate,
//                 appointmentTime: formattedAppointmentTime,
//                 isDoctor: true,
//                 isNewPatient,
//             })
//         );

//         // Send email to doctor
//         await sendEmailWithCalendar(
//             transporter,
//             smtpRecipient,
//             isNewPatient ? "New Patient Registration and Appointment" : "New Appointment Suggestion",
//             doctorEmailHtml,
//             calendarEvent,
//             isNewPatient
//                 ? [
//                       {
//                           filename: `${(files.file[0] as File).originalFilename}.zip`,
//                           content: fileContent,
//                       },
//                   ]
//                 : undefined
//         );

//         // Send email to patient
//         await sendEmailWithCalendar(
//             transporter,
//             email,
//             isNewPatient ? "Registration Confirmation" : "Appointment Suggestion Confirmation",
//             patientEmailHtml,
//             calendarEvent
//         );

//         res.status(200).json({
//             message: isNewPatient
//                 ? "Patient registered successfully"
//                 : "Appointment suggested successfully",
//         });
//     } catch (error) {
//         console.error("Error registering patient:", error);
//         res.status(500).json({
//             error: "Error registering patient",
//             details: (error as Error).message,
//         });
//     }

//         // res.status(200).json({
//         //     message: isNewPatient
//         //         ? "Patient registered successfully"
//         //         : "Appointment suggested successfully",
//         // });
//     } catch (error) {
//         console.error("Error registering patient:", error);
//         res.status(500).json({
//             error: "Error registering patient",
//             details: (error as Error).message,
//         });
//     }
// }

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
// import ical from "ical-generator";

// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

// const local = process.env;
// export const devMode = local.NODE_ENV === "development";
// // export const mode = devMode
// //     ? (local.LOCAL_DEVELOPMENT_MODE as string)
// //     : (local.DRIPTRACE_MEDICAL_PRODUCTION_MODE as string);
// // const mode = `http${local.NEXT_PUBLIC_ROOT_DOMAIN}`;
// // export const mode = `http://${local.NEXT_PUBLIC_APP_CONTEXT}`;
// export const smtpAuthUser =
//     local.FSCLINICALS_CLINICVIEWS_USER_ENDPOINT as string;
// export const smtpAuthPass =
//     local.FSCLINICALS_CLINICVIEWS_USER_PASSWORD as string;
// export const smtpRecipient = devMode
//     ? (local.RUSSELLPALMA_USER_ENDPOINT as string)
//     : (local.FSCLINICALS_USER_ENDPOINT as string);
// export const graphCalendarEvent =
//     local.MICROSOFT_GRAPH_CALENDAR_EVENT_ENDPOINT as string;
// export const graphContacts = local.MICROSOFT_GRAPH_CONTACTS_ENDPOINT as string;
// export const smtpHost = local.OFFICE365_SMTP_DOMAIN as string;
// export const smtpPort = local.OFFICE365_SMTP_PORT as string;

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
//     transporter: nodemailer.Transporter,
//     to: string,
//     subject: string,
//     content: string,
//     attachments?: nodemailer.SendMailOptions["attachments"]
// ) {
//     console.log(`Sending email to ${to}`);

//     const mailOptions: nodemailer.SendMailOptions = {
//         from: `"FSClinicals Mail" <${smtpAuthUser}>`,
//         to,
//         subject,
//         html: content,
//         attachments,
//     };

//     await transporter.sendMail(mailOptions);

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

// async function sendEmailWithCalendar(
//     transporter: nodemailer.Transporter,
//     to: string,
//     subject: string,
//     content: string,
//     calendarEvent: any,
//     attachments?: nodemailer.SendMailOptions["attachments"]
// ) {
//     console.log(`Sending email to ${to}`);

//     const mailOptions: nodemailer.SendMailOptions = {
//         from: `"FSClinicals Mail" <${smtpAuthUser}>`,
//         to,
//         subject,
//         html: content,
//         attachments: [
//             ...(attachments || []),
//             {
//                 filename: 'event.ics',
//                 content: calendarEvent.toString(),
//                 contentType: 'text/calendar',
//             },
//         ],
//         alternatives: [
//             {
//                 contentType: 'text/calendar',
//                 content: Buffer.from(calendarEvent.toString()),
//                 contentDisposition: 'inline',
//             },
//         ],
//     };

//     await transporter.sendMail(mailOptions);

//     console.log(`Email sent successfully to ${to}`);
// }

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     console.log("Received request to /api/register-fsclinicals-patient");
//     console.log("Headers:", req.headers);

//     const retrivedFullUrl =
//         (req.headers["x-full-url"] as string) || `http://${req.headers.host}`;
//     console.log("Full URL:", retrivedFullUrl);

//     if (req.method !== "POST") {
//         return res.status(405).json({ error: "Method Not Allowed" });
//     }

//     console.log("Received request to /api/register-fsclinicals-patient");

//     const fullUrl = req.headers["x-full-url"] as string;
//     if (!fullUrl) {
//         return res.status(500).json({ error: "Full URL not available" });
//     }

//     console.log("Full URL being used:", fullUrl);

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

//         const patientName = Array.isArray(fields.patientName)
//             ? fields.patientName[0]
//             : fields.patientName;
//         const email = Array.isArray(fields.email)
//             ? fields.email[0]
//             : fields.email;
//         const phone = Array.isArray(fields.phone)
//             ? fields.phone[0]
//             : fields.phone;

//         const gad7_score = Array.isArray(fields.gad7_score)
//             ? fields.gad7_score[0]
//             : fields.gad7_score;

//         const phq9_score = Array.isArray(fields.phq9_score)
//             ? fields.phq9_score[0]
//             : fields.phq9_score;

//         const asrs_score = Array.isArray(fields.asrs_score)
//             ? fields.asrs_score[0]
//             : fields.asrs_score;

//         const dast_score = Array.isArray(fields.dast_score)
//             ? fields.dast_score[0]
//             : fields.dast_score;

//         const reason = Array.isArray(fields.reason)
//             ? fields.reason[0]
//             : fields.reason;
//         const appointmentDate = Array.isArray(fields.appointmentDate)
//             ? fields.appointmentDate[0]
//             : fields.appointmentDate;
//         const appointmentTime = Array.isArray(fields.appointmentTime)
//             ? fields.appointmentTime[0]
//             : fields.appointmentTime;

//         // formData.append("gad7_score", formResults["gad7_score"]);
//         // formData.append("phq9_score", formResults["phq9_score"]);
//         // formData.append("asrs_score", formResults["asrs_score"]);
//         // formData.append("dast_score", formResults["dast_score"]);

//         const isNewPatient = !!files.file;

//         let fileContent, fileSize;
//         if (isNewPatient) {
//             const file = files.file[0] as File;
//             const zipFilePath = await compressFile(file);
//             fileContent = await fs.readFile(zipFilePath);
//             fileSize = fileContent.length;

//             console.log("Compressed file details:", {
//                 name: `${file.originalFilename}.zip`,
//                 size: fileSize,
//             });
//         }

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
//             gad7_score,
//             phq9_score,
//             asrs_score,
//             dast_score,
//             reason,
//             appointmentDate,
//             appointmentTime,
//             appointmentDateTime,
//             formattedAppointmentTime,
//             isNewPatient,
//         });

//         // console.log("Mode:\n", mode);

//         console.log("Full URL:", fullUrl);
//         const tokenResponse = await fetch(`${fullUrl}/api/get-token/route`);
//         const { accessToken } = (await tokenResponse.json()) as TokenResponse;
//         // const tokenResponse = await fetch(`${mode}/api/get-token/route`);
//         // const { accessToken } = (await tokenResponse.json()) as TokenResponse;

//         if (isNewPatient) {
//             const patientData = {
//                 displayName: patientName,
//                 emailAddresses: [{ address: email }],
//                 mobilePhone: phone,
//             };

//             const patientResponse = await fetch(`${graphContacts}`, {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(patientData),
//             });

//             if (!patientResponse.ok) {
//                 const errorData =
//                     (await patientResponse.json()) as ErrorResponse;
//                 console.error("Patient creation error:", errorData);
//                 throw new Error(
//                     `Failed to create patient record: ${
//                         errorData.error?.message || "Unknown error"
//                     }`
//                 );
//             }

//             const patient = await patientResponse.json();
//             console.log("Patient record created:", patient);
//         }

//         const eventUrl = `${graphCalendarEvent}`;
//         const appointmentResponse = await fetch(eventUrl, {
//             method: "POST",
//             headers: {
//                 Authorization: `Bearer ${accessToken}`,
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 subject: `Appointment with ${patientName}`,
//                 body: {
//                     contentType: "HTML",
//                     content: `Appointment details for ${patientName} on ${appointmentDate} at ${formattedAppointmentTime}.`,
//                 },
//                 start: {
//                     dateTime: appointmentDateTime.toISOString(),
//                     timeZone: "Pacific Standard Time",
//                 },
//                 end: {
//                     dateTime: new Date(
//                         appointmentDateTime.getTime() + 60 * 60 * 1000
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
//                             address: `${smtpRecipient}`,
//                             name: "FSClinicals Connect",
//                         },
//                         type: "required",
//                     },
//                 ],
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

//         const appointmentResult = await appointmentResponse.json();
//         console.log("Appointment created successfully:", appointmentResult);

//         const patientEmailHtml = renderToString(
//             EmailTemplate({
//                 name: patientName,
//                 email,
//                 phone,
//                 reason,
//                 gad7_score,
//                 phq9_score,
//                 asrs_score,
//                 dast_score,
//                 appointmentDate,
//                 appointmentTime: formattedAppointmentTime,
//                 isDoctor: false,
//                 isNewPatient,
//             })
//         );

//         const doctorEmailHtml = renderToString(
//             EmailTemplate({
//                 name: patientName,
//                 email,
//                 phone,
//                 reason,
//                 gad7_score,
//                 phq9_score,
//                 asrs_score,
//                 dast_score,
//                 appointmentDate,
//                 appointmentTime: formattedAppointmentTime,
//                 isDoctor: true,
//                 isNewPatient,
//             })
//         );

//         const transporter = nodemailer.createTransport({
//             host: smtpHost,
//             port: parseInt(smtpPort!, 10),
//             secure: false,
//             auth: {
//                 user: smtpAuthUser,
//                 pass: smtpAuthPass,
//             },
//             tls: {
//                 ciphers: "SSLv3",
//                 rejectUnauthorized: false,
//             },
//             debug: true,
//             logger: true,
//         });

//         await sendEmail(
//             transporter,
//             `${smtpRecipient}`,
//             isNewPatient
//                 ? "New Patient Registration and Appointment"
//                 : "New Appointment Suggestion",
//             doctorEmailHtml,
//             isNewPatient
//                 ? [
//                       {
//                           filename: `${
//                               (files.file[0] as File).originalFilename
//                           }.zip`,
//                           content: fileContent,
//                       },
//                   ]
//                 : undefined
//         );

//         await sendEmail(
//             transporter,
//             email,
//             isNewPatient
//                 ? "Registration Confirmation"
//                 : "Appointment Suggestion Confirmation",
//             patientEmailHtml
//         );

//         res.status(200).json({
//             message: isNewPatient
//                 ? "Patient registered successfully"
//                 : "Appointment suggested successfully",
//         });
//     } catch (error) {
//         console.error("Error registering patient:", error);
//         res.status(500).json({
//             error: "Error registering patient",
//             details: (error as Error).message,
//         });
//     }
// }

// import { NextApiRequest, NextApiResponse } from "next";
// import nodemailer from "nodemailer";
// import { IncomingForm, File } from "formidable";
// import fs from "fs/promises";
// import { createWriteStream } from "fs";
// import archiver from "archiver";
// import path from "path";
// import { renderToString } from "react-dom/server";
// import EmailTemplate from "@/components/FSClinicals/EmailTemplate";
// import ical, { ICalAttendeeStatus } from "ical-generator";
// import { ICalAttendeeRole, ICalEventStatus } from "ical-generator";

// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

// const local = process.env;
// export const devMode = local.NODE_ENV === "development";
// export const smtpAuthUser =
//     local.FSCLINICALS_CLINICVIEWS_USER_ENDPOINT as string;
// export const smtpAuthPass =
//     local.FSCLINICALS_CLINICVIEWS_USER_PASSWORD as string;
// export const smtpRecipient = devMode
//     ? (local.RUSSELLPALMA_USER_ENDPOINT as string)
//     : (local.FSCLINICALS_USER_ENDPOINT as string);
// export const smtpHost = local.OFFICE365_SMTP_DOMAIN as string;
// export const smtpPort = local.OFFICE365_SMTP_PORT as string;

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

// function formatTo12HourTime(dateString: string): string {
//     const date = new Date(dateString);
//     const hours = date.getHours();
//     const minutes = date.getMinutes();
//     const ampm = hours >= 12 ? "PM" : "AM";
//     const formattedHours = hours % 12 || 12;
//     const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
//     return `${formattedHours}:${formattedMinutes} ${ampm}`;
// }

// async function sendEmailWithCalendar(
//     transporter: nodemailer.Transporter,
//     to: string,
//     subject: string,
//     content: string,
//     calendarEvent: any,
//     attachments?: nodemailer.SendMailOptions["attachments"]
// ) {
//     console.log(`Sending email to ${to}`);

//     const mailOptions: nodemailer.SendMailOptions = {
//         from: `"FSClinicals Mail" <${smtpAuthUser}>`,
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

//     await transporter.sendMail(mailOptions);

//     console.log(`Email sent successfully to ${to}`);
// }

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     console.log("Received request to /api/register-fsclinicals-patient");
//     console.log("Headers:", req.headers);

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
//         const gad7_score = Array.isArray(fields.gad7_score)
//             ? fields.gad7_score[0]
//             : fields.gad7_score;
//         const phq9_score = Array.isArray(fields.phq9_score)
//             ? fields.phq9_score[0]
//             : fields.phq9_score;
//         const asrs_score = Array.isArray(fields.asrs_score)
//             ? fields.asrs_score[0]
//             : fields.asrs_score;
//         const dast_score = Array.isArray(fields.dast_score)
//             ? fields.dast_score[0]
//             : fields.dast_score;
//         const appointmentDate = Array.isArray(fields.appointmentDate)
//             ? fields.appointmentDate[0]
//             : fields.appointmentDate;
//         const appointmentTime = Array.isArray(fields.appointmentTime)
//             ? fields.appointmentTime[0]
//             : fields.appointmentTime;

//         const isNewPatient = !!files.file;

//         let fileContent, fileSize;
//         if (isNewPatient) {
//             const file = files.file[0] as File;
//             const zipFilePath = await compressFile(file);
//             fileContent = await fs.readFile(zipFilePath);
//             fileSize = fileContent.length;

//             console.log("Compressed file details:", {
//                 name: `${file.originalFilename}.zip`,
//                 size: fileSize,
//             });
//         }

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
//             gad7_score,
//             phq9_score,
//             asrs_score,
//             dast_score,
//             appointmentDate,
//             appointmentTime,
//             appointmentDateTime,
//             formattedAppointmentTime,
//             isNewPatient,
//         });

//         // Create iCal event
//         const calendarEvent = ical({
//             prodId: { company: "FSClinicals", product: "Appointment" },
//             name: "FSClinicals Appointment",
//         });

//         calendarEvent.createEvent({
//             start: appointmentDateTime,
//             end: new Date(appointmentDateTime.getTime() + 60 * 60 * 1000),
//             summary: `Appointment with ${patientName}`,
//             description: `Appointment details for ${patientName} on ${appointmentDate} at ${formattedAppointmentTime}.\nReason: ${reason}\nAssessment Scores:\nGAD-7: ${gad7_score}\nPHQ-9: ${phq9_score}\nASRS: ${asrs_score}\nDAST: ${dast_score}`,
//             location: "FSClinicals Office",
//             // url: "https://fsclinicals.com",
//             url: "https://fsclinicals.com",
//             organizer: {
//                 name: "FSClinicals Connect",
//                 email: smtpRecipient,
//             },
//             attendees: [
//                 {
//                     name: patientName,
//                     email: email,
//                     rsvp: true,
//                     role: ICalAttendeeRole.REQ,
//                     status: ICalAttendeeStatus.NEEDSACTION,
//                 },
//             ],
//         });

//         const transporter = nodemailer.createTransport({
//             host: smtpHost,
//             port: parseInt(smtpPort!, 10),
//             secure: false,
//             auth: {
//                 user: smtpAuthUser,
//                 pass: smtpAuthPass,
//             },
//             tls: {
//                 ciphers: "SSLv3",
//                 rejectUnauthorized: false,
//             },
//         });

//         const patientEmailHtml = renderToString(
//             EmailTemplate({
//                 name: patientName,
//                 email,
//                 phone,
//                 reason,
//                 gad7_score,
//                 phq9_score,
//                 asrs_score,
//                 dast_score,
//                 appointmentDate,
//                 appointmentTime: formattedAppointmentTime,
//                 isDoctor: false,
//                 isNewPatient,
//             })
//         );

//         const doctorEmailHtml = renderToString(
//             EmailTemplate({
//                 name: patientName,
//                 email,
//                 phone,
//                 reason,
//                 gad7_score,
//                 phq9_score,
//                 asrs_score,
//                 dast_score,
//                 appointmentDate,
//                 appointmentTime: formattedAppointmentTime,
//                 isDoctor: true,
//                 isNewPatient,
//             })
//         );

//         // Send email to doctor
//         await sendEmailWithCalendar(
//             transporter,
//             smtpRecipient,
//             isNewPatient
//                 ? "New Patient Registration and Appointment"
//                 : "New Appointment Suggestion",
//             doctorEmailHtml,
//             calendarEvent,
//             isNewPatient
//                 ? [
//                       {
//                           filename: `${
//                               (files.file[0] as File).originalFilename
//                           }.zip`,
//                           content: fileContent,
//                       },
//                   ]
//                 : undefined
//         );

//         // Send email to patient
//         await sendEmailWithCalendar(
//             transporter,
//             email,
//             isNewPatient
//                 ? "Registration Confirmation"
//                 : "Appointment Suggestion Confirmation",
//             patientEmailHtml,
//             calendarEvent
//         );

//         res.status(200).json({
//             message: isNewPatient
//                 ? "Patient registered successfully"
//                 : "Appointment suggested successfully",
//         });
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
    console.log("Received request to /api/register-fsclinicals-patient");
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
        const gad7_score = Array.isArray(fields.gad7_score)
            ? fields.gad7_score[0]
            : fields.gad7_score;
        const phq9_score = Array.isArray(fields.phq9_score)
            ? fields.phq9_score[0]
            : fields.phq9_score;
        const asrs_score = Array.isArray(fields.asrs_score)
            ? fields.asrs_score[0]
            : fields.asrs_score;
        const dast_score = Array.isArray(fields.dast_score)
            ? fields.dast_score[0]
            : fields.dast_score;
        const appointmentDate = Array.isArray(fields.appointmentDate)
            ? fields.appointmentDate[0]
            : fields.appointmentDate;
        const appointmentTime = Array.isArray(fields.appointmentTime)
            ? fields.appointmentTime[0]
            : fields.appointmentTime;

        const isNewPatient = !!files.file;

        let fileContent, fileSize;
        if (isNewPatient) {
            const file = files.file[0] as File;
            const zipFilePath = await compressFile(file);
            fileContent = await fs.readFile(zipFilePath);
            fileSize = fileContent.length;

            console.log("Compressed file details:", {
                name: `${file.originalFilename}.zip`,
                size: fileSize,
            });
        }

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
            gad7_score,
            phq9_score,
            asrs_score,
            dast_score,
            appointmentDate,
            appointmentTime,
            appointmentDateTime,
            formattedAppointmentTime,
            isNewPatient,
        });

        // Create iCal event
        const calendarEvent = ical({
            prodId: { company: "FSClinicals", product: "Appointment" },
            name: "FSClinicals Appointment",
        });

        calendarEvent.createEvent({
            start: appointmentDateTime,
            end: new Date(appointmentDateTime.getTime() + 60 * 60 * 1000),
            summary: `Appointment with ${patientName}`,
            description: `Appointment details for ${patientName} on ${appointmentDate} at ${formattedAppointmentTime}.\nReason: ${reason}\nAssessment Scores:\nGAD-7: ${gad7_score}\nPHQ-9: ${phq9_score}\nASRS: ${asrs_score}\nDAST: ${dast_score}`,
            location: "FSClinicals Office",
            url: "https://fsclinicals.com",
            organizer: {
                name: "FSClinicals Connect",
                email: smtpRecipient,
            },
            attendees: [
                {
                    name: patientName,
                    email: email,
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

        const patientEmailHtml = renderToString(
            EmailTemplate({
                name: patientName,
                email,
                phone,
                reason,
                gad7_score,
                phq9_score,
                asrs_score,
                dast_score,
                appointmentDate,
                appointmentTime: formattedAppointmentTime,
                isDoctor: false,
                isNewPatient,
            })
        );

        const doctorEmailHtml = renderToString(
            EmailTemplate({
                name: patientName,
                email,
                phone,
                reason,
                gad7_score,
                phq9_score,
                asrs_score,
                dast_score,
                appointmentDate,
                appointmentTime: formattedAppointmentTime,
                isDoctor: true,
                isNewPatient,
            })
        );

        // Send email to doctor
        await sendEmailWithCalendar(
            transporter,
            smtpRecipient,
            isNewPatient
                ? "New Patient Registration and Appointment"
                : "New Appointment Suggestion",
            doctorEmailHtml,
            calendarEvent,
            isNewPatient
                ? [
                      {
                          filename: `${
                              (files.file[0] as File).originalFilename
                          }.zip`,
                          content: fileContent,
                      },
                  ]
                : undefined
        );

        // Send email to patient
        await sendEmailWithCalendar(
            transporter,
            email,
            isNewPatient
                ? "Registration Confirmation"
                : "Appointment Suggestion Confirmation",
            patientEmailHtml,
            calendarEvent
        );

        res.status(200).json({
            message: isNewPatient
                ? "Patient registered successfully"
                : "Appointment suggested successfully",
        });
    } catch (error) {
        console.error("Error in patient registration process:", error);
        res.status(500).json({
            error: "Error processing patient registration",
            details: (error as Error).message,
        });
    }
}
