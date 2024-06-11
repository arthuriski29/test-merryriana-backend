const profileRouter = require("express").Router()
// const validate = require("../middlewares/validator.middleware")


const profileCOntroller = require("../controllers/profile.controller")
const authMiddleware = require('../middlewares/auth.middleware');

profileRouter.get("/:id", authMiddleware, profileCOntroller.getProfile)
// profileRouter.post("/login", validate("authLogin"), profileCOntroller.login)
// profileRouter.post("/register", authMiddleware, profileCOntroller.register)
// profileRouter.post("/forgot-password", profileCOntroller.forgotPassword)
// profileRouter.post("/reset-password", validate("resetPassword"), profileCOntroller.resetPassword)

module.exports = profileRouter
