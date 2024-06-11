const errorHandler = require("../helpers/errorHandler.helper")
// const fileRemover = require("../helpers/fileRemover.helper")
const roleModel = require("../models/role.model")
const profileModel = require("../models/profile.model")
// const userModel = require("../models/user.model")

// exports.updateProfile = async(req, res) => {
//     try {
//         const {id} = req.user
//         const user = await profileModel.findOneByUserId(id)
//         console.log(user)
//         const data = {
//             ...req.body
//         }
//         if(req.file){
//             if(user.picture){
//                 console.log(user.picture)
//                 fileRemover({filename: user.picture})
//             }
//             // data.picture = req.file.filename
//             data.picture = req.file.path
//         }
//         const profile = await profileModel.updateByUserId(id, data)
//         if(!profile){
//             throw Error("update_profile_failed")
//         }
//         let updatedUser
//         if(data.email){
//             updatedUser = await userModel.update(id, data)
//         }else{
//             updatedUser = await userModel.findOne(id)
//         }
//         const results = {
//             ...profile,
//             email: updatedUser?.email,
//             username: updatedUser?.username
//         }
//         return res.json({
//             success: true,
//             message: "Profile updated",
//             results
      
//         })
//     } catch (error) {
//         return errorHandler(res, error)
//     }
// }
exports.getProfile = async (req, res) => {
    try {
        const {id, role} = req.user
        console.log(req.user)
        console.log('req.user', id, role)
        const profile = await profileModel.findOneByUserId(id)
        const roleName = await roleModel.findOne(role)
        if(!profile){
            throw Error("profile_not_found")
        }
        if(!role){
            throw Error("unauthorized_user_no_role")
        }
        const data = {
            role: roleName.name,
            ...profile
        }
        return res.json({
            success: true,
            message: "Profile",
            results: data
        })
    } catch (error) {
        return errorHandler(res, error)
    }
}
