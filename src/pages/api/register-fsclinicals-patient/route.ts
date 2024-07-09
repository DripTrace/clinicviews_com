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

// export const devMode = process.env.NODE_ENV === "development";
// export const mode = devMode
//     ? (process.env.LOCAL_DEVELOPMENT_MODE as string)
//     : (process.env.DRIPTRACE_MEDICAL_PRODUCTION_MODE as string);
// export const smtpAuthUser = process.env
//     .FSCLINICALS_CLINICVIEWS_USER_ENDPOINT as string;
// export const smtpAuthPass = process.env
//     .FSCLINICALS_CLINICVIEWS_USER_PASSWORD as string;
// export const smtpRecipient = devMode
//     ? (process.env.RUSSELLPALMA_USER_ENDPOINT as string)
//     : (process.env.FSCLINICALS_USER_ENDPOINT as string);
// // export const smtpSender = devMode
// //     ? (process.env.RUSSELLPALMA_USER_ENDPOINT as string)
// //     : (process.env.FSCLINICALS_USER_ENDPOINT as string);
// export const graphCalendarEvent = process.env
//     .MICROSOFT_GRAPH_CALENDAR_EVENT_ENDPOINT as string;
// export const graphContacts = process.env
//     .MICROSOFT_GRAPH_CONTACTS_ENDPOINT as string;
// export const smtpHost = process.env.OFFICE365_SMTP_DOMAIN as string;
// export const smtpPort = process.env.OFFICE365_SMTP_PORT as string;

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

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     console.log("req:\n", req.body);
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

//         console.log("Mode:\n", mode);
//         const tokenResponse = await fetch(`${mode}/api/get-token/route`);
//         const { accessToken } = (await tokenResponse.json()) as TokenResponse;

//         const patientData = {
//             displayName: patientName,
//             emailAddresses: [{ address: email }],
//             mobilePhone: phone,
//         };

//         const patientResponse = await fetch(`${graphContacts}`, {
//             method: "POST",
//             headers: {
//                 Authorization: `Bearer ${accessToken}`,
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(patientData),
//         });

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
//             const eventUrl = `${graphCalendarEvent}`;
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
//                                 address: `${smtpRecipient}`,
//                                 name: "FSClinicals Connect",
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
//             "New Patient Registration and Appointment",
//             doctorEmailHtml,
//             [
//                 {
//                     filename: `${file.originalFilename}.zip`,
//                     content: fileContent,
//                 },
//             ]
//         );

//         await sendEmail(
//             transporter,
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

export const devMode = process.env.NODE_ENV === "development";
export const mode = devMode
    ? (process.env.LOCAL_DEVELOPMENT_MODE as string)
    : (process.env.DRIPTRACE_MEDICAL_PRODUCTION_MODE as string);
export const smtpAuthUser = process.env
    .FSCLINICALS_CLINICVIEWS_USER_ENDPOINT as string;
export const smtpAuthPass = process.env
    .FSCLINICALS_CLINICVIEWS_USER_PASSWORD as string;
export const smtpRecipient = devMode
    ? (process.env.RUSSELLPALMA_USER_ENDPOINT as string)
    : (process.env.FSCLINICALS_USER_ENDPOINT as string);
export const graphCalendarEvent = process.env
    .MICROSOFT_GRAPH_CALENDAR_EVENT_ENDPOINT as string;
export const graphContacts = process.env
    .MICROSOFT_GRAPH_CONTACTS_ENDPOINT as string;
export const smtpHost = process.env.OFFICE365_SMTP_DOMAIN as string;
export const smtpPort = process.env.OFFICE365_SMTP_PORT as string;

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
        from: `"FSClinicals Mail" <${smtpAuthUser}>`,
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
            appointmentDate,
            appointmentTime,
            appointmentDateTime,
            formattedAppointmentTime,
            isNewPatient,
        });

        console.log("Mode:\n", mode);
        const tokenResponse = await fetch(`${mode}/api/get-token/route`);
        const { accessToken } = (await tokenResponse.json()) as TokenResponse;

        if (isNewPatient) {
            const patientData = {
                displayName: patientName,
                emailAddresses: [{ address: email }],
                mobilePhone: phone,
            };

            const patientResponse = await fetch(`${graphContacts}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(patientData),
            });

            if (!patientResponse.ok) {
                const errorData =
                    (await patientResponse.json()) as ErrorResponse;
                console.error("Patient creation error:", errorData);
                throw new Error(
                    `Failed to create patient record: ${
                        errorData.error?.message || "Unknown error"
                    }`
                );
            }

            const patient = await patientResponse.json();
            console.log("Patient record created:", patient);
        }

        const eventUrl = `${graphCalendarEvent}`;
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
                            address: `${smtpRecipient}`,
                            name: "FSClinicals Connect",
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

        const patientEmailHtml = renderToString(
            EmailTemplate({
                name: patientName,
                email,
                phone,
                reason,
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
                appointmentDate,
                appointmentTime: formattedAppointmentTime,
                isDoctor: true,
                isNewPatient,
            })
        );

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
            debug: true,
            logger: true,
        });

        await sendEmail(
            transporter,
            `${smtpRecipient}`,
            isNewPatient
                ? "New Patient Registration and Appointment"
                : "New Appointment Suggestion",
            doctorEmailHtml,
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

        await sendEmail(
            transporter,
            email,
            isNewPatient
                ? "Registration Confirmation"
                : "Appointment Suggestion Confirmation",
            patientEmailHtml
        );

        res.status(200).json({
            message: isNewPatient
                ? "Patient registered successfully"
                : "Appointment suggested successfully",
        });
    } catch (error) {
        console.error("Error registering patient:", error);
        res.status(500).json({
            error: "Error registering patient",
            details: (error as Error).message,
        });
    }
}
