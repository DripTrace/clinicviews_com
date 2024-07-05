// app/api/patient-appointments/route.ts
import { NextResponse } from 'next/server';
import { Client } from '@microsoft/microsoft-graph-client';
// import { getToken } from '../get-token/route';

export default async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const patientId = searchParams.get('patientId');

  if (!patientId) {
    return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
  }

  try {
    // Get access token
    // const accessToken = await getToken();
    const tokenResponse = await fetch('/api/get-token/route');
    const { accessToken } = await tokenResponse.json();

    // Initialize Graph client
    const client = Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      },
    });

    // Get patient email
    const patient = await client.api(`/me/contacts/${patientId}`).get();
    const patientEmail = patient.emailAddresses[0].address;

    // Get appointments for the patient
    const appointments = await client.api('/me/events')
      .filter(`attendees/any(a:a/emailAddress/address eq '${patientEmail}')`)
      .select('subject,start,end,attendees')
      .get();

    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    return NextResponse.json({ error: 'Error fetching patient appointments' }, { status: 500 });
  }
}