import type { NextApiRequest, NextApiResponse } from 'next';
// import { getAccessToken } from '@/lib/auth'; // Implement this function to get the access token

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, email, phone, reason, suggestAppointment, appointmentDate, appointmentTime, pdfBase64 } = req.body;

    // const accessToken = await getAccessToken();
    const tokenResponse = await fetch('http://localhost:2999/api/get-token/route');
    const { accessToken } = await tokenResponse.json();

    // Create patient record
    const patientResponse = await fetch('https://graph.microsoft.com/v1.0/users/fsclinicals-com@mail.clinicviews.com/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        displayName: name,
        emailAddresses: [{ address: email }],
        mobilePhone: phone
      })
    });

    if (!patientResponse.ok) {
      throw new Error('Failed to create patient record');
    }

    const patient = await patientResponse.json();

    // Schedule appointment if suggested
    if (suggestAppointment && appointmentDate && appointmentTime) {
      const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
      const now = new Date();
      const minAllowedTime = new Date(now.getTime() + 72 * 60 * 60 * 1000);

      if (appointmentDateTime < minAllowedTime) {
        return res.status(400).json({ error: 'Appointment must be at least 72 hours in the future' });
      }

      await fetch('https://graph.microsoft.com/v1.0/users/fsclinicals-com@mail.clinicviews.com/calendar/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subject: `Appointment with ${name}`,
          start: {
            dateTime: appointmentDateTime.toISOString(),
            timeZone: 'Pacific Standard Time'
          },
          end: {
            dateTime: new Date(appointmentDateTime.getTime() + 60 * 60 * 1000).toISOString(),
            timeZone: 'Pacific Standard Time'
          },
          attendees: [
            {
              emailAddress: {
                address: email,
                name: name
              },
              type: 'required'
            }
          ]
        })
      });
    }

    // Send email to patient
    await sendEmail(
      accessToken,
      email,
      'Registration Confirmation',
      `Dear ${name},\n\nThank you for registering with FSClinicals. We have received your information and will contact you shortly.\n\nReason for visit: ${reason}\n\n${suggestAppointment ? `Suggested appointment: ${appointmentDate} at ${appointmentTime}` : ''}\n\nBest regards,\nFSClinicals Team`
    );

    // Send email to doctor
    await sendEmail(
      accessToken,
      'fsclinicals-com@mail.clinicviews.com',
      'New Patient Registration',
      `New patient registration:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nReason: ${reason}\n\n${suggestAppointment ? `Suggested appointment: ${appointmentDate} at ${appointmentTime}` : ''}`,
      pdfBase64
    );

    res.status(200).json({ message: 'Patient registered successfully' });
  } catch (error) {
    console.error('Error registering patient:', error);
    res.status(500).json({ error: 'Error registering patient' });
  }
}

async function sendEmail(accessToken: string, to: string, subject: string, content: string, attachment?: string) {
  const mailBody: any = {
    message: {
      subject,
      body: {
        contentType: 'Text',
        content,
      },
      toRecipients: [
        { emailAddress: { address: to } }
      ]
    }
  };

  if (attachment) {
    mailBody.message.attachments = [
      {
        '@odata.type': '#microsoft.graph.fileAttachment',
        name: 'patient_document.pdf',
        contentType: 'application/pdf',
        contentBytes: attachment
      }
    ];
  }

  await fetch('https://graph.microsoft.com/v1.0/users/fsclinicals-com@mail.clinicviews.com/sendMail', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(mailBody)
  });
}