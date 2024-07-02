import { EmailTemplate } from "@/components/Templates/EmailTemplate";
import type { NextApiRequest, NextApiResponse } from "next";
import { renderToStaticMarkup } from "react-dom/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// console.log("request: ", req);

	if (req.method === "POST") {
		try {
			const { email, name } = req.body;

			console.log("email and name: ", email, name);

			const emailContent = renderToStaticMarkup(EmailTemplate({ name }));
			// const emailContent = EmailTemplate({ name });

			console.log("emailContent: ", emailContent);

			const { data, error } = await resend.emails.send({
				from: "connect@mail.rpalm.net",
				to: [email],
				subject: "Welcome to Our App",
				html: `${emailContent}`,
			});

			if (error) {
				return res.status(400).json({ message: error.message });
			}

			res.status(200).json({ message: "Email sent successfully" });
		} catch (error) {
			res.status(500).json({
				message: "An error occurred while sending the email",
			});
		}
	} else {
		res.status(405).json({ message: "Method not allowed" });
	}
}
