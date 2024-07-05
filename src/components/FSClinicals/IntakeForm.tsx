// import { Model as FSClinicalsModel } from "survey-core";
// import { Survey as FSClinicalsForm } from "survey-react-ui";
// import { SurveyPDF as FSClinicalsFormPDF } from "survey-pdf";
// import { useSelector } from 'react-redux';
// import { useState, useEffect } from 'react';
// import { FSClinicalsRootState } from '@/store/fsclinicalsStore';
// import "survey-core/defaultV2.css";

// const fsclinicalsForm = {
//   title: "FSClinicals Patient Registration",
//   pages: [
//     {
//       name: "personal_info",
//       title: "Personal Information",
//       elements: [
//         {
//           type: "text",
//           name: "name",
//           title: "Full Name",
//           isRequired: true
//         },
//         {
//           type: "text",
//           name: "email",
//           title: "Email",
//           isRequired: true,
//           validators: [{ type: "email" }]
//         },
//         {
//           type: "text",
//           name: "phone",
//           title: "Phone",
//           isRequired: true
//         },
//         {
//           type: "comment",
//           name: "reason",
//           title: "Reason for Visit",
//           isRequired: true
//         }
//       ]
//     },
//     // ... (other existing pages from fsclinicalsForm)
//     {
//       name: "appointment",
//       title: "Appointment Suggestion",
//       elements: [
//         {
//           type: "boolean",
//           name: "suggestAppointment",
//           title: "Would you like to suggest an appointment?",
//           isRequired: true
//         },
//         {
//           type: "text",
//           name: "appointmentDate",
//           title: "Preferred Date",
//           inputType: "date",
//           visibleIf: "{suggestAppointment} = true"
//         },
//         {
//           type: "text",
//           name: "appointmentTime",
//           title: "Preferred Time",
//           inputType: "time",
//           visibleIf: "{suggestAppointment} = true"
//         }
//       ]
//     },
//     {
//       name: "consent",
//       title: "Consent",
//       elements: [
//         {
//           type: "html",
//           name: "consentText",
//           html: "<p>AUTHORIZATION TO PAY INSURANCE BENEFITS/CONSENT FOR TREATMENT<br>If required, I hereby authorize payment directly to Four Square Clinicals and the provider responsible for my care. I understand that I am financially responsible to Four Square Clinicals for all fees incurred and for fees not covered by this authorization. I authorize the release of my medical information to my third-party payor in order to obtain payment. I hereby authorize Four Square Clinicals to release any medical information required for my examination or treatment. I understand that payment is expected at rendering of services unless other arrangements have been made. I hereby also consent to medical treatment for my present condition or injury, and for any illness or injury incurred at any time after the date noted below. I have completed this form fully and completely and certify that I am the patient or duly authorized general agent of the patient, authorized to furnish the information requested. I understand that even if I have some type of insurance coverage, I am responsible for payment of services.</p>"
//         },
//         {
//           type: "boolean",
//           name: "consentAgree",
//           title: "I agree to the above terms",
//           isRequired: true
//         }
//       ]
//     }
//   ]
// };

// function createFSClinicalsFormPDFModel(fsclinicalsFormModel) {
//   // ... (existing PDF creation logic)
// }

// export default function FSClinicalsFormComponent() {
//   const isDarkMode = useSelector((state: FSClinicalsRootState) => state.theme.fsclinicalsIsDarkMode);
//   const [isLoading, setIsLoading] = useState(false);
//   const [response, setResponse] = useState("");

//   const handleSubmit = async (sender) => {
//     setIsLoading(true);
//     setResponse("");

//     const formData = sender.data;
//     const pdfModel = createFSClinicalsFormPDFModel(sender);
    
//     try {
//       const pdfBlob = await pdfModel.raw("blob");
      
//       const res = await fetch("/api/register-fsclinicals-patient/route", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: formData.name,
//           email: formData.email,
//           phone: formData.phone,
//           reason: formData.reason,
//           suggestAppointment: formData.suggestAppointment,
//           appointmentDate: formData.appointmentDate,
//           appointmentTime: formData.appointmentTime,
//           pdfBase64: await blobToBase64(pdfBlob)
//         }),
//       });

//       const data = await res.json();
//       setResponse(data.message || data.error);
//     } catch (error) {
//       setResponse("An error occurred while processing your registration");
//     }

//     setIsLoading(false);
//   };

//   const fsclinicalsModel = new FSClinicalsModel(fsclinicalsForm);
//   fsclinicalsModel.applyTheme(fsclinicalsTheme);
//   fsclinicalsModel.onComplete.add(handleSubmit);

//   return (
//     <div className={isDarkMode ? 'dark' : ''}>
//       <FSClinicalsForm model={fsclinicalsModel} />
//       {isLoading && <p>Processing your registration...</p>}
//       {response && <p>{response}</p>}
//     </div>
//   );
// }

// async function blobToBase64(blob) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onloadend = () => resolve(reader.result.split(',')[1]);
//     reader.onerror = reject;
//     reader.readAsDataURL(blob);
//   });
// }

export default function FSClinicalsFormComponent() {}