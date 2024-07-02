// verify-import.js

(async () => {
	try {
		const surveyCore = await import("survey-creator-core");
		console.log("Imported module:", surveyCore);
		const SurveyCreator =
			surveyCore.SurveyCreator || surveyCore.default?.SurveyCreator;
		console.log("SurveyCreator:", SurveyCreator);
	} catch (error) {
		console.error("Error loading SurveyCreator:", error);
	}
})();
