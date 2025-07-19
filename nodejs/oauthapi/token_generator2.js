import express from 'express';
import axios from 'axios';
import querystring from 'querystring';
import dotenv from 'dotenv';
import cors from 'cors'; // Enable CORS for development

dotenv.config();

const app = express();
const port = 3000;

const CLIENT_ID = '4d95fd2e-e370-47c6-827c-7270aa707238';
const TENANT_ID = '72f988bf-86f1-41af-91ab-2d7cd011db47';
const REDIRECT_URI = `http://localhost:3000/callback`;
const SCOPE = `https://graph.microsoft.com/.default`; // `api://4d95fd2e-e370-47c6-827c-7270aa707238/default`; // https://graph.microsoft.com/.default


// Azure AD OAuth endpoints
const AUTHORIZATION_URL = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize`;
const TOKEN_URL = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;

app.use(cors()); // Enable CORS for development

// Step 1: Redirect the user to Azure AD login page
app.get('/login', (req, res) => {
  const state = Math.random().toString(36).substring(2); // Dynamic state parameter
  const authorizationUrl = `${AUTHORIZATION_URL}?` +
    querystring.stringify({
      client_id: CLIENT_ID,
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      scope: SCOPE,
      response_mode: 'query',
      state: state, // Send dynamic state
    });

  res.redirect(authorizationUrl);
});

// Step 2: Azure AD redirects back to /callback with authorization code
app.get('/callback', async (req, res) => {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).send('Authorization code not found');
  }

  // Step 3: Exchange authorization code for an access token
  try {
    const tokenResponse = await axios.post(TOKEN_URL, querystring.stringify({
      client_id: CLIENT_ID,
      code: code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
      scope: SCOPE,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const accessToken = tokenResponse.data.access_token;

    // Display the access token (or use it to call an API)
    res.send(`<h1>Access Token</h1><pre>${JSON.stringify(tokenResponse.data, null, 2)}</pre>`);
  } catch (error) {
    console.error('Error during token exchange:', error.response?.data || error.message);
    res.status(500).send({
      error: 'Failed to obtain access token',
      details: error.response ? error.response.data : error.message
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


