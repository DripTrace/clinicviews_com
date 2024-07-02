"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface ConditionItemProps {
	condition: string;
	description: string;
}

const ConditionItem: React.FC<ConditionItemProps> = React.memo(
	({ condition, description }) => {
		const [isExpanded, setIsExpanded] = useState(false);

		const toggleExpand = useCallback(() => {
			setIsExpanded((prev) => !prev);
		}, []);

		return (
			<div
				className={`bg-blue-800/10 dark:bg-gray-700/10 rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "row-span-2" : ""}`}
			>
				<button
					className="w-full p-4 text-left flex justify-between items-center text-white hover:bg-blue-700 dark:hover:bg-gray-600 transition-colors duration-300 opacity-70"
					onClick={toggleExpand}
				>
					<span className="font-medium">{condition}</span>
					{isExpanded ? <FaChevronUp /> : <FaChevronDown />}
				</button>
				<div
					className={`bg-blue-700/40 dark:bg-gray-600/40 overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-48 p-4" : "max-h-0 p-0"}`}
				>
					<p className="text-white">{description}</p>
				</div>
			</div>
		);
	}
);

ConditionItem.displayName = "ConditionItem";

export default ConditionItem;
