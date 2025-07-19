import catchAsync from "../utility/catchAsync.js";
import ClientApp from "../utility/clientAppClientCode.js";
import axios from 'axios';
import fs from 'fs';

// ***********************************It uses client code flow to authenticate the user
// *************************************************************************************************************
class AuthController {
    constructor() {
        // Bind methods to the instance
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.callback = this.callback.bind(this);
        this.profile = this.profile.bind(this);
        this.refreshToken = this.refreshToken.bind(this);
        this.downloadUserPhoto = this.downloadUserPhoto.bind(this);
        this.scopes = ['openid', 'profile', 'email', 'offline_access', 'User.Read'];
    }

    login = catchAsync(async (req, res, next) => {
        const authCodeUrlParameters = {
            scopes: this.scopes,
            redirectUri: process.env.REDIRECT_URI,
            prompt: 'consent', // Enforce the consent prompt
            extraQueryParameters: { include_pending_consent_scopes: 'true' },
        };

        const accessToken = res.locals.accessToken; //req.cookies.accessToken;
        // If the user is already authenticated with token in the cookie, display user profile
        if(accessToken) {
            console.log("accessToken length: " + accessToken.length);
            res.redirect("/auth/profile");
            return;
        }

        //console.log("CREDENTIAL_TYPE: " + process.env.CREDENTIAL_TYPE);
        console.log("Authorization initiates.........");
        
    
        try {
            console.log("Authorization Step1: Requesting the Authroization Code...")
            const client = await ClientApp.getInstance();
            //request the authorization code
            const authCodeUrl = await client.getAuthCodeUrl(authCodeUrlParameters);
            res.redirect(authCodeUrl); //redirects to callback URL
            return;
        } catch (error) {
            console.log(error);
            next(error);
        }
    });

    callback = catchAsync(async (req, res, next) => {
        const tokenRequest = {
            code: req.query.code,
            scopes: this.scopes,
            redirectUri: process.env.REDIRECT_URI,
            prompt: 'consent', // Enforce the consent prompt
            extraQueryParameters: { include_pending_consent_scopes: 'true' },
        };

        console.log("Authorization Step1: Received the Authorization Code: " + req.query.code);

        try {
            console.log("Authorization Step2: Requesting the Access Token using Authorization Code...")
            const client = await ClientApp.getInstance();
            //Request access token
            const response = await client.acquireTokenByCode(tokenRequest);

            console.log("Authorization Step1: User Access Token: " + response.accessToken);

            const refreshToken = await client.getRefreshTokenFromCache();

            if (response && refreshToken) {
                res.cookie('userName', response.account.name, { httpOnly: false, secure: false });
                res.cookie('userId', response.idTokenClaims.oid, { httpOnly: false, secure: false });
                res.cookie('roles', response.idTokenClaims.roles || [], { httpOnly: false, secure: false });
                res.cookie('accessToken', response.accessToken, { httpOnly: false, secure: false });
                res.cookie('refreshToken', refreshToken, { httpOnly: false, secure: false });
                res.cookie('account', JSON.stringify(response.account, null, 2), { httpOnly: true, secure: false });
                res.clearCookie('activeNavItem');

                res.redirect("/auth/profile");
            } else {
                throw new Error('Refresh token not provided in response');
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
        return;
    });


    downloadUserPhoto = async (accessToken, userId) => {
        try {

            const outputPath = './public/photos/'; // Output directory
            // Ensure the output directory exists
            if (!fs.existsSync(outputPath)) {
                console.log(outputPath);
                fs.mkdirSync(outputPath, { recursive: true });
            }

            // Fetch the user's photo using Axios
            const response = await axios.get(`https://graph.microsoft.com/v1.0/users/${userId}/photo/$value`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'image/jpeg',
                },
                responseType: 'arraybuffer' // Important to get the binary data
            });

            // Define the photo file path
            const photoPath = `${outputPath}${userId}.jpg`;

            // Write the photo to a local file
            fs.writeFileSync(photoPath, response.data);

            //console.log(`Photo saved to ${photoPath}`);

            // Return the image URL
            return photoPath;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Handle the case where the photo is not found
                console.log("User photo not found.");
                return "#"; // or return a placeholder image URL if you have one
            } else {
                // Re-throw the error if it's not a 404
                throw error;
            }
        }
    };

    profile = catchAsync(async (req, res, next) => {
        //console.log("Reading authorization data from the cookie since the user is already authorized.")
        try {
            // const userName = req.cookies.userName;
            if (res.locals.userName) {
                const data = {
                    banner: "Azure AD Authentication and Authorization",
                    userName: res.locals.userName,
                    userInfo: res.locals.account,
                    userRoles: res.locals.roles,
                };

                try {
                    await this.downloadUserPhoto(res.locals.accessToken,res.locals.userId);
                    logger.logEvent({name: "UserLogIn",  // Name of the event
                                    properties: {        // Custom properties (optional)
                                        userName: userName,
                                        userInfo: userInfo
                                    }
                                });
                }catch (err) {
                    console.log('Photo not found: ' + err);
                }
                
                res.render('auth/user', { data: data });
            }
            return;
        }
        catch (err) {
            console.log("Error reading profile photo");
            next(err);
        }
        return;
    });

    logout = catchAsync(async (req, res, next) => {
        req.session.destroy((err) => {
            if (err) {
                return console.log(err);
            }

            logger.logEvent({name: "UserLogOut",  // Name of the event
                properties: {        // Custom properties (optional)
                    userName: res.locals.userName,
                    userInfo: res.locals.account
                }
            });


            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            res.clearCookie('userName');
            res.clearCookie('userId');
            res.clearCookie('roles');
            res.clearCookie('account');
            res.clearCookie('activeNavItem');
            res.clearCookie('customApiAccessToken');

            res.redirect('/');
        });
        return;
    });

    refreshToken = catchAsync(async (req, res, next) => {
        const { refreshToken } = req.body;

        console.log('Refresh Token: ' + refreshToken);

        if (!refreshToken) {
            return res.status(401).json({ success: false, message: 'Refresh token is missing' });
        }

        try {
            console.log("Refreshing the accessToken......")
            const client = await ClientApp.getInstance();
            const response = await client.acquireTokensUsingRefreshToken(refreshToken, this.scopes );
            //refreshToken = await client.getRefreshTokenFromCache();

            res.cookie('accessToken', response.accessToken, { httpOnly: true, secure: false });
            res.cookie('refreshToken', response.refreshToken, { httpOnly: true, secure: false });

            res.json({ success: true });
        } catch (error) {
            console.log('Error refreshing token:', error);
            //res.status(401).json({ success: false, message: 'Failed to refresh token' });
            next(error);
        }
    });

}

export default AuthController;
