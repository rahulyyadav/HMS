const express = require("express");
const session = require("express-session");
const { Issuer, generators } = require("openid-client");
const app = express();

// Replace these values with your actual AWS Cognito details
const COGNITO_REGION = "us-east-1";
const COGNITO_USER_POOL_ID = "us-east-1_JQQJwqPiy";
const CLIENT_ID = "19mtmeop27gltrm1ok09mb4f3b";
// For public clients, this can be null or undefined
const CLIENT_SECRET = undefined; // Set to undefined since it's a public client
const REDIRECT_URI = "http://localhost:3000/api/auth/callback/cognito"; // Updated to match NextAuth callback
const LOGOUT_URI = "http://localhost:3000";

// Add EJS template engine for debugging and visualization
app.set("view engine", "ejs");
app.set("views", "./server/views");

// Initialize OpenID Client
let client;
async function initializeClient() {
  try {
    console.log("Discovering Cognito issuer...");
    const issuerUrl = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}`;
    console.log(`Issuer URL: ${issuerUrl}`);

    const issuer = await Issuer.discover(issuerUrl);
    console.log("Issuer discovered:", issuer.metadata.issuer);

    // Create client configuration - for a public client, don't include client_secret
    const clientConfig = {
      client_id: CLIENT_ID,
      redirect_uris: [REDIRECT_URI],
      response_types: ["code"],
    };

    // Only add client_secret if it's defined (for confidential clients)
    if (CLIENT_SECRET) {
      clientConfig.client_secret = CLIENT_SECRET;
    }

    client = new issuer.Client(clientConfig);
    console.log(
      "OpenID Client initialized successfully as a",
      CLIENT_SECRET ? "confidential" : "public",
      "client"
    );
  } catch (error) {
    console.error("Failed to initialize OpenID client:", error);
    throw error;
  }
}

// Configure session middleware
app.use(
  session({
    secret: "health-monitoring-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Auth check middleware
const checkAuth = (req, res, next) => {
  if (!req.session.userInfo) {
    req.isAuthenticated = false;
  } else {
    req.isAuthenticated = true;
  }
  next();
};

// Debug route to check if server is running
app.get("/", checkAuth, (req, res) => {
  res.render("index", {
    isAuthenticated: req.isAuthenticated,
    userInfo: req.session.userInfo || null,
  });
});

// Status check
app.get("/status", (req, res) => {
  res.json({
    status: "running",
    openidClientInitialized: !!client,
    cognitoDetails: {
      region: COGNITO_REGION,
      userPoolId: COGNITO_USER_POOL_ID,
      clientId: CLIENT_ID,
      clientType: CLIENT_SECRET ? "confidential" : "public",
      redirectUri: REDIRECT_URI,
      cognitoDomain: `${
        COGNITO_USER_POOL_ID.split("_")[1]
      }.auth.${COGNITO_REGION}.amazoncognito.com`,
    },
  });
});

// Login route
app.get("/login", (req, res) => {
  try {
    if (!client) {
      return res
        .status(500)
        .send(
          "OpenID Client not initialized yet. Please try again in a moment."
        );
    }

    const nonce = generators.nonce();
    const state = generators.state();
    const codeVerifier = generators.codeVerifier();
    const codeChallenge = generators.codeChallenge(codeVerifier);

    req.session.nonce = nonce;
    req.session.state = state;
    req.session.codeVerifier = codeVerifier;

    // Create auth URL with PKCE for public clients
    const authUrl = client.authorizationUrl({
      scope: "email openid profile",
      state: state,
      nonce: nonce,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });

    console.log("Redirecting to auth URL:", authUrl);
    res.redirect(authUrl);
  } catch (error) {
    console.error("Error in login route:", error);
    res.status(500).send(`Login error: ${error.message}`);
  }
});

// Callback route
app.get("/callback", async (req, res) => {
  try {
    if (!client) {
      return res.status(500).send("OpenID Client not initialized yet");
    }

    const params = client.callbackParams(req);
    console.log("Callback params:", params);

    if (!req.session.nonce || !req.session.state) {
      return res.status(400).send("Missing nonce or state in session");
    }

    // Prepare callback params including PKCE code verifier if available
    const callbackParams = {
      nonce: req.session.nonce,
      state: req.session.state,
    };

    if (req.session.codeVerifier) {
      callbackParams.code_verifier = req.session.codeVerifier;
    }

    const tokenSet = await client.callback(
      REDIRECT_URI,
      params,
      callbackParams
    );

    const userInfo = await client.userinfo(tokenSet.access_token);
    req.session.userInfo = userInfo;
    req.session.tokens = {
      access_token: tokenSet.access_token,
      id_token: tokenSet.id_token,
      refresh_token: tokenSet.refresh_token,
    };

    // Redirect to the frontend app
    res.redirect("/");
  } catch (err) {
    console.error("Callback error:", err);
    res.status(500).send(`Authentication failed: ${err.message}`);
  }
});

// User info route
app.get("/user", checkAuth, (req, res) => {
  if (req.isAuthenticated) {
    res.json(req.session.userInfo);
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

// Logout route
app.get("/logout", (req, res) => {
  // Clear user session
  req.session.destroy();

  // Redirect to Cognito logout
  const cognitoDomain = `https://${
    COGNITO_USER_POOL_ID.split("_")[1]
  }.auth.${COGNITO_REGION}.amazoncognito.com`;
  const logoutUrl = `${cognitoDomain}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(
    LOGOUT_URI
  )}`;
  console.log("Redirecting to logout URL:", logoutUrl);
  res.redirect(logoutUrl);
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  console.log(`Auth server running on port ${PORT}`);
  try {
    await initializeClient();
    console.log("OpenID Client initialized successfully on startup");
  } catch (error) {
    console.error("Failed to initialize OpenID client on startup:", error);
  }
});

module.exports = app;
