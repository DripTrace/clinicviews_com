"use client";

import { useRouter } from "next/navigation";
import { Model, SurveyModel } from "survey-core";
import "survey-core/defaultV2.css";
import { Survey } from "survey-react-ui";
import { SurveyPDF } from "survey-pdf";
import { useState, useEffect } from "react";
import { fsclinicalsForm, fsclinicalsTheme } from "@/data/fsclinicals-config";
import { useDomainSelector } from "@/store/domainHooks";
{
    useDomainSelector;
}

export default function FSClinicalsFormComponent() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState("");
    const [formResults, setFormResults] = useState<any>({});
    const [pdfData, setPdfData] = useState<string>("");

    const storageItemKey = "fsclinicals-patient-form";

    function createSurveyPdfModel(surveyModel: SurveyModel) {
        const pdfWidth = 210;
        const pdfHeight = 297;
        const options = {
            fontSize: 10,
            margins: {
                left: 10,
                right: 10,
                top: 10,
                bot: 10,
            },
            format: [pdfWidth, pdfHeight],
            fontName: "helvetica",
            useCustomFontInHtml: false,
        };
        const surveyPDF = new SurveyPDF(fsclinicalsForm, options);
        if (surveyModel) {
            surveyPDF.data = surveyModel.data;
        }
        return surveyPDF;
    }

    const handleSubmit = async () => {
        setIsLoading(true);
        setResponse("");

        try {
            const formData = new FormData();
            formData.append(
                "file",
                new Blob([pdfData], { type: "application/pdf" }),
                "fsclinicals-newpatient.pdf"
            );

            // Add additional form fields
            formData.append(
                "patientName",
                `${formResults["first-name"]} ${formResults["last-name"]}`
            );
            formData.append("email", formResults["email"]);
            formData.append("phone", formResults["phone-home"]);
            formData.append("reason", formResults["reason"]);
            formData.append(
                "suggestAppointment",
                String(formResults["suggestAppointment"])
            );
            formData.append("appointmentDate", formResults["appointmentDate"]);
            formData.append("appointmentTime", formResults["appointmentTime"]);
            // formData.append("domainContext", domainFormContext);

            console.log("Sending form data: ", formData);

            const res = await fetch("/api/register-fsclinicals-patient/route", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.log("res:\n", res);
                throw new Error(
                    `HTTP error! status: ${res.status}, body: ${errorText}`
                );
            } else {
                console.log("res\n", res);
            }

            const data = await res.json();
            setResponse(data.message || data.error);
        } catch (error: unknown) {
            console.error("Error in handleSubmit:", error);
            if (error instanceof Error) {
                setResponse(
                    `An error occurred while sending the form: ${error.message}`
                );
            } else {
                setResponse("An unknown error occurred while sending the form");
            }
        }

        setIsLoading(false);
        router.push("https://fsclinicals.com");
    };

    const model = new Model(fsclinicalsForm);
    model.navigationBar.getActionById("sv-nav-complete").visible = false;
    // model.addNavigationItem({
    //     id: "survey_pdf_preview",
    //     title: "Preview PDF",
    //     action: previewPdf,
    // });
    // model.addNavigationItem({
    //     id: "model_save_as_file",
    //     title: "Save as PDF",
    //     action: () => {
    //         saveSurveyToPdf("modelResult.pdf", model);
    //     },
    // });
    // model.addNavigationItem({
    //     id: "patient_registry",
    //     title: "Register",
    //     action: () => {
    //         const pdfOutput = saveSurveyToPdf(
    //             "registration-results.pdf",
    //             model
    //         );
    //         console.log("pdfOutput: ", pdfOutput);
    //     },
    // });
    // model.addNavigationItem({
    //     id: "model_save_via_blob",
    //     title: "Save via Blob",
    //     action: savePdfViaRealBlob,
    // });
    model.applyTheme(fsclinicalsTheme);

    model.onComplete.add((sender, options) => {
        const resultData: any = {};
        for (const key in sender.data) {
            const question = sender.getQuestionByName(key);
            if (question) {
                resultData[key] = question.value;
            }
        }
        setFormResults(resultData);

        const modelPDF = createSurveyPdfModel(model);
        modelPDF.raw("blob").then((pdfData: string) => {
            setPdfData(pdfData);
        });

        window.localStorage.setItem(storageItemKey, "");
    });

    useEffect(() => {
        console.log("formResults:\n", formResults);

        if (Object.keys(formResults).length !== 0 && pdfData) {
            handleSubmit();
            console.log("Submitting form with updated data:\n", formResults);
        }
    }, [formResults, pdfData]);

    function saveFormData(form: SurveyModel) {
        const data = form.data;
        data.pageNo = form.currentPageNo;
        window.localStorage.setItem(storageItemKey, JSON.stringify(data));
    }

    model.onValueChanged.add(saveFormData);
    model.onCurrentPageChanged.add(saveFormData);

    const prevData = window.localStorage.getItem(storageItemKey) || null;
    if (prevData) {
        const data = JSON.parse(prevData);
        model.data = data;
        if (data.pageNo) {
            model.currentPageNo = data.pageNo;
        }
    }

    function previewPdf() {
        const surveyPDF = createSurveyPdfModel(model);
        const oldFrame = document.getElementById("pdf-preview-frame");
        if (oldFrame && oldFrame.parentNode)
            oldFrame.parentNode.removeChild(oldFrame);
        surveyPDF.raw().then(function (uint8Array) {
            const blob = new Blob([uint8Array], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const pdfEmbed = document.createElement("embed");
            pdfEmbed.setAttribute("id", "pdf-preview-frame");
            pdfEmbed.setAttribute("type", "application/pdf");
            pdfEmbed.setAttribute("style", "width:100%");
            pdfEmbed.setAttribute("height", `${window.innerHeight - 100}`);
            pdfEmbed.setAttribute("src", url);
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

    function savePdfViaRealBlob() {
        const modelPDF = createSurveyPdfModel(model);
        modelPDF.raw("blob").then(function (rawblob) {
            console.log("rawblob:\n", rawblob);
            const a = document.createElement("a");
            a.href = rawblob;
            a.download = "modelViaBlob.pdf";
            document.body.appendChild(a);
            a.click();
        });
    }

    function saveSurveyToPdf(filename: string, surveyModel: SurveyModel) {
        createSurveyPdfModel(surveyModel).save(filename);
    }

    // useEffect(() => {
    //     setDomainFormContext(retrievedDomainContext);
    //     console.log("retrievedDomainContext: ", domainFormContext);
    // }, [retrievedDomainContext]);

    return (
        <>
            <Survey model={model} />
            <div id="surveyElement"></div>
            {isLoading && <p>Processing your registration...</p>}
            {response && <p>{response}</p>}
            {/* <div id="pdf-preview"></div> */}
        </>
    );
}
