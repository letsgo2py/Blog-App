// const sessionIdToUserMap = new Map();
require('dotenv').config();

const jwt = require('jsonwebtoken')
// const secret = TOKEN_KEY
const secret = process.env.TOKEN_KEY;

function setUser(user){
    // sessionIdToUserMap.set(id, user);
    return jwt.sign({
        _id: user._id,
        email: user.email,
    }, secret);
}

function getUser(token) {
    // return sessionIdToUserMap.get(id);
    try{
        return jwt.verify(token, secret)
    }catch(error){
        return null;
    }
}

module.exports = {
    setUser,
    getUser,
}