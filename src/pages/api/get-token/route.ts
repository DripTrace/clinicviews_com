import type { NextApiRequest, NextApiResponse } from "next";

const local = process.env;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const tokenEndpoint = `https://login.microsoftonline.com/${local.NEXT_PUBLIC_AZURE_AD_TENANT_ID}/oauth2/v2.0/token`;
  const clientId = `${local.NEXT_PUBLIC_AZURE_AD_CLIENT_ID}`;
  const clientSecret = `${local.NEXT_PUBLIC_AZURE_AD_CLIENT_SECRET}`;
  const requestBody = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
    scope: "https://graph.microsoft.com/.default",
  });

  try {
    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: requestBody.toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json({ accessToken: data.access_token });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error obtaining access token:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
}