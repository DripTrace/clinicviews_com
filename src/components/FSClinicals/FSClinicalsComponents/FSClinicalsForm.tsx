"use client";

import { fsclinicalsForm, fsclinicalsTheme } from "@/data/fsclinicals-config";
import { useState as useFsclinicalsState } from "react";
import { Model as FSClinicalsModel } from "survey-core";
import "survey-core/defaultV2.css";
import { SurveyPDF as FSClinicalsFormPDF } from "survey-pdf";
import { Survey as FSClinicalsForm } from "survey-react-ui";
// import "survey-core/defaultV2.css";

// import {
// 	fsclinicalsForm,
// 	fsclinicalsTheme,
// } from "../../../data/fsclinicals-config.js";

function createFSClinicalsFormPDFModel(fsclinicalsFormModel: any) {
	const fsclinicalsPdfWidth =
		!!fsclinicalsFormModel && fsclinicalsFormModel.fsclinicalsPdfWidth
			? fsclinicalsFormModel.fsclinicalsPdfWidth
			: 210;
	const fsclinicalsPdfHeight =
		!!fsclinicalsFormModel && fsclinicalsFormModel.fsclinicalsPdfHeight
			? fsclinicalsFormModel.fsclinicalsPdfHeight
			: 297;
	const fsclinicalsOptions = {
		fontSize: 8,
		margins: {
			left: 10,
			right: 10,
			top: 10,
			bot: 10,
		},
		format: [fsclinicalsPdfWidth, fsclinicalsPdfHeight],
		fontName: "Roboto",
		useCustomFontInHtml: true,
	};
	const fsclinicalsFormPDF = new FSClinicalsFormPDF(
		fsclinicalsForm,
		fsclinicalsOptions
	);
	if (fsclinicalsFormModel) {
		fsclinicalsFormPDF.data = fsclinicalsFormModel.data;
	}

	return fsclinicalsFormPDF;
}
function saveFsclinicalsFormToPdf(
	fsclinicalsFilename: string,
	fsclinicalsFormModel: any
) {
	createFSClinicalsFormPDFModel(fsclinicalsFormModel).save(
		fsclinicalsFilename
	);
}

export default function FSClinicalsFormComponent() {
	const [fsclinicalsEmail, setFsclinicalsEmail] = useFsclinicalsState("");
	const [fsclinicalsFullname, setFsclinicalsFullname] =
		useFsclinicalsState("");
	const [fsclinicalsSubject, setFsclinicalsSubject] = useFsclinicalsState("");
	const [fsclinicalsMessage, setFsclinicalsMessage] = useFsclinicalsState("");
	const [isFsclinicalsLoading, setFsclinicalsIsLoading] =
		useFsclinicalsState(false);
	const [fsclinicalsResponse, setFsclinicalsResponse] =
		useFsclinicalsState("");

	const handleFSClinicalsSubmit = async (newFsclinicalsPatient: string) => {
		setFsclinicalsIsLoading(true);
		setFsclinicalsResponse("");
		console.log("fsclinicals patient entered: ", newFsclinicalsPatient);

		try {
			const fsclinicalsRes = await fetch(
				"/api/fsclinicals-test/new-fsclinicals-patient/route",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ newFsclinicalsPatient }),
				}
			);

			const fsclinicalsData = await fsclinicalsRes.json();
			setFsclinicalsResponse(
				fsclinicalsData.message || fsclinicalsData.error
			);
		} catch (error) {
			setFsclinicalsResponse(
				"An error occurred while sending the FSClinicals email"
			);
		}

		setFsclinicalsIsLoading(false);
	};

	const fsclinicalsModel = new FSClinicalsModel(fsclinicalsForm);
	// @ts-expect-error theme is not a valid property
	fsclinicalsModel.applyTheme(fsclinicalsTheme);
	fsclinicalsModel.addNavigationItem({
		id: "fsclinicals_patient_registry",
		title: "FSClinicals Patient Register",
		action: () => {
			saveFsclinicalsFormToPdf(
				"fsclinicals-registration-results.pdf",
				fsclinicalsModel
			);
		},
	});
	fsclinicalsModel.onComplete.add((fsclinicalsSender, fsclinicalsOptions) => {
		const newFsclinicalsPatient = JSON.stringify(
			fsclinicalsSender.data,
			null,
			3
		);
		handleFSClinicalsSubmit(newFsclinicalsPatient);
		console.log(newFsclinicalsPatient);
	});

	return <FSClinicalsForm model={fsclinicalsModel} />;
}
