const authRouter = require("express").Router()
const validate = require("../middlewares/validator.middleware")


const authController = require("../controllers/auth.controller")
const authMiddleware = require('../middlewares/auth.middleware');

authRouter.post("/login", validate("authLogin"), authController.login)
authRouter.post("/register", authMiddleware, authController.register)
authRouter.post("/forgot-password", authController.forgotPassword)
authRouter.post("/reset-password", validate("resetPassword"), authController.resetPassword)

module.exports = authRouter
