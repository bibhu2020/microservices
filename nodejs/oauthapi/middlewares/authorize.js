import { expressjwt } from 'express-jwt';
import jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';

const autorizeRequest = (req, res, next) => {

  const [scheme, token] = req.headers.authorization.split(' ');

  if (scheme === 'Bearer') {

    const decodedToken = jwt.decode(token);
    const oauth_version = decodedToken.ver;
    const audience = (oauth_version === "1.0" ? `api://${process.env.AZURE_CLIENT_ID}` : `${process.env.AZURE_CLIENT_ID}`);
    const issuer = (oauth_version === "1.0" ? `https://sts.windows.net/${process.env.AZURE_TENANT_ID}/` : `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0`);

    // Invoke express-jwt to verify the token
    expressjwt({
      secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/discovery/v2.0/keys`
      }),
      audience: audience,
      issuer: issuer,
      algorithms: ['RS256']
    })(req, res, (err) => {
        if (err) {
          return res.status(403).json({ error: 'Unauthorized: Invalid bearer token' });
      }
      next();
    });
  }

  if (scheme === 'ApiKey') {
    if (token !== process.env.API_KEY) {
      return res.status(403).json({ error: 'Unauthorized: Invalid Api Key' });
    }
    else {
      next()
    }
  }

};

// const checkJwt = expressjwt({
//   secret: jwksRsa.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/discovery/v2.0/keys`
//   }),
//   audience: `api://${process.env.AZURE_CLIENT_ID}`,
//   issuer: `https://sts.windows.net/${process.env.AZURE_TENANT_ID}/`,
//   algorithms: ['RS256']
// });

//Note: Issuer uses private-public key available in https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/discovery/v2.0/keys to sign the jwt token.
// Hence, forging a token is not possible

const checkRole = (role) => {
  return (req, res, next) => {
    //const token = req.headers.authorization.split(' ')[1];
    const [scheme, token] = req.headers.authorization.split(' ');
    const decodedToken = jwt.decode(token);
    
    if (decodedToken && decodedToken.roles && decodedToken.roles.includes(role)) {
      return next();
    } else {
    console.log("Warning: token has missing role.");
      return res.status(403).json({ message: 'Forbidden - insufficient role' });
    }
  };
};

//Validate if the token has the required role OR the scope
const checkScopeAndRole = (requiredRole, requiredScope) => {
    return (req, res, next) => {

        const bearerToken = req.headers?.authorization?.split(' ')[1] || null;
        const decodedToken = jwt.decode(bearerToken);

        const tokenRoles = decodedToken?.roles || [];
        const hasRequiredRole = (tokenRoles && tokenRoles.length > 0 && tokenRoles.includes(requiredRole));

        const tokenScopes = decodedToken?.scp?.split(' ') || [];
        const hasRequiredScope = (tokenScopes && tokenScopes.length > 0 && tokenScopes.includes(requiredScope));
        
        if (hasRequiredScope || hasRequiredRole) {
          return next();
        } else {
        console.log("Warning: token has missing role or scope.");
          return res.status(403).json({ message: 'Forbidden - insufficient role or scope' });
        }
    };
}

const checkScopes = (requiredScopes) => {
    return (req, res, next) => {
      const tokenScopes = req.user?.scope?.split(' ') || [];
      const hasRequiredScopes = requiredScopes.every(scope => tokenScopes.includes(scope));
  
      if (hasRequiredScopes) {
        next();
      } else {
        console.log("Warning: token has missing scope.");
        res.status(403).json({ message: 'Forbidden - insufficient scope' });
      }
    };
  };

const decodeRequest = (req, res, next) => {
    req.app.locals.bearerToken = null;
    req.app.locals.accessMethod = null;
    req.query.accessMethod = req.query.accessMethod ? req.query.accessMethod.toUpperCase() : "CS";
    switch (req.query.accessMethod) {
      case 'MI':
        req.app.locals.accessMethod = 'Managed Identity';
        break;
      case 'FIC':
        req.app.locals.accessMethod = 'Federated Identity Credential';
        break;
      case 'UT':
        req.app.locals.accessMethod = 'User Access Token';
        break;
      default:
        req.app.locals.accessMethod = 'Client Secret';
    }

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7, authHeader.length); // Extract the token part
      try {
        const decodedToken = jwt.decode(token, { complete: true });
        req.app.locals.bearerToken = token;
        req.app.locals.bearerTokenDecoded = decodedToken;
        //console.log('accessToken recevied by API:', decodedToken);
      } catch (error) {
        console.error('Error decoding token:', error);
        next(error);
      }
    }
    next();
  };

export { autorizeRequest, checkRole, decodeRequest, checkScopes, checkScopeAndRole };
