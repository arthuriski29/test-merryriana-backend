const itemRouter = require("express").Router()
const uploadMiddleware = require("../../middlewares/upload.middleware")
// const validate = require("../middlewares/validator.middleware")


const financeController = require("../../controllers/item-assesment.controller")
const approveController = require("../../controllers/approval.controller")
const authMiddleware = require('../../middlewares/auth.middleware');

itemRouter.get("/", authMiddleware, financeController.getAllItemFinance)
itemRouter.get("/:id", authMiddleware, financeController.getOneItemFinance)
itemRouter.patch("/approve/:id", uploadMiddleware("invoice_picture"), authMiddleware, approveController.actionApprovalFinance)

// itemRouter.post("/", authMiddleware, financeController.createItemOfficer)
// itemRouter.patch("/:id", authMiddleware, financeController.updateItemOfficer)
// itemRouter.delete("/:id", authMiddleware, financeController.deleteItemOfficer)
// itemRouter.post("/reset-password", validate("resetPassword"), financeController.resetPassword)

module.exports = itemRouter
