# Zip the Node.js application in the current directory without printing to console
zip -ru app.zip . -x "app.zip" -x ".env" -x "package-lock.json" -x "node_modules/*" > /dev/null 2>&1


# Upload the zip file to Azure App Service
#az webapp deployment source config-zip --resource-group FICTESTING_RG --name fictokentestingapi --src app.zip

#az webapp deployment source config-zip --resource-group kube9t.com --name oauth20api --src app.zip

az webapp deployment source config-zip --resource-group oauthpocrg --name oauthaapi --src app.zip

az webapp deployment source config-zip --resource-group communicationservice-RG --name gdcwebopsemail --src app.zip

# remove zip
#rm app.zip


