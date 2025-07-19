
# 📜 **Azure AD and ADO Integration Documentation**

---

## 📜 **Purpose**

This project integrates **Azure Active Directory (AAD)** with **Azure DevOps (ADO)** using the **Client Credentials Flow**. It authenticates with AAD, acquires an **Access Token**, and interacts with ADO APIs to query and fetch work items.

---

## 📖 **Project Overview**

- Authenticate using **Azure AD Service Principal**.
- Acquire an **Access Token** via **Client Credentials Flow**.
- Use the token to interact with **Azure DevOps API** to query and fetch work items from an ADO project.

---

## 🔍 **Code Overview**

### 📌 **Environment Configuration**

```javascript
const ADO_ORG = 'v-bimishra';
const ADO_PROJECT = 'alogtrade';
const ADO_SCOPES = '499b84ac-1321-427f-aa17-267ca6975798/.default';
const CLIENT_ID = '<client_id>';
const CLIENT_SECRET = '<client_secret>';
const TENANT_ID = '<tenant_id>';
```

- **`ADO_ORG`**: Azure DevOps organization name.
- **`ADO_PROJECT`**: Name of the ADO project.
- **`ADO_SCOPES`**: Scope required to authenticate against the ADO API.
- **`CLIENT_ID`** & **`CLIENT_SECRET`**: Credentials of the **Azure AD Service Principal**.
- **`TENANT_ID`**: The Tenant ID for the AAD instance.

---

### 🔹 **Azure AD App Configuration (`msalConfig`)**

```javascript
const msalConfig = {
  auth: {
    clientId: CLIENT_ID,
    authority: `https://login.microsoftonline.com/${TENANT_ID}`,
    clientSecret: CLIENT_SECRET,
  },
};
```

- Sets up **authentication for the Azure AD Service Principal**.
- Uses **MSAL (Microsoft Authentication Library)** to authenticate against **Azure AD**.

---

### 🔹 **`getAccessToken()` Method**

```javascript
const getAccessToken = async () => {
  const cca = new ConfidentialClientApplication(msalConfig);
  const authResult = await cca.acquireTokenByClientCredential({
    scopes: [ADO_SCOPES],
  });

  console.log(authResult.accessToken);
  return authResult.accessToken;
};
```

- **Purpose**: Authenticate with AAD and get an **Access Token**.
- Uses the **Client Credentials flow** to acquire a token.

---

### 🔹 **`getWorkItems()` Method**

```javascript
const getWorkItems = async (accessToken) => {
  try {
    const queryUrl = `https://dev.azure.com/${ADO_ORG}/${ADO_PROJECT}/_apis/wit/wiql?api-version=7.1`;

    const queryBody = {
      query: `SELECT [System.Id], [System.Title], [System.State] FROM WorkItems WHERE [System.TeamProject] = '${ADO_PROJECT}'`,
    };

    const queryResponse = await axios.post(queryUrl, queryBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const workItemIds = queryResponse.data.workItems.map((item) => item.id);

    console.log(`Found ${workItemIds.length} work items.`);

    if (workItemIds.length > 0) {
      const idsQuery = workItemIds.join(',');
      const workItemsUrl = `https://dev.azure.com/${ADO_ORG}/${ADO_PROJECT}/_apis/wit/workitems?ids=${idsQuery}&api-version=7.1`;

      const workItemsResponse = await axios.get(workItemsUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('Work Items Details:', workItemsResponse.data.value);
    } else {
      console.log('No work items found.');
    }
  } catch (error) {
    console.error('Error fetching work items:', error.response?.data || error.message);
  }
};
```

- Constructs and sends a **WIQL query** to the **ADO API**.
- Uses **Axios** to make HTTP calls and authenticate requests with the token.

---

## 🧩 **Configuration Steps**

### 🔹 **Azure Active Directory (AAD) Configuration**

1. **Create an App Registration**
- Go to **Azure Portal** → **Azure Active Directory** → **App Registrations**.
- Click **+ New Registration**.
- Provide a **Name**, select **Supported account types**, and specify the Redirect URL (if required).

2. **Configure Client Credentials**
- In **Azure AD App Registration**, go to the **Certificates & Secrets** tab.
- Generate a **New Client Secret**.
- Save the secret securely as it will be referenced in your environment variables.

3. **API Permissions (not needed)**
- In **Azure AD**, go to **API Permissions**.
- Add **Application Permissions**:
  - Grant appropriate scopes like **User.Read**, **Work Items.Read**, or other relevant ADO permissions.
- Grant **Admin Consent** for the permissions.

---

### 🔹 **Azure DevOps (ADO) Configuration**

1. **Assign Project to Service Principal (App Registration)**
- In **ADO**, go to **Organization Settings** → **General** → **Users**.
- Add the **Service Principal** and assign "Basic Access Level", and Project.

---

## 🔑 **Key Concepts**

| **Component**               | **Purpose**                                      |
|-----------------------------|------------------------------------------------------|
| **Azure AD Authentication** | Provides OAuth tokens to authenticate your Service Principal. |
| **Role Assignments in ADO (Authorization)** | Control access rights to Service Principals for API interactions. |
| **ADO API Calls**          | Interact with **Azure DevOps APIs** to fetch work items. |

---

## 📜 **Troubleshooting Common Errors**

- **Unauthorized Error (`TF400813`)**:
  - Ensure the **Service Principal** is correctly linked to the **ADO project**.
  - Check if **API Permissions** are granted both in **Azure AD** and **Azure DevOps**.

- **Token Acquisition Issues**:
  - Verify **Client ID**, **Client Secret**, and **Tenant ID**.
  - Ensure **Service Principal credentials** are properly configured in **Azure AD**.

---

## 📜 **Conclusion**

By integrating **Azure Active Directory** and **Azure DevOps** with appropriate authentication flows and API permissions, you enable seamless interaction between your services and the ADO platform. Proper role assignments and scopes help maintain a secure and robust environment suitable for automation and CI/CD workflows.

---

## 📜 **References**

- [Azure Active Directory](https://docs.microsoft.com/en-us/azure/active-directory/)
- [Azure DevOps REST API](https://docs.microsoft.com/en-us/rest/api/azure/devops/)
- [Microsoft Authentication Library (MSAL)](https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-overview)
