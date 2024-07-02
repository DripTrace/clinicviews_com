"use client";

// pages/send-email.tsx
import React, { useState } from "react";

const SendPage: React.FC = () => {
	const [email, setEmail] = useState("");
	const [fullname, setFullname] = useState("");
	const [subject, setSubject] = useState("");
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [response, setResponse] = useState("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setResponse("");

		try {
			const res = await fetch("/api/sendGrid/route", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, fullname, subject, message }),
			});

			const data = await res.json();
			setResponse(data.message || data.error);
		} catch (error) {
			setResponse("An error occurred while sending the email");
		}

		setIsLoading(false);
	};

	return (
		<div>
			<h1>Send Email</h1>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="email">Email:</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div>
					<label htmlFor="fullname">Full Name:</label>
					<input
						type="text"
						id="fullname"
						value={fullname}
						onChange={(e) => setFullname(e.target.value)}
						required
					/>
				</div>
				<div>
					<label htmlFor="subject">Subject:</label>
					<input
						type="text"
						id="subject"
						value={subject}
						onChange={(e) => setSubject(e.target.value)}
						required
					/>
				</div>
				<div>
					<label htmlFor="message">Message:</label>
					<textarea
						id="message"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						required
					></textarea>
				</div>
				<button type="submit" disabled={isLoading}>
					{isLoading ? "Sending..." : "Send Email"}
				</button>
			</form>
			{response && <p>{response}</p>}
		</div>
	);
};

export default SendPage;
