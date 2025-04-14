1
Configure your user pool app client with allowed callback URLs, logout URLs, and the scopes that you want to request, for example openid and profile. Learn more

2
Install Node version 20 or above .

3
Add the openid-client package to your dependencies in package.json.

{
"name": "node",
"version": "1.0.0",
"description": "",
"main": "app.js",
"scripts": {
"start": "node app.js"
},
"author": "",
"license": "ISC",
"dependencies": {
"ejs": "^3.1.10",
"express": "^4.21.1",
"express-session": "^1.18.1",
"openid-client": "^5.7.0"
}
}

4
Install the dependencies.

npm install

5
Configure openid-client with values for the OIDC properties of your user pool.

const express = require('express');
const session = require('express-session');
const { Issuer, generators } = require('openid-client');
const app = express();

let client;
// Initialize OpenID Client
async function initializeClient() {
const issuer = await Issuer.discover('https://cognito-idp.us-east-1.amazonaws.com/us-east-1_JQQJwqPiy');
client = new issuer.Client({
client_id: '19mtmeop27gltrm1ok09mb4f3b',
client_secret: '<client secret>',
redirect_uris: ['http://localhost'],
response_types: ['code']
});
};
initializeClient().catch(console.error);

6
Configure the session middleware.

app.use(session({
secret: 'some secret',
resave: false,
saveUninitialized: false
}));

7
Add a middleware component that checks if a user is authenticated.

const checkAuth = (req, res, next) => {
if (!req.session.userInfo) {
req.isAuthenticated = false;
} else {
req.isAuthenticated = true;
}
next();
};

8
Configure a home route at the root of your application. Include a check for users’ authenticated state.

app.get('/', checkAuth, (req, res) => {
res.render('home', {
isAuthenticated: req.isAuthenticated,
userInfo: req.session.userInfo
});
});

9
Configure a login route to direct to Amazon Cognito managed login for authentication with your authorization endpoint.

app.get('/login', (req, res) => {
const nonce = generators.nonce();
const state = generators.state();

    req.session.nonce = nonce;
    req.session.state = state;

    const authUrl = client.authorizationUrl({
        scope: 'phone openid email',
        state: state,
        nonce: nonce,
    });

    res.redirect(authUrl);

});

10
Configure the page for the return URL that Amazon Cognito redirects to after authentication.

// Helper function to get the path from the URL. Example: "http://localhost/hello" returns "/hello"
function getPathFromURL(urlString) {
try {
const url = new URL(urlString);
return url.pathname;
} catch (error) {
console.error('Invalid URL:', error);
return null;
}
}

app.get(getPathFromURL('http://localhost'), async (req, res) => {
try {
const params = client.callbackParams(req);
const tokenSet = await client.callback(
'http://localhost',
params,
{
nonce: req.session.nonce,
state: req.session.state
}
);

        const userInfo = await client.userinfo(tokenSet.access_token);
        req.session.userInfo = userInfo;

        res.redirect('/');
    } catch (err) {
        console.error('Callback error:', err);
        res.redirect('/');
    }

});

11
Configure a logout route that erases user session data and redirects to the Amazon Cognito logout endpoint.

// Logout route
app.get('/logout', (req, res) => {
req.session.destroy();
const logoutUrl = `https://<user pool domain>/logout?client_id=19mtmeop27gltrm1ok09mb4f3b&logout_uri=<logout uri>`;
res.redirect(logoutUrl);
});

12
Configure the home page with a sign-in link that directs to the login route and a sign-out link that directs to the logout route.

<!-- views/home.ejs -->
<!DOCTYPE html>
<html>
<head>
    <title>Amazon Cognito authentication with Node example</title>
</head>
<body>
<div>
    <h1>Amazon Cognito User Pool Demo</h1>

    <% if (isAuthenticated) { %>
        <div>
            <h2>Welcome, <%= userInfo.username || userInfo.email %></h2>
            <p>Here are some attributes you can use as a developer:</p>
            <p><%= JSON.stringify(userInfo, null, 4) %></p>
        </div>
        <a href="/logout">Logout</a>
    <% } else { %>
        <p>Please log in to continue</p>
        <a href="/login">Login</a>
    <% } %>

</div>
</body>
</html>

13
Configure the Node view engine.

app.set('view engine', 'ejs');
