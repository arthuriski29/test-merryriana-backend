const adminRouter = require("express").Router()
// const validate = require("../middlewares/validator.middleware")


const adminController = require("../../controllers/admin/register.admin.js")
const authMiddleware = require('../../middlewares/auth.middleware.js');

// adminRouter.post("/", validate("authLogin"), adminController.login)
adminRouter.post("/register", authMiddleware, adminController.register)
// adminRouter.post("/forgot-password", adminController.forgotPassword)
// adminRouter.post("/reset-password", validate("resetPassword"), adminController.resetPassword)

module.exports = adminRouter
