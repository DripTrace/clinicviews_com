// pages/api/register-patient.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, File } from 'formidable';
import { promises as fs } from 'fs';
import { renderToString } from 'react-dom/server';
import EmailTemplate from '@/components/FSClinicals/EmailTemplate';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Error parsing form data' });
      }

      try {
        const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
        const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
        const phone = Array.isArray(fields.phone) ? fields.phone[0] : fields.phone;
        const reason = Array.isArray(fields.reason) ? fields.reason[0] : fields.reason;
        const suggestAppointment = Array.isArray(fields.suggestAppointment) ? fields.suggestAppointment[0] : fields.suggestAppointment;
        const appointmentDate = Array.isArray(fields.appointmentDate) ? fields.appointmentDate[0] : fields.appointmentDate;
        const appointmentTime = Array.isArray(fields.appointmentTime) ? fields.appointmentTime[0] : fields.appointmentTime;
        const pdfFile = Array.isArray(files.pdf) ? files.pdf[0] : files.pdf;

        if (!name || !email || !phone || !reason) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        // Get access token
        // const tokenResponse = await fetch('http://localhost:2999/api/get-token/route');
        // const APP_URL = process.env.PROD_APP_URL ?
        if (process.env.NODE_ENV === 'development') {
            process.env.APP_URL = process.env.DEV_APP_URL;
            } else {
            process.env.APP_URL = process.env.PROD_APP_URL;
        } 

        const tokenResponse = await fetch(`${process.env.APP_URL}/api/get-token/route`);
        const { accessToken } = await tokenResponse.json();

        // Create patient record
        const eventUrl = `https://graph.microsoft.com/v1.0/users/fsclinicals-com@mail.clinicviews.com/contacts`;
        const patientResponse = await fetch(eventUrl, {
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
          const errorData = await patientResponse.json();
          console.error('Patient creation error:', errorData);
          throw new Error(`Failed to create patient record: ${errorData.error?.message || 'Unknown error'}`);
        }

        const patient = await patientResponse.json();

        // Create appointment if suggested
        if (suggestAppointment === 'true' && appointmentDate && appointmentTime) {
          const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
          const now = new Date();
          const minAllowedTime = new Date(now.getTime() + 72 * 60 * 60 * 1000);

          if (appointmentDateTime < minAllowedTime) {
            return res.status(400).json({ error: 'Appointment must be at least 72 hours in the future' });
          }

          const eventUrl = `https://graph.microsoft.com/v1.0/users/fsclinicals-com@mail.clinicviews.com/calendar/events`;
          const eventResponse = await fetch(eventUrl, {
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

          if (!eventResponse.ok) {
            const errorData = await eventResponse.json();
            console.error('Event creation error:', errorData);
            throw new Error(`Failed to create event: ${errorData.error?.message || 'Unknown error'}`);
          }
        }

        // Read PDF file and convert to base64 if provided
        let pdfBase64: string | undefined;
        if (pdfFile && 'filepath' in pdfFile) {
          const pdfContent = await fs.readFile(pdfFile.filepath);
          pdfBase64 = pdfContent.toString('base64');
        }

        // Render email templates
        const patientEmailHtml = renderToString(
          EmailTemplate({ name, email, phone, reason, isDoctor: false, appointmentDate, appointmentTime })
        );
        const doctorEmailHtml = renderToString(
          EmailTemplate({ name, email, phone, reason, isDoctor: true, appointmentDate, appointmentTime })
        );

        // Send email to patient
        await sendEmail(
          accessToken,
          email,
          'Registration Confirmation',
          patientEmailHtml
        );

        // Send email to doctor
        await sendEmail(
          accessToken,
          'fsclinicals-com@mail.clinicviews.com',
          'New Patient Registration',
          doctorEmailHtml,
          pdfBase64
        );

        res.status(200).json({ message: 'Patient registered successfully', patientId: patient.id });
      } catch (error) {
        console.error('Error registering patient:', error);
        res.status(500).json({ error: 'Error registering patient', details: (error as Error).message });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function sendEmail(accessToken: string, to: string, subject: string, content: string, attachment?: string) {
  const mailUrl = `https://graph.microsoft.com/v1.0/users/fsclinicals-com@mail.clinicviews.com/sendMail`;
  const mailBody: any = {
    message: {
      subject,
      body: {
        contentType: 'HTML',
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

  const mailResponse = await fetch(mailUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(mailBody)
  });

  if (!mailResponse.ok) {
    const errorData = await mailResponse.json();
    console.error('Email sending error:', errorData);
    throw new Error(`Failed to send email: ${errorData.error?.message || 'Unknown error'}`);
  }
}