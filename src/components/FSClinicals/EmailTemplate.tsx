// //single
// import React from "react";

// interface EmailTemplateProps {
//     name: string;
//     email: string;
//     phone: string;
//     reason: string;
//     appointmentDate?: string;
//     appointmentTime?: string;
//     isDoctor: boolean;
// }

// const EmailTemplate: React.FC<EmailTemplateProps> = ({
//     name,
//     email,
//     phone,
//     reason,
//     appointmentDate,
//     appointmentTime,
//     isDoctor,
// }) => {
//     const containerStyle = {
//         fontFamily: "Arial, sans-serif",
//         color: "#333",
//         textAlign: "center",
//         padding: "20px",
//         backgroundColor: "#f9f9f9",
//         borderRadius: "8px",
//         boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//         maxWidth: "600px",
//         margin: "auto",
//     } as React.CSSProperties;

//     const headerStyle = {
//         backgroundColor: isDoctor ? "#0073e6" : "#f8f8f8",
//         color: isDoctor ? "#fff" : "#333",
//         padding: "10px 0",
//         borderBottom: isDoctor ? "none" : "1px solid #ddd",
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
//                         ? "New Patient Registration and Appointment"
//                         : "Registration Confirmation"}
//                 </h1>
//             </div>
//             <div style={contentStyle}>
//                 <p>
//                     {isDoctor
//                         ? `${name} just sent a registration. Here are the details we've received:`
//                         : "Thank you for registering with Four Square Clinicals. Here are the details we've received:"}
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
//                 {appointmentDate && appointmentTime && (
//                     <>
//                         <h2>{isDoctor ? `${name}'s ` : "Your "} Appointment</h2>
//                         <p>
//                             {isDoctor ? `${name}'s ` : "Your "} appointment has
//                             been scheduled for {appointmentDate} at{" "}
//                             {appointmentTime}.
//                         </p>
//                     </>
//                 )}
//                 <p>
//                     {isDoctor
//                         ? `${name} will be expecting a call from you soon to confirm the registration and provide further information.`
//                         : "We will contact you soon to confirm your registration and provide further information."}
//                 </p>
//                 {isDoctor && (
//                     <p>
//                         Please review the attached PDF for additional
//                         information.
//                     </p>
//                 )}
//                 <p style={footerStyle}>
//                     If you have any questions, please contact us at{" "}
//                     <a href="mailto:info@fsclinicals.com">
//                         info@fsclinicals.com
//                     </a>{" "}
//                     or <a href="tel:(775) 238-3082">(775) 238-3082</a>.
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default EmailTemplate;

import React from "react";

interface EmailTemplateProps {
    name: string;
    email: string;
    phone: string;
    reason: string;
    appointmentDate?: string;
    appointmentTime?: string;
    isDoctor: boolean;
    isNewPatient: boolean;
}

const EmailTemplate: React.FC<EmailTemplateProps> = ({
    name,
    email,
    phone,
    reason,
    appointmentDate,
    appointmentTime,
    isDoctor,
    isNewPatient,
}) => {
    const containerStyle = {
        fontFamily: "Arial, sans-serif",
        color: "#333",
        textAlign: "center",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        maxWidth: "600px",
        margin: "auto",
    } as React.CSSProperties;

    const headerStyle = {
        backgroundColor: isDoctor ? "#0073e6" : "#f8f8f8",
        color: isDoctor ? "#fff" : "#333",
        padding: "10px 0",
        borderBottom: isDoctor ? "none" : "1px solid #ddd",
        borderRadius: "8px 8px 0 0",
    } as React.CSSProperties;

    const contentStyle = {
        padding: "20px",
    } as React.CSSProperties;

    const footerStyle = {
        marginTop: "20px",
        fontSize: "12px",
        color: "#888",
    } as React.CSSProperties;

    const getHeaderText = () => {
        if (isDoctor) {
            return isNewPatient
                ? "New Patient Registration and Appointment"
                : "New Appointment Suggestion";
        } else {
            return isNewPatient
                ? "Registration Confirmation"
                : "Appointment Suggestion Confirmation";
        }
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h1>{getHeaderText()}</h1>
            </div>
            <div style={contentStyle}>
                <p>
                    {isDoctor
                        ? `${name} just ${
                              isNewPatient
                                  ? "sent a registration"
                                  : "suggested an appointment"
                          }. Here are the details we've received:`
                        : `Thank you for ${
                              isNewPatient ? "registering with" : "contacting"
                          } Four Square Clinicals. Here are the details we've received:`}
                </p>
                <p>
                    <strong>Name:</strong> {name}
                </p>
                <p>
                    <strong>Email:</strong> {email}
                </p>
                <p>
                    <strong>Phone:</strong> {phone}
                </p>
                {isNewPatient && (
                    <p>
                        <strong>Reason for Visit:</strong> {reason}
                    </p>
                )}
                {appointmentDate && appointmentTime && (
                    <>
                        <h2>
                            {isDoctor ? `${name}'s ` : "Your "} Suggested
                            Appointment
                        </h2>
                        <p>
                            The suggested appointment time is {appointmentDate}{" "}
                            at {appointmentTime}.
                        </p>
                    </>
                )}
                <p>
                    {isDoctor
                        ? `${name} will be expecting a call from you soon to ${
                              isNewPatient
                                  ? "confirm the registration"
                                  : "discuss the appointment suggestion"
                          } and provide further information.`
                        : `We will contact you soon to ${
                              isNewPatient
                                  ? "confirm your registration"
                                  : "discuss your appointment suggestion"
                          } and provide further information.`}
                </p>
                {isDoctor && isNewPatient && (
                    <p>
                        Please review the attached PDF for additional
                        information.
                    </p>
                )}
                <p style={footerStyle}>
                    If you have any questions, please contact us at{" "}
                    <a href="mailto:info@fsclinicals.com">
                        info@fsclinicals.com
                    </a>{" "}
                    or <a href="tel:(775) 238-3082">(775) 238-3082</a>.
                </p>
            </div>
        </div>
    );
};

export default EmailTemplate;
