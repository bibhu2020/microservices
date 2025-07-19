import { SecretClient } from '@azure/keyvault-secrets';
import catchAsync from '../utility/catchAsync.js'
import TokenCredential from "../utility/tokenCredential.js"

class AzureController {
    constructor(){
        // const accessMethod = req.query.accessMethod ? req.query.accessMethod.toUpperCase() : "CS";
        // this.credential = TokenCredential.getInstance(accessMethod);
    }

    listKeyVaultSecrets = catchAsync(async (req, res, next) => {
        const secrets = [];
        try {
            const kvName = req.query.name || 'undefined';
            //console.log("Key Vault Name: " + kvName);
            const tokenRequest = {
                scopes: ["https://vault.azure.net/.default"],
            };

            const credentialType = req.query.accessMethod ? req.query.accessMethod.toUpperCase() : "CS";
            const bearerToken = req.app.locals.bearerToken || null;

            await TokenCredential.destroyInstance(); //this is not required in production where your credentialType does not change

            const credential = await TokenCredential.getInstance(credentialType, bearerToken);
            const accessToken = await credential.refreshAccessToken(tokenRequest, true);
            //const credential = await tokenCredential.getCredential(tokenRequest);

            const keyVaultClient = new SecretClient(`https://${kvName}.vault.azure.net/`, credential);
            //const accessToken = "";//await credential.getAccessToken(true);

            // List all secrets in the Key Vault
            //console.log("Listing secrets in the Key Vault:");
            for await (let secretProperties of keyVaultClient.listPropertiesOfSecrets()) {
                // Get the secret value
                const secret = await keyVaultClient.getSecret(secretProperties.name);

                // Add to the secrets array
                secrets.push({
                    keyVaultName: kvName,
                    secretName: secretProperties.name,
                    secretValue: secret.value,
                });
            }

            res.setHeader('Content-Type', 'application/json');

            res.status(200).json({
                status: 'success',
                data: {
                    secrets: secrets,
                    accessMethod: req.app.locals.accessMethod,
                    accessToken: accessToken,
                    bearerToken: req.app.locals.bearerTokenDecoded,
                }
            });

        }catch (error) {
            console.error("An error occurred while listing the secrets:", error);
            next(error);
        }
    });
}
  
export default AzureController;
  