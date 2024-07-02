"use client";
// pages/send-email.tsx
import React, { useState } from "react";

const SendEmailPage: React.FC = () => {
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setMessage("");

		try {
			const response: Response = await fetch("/api/newPatient/route", {
				// const response: Response = await fetch("/api/mail/route", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					// authorization: `Bearer ${process.env.RESEND_API_KEY}`,
				},
				body: JSON.stringify({ email, name }),
			});

			console.log("email and name: ", email, name);

			if (response.ok) {
				setMessage("Email sent successfully!");
				setEmail("");
				setName("");
			} else {
				const errorData = await response.json();
				setMessage(`Error sending email: ${errorData.message}`);
			}
		} catch (error) {
			setMessage("An error occurred while sending the email");
		}

		setIsLoading(false);
	};

	return (
		<div className="container mx-auto py-8 text-black">
			<h1 className="text-2xl font-bold mb-4">Send Welcome Email</h1>
			<form onSubmit={handleSubmit} className="max-w-md">
				<div className="mb-4">
					<label htmlFor="email" className="block mb-1">
						Email:
					</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 rounded"
						required
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="name" className="block mb-1">
						Name:
					</label>
					<input
						type="text"
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 rounded"
						required
					/>
				</div>
				<button
					type="submit"
					disabled={isLoading}
					className="bg-blue-500 text-white px-4 py-2 rounded font-bold hover:bg-blue-600 transition duration-200"
				>
					{isLoading ? "Sending..." : "Send Email"}
				</button>
			</form>
			{message && <p className="mt-4">{message}</p>}
		</div>
	);
};

export default SendEmailPage;
