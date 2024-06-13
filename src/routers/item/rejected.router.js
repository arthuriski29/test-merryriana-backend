const rejectedRouter = require("express").Router()
// const validate = require("../middlewares/validator.middleware")


const routerController = require("../../controllers/reject.controller")
const authMiddleware = require('../../middlewares/auth.middleware');

rejectedRouter.get("/", authMiddleware, routerController.getAllDoneReject)
// rejectedRouter.get("/:id", authMiddleware, routerController.getOneItemOfficer)
// rejectedRouter.post("/", authMiddleware, routerController.createItemOfficer)
// rejectedRouter.patch("/:id", authMiddleware, routerController.updateItemOfficer)
// rejectedRouter.delete("/:id", authMiddleware, routerController.deleteItemOfficer)
// rejectedRouter.post("/reset-password", validate("resetPassword"), routerController.resetPassword)

module.exports = rejectedRouter
