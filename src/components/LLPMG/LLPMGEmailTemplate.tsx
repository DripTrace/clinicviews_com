import React from "react";

interface EmailTemplateProps {
    name: string;
    email: string;
    phone: string;
    reason: string;
    isDoctor: boolean;
}

const EmailTemplate: React.FC<EmailTemplateProps> = ({
    name,
    email,
    phone,
    reason,
    isDoctor,
}) => {
    const containerStyle = {
        fontFamily: "Arial, sans-serif",
        color: "#494949",
        textAlign: "center",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        maxWidth: "600px",
        margin: "auto",
    } as React.CSSProperties;

    const headerStyle = {
        backgroundColor: isDoctor ? "#0C3C60" : "#6EA4CE",
        color: "#ffffff",
        padding: "10px 0",
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
                        ? "New Patient Registration"
                        : "Registration Confirmation"}
                </h1>
            </div>
            <div style={contentStyle}>
                <p>
                    {isDoctor
                        ? `A new patient has registered. Here are the details we've received:`
                        : "Thank you for registering with Loma Linda Psychiatric Medical Group. Here are the details we've received:"}
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
                <p>
                    {isDoctor
                        ? "Please review the attached PDF (if any) for additional information."
                        : "We will contact you soon to confirm your registration and provide further information."}
                </p>
                <p style={footerStyle}>
                    If you have any questions, please contact us at{" "}
                    <a href="mailto:llpmg@lomalindapsych.com">
                        llpmg@lomalindapsych.com
                    </a>{" "}
                    or <a href="tel:9097926262">(909) 792-6262</a>.
                </p>
            </div>
        </div>
    );
};

export default EmailTemplate;
