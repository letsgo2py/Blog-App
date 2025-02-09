const { getUser } = require('../service/auth')

function checkAuth(req, res, next) {
    const userUid = req.cookies.uid;
    
    if (!userUid) {
        res.locals.isLogin = false;
    } else {
        const user = getUser(userUid);
        if (user) {
            res.locals.isLogin = true;
            req.user = user; // Attach user data to the request
        } else {
            res.locals.isLogin = false;
        }
    }

    next(); // Move to the next middleware or route handler
}

module.exports = {
    checkAuth,
}