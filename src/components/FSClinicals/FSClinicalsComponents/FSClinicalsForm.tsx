//phone
// "use client";

// import { useRouter } from "next/navigation";
// import { Model, SurveyModel } from "survey-core";
// import "survey-core/defaultV2.css";
// import { Survey } from "survey-react-ui";
// import { SurveyPDF } from "survey-pdf";
// import { useState, useEffect } from "react";
// import { fsclinicalsForm, fsclinicalsTheme } from "@/data/fsclinicals-config";

// export default function FSClinicalsFormComponent() {
//     const router = useRouter();

//     const [isLoading, setIsLoading] = useState(false);
//     const [response, setResponse] = useState("");
//     const [formResults, setFormResults] = useState<any>({});
//     const [patientName, setPatientName] = useState<string>("");
//     const [email, setEmail] = useState<string>("");

//     const storageItemKey = "fsclinicals-patient-form";

//     function createSurveyPdfModel(surveyModel: SurveyModel) {
//         const pdfWidth = 210;
//         const pdfHeight = 297;
//         const options = {
//             fontSize: 10,
//             margins: {
//                 left: 10,
//                 right: 10,
//                 top: 10,
//                 bot: 10,
//             },
//             format: [pdfWidth, pdfHeight],
//             fontName: "helvetica",
//             useCustomFontInHtml: false,
//         };
//         const surveyPDF = new SurveyPDF(fsclinicalsForm, options);
//         if (surveyModel) {
//             surveyPDF.data = surveyModel.data;
//         }
//         return surveyPDF;
//     }

//     const handleSubmit = async (pdfData: string) => {
//         setIsLoading(true);
//         setResponse("");

//         if (!patientName.trim() || !email.trim()) {
//             setResponse("Patient name and email are required");
//             setIsLoading(false);
//             return;
//         }

//         try {
//             const formData = new FormData();
//             formData.append(
//                 "file",
//                 new Blob([pdfData], { type: "application/pdf" }),
//                 "fsclinicals-newpatient.pdf"
//             );

//             // Add additional form fields
//             formData.append("patientName", patientName);
//             formData.append("email", email);
//             formData.append("phone", formResults["phone-home"]);
//             formData.append("reason", formResults.reason);
//             formData.append(
//                 "suggestAppointment",
//                 formResults.suggestAppointment.toString()
//             );
//             formData.append("appointmentDate", formResults.appointmentDate);
//             formData.append("appointmentTime", formResults.appointmentTime);

//             const res = await fetch("/api/register-fsclinicals-patient/route", {
//                 method: "POST",
//                 body: formData,
//             });

//             if (!res.ok) {
//                 const errorText = await res.text();
//                 throw new Error(
//                     `HTTP error! status: ${res.status}, body: ${errorText}`
//                 );
//             } else {
//                 console.log("res.ok: ", res.ok);
//                 router.push("https://fsclinicals.com");
//             }

//             const data = await res.json();
//             setResponse(data.message || data.error);
//         } catch (error: unknown) {
//             console.error("Error in handleSubmit:", error);
//             if (error instanceof Error) {
//                 setResponse(
//                     `An error occurred while sending the form: ${error.message}`
//                 );
//             } else {
//                 setResponse("An unknown error occurred while sending the form");
//             }
//         }

//         setIsLoading(false);
//     };

//     const model = new Model(fsclinicalsForm);
//     model.applyTheme(fsclinicalsTheme);

//     model.onComplete.add((sender, options) => {
//         const resultData: any = {};
//         for (const key in sender.data) {
//             const question = sender.getQuestionByName(key);
//             if (question) {
//                 resultData[key] = question.value;
//             }
//         }
//         console.log("resultData:", resultData);

//         const firstName = resultData["first-name"];
//         const lastName = resultData["last-name"];
//         setPatientName(`${firstName} ${lastName}`);
//         setEmail(resultData.email);

//         setFormResults(resultData);

//         const modelPDF = createSurveyPdfModel(model);
//         modelPDF.raw().then((pdfData: string) => {
//             handleSubmit(pdfData);
//         });

//         window.localStorage.setItem(storageItemKey, "");
//     });

//     function saveFormData(form: SurveyModel) {
//         const data = form.data;
//         data.pageNo = form.currentPageNo;
//         window.localStorage.setItem(storageItemKey, JSON.stringify(data));
//     }

//     model.onValueChanged.add(saveFormData);
//     model.onCurrentPageChanged.add(saveFormData);

//     const prevData = window.localStorage.getItem(storageItemKey) || null;
//     if (prevData) {
//         const data = JSON.parse(prevData);
//         model.data = data;
//         if (data.pageNo) {
//             model.currentPageNo = data.pageNo;
//         }
//     }

//     useEffect(() => {
//         console.log("formResults:\n", formResults);
//         console.log("Patient Name:\n", patientName);
//         console.log("Email:\n", email);
//     }, [formResults, patientName, email]);

//     return (
//         <>
//             <Survey model={model} />
//             <div id="surveyElement"></div>
//             {isLoading && <p>Processing your registration...</p>}
//             {response && <p>{response}</p>}
//         </>
//     );
// }

//sending all
// "use client";

// import { useRouter } from "next/navigation";
// import { Model, SurveyModel } from "survey-core";
// import "survey-core/defaultV2.css";
// import { Survey } from "survey-react-ui";
// import { SurveyPDF } from "survey-pdf";
// import { useState, useEffect } from "react";
// import { fsclinicalsForm, fsclinicalsTheme } from "@/data/fsclinicals-config";

// export default function FSClinicalsFormComponent() {
//     const router = useRouter();

//     const [isLoading, setIsLoading] = useState(false);
//     const [response, setResponse] = useState("");
//     const [formResults, setFormResults] = useState<any>({});
//     const [patientName, setPatientName] = useState<string>("");
//     const [email, setEmail] = useState<string>("");

//     const storageItemKey = "fsclinicals-patient-form";

//     function createSurveyPdfModel(surveyModel: SurveyModel) {
//         const pdfWidth = 210;
//         const pdfHeight = 297;
//         const options = {
//             fontSize: 10,
//             margins: {
//                 left: 10,
//                 right: 10,
//                 top: 10,
//                 bot: 10,
//             },
//             format: [pdfWidth, pdfHeight],
//             fontName: "helvetica",
//             useCustomFontInHtml: false,
//         };
//         const surveyPDF = new SurveyPDF(fsclinicalsForm, options);
//         if (surveyModel) {
//             surveyPDF.data = surveyModel.data;
//         }
//         return surveyPDF;
//     }

//     const handleSubmit = async (pdfData: string) => {
//         setIsLoading(true);
//         setResponse("");

//         console.log("Patient Name in handleSubmit:", patientName);
//         console.log("Email in handleSubmit:", email);

//         if (!patientName.trim() || !email.trim()) {
//             setResponse("Patient name and email are required");
//             setIsLoading(false);
//             return;
//         }

//         try {
//             const formData = new FormData();
//             formData.append(
//                 "file",
//                 new Blob([pdfData], { type: "application/pdf" }),
//                 "fsclinicals-newpatient.pdf"
//             );

//             // Add additional form fields
//             formData.append("patientName", patientName);
//             formData.append("email", email);
//             formData.append("phone", formResults["phone-home"]);
//             formData.append("reason", formResults.reason);
//             formData.append(
//                 "suggestAppointment",
//                 formResults.suggestAppointment.toString()
//             );
//             formData.append("appointmentDate", formResults.appointmentDate);
//             formData.append("appointmentTime", formResults.appointmentTime);

//             console.log(
//                 "Form Data to be sent:",
//                 Object.fromEntries(formData.entries())
//             );

//             const res = await fetch("/api/register-fsclinicals-patient/route", {
//                 method: "POST",
//                 body: formData,
//             });

//             if (!res.ok) {
//                 const errorText = await res.text();
//                 throw new Error(
//                     `HTTP error! status: ${res.status}, body: ${errorText}`
//                 );
//             } else {
//                 console.log("res.ok: ", res.ok);
//                 router.push("https://fsclinicals.com");
//             }

//             const data = await res.json();
//             setResponse(data.message || data.error);
//         } catch (error: unknown) {
//             console.error("Error in handleSubmit:", error);
//             if (error instanceof Error) {
//                 setResponse(
//                     `An error occurred while sending the form: ${error.message}`
//                 );
//             } else {
//                 setResponse("An unknown error occurred while sending the form");
//             }
//         }

//         setIsLoading(false);
//     };

//     const model = new Model(fsclinicalsForm);
//     model.applyTheme(fsclinicalsTheme);

//     model.onComplete.add((sender, options) => {
//         const resultData: any = {};
//         for (const key in sender.data) {
//             const question = sender.getQuestionByName(key);
//             if (question) {
//                 resultData[key] = question.value;
//             }
//         }
//         console.log("resultData:", resultData);

//         const firstName = resultData["first-name"];
//         const lastName = resultData["last-name"];
//         console.log("First Name:", firstName);
//         console.log("Last Name:", lastName);

//         if (firstName && lastName) {
//             setPatientName(`${firstName} ${lastName}`);
//         }

//         setEmail(resultData.email);
//         setFormResults(resultData);

//         const modelPDF = createSurveyPdfModel(model);
//         modelPDF.raw().then((pdfData: string) => {
//             handleSubmit(pdfData);
//         });

//         window.localStorage.setItem(storageItemKey, "");
//     });

//     function saveFormData(form: SurveyModel) {
//         const data = form.data;
//         data.pageNo = form.currentPageNo;
//         window.localStorage.setItem(storageItemKey, JSON.stringify(data));
//     }

//     model.onValueChanged.add(saveFormData);
//     model.onCurrentPageChanged.add(saveFormData);

//     const prevData = window.localStorage.getItem(storageItemKey) || null;
//     if (prevData) {
//         const data = JSON.parse(prevData);
//         model.data = data;
//         if (data.pageNo) {
//             model.currentPageNo = data.pageNo;
//         }
//     }

//     useEffect(() => {
//         console.log("formResults:\n", formResults);
//         console.log("Patient Name:\n", patientName);
//         console.log("Email:\n", email);
//     }, [formResults, patientName, email]);

//     return (
//         <>
//             <Survey model={model} />
//             <div id="surveyElement"></div>
//             {isLoading && <p>Processing your registration...</p>}
//             {response && <p>{response}</p>}
//         </>
//     );
// }

// "use client";

// import { useRouter } from "next/navigation";
// import { Model, SurveyModel } from "survey-core";
// import "survey-core/defaultV2.css";
// import { Survey } from "survey-react-ui";
// import { SurveyPDF } from "survey-pdf";
// import { useState, useEffect } from "react";
// import { fsclinicalsForm, fsclinicalsTheme } from "@/data/fsclinicals-config";

// export default function FSClinicalsFormComponent() {
//     const router = useRouter();

//     const [isLoading, setIsLoading] = useState(false);
//     const [response, setResponse] = useState("");
//     const [formResults, setFormResults] = useState<any>([]);

//     const storageItemKey = "fsclinicals-patient-form";

//     function createSurveyPdfModel(surveyModel: SurveyModel) {
//         const pdfWidth = 210;
//         const pdfHeight = 297;
//         const options = {
//             fontSize: 10,
//             margins: {
//                 left: 10,
//                 right: 10,
//                 top: 10,
//                 bot: 10,
//             },
//             format: [pdfWidth, pdfHeight],
//             fontName: "helvetica",
//             useCustomFontInHtml: false,
//         };
//         const surveyPDF = new SurveyPDF(fsclinicalsForm, options);
//         if (surveyModel) {
//             surveyPDF.data = surveyModel.data;
//         }
//         return surveyPDF;
//     }

//     const handleSubmit = async (pdfData: string) => {
//         setIsLoading(true);
//         setResponse("");

//         try {
//             const formData = new FormData();
//             formData.append(
//                 "file",
//                 new Blob([pdfData], { type: "application/pdf" }),
//                 "fsclinicals-newpatient.pdf"
//             );

//             // Add additional form fields
//             formData.append(
//                 "patientName",
//                 `${formResults["first-name"]} ${formResults["last-name"]}`
//             );
//             formData.append("email", formResults["email"]);
//             formData.append("phone", formResults["phone-home"]);
//             formData.append("reason", formResults["reason"]);
//             formData.append(
//                 "suggestAppointment",
//                 formResults["suggestAppointment"]
//             );
//             formData.append("appointmentDate", formResults["appointmentDate"]);
//             formData.append("appointmentTime", formResults["appointmentTime"]);

//             console.log("Sending form data: ", formData);

//             const res = await fetch("/api/register-fsclinicals-patient/route", {
//                 method: "POST",
//                 body: formData,
//             });

//             if (!res.ok) {
//                 const errorText = await res.text();
//                 throw new Error(
//                     `HTTP error! status: ${res.status}, body: ${errorText}`
//                 );
//             } else {
//                 console.log("res.ok: ", res.ok);
//                 router.push("https://fsclinicals.com");
//             }

//             const data = await res.json();
//             setResponse(data.message || data.error);
//         } catch (error: unknown) {
//             console.error("Error in handleSubmit:", error);
//             if (error instanceof Error) {
//                 setResponse(
//                     `An error occurred while sending the form: ${error.message}`
//                 );
//             } else {
//                 setResponse("An unknown error occurred while sending the form");
//             }
//         }

//         setIsLoading(false);
//     };

//     const model = new Model(fsclinicalsForm);
//     model.applyTheme(fsclinicalsTheme);

//     model.onComplete.add((sender, options) => {
//         const resultData: any = {};
//         for (const key in sender.data) {
//             const question = sender.getQuestionByName(key);
//             if (question) {
//                 resultData[key] = question.value;
//             }
//         }
//         setFormResults(resultData);

//         const modelPDF = createSurveyPdfModel(model);
//         modelPDF.raw().then((pdfData: string) => {
//             handleSubmit(pdfData);
//         });

//         window.localStorage.setItem(storageItemKey, "");
//     });

//     function saveFormData(form: SurveyModel) {
//         const data = form.data;
//         data.pageNo = form.currentPageNo;
//         window.localStorage.setItem(storageItemKey, JSON.stringify(data));
//     }

//     model.onValueChanged.add(saveFormData);
//     model.onCurrentPageChanged.add(saveFormData);

//     const prevData = window.localStorage.getItem(storageItemKey) || null;
//     if (prevData) {
//         const data = JSON.parse(prevData);
//         model.data = data;
//         if (data.pageNo) {
//             model.currentPageNo = data.pageNo;
//         }
//     }

//     useEffect(() => {
//         console.log("formResults:\n", formResults);
//     }, [formResults]);

//     return (
//         <>
//             <Survey model={model} />
//             <div id="surveyElement"></div>
//             {isLoading && <p>Processing your registration...</p>}
//             {response && <p>{response}</p>}
//         </>
//     );
// }

"use client";

import { useRouter } from "next/navigation";
import { Model, SurveyModel } from "survey-core";
import "survey-core/defaultV2.css";
import { Survey } from "survey-react-ui";
import { SurveyPDF } from "survey-pdf";
import { useState, useEffect } from "react";
import { fsclinicalsForm, fsclinicalsTheme } from "@/data/fsclinicals-config";

export default function FSClinicalsFormComponent() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState("");
    const [formResults, setFormResults] = useState<any>([]);

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

    const handleSubmit = async (pdfData: string) => {
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

            console.log("Sending form data: ", formData);

            const res = await fetch("/api/register-fsclinicals-patient/route", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(
                    `HTTP error! status: ${res.status}, body: ${errorText}`
                );
            } else {
                console.log("res.ok: ", res.ok);
                router.push("https://fsclinicals.com");
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
    };

    const model = new Model(fsclinicalsForm);
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
        modelPDF.raw().then((pdfData: string) => {
            handleSubmit(pdfData);
        });

        window.localStorage.setItem(storageItemKey, "");
    });

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

    useEffect(() => {
        console.log("formResults:\n", formResults);
    }, [formResults]);

    return (
        <>
            <Survey model={model} />
            <div id="surveyElement"></div>
            {isLoading && <p>Processing your registration...</p>}
            {response && <p>{response}</p>}
        </>
    );
}
