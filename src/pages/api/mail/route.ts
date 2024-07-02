import { send } from "process";
import type { NextApiRequest, NextApiResponse } from "next";
// const nodemailer = require('nodemailer');
import nodemailer, { Transporter } from "nodemailer";
import fs from "fs";
import { IncomingForm } from "formidable";
import { Model } from "survey-core";
import sgMail from "@sendgrid/mail";
// import amqp from "amqplib/callback_api";
import amqp from "amqplib";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { renderToStaticMarkup } from "react-dom/server";
import { EmailTemplate } from "@/components/Templates/EmailTemplate";
import { SendTemplate } from "@/components/Templates/SendTemplate";

export const config = {
	api: {
		bodyParser: false,
	},
};

const sendPatientMail = async (req: NextApiRequest, res: NextApiResponse) => {
	// // Example email data
	// const emailData = {
	// 	from: "<L L P M G> colton@lomalindapsych.com",
	// 	to: "me@russellpalma.com",
	// 	subject: "Test Email",
	// 	// text: "This is a test email sent asynchronously using RabbitMQ and Nodemailer.",
	// 	text: "This is a test email sent asynchronously using RabbitMQ and Nodemailer.",
	// 	html: `${emailContent}`,
	// };

	// // async function sendToQueue(emailData) {
	// // const conn = await amqp.connect('amqp://localhost'); // Connect to RabbitMQ server
	// const conn = await amqp.connect("amqp://192.168.4.200"); // Connect to RabbitMQ server
	// const channel = await conn.createChannel(); // Create a channel
	// const queue = "emails"; // Name of the queue

	// await channel.assertQueue(queue, { durable: true }); // Ensure the queue exists and is durable
	// channel.sendToQueue(queue, Buffer.from(JSON.stringify(emailData)), {
	// 	persistent: true,
	// }); // Send email data to the queue

	// console.log("Email request sent to queue");
	// setTimeout(() => {
	// 	channel.close();
	// 	conn.close();
	// }, 500);
	// // }

	// sendToQueue(emailData);

	// const { name, email, message } = req.body;
	// if (!name || !email || !message) {
	//     return res.status(400).json({ message: "Missing required fields" });
	// }
	// try {
	//     await send({
	//     from: email,
	//     to: process.env.MAIL_TO,
	//     subject: "New message from your website",
	//     text: message,
	//     });
	//     return res.status(200).json({ message: "Message sent successfully" });
	// } catch (error) {
	//     return res.status(500).json({ message: "Something went wrong" });
	// }

	// let pattientMessage = {
	// 	attachments: [
	// 		{
	// 			// utf-8 string as an attachment
	// 			filename: "text1.txt",
	// 			content: "hello world!",
	// 		},
	// 		{
	// 			// binary buffer as an attachment
	// 			filename: "text2.txt",
	// 			content: Buffer.from("hello world!", "utf-8"),
	// 		},
	// 		{
	// 			// file on disk as an attachment
	// 			filename: "text3.txt",
	// 			path: "/path/to/file.txt", // stream this file
	// 		},
	// 		{
	// 			// filename and content type is derived from path
	// 			path: "/path/to/file.txt",
	// 		},
	// 		{
	// 			// stream as an attachment
	// 			filename: "text4.txt",
	// 			content: fs.createReadStream("file.txt"),
	// 		},
	// 		{
	// 			// define custom content type for the attachment
	// 			filename: "text.bin",
	// 			content: "hello world!",
	// 			contentType: "text/plain",
	// 		},
	// 		{
	// 			// use URL as an attachment
	// 			filename: "license.txt",
	// 			path: "https://raw.github.com/nodemailer/nodemailer/master/LICENSE",
	// 		},
	// 		{
	// 			// encoded string as an attachment
	// 			filename: "text1.txt",
	// 			content: "aGVsbG8gd29ybGQh",
	// 			encoding: "base64",
	// 		},
	// 		{
	// 			// data uri as an attachment
	// 			path: "data:text/plain;base64,aGVsbG8gd29ybGQ=",
	// 		},
	// 		{
	// 			// use pregenerated MIME node
	// 			raw:
	// 				"Content-Type: text/plain\r\n" +
	// 				"Content-Disposition: attachment;\r\n" +
	// 				"\r\n" +
	// 				"Hello world!",
	// 		},
	// 		{
	// 			// content: fileContentBase64,
	// 			// filename: `new_patient_packet.pdf`,
	// 			"Content-Type": "application/pdf",
	// 			"Content-Disposition": "attachment",
	// 		},
	// 	],
	// };

	// // Create a transporter object
	// const transporter = nodemailer.createTransport({
	// 	// host: "live.smtp.mailtrap.io",
	// 	host: "smtp.protonmail.ch",
	// 	port: 587,
	// 	// secure: false, // use SSL
	// 	secure: true, // use SSL
	// 	auth: {
	// 		user: "1a2b3c4d5e6f7g",
	// 		pass: "1a2b3c4d5e6f7g",
	// 	},
	// });

	// // Configure the mailoptions object
	// const mailOptions = {
	// 	from: "colton@lomalindapsych.com",
	// 	to: "colton@lomalindapsych.com",
	// 	subject: "New Patient Packet Registration",
	// 	text: "<p>Please click the link below to download the packet.</p>",

	// 		{
	// 			// encoded string as an attachment
	// 			filename: "text1.txt",
	// 			content: "aGVsbG8gd29ybGQh",
	// 			encoding: "base64",
	// 		},
	// };

	// // Send the email
	// transporter.sendMail(mailOptions, function (error, info) {
	// 	if (error) {
	// 		console.log("Error:", error);
	// 	} else {
	// 		console.log("Email sent: " + info.response);
	// 	}
	// });

	// try {
	// 	try {
	// 		// Example email data
	// 		const emailData = {
	// 			from: "<L L P M G> colton@lomalindapsych.com",
	// 			to: "me@russellpalma.com",
	// 			subject: "Patient Registration Details",
	// 			text: "A patient registration form is attached to this email.",
	// 			html: "<strong>HTML content</strong>",
	// 		};

	// 		const sendEmail = async (emailData: Mail.Options) => {
	// 			// let transporter: Transporter<SMTPTransport.SentMessageInfo> =
	// 			// 	nodemailer.createTransport({
	// 			// 		service: "gmail", // or your email service
	// 			// 		auth: {
	// 			// 			user: "sender address (e.g., youremail@email.com)",
	// 			// 			pass: "your-password",
	// 			// 		},
	// 			// 	});

	// 			let patientEmailTransporter = nodemailer.createTransport({
	// 				host: "127.0.0.1",
	// 				port: 1025,
	// 				secure: false, // true for 465, false for other ports
	// 				auth: {
	// 					user: "colton@lomalindapsych.com",
	// 					pass: "QX17gTHba0l1V5AYuTa8jg",
	// 				},
	// 				tls: {
	// 					rejectUnauthorized: false,
	// 				},
	// 			});

	// 			try {
	// 				let info =
	// 					await patientEmailTransporter.sendMail(emailData);
	// 				console.log("Email Sent: %s", info.messageId);
	// 			} catch (error) {
	// 				console.error("Error sending email:", error);
	// 			}
	// 		};

	// 		// async function startWorker() {
	// 		const conn = await amqp.connect(
	// 			// `amqp://${"process.env.NEXT_HOSTNAME"}:5672`
	// 			// `amqp://"localhost:5672`
	// 			`amqp://192.168.4.200`
	// 		);
	// 		const channel = await conn.createChannel();
	// 		const queue = "patient-registration-email";

	// 		await channel.assertQueue(queue, { durable: true });
	// 		console.log(
	// 			"Waiting for messages in %s. To exit press CTRL+C",
	// 			queue
	// 		);

	// 		const mailWorker: Promise<amqp.Replies.Consume> = channel.consume(
	// 			queue,
	// 			async (msg) => {
	// 				if (msg !== null) {
	// 					const emailData = JSON.parse(msg.content.toString());
	// 					await sendEmail(emailData);
	// 					channel.ack(msg);
	// 				}
	// 			}
	// 		);

	// 		await mailWorker;

	// 		// try {
	// 		//     await mailWorker.then((m: amqp.Replies.Consume) => {
	// 		//         if (m.consumerTag) {
	// 		//             console.log("Worker started successfully");
	// 		//         } else {
	// 		//             console.error("Error starting worker");
	// 		//         }
	// 		// }

	// 		// mailWorker.catch(console.error);
	// 		// mailWorker.catch((error) => {
	// 		// 	console.error("Error starting worker:", error);
	// 		// });
	// 		// mailWorker.then(() => {
	// 		//     console.log("Worker started successfully");
	// 		// }
	// 		// (await mailWorker).consumerTag
	// 		// mailWorker[Symbol]
	// 		// mailWorker[Symbol.iterator]
	// 		// mailWorker[Symbol.asyncIterator]
	// 		// mailWorker[Symbol.toStringTag]
	// 		// mailWorker[Symbol.toPrimitive]
	// 	} catch (error) {
	// 		console.error("Error starting worker:", error);
	// 	}
	// 	// }

	// 	// startWorker();

	// 	// // async function sendToQueue(emailData) {
	// 	// const conn = await amqp.connect("amqp://localhost"); // Connect to RabbitMQ server
	// 	// const channel = await conn.createChannel(); // Create a channel
	// 	// const queue = "emails"; // Name of the queue

	// 	// const sendPatientData = await channel.assertQueue(queue, {
	// 	// 	durable: true,
	// 	// }); // Ensure the queue exists and is durable
	// 	// channel.sendToQueue(queue, Buffer.from(JSON.stringify(emailData)), {
	// 	// 	persistent: true,
	// 	// }); // Send email data to the queue

	// 	// console.log("Email request sent to queue");
	// 	// setTimeout(() => {
	// 	// 	channel.close();
	// 	// 	conn.close();
	// 	// }, 500);
	// 	// // }

	// 	// // sendToQueue(emailData);

	// 	// // console.log("patient data;\n", sendPatientData.consumerCount)
	// 	// // console.log("patient data;\n", sendPatientData.messageCount)
	// 	// console.log("patient data;\n", sendPatientData.queue);

	// const {
	// 	// email,
	// 	patientEmail,
	// 	// fullname,
	// 	// subject,
	// 	message,
	// 	patientName,
	// 	submissionDate,
	// } = req.body;

	// const emailContent = renderToStaticMarkup(
	// 	SendTemplate({ patientName, patientEmail, submissionDate })
	// );

	// console.log("emailContent: ", emailContent);

	const patientForm = new IncomingForm();
	const [fields, files] = await new Promise<[any, any]>((resolve, reject) => {
		patientForm.parse(req, (err, fields, files) => {
			if (err) reject(err);
			resolve([fields, files]);
		});
	});

	const patientFile = files.file[0];

	// Read the file content directly into a buffer
	const patientFileContent = await new Promise<Buffer>((resolve, reject) => {
		const chunks: Buffer[] = [];
		const readStream = require("fs").createReadStream(patientFile.filepath);
		readStream.on("data", (chunk: Buffer) => chunks.push(chunk));
		readStream.on("error", reject);
		readStream.on("end", () => resolve(Buffer.concat(chunks)));
	});

	// Convert buffer to base64
	const fileContentBase64 = patientFileContent.toString("base64");

	console.log("PDF file processed successfully");

	// async function main(){
	let emailTransporter = nodemailer.createTransport({
		// host: "127.0.0.1",
		host: "smtp.protonmail.ch",
		// port: 1025,
		port: 587,
		// secure: false, // true for 465, false for other ports
		secure: true, // true for 465, false for other ports
		auth: {
			user: "colton@lomalindapsych.com",
			// pass: "QX17gTHba0l1V5AYuTa8jg",
			pass: "T5UX66HD49PWZ6YA",
		},
		tls: {
			rejectUnauthorized: false,
		},
	});

	let emailInfo = await emailTransporter.sendMail({
		from: '"LLPMG" <colton@lomalindapsych.com>',
		to: "me@russellpalma.com",
		subject: "Patient Registration Details",
		text: "A patient registration form is attached to this email.",
		// html: "<b>Hello world?</b>",
		// html: `${emailContent}`,
		attachments: [
			{
				filename: `${patientFile.filename}`,
				content: fileContentBase64,
				encoding: "base64",
			},
		],
		// filename: patientFile.filepath,
		// content: "aGVsbG8gd29ybGQh",
		// encoding: "base64",
		// subject: `${patientName}`,
		// text: message,
		// html: emailContent,

		// encoded string as an attachment
	});

	console.log("Message sent: %s", emailInfo.messageId);
	//   }

	// 	const psntMsg = {
	// 		to: "llpmg@lomalindapsych.com",
	// 		from: "colton@lomalindapsych.com",
	// 		subject: "New Patient Registration",
	// 		text: "New patient registration form attached",
	// 		attachments: [
	// 			{
	// 				content: fileContentBase64,
	// 				filename: "newpatient.pdf",
	// 				type: "application/pdf",
	// 				disposition: "attachment",
	// 			},
	// 		],
	// 	};

	// 	const psntServerResponse = await sgMail.send(psntMsg);

	// 	if (psntServerResponse[0].statusCode === 202) {
	// 		console.log("Email sent successfully");
	// 		return res.status(200).json({ message: "Email sent successfully" });
	// 	} else {
	// 		console.log("Error sending email:", psntServerResponse[0].headers);
	// 		return res.status(500).json({ error: "Error sending email" });
	// 	}
	// } catch (error: unknown) {
	// 	console.error("Error in newPatient:", error);
	// 	if (error instanceof Error) {
	// 		return res.status(500).json({
	// 			error: "Internal server error",
	// 			details: error.message,
	// 		});
	// 	} else {
	// 		return res.status(500).json({ error: "An unknown error occurred" });
	// 	}
	// }
};

export default sendPatientMail;
