# AWS Cognito Setup for Health Monitoring System

This document outlines the necessary AWS Cognito setup to make the authentication system work correctly with our Next.js application.

## Cognito User Pool Configuration

1. **Update User Pool Client Settings**

   - Navigate to Amazon Cognito console → User Pools → `us-east-1_JQQJwqPiy` → App integration → App clients
   - Select the app client `19mtmeop27gltrm1ok09mb4f3b`
   - Update the Allowed callback URLs to include: `http://localhost:3000/api/auth/callback`
   - Update the Allowed sign-out URLs to include: `http://localhost:3000`
   - Set the allowed OAuth flows and scopes:
     - Check "Authorization code grant"
     - Check the following scopes: `email`, `openid`, `profile`

2. **Update Domain Name**
   - If not already configured, set up a domain name in the "Domain name" section
   - Update the `config/aws-config.js` file with your domain name

## Configuration Files to Update

1. **Update `config/aws-config.js`**

```javascript
// Update these values with your actual Cognito settings
const awsConfig = {
  region: "us-east-1", // Your AWS region
  userPoolId: "us-east-1_JQQJwqPiy", // Your User Pool ID
  userPoolWebClientId: "19mtmeop27gltrm1ok09mb4f3b", // Your App Client ID
  oauth: {
    domain: "your-domain.auth.us-east-1.amazoncognito.com", // Replace with your actual domain
    scope: ["email", "openid", "profile"],
    redirectSignIn: "http://localhost:3000/api/auth/callback",
    redirectSignOut: "http://localhost:3000",
    responseType: "code",
  },
};
```

2. **Update `server/auth-server.js`**

```javascript
// Replace these values with your actual AWS Cognito details
const COGNITO_REGION = "us-east-1";
const COGNITO_USER_POOL_ID = "us-east-1_JQQJwqPiy";
const CLIENT_ID = "19mtmeop27gltrm1ok09mb4f3b";
const CLIENT_SECRET = "your-client-secret"; // Replace with your actual client secret
const REDIRECT_URI = "http://localhost:3000/api/auth/callback";
const LOGOUT_URI = "http://localhost:3000";
```

## Running the Authentication Server

For local development, you can run both the Next.js application and the authentication server:

1. Start the Next.js application:

```bash
npm run dev
```

2. Start the authentication server (in a separate terminal):

```bash
npm run auth-server
```

## Testing the Integration

1. Navigate to http://localhost:3000/login
2. Click on "User Login"
3. You should be redirected to the Cognito hosted UI for authentication
4. After successful login, you'll be redirected back to the application

## Next Steps

After confirming the authentication flow works correctly, you can:

1. Customize the Cognito hosted UI to match your application's branding
2. Set up additional user attributes in Cognito
3. Configure MFA for enhanced security
4. Implement refresh token rotation for long-lived sessions
