# EasyAuth (App Service Authentication and Authorization)

EasyAuth, also known as App Service Authentication and Authorization, is a feature provided by Microsoft Azure App Service that simplifies the process of adding authentication to your web applications and APIs without requiring you to write any custom authentication code. EasyAuth allows you to configure authentication providers directly from the Azure portal and handle user authentication through popular identity providers such as:

- Azure Active Directory (AAD)
- Facebook
- Google
- Twitter
- Microsoft Account

## Key Features of EasyAuth

1. **Built-in Authentication**: Enables authentication for your app with minimal configuration.
2. **Supports Multiple Identity Providers**: Easily integrate with various social and enterprise identity providers.
3. **Automatic Token Management**: Handles token issuance and validation automatically.
4. **Role-based Access Control (RBAC)**: Allows you to restrict access to specific parts of your app based on user roles.
5. **Claims-based Authentication**: Access user claims and use them in your application logic.
6. **Easy Integration**: Works seamlessly with existing applications and APIs with minimal code changes.

## How to Enable EasyAuth

1. **Navigate to the Azure Portal**: Go to your Azure App Service instance.
2. **Settings**: In the left-hand menu, select "Authentication/Authorization".
3. **Enable Authentication**: Toggle the switch to "On".
4. **Add Identity Provider**: Choose the identity provider you want to configure (e.g., Azure AD, Google, Facebook).
5. **Configure the Provider**: Provide necessary information and complete the configuration.
6. **Save Settings**: Apply the settings and save changes.

## Benefits

- **Simplified Authentication**: No need to write complex authentication logic.
- **Secure**: Uses industry-standard protocols like OAuth2 and OpenID Connect.
- **Time-Saving**: Quick configuration through the Azure portal reduces development time.
- **Maintenance**: Azure handles updates and maintenance of the authentication mechanism.

## Use Cases

- **Web Applications**: Securely authenticate users accessing your web apps.
- **APIs**: Protect APIs by ensuring that only authenticated users can access them.
- **Internal Applications**: Easily integrate with Azure AD for enterprise applications.

EasyAuth is particularly useful for developers looking to quickly secure their applications without deep expertise in authentication protocols and security practices. It abstracts away the complexities, allowing you to focus on building your application logic.

## Configuring AAD EasyAuth on App Service
Here's a step-by-step guide to configure an Azure App Service to authenticate using an existing application registration in Entra ID (formerly Azure AD).

### Step 0: Create a User Managed Identity
1. **Navigate to Managed Identity**: Go to the [Azure portal](https://portal.azure.com) and search **Managed Identity** from the search bar.
2. **Create Managed Identity**: Create a managed identity. (say.. fictokentesting)

### Step 1: Register the Application in Entra ID

1. **Navigate to Azure AD**: Go to the [Azure portal](https://portal.azure.com) and select **Azure Active Directory** from the left-hand menu.
2. **App Registrations**: Click on **App registrations** in the left-hand menu.
3. **New Registration**: If you don't have an existing app registration, click **New registration** and fill in the required details. Otherwise, select your existing application.
   - **Name**: Enter a name for your application.
   - **Supported account types**: Select the appropriate option based on your requirements.
   - **Redirect URI**: This can be left blank for now, as you will configure it later.
4. **Register**: Click **Register**.

### Step 2: Configure the Application Registration

1. **Redirect URIs**: In your application's registration page, go to **Authentication** and add a platform configuration for **Web**.
   - **Redirect URIs**: Add the URI for your App Service. It should be in the format `https://<your-app-service-name>.azurewebsites.net/.auth/login/aad/callback`.
   - **Logout URL**: (Optional) Set the logout URL if you want users to be redirected to a specific page after logout.
   - **Implicit Grant**: Check the boxes for **ID tokens** and **Access tokens**.
2. **Certificates & Secrets**: Generate a new client secret. (Optional. Needed if you want to use client secret to authenticate into AAD)
   - **Description**: Enter a description for the secret.
   - **Expiration**: Select an appropriate expiration period.
   - **Value**: Save the secret value as it will be needed for your App Service configuration.
3. **Setup the User-Assigned Identity as Federated Identity Credential (FIC) on your App Registration**: (Needed if you want to use FIC instead of client secret.)
   ```
   az rest --method POST --uri "https://graph.microsoft.com/beta/applications/<APP_REGISTRATION_OBJECT_ID>/federatedIdentityCredentials" --body "{'name': 'ManagedIdentityFederation', 'issuer': 'https://login.microsoftonline.com/<tenantid>/v2.0', 'subject': '<MANAGED_IDENTITY_OBJECT_ID>', 'audiences': [ 'api://AzureADTokenExchange' ]}"
   ```

### Step 3: Configure the App Service (using client secret)

1. **Navigate to Your App Service**: Go to your App Service instance in the Azure portal.
2. **Settings**: In the left-hand menu, select **Authentication/Authorization**.
3. **Enable Authentication**: Toggle the switch to **On**.
4. **Add Identity Provider**: Click on **Add identity provider** and choose **Microsoft**.
   - **Client ID**: Enter the Application (client) ID from your Azure AD app registration.
   - **Client Secret**: Enter the client secret that you saved earlier.
   - **Issuer URL**: This is usually in the format `https://login.microsoftonline.com/<tenant-id>/v2.0`. Replace `<tenant-id>` with your Azure AD tenant ID.

### Step 3: Configure the App Service (using FIC)

1. **Navigate to Your App Service**: Go to your App Service instance in the Azure portal.
2. **Add Environment Variable**: Add Env Varaible "OVERRIDE_USE_MI_FIC_ASSERTION_CLIENTID", and store the <ClientID> of the User-Managed Identity from Step 0.
2. **Settings**: In the left-hand menu, select **Authentication/Authorization**.
3. **Enable Authentication**: Toggle the switch to **On**.
4. **Add Identity Provider**: Click on **Add identity provider** and choose **Microsoft**.
   - **Client ID**: Enter the Application (client) ID from your Azure AD app registration.
   - **Client Secret**: Leave it blank
   - **Issuer URL**: This is usually in the format `https://login.microsoftonline.com/<tenant-id>/v2.0`. Replace `<tenant-id>` with your Azure AD tenant ID.
   - **Save the Settings**
5. **Edit Identity Provider**: 
   - **Client Secret**: Select the environment vriable "OVERRIDE_USE_MI_FIC_ASSERTION_CLIENTID"

### Step 4: Configure App Service Authentication Settings

1. **Allowed Token Audiences**: Add the Application (client) ID.
2. **Token Store**: (Optional) Enable token store if you want App Service to store tokens.
3. **Action to Take When Request is Not Authenticated**: Choose **Log in with Azure Active Directory**.
4. **Save**: Click **Save** to apply the changes.

### Step 5: Update Application Code (If Needed)

1. **Access Tokens**: If your application needs to access the user's information or other APIs, you will need to handle the tokens appropriately in your application code.
2. **Authorization**: Ensure your application is configured to handle the authenticated user information and apply the necessary authorization logic.

### Step 6: Testing

1. **Access Your App**: Navigate to your app's URL. You should be redirected to the Azure AD login page.
2. **Login**: Use your Azure AD credentials to log in. After successful authentication, you should be redirected back to your application.

This setup will ensure that your Azure App Service is secured using Azure AD and will authenticate users based on the existing application registration in Entra ID.
