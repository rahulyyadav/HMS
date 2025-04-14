// AWS Cognito Configuration
const awsConfig = {
  region: "us-east-1",
  userPoolId: "us-east-1_JQQJwqPiy",
  userPoolWebClientId: "19mtmeop27gltrm1ok09mb4f3b",
  oauth: {
    domain: "[YOUR_COGNITO_DOMAIN].auth.us-east-1.amazoncognito.com",
    scope: ["email", "openid", "profile"],
    redirectSignIn: "http://localhost:3000/api/auth/callback",
    redirectSignOut: "http://localhost:3000",
    responseType: "code",
  },
};

module.exports = awsConfig;
