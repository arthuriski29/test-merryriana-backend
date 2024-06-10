const router = require('express').Router()

router.get("/", (req, res) => {
  return res.json({
      success: true,
      message: "Backend is running well"
  })
})

router.use("/auth", require("./auth.router"))


router.use("*", (req, res) => {
  return res.status(404).json({
      success: false,
      message: "Resource not found"
  })
})

module.exports = router