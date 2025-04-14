import { NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  GetUserCommand,
  ForgotPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // First, get the username for the email
    const getUserCommand = new GetUserCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: email,
    });

    const userResponse = await cognitoClient.send(getUserCommand);

    if (!userResponse.Username) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Initiate forgot password flow to send OTP
    const forgotPasswordCommand = new ForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
    });

    await cognitoClient.send(forgotPasswordCommand);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
