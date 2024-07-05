import type { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, File } from "formidable";
import fs from "fs/promises";
import { createWriteStream } from "fs";
import fetch from "node-fetch";
import archiver from "archiver";
import path from "path";
import { renderToString } from "react-dom/server";
import EmailTemplate from "@/components/FSClinicals/EmailTemplate";

export const config = {
    api: {
        bodyParser: false,
    },
};

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

async function sendEmail(
    accessToken: string,
    to: string,
    subject: string,
    content: string,
    attachmentContent?: string
) {
    console.log(`Sending email to ${to}`);
    const mailBody: any = {
        message: {
            subject,
            body: {
                contentType: "HTML",
                content,
            },
            toRecipients: [{ emailAddress: { address: to } }],
            attachments: attachmentContent
                ? [
                      {
                          "@odata.type": "#microsoft.graph.fileAttachment",
                          name: "patient_document.zip",
                          contentType: "application/zip",
                          contentBytes: attachmentContent,
                      },
                  ]
                : [],
        },
        saveToSentItems: true,
    };

    const mailUrl = `https://graph.microsoft.com/v1.0/users/fsclinicals-com@mail.clinicviews.com/sendMail`;
    const emailResponse = await fetch(mailUrl, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(mailBody),
    });

    if (!emailResponse.ok) {
        const errorData = (await emailResponse.json()) as ErrorResponse;
        console.error("Email sending error:", errorData);
        throw new Error(
            `Failed to send email: ${
                errorData.error?.message || "Unknown error"
            }`
        );
    }

    console.log(`Email sent successfully to ${to}`);
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

        console.log("Parsed form data:", {
            patientName,
            email,
            phone,
            reason,
            suggestAppointment,
            appointmentDate,
            appointmentTime,
        });

        if (process.env.NODE_ENV === "development") {
            process.env.APP_URL = process.env.DEV_APP_URL;
        } else {
            process.env.APP_URL = process.env.PROD_APP_URL;
        }

        const tokenResponse = await fetch(
            `${process.env.APP_URL}/api/get-token/route`
        );
        const { accessToken } = (await tokenResponse.json()) as {
            accessToken: string;
        };

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

        let appointmentResult = null;
        if (
            suggestAppointment === "true" &&
            appointmentDate &&
            appointmentTime
        ) {
            const appointmentDateTime = new Date(
                `${appointmentDate}T${appointmentTime}`
            );
            const now = new Date();
            const minAllowedTime = new Date(
                now.getTime() + 72 * 60 * 60 * 1000
            );

            if (appointmentDateTime < minAllowedTime) {
                return res.status(400).json({
                    error: "Appointment must be at least 72 hours in the future",
                });
            }

            const appointmentResponse = await fetch(
                `${process.env.APP_URL}/api/create-appointment/route`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        accessToken,
                        patientName,
                        email,
                        appointmentDateTime: appointmentDateTime.toISOString(),
                    }),
                }
            );

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

            appointmentResult = await appointmentResponse.json();
            console.log("Appointment created successfully:", appointmentResult);
        } else {
            console.log("No appointment was created, skipping email sending.");
            return res.status(200).json({
                message: "Patient registered successfully without appointment.",
            });
        }

        const patientEmailHtml = renderToString(
            EmailTemplate({
                name: patientName,
                email,
                phone,
                reason,
                isDoctor: false,
                appointmentDate,
                appointmentTime,
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
                appointmentTime,
            })
        );

        await sendEmail(
            accessToken,
            email,
            "Registration Confirmation",
            patientEmailHtml
        );
        await sendEmail(
            accessToken,
            "steven@fsclinicals.com",
            "New Patient Registration",
            doctorEmailHtml,
            attachmentContent
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
