import type { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, File } from "formidable";
import fs from "fs/promises";
import { createWriteStream } from "fs"; // Import the correct 'fs' module for createWriteStream
import fetch from "node-fetch";
import archiver from "archiver";
import path from "path";

export const config = {
    api: {
        bodyParser: false,
    },
};

const CHUNK_SIZE = 3 * 1024 * 1024; // 3MB chunks

interface TokenResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
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

interface UploadSession {
    uploadUrl: string;
    expirationDateTime: string;
    nextExpectedRanges: string[];
}

interface MessageResponse {
    id: string;
    createdDateTime: string;
}

async function createUploadSession(
    accessToken: string,
    fileName: string,
    fileSize: number
): Promise<UploadSession> {
    console.log(
        "Creating upload session for file:",
        fileName,
        "Size:",
        fileSize
    );
    try {
        const messagePayload = {
            subject: "Patient Registration Document",
            body: {
                contentType: "Text",
                content:
                    "Please find attached the patient registration document.",
            },
            toRecipients: [
                {
                    emailAddress: {
                        address: "fsclinicals-com@mail.clinicviews.com",
                    },
                },
            ],
        };

        console.log("Message creation payload:", messagePayload);

        const response = await fetch(
            "https://graph.microsoft.com/v1.0/users/fsclinicals-com@mail.clinicviews.com/messages",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(messagePayload),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error(
                "Message creation failed. Status:",
                response.status,
                "Response:",
                errorText
            );
            throw new Error(
                `Failed to create message: ${response.statusText}. Details: ${errorText}`
            );
        }

        const messageData = (await response.json()) as MessageResponse;
        console.log("Message created successfully:", messageData);

        const uploadSessionPayload = {
            AttachmentItem: {
                attachmentType: "file",
                name: fileName,
                size: fileSize,
                contentType: "application/zip",
                isInline: false,
            },
        };

        console.log("Upload session creation payload:", uploadSessionPayload);

        const uploadSessionResponse = await fetch(
            `https://graph.microsoft.com/v1.0/users/fsclinicals-com@mail.clinicviews.com/messages/${messageData.id}/attachments/createUploadSession`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(uploadSessionPayload),
            }
        );

        if (!uploadSessionResponse.ok) {
            const errorText = await uploadSessionResponse.text();
            console.error(
                "Upload session creation failed. Status:",
                uploadSessionResponse.status,
                "Response:",
                errorText
            );
            throw new Error(
                `Failed to create upload session: ${uploadSessionResponse.statusText}. Details: ${errorText}`
            );
        }

        const sessionData =
            (await uploadSessionResponse.json()) as UploadSession;
        console.log("Upload session created successfully:", sessionData);
        return sessionData;
    } catch (error) {
        console.error("Error in createUploadSession:", error);
        throw error;
    }
}

async function uploadChunk(
    uploadUrl: string,
    fileContent: Buffer,
    start: number,
    end: number,
    totalSize: number
) {
    console.log(`Uploading chunk: bytes ${start}-${end - 1}/${totalSize}`);
    const chunk = fileContent.slice(start, end);
    const response = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
            "Content-Length": `${chunk.length}`,
            "Content-Range": `bytes ${start}-${end - 1}/${totalSize}`,
            "Content-Type": "application/octet-stream",
        },
        body: chunk,
    });

    if (!response.ok && response.status !== 201) {
        const errorText = await response.text();
        console.error(
            "Chunk upload failed. Status:",
            response.status,
            "Response:",
            errorText
        );
        throw new Error(
            `Failed to upload chunk: ${response.statusText}. Details: ${errorText}`
        );
    }

    console.log("Chunk uploaded successfully");
    return response;
}

async function sendEmail(
    accessToken: string,
    to: string,
    subject: string,
    content: string,
    attachmentContent: string
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
        },
        saveToSentItems: true,
    };

    if (attachmentContent) {
        mailBody.message.attachments = [
            {
                "@odata.type": "#microsoft.graph.fileAttachment",
                name: "patient_document.zip",
                contentType: "application/zip",
                contentBytes: attachmentContent,
                isInline: false,
            },
        ];
    }

    const emailResponse = await fetch(
        "https://graph.microsoft.com/v1.0/users/fsclinicals-com@mail.clinicviews.com/sendMail",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(mailBody),
        }
    );

    if (!emailResponse.ok) {
        const errorData = (await emailResponse.json()) as ErrorResponse;
        console.error("Email sending error:", errorData);
        throw new Error(
            `Failed to send email: ${errorData.error?.message || "Unknown error"}`
        );
    }

    console.log(`Email sent successfully to ${to}`);
}

async function compressFile(file: File): Promise<string> {
    const zipFilePath = path.join("/tmp", `${file.originalFilename}.zip`);
    const output = createWriteStream(zipFilePath); // Use 'createWriteStream' from 'fs'
    const archive = archiver("zip", {
        zlib: { level: 9 }, // Maximum compression
    });

    return new Promise((resolve, reject) => {
        output.on("close", () => {
            console.log(archive.pointer() + " total bytes");
            console.log(
                "archiver has been finalized and the output file descriptor has closed."
            );
            resolve(zipFilePath);
        });

        archive.on("error", (err) => {
            reject(err);
        });

        archive.pipe(output);
        archive.file(file.filepath, { name: file.originalFilename ?? "file" }); // Add fallback name if null
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

        const file = files.file[0] as File;
        const zipFilePath = await compressFile(file);
        const fileContent = await fs.readFile(zipFilePath);
        const fileSize = fileContent.length;

        console.log("Compressed file details:", {
            name: `${file.originalFilename}.zip`,
            size: fileSize,
        });

        const attachmentContent = fileContent.toString("base64");

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
        }; // Explicitly cast the response
        console.log("Access token retrieved");

        const uploadSession = await createUploadSession(
            accessToken,
            `${file.originalFilename}.zip`,
            fileSize
        );
        console.log("Upload session created:", uploadSession);

        let start = 0;
        let attachmentUrl = "";
        while (start < fileSize) {
            const end = Math.min(start + CHUNK_SIZE, fileSize);
            const response = await uploadChunk(
                uploadSession.uploadUrl,
                fileContent,
                start,
                end,
                fileSize
            );

            if (response.status === 201) {
                attachmentUrl = response.headers.get("Location") || "";
                console.log(
                    "File upload completed. Attachment URL:",
                    attachmentUrl
                );
                break;
            }

            start = end;
        }

        const {
            patientName,
            email,
            phone,
            reason,
            suggestAppointment,
            appointmentDate,
            appointmentTime,
        } = fields;

        console.log("Parsed form data:", {
            patientName,
            email,
            phone,
            reason,
            suggestAppointment,
            appointmentDate,
            appointmentTime,
        });

        const patientData = {
            displayName: Array.isArray(patientName)
                ? patientName[0]
                : patientName,
            emailAddresses: [
                { address: Array.isArray(email) ? email[0] : email },
            ],
            mobilePhone: Array.isArray(phone) ? phone[0] : phone,
        };
        console.log("Patient data to be sent:", patientData);

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
                `Failed to create patient record: ${errorData.error?.message || "Unknown error"}`
            );
        }

        const patientResult = await patientResponse.json();
        console.log("Patient record created:", patientResult);

        if (
            suggestAppointment === "true" &&
            appointmentDate &&
            appointmentTime
        ) {
            console.log("Scheduling appointment");
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
                "https://graph.microsoft.com/v1.0/users/fsclinicals-com@mail.clinicviews.com/calendar/events",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        subject: `Appointment with ${patientData.displayName}`,
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
                                    address:
                                        patientData.emailAddresses[0].address,
                                    name: patientData.displayName,
                                },
                                type: "required",
                            },
                        ],
                    }),
                }
            );

            if (!appointmentResponse.ok) {
                const errorData =
                    (await appointmentResponse.json()) as ErrorResponse;
                console.error("Appointment creation error:", errorData);
                throw new Error(
                    `Failed to create appointment: ${errorData.error?.message || "Unknown error"}`
                );
            }

            console.log("Appointment scheduled successfully");
        }

        console.log("Rendering email templates");
        const patientEmailHtml = `
            <h1>Registration Confirmation</h1>
            <p>Dear ${patientData.displayName},</p>
            <p>Thank you for registering with FSClinicals. Your appointment details are as follows:</p>
            <p>Date: ${Array.isArray(appointmentDate) ? appointmentDate[0] : appointmentDate}</p>
            <p>Time: ${Array.isArray(appointmentTime) ? appointmentTime[0] : appointmentTime}</p>
            <p>Reason: ${Array.isArray(reason) ? reason[0] : reason}</p>
        `;
        const doctorEmailHtml = `
            <h1>New Patient Registration</h1>
            <p>A new patient has registered:</p>
            <p>Name: ${patientData.displayName}</p>
            <p>Email: ${patientData.emailAddresses[0].address}</p>
            <p>Phone: ${patientData.mobilePhone}</p>
            <p>Reason: ${Array.isArray(reason) ? reason[0] : reason}</p>
            <p>Appointment Date: ${Array.isArray(appointmentDate) ? appointmentDate[0] : appointmentDate}</p>
            <p>Appointment Time: ${Array.isArray(appointmentTime) ? appointmentTime[0] : appointmentTime}</p>
        `;

        console.log("Sending email to patient");
        await sendEmail(
            accessToken,
            patientData.emailAddresses[0].address,
            "Registration Confirmation",
            patientEmailHtml,
            attachmentContent
        );

        console.log("Sending email to doctor");
        await sendEmail(
            accessToken,
            "fsclinicals-com@mail.clinicviews.com",
            "New Patient Registration",
            doctorEmailHtml,
            attachmentContent
        );

        console.log("Patient registration process completed successfully");
        res.status(200).json({ message: "Patient registered successfully" });
    } catch (error) {
        console.error("Error registering patient:", error);
        res.status(500).json({
            error: "Error registering patient",
            details: error instanceof Error ? error.message : String(error),
        });
    }
}
