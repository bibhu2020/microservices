import express from 'express';
import { PublicClientApplication } from '@azure/msal-node';
import querystring from 'querystring';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

// Azure AD App Registration details
const CLIENT_ID = '4d95fd2e-e370-47c6-827c-7270aa707238';
const TENANT_ID = '72f988bf-86f1-41af-91ab-2d7cd011db47';
const REDIRECT_URI = `http://localhost:3000/callback`;
const SCOPEs = ['api://4d95fd2e-e370-47c6-827c-7270aa707238/default'];

// MSAL configuration
const pca = new PublicClientApplication({
  auth: {
    clientId: CLIENT_ID,
    authority: `https://login.microsoftonline.com/${TENANT_ID}`,
  },
});

// Step 1: Redirect the user to Azure AD login page
app.get('/login', (req, res) => {
  const authCodeUrlParameters = {
    scopes: SCOPEs,
    redirectUri: REDIRECT_URI,
  };

  pca.getAuthCodeUrl(authCodeUrlParameters)
    .then(authCodeUrl => {
      // Redirect to the authorization URL to authenticate
      res.redirect(authCodeUrl);
    })
    .catch(error => {
      console.error('Error getting auth code URL:', error);
      res.status(500).send('Error generating authentication URL');
    });
});

// Step 2: Azure AD redirects back to /redirect with authorization code
app.get('/callback', async (req, res) => {
  const authCode = req.query.code;

  if (!authCode) {
    return res.status(400).send('Authorization code is missing');
  }

  try {
    // Step 3: Exchange authorization code for an access token
    const tokenResponse = await pca.acquireTokenByCode({
      code: authCode,
      scopes: SCOPEs,
      redirectUri: REDIRECT_URI,
    });

    // Display the access token (or use it for API calls)
    res.send(`<h1>Access Token</h1><pre>${JSON.stringify(tokenResponse, null, 2)}</pre>`);
  } catch (error) {
    console.error('Error during token exchange:', error);
    res.status(500).send('Failed to obtain access token');
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
