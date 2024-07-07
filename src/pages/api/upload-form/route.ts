import type { NextApiRequest, NextApiResponse } from "next";
import sgMail from "@sendgrid/mail";
import { IncomingForm } from "formidable";
import nodemailer from "nodemailer";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export const config = {
    api: {
        bodyParser: false,
    },
};

async function newPatient(req: NextApiRequest, res: NextApiResponse) {
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

        const file = files.file[0];

        const fileContent = await new Promise<Buffer>((resolve, reject) => {
            const chunks: Buffer[] = [];
            const readStream = require("fs").createReadStream(file.filepath);
            readStream.on("data", (chunk: Buffer) => chunks.push(chunk));
            readStream.on("error", reject);
            readStream.on("end", () => resolve(Buffer.concat(chunks)));
        });

        const fileContentBase64 = fileContent.toString("base64");

        // console.log("PDF file processed successfully");

        let emailTransporter = nodemailer.createTransport({
            host: `${process.env.PROTONMAIL_HOST}`,
            port: Number(`${process.env.PROTONMAIL_PORT}`),
            secure: false, // true for 465, false for other ports
            auth: {
                user: `${process.env.PROTONMAIL_SENDER}`,
                pass: `${process.env.PROTONMAIL_PASSWORD}`,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        // const dateTime = new Date().getTime();
        // const currentTime = parseInt((new Date().getTime() / 1000).toFixed(0));
        // console.log("Current Time: ", currentTime);
        const date = new Date();
        const formattedDate = date.toLocaleString("en-US", {
            timeZoneName: "short",
        });

        let emailInfo = await emailTransporter.sendMail({
            from: `"${process.env.PROTONMAIL_NAME}" <${process.env.PROTONMAIL_SENDER}>`,
            to: `${process.env.PROTONMAIL_RECIPIENT}`,
            // to: "me@russellpalma.com",
            subject: `New Patient Registration Details - ${formattedDate}`,
            text: "A patient registration form is attached to this email.",
            // html: `${emailContent}`,
            attachments: [
                {
                    // filename: `${file.filename}`,
                    filename: `new-patient-registration_${formattedDate}.pdf`,
                    content: fileContentBase64,
                    encoding: "base64",
                },
            ],
        });

        // if (emailInfo.messageId) {
        // 	console.log("%s email sent successfully", emailInfo.messageId);
        // 	return res.status(200).json({
        // 		message: "%s email sent successfully",
        // 		emailInfo,
        // 	});
        // } else {
        // 	return res.status(500).json({
        // 		error: "An unknown error occurred",
        // 	});
        console.log("%s email sent successfully", emailInfo.messageId);

        // 		const msg = {
        // 	// to: "llpmg@lomalindapsych.com",
        // 	to: "llpmg@lomalindapsych.com",
        // 	from: "colton@lomalindapsych.com",
        // 	subject: "New Patient Registration",
        // 	text: "New patient registration form attached",
        // 	attachments: [
        // 		{
        // 			content: fileContentBase64,
        // 			filename: "newpatient.pdf",
        // 			type: "application/pdf",
        // 			disposition: "attachment",
        // 		},
        // 	],
        // };

        // await sgMail.send(msg);

        // if (response[0].statusCode === 202) {
        // 	console.log("Email sent successfully");
        // 	return res.status(200).json({ message: "Email sent successfully" });
        // } else {
        // 	console.log("Error sending email:", response[0].headers);
        // 	return res.status(500).json({ error: "Error sending email" });
        // }

        return emailInfo;
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "An unknown error occurred",
        });
    } finally {
        // res.end();
        console.log("Email sent successfully");
        return res.status(200).json({
            message: "Email sent successfully",
        });
    }
}

export default newPatient;
