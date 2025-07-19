# Zip the Node.js application in the current directory without printing to console
#zip -ru app.zip . -x "app.zip" -x ".env" -x "package-lock.json" -x "node_modules/*" > /dev/null 2>&1
zip -ru app.zip . -x "app.zip" -x ".env" > /dev/null 2>&1

az functionapp deployment source config-zip --resource-group oauthpocrg --name oauthfun --src app.zip


# Single Line Command
func azure functionapp publish oauthfun --build remote


