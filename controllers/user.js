// const {v4 : uuidv4} = require('uuid')
const User = require('../models/user')
const { setUser } = require('../service/auth')


async function handleSignup(req, res) {
    const {username, email, password } = req.body;
    await User.create({
        username, email, password,
    })

    return res.redirect("/")
}

async function handleLogin(req, res) {
    const {email, password } = req.body;
    //const user = await User.findOne({ email, password })
    const user = await User.matchPassword(email, password)
    if(user.error)
        return res.render("login.ejs", {
            error: "Invalid Email or Password"
        })
    
    // const sessionId = uuidv4();
    const token = setUser(user)
    res.cookie("uid", token);  // sending the cookie to client and in cookie there is an uuid/token
    return res.redirect("/") 
}

module.exports = {
    handleSignup,
    handleLogin
}