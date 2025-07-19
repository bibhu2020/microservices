const checkAuthStatus = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        //res.redirect("/auth/login");
        //return;
        return res.status(401).send("You need to log in to access this page.");
    } 
    next();
};

const checkSREAdminRole = (req, res, next) => {
    const roles = res.locals.roles;
    if (roles && !roles.includes('sreadmin')) {
        return res.status(403).send('Forbidden: You do not have the required role (sreadmin).');
    } 
    next();
};

const checkSuperAdminRole = (req, res, next) => {
    const roles = res.locals.roles;
    if (roles && !roles.includes('superadmin')) {
        return res.status(403).send('Forbidden: You do not have the required role (superadmin).');
    } 
    next();
};

export { checkAuthStatus, checkSREAdminRole, checkSuperAdminRole };