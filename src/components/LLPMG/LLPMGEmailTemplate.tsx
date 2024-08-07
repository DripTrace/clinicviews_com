import React from "react";

interface LLPMGEmailTemplateProps {
    name: string;
    email: string;
    phone: string;
    birthday: string;
    insurance: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    pharmacy: string;
    reason: string;
    suggestedAppointment: string;
    isDoctor: boolean;
}

const LLPMGEmailTemplate: React.FC<LLPMGEmailTemplateProps> = ({
    name,
    email,
    phone,
    birthday,
    insurance,
    address,
    city,
    state,
    zipCode,
    pharmacy,
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
        backgroundColor: isDoctor ? "#0C3C60" : "#6EA4CE",
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
                    <span style={labelStyle}>Date of Birth:</span> {birthday}
                </div>
                <div style={fieldStyle}>
                    <span style={labelStyle}>Insurance:</span> {insurance}
                </div>
                <div style={fieldStyle}>
                    <span style={labelStyle}>Address:</span> {address}, {city},{" "}
                    {state}, {zipCode}
                </div>
                <div style={fieldStyle}>
                    <span style={labelStyle}>Preferred Pharmacy:</span>{" "}
                    {pharmacy}
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
