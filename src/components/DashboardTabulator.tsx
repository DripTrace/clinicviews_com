// 'use client'

// import { useEffect, useState } from "react";
// import { data, json } from "../../data/dashboard_data";

// import jsPDF from "jspdf";
// // import * as XLSX from "xlsx";
// import "jspdf-autotable";

// import { Tabulator } from "survey-analytics/survey.analytics.tabulator.js";
// import { Model } from "survey-core";
// import "survey-analytics/survey.analytics.tabulator.css";
// import "tabulator-tables/dist/css/tabulator.min.css";

// (window as any)["jsPDF"] = jsPDF;
// // (window as any)["XLSX"] = XLSX;

// export default function DashboardTabulator() {
//   let [vizPanel, setVizPanel] = useState<Tabulator>();

//   if (!vizPanel) {
//     const survey = new Model(json);
//     vizPanel = new Tabulator(survey, data);
//     setVizPanel(vizPanel);
//   }

//   useEffect(() => {
//     vizPanel?.render("summaryContainer");
//   }, [vizPanel]);

//   return <div style={{ height: "80vh", width: "100%" }} id="summaryContainer"></div>;
// }

// "use client";

// import "jspdf-autotable";
// import dynamic from "next/dynamic";
// import { useEffect, useState } from "react";
// import "survey-analytics/survey.analytics.tabulator.css";
// import { Model } from "survey-core";
// import "tabulator-tables/dist/css/tabulator.min.css";
// import { data, json } from "../../data/dashboard_data";

// const DashboardTabulator = () => {
// 	const [vizPanel, setVizPanel] = useState<any>(null);

// 	useEffect(() => {
// 		const loadDependencies = async () => {
// 			try {
// 				const jsPDF = (await import("jspdf")).default;
// 				await import("jspdf-autotable");
// 				const { Tabulator } = await import(
// 					"survey-analytics/survey.analytics.tabulator.js"
// 				);

// 				(window as any)["jsPDF"] = jsPDF;

// 				const survey = new Model(json);
// 				const newVizPanel = new Tabulator(survey, data);
// 				setVizPanel(newVizPanel);

// 				console.log("Tabulator initialized successfully.");
// 			} catch (error) {
// 				console.error("Error loading dependencies:", error);
// 			}
// 		};

// 		loadDependencies();
// 	}, []);

// 	useEffect(() => {
// 		if (vizPanel) {
// 			console.log("Rendering vizPanel");
// 			vizPanel.render("summaryContainer");
// 		}
// 		return () => {
// 			if (vizPanel) {
// 				console.log("Clearing vizPanel");
// 				vizPanel.clear();
// 			}
// 		};
// 	}, [vizPanel]);

// 	return (
// 		<div
// 			style={{ height: "80vh", width: "100%" }}
// 			id="summaryContainer"
// 		></div>
// 	);
// };

// export default dynamic(() => Promise.resolve(DashboardTabulator), {
// 	ssr: false,
// });

"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "survey-analytics/survey.analytics.tabulator.css";
import { Model } from "survey-core";
import "tabulator-tables/dist/css/tabulator.min.css";
import { data, json } from "../../data/dashboard_data-0";
// import { Model } from "../../surveyjs-core/survey-library_dev/build/survey-core/survey.core";
// import "../../survey-core/survey-analytics_dev/src/tables/tabulator.scss";

const DashboardTabulator = () => {
	const [vizPanel, setVizPanel] = useState<any>(null);
	const [initialized, setInitialized] = useState(false);

	useEffect(() => {
		const loadDependencies = async () => {
			try {
				console.log("Loading jsPDF...");
				const jsPDF = (await import("jspdf")).default;
				await import("jspdf-autotable");
				console.log("jsPDF loaded successfully.");

				console.log("Loading Tabulator...");
				const { Tabulator } = await import(
					"survey-analytics/survey.analytics.tabulator.js"
					// "../../surveyjs-core/survey-analytics_dev/src/tables/tabulator.js"
				);
				console.log("Tabulator loaded successfully.");

				(window as any)["jsPDF"] = jsPDF;

				const survey = new Model(json);
				const newVizPanel = new Tabulator(survey, data);
				console.log("Tabulator created:", newVizPanel);

				setVizPanel(newVizPanel);

				setInitialized(true);
			} catch (error) {
				console.error("Error loading dependencies:", error);
			}
		};

		loadDependencies();
	}, []);

	useEffect(() => {
		if (vizPanel) {
			// console.log("Rendering vizPanel");
			// vizPanel.render("summaryContainer");
			requestAnimationFrame(() => {
				vizPanel.render("summaryContainer");
			});
		}
		return () => {
			if (vizPanel) {
				// console.log("Clearing vizPanel");
				// vizPanel.clear();
				requestAnimationFrame(() => {
					vizPanel.render("summaryContainer");
				});
			}
		};
	}, [vizPanel]);

	return (
		<div style={{ height: "80vh", width: "100%" }} id="summaryContainer">
			{initialized ? "Tabulator Initialized" : "Loading..."}
		</div>
	);
};

export default dynamic(() => Promise.resolve(DashboardTabulator), {
	ssr: false,
});
