import React from "react";
// import SurveyPdfComponent from "./SurveyPdfComponent";
import dynamic from "next/dynamic";

const SurveyPdfComponent = dynamic(() => import("./SurveyPdfComponent"), {
	ssr: false,
});

const page = () => {
	return (
		<>
			<div id="pdf-preview"></div>
			<div id="surveyElement"></div>
			<SurveyPdfComponent />
		</>
	);
};

export default page;
