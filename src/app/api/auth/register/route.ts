import { NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import crypto from "crypto";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

function generateSecretHash(username: string) {
  const clientId = process.env.COGNITO_CLIENT_ID || "";
  const clientSecret = process.env.COGNITO_CLIENT_SECRET || "";
  const message = username + clientId;
  const key = Buffer.from(clientSecret, "utf8");
  const hash = crypto
    .createHmac("sha256", key)
    .update(message)
    .digest("base64");
  return hash;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      gender,
      address,
      emergencyContact,
    } = body;

    // Register user in Cognito
    const signUpCommand = new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      Password: password,
      SecretHash: generateSecretHash(email),
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
        {
          Name: "given_name",
          Value: firstName,
        },
        {
          Name: "family_name",
          Value: lastName,
        },
        {
          Name: "phone_number",
          Value: phoneNumber,
        },
      ],
    });

    const cognitoResponse = await cognitoClient.send(signUpCommand);

    if (!cognitoResponse.UserSub) {
      throw new Error("Failed to create user in Cognito");
    }

    // Store additional user data in DynamoDB
    const userData = {
      email,
      userId: cognitoResponse.UserSub,
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      gender,
      address,
      emergencyContact,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const putItemCommand = new PutItemCommand({
      TableName: "users-hms",
      Item: marshall(userData),
    });

    await dynamoClient.send(putItemCommand);

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to register user",
      },
      { status: 400 }
    );
  }
}
