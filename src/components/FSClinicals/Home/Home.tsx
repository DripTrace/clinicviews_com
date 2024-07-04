"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
// import { Calendar, ChevronDown, MapPin, Phone, Mail } from "lucide-react";
import dynamic from "next/dynamic";

const Calendar = dynamic(
	() => import("lucide-react").then((mod) => mod.Calendar),
	{ ssr: false }
);
const ChevronDown = dynamic(
	() => import("lucide-react").then((mod) => mod.ChevronDown),
	{ ssr: false }
);
const MapPin = dynamic(() => import("lucide-react").then((mod) => mod.MapPin), {
	ssr: false,
});
const Phone = dynamic(() => import("lucide-react").then((mod) => mod.Phone), {
	ssr: false,
});
const Mail = dynamic(() => import("lucide-react").then((mod) => mod.Mail), {
	ssr: false,
});

import { FSClinicalsHeader } from "../FSClinicalsHeader";
import { FSClinicalsMap } from "../FSClinicalsMap";
import { FSClinicalsFooter } from "../FSClinicalsFooter";
// import FSClinicalsHeader from './FSClinicalsHeader';
// import FSClinicalsFooter from './FSClinicalsFooter';
// import FSClinicalsMapComponent from './FSClinicalsMapComponent';

const locations = [
	{
		city: "Placentia",
		address: "650 N Rose Drive #472, Placentia, CA 92870",
		phone: "(775) 238-3082",
		email: "info@fsclinicals.com",
		encoded:
			"3312.494856478956!2d-117.84453832366965!3d33.87690702696721!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80dcd6a888549635%3A0xa78d75b370047cb5!2s650%20N%20Rose%20Dr%20%23472%2C%20Placentia%2C%20CA%2092870!5e0!3m2!1sen!2sus!4v1720074440707",
	},
	{
		city: "Reno",
		address: "100 N Arlington Ave, Suite 340A, Reno, NV 89501",
		phone: "(775) 238-3082",
		email: "info@fsclinicals.com",
		encoded:
			"3077.5209395169586!2d-119.81923322348412!3d39.525300709411155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x809940cb25419537%3A0x60e85be369ace7e8!2s100%20N%20Arlington%20Ave%20%23340a%2C%20Reno%2C%20NV%2089501!5e0!3m2!1sen!2sus!4v1720074308138",
	},
];

const FSClinicalsHomePage: React.FC = () => {
	const [isVisible, setIsVisible] = useState(false);
	const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
		if (typeof window !== "undefined") {
			return (
				window.matchMedia &&
				window.matchMedia("(prefers-color-scheme: dark)").matches
			);
		}
		return false;
	});

	useEffect(() => {
		setIsVisible(true);

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = () => setIsDarkMode(mediaQuery.matches);
		mediaQuery.addListener(handleChange);

		return () => mediaQuery.removeListener(handleChange);
	}, []);

	const toggleDarkMode = () => {
		setIsDarkMode((prevMode) => !prevMode);
	};

	return (
		<div
			className={`min-h-screen flex flex-col ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"} select-none`}
		>
			<FSClinicalsHeader
				toggleDarkMode={toggleDarkMode}
				isDarkMode={isDarkMode}
			/>
			<main className="flex-grow">
				{/* Hero Section */}
				<section
					className={`${isDarkMode ? "bg-blue-900" : "bg-blue-500"} text-white py-20`}
				>
					<div className="container mx-auto text-center">
						<motion.h1
							initial={{ opacity: 0, y: -50 }}
							animate={{
								opacity: isVisible ? 1 : 0,
								y: isVisible ? 0 : -50,
							}}
							transition={{ duration: 0.8 }}
							className="text-4xl font-bold mb-4"
						>
							Innovative Strategies for Achieving Health
						</motion.h1>
						<motion.p
							initial={{ opacity: 0, y: 50 }}
							animate={{
								opacity: isVisible ? 1 : 0,
								y: isVisible ? 0 : 50,
							}}
							transition={{ duration: 0.8, delay: 0.2 }}
							className="text-xl mb-8"
						>
							Improving quality of life for those struggling with
							mental health and substance use
						</motion.p>
						<motion.a
							href="#"
							initial={{ opacity: 0, scale: 0.5 }}
							animate={{
								opacity: isVisible ? 1 : 0,
								scale: isVisible ? 1 : 0.5,
							}}
							transition={{ duration: 0.5, delay: 0.4 }}
							className={`${isDarkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-blue-500 hover:bg-blue-100"} py-2 px-6 rounded-full text-lg font-semibold transition-colors inline-flex items-center cursor-pointer select-auto`}
						>
							<Calendar size={20} className="mr-2" />
							Schedule an Appointment
						</motion.a>
					</div>
				</section>

				{/* Services Section */}
				<section className="py-16">
					<div className="container mx-auto">
						<h2 className="text-3xl font-bold text-center mb-12">
							Our Services
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{["Patients", "Collaborations", "Affiliates"].map(
								(title, index) => (
									<motion.div
										key={title}
										initial={{ opacity: 0, y: 50 }}
										animate={{
											opacity: isVisible ? 1 : 0,
											y: isVisible ? 0 : 50,
										}}
										transition={{
											duration: 0.5,
											delay: 0.2 * index,
										}}
										className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow`}
									>
										<h3 className="text-xl font-semibold mb-4">
											{title}
										</h3>
										<p className="mb-4">
											{title === "Patients" &&
												"We assist with mental illness, drugs and alcohol, building a positive and successful contribution to self, others and society in an outpatient setting."}
											{title === "Collaborations" &&
												"Our focus is to provide cost-effective, quality treatment through a hybrid model of Health Services. We help identify and bridge the gaps in healthcare services to improve quality of life."}
											{title === "Affiliates" &&
												"Four Square Clinicals consists of four branches: Clinical Practice, Research, Housing and Philanthropy. Our objectives include community outreach, job placement, improved skill-sets, and continuing care."}
										</p>
										<a
											href="#"
											className={`${isDarkMode ? "text-blue-300 hover:text-blue-400" : "text-blue-500 hover:text-blue-700"} transition-colors cursor-pointer select-auto`}
										>
											Learn More
										</a>
									</motion.div>
								)
							)}
						</div>
					</div>
				</section>

				{/* About Us Section */}
				<section
					className={`${isDarkMode ? "bg-gray-800" : "bg-gray-100"} py-16`}
				>
					<div className="container mx-auto">
						<h2 className="text-3xl font-bold text-center mb-12">
							About Us
						</h2>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: isVisible ? 1 : 0 }}
							transition={{ duration: 0.8 }}
							className={`${isDarkMode ? "bg-gray-700" : "bg-white"} rounded-lg shadow-lg p-8`}
						>
							<p className="mb-4">
								Four Square (FS) Clinicals offers direct client
								services from psychiatric evaluations and
								substance abuse treatments to clinical research,
								practice management, and administrative support.
								We utilize our resources to help identify and
								improve patient care.
							</p>
							<p className="mb-4">
								FS Clinicals provides support in private,
								non-profit, government agencies and clinical
								research. We strive to build lasting
								relationships in order to address patient needs
								by utilizing our patient centered approach and
								collaborations for &quot;whole patient&quot;
								health.
							</p>
							<p>
								From the private sector to community programs,
								we have been able to connect and build a
								well-rounded support that has been lacking in
								mental health services. Our integrated team of
								experts has allowed us to reach out to those who
								have been lost in the disparities of healthcare
								systems.
							</p>
							<motion.a
								href="#"
								className={`inline-block mt-6 ${isDarkMode ? "text-blue-300 hover:text-blue-400" : "text-blue-500 hover:text-blue-700"} transition-colors cursor-pointer select-auto`}
								whileHover={{ x: 5 }}
							>
								Read More{" "}
								<ChevronDown size={16} className="inline" />
							</motion.a>
						</motion.div>
					</div>
				</section>

				{/* Locations Section */}
				<section className="py-16">
					<div className="container mx-auto">
						<h2 className="text-3xl font-bold text-center mb-12">
							Our Locations
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{locations.map((location) => (
								<div
									key={location.city}
									className="flex flex-col"
								>
									<h3 className="text-xl font-semibold mb-4">
										{location.city}
									</h3>
									<div className="flex-grow mb-4 h-64">
										<FSClinicalsMap
											address={location.address}
											encoded={location.encoded}
											isDarkMode={isDarkMode}
										/>
									</div>
									<div className="flex flex-col space-y-2">
										<p className="flex items-center">
											<MapPin
												size={16}
												className="mr-2"
											/>
											{location.address}
										</p>
										<p className="flex items-center">
											<Phone size={16} className="mr-2" />
											<a
												href={`tel:${location.phone}`}
												className="cursor-pointer select-auto"
											>
												{location.phone}
											</a>
										</p>
										<p className="flex items-center">
											<Mail size={16} className="mr-2" />
											<a
												href={`mailto:${location.email}`}
												className="cursor-pointer select-auto"
											>
												{location.email}
											</a>
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="py-16">
					<div className="container mx-auto text-center">
						<h2 className="text-3xl font-bold mb-8">
							Ready to Get Started?
						</h2>
						<motion.a
							href="#"
							initial={{ opacity: 0, scale: 0.5 }}
							animate={{
								opacity: isVisible ? 1 : 0,
								scale: isVisible ? 1 : 0.5,
							}}
							transition={{ duration: 0.5 }}
							className={`${isDarkMode ? "bg-blue-700 hover:bg-blue-600" : "bg-blue-500 hover:bg-blue-600"} text-white py-3 px-8 rounded-full text-lg font-semibold transition-colors inline-flex items-center cursor-pointer select-auto`}
						>
							<Calendar size={20} className="mr-2" />
							Schedule Your Appointment Now
						</motion.a>
					</div>
				</section>
			</main>
			<FSClinicalsFooter isDarkMode={isDarkMode} />
		</div>
	);
};

export default FSClinicalsHomePage;
