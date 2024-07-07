import type { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm } from "formidable";
import nodemailer from "nodemailer";
import { renderToString } from "react-dom/server";
// import EmailTemplate from '@/components/LLPMG/EmailTemplate';
import LLPMGEmailTemplate from "@/components/LLPMG/LLPMGEmailTemplate";

export const config = {
    api: {
        bodyParser: false,
    },
};

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

        const name = fields.name[0];
        const email = fields.email[0];
        const phone = fields.phone[0];
        const reason = fields.reason[0];
        const file = files.pdf ? files.pdf[0] : null;

        let fileContentBase64 = "";
        if (file) {
            const fileContent = await new Promise<Buffer>((resolve, reject) => {
                const chunks: Buffer[] = [];
                const readStream = require("fs").createReadStream(
                    file.filepath
                );
                readStream.on("data", (chunk: Buffer) => chunks.push(chunk));
                readStream.on("error", reject);
                readStream.on("end", () => resolve(Buffer.concat(chunks)));
            });
            fileContentBase64 = fileContent.toString("base64");
        }

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

        const date = new Date();
        const formattedDate = date.toLocaleString("en-US", {
            timeZoneName: "short",
        });

        // Render email templates
        const patientEmailHtml = renderToString(
            LLPMGEmailTemplate({ name, email, phone, reason, isDoctor: false })
        );
        const doctorEmailHtml = renderToString(
            LLPMGEmailTemplate({ name, email, phone, reason, isDoctor: true })
        );

        // Send email to patient
        await emailTransporter.sendMail({
            from: `"${process.env.PROTONMAIL_NAME}" <${process.env.PROTONMAIL_SENDER}>`,
            to: email,
            subject: `Registration Confirmation - ${formattedDate}`,
            html: patientEmailHtml,
        });

        // Send email to LLPMG
        await emailTransporter.sendMail({
            from: `"${process.env.PROTONMAIL_NAME}" <${process.env.PROTONMAIL_SENDER}>`,
            to: process.env.PROTONMAIL_RECIPIENT,
            // to: email,
            subject: `New Patient Registration Details - ${formattedDate}`,
            html: doctorEmailHtml,
            attachments: file
                ? [
                      {
                          filename: `new-patient-registration_${formattedDate}.pdf`,
                          content: fileContentBase64,
                          encoding: "base64",
                      },
                  ]
                : [],
        });

        res.status(200).json({ message: "Registration successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An unknown error occurred" });
    }
}
