// // // import type { NextApiRequest, NextApiResponse } from "next";
// // // import fs from "fs";
// // // import path from "path";
// // // import sgMail from "@sendgrid/mail";
// // // import { renderToStaticMarkup } from "react-dom/server";
// // // import { SendTemplate } from "@/components/Templates/SendTemplate";

// // // sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

// // // async function uploadFormHandle(req: NextApiRequest, res: NextApiResponse) {
// // // 	// console.log("request data: ", req);
// // // 	if (req.method === "POST") {
// // // 		const pdfData = await new Promise<Buffer>((resolve, reject) => {
// // // 			const chunks: Buffer[] = [];
// // // 			req.on("data", (chunk: Buffer) => {
// // // 				chunks.push(chunk);
// // // 			});
// // // 			req.on("end", () => {
// // // 				const data = Buffer.concat(chunks);
// // // 				resolve(data);
// // // 			});
// // // 			req.on("error", (err) => {
// // // 				reject(err);
// // // 			});
// // // 		});
// // // 		// console.log("pdfData: ", pdfData);

// // // 		const formData = new URLSearchParams(pdfData.toString());
// // // 		const patientName = formData.get("patientName") as string;
// // // 		const patientEmail = formData.get("patientEmail") as string;
// // // 		const submissionDate = new Date().toLocaleDateString();

// // // 		const pdfPath = path.join(
// // // 			process.cwd(),
// // // 			"public",
// // // 			"uploads",
// // // 			`${Date.now()}.pdf`
// // // 		);
// // // 		await fs.promises.writeFile(pdfPath, formData.get("pdf") as string);

// // // 		const emailContent = renderToStaticMarkup(
// // // 			SendTemplate({ patientName, patientEmail, submissionDate })
// // // 		);
// // // 		console.log("emailContent: ", emailContent);

// // // 		const msg = {
// // // 			to: "me@russellpalma.com",
// // // 			from: "colton@lomalindapsych.com",
// // // 			subject: `New Patient Form Submission from ${patientName}`,
// // // 			text: `A new patient form has been submitted by ${patientName} on ${submissionDate}`,
// // // 			html: emailContent,
// // // 			attachments: [
// // // 				{
// // // 					content: (formData.get("pdf") as string).split(",")[1],
// // // 					filename: "registration-results.pdf",
// // // 					type: "application/pdf",
// // // 					disposition: "attachment",
// // // 				},
// // // 			],
// // // 		};

// // // 		console.log("sending message: ", msg);

// // // 		try {
// // // 			await sgMail.send(msg);
// // // 			console.log("Email sent successfully");
// // // 			return res
// // // 				.status(200)
// // // 				.json({ message: "Form uploaded and email sent successfully" });
// // // 		} catch (error) {
// // // 			console.error(error);
// // // 			return res.status(500).json({ error: "Error sending email" });
// // // 		}
// // // 	} else {
// // // 		return res.status(405).json({ error: "Method not allowed" });
// // // 	}
// // // }

// // // export default uploadFormHandle;

// // // pages/api/sendEmail.ts
// // // import fetch from "node-fetch";
// // // import Blob from "fetch-blob";
// // import fs from "fs";
// // import type { NextApiRequest, NextApiResponse } from "next";
// // // import { EmailTemplate } from "../../components/EmailTemplate";
// // import sgMail from "@sendgrid/mail";
// // sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

// // // const msg = {
// // //     to: 'test@example.com',
// // //     from: 'test@example.com', // Use the email address or domain you verified above
// // //     subject: 'Sending with Twilio SendGrid is Fun',
// // //     text: 'and easy to do anywhere, even with Node.js',
// // //     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// // //   };

// // async function newPatient(req: NextApiRequest, res: NextApiResponse) {
// // 	try {
// // 		// const { email, fullname, subject, message } = req.body;
// // 		const newpatient = JSON.parse(req.body);
// // 		// const newpatient = req.body;

// // 		// fetch(url, options)
// // 		// 	.then((res) => res.buffer())
// // 		// 	.then((data) => {
// // 		// 		fs.createWriteStream(objectId + ".pdf").write(data);
// // 		// 	})
// // 		// 	.catch((e) => {
// // 		// 		console.log(e);
// // 		// 	});

// // 		console.log("newpatient: ", newpatient);
// // 		// const newPatient = new Blob([newpatient], { type: "application/pdf" });
// // 		const patientBuffer = Buffer.from(newpatient as string, "base64");
// // 		fs.writeFileSync("newpatient.pdf", patientBuffer);

// // 		// const emailContent = renderToStaticMarkup(
// // 		// 	SendTemplate({ fullname, email, message })
// // 		// 	// SendTemplate({newpatient})
// // 		// );

// // 		// console.log("sending: ", newpatient);

// // 		// console.log("request", JSON.parse(newpatient));

// // 		// const getFileContentInBase64 = (uri: string): Promise<string> => {
// // 		// 	return new Promise((resolve, reject) => {
// // 		// 		const toBase64 = (buffer: ArrayBuffer): string => {
// // 		// 			const n = new Uint8Array(buffer);
// // 		// 			const t = n.length;
// // 		// 			const a = new Uint8Array(4 * Math.ceil(t / 3));
// // 		// 			const i = new Uint8Array(64);
// // 		// 			const chars =
// // 		// 				"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

// // 		// 			for (let c = 0; c < 64; ++c) {
// // 		// 				i[c] = chars.charCodeAt(c);
// // 		// 			}

// // 		// 			let o = 0;
// // 		// 			for (let c = 0; c < t - (t % 3); c += 3, o += 4) {
// // 		// 				const r = (n[c] << 16) | (n[c + 1] << 8) | n[c + 2];
// // 		// 				a[o] = i[r >> 18];
// // 		// 				a[o + 1] = i[(r >> 12) & 63];
// // 		// 				a[o + 2] = i[(r >> 6) & 63];
// // 		// 				a[o + 3] = i[63 & r];
// // 		// 			}

// // 		// 			if (t % 3 === 1) {
// // 		// 				const r = n[t - 1];
// // 		// 				a[o] = i[r >> 2];
// // 		// 				a[o + 1] = i[(r << 4) & 63];
// // 		// 				a[o + 2] = 61;
// // 		// 				a[o + 3] = 61;
// // 		// 			} else if (t % 3 === 2) {
// // 		// 				const r = (n[t - 2] << 8) + n[t - 1];
// // 		// 				a[o] = i[r >> 10];
// // 		// 				a[o + 1] = i[(r >> 4) & 63];
// // 		// 				a[o + 2] = i[(r << 2) & 63];
// // 		// 				a[o + 3] = 61;
// // 		// 			}

// // 		// 			return new TextDecoder("ascii").decode(a);
// // 		// 		};

// // 		// 		const xhr = new XMLHttpRequest();
// // 		// 		xhr.responseType = "arraybuffer";
// // 		// 		xhr.onload = () =>
// // 		// 			resolve(toBase64(xhr.response as ArrayBuffer));
// // 		// 		xhr.onerror = () =>
// // 		// 			reject(
// // 		// 				new Error(`Request failed with status ${xhr.status}`)
// // 		// 			);
// // 		// 		xhr.open("GET", uri);
// // 		// 		xhr.send();
// // 		// 	});
// // 		// };

// // 		// const saveBase64ToFile = async (
// // 		// 	blobUrl: string,
// // 		// 	fileName: string
// // 		// ): Promise<void> => {
// // 		// 	try {
// // 		// 		const base64Str = await getFileContentInBase64(blobUrl);
// // 		// 		const decodedContent = atob(base64Str);
// // 		// 		const filePath = `./tmp/${fileName}`;

// // 		// 		// Note: File system operations are not available in browser-based TypeScript.
// // 		// 		// You would need to use Node.js or a different approach for file writing.
// // 		// 		// The following is a placeholder for the file writing operation:

// // 		// 		await fs.promises.writeFile(filePath, decodedContent, "binary");

// // 		// 		console.log(`File saved to ${filePath}`);
// // 		// 	} catch (error) {
// // 		// 		console.error("Error saving file:", error);
// // 		// 	}

// // 		// 	return Promise.resolve();
// // 		// };

// // 		// saveBase64ToFile(newpatient, "newpatient.pdf");
// // 		// fetch(URL, Option)
// // 		// 	.then((res) => {
// // 		// 		console.log(res);
// // 		// 		return res.blob();
// // 		// 	})
// // 		// 	.then(async (data) => {
// // 		// 		const result = data.stream();
// // 		// 		const pdfBuffer = await new Promise<Buffer>(
// // 		// 			(resolve, reject) => {
// // 		// 				const chunks: Buffer[] = [];
// // 		// 				result.ondata("data", (chunk: Buffer) => {
// // 		// 					chunks.push(chunk);
// // 		// 				});
// // 		// 				result.onend("end", () => {
// // 		// 					const pdfData = Buffer.concat(chunks);
// // 		// 					resolve(pdfData);
// // 		// 				});
// // 		// 				result.onerror("error", (err) => {
// // 		// 					reject(err);
// // 		// 				});
// // 		// 			}
// // 		// 		);
// // 		// 		const msg = {
// // 		// 			to: "me@russellpalma.com",
// // 		// 			from: "ne-reply@mail.driptrace.io",
// // 		// 			subject: "fullname",
// // 		// 			text: "new patient",
// // 		// 			attachments: [
// // 		// 				{
// // 		// 					content: pdfBuffer.toString("base64") as string,
// // 		// 					filename: "newpatient.pdf",
// // 		// 					type: "application/pdf",
// // 		// 					disposition: "attachment",
// // 		// 				},
// // 		// 			],
// // 		// 		};
// // 		// 		try {
// // 		// 			await sgMail.send(msg as any);
// // 		// 			console.log("Email sent successfully");
// // 		// 			return res
// // 		// 				.status(200)
// // 		// 				.json({ message: "Email sent successfully" });
// // 		// 		} catch (error) {
// // 		// 			console.error(error);
// // 		// 			return res
// // 		// 				.status(500)
// // 		// 				.json({ error: "Error sending email" });
// // 		// 		}
// // 		// 	})
// // 		// 	.catch((e) => {
// // 		// 		console.log(e);
// // 		// 	});

// // 		const msg = {
// // 			// to: email,
// // 			to: "me@russellpalma.com",
// // 			from: "ne-reply@mail.driptrace.io", // Use the email address or domain you verified above
// // 			subject: "fullname",
// // 			text: "new patient",
// // 			// html: `strong${newpatient.toJson()}</strong>`,
// // 			// html: `strong${newpatient as string}</strong>`,
// // 			html: `${newpatient}`,
// // 			// html: newpatient,
// // 			// attachments: [
// // 			// 	{
// // 			// 		// content: (formData.get("pdf") as string).split(",")[1],
// // 			// 		// content: (newpatient.get("pdf") as string).split(",")[1],
// // 			// 		content: newpatient,
// // 			// 		filename: "registration-results.pdf",
// // 			// 		type: "application/pdf",
// // 			// 		disposition: "attachment",
// // 			// 	},
// // 			// ],
// // 			attachments: [
// // 				{
// // 					content: patientBuffer.toString("base64"),
// // 					filename: "newpatient.pdf",
// // 					type: "application/pdf",
// // 					disposition: "attachment",
// // 				},
// // 			],
// // 		};

// // 		const response = await sgMail
// // 			.send(msg)
// // 			.then((response) => {
// // 				console.log("status code: ", response[0].statusCode);
// // 				console.log("response headers: ", response[0].headers);
// // 				if (response[0].statusCode === 202) {
// // 					console.log("Email sent successfully");
// // 					return res
// // 						.status(200)
// // 						.json({ message: "Email sent successfully" });
// // 				} else {
// // 					console.log("Error sending email:", response[0].headers);
// // 					return res
// // 						.status(500)
// // 						.json({ error: "Error sending email" });
// // 				}
// // 			})
// // 			.catch((error) => {
// // 				console.error(error);
// // 			});

// // 		console.log("response: ", response);
// // 	} catch (error) {
// // 		console.log("Error:", error);
// // 		return res.status(500).json({ error: "Internal server error" });
// // 	}
// // }

// // export default newPatient;

// // import type { NextApiRequest, NextApiResponse } from "next";
// // import sgMail from "@sendgrid/mail";
// // import fs from "fs/promises";
// // import { promises } from "fs";
// // import path from "path";
// // import { IncomingForm } from "formidable";
// // import { Model } from "survey-core";

// // sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

// // export const config = {
// // 	api: {
// // 		bodyParser: false,
// // 	},
// // };

// // async function newPatient(req: NextApiRequest, res: NextApiResponse) {
// // 	// const formJson = {  };
// // 	// const form = new Model(formJson);

// // 	// form.data = initialFormResultJson;
// // 	// form.clearIncorrectValues(true);

// // 	// const correctSurveyResultJson = form.data;

// // 	try {
// // 		const form = new IncomingForm();
// // 		const [fields, files] = await new Promise<[any, any]>(
// // 			(resolve, reject) => {
// // 				form.parse(req, (err, fields, files) => {
// // 					if (err) reject(err);
// // 					resolve([fields, files]);
// // 				});
// // 			}
// // 		);

// // 		const file = files.file[0];
// // 		const filePath = path.join(process.cwd(), "newpatient.pdf");

// // 		// Read the uploaded file
// // 		const fileContent = await fs.readFile(file.filepath);

// // 		// Write the file to the server
// // 		await fs.writeFile(filePath, fileContent);

// // 		console.log("PDF file written successfully");

// // 		// Read the file and convert to base64
// // 		const fileContentBase64 = await fs.readFile(filePath, {
// // 			encoding: "base64",
// // 		});

// // 		const msg = {
// // 			to: "colton@lomalindapsych.com",
// // 			from: "colton@lomalindapsych.com",
// // 			subject: "New Patient Registration",
// // 			text: "New patient registration form attached",
// // 			attachments: [
// // 				{
// // 					content: fileContentBase64,
// // 					filename: "newpatient.pdf",
// // 					type: "application/pdf",
// // 					disposition: "attachment",
// // 				},
// // 			],
// // 		};

// // 		const response = await sgMail.send(msg);

// // 		if (response[0].statusCode === 202) {
// // 			console.log("Email sent successfully");
// // 			// Optionally, delete the file after sending
// // 			await fs.unlink(filePath);
// // 			return res.status(200).json({ message: "Email sent successfully" });
// // 		} else {
// // 			console.log("Error sending email:", response[0].headers);
// // 			return res.status(500).json({ error: "Error sending email" });
// // 		}
// // 	} catch (error: unknown) {
// // 		console.error("Error in newPatient:", error);
// // 		if (error instanceof Error) {
// // 			return res.status(500).json({
// // 				error: "Internal server error",
// // 				details: error.message,
// // 			});
// // 		} else {
// // 			return res.status(500).json({ error: "An unknown error occurred" });
// // 		}
// // 	}
// // }

// // export default newPatient;

// import type { NextApiRequest, NextApiResponse } from "next";
// import sgMail from "@sendgrid/mail";
// import { IncomingForm } from "formidable";
// import { Model } from "survey-core";
// import nodemailer, { Transporter } from "nodemailer";

// sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

// export const config = {
// 	api: {
// 		bodyParser: false,
// 	},
// };

// async function newPatient(req: NextApiRequest, res: NextApiResponse) {
// 	try {
// 		const form = new IncomingForm();
// 		const [fields, files] = await new Promise<[any, any]>(
// 			(resolve, reject) => {
// 				form.parse(req, (err, fields, files) => {
// 					if (err) reject(err);
// 					resolve([fields, files]);
// 				});
// 			}
// 		);

// 		const file = files.file[0];

// 		// Read the file content directly into a buffer
// 		const fileContent = await new Promise<Buffer>((resolve, reject) => {
// 			const chunks: Buffer[] = [];
// 			const readStream = require("fs").createReadStream(file.filepath);
// 			readStream.on("data", (chunk: Buffer) => chunks.push(chunk));
// 			readStream.on("error", reject);
// 			readStream.on("end", () => resolve(Buffer.concat(chunks)));
// 		});

// 		// Convert buffer to base64
// 		const fileContentBase64 = fileContent.toString("base64");

// 		console.log("PDF file processed successfully");

// 		let emailTransporter = nodemailer.createTransport({
// 			host: `${process.env.PROTONMAIL_HOST}`,
// 			port: Number(`${process.env.PROTONMAIL_PORT}`),
// 			// secure: true, // true for 465, false for other ports
// 			secure: false, // true for 465, false for other ports
// 			auth: {
// 				user: `${process.env.PROTONMAIL_SENDER}`,
// 				pass: `${process.env.PROTONMAIL_PASSWORD}`,
// 			},
// 			tls: {
// 				rejectUnauthorized: false,
// 			},
// 		});

// 		let emailInfo = await emailTransporter.sendMail({
// 			from: `${process.env.PROTONMAIL_NAME} <${process.env.PROTONMAIL_SENDER}>`,
// 			to: `${process.env.PROTONMAIL_RECIPIENT}`,
// 			// to: "me@russellpalma.com",
// 			subject: "Patient Registration Details",
// 			text: "A patient registration form is attached to this email.",
// 			// html: "<b>Hello world?</b>",
// 			// html: `${emailContent}`,
// 			attachments: [
// 				{
// 					// filename: `${file.filename}`,
// 					filename: `new-patient-registration.pdf`,
// 					content: fileContentBase64,
// 					encoding: "base64",
// 				},
// 			],
// 			// filename: patientFile.filepath,
// 			// content: "aGVsbG8gd29ybGQh",
// 			// encoding: "base64",
// 			// subject: `${patientName}`,
// 			// text: message,
// 			// html: emailContent,

// 			// encoded string as an attachment
// 		});

// 		console.log("Message sent: %s", emailInfo.messageId);
// 		//   }

// 		// const msg = {
// 		// 	// to: "llpmg@lomalindapsych.com",
// 		// 	to: "llpmg@lomalindapsych.com",
// 		// 	from: "colton@lomalindapsych.com",
// 		// 	subject: "New Patient Registration",
// 		// 	text: "New patient registration form attached",
// 		// 	attachments: [
// 		// 		{
// 		// 			content: fileContentBase64,
// 		// 			filename: "newpatient.pdf",
// 		// 			type: "application/pdf",
// 		// 			disposition: "attachment",
// 		// 		},
// 		// 	],
// 		// };

// 		// const response = await sgMail.send(msg);

// 		// if (response[0].statusCode === 202) {
// 		// 	console.log("Email sent successfully");
// 		// 	return res.status(200).json({ message: "Email sent successfully" });
// 		// } else {
// 		// 	console.log("Error sending email:", response[0].headers);
// 		// 	return res.status(500).json({ error: "Error sending email" });
// 		// }
// 	} catch (error: unknown) {
// 		console.error("Error in newPatient:", error);
// 		if (error instanceof Error) {
// 			return res.status(500).json({
// 				error: "Internal server error",
// 				details: error.message,
// 			});
// 		} else {
// 			return res.status(500).json({ error: "An unknown error occurred" });
// 		}
// 	}
// }

// export default newPatient;

export default function rb() {}
