const itemOfficerRouter = require("express").Router()
// const validate = require("../middlewares/validator.middleware")


const routerController = require("../../controllers/item-assesment.controller")
const authMiddleware = require('../../middlewares/auth.middleware');

itemOfficerRouter.get("/", authMiddleware, routerController.getItemOfficer)
itemOfficerRouter.get("/:id", authMiddleware, routerController.getOneItemOfficer)
itemOfficerRouter.post("/", authMiddleware, routerController.createItemOfficer)
itemOfficerRouter.patch("/:id", authMiddleware, routerController.updateItemOfficer)
itemOfficerRouter.delete("/:id", authMiddleware, routerController.deleteItemOfficer)
// itemOfficerRouter.post("/reset-password", validate("resetPassword"), routerController.resetPassword)

module.exports = itemOfficerRouter
