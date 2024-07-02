// pages/api/sendEmail.ts
import { SendTemplate } from "@/components/Templates/SendTemplate";
import type { NextApiRequest, NextApiResponse } from "next";
// import { EmailTemplate } from "../../components/EmailTemplate";
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

// const msg = {
//     to: 'test@example.com',
//     from: 'test@example.com', // Use the email address or domain you verified above
//     subject: 'Sending with Twilio SendGrid is Fun',
//     text: 'and easy to do anywhere, even with Node.js',
//     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
//   };

import { renderToStaticMarkup } from "react-dom/server";

async function sendEmail(req: NextApiRequest, res: NextApiResponse) {
	try {
		const {
			// email,
			patientEmail,
			// fullname,
			// subject,
			message,
			patientName,
			submissionDate,
		} = req.body;

		const emailContent = renderToStaticMarkup(
			SendTemplate({ patientName, patientEmail, submissionDate })
		);

		const msg = {
			to: patientEmail,
			// to: "me@russellpalma.com",
			// from: "no-reply@mail.driptrace.io", // Use the email address or domain you verified above
			from: "colton@lomalindapsych.com", // Use the email address or domain you verified above
			subject: `${patientName}`,
			text: message,
			html: emailContent,
		};

		console.log("request", req.body);

		// const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 		Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
		// 	},
		// 	body: JSON.stringify({
		// 		personalizations: [
		// 			{
		// 				to: [{ email }],
		// 				subject: `[Lead from website] ${subject}`,
		// 			},
		// 		],
		// 		from: {
		// 			email: "no-reply@@mail.driptrace.io",
		// 		},
		// 		content: [
		// 			{
		// 				type: "text/html",
		// 				value: emailContent,
		// 			},
		// 		],
		// 	}),
		// });

		console.log("sending: ", msg);

		const response = await sgMail
			.send(msg)
			.then((response) => {
				console.log("status code: ", response[0].statusCode);
				console.log("response headers: ", response[0].headers);
				if (response[0].statusCode === 202) {
					console.log("Email sent successfully");
					return res
						.status(200)
						.json({ message: "Email sent successfully" });
				} else {
					console.log("Error sending email:", response[0].headers);
					return res
						.status(500)
						.json({ error: "Error sending email" });
				}
			})
			.catch((error) => {
				console.error(error);
			});

		console.log("response: ", response);

		// if (response.ok) {
		// 	console.log("Email sent successfully");
		// 	return res.status(200).json({ message: "Email sent successfully" });
		// } else {
		// 	console.log("Error sending email:", response.statusText);
		// 	return res.status(500).json({ error: "Error sending email" });
		// }
	} catch (error) {
		console.log("Error:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
}

export default sendEmail;
