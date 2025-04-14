import { NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  ForgotPasswordSubmitCommand,
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
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Verify OTP and set a new password
    const forgotPasswordSubmitCommand = new ForgotPasswordSubmitCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: otp,
      Password: Math.random().toString(36).slice(-8), // Generate a random password
    });

    await cognitoClient.send(forgotPasswordSubmitCommand);

    // Here you would typically sign in the user and return a session token
    // For now, we'll just return success
    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
