const errorHandler = require("../helpers/errorHandler.helper.js")
const jwt = require("jsonwebtoken")
const {APP_SECRET} = process.env

const authMiddleware = (req, res, next) => {
    try{
        const {authorization: auth}= req.headers
        if(!auth && 
        !auth?.startsWith("Bearer ")){
            throw Error("unauthorized")
        }
        const token = auth.slice(7)
        req.user = jwt.verify(token, APP_SECRET)
        return next()
    } catch(err){
        return errorHandler(res, err)
    }
}

module.exports = authMiddleware
