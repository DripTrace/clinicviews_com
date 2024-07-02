"use client";

import React, { useState as useFsclinicalsState } from "react";

const FSClinicalsSendEmailPage: React.FC = () => {
	const [fsclinicalsEmail, setEmail] = useFsclinicalsState("");
	const [fsclinicalsName, setName] = useFsclinicalsState("");
	const [isLoading, setIsLoading] = useFsclinicalsState(false);
	const [message, setMessage] = useFsclinicalsState("");

	const handleFSClinicalsSubmit = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();
		setIsLoading(true);
		setMessage("");

		try {
			const response: Response = await fetch(
				"/api/fsclinicals-routes/fsclinicalsSendEmail/route",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ fsclinicalsEmail, fsclinicalsName }),
				}
			);

			console.log(
				"FSClinicalsEmail and fsclinicalsName: ",
				fsclinicalsEmail,
				fsclinicalsName
			);

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
			<form onSubmit={handleFSClinicalsSubmit} className="max-w-md">
				<div className="mb-4">
					<label htmlFor="email" className="block mb-1">
						FSClinicalsEmail:
					</label>
					<input
						type="email"
						id="email"
						value={fsclinicalsEmail}
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
						value={fsclinicalsName}
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

export default FSClinicalsSendEmailPage;
