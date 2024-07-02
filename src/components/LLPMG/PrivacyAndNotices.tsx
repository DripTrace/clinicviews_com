"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const PrivacyAndNoticesPage: React.FC = () => {
	const [activeSection, setActiveSection] = useState<string | null>(null);

	const toggleSection = (section: string) => {
		setActiveSection(activeSection === section ? null : section);
	};

	const sections = [
		{
			id: "clinician-providers",
			title: "Important Information Regarding Clinician Providers",
			content: (
				<>
					<p className="mb-4">
						We value our patients and want to ensure clear
						communication about the structure of our practice. This
						announcement informs you that our providers (doctors,
						nurse practitioners, therapists, etc.) operate as
						independent contractors, not employees of Loma Linda
						Psychiatric Medical Group.
					</p>
					<ul className="list-disc pl-5 mb-4 space-y-2">
						<li>
							<strong>High-Quality Care:</strong> Our independent
							contractors are all licensed professionals who meet
							our rigorous standards for qualifications and
							experience.
						</li>
						<li>
							<strong>Continuity of Care:</strong> We strive to
							ensure continuity of care whenever possible.
							However, as independent contractors, clinicians have
							the flexibility to adjust their practice schedules
							or locations.
						</li>
						<li>
							<strong>Billing and Insurance:</strong> Billing and
							insurance processes may vary slightly depending on
							your provider.
						</li>
						<li>
							<strong>Your Questions and Concerns:</strong> If you
							have any questions or concerns about this
							information or your provider&apos;s status, please
							do not hesitate to speak to our clinic staff.
						</li>
					</ul>
					<p className="mb-4">
						We appreciate your understanding and continued trust in
						our practice.
					</p>
				</>
			),
		},
		{
			id: "privacy-policy",
			title: "Enhanced Privacy Protections Policy for Patients",
			content: (
				<>
					<p className="mb-4">
						<strong>Purpose:</strong> This policy outlines our
						commitment to protect the privacy and security of our
						patients&apos; personal and health information at Loma
						Linda Psychiatric Medical Group.
					</p>
					<p className="mb-4">
						<strong>Scope:</strong> This policy applies to all
						staff, patients, and contractors associated with Loma
						Linda Psychiatric Medical Group.
					</p>
					<p className="mb-4">
						<strong>Patient Information Collection:</strong> We
						collect personal health information directly from our
						patients or their legal representatives. This includes
						medical history, treatment records, and billing
						information.
					</p>
					<p className="mb-4">
						<strong>Use of Information:</strong> Personal health
						information is used solely for the purpose of providing
						medical care, processing payments, and complying with
						legal requirements.
					</p>
					{/* Add more policy details as needed */}
				</>
			),
		},
		{
			id: "privacy-announcement",
			title: "Enhanced Privacy Protections Announcement",
			content: (
				<>
					<p className="mb-4">Dear Valued Patients,</p>
					<p className="mb-4">
						At Loma Linda Psychiatric Medical Group, we are
						committed to safeguarding the privacy and
						confidentiality of your medical information. We are
						pleased to announce the implementation of an updated
						Privacy Policy, which reflects our ongoing dedication to
						protecting your rights and ensuring the security of your
						personal data.
					</p>
					<ul className="list-disc pl-5 mb-4 space-y-2">
						<li>
							<strong>Enhanced Security Measures:</strong> We have
							implemented advanced security technologies and
							procedures to protect your information from
							unauthorized access and misuse.
						</li>
						<li>
							<strong>Transparency and Control:</strong> Our
							policy provides clear information on how your data
							is collected, used, and shared, giving you more
							control over your personal information.
						</li>
						<li>
							<strong>Compliance with Regulations:</strong> Our
							privacy practices are designed to comply with
							applicable federal and state regulations, ensuring
							the highest standards of confidentiality.
						</li>
					</ul>
				</>
			),
		},
	];

	return (
		<div className="min-h-screen bg-blue-50 dark:bg-gray-900 py-12 transition-colors duration-300">
			<div className="container mx-auto px-4">
				<h1 className="text-4xl font-bold text-blue-900 dark:text-blue-300 mb-8 text-center">
					Privacy and Notices
				</h1>

				{sections.map((section) => (
					<motion.div
						key={section.id}
						className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-300 flex items-center justify-center flex-col"
						initial={false}
						animate={{
							height:
								activeSection === section.id ? "auto" : "64px",
						}}
						transition={{ duration: 0.3 }}
					>
						<button
							className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
							onClick={() => toggleSection(section.id)}
						>
							<h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300">
								{section.title}
							</h2>
							{activeSection === section.id ? (
								<FaChevronUp className="text-blue-500" />
							) : (
								<FaChevronDown className="text-blue-500" />
							)}
						</button>
						{activeSection === section.id && (
							<div className="px-6 py-4 text-gray-700 dark:text-gray-300">
								{section.content}
							</div>
						)}
					</motion.div>
				))}
			</div>
		</div>
	);
};

export default PrivacyAndNoticesPage;
