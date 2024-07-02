// "use client";

// import React from "react";
// import { Model, SurveyModel } from "survey-core";
// import { SurveyPDF } from "survey-pdf";
// import { Survey } from "survey-react-ui";
// import "survey-core/defaultV2.min.css";
// // import "./index.css";
// import { json } from "./json";

// function createSurveyPdfModel(surveyModel: SurveyModel) {
// 	const pdfWidth =
// 		!!surveyModel && surveyModel.pdfWidth ? surveyModel.pdfWidth : 210;
// 	const pdfHeight =
// 		!!surveyModel && surveyModel.pdfHeight ? surveyModel.pdfHeight : 297;
// 	const options = {
// 		fontSize: 14,
// 		margins: {
// 			left: 10,
// 			right: 10,
// 			top: 10,
// 			bot: 10,
// 		},
// 		format: [pdfWidth, pdfHeight],
// 	};
// 	const surveyPDF = new SurveyPDF(json, options);
// 	if (surveyModel) {
// 		surveyPDF.data = surveyModel.data;
// 	}

// 	return surveyPDF;
// }
// function saveSurveyToPdf(filename: string, surveyModel: SurveyModel) {
// 	createSurveyPdfModel(surveyModel).save(filename);
// }
// function SurveyPdfComponent() {
// 	const survey = new Model(json);
// 	survey.addNavigationItem({
// 		id: "survey_save_as_file",
// 		title: "Save as PDF",
// 		action: () => {
// 			saveSurveyToPdf("surveyResult.pdf", survey);
// 		},
// 	});
// 	function savePdfViaBlob() {
// 		const surveyPDF = createSurveyPdfModel(survey);
// 		surveyPDF.raw("bloburl").then(function (bloburl) {
// 			const a = document.createElement("a");
// 			a.href = bloburl;
// 			a.download = "surveyViaBlob.pdf";
// 			document.body.appendChild(a);
// 			a.click();
// 		});
// 	}
// 	function previewPdf() {
// 		const surveyPDF = createSurveyPdfModel(survey);
// 		const oldFrame = document.getElementById("pdf-preview-frame");
// 		if (oldFrame && oldFrame.parentNode)
// 			oldFrame.parentNode.removeChild(oldFrame);
// 		surveyPDF.raw("dataurlstring").then(function (dataurl) {
// 			const pdfEmbed = document.createElement("embed");
// 			pdfEmbed.setAttribute("id", "pdf-preview-frame");
// 			pdfEmbed.setAttribute("type", "application/pdf");
// 			pdfEmbed.setAttribute("style", "width:100%");
// 			pdfEmbed.setAttribute("height", "200"); // Convert the height value to a string
// 			const previewDiv = document.getElementById("pdf-preview");
// 			if (previewDiv) previewDiv.appendChild(pdfEmbed); // Check if previewDiv exists before appending pdfEmbed
// 		});
// 	}
// 	survey.navigationBar.getActionById("sv-nav-complete").visible = false;
// 	survey.addNavigationItem({
// 		id: "survey_save_via_blob",
// 		title: "Save via Blob",
// 		action: savePdfViaBlob,
// 	});
// 	survey.addNavigationItem({
// 		id: "survey_pdf_preview",
// 		title: "Preview PDF",
// 		action: previewPdf,
// 	});
// 	return <Survey model={survey} />;
// }

// export default SurveyPdfComponent;

"use client";

import React from "react";
import { Model, SurveyModel } from "survey-core";
import { SurveyPDF } from "survey-pdf";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
// import "./index.css";
import { json } from "./json";

function createSurveyPdfModel(surveyModel: SurveyModel) {
	const pdfWidth =
		!!surveyModel && surveyModel.pdfWidth ? surveyModel.pdfWidth : 210;
	const pdfHeight =
		!!surveyModel && surveyModel.pdfHeight ? surveyModel.pdfHeight : 297;
	const options = {
		fontSize: 14,
		margins: {
			left: 10,
			right: 10,
			top: 10,
			bot: 10,
		},
		format: [pdfWidth, pdfHeight],
	};
	const surveyPDF = new SurveyPDF(json, options);
	if (surveyModel) {
		surveyPDF.data = surveyModel.data;
	}

	return surveyPDF;
}
function saveSurveyToPdf(filename: string, surveyModel: SurveyModel) {
	createSurveyPdfModel(surveyModel).save(filename);
}
function SurveyPdfComponent() {
	const survey = new Model(json);
	survey.addNavigationItem({
		id: "survey_save_as_file",
		title: "Save as PDF",
		action: () => {
			saveSurveyToPdf("surveyResult.pdf", survey);
		},
	});
	function savePdfViaBlob() {
		const surveyPDF = createSurveyPdfModel(survey);
		surveyPDF.raw("bloburl").then(function (bloburl) {
			const a = document.createElement("a");
			a.href = bloburl;
			a.download = "surveyViaBlob.pdf";
			document.body.appendChild(a);
			a.click();
		});
	}
	function previewPdf() {
		const surveyPDF = createSurveyPdfModel(survey);
		const oldFrame = document.getElementById("pdf-preview-frame");
		if (oldFrame && oldFrame.parentNode)
			oldFrame.parentNode.removeChild(oldFrame);
		surveyPDF.raw("dataurlstring").then(function (dataurl) {
			const pdfEmbed = document.createElement("embed");
			pdfEmbed.setAttribute("id", "pdf-preview-frame");
			pdfEmbed.setAttribute("type", "application/pdf");
			pdfEmbed.setAttribute("style", "width:100%");
			pdfEmbed.setAttribute("height", `${window.innerHeight - 100}`);
			// pdfEmbed.setAttribute("height", "100%");
			pdfEmbed.setAttribute("src", dataurl);
			const previewDiv = document.getElementById("pdf-preview");
			if (previewDiv) {
				previewDiv.appendChild(pdfEmbed);
			} else {
				const hiddenElements = document.createElement("div");
				hiddenElements.setAttribute("style", "display: none;");
				hiddenElements.appendChild(pdfEmbed);
				document.body.appendChild(hiddenElements);
			}
		});
	}
	survey.navigationBar.getActionById("sv-nav-complete").visible = false;
	survey.addNavigationItem({
		id: "survey_save_via_blob",
		title: "Save via Blob",
		action: savePdfViaBlob,
	});
	survey.addNavigationItem({
		id: "survey_pdf_preview",
		title: "Preview PDF",
		action: previewPdf,
	});
	return <Survey model={survey} />;
}

export default SurveyPdfComponent;
