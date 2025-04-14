import { NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
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

    // Log environment variables (sanitized)
    console.log("Region:", process.env.AWS_REGION);
    console.log(
      "Access Key ID (first 4 chars):",
      process.env.AWS_ACCESS_KEY_ID?.substring(0, 4)
    );
    console.log("User Pool ID:", process.env.COGNITO_USER_POOL_ID);

    if (
      !process.env.AWS_SECRET_ACCESS_KEY ||
      process.env.AWS_SECRET_ACCESS_KEY ===
        "ENTER_YOUR_ACTUAL_SECRET_ACCESS_KEY_HERE"
    ) {
      console.error("AWS_SECRET_ACCESS_KEY is not properly set");
      return NextResponse.json(
        {
          error:
            "Server configuration error. AWS credentials not properly set.",
          code: "INVALID_CREDENTIALS",
        },
        { status: 500 }
      );
    }

    if (!process.env.COGNITO_USER_POOL_ID) {
      console.error("COGNITO_USER_POOL_ID is not set");
      return NextResponse.json(
        {
          error: "Server configuration error. Cognito User Pool ID not set.",
          code: "MISSING_CONFIG",
        },
        { status: 500 }
      );
    }

    const command = new ListUsersCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Filter: `email = "${email}"`,
    });

    const response = await cognitoClient.send(command);

    return NextResponse.json({
      exists: response.Users && response.Users.length > 0,
    });
  } catch (error: any) {
    console.error("Error checking user:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);

    // Return more specific error messages based on error type
    if (error.name === "InvalidParameterException") {
      return NextResponse.json(
        {
          error: "Invalid parameter provided",
          code: "INVALID_PARAMETER",
        },
        { status: 400 }
      );
    } else if (error.name === "NotAuthorizedException") {
      return NextResponse.json(
        {
          error:
            "Not authorized to perform this action. Check AWS credentials.",
          code: "NOT_AUTHORIZED",
        },
        { status: 401 }
      );
    } else if (error.name === "ResourceNotFoundException") {
      return NextResponse.json(
        {
          error: "The specified resource was not found",
          code: "RESOURCE_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to check user existence",
        message: error.message || "Unknown error",
        code: "UNKNOWN_ERROR",
      },
      { status: 500 }
    );
  }
}
