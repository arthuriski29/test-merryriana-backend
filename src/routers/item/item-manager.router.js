const itemRouter = require("express").Router()
// const validate = require("../middlewares/validator.middleware")


const itemController = require("../../controllers/item-assesment.controller")
const rejectController = require("../../controllers/reject.controller")
const authMiddleware = require('../../middlewares/auth.middleware');

itemRouter.get("/", authMiddleware, itemController.getAllItemManager)
itemRouter.get("/:id", authMiddleware, itemController.getOneItemManager)
// itemRouter.post("/", authMiddleware, itemController.createItemOfficer)
itemRouter.patch("/approve/:id", authMiddleware, itemController.giveApprovalManager)
itemRouter.patch("/reject/:id", authMiddleware, rejectController.actionRejectedManager)
// itemRouter.delete("/:id", authMiddleware, itemController.deleteItemOfficer)
// itemRouter.post("/reset-password", validate("resetPassword"), itemController.resetPassword)

module.exports = itemRouter
