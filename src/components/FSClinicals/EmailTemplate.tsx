// components/FSClinicals/EmailTemplate.tsx
import React from 'react';

interface EmailTemplateProps {
  name: string;
  email: string;
  phone: string;
  reason: string;
  isDoctor: boolean;
  appointmentDate?: string;
  appointmentTime?: string;
}

const EmailTemplate: React.FC<EmailTemplateProps> = ({
  name,
  email,
  phone,
  reason,
  isDoctor,
  appointmentDate,
  appointmentTime
}) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f8f8f8' }}>
      <h1 style={{ color: '#0C3C60', borderBottom: '2px solid #1FABC7', paddingBottom: '10px' }}>
        {isDoctor ? 'New Patient Registration' : 'Registration Confirmation'}
      </h1>
      {isDoctor ? (
        <p>A new patient has registered with the following details:</p>
      ) : (
        <p>Thank you for registering with Four Square Clinicals. Here are the details we&lsquo;ve received:</p>
      )}
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li><strong>Name:</strong> {name}</li>
        <li><strong>Email:</strong> {email}</li>
        <li><strong>Phone:</strong> {phone}</li>
        <li><strong>Reason for Visit:</strong> {reason}</li>
        {appointmentDate && appointmentTime && (
          <li><strong>Suggested Appointment:</strong> {appointmentDate} at {appointmentTime}</li>
        )}
      </ul>
      {isDoctor ? (
        <p>Please review the attached PDF for additional information.</p>
      ) : (
        <>
          <p>We will contact you soon to confirm your registration and provide further information.</p>
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#D1E0EB', borderRadius: '5px' }}>
            <p style={{ margin: 0, color: '#0C3C60' }}>If you have any questions, please contact us at info@fsclinicals.com or (775) 238-3082.</p>
          </div>
        </>
      )}
    </div>
  );
};

export default EmailTemplate;