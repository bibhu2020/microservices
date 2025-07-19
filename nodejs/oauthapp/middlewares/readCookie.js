const readCookie = (req, res, next) => {
    res.locals.accessToken = (req.cookies.accessToken ? req.cookies.accessToken : null);
    res.locals.refreshToken = (req.cookies.refreshToken ? req.cookies.refreshToken : null);
    res.locals.account = (req.cookies.account ? req.cookies.account : null);

    res.locals.userName = (req.cookies.userName ? req.cookies.userName : null);
    res.locals.userId = (req.cookies.userId ? req.cookies.userId : null);
    res.locals.roles = (req.cookies.roles ? req.cookies.roles : null);

    //console.log("res.locals.userName: " + res.locals.userName);

    next();
};

export default readCookie;

