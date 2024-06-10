const authModel = require("../models/auth.model.js")
const profileModel = require("../models/profile.model")
const forgotRequestModel = require("../models/forgotRequest.model.js")
const errorHandler = require("../helpers/errorHandler.helper.js")
const jwt = require("jsonwebtoken")
const {APP_SECRET} = process.env
const argon = require("argon2")

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await authModel.findOneByEmail(email)
        console.log(user)
        if(!user){
            throw Error("wrong_credentials")
        }
        const verify = await argon.verify(user.password, password)
        console.log(verify)
        console.log(password)   
        console.log(user.password)   
        if(!verify){
            throw Error("wrong_credentials")
        }
        const token = jwt.sign({id: user.id}, APP_SECRET)
        return res.json({
            success: true,
            message: "Login success!",
            results: {token}
        })
    } catch(err) {
        return errorHandler(res, err)
    }
}

exports.register = async (req, res) => {
    try {
        const {full_name, password, confirm_password} = req.body
        if(password !== confirm_password) {
            throw Error("password_unmatch")
        }
        const hash = await argon.hash(password)
        const data = {
            ...req.body,
            password: hash
        }
        const user = await authModel.insert(data) //insert ke table users
        const profileData = {
            full_name,
            user_id: user.id
        }
        await profileModel.insert(profileData)  //insert ke tabel profile
        const token = jwt.sign({id: user.id}, APP_SECRET)
        return res.json({
            success: true,
            message: "Register success!",
            results: {token}
        })
    } catch (err){
        return errorHandler(res, err)
    }
}
exports.forgotPassword = async (req, res) => {
    try {
        const {email} = req.body
        // const {emailParams} = req.params
        const user = await authModel.findOneByEmail(email)
        if(!user){
            throw Error("no_user")
        }
        const deleteForgot = await forgotRequestModel.destroyByEmail(email)
        if(deleteForgot){
            return res.json({
                success: true,
                message: "Renewal Email Request for Forgot Password Accepted",
                results: deleteForgot
            })
        }
        const randomNumber = Math.random()
        const rounded = Math.round(randomNumber * 100000)
        const padded = String(rounded).padEnd(6, "0")
        
        const forgot = await forgotRequestModel.insert({
            email: user.email,
            code: padded
        })
        if(!forgot){
            throw Error("forgot_failed")
        }
        return res.json({
            success: true,
            message: "Request reset password success"
        })
    } catch(err) {
        return errorHandler(res, err)
    }
}

exports.resetPassword = async (req, res) => {
    try{
        const {code, email, password} = req.body
        const find = await forgotRequestModel.findOneByCodeAndEmail(code, email)
        if(!find){
            throw Error("no_forget_requested")
        }
        const selectedUser = await authModel.findOneByEmail(email)
        const data = {
            password: await argon.hash(password)
        }
        const deleting = await forgotRequestModel.destroy(find.id) //menghapus id dari tabel forgotRequestModel
        if(deleting){
            const user = await authModel.update(selectedUser.id, data)
            if(!user){
                throw Error("no_forget_requested")
            }
            return res.json({
                success: true,
                message: "Reset password success"
            })
        }
        
    }catch(err){
        return errorHandler(res, err)
    }
}
