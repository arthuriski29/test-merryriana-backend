const authModel = require("../../models/auth.model.js")
const profileModel = require("../../models/profile.model.js")
// const roleModel = require("../../models/role.model.js")
const errorHandler = require("../../helpers/errorHandler.helper.js")
const jwt = require("jsonwebtoken")
const {APP_SECRET} = process.env
const argon = require("argon2")

exports.register = async (req, res) => {
  try {
      // const {role} = req.user
      // if(role !== 1) {
      //   throw Error('unauthorized_user');
      // }
      const {full_name, password, confirm_password} = req.body
      if(password !== confirm_password) {
        throw Error("password_unmatch")
      }
      const hash = await argon.hash(password)

      // const roleData = await roleModel.findOne(role_id)
      // if(!roleData){
      //   throw Error("role_is_not_registered")
      // }
      const data = {
          ...req.body,
          password: hash,
          role_id: 1 //ROLE ADMIN FIX
      }
      const user = await authModel.insert(data) //insert ke table users
      const profileData = {
          full_name,
          user_id: user.id
      }
      await profileModel.insert(profileData)  //insert ke tabel profile
      const token = jwt.sign({id: user.id}, APP_SECRET)
      return res.json({
          success: true,
          message: "Register success!",
          results: {token}
      })
  } catch (err){
      return errorHandler(res, err)
  }
}