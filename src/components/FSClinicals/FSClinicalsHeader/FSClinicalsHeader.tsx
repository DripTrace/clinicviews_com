"use client";

import type React from "react";
import { Phone, Mail, Moon, Sun } from "lucide-react";

interface FSClinicalsHeaderProps {
	toggleDarkMode: () => void;
	isDarkMode: boolean;
}

const FSClinicalsHeader: React.FC<FSClinicalsHeaderProps> = ({
	toggleDarkMode,
	isDarkMode,
}) => {
	return (
		<header
			className={`${isDarkMode ? "bg-gray-800" : "bg-blue-600"} text-white p-4`}
		>
			<div className="container mx-auto flex justify-between items-center">
				<h1 className="text-2xl font-bold">Four Square Clinicals</h1>
				<nav>
					<ul className="flex space-x-4">
						<li>
							<a
								href="#"
								className="hover:text-blue-200 transition-colors cursor-pointer"
							>
								Home
							</a>
						</li>
						<li>
							<a
								href="#"
								className="hover:text-blue-200 transition-colors cursor-pointer"
							>
								Contact
							</a>
						</li>
						<li>
							<a
								href="#"
								className="hover:text-blue-200 transition-colors cursor-pointer"
							>
								About
							</a>
						</li>
						<li>
							<a
								href="#"
								className="hover:text-blue-200 transition-colors cursor-pointer"
							>
								Forms
							</a>
						</li>
					</ul>
				</nav>
				<div className="flex items-center space-x-4">
					<a
						href="mailto:info@fsclinicals.com"
						className="flex items-center hover:text-blue-200 transition-colors cursor-pointer"
					>
						<Mail size={18} className="mr-2" />
						info@fsclinicals.com
					</a>
					<a
						href="tel:775-238-3082"
						className="flex items-center hover:text-blue-200 transition-colors cursor-pointer"
					>
						<Phone size={18} className="mr-2" />
						775-238-3082
					</a>
					<button
						onClick={toggleDarkMode}
						className="p-2 rounded-full hover:bg-blue-700 transition-colors"
					>
						{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
					</button>
				</div>
			</div>
		</header>
	);
};

export default FSClinicalsHeader;
