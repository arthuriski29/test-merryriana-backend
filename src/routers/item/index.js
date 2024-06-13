const { getAll, getOne} = require('../../controllers/item-assesment.controller')
const authMiddleware = require('../../middlewares/auth.middleware')

const itemListRouter = require('express').Router()


itemListRouter.use("/officer", require("./item-officer.router"))
itemListRouter.use("/manager", require("./item-manager.router"))
itemListRouter.use("/finance", require("./item-finance.router"))
itemListRouter.use("/rejected", require("./rejected.router"))
itemListRouter.use("/approved", require("./approved.router"))



itemListRouter.get("/", authMiddleware, getAll)
itemListRouter.get("/:id", authMiddleware, getOne)


module.exports = itemListRouter