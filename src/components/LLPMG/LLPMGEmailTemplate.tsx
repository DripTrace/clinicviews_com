// import React from "react";

// interface EmailTemplateProps {
//     name: string;
//     email: string;
//     phone: string;
//     reason: string;
//     isDoctor: boolean;
// }

// const EmailTemplate: React.FC<EmailTemplateProps> = ({
//     name,
//     email,
//     phone,
//     reason,
//     isDoctor,
// }) => {
//     const containerStyle = {
//         fontFamily: "Arial, sans-serif",
//         color: "#494949",
//         textAlign: "center",
//         padding: "20px",
//         backgroundColor: "#f9f9f9",
//         borderRadius: "8px",
//         boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//         maxWidth: "600px",
//         margin: "auto",
//     } as React.CSSProperties;

//     const headerStyle = {
//         backgroundColor: isDoctor ? "#0C3C60" : "#6EA4CE",
//         color: "#ffffff",
//         padding: "10px 0",
//         borderRadius: "8px 8px 0 0",
//     } as React.CSSProperties;

//     const contentStyle = {
//         padding: "20px",
//     } as React.CSSProperties;

//     const footerStyle = {
//         marginTop: "20px",
//         fontSize: "12px",
//         color: "#888",
//     } as React.CSSProperties;

//     return (
//         <div style={containerStyle}>
//             <div style={headerStyle}>
//                 <h1>
//                     {isDoctor
//                         ? "New Patient Registration"
//                         : "Registration Confirmation"}
//                 </h1>
//             </div>
//             <div style={contentStyle}>
//                 <p>
//                     {isDoctor
//                         ? `A new patient has registered. Here are the details we've received:`
//                         : "Thank you for registering with Loma Linda Psychiatric Medical Group. Here are the details we've received:"}
//                 </p>
//                 <p>
//                     <strong>Name:</strong> {name}
//                 </p>
//                 <p>
//                     <strong>Email:</strong> {email}
//                 </p>
//                 <p>
//                     <strong>Phone:</strong> {phone}
//                 </p>
//                 <p>
//                     <strong>Reason for Visit:</strong> {reason}
//                 </p>
//                 <p>
//                     {isDoctor
//                         ? "Please review the attached PDF (if any) for additional information."
//                         : "We will contact you soon to confirm your registration and provide further information."}
//                 </p>
//                 <p style={footerStyle}>
//                     If you have any questions, please contact us at{" "}
//                     <a href="mailto:llpmg@lomalindapsych.com">
//                         llpmg@lomalindapsych.com
//                     </a>{" "}
//                     or <a href="tel:9097926262">(909) 792-6262</a>.
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default EmailTemplate;

// import React from "react";

// interface LLPMGEmailTemplateProps {
//     firstName: string;
//     lastName: string;
//     email: string;
//     phone: string;
//     birthday: string;
//     insurance: string;
//     addressLine1: string;
//     addressLine2: string;
//     city: string;
//     state: string;
//     zipCode: string;
//     pharmacy: string;
//     reason: string;
//     isDoctor: boolean;
// }

// const LLPMGEmailTemplate: React.FC<LLPMGEmailTemplateProps> = ({
//     firstName,
//     lastName,
//     email,
//     phone,
//     birthday,
//     insurance,
//     addressLine1,
//     addressLine2,
//     city,
//     state,
//     zipCode,
//     pharmacy,
//     reason,
//     isDoctor,
// }) => {
//     const containerStyle = {
//         fontFamily: "Arial, sans-serif",
//         color: "#494949",
//         textAlign: "center" as const,
//         padding: "20px",
//         backgroundColor: "#f9f9f9",
//         borderRadius: "8px",
//         boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//         maxWidth: "600px",
//         margin: "auto",
//     };

//     const headerStyle = {
//         backgroundColor: isDoctor ? "#0C3C60" : "#6EA4CE",
//         color: "#ffffff",
//         padding: "10px 0",
//         borderRadius: "8px 8px 0 0",
//     };

//     const contentStyle = {
//         padding: "20px",
//         textAlign: "left" as const,
//     };

//     const footerStyle = {
//         marginTop: "20px",
//         fontSize: "12px",
//         color: "#888",
//     };

//     return (
//         <div style={containerStyle}>
//             <div style={headerStyle}>
//                 <h1>
//                     {isDoctor
//                         ? "New Patient Registration"
//                         : "Registration Confirmation"}
//                 </h1>
//             </div>
//             <div style={contentStyle}>
//                 <p>
//                     {isDoctor
//                         ? `A new patient has registered. Here are the details we've received:`
//                         : `Thank you for registering with Loma Linda Psychiatric Medical Group. Here are the details we've received:`}
//                 </p>
//                 <p>
//                     <strong>Name:</strong> {firstName} {lastName}
//                 </p>
//                 <p>
//                     <strong>Email:</strong> {email}
//                 </p>
//                 <p>
//                     <strong>Phone:</strong> {phone}
//                 </p>
//                 <p>
//                     <strong>Birthday:</strong> {birthday}
//                 </p>
//                 <p>
//                     <strong>Insurance:</strong> {insurance}
//                 </p>
//                 <p>
//                     <strong>Address:</strong>
//                     <br />
//                     {addressLine1}
//                     <br />
//                     {addressLine2 && (
//                         <>
//                             {addressLine2}
//                             <br />
//                         </>
//                     )}
//                     {city}, {state} {zipCode}
//                 </p>
//                 <p>
//                     <strong>Preferred Pharmacy:</strong> {pharmacy}
//                 </p>
//                 <p>
//                     <strong>Reason for Visit:</strong> {reason}
//                 </p>
//                 <p>
//                     {isDoctor
//                         ? "Please review the attached PDF (if any) for additional information."
//                         : "We will contact you soon to confirm your registration and provide further information."}
//                 </p>
//                 <p style={footerStyle}>
//                     If you have any questions, please contact us at{" "}
//                     <a href="mailto:llpmg@lomalindapsych.com">
//                         llpmg@lomalindapsych.com
//                     </a>{" "}
//                     or <a href="tel:9097926262">(909) 792-6262</a>.
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default LLPMGEmailTemplate;

import React from "react";

interface LLPMGEmailTemplateProps {
    name: string;
    email: string;
    phone: string;
    reason: string;
    suggestedAppointment: string;
    isDoctor: boolean;
}

const LLPMGEmailTemplate: React.FC<LLPMGEmailTemplateProps> = ({
    name,
    email,
    phone,
    reason,
    suggestedAppointment,
    isDoctor,
}) => {
    const containerStyle = {
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    };

    const headerStyle = {
        backgroundColor: "#0C3C60",
        color: "#ffffff",
        padding: "20px",
        textAlign: "center" as const,
        borderRadius: "8px 8px 0 0",
    };

    const contentStyle = {
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "0 0 8px 8px",
    };

    const fieldStyle = {
        marginBottom: "10px",
    };

    const labelStyle = {
        fontWeight: "bold",
        color: "#0C3C60",
    };

    const footerStyle = {
        marginTop: "20px",
        fontSize: "12px",
        color: "#888888",
        textAlign: "center" as const,
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h1 style={{ margin: 0 }}>
                    {isDoctor
                        ? "New Patient Registration"
                        : "Registration Confirmation"}
                </h1>
            </div>
            <div style={contentStyle}>
                <p>
                    {isDoctor
                        ? "A new patient has registered. Here are the details we've received:"
                        : "Thank you for registering with Loma Linda Psychiatric Medical Group. Here are the details we've received:"}
                </p>
                <div style={fieldStyle}>
                    <span style={labelStyle}>Name:</span> {name}
                </div>
                <div style={fieldStyle}>
                    <span style={labelStyle}>Email:</span> {email}
                </div>
                <div style={fieldStyle}>
                    <span style={labelStyle}>Phone:</span> {phone}
                </div>
                <div style={fieldStyle}>
                    <span style={labelStyle}>Reason for Visit:</span> {reason}
                </div>
                <div style={fieldStyle}>
                    <span style={labelStyle}>Suggested Appointment:</span>{" "}
                    {suggestedAppointment}
                </div>
                <p>
                    {isDoctor
                        ? "Please review the attached PDF (if any) for additional information."
                        : "We will contact you soon to confirm your registration and provide further information about your suggested appointment time."}
                </p>
                {!isDoctor && (
                    <p
                        style={{
                            backgroundColor: "#e6f3ff",
                            padding: "10px",
                            borderRadius: "4px",
                        }}
                    >
                        <strong>Next Steps:</strong>
                        <br />
                        1. We will review your registration details.
                        <br />
                        2. Our staff will contact you to confirm or reschedule
                        your suggested appointment time.
                        <br />
                        3. Please prepare any relevant medical history or
                        documentation for your visit.
                    </p>
                )}
                <div style={footerStyle}>
                    <p>
                        If you have any questions, please contact us at{" "}
                        <a
                            href="mailto:llpmg@lomalindapsych.com"
                            style={{ color: "#1FABC7" }}
                        >
                            llpmg@lomalindapsych.com
                        </a>{" "}
                        or{" "}
                        <a href="tel:9097926262" style={{ color: "#1FABC7" }}>
                            (909) 792-6262
                        </a>
                        .
                    </p>
                    <p>
                        Loma Linda Psychiatric Medical Group
                        <br />
                        1686 Barton Rd, Redlands, CA 92373
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LLPMGEmailTemplate;
