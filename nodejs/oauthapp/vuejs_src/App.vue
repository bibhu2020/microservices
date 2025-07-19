<template>
  <div>
    <button class="bg-blue-500 text-white font-bold py-2 px-4 mx-2 rounded" @click="login(false)">Read Graph</button>
    <button class="bg-blue-500 text-white font-bold py-2 px-4 mx-2 rounded" @click="login(true)">Read Graph via Api</button>
    
    <!-- Hourglass indicator -->
    <div v-if="loading" class="hourglass">⏳ Loading...</div>
    
    <div v-if="authorizationCode" style="text-align: left">
      <h3 style="color: red;">Step 1: Auth Code:</h3>
      <pre>{{ authorizationCode }}</pre>
    </div>
    <div v-if="decodeToken" style="text-align: left">
      <h3 style="color: blue;">Step 2: Token:</h3>
      <pre>{{ decodeToken }}</pre>
    </div>
    <div v-if="userList" style="text-align: left">
      <h3 style="color: green;">Step 3: Graph Data (SPA uses Oauth Code Flow):</h3>
      <pre>{{ userList }}</pre>
    </div>
    <div v-if="apiGraphData" style="text-align: left">
      <h3 style="color: purple;">Step 3: Graph Data (Calls API. API uses Oauth Client Flow):</h3>
      <pre>{{ apiGraphData }}</pre>
    </div>
  </div>
</template>

<style>
.hourglass {
  font-size: 1.5em;
  margin: 20px;
}
</style>



<script>
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Corrected import statement

export default {
  name: 'App',
  data() {
    return {
      apiUrl: window.apiUrl,// "http://localhost:8081",
      apiClientId: window.apiClientId,//'fc441906-a5b6-4a4a-8bb1-d8966832770c',  // Replace with your Azure AD client ID
      clientId: window.clientId,//'885a2661-ef23-43f5-909a-a54fc5efc0d9',  // Replace with your Azure AD client ID
      tenantId: window.tenantId,//'95595fde-7f04-4030-ace9-d08cf1e81bdc',  // Replace with your Azure AD tenant ID
      redirectUrl: window.redirectUrl,//'http://localhost:8080/spa',
      token: null,
      decodeToken: null,
      userList: null,
      apiGraphData: null,
      authorizationCode: null,
      loading: false,  // Add loading state
    };
  },
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      this.authorizationCode = code;
      this.exchangeCodeForToken(code);
    }
  },
  methods: {
    async generateCodeVerifierAndChallenge() {
      const codeVerifier = this.generateCodeVerifier();
      localStorage.setItem('code_verifier', codeVerifier); 
      const codeChallenge = await this.generateCodeChallenge(codeVerifier);
      return codeChallenge;
    },
    generateCodeVerifier() {
      const array = new Uint32Array(56 / 2);
      window.crypto.getRandomValues(array);
      return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
    },
    async generateCodeChallenge(codeVerifier) {
      const encoder = new TextEncoder();
      const data = encoder.encode(codeVerifier);
      const digest = await window.crypto.subtle.digest('SHA-256', data);
      return this.base64UrlEncode(digest);
    },
    base64UrlEncode(buffer) {
      return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    },

    async login(callingApi) {
      try {
        this.token = null;
        this.userList = null;
        this.apiGraphData =null;
        this.loading = true; // Start loading

        const scope = callingApi ? `api://${this.apiClientId}/.default` : `openid profile email User.Read User.Read.All`;
        const codeChallenge = await this.generateCodeVerifierAndChallenge();
        const authorizationEndpoint = `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/authorize`;
        const params = new URLSearchParams({
          client_id: this.clientId,
          response_type: 'code',
          redirect_uri: this.redirectUrl,
          response_mode: 'query',
          scope: scope,
          code_challenge: codeChallenge,
          code_challenge_method: 'S256',
          prompt: 'consent',
        });

        window.location = `${authorizationEndpoint}?${params.toString()}`;
      } finally {
        this.loading = false; // Stop loading after the method completes
      }
    },

    async exchangeCodeForToken(code) {
      try {
        this.loading = true; // Start loading
        const tokenEndpoint = `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`;
        const codeVerifier = localStorage.getItem('code_verifier');

        if (!codeVerifier) {
          throw new Error('Code verifier not found.');
        }

        const data = new URLSearchParams({
          client_id: this.clientId,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: this.redirectUrl,
          code_verifier: codeVerifier,
          prompt: 'consent',
        });

        const response = await axios.post(tokenEndpoint, data, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        this.token = response.data.access_token;
        this.decodeToken = jwtDecode(this.token);
        //alert(this.decodeToken.aud);
        //alert(window.apiClientId);
        if (this.decodeToken.aud.indexOf(window.apiClientId) >= 0) { //if the token is for API, call API
          await this.getUserList_fromApi();
        } else {
          await this.getUserList();
        }
      } catch (error) {
        console.error('Token exchange failed:', error);
      } finally {
        this.loading = false; // Stop loading after the method completes
      }
    },

    async getUserList() {
      try {
        this.loading = true; // Start loading
        if (!this.token) {
          console.error('Access token is not available');
          return;
        }

        const response = await axios.get('https://graph.microsoft.com/v1.0/users', {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          params: {
            $select: 'displayName,mail,userPrincipalName,jobTitle,officeLocation,department,accountEnabled,mobilePhone',
            $top: 10, // Limit to top 10 results
          },
        });
        this.userList = response.data;
      } catch (error) {
        console.error('Error reading graph:', error);
      } finally {
        this.loading = false; // Stop loading after the method completes
      }
    },

    async getUserList_fromApi() {
      try {
        this.loading = true; // Start loading
        if (!this.token) {
          console.error('Access token is not available');
          return;
        }

        let uri = `${this.apiUrl}/api/graph/users`;
        if (uri.indexOf("localhost") >= 0) {
          uri = `${this.apiUrl}/api/graph/users?accessMethod=CS`;
        } else {
          uri = `${this.apiUrl}/api/graph/users?accessMethod=FIC`;
        }

        const apiConfig = {
          uri: uri,
        };
        const response = await axios.get(apiConfig.uri, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        this.apiGraphData = response.data;
      } catch (error) {
        console.error('API call failed:', error);
      } finally {
        this.loading = false; // Stop loading after the method completes
      }
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
