// components/FSClinicals/EmailTemplate.tsx
// working in dev
// import React from "react";

// interface EmailTemplateProps {
//     name: string;
//     email: string;
//     phone: string;
//     reason: string;
//     isDoctor: boolean;
//     appointmentDate?: string;
//     appointmentTime?: string;
//     includeRegistrationNotification?: boolean;
// }

// const EmailTemplate: React.FC<EmailTemplateProps> = ({
//     name,
//     email,
//     phone,
//     reason,
//     isDoctor,
//     appointmentDate,
//     appointmentTime,
//     includeRegistrationNotification,
// }) => {
//     return (
//         <div
//             style={{
//                 fontFamily: "Arial, sans-serif",
//                 maxWidth: "600px",
//                 margin: "0 auto",
//                 padding: "20px",
//                 backgroundColor: "#f8f8f8",
//             }}
//         >
//             <h1
//                 style={{
//                     color: "#0C3C60",
//                     borderBottom: "2px solid #1FABC7",
//                     paddingBottom: "10px",
//                 }}
//             >
//                 {isDoctor
//                     ? "New Patient Registration"
//                     : "Registration Confirmation"}
//             </h1>
//             {isDoctor && includeRegistrationNotification && (
//                 <>
//                     <p>
//                         A new patient has registered with the following details:
//                     </p>
//                     <ul style={{ listStyleType: "none", padding: 0 }}>
//                         <li>
//                             <strong>Name:</strong> {name}
//                         </li>
//                         <li>
//                             <strong>Email:</strong> {email}
//                         </li>
//                         <li>
//                             <strong>Phone:</strong> {phone}
//                         </li>
//                         <li>
//                             <strong>Reason for Visit:</strong> {reason}
//                         </li>
//                     </ul>
//                 </>
//             )}
//             {!isDoctor && (
//                 <>
//                     <p>
//                         Thank you for registering with Four Square Clinicals.
//                         Here are the details we&apos;ve received:
//                     </p>
//                     <ul style={{ listStyleType: "none", padding: 0 }}>
//                         <li>
//                             <strong>Name:</strong> {name}
//                         </li>
//                         <li>
//                             <strong>Email:</strong> {email}
//                         </li>
//                         <li>
//                             <strong>Phone:</strong> {phone}
//                         </li>
//                         <li>
//                             <strong>Reason for Visit:</strong> {reason}
//                         </li>
//                     </ul>
//                 </>
//             )}
//             {appointmentDate && appointmentTime && (
//                 <div
//                     style={{
//                         marginTop: "20px",
//                         padding: "10px",
//                         backgroundColor: "#D1E0EB",
//                         borderRadius: "5px",
//                     }}
//                 >
//                     <h2 style={{ color: "#0C3C60", margin: "0 0 10px 0" }}>
//                         {isDoctor ? "New Appointment" : "Your Appointment"}
//                     </h2>
//                     <p style={{ margin: 0 }}>
//                         {isDoctor
//                             ? `An appointment has been scheduled with ${name}`
//                             : "Your appointment has been scheduled"}{" "}
//                         for <strong>{appointmentDate}</strong> at{" "}
//                         <strong>{appointmentTime}</strong>.
//                     </p>
//                 </div>
//             )}
//             {isDoctor ? (
//                 <p>
//                     Please review the attached PDF for additional information.
//                 </p>
//             ) : (
//                 <>
//                     <p>
//                         We will contact you soon to confirm your registration
//                         and provide further information.
//                     </p>
//                     <div
//                         style={{
//                             marginTop: "20px",
//                             padding: "10px",
//                             backgroundColor: "#D1E0EB",
//                             borderRadius: "5px",
//                         }}
//                     >
//                         <p style={{ margin: 0, color: "#0C3C60" }}>
//                             If you have any questions, please contact us at
//                             info@fsclinicals.com or (775) 238-3082.
//                         </p>
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };

// export default EmailTemplate;

//first share attempt
// import React from "react";

// interface EmailTemplateProps {
//     formData: {
//         patientName: string;
//         email: string;
//         phone: string;
//         reason: string;
//         suggestAppointment: string;
//         appointmentDate: string;
//         appointmentTime: string;
//     };
//     eventDetails?: string;
// }

// const EmailTemplate: React.FC<EmailTemplateProps> = ({
//     formData,
//     eventDetails,
// }) => (
//     <div>
//         <h1>New Patient Registration</h1>
//         <p>
//             <strong>Patient Name:</strong> {formData.patientName}
//         </p>
//         <p>
//             <strong>Email:</strong> {formData.email}
//         </p>
//         <p>
//             <strong>Phone:</strong> {formData.phone}
//         </p>
//         <p>
//             <strong>Reason:</strong> {formData.reason}
//         </p>
//         <p>
//             <strong>Suggested Appointment:</strong>{" "}
//             {formData.suggestAppointment}
//         </p>
//         <p>
//             <strong>Appointment Date:</strong> {formData.appointmentDate}
//         </p>
//         <p>
//             <strong>Appointment Time:</strong>{" "}
//             {new Date(
//                 `${formData.appointmentDate}T${formData.appointmentTime}`
//             ).toLocaleTimeString("en-US", {
//                 hour: "2-digit",
//                 minute: "2-digit",
//                 hour12: true,
//             })}
//         </p>
//         {eventDetails && (
//             <>
//                 <h2>Event Details</h2>
//                 <p>{eventDetails}</p>
//             </>
//         )}
//     </div>
// );

// export default EmailTemplate;

//style mod
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
//                         ? "New Patient Registration"
//                         : "Registration Confirmation"}
//                 </h1>
//             </div>
//             <div style={contentStyle}>
//                 <p>
//                     Thank you for registering with Four Square Clinicals. Here
//                     are the details we&rsquo;ve received:
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
//                         <h2>Your Appointment</h2>
//                         <p>
//                             Your appointment has been scheduled for{" "}
//                             {appointmentDate} at {appointmentTime}.
//                         </p>
//                     </>
//                 )}
//                 <p>
//                     We will contact you soon to confirm your registration and
//                     provide further information.
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
//                     or (775) 238-3082.
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default EmailTemplate;

//time
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
//                         ? "New Patient Registration"
//                         : "Registration Confirmation"}
//                 </h1>
//             </div>
//             <div style={contentStyle}>
//                 <p>
//                     Thank you for registering with Four Square Clinicals. Here
//                     are the details we&#39;ve received:
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
//                         <h2>Your Appointment</h2>
//                         <p>
//                             Your appointment has been scheduled for{" "}
//                             {appointmentDate} at {appointmentTime}.
//                         </p>
//                     </>
//                 )}
//                 <p>
//                     We will contact you soon to confirm your registration and
//                     provide further information.
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
//                     or (775) 238-3082.
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default EmailTemplate;

//single
import React from "react";

interface EmailTemplateProps {
    name: string;
    email: string;
    phone: string;
    reason: string;
    appointmentDate?: string;
    appointmentTime?: string;
    isDoctor: boolean;
}

const EmailTemplate: React.FC<EmailTemplateProps> = ({
    name,
    email,
    phone,
    reason,
    appointmentDate,
    appointmentTime,
    isDoctor,
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

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h1>
                    {isDoctor
                        ? "New Patient Registration and Appointment"
                        : "Registration Confirmation"}
                </h1>
            </div>
            <div style={contentStyle}>
                <p>
                    {isDoctor
                        ? `${name} just sent a registration. Here are the details we&apos;ve received:`
                        : "Thank you for registering with Four Square Clinicals. Here are the details we&apos;ve received:"}
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
                <p>
                    <strong>Reason for Visit:</strong> {reason}
                </p>
                {appointmentDate && appointmentTime && (
                    <>
                        <h2>
                            {isDoctor ? `${name}&apos;s ` : "Your "} Appointment
                        </h2>
                        <p>
                            {isDoctor ? `${name}&apos;s ` : "Your "} appointment
                            has been scheduled for {appointmentDate} at{" "}
                            {appointmentTime}.
                        </p>
                    </>
                )}
                <p>
                    {isDoctor
                        ? `${name} will be expecting a call from you soon to confirm the registration and provide further information.`
                        : "We will contact you soon to confirm your registration and provide further information."}
                </p>
                {isDoctor && (
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
