import catchAsync from '../utility/catchAsync.js'
import TokenCredential from "../utility/tokenCredential.js"
import axios from 'axios';
import jwt from 'jsonwebtoken';

class GraphController {
    constructor(){
    }

    // Behind the scence, it uses OAuth client credential flow
    listusers = catchAsync(async (req, res, next) => {
        try {

            //this is not required in production where your credentialType does not change
            //it destrocys the singleton TokenCredential class and create a fresh with new credentialType
            await TokenCredential.destroyInstance(); 

            const credentialType = req.query.accessMethod ? req.query.accessMethod.toUpperCase() : "CS";
            const credential = await TokenCredential.getInstance(credentialType, null);
            const tokenRequest = {
                scopes: ["https://graph.microsoft.com/.default"],
            };

            const accessToken = await credential.refreshAccessToken(tokenRequest, false);
            
            const { jobTitle, officeLocation } = req.query;

            let filter = '';
            if (jobTitle) {
                filter += `jobTitle eq '${jobTitle}'`;
            }
            if (officeLocation) {
                if (filter) filter += ' and ';
                filter += `officeLocation eq '${officeLocation}'`;
            }

            const response = await axios.get('https://graph.microsoft.com/v1.0/users', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                params: {
                    $select: 'displayName,mail,userPrincipalName,jobTitle,officeLocation,department,accountEnabled,mobilePhone',
                    $filter: filter,
                    $top: 10  // Limit to top 10 results
                }
            });

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({
                status: 'success',
                data: {
                    users: response.data,
                    accessMethod: req.app.locals.accessMethod,
                    accessToken: jwt.decode(accessToken),
                    bearerToken: req.app.locals.bearerTokenDecoded,
                }
            });
        }catch (error) {
            console.error("An error occurred while listing the users:", error);
            next(error);
        }
    });


    // Behind the scence, it uses OAuth client credential flow
    listgroups = catchAsync(async (req, res, next) => {
        try {

            //this is not required in production where your credentialType does not change
            //it destrocys the singleton TokenCredential class and create a fresh with new credentialType
            await TokenCredential.destroyInstance(); 

            const groupId = req.query.groupId || 'undefined';

            if (groupId === 'undefined') {
                res.setHeader('Content-Type', 'application/json');
                res.status(404).json({data: 'Group Id is required'});
            }

            const credentialType = req.query.accessMethod ? req.query.accessMethod.toUpperCase() : "CS";
            const credential = await TokenCredential.getInstance(credentialType, null);
            const tokenRequest = {
                scopes: ["https://graph.microsoft.com/.default"],
            };

            const accessToken = await credential.refreshAccessToken(tokenRequest, false);

            //const groupId = "2f335882-4961-4773-a8d6-dc4e6f45d881";
            
            const response = await axios.get(`https://graph.microsoft.com/v1.0/groups/${groupId}/members`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                params: {
                    $select: 'displayName,mail,userPrincipalName,jobTitle,officeLocation,id'
                }
            });
    
            const members = response.data.value;
            console.log('Group Members:', members);

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({
                status: 'success',
                data: members
            });
        }catch (error) {
            console.error("An error occurred while listing the users:", error);
            next(error);
        }
    });

}
  
export default GraphController;
  