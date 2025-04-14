# AWS Cognito + NextAuth Setup for Health Monitoring System

This document outlines the necessary AWS Cognito and NextAuth.js setup to make the authentication system work correctly with our Next.js application.

## Cognito User Pool Configuration

1. **Update User Pool Client Settings**

   - Navigate to Amazon Cognito console → User Pools → `us-east-1_JQQJwqPiy` → App integration → App clients
   - Select the app client `19mtmeop27gltrm1ok09mb4f3b`
   - Under "Allowed callback URLs", add: `http://localhost:3000/api/auth/callback/cognito`
   - Update the Allowed sign-out URLs to include: `http://localhost:3000`
   - Set the allowed OAuth flows and scopes:
     - Check "Authorization code grant" and "Implicit grant"
     - Check the following scopes: `email`, `openid`, `profile`

2. **Update Domain Name**
   - If not already configured, set up a domain name in the "Domain name" section
   - Update the `.env.local` file with your domain details

## Configuration Files to Update

1. **Update `.env.local**

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-change-me-in-production
COGNITO_CLIENT_ID=19mtmeop27gltrm1ok09mb4f3b
COGNITO_CLIENT_SECRET=your-client-secret
COGNITO_ISSUER=https://cognito-idp.us-east-1.amazonaws.com/us-east-1_JQQJwqPiy
```

2. **Verify NextAuth Configuration**
   Make sure your NextAuth.js configuration at `src/app/api/auth/[...nextauth]/route.js` has the correct settings for your Cognito provider:

```javascript
CognitoProvider({
  clientId: process.env.COGNITO_CLIENT_ID,
  clientSecret: process.env.COGNITO_CLIENT_SECRET,
  issuer: process.env.COGNITO_ISSUER,
  idToken: true,
});
```

## Running the Application

Start the Next.js application with the following command:

```bash
npm run dev
```

## Testing the Integration

1. Navigate to http://localhost:3000/login
2. Click on "User Login"
3. Click "Continue with Cognito"
4. You should be redirected to the Cognito hosted UI for authentication
5. After successful login, you'll be redirected back to the Health Dashboard

## Troubleshooting

1. **CSRF Errors**: If you encounter CSRF errors, make sure the `NEXTAUTH_URL` is correctly set in your `.env.local` file and matches your actual URL.

2. **Callback URL Errors**: Ensure your Cognito app client's allowed callback URLs include `http://localhost:3000/api/auth/callback/cognito`.

3. **JWT Errors**: Check that your `NEXTAUTH_SECRET` is properly set and consistent across restarts.

4. **Authentication Flow Issues**: If the authentication flow doesn't work correctly, check the Network tab in Developer Tools to see the requests made and any errors returned.

## Next Steps

After confirming the authentication flow works correctly, you can:

1. Customize the Cognito hosted UI to match your application's branding
2. Set up additional user attributes in Cognito
3. Configure MFA for enhanced security
4. Implement refresh token rotation for long-lived sessions
5. Add additional authentication providers if needed
