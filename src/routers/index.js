
const router = require('express').Router()

router.get("/", (req, res) => {
  return res.json({
      success: true,
      message: "Backend is running well"
  })
})

router.use("/admin", require("./admin/admin.router"))
router.use("/auth", require("./auth.router"))
router.use("/profile", require("./profile.router"))
router.use("/item-list", require("./item/index"))


router.use("*", (req, res) => {
  return res.status(404).json({
      success: false,
      message: "Resource not found"
  })
})

module.exports = router