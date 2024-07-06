// import nodemailer from "nodemailer";
// import { NextApiRequest, NextApiResponse } from "next";
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
//         const appointmentDate = Array.isArray(fields.appointmentDate)
//             ? fields.appointmentDate[0]
//             : fields.appointmentDate;
//         const appointmentTime = Array.isArray(fields.appointmentTime)
//             ? fields.appointmentTime[0]
//             : fields.appointmentTime;

//         const appointmentDateTime = `${appointmentDate}T${appointmentTime}:00.000`;
//         const formattedAppointmentTime = new Date(
//             appointmentDateTime
//         ).toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//             hour12: true,
//         });

//         const patientEmailHtml = renderToString(
//             EmailTemplate({
//                 name: patientName,
//                 email,
//                 phone,
//                 reason,
//                 isDoctor: false,
//                 appointmentDate,
//                 appointmentTime: formattedAppointmentTime,
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
//                 appointmentTime: formattedAppointmentTime,
//             })
//         );

//         const transporter = nodemailer.createTransport({
//             host: process.env.SMTP_HOST,
//             port: parseInt(process.env.SMTP_PORT!, 10),
//             secure: false, // true for 465, false for other ports
//             auth: {
//                 user: process.env.SMTP_USER,
//                 pass: process.env.SMTP_PASSWORD,
//             },
//         });

//         const mailOptions = {
//             from: `"FSClinicals Mail" <${process.env.SMTP_USER}>`,
//             to: email,
//             subject: "Registration Confirmation",
//             html: patientEmailHtml,
//         };

//         const mailOptionsDoctor = {
//             from: `"FSClinicals Mail" <${process.env.SMTP_USER}>`,
//             to: "rpalm@driptrace.io",
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

//         res.status(200).json({ message: "Emails sent successfully" });
//     } catch (error: unknown) {
//         console.error("Error sending emails:", error);
//         if (error instanceof Error) {
//             res.status(500).json({
//                 error: "Error sending emails",
//                 details: error.message,
//             });
//         } else {
//             res.status(500).json({
//                 error: "Unknown error occurred",
//             });
//         }
//     }
// }

// src/pages/api/send-email.ts
import nodemailer from "nodemailer";
import { NextApiRequest, NextApiResponse } from "next";
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

        if (!files.file || !files.file.length) {
            throw new Error("No file uploaded");
        }

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
        const appointmentDate = Array.isArray(fields.appointmentDate)
            ? fields.appointmentDate[0]
            : fields.appointmentDate;
        const appointmentTime = Array.isArray(fields.appointmentTime)
            ? fields.appointmentTime[0]
            : fields.appointmentTime;

        const appointmentDateTime = new Date(
            `${appointmentDate}T${appointmentTime}:00.000Z`
        );
        if (isNaN(appointmentDateTime.getTime())) {
            throw new Error("Invalid date or time value");
        }

        const formattedAppointmentTime = appointmentDateTime.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            }
        );

        const patientEmailHtml = renderToString(
            EmailTemplate({
                name: patientName,
                email,
                phone,
                reason,
                isDoctor: false,
                appointmentDate,
                appointmentTime: formattedAppointmentTime,
            })
        );

        const doctorEmailHtml = renderToString(
            EmailTemplate({
                name: patientName,
                email,
                phone,
                reason,
                isDoctor: true,
                appointmentDate,
                appointmentTime: formattedAppointmentTime,
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
        });

        const mailOptionsPatient = {
            from: `"FSClinicals Mail" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Registration Confirmation",
            html: patientEmailHtml,
        };

        const mailOptionsDoctor = {
            from: `"FSClinicals Mail" <${process.env.SMTP_USER}>`,
            to: "rpalm@driptrace.io",
            subject: "New Patient Registration",
            html: doctorEmailHtml,
            attachments: [
                {
                    filename: "patient_document.zip",
                    content: attachmentContent,
                    encoding: "base64",
                },
            ],
        };

        await transporter.sendMail(mailOptionsPatient);
        await transporter.sendMail(mailOptionsDoctor);

        res.status(200).json({ message: "Emails sent successfully" });
    } catch (error: unknown) {
        console.error("Error sending emails:", error);
        if (error instanceof Error) {
            res.status(500).json({
                error: "Error sending emails",
                details: error.message,
            });
        } else {
            res.status(500).json({
                error: "Unknown error occurred",
            });
        }
    }
}
