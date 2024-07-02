// // "use client";

// // // import fetch from "node-fetch";
// // import FormData from "form-data";
// // import fs from "fs";
// // import { Model, SurveyModel } from "survey-core";
// // import "survey-core/defaultV2.css";
// // import { Survey } from "survey-react-ui";
// // // import {Survey} from "/../../survey-core/survey-creator_dev/packages/build/survey-react-ui"
// // // import { json } from "../../data/survey_json.js";
// // // import { themeJson } from "@/utils/constants";
// // import { SurveyPDF } from "survey-pdf";
// // // import { json } from "../../data/survey_json-0.js";
// // import { useEffect, useState } from "react";
// // // import { json, themeJson } from "../../data/survey_json.js";
// // import { json, themeJson } from "../../data/survey_json-revised.js";
// // // import Survey from "../../surveyjs-core/survey-creator/testCafe/property-grid/survey.js";
// // // import "../../surveyjs-core//survey-library_dev/src/defaultV2.scss";
// // // import Survey from "../../surveyjs-core/survey-creator/testCafe/property-grid/survey.js";
// // // import { Model } from "../../surveyjs-core/survey-library_dev/build/survey-core/survey.core.js";
// // // import { Survey } from "../../surveyjs-core/survey-library_dev/src/react/reactSurvey.jsx";
// // // import { Survey } from "../../surveyjs-core/survey-library_dev/src/entries/vue-ui-model.js";
// // // import { Model, Survey } from "../../surveyjs-core/survey-library_dev/src/entries/knockout-ui-model.js";

// // export default function SurveyComponent() {
// // 	function createSurveyPdfModel(surveyModel: SurveyModel) {
// // 		// const pdfWidth =
// // 		// 	!!surveyModel && surveyModel.pdfWidth ? surveyModel.pdfWidth : 210;
// // 		// const pdfHeight =
// // 		// 	!!surveyModel && surveyModel.pdfHeight ? surveyModel.pdfHeight : 297;
// // 		// const options: IDocOptions = {
// // 		// 	fontSize: 14,
// // 		// 	margins: {
// // 		// 		left: 10,
// // 		// 		right: 10,
// // 		// 		top: 10,
// // 		// 		bot: 10,
// // 		// 	},
// // 		// 	applyImageFit: false,
// // 		// 	format: [pdfWidth, pdfHeight],
// // 		// };
// // 		const pdfWidth =
// // 			!!surveyModel && surveyModel.pdfWidth ? surveyModel.pdfWidth : 210;
// // 		const pdfHeight =
// // 			!!surveyModel && surveyModel.pdfHeight
// // 				? surveyModel.pdfHeight
// // 				: 297;
// // 		const options = {
// // 			fontSize: 8,
// // 			margins: {
// // 				left: 10,
// // 				right: 10,
// // 				top: 10,
// // 				bot: 10,
// // 			},
// // 			format: [pdfWidth, pdfHeight],
// // 			fontName: "Roboto",
// // 			useCustomFontInHtml: true,
// // 		};
// // 		const surveyPDF = new SurveyPDF(json, options);
// // 		// const surveyPDF = new SurveyPDF(patientRegistration, options);
// // 		// const surveyPDF = new SurveyPDF(fields, options);
// // 		if (surveyModel) {
// // 			surveyPDF.data = surveyModel.data;
// // 		}

// // 		return surveyPDF;
// // 	}
// // 	function saveSurveyToPdf(filename: string, surveyModel: SurveyModel) {
// // 		createSurveyPdfModel(surveyModel).save(filename);
// // 	}

// // 	const [email, setEmail] = useState("");
// // 	const [fullname, setFullname] = useState("");
// // 	const [subject, setSubject] = useState("");
// // 	const [message, setMessage] = useState("");
// // 	const [isLoading, setIsLoading] = useState(false);
// // 	const [response, setResponse] = useState("");
// // 	const [blobURL, setBlobURL] = useState<string>("");

// // 	// const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
// // 	// 	e.preventDefault();
// // 	// 	setIsLoading(true);
// // 	// 	setResponse("");

// // 	// 	try {
// // 	// 		const res = await fetch("/api/sendGrid/route", {
// // 	// 			method: "POST",
// // 	// 			headers: {
// // 	// 				"Content-Type": "application/json",
// // 	// 			},
// // 	// 			// body: JSON.stringify({ email, fullname, subject, message }),
// // 	// 			body: JSON.stringify({ fullname, subject }),
// // 	// 		});

// // 	// 		const data = await res.json();
// // 	// 		setResponse(data.message || data.error);
// // 	// 	} catch (error) {
// // 	// 		setResponse("An error occurred while sending the email");
// // 	// 	}

// // 	// 	setIsLoading(false);
// // 	// };

// // 	// const sendPdf = async (pdfData: ArrayBuffer) => {
// // 	// 	setIsLoading(true);
// // 	// 	setResponse("");
// // 	// };

// // 	const handleSubmit = async (patientBlob: string) => {
// // 		setIsLoading(true);
// // 		setResponse("");
// // 		// console.log("entered: ", patientBlob);

// // 		try {
// // 			// const res = await fetch("/api/newPatient/route", {
// // 			// 	method: "POST",
// // 			// 	headers: {
// // 			// 		"Content-Type": "application/json",
// // 			// 	},
// // 			// 	body: JSON.stringify({ newpatient }),
// // 			// });
// // 			// const data = await res.json();
// // 			// setResponse(data.message || data.error);

// // 			console.log("sending patientBlob to api:\n", patientBlob);

// // 			const blobRes = await fetch("/api/upload-form/route", {
// // 				method: "POST",
// // 				body: JSON.stringify({ newpatient: patientBlob }),
// // 				// body: JSON.stringify({ newpatient: patientBlob }),
// // 				headers: {
// // 					"Content-Type": "application/pdf",
// // 				},
// // 				// body: JSON.stringify({ patientBlob }),
// // 			});

// // 			console.log("blobRes: ", blobRes);
// // 			// const blobData = await blobRes.json();
// // 			// setResponse(blobData.message || blobData.error);
// // 		} catch (error) {
// // 			setResponse("An error occurred while sending the email");
// // 		}

// // 		setIsLoading(false);
// // 	};

// // 	// 	const handleSubmit = async (pdfData: ArrayBuffer) => {
// // 	// 		setIsLoading(true);
// // 	// 		setResponse("");
// // 	// 		console.log("pdfData: ", pdfData);

// // 	// 		try {
// // 	// 			const formData = new FormData();
// // 	// 			formData.append(
// // 	// 				"pdf",
// // 	// 				new Blob([pdfData], { type: "application/pdf" }),
// // 	// 				"registration-results.pdf"
// // 	// 			);
// // 	// 			formData.append("patientName", patientName);
// // 	// 			formData.append("patientEmail", patientEmail);

// // 	// 			console.log("formData(sending to api): ", formData);

// // 	// 			const res = await fetch("/api/upload-form/route", {
// // 	// 				method: "POST",
// // 	// 				body: formData,
// // 	// 			});

// // 	// 			const data = await res.json();
// // 	// 			setResponse(data.message || data.error);
// // 	// 			console.log("data: ", data);
// // 	// 		} catch (error) {
// // 	// 			setResponse("An error occurred while sending the PDF");
// // 	// 		}

// // 	// 		setIsLoading(false);
// // 	// 	};

// // 	const model = new Model(json);
// // 	// const model = new Model(fields);
// // 	// @ts-ignore
// // 	model.applyTheme(themeJson);
// // 	// model.applyTheme(patientRegistrationTheme);
// // 	model.addNavigationItem({
// // 		id: "patient_registry",
// // 		title: "Register",
// // 		action: () => {
// // 			// const patientRegistry = model.getQuestionByName("patient_registry");
// // 			// console.log("patientRegistry: ", patientRegistry);
// // 			// const registerEntry = JSON.stringify(model.data, null, 3);
// // 			// console.log("registerEntry: ", registerEntry);
// // 			const pdfOutput = saveSurveyToPdf(
// // 				"registration-results.pdf",
// // 				model
// // 			);
// // 			console.log("pdfOutput: ", pdfOutput);
// // 		},
// // 	});
// // 	// const model = new Model(json);
// // 	model.onComplete.add((sender, options) => {
// // 		const newPatient = JSON.stringify(sender.data, null, 3);
// // 		handleSubmit(newPatient);
// // 		console.log(newPatient);
// // 		// console.log(JSON.stringify(sender.data, null, 3));
// // 	});
// // 	model.addNavigationItem({
// // 		id: "model_save_as_file",
// // 		title: "Save as PDF",
// // 		action: () => {
// // 			saveSurveyToPdf("modelResult.pdf", model);
// // 		},
// // 	});
// // 	function savePdfViaBlob() {
// // 		const modelPDF = createSurveyPdfModel(model);
// // 		modelPDF.raw("bloburl").then(function (bloburl) {
// // 			// console.log("bloburl:\n", Object.values(bloburl));
// // 			console.log("bloburl:\n", bloburl);
// // 			// setBlobURL(bloburl);
// // 			// handleSubmit(blobURL);
// // 			// console.log(Object.values(bloburl));
// // 			const a = document.createElement("a");
// // 			a.href = bloburl;
// // 			// console.log("a: ", a);
// // 			// console.log("blob: ", a.href, "aType: ", typeof a);
// // 			// setBlobURL(a.href);
// // 			// console.log("blobUrl: ", blobURL);
// // 			// console.log("blobUrl: ", a.href.split("bloburl:  blob:")[1]);
// // 			// console.log("blobUrl: ", a.href);
// // 			// console.log(Object.values(a.href)[0]);
// // 			// console.log(Object.values(bloburl)[0]);
// // 			// ['bar', 42]
// // 			a.download = "modelViaBlob.pdf";
// // 			// console.log("a: ", a);
// // 			// setBlobURL(`${a}`);

// // 			document.body.appendChild(a);
// // 			// console.log("document: ", document);
// // 			a.click();
// // 			console.log("a: ", a);
// // 			// setBlobURL(`${a}`);
// // 			// setBlobURL(a);
// // 		});
// // 	}

// // 	function savePdfViaRealBlob() {
// // 		const modelPDF = createSurveyPdfModel(model);
// // 		modelPDF.raw("blob").then(function (rawblob) {
// // 			// console.log("rawblob:\n", Object.values(rawblob));
// // 			console.log("rawblob:\n", rawblob);
// // 			setBlobURL(rawblob);
// // 			// handleSubmit(rawBlob);
// // 			// console.log(Object.values(rawBlob));
// // 			const a = document.createElement("a");
// // 			a.href = rawblob;
// // 			// console.log("a: ", a);
// // 			// console.log("blob: ", a.href, "aType: ", typeof a);
// // 			// setBlobURL(a.href);
// // 			// console.log("rawblob: ", blobURL);
// // 			// console.log("rawblob: ", a.href.split("rawblob:  blob:")[1]);
// // 			// console.log("rawblob: ", a.href);
// // 			// console.log(Object.values(a.href)[0]);
// // 			// console.log(Object.values(rawblob)[0]);
// // 			// ['bar', 42]
// // 			a.download = "modelViaBlob.pdf";
// // 			document.body.appendChild(a);
// // 			// console.log("document: ", document);
// // 			a.click();
// // 		});
// // 	}

// // 	function previewPdf() {
// // 		const surveyPDF = createSurveyPdfModel(model);
// // 		const oldFrame = document.getElementById("pdf-preview-frame");
// // 		if (oldFrame && oldFrame.parentNode)
// // 			oldFrame.parentNode.removeChild(oldFrame);
// // 		surveyPDF.raw().then(function (uint8Array) {
// // 			const blob = new Blob([uint8Array], { type: "application/pdf" });
// // 			// setBlobURL(blob);
// // 			const url = URL.createObjectURL(blob);
// // 			const pdfEmbed = document.createElement("embed");
// // 			pdfEmbed.setAttribute("id", "pdf-preview-frame");
// // 			pdfEmbed.setAttribute("type", "application/pdf");
// // 			pdfEmbed.setAttribute("style", "width:100%");
// // 			pdfEmbed.setAttribute("height", `${window.innerHeight - 100}`);
// // 			pdfEmbed.setAttribute("src", url);
// // 			const previewDiv = document.getElementById("pdf-preview");
// // 			if (previewDiv) {
// // 				previewDiv.appendChild(pdfEmbed);
// // 			} else {
// // 				const hiddenElements = document.createElement("div");
// // 				hiddenElements.setAttribute("style", "display: none;");
// // 				hiddenElements.appendChild(pdfEmbed);
// // 				document.body.appendChild(hiddenElements);
// // 			}
// // 		});
// // 	}
// // 	model.navigationBar.getActionById("sv-nav-complete").visible = false;
// // 	model.addNavigationItem({
// // 		id: "model_save_via_blob",
// // 		title: "Save via Blob",
// // 		// action: savePdfViaBlob,
// // 		action: savePdfViaRealBlob,
// // 	});
// // 	model.addNavigationItem({
// // 		id: "survey_pdf_preview",
// // 		title: "Preview PDF",
// // 		action: previewPdf,
// // 	});

// // 	useEffect(() => {
// // 		console.log("blobURL: ", blobURL);
// // 		if (blobURL) {
// // 			handleSubmit(blobURL);
// // 		} else {
// // 			console.log("blobURL is empty");
// // 		}
// // 	}, [blobURL]);

// // 	return (
// // 		<>
// // 			<Survey model={model} />
// // 			<div id="surveyElement"></div>
// // 			<div id="pdf-preview"></div>
// // 		</>
// // 	);
// // }

// // // "use client";

// // // import { Model } from "survey-core";
// // // import "survey-core/defaultV2.css";
// // // import { Survey } from "survey-react-ui";
// // // import { SurveyPDF } from "survey-pdf";
// // // import { useState } from "react";
// // // import { json, themeJson } from "../../data/survey_json.js";

// // // function createSurveyPdfModel(surveyModel: any) {
// // // 	const pdfWidth =
// // // 		!!surveyModel && surveyModel.pdfWidth ? surveyModel.pdfWidth : 210;
// // // 	const pdfHeight =
// // // 		!!surveyModel && surveyModel.pdfHeight ? surveyModel.pdfHeight : 297;
// // // 	const options = {
// // // 		fontSize: 8,
// // // 		margins: {
// // // 			left: 10,
// // // 			right: 10,
// // // 			top: 10,
// // // 			bot: 10,
// // // 		},
// // // 		format: [pdfWidth, pdfHeight],
// // // 		fontName: "Roboto",
// // // 		useCustomFontInHtml: true,
// // // 	};
// // // 	const surveyPDF = new SurveyPDF(json, options);
// // // 	if (surveyModel) {
// // // 		surveyPDF.data = surveyModel.data;
// // // 	}

// // // 	return surveyPDF;
// // // }

// // // async function saveSurveyToPdf(filename: string, surveyModel: any) {
// // // 	const surveyPDF = createSurveyPdfModel(surveyModel);
// // // 	const pdfData = await surveyPDF.save(filename);
// // // 	// .save(filename);
// // // 	return pdfData;
// // // }

// // // // function saveSurveyToPdfNow(filename: string, surveyModel: any) {
// // // // 	const surveyPDF = createSurveyPdfModel(surveyModel).save(filename);
// // // // 	return surveyPDF;
// // // // }

// // // export default function SurveyComponent() {
// // // 	const [isLoading, setIsLoading] = useState(false);
// // // 	const [response, setResponse] = useState("");
// // // 	const [patientName, setPatientName] = useState("");
// // // 	const [patientEmail, setPatientEmail] = useState("");

// // // 	const handleSubmit = async (pdfData: ArrayBuffer) => {
// // // 		setIsLoading(true);
// // // 		setResponse("");

// // // 		try {
// // // 			const formData = new FormData();
// // // 			formData.append(
// // // 				"pdf",
// // // 				new Blob([pdfData], { type: "application/pdf" }),
// // // 				"registration-results.pdf"
// // // 			);
// // // 			formData.append("patientName", patientName);
// // // 			formData.append("patientEmail", patientEmail);
// // // 			console.log("formData(sending to api): ", formData);

// // // 			const res = await fetch("/api/upload-form/route", {
// // // 				method: "POST",
// // // 				body: formData,
// // // 			});

// // // 			const data = await res.json();
// // // 			setResponse(data.message || data.error);
// // // 		} catch (error) {
// // // 			setResponse("An error occurred while sending the PDF");
// // // 		}

// // // 		setIsLoading(false);
// // // 	};

// // // 	const model = new Model(json);
// // // 	// @ts-ignore
// // // 	model.applyTheme(themeJson);
// // // 	model.addNavigationItem({
// // // 		id: "patient_registry",
// // // 		title: "Register",
// // // 		action: async () => {
// // // 			// saveSurveyToPdfNow("registration-results.pdf", model);
// // // 			const pdfData = await saveSurveyToPdf(
// // // 				"registration-results.pdf",
// // // 				model
// // // 			);
// // // 			handleSubmit(pdfData);
// // // 		},
// // // 	});
// // // 	model.onComplete.add(async (sender, options) => {
// // // 		const newPatient = JSON.stringify(sender.data, null, 3);
// // // 		// saveSurveyToPdfNow("registration-results.pdf", model);
// // // 		const pdfData = await saveSurveyToPdf(
// // // 			"registration-results.pdf",
// // // 			model
// // // 		);
// // // 		console.log("patient data: ", newPatient);
// // // 		console.log("options: ", options);
// // // 		handleSubmit(pdfData);
// // // 	});

// // // 	return (
// // // 		<div className="size-full">
// // // 			<Survey model={model} className="size-full" />
// // // 			<div
// // // 				style={{ marginTop: "0px" }}
// // // 				className="flex items-center justify-center w-full border border-black rounded-md"
// // // 			>
// // // 				<h3>Patient Information</h3>
// // // 				<div>
// // // 					<label htmlFor="patientName">Patient Name:</label>
// // // 					<input
// // // 						className="text-black"
// // // 						type="text"
// // // 						id="patientName"
// // // 						value={patientName}
// // // 						onChange={(e) => setPatientName(e.target.value)}
// // // 						required
// // // 					/>
// // // 				</div>
// // // 				<div>
// // // 					<label htmlFor="patientEmail">Patient Email:</label>
// // // 					<input
// // // 						className="text-black"
// // // 						type="email"
// // // 						id="patientEmail"
// // // 						value={patientEmail}
// // // 						onChange={(e) => setPatientEmail(e.target.value)}
// // // 						required
// // // 					/>
// // // 				</div>
// // // 			</div>
// // // 		</div>
// // // 	);
// // // }

// // // // "use client";

// // // // import { Model } from "survey-core";
// // // // import "survey-core/defaultV2.css";
// // // // import { Survey } from "survey-react-ui";
// // // // // import {Survey} from "/../../survey-core/survey-creator_dev/packages/build/survey-react-ui"
// // // // // import { json } from "../../data/survey_json.js";
// // // // // import { themeJson } from "@/utils/constants";
// // // // import { SurveyPDF } from "survey-pdf";
// // // // // import { json } from "../../data/survey_json-0.js";
// // // // import { useState } from "react";
// // // // import { json, themeJson } from "../../data/survey_json.js";
// // // // // import Survey from "../../surveyjs-core/survey-creator/testCafe/property-grid/survey.js";
// // // // // import "../../surveyjs-core//survey-library_dev/src/defaultV2.scss";
// // // // // import Survey from "../../surveyjs-core/survey-creator/testCafe/property-grid/survey.js";
// // // // // import { Model } from "../../surveyjs-core/survey-library_dev/build/survey-core/survey.core.js";
// // // // // import { Survey } from "../../surveyjs-core/survey-library_dev/src/react/reactSurvey.jsx";
// // // // // import { Survey } from "../../surveyjs-core/survey-library_dev/src/entries/vue-ui-model.js";
// // // // // import { Model, Survey } from "../../surveyjs-core/survey-library_dev/src/entries/knockout-ui-model.js";

// // // // function createSurveyPdfModel(surveyModel: any) {
// // // // 	// const pdfWidth =
// // // // 	// 	!!surveyModel && surveyModel.pdfWidth ? surveyModel.pdfWidth : 210;
// // // // 	// const pdfHeight =
// // // // 	// 	!!surveyModel && surveyModel.pdfHeight ? surveyModel.pdfHeight : 297;
// // // // 	// const options: IDocOptions = {
// // // // 	// 	fontSize: 14,
// // // // 	// 	margins: {
// // // // 	// 		left: 10,
// // // // 	// 		right: 10,
// // // // 	// 		top: 10,
// // // // 	// 		bot: 10,
// // // // 	// 	},
// // // // 	// 	applyImageFit: false,
// // // // 	// 	format: [pdfWidth, pdfHeight],
// // // // 	// };
// // // // 	const pdfWidth =
// // // // 		!!surveyModel && surveyModel.pdfWidth ? surveyModel.pdfWidth : 210;
// // // // 	const pdfHeight =
// // // // 		!!surveyModel && surveyModel.pdfHeight ? surveyModel.pdfHeight : 297;
// // // // 	const options = {
// // // // 		fontSize: 8,
// // // // 		margins: {
// // // // 			left: 10,
// // // // 			right: 10,
// // // // 			top: 10,
// // // // 			bot: 10,
// // // // 		},
// // // // 		format: [pdfWidth, pdfHeight],
// // // // 		fontName: "Roboto",
// // // // 		useCustomFontInHtml: true,
// // // // 	};
// // // // 	const surveyPDF = new SurveyPDF(json, options);
// // // // 	// const surveyPDF = new SurveyPDF(patientRegistration, options);
// // // // 	// const surveyPDF = new SurveyPDF(fields, options);
// // // // 	if (surveyModel) {
// // // // 		surveyPDF.data = surveyModel.data;
// // // // 	}

// // // // 	return surveyPDF;
// // // // }
// // // // function saveSurveyToPdf(filename: string, surveyModel: any) {
// // // // 	createSurveyPdfModel(surveyModel).save(filename);
// // // // }

// // // // export default function SurveyComponent() {
// // // // 	const [email, setEmail] = useState("");
// // // // 	const [fullname, setFullname] = useState("");
// // // // 	const [subject, setSubject] = useState("");
// // // // 	const [message, setMessage] = useState("");
// // // // 	const [isLoading, setIsLoading] = useState(false);
// // // // 	const [response, setResponse] = useState("");

// // // // 	// const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
// // // // 	// 	e.preventDefault();
// // // // 	// 	setIsLoading(true);
// // // // 	// 	setResponse("");

// // // // 	// 	try {
// // // // 	// 		const res = await fetch("/api/sendGrid/route", {
// // // // 	// 			method: "POST",
// // // // 	// 			headers: {
// // // // 	// 				"Content-Type": "application/json",
// // // // 	// 			},
// // // // 	// 			// body: JSON.stringify({ email, fullname, subject, message }),
// // // // 	// 			body: JSON.stringify({ fullname, subject }),
// // // // 	// 		});

// // // // 	// 		const data = await res.json();
// // // // 	// 		setResponse(data.message || data.error);
// // // // 	// 	} catch (error) {
// // // // 	// 		setResponse("An error occurred while sending the email");
// // // // 	// 	}

// // // // 	// 	setIsLoading(false);
// // // // 	// };

// // // // 	const handleSubmit = async (newpatient: string) => {
// // // // 		setIsLoading(true);
// // // // 		setResponse("");
// // // // 		console.log("entered: ", newpatient);

// // // // 		try {
// // // // 			const res = await fetch("/api/newPatient/route", {
// // // // 				method: "POST",
// // // // 				headers: {
// // // // 					"Content-Type": "application/json",
// // // // 				},
// // // // 				body: JSON.stringify({ newpatient }),
// // // // 			});

// // // // 			const data = await res.json();
// // // // 			setResponse(data.message || data.error);
// // // // 		} catch (error) {
// // // // 			setResponse("An error occurred while sending the email");
// // // // 		}

// // // // 		setIsLoading(false);
// // // // 	};

// // // // 	const model = new Model(json);
// // // // 	// const model = new Model(fields);
// // // // 	// @ts-ignore
// // // // 	model.applyTheme(themeJson);
// // // // 	// model.applyTheme(patientRegistrationTheme);
// // // // 	model.addNavigationItem({
// // // // 		id: "patient_registry",
// // // // 		title: "Register",
// // // // 		action: () => {
// // // // 			// const patientRegistry = model.getQuestionByName("patient_registry");
// // // // 			// console.log("patientRegistry: ", patientRegistry);
// // // // 			// const registerEntry = JSON.stringify(model.data, null, 3);
// // // // 			// console.log("registerEntry: ", registerEntry);
// // // // 			saveSurveyToPdf("registration-results.pdf", model);
// // // // 		},
// // // // 	});
// // // // 	// const model = new Model(json);
// // // // 	model.onComplete.add((sender, options) => {
// // // // 		const newPatient = JSON.stringify(sender.data, null, 3);
// // // // 		handleSubmit(newPatient);
// // // // 		console.log(newPatient);
// // // // 		// console.log(JSON.stringify(sender.data, null, 3));
// // // // 	});

// // // // 	return <Survey model={model} />;
// // // // }

// // // "use client";

// // // import { Model } from "survey-core";
// // // import "survey-core/defaultV2.css";
// // // import { Survey } from "survey-react-ui";
// // // import { SurveyPDF } from "survey-pdf";
// // // import { useState } from "react";
// // // import { json, themeJson } from "../../data/survey_json.js";

// // // function createSurveyPdfModel(surveyModel: any) {
// // // 	const pdfWidth =
// // // 		!!surveyModel && surveyModel.pdfWidth ? surveyModel.pdfWidth : 210;
// // // 	const pdfHeight =
// // // 		!!surveyModel && surveyModel.pdfHeight ? surveyModel.pdfHeight : 297;
// // // 	const options = {
// // // 		fontSize: 8,
// // // 		margins: {
// // // 			left: 10,
// // // 			right: 10,
// // // 			top: 10,
// // // 			bot: 10,
// // // 		},
// // // 		format: [pdfWidth, pdfHeight],
// // // 		fontName: "Roboto",
// // // 		useCustomFontInHtml: true,
// // // 	};
// // // 	const surveyPDF = new SurveyPDF(json, options);
// // // 	if (surveyModel) {
// // // 		surveyPDF.data = surveyModel.data;
// // // 	}

// // // 	return surveyPDF;
// // // }

// // // async function saveSurveyToPdf(filename: string, surveyModel: any) {
// // // 	// function saveSurveyToPdf(filename: string, surveyModel: any) {
// // // 	const surveyPDF = await createSurveyPdfModel(surveyModel).save(filename);
// // // 	// const surveyPDF = createSurveyPdfModel(surveyModel).save(filename);
// // // 	// const surveyPDF = createSurveyPdfModel(surveyModel);
// // // 	// const pdfData = await surveyPDF.save(filename);
// // // 	// return pdfData;
// // // 	return surveyPDF;
// // // }

// // // export default function SurveyComponent() {
// // // 	const [isLoading, setIsLoading] = useState(false);
// // // 	const [response, setResponse] = useState("");
// // // 	const [patientName, setPatientName] = useState("patientname");
// // // 	const [patientEmail, setPatientEmail] = useState("patientemail");

// // // 	const handleSubmit = async (pdfData: ArrayBuffer) => {
// // // 		setIsLoading(true);
// // // 		setResponse("");
// // // 		console.log("pdfData: ", pdfData);

// // // 		try {
// // // 			const formData = new FormData();
// // // 			formData.append(
// // // 				"pdf",
// // // 				new Blob([pdfData], { type: "application/pdf" }),
// // // 				"registration-results.pdf"
// // // 			);
// // // 			formData.append("patientName", patientName);
// // // 			formData.append("patientEmail", patientEmail);

// // // 			console.log("formData(sending to api): ", formData);

// // // 			const res = await fetch("/api/upload-form/route", {
// // // 				method: "POST",
// // // 				body: formData,
// // // 			});

// // // 			const data = await res.json();
// // // 			setResponse(data.message || data.error);
// // // 			console.log("data: ", data);
// // // 		} catch (error) {
// // // 			setResponse("An error occurred while sending the PDF");
// // // 		}

// // // 		setIsLoading(false);
// // // 	};

// // // 	const model = new Model(json);
// // // 	// @ts-ignore
// // // 	model.applyTheme(themeJson);
// // // 	model.addNavigationItem({
// // // 		id: "patient_registry",
// // // 		title: "Register",
// // // 		action: async () => {
// // // 			const pdfData = await saveSurveyToPdf(
// // // 				"registration-results.pdf",
// // // 				model
// // // 			);
// // // 			console.log("pdfData(navItem): ", pdfData);
// // // 			// const newPatient = JSON.stringify(sender.data, null, 3);
// // // 			// console.log(newPatient)
// // // 			handleSubmit(pdfData);
// // // 		},
// // // 	});
// // // 	model.onComplete.add(async (sender, options) => {
// // // 		const pdfData = await saveSurveyToPdf(
// // // 			"registration-results.pdf",
// // // 			model
// // // 		);
// // // 		const newPatient = JSON.stringify(sender.data, null, 3);
// // // 		console.log("newPatient: ", newPatient);
// // // 		console.log("pdfData(onComplete): ", pdfData);
// // // 		console.log("options: ", options);
// // // 		handleSubmit(pdfData);
// // // 	});

// // // 	return (
// // // 		// // <div className="/*size-full flex items-center justify-center flex-col*/">
// // // 		// // <>
// // // 		<Survey
// // // 			model={model}
// // // 			className="size-full flex items-center justify-center"
// // // 		/>
// // // 		// // {/* <div
// // // 		// // 	// style={{ marginTop: "20px" }}
// // // 		// // 	className="w-full text-black bg-[#f6f4ee] flex items-center justify-center border border-black p-4 rounded-md"
// // // 		// // >
// // // 		// // 	<h3>Patient Information</h3>
// // // 		// // 	<div>
// // // 		// // 		<label htmlFor="patientName">Patient Name:</label>
// // // 		// // 		<input
// // // 		// // 			className="text-black"
// // // 		// // 			type="text"
// // // 		// // 			id="patientName"
// // // 		// // 			value={patientName}
// // // 		// // 			onChange={(e) => setPatientName(e.target.value)}
// // // 		// // 			required
// // // 		// // 		/>
// // // 		// // 	</div>
// // // 		// // 	<div>
// // // 		// // 		<label htmlFor="patientEmail">Patient Email:</label>
// // // 		// // 		<input
// // // 		// // 			className="text-black"
// // // 		// // 			type="email"
// // // 		// // 			id="patientEmail"
// // // 		// // 			value={patientEmail}
// // // 		// // 			onChange={(e) => setPatientEmail(e.target.value)}
// // // 		// // 			required
// // // 		// // 		/>
// // // 		// // 	</div>
// // // 		// // </div> */}
// // // 		// // </>
// // // 		// // </div>
// // // 	);
// // // }

// "use client";

// import { Model, SurveyModel } from "survey-core";
// import "survey-core/defaultV2.css";
// import { Survey } from "survey-react-ui";
// import { SurveyPDF } from "survey-pdf";
// import { useEffect, useState } from "react";
// // import { json, themeJson } from "../../data/survey_json-revised.js";
// import { json, themeJson } from "@/data/llpmg-patient-form";

// export default function SurveyComponent() {
// 	const [isLoading, setIsLoading] = useState(false);
// 	const [response, setResponse] = useState("");
// 	const [patientFirstName, setPatientFirstName] = useState("");
// 	const [patientLastName, setPatientLastName] = useState("");
// 	// const [patientEmail, setPatientEmail]= useState("");
// 	const [formResults, setFormResults] = useState<any>([]);

// 	const storageItemKey = "patient-form";

// 	function createSurveyPdfModel(surveyModel: SurveyModel) {
// 		const pdfWidth =
// 			!!surveyModel && surveyModel.pdfWidth ? surveyModel.pdfWidth : 210;
// 		const pdfHeight =
// 			!!surveyModel && surveyModel.pdfHeight
// 				? surveyModel.pdfHeight
// 				: 297;
// 		const options = {
// 			fontSize: 10,
// 			margins: {
// 				left: 10,
// 				right: 10,
// 				top: 10,
// 				bot: 10,
// 			},
// 			format: [pdfWidth, pdfHeight],
// 			fontName: "helvetica", // Changed from "Roboto" to "helvetica"
// 			useCustomFontInHtml: false, // Changed to false
// 		};
// 		const surveyPDF = new SurveyPDF(json, options);
// 		if (surveyModel) {
// 			surveyPDF.data = surveyModel.data;
// 		}
// 		return surveyPDF;
// 	}

// 	const handleSubmit = async (pdfData: string) => {
// 		setIsLoading(true);
// 		setResponse("");

// 		try {
// 			const formData = new FormData();
// 			formData.append(
// 				"file",
// 				new Blob([pdfData], { type: "application/pdf" }),
// 				"newpatient.pdf"
// 			);

// 			const res = await fetch("/api/upload-form/route", {
// 				method: "POST",
// 				body: formData,
// 			});

// 			if (!res.ok) {
// 				const errorText = await res.text();
// 				throw new Error(
// 					`HTTP error! status: ${res.status}, body: ${errorText}`
// 				);
// 			}

// 			const data = await res.json();
// 			setResponse(data.message || data.error);
// 			console.log(response);
// 		} catch (error: unknown) {
// 			console.error("Error in handleSubmit:", error);
// 			if (error instanceof Error) {
// 				setResponse(
// 					`An error occurred while sending the PDF: ${error.message}`
// 				);
// 			} else {
// 				setResponse("An unknown error occurred while sending the PDF");
// 			}
// 		}

// 		setIsLoading(false);
// 	};

// 	const handleFormSubmit = async (newpatient: string) => {
// 		setIsLoading(true);
// 		setResponse("");
// 		// console.log("entered: ", patientBlob);

// 		try {
// 			const res = await fetch("/api/newPatient/route", {
// 				method: "POST",
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 				body: JSON.stringify({ newpatient }),
// 			});
// 			const data = await res.json();
// 			setResponse(data.message || data.error);

// 			// console.log("sending patientBlob to api:\n", patientBlob);

// 			// const blobRes = await fetch("/api/upload-form/route", {
// 			// 	method: "POST",
// 			// 	body: JSON.stringify({ newpatient: patientBlob }),
// 			// 	headers: {
// 			// 		"Content-Type": "application/pdf",
// 			// 	},
// 			// });

// 			// console.log("blobRes: ", blobRes);
// 		} catch (error) {
// 			setResponse("An error occurred while sending the email");
// 		}

// 		setIsLoading(false);
// 	};

// 	const model = new Model(json);
// 	model.applyTheme(themeJson);

// 	model.onComplete.add((sender, options) => {
// 		const resultData = [];
// 		for (const key in model.data) {
// 			const question = model.getQuestionByName(key);
// 			if (!!question) {
// 				const item = {
// 					name: key,
// 					value: question.value,
// 					title: question.displayValue,
// 					displayValue: question.displayValue,
// 				};
// 				resultData.push(item);
// 				setFormResults(resultData);
// 			}
// 		}
// 		// console.log("formResults:\n", formResults);

// 		const modelPDF = createSurveyPdfModel(model);
// 		modelPDF.raw("blob").then((pdfData: string) => {
// 			handleSubmit(pdfData);
// 			// handleFormSubmit(pdfData);
// 		});

// 		const firstName = model.getQuestionByName("first_name");
// 		const lastName = model.getQuestionByName("last_name");
// 		// const email = model.getQuestionByName("last_name");

// 		console.log("first name:\n", firstName.value);
// 		console.log("last name:\n", lastName.value);
// 		// Display the "Saving..." message (pass a string value to display a custom message)

// 		const newPatient = JSON.stringify(sender.data, null, 3);
// 		// // handleFormSubmit(newPatient);
// 		// options.showSaveInProgress();
// 		// const xhr = new XMLHttpRequest();
// 		// xhr.open("POST", "/api/newPatient/route");
// 		// xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
// 		// xhr.onload = xhr.onerror = function () {
// 		// 	if (xhr.status == 200) {
// 		// 		// Display the "Success" message (pass a string value to display a custom message)
// 		// 		options.showSaveSuccess("saved");
// 		// 		// Alternatively, you can clear all messages:
// 		// 		// options.clearSaveMessages();
// 		// 	} else {
// 		// 		// Display the "Error" message (pass a string value to display a custom message)
// 		// 		options.showSaveError("error");
// 		// 	}
// 		// };
// 		// xhr.send(JSON.stringify(newPatient));
// 		// // window.localStorage.setItem(storageItemKey, "");
// 	});

// 	function saveFormData(form: SurveyModel) {
// 		const data = form.data;
// 		data.pageNo = form.currentPageNo;
// 		window.localStorage.setItem(storageItemKey, JSON.stringify(data));
// 	}

// 	// Save survey results to the local storage
// 	model.onValueChanged.add(saveFormData);
// 	model.onCurrentPageChanged.add(saveFormData);

// 	// Restore survey results
// 	const prevData = window.localStorage.getItem(storageItemKey) || null;
// 	if (prevData) {
// 		const data = JSON.parse(prevData);
// 		model.data = data;
// 		if (data.pageNo) {
// 			model.currentPageNo = data.pageNo;
// 		}
// 	}

// 	useEffect(() => {
// 		console.log("formResults:\n", formResults);
// 	}, [formResults]);

// 	return (
// 		<>
// 			<Survey model={model} />
// 			<div id="surveyElement"></div>
// 			{isLoading && <p>Loading...</p>}
// 			{/* {response && <p>{response}</p>} */}
// 		</>
// 	);
// }

// "use client";

// import { Model, SurveyModel } from "survey-core";
// import "survey-core/defaultV2.css";
// import { Survey } from "survey-react-ui";
// import { SurveyPDF } from "survey-pdf";
// import { useEffect, useState } from "react";
// import { json, themeJson } from "@/data/llpmg-patient-form";

// export default function SurveyComponent() {
// 	const [isLoading, setIsLoading] = useState(false);
// 	const [response, setResponse] = useState("");
// 	const [patientFirstName, setPatientFirstName] = useState("");
// 	const [patientLastName, setPatientLastName] = useState("");
// 	const [formResults, setFormResults] = useState<any>([]);
// 	const [blobURL, setBlobURL] = useState<string>("");

// 	const storageItemKey = "patient-form";

// 	function createSurveyPdfModel(surveyModel: SurveyModel) {
// 		const pdfWidth =
// 			!!surveyModel && surveyModel.pdfWidth ? surveyModel.pdfWidth : 210;
// 		const pdfHeight =
// 			!!surveyModel && surveyModel.pdfHeight
// 				? surveyModel.pdfHeight
// 				: 297;
// 		const options = {
// 			fontSize: 10,
// 			margins: {
// 				left: 10,
// 				right: 10,
// 				top: 10,
// 				bot: 10,
// 			},
// 			format: [pdfWidth, pdfHeight],
// 			fontName: "helvetica", // Changed from "Roboto" to "helvetica"
// 			useCustomFontInHtml: false, // Changed to false
// 		};
// 		const surveyPDF = new SurveyPDF(json, options);
// 		if (surveyModel) {
// 			surveyPDF.data = surveyModel.data;
// 		}
// 		return surveyPDF;
// 	}

// 	const handleSubmit = async (pdfData: string) => {
// 		setIsLoading(true);
// 		setResponse("");

// 		try {
// 			const formData = new FormData();
// 			formData.append(
// 				"file",
// 				new Blob([pdfData], { type: "application/pdf" }),
// 				"newpatient.pdf"
// 			);

// 			const res = await fetch("/api/upload-form/route", {
// 				method: "POST",
// 				body: formData,
// 			});

// 			if (!res.ok) {
// 				const errorText = await res.text();
// 				throw new Error(
// 					`HTTP error! status: ${res.status}, body: ${errorText}`
// 				);
// 			}

// 			const data = await res.json();
// 			setResponse(data.message || data.error);
// 			console.log(response);
// 		} catch (error: unknown) {
// 			console.error("Error in handleSubmit:", error);
// 			if (error instanceof Error) {
// 				setResponse(
// 					`An error occurred while sending the PDF: ${error.message}`
// 				);
// 			} else {
// 				setResponse("An unknown error occurred while sending the PDF");
// 			}
// 		}

// 		setIsLoading(false);
// 	};

// 	const handleFormSubmit = async (newpatient: string) => {
// 		setIsLoading(true);
// 		setResponse("");

// 		try {
// 			const res = await fetch("/api/newPatient/route", {
// 				method: "POST",
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 				body: JSON.stringify({ newpatient }),
// 			});
// 			const data = await res.json();
// 			setResponse(data.message || data.error);
// 		} catch (error) {
// 			setResponse("An error occurred while sending the email");
// 		}

// 		setIsLoading(false);
// 	};

// 	const model = new Model(json);
// 	model.navigationBar.getActionById("sv-nav-complete").visible = false;

// 	model.addNavigationItem({
// 		id: "survey_pdf_preview",
// 		title: "Preview PDF",
// 		action: previewPdf,
// 	});
// 	model.addNavigationItem({
// 		id: "model_save_as_file",
// 		title: "Save as PDF",
// 		action: () => {
// 			saveSurveyToPdf("modelResult.pdf", model);
// 		},
// 	});
// 	model.addNavigationItem({
// 		id: "patient_registry",
// 		title: "Register",
// 		action: () => {
// 			const pdfOutput = saveSurveyToPdf(
// 				"registration-results.pdf",
// 				model
// 			);
// 			console.log("pdfOutput: ", pdfOutput);
// 		},
// 	});
// 	model.addNavigationItem({
// 		id: "model_save_via_blob",
// 		title: "Save via Blob",
// 		action: savePdfViaRealBlob,
// 	});
// 	model.applyTheme(themeJson);

// 	model.onComplete.add((sender, options) => {
// const newPatient = JSON.stringify(sender.data, null, 3);
// console.log("newPatient:\n", newPatient);
// 		const resultData = [];
// 		for (const key in model.data) {
// 			const question = model.getQuestionByName(key);
// 			if (!!question) {
// 				const item = {
// 					name: key,
// 					value: question.value,
// 					title: question.displayValue,
// 					displayValue: question.displayValue,
// 				};
// 				resultData.push(item);
// 				setFormResults(resultData);
// 			}
// 		}

// 		const modelPDF = createSurveyPdfModel(model);
// 		modelPDF.raw("blob").then((pdfData: string) => {
// 			console.log("pdfData:\n", pdfData);
// 			// handleSubmit(pdfData);
// 		});

// 		const firstName = model.getQuestionByName("first_name");
// 		const lastName = model.getQuestionByName("last_name");

// 		console.log("first name:\n", firstName.value);
// 		console.log("last name:\n", lastName.value);

// 		const newPatient = JSON.stringify(sender.data, null, 3);
// 		// // window.localStorage.setItem(storageItemKey, "");
// 	});
// 	function savePdfViaRealBlob() {
// 		const modelPDF = createSurveyPdfModel(model);
// 		modelPDF.raw("blob").then(function (rawblob) {
// 			console.log("rawblob:\n", rawblob);
// 			setBlobURL(rawblob);
// 			const a = document.createElement("a");
// 			a.href = rawblob;
// 			a.download = "modelViaBlob.pdf";
// 			document.body.appendChild(a);
// 			a.click();
// 		});
// 	}
// 	function saveSurveyToPdf(filename: string, surveyModel: SurveyModel) {
// 		createSurveyPdfModel(surveyModel).save(filename);
// 	}
// 	function saveFormData(form: SurveyModel) {
// 		const data = form.data;
// 		data.pageNo = form.currentPageNo;
// 		window.localStorage.setItem(storageItemKey, JSON.stringify(data));
// 	}

// 	// Save survey results to the local storage
// 	model.onValueChanged.add(saveFormData);
// 	model.onCurrentPageChanged.add(saveFormData);

// 	// Restore survey results
// 	const prevData = window.localStorage.getItem(storageItemKey) || null;
// 	if (prevData) {
// 		const data = JSON.parse(prevData);
// 		model.data = data;
// 		if (data.pageNo) {
// 			model.currentPageNo = data.pageNo;
// 		}
// 	}
// 	function previewPdf() {
// 		const surveyPDF = createSurveyPdfModel(model);
// 		const oldFrame = document.getElementById("pdf-preview-frame");
// 		if (oldFrame && oldFrame.parentNode)
// 			oldFrame.parentNode.removeChild(oldFrame);
// 		surveyPDF.raw().then(function (uint8Array) {
// 			const blob = new Blob([uint8Array], { type: "application/pdf" });
// 			const url = URL.createObjectURL(blob);
// 			const pdfEmbed = document.createElement("embed");
// 			pdfEmbed.setAttribute("id", "pdf-preview-frame");
// 			pdfEmbed.setAttribute("type", "application/pdf");
// 			pdfEmbed.setAttribute("style", "width:100%");
// 			pdfEmbed.setAttribute("height", `${window.innerHeight - 100}`);
// 			pdfEmbed.setAttribute("src", url);
// 			const previewDiv = document.getElementById("pdf-preview");
// 			if (previewDiv) {
// 				previewDiv.appendChild(pdfEmbed);
// 			} else {
// 				const hiddenElements = document.createElement("div");
// 				hiddenElements.setAttribute("style", "display: none;");
// 				hiddenElements.appendChild(pdfEmbed);
// 				document.body.appendChild(hiddenElements);
// 			}
// 		});
// 	}

// 	useEffect(() => {
// 		console.log("formResults:\n", formResults);
// 	}, [formResults]);

// 	return (
// 		<>
// 			<Survey model={model} />
// 			<div id="surveyElement"></div>
// 			{isLoading && <p>Loading...</p>}
// 			{/* {response && <p>{response}</p>} */}
// 			{/* <div id="pdf-preview"></div> */}
// 		</>
// 	);
// }

export default function SurveyComponentBackup() {}
