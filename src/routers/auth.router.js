const authRouter = require("express").Router()
const validate = require("../middlewares/validator.middleware")


const authController = require("../controllers/auth.controller")

authRouter.post("/login", validate("authLogin"), authController.login)
authRouter.post("/register", authController.register)
authRouter.post("/forgot-password", authController.forgotPassword)
authRouter.post("/reset-password", validate("resetPassword"), authController.resetPassword)

module.exports = authRouter
