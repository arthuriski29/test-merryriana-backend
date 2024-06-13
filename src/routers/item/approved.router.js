const approvedRouter = require("express").Router()
// const validate = require("../middlewares/validator.middleware")


const routerController = require("../../controllers/approval.controller")
const authMiddleware = require('../../middlewares/auth.middleware');

approvedRouter.get("/", authMiddleware, routerController.getAllDoneApprove)
// approvedRouter.get("/:id", authMiddleware, routerController.getOneItemOfficer)
// approvedRouter.post("/", authMiddleware, routerController.createItemOfficer)
// approvedRouter.patch("/:id", authMiddleware, routerController.updateItemOfficer)
// approvedRouter.delete("/:id", authMiddleware, routerController.deleteItemOfficer)
// approvedRouter.post("/reset-password", validate("resetPassword"), routerController.resetPassword)

module.exports = approvedRouter
