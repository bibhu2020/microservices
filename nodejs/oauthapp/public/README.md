# Overview
This is a nodejs UI that demos EasyAuth (authentication using AAD), and role-based access web pages.


# Adding User Managed Identity (assigned to app service) to FIC
export APP_REGISTRATION_OBJECT_ID=afd3dd3a-43bf-40d2-aab8-4878dcc847ca ##fictokentesting
export MANAGED_IDENTITY_OBJECT_ID=348f8795-4f33-43c0-833c-67358c90ac73

az rest --method POST --uri "https://graph.microsoft.com/beta/applications/${APP_REGISTRATION_OBJECT_ID}/federatedIdentityCredentials" --body "{'name': 'ManagedIdentityFederation', 'issuer': 'https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/v2.0', 'subject': '${MANAGED_IDENTITY_OBJECT_ID}', 'audiences': [ 'api://AzureADTokenExchange' ]}"

# Download the Auth settings from App Service
export SUBSCRIPTION=dc276571-9aac-4771-8451-c6ab5a4e058a
export RESOURCE_GROUP=FICTESTING_RG
export APP_SERVICE=fictokentestingui

az rest --uri /subscriptions/${SUBSCRIPTION}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.Web/sites/${APP_SERVICE}/config/authsettingsV2?api-version=2022-03-01 --method get > auth.json

# Upload the Auth settings to App Service
az rest --uri /subscriptions/${SUBSCRIPTION}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.Web/sites/${APP_SERVICE}/config/authsettingsV2?api-version=2022-03-01 --method put --body @auth.json
