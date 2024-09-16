import { NextResponse } from "next/server";
import { getPlatform, initializeSDK, login } from "../../sip/sipActions";

export async function POST(request: Request) {
    try {
        const { server, clientId, clientSecret, jwtToken, logLevel } =
            await request.json();
        initializeSDK(clientId, clientSecret, server);
        await login(jwtToken);

        // Example call to get the extension information after login
        const platform = getPlatform();
        const extension = await platform
            .get("/restapi/v1.0/account/~/extension/~")
            .then((res) => res.json());

        return NextResponse.json({
            message: "Logged in successfully",
            extension,
        });
    } catch (error) {
        // Cast error to Error type
        const err = error as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
