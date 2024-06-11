const itemRouter = require("express").Router()
// const validate = require("../middlewares/validator.middleware")


const routerController = require("../../controllers/item-assesment.controller")
const authMiddleware = require('../../middlewares/auth.middleware');

itemRouter.get("/officer", authMiddleware, routerController.getItemOfficer)
itemRouter.get("/officer/:id", authMiddleware, routerController.getOneItemOfficer)
itemRouter.post("/officer", authMiddleware, routerController.createItemOfficer)
itemRouter.patch("/officer/:id", authMiddleware, routerController.updateItemOfficer)
itemRouter.delete("/officer/:id", authMiddleware, routerController.deleteItemOfficer)
// itemRouter.post("/reset-password", validate("resetPassword"), routerController.resetPassword)

module.exports = itemRouter
