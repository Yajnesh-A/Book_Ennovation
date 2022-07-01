function userAuth(req, res, next) {
    if (req.user == null) {
        res.status(404)
        return res.send("You need to login")
    }

    next()
}

function userType(type) {
    return (req, res, next) => {
        if (req.user.userType !== type) {
            res.status(401)
            return res.send("Not allowed\nOnly an Admin user can access this page")
        }

        next()
    }
}

module.exports = {
    userAuth,
    userType
}