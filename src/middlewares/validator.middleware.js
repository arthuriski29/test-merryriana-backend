const {body, query, param, validationResult} = require("express-validator")
// const errorHandler = require("../helpers/errorHandler.helper")
// const fileRemover = require("../helpers/fileRemover.helper")
 

//format variable
const emailFormat = body("email").isEmail().withMessage("Email is invalid")
const passwordFormatLogin = body("password").isLength({min:1}).withMessage("Password is invalid")
const strongPassword = body("password").isStrongPassword().withMessage("Password must be strong")
const fullNameFormat = body("fullName").isLength({min: 3, max: 80}).withMessage("Name length si invalid")
const userNameFormat = body("username").isLength({min: 3, max: 20}).withMessage("Username length si invalid")
const nameBodyFormat = body("name").isLength({min: 3, max: 20}).withMessage("name length si invalid")
// const nameParamsFormat = query("name").isLength({min: 3, max: 20}).withMessage("name length si invalid")
const idParamsFormat = param("id").toInt().isDecimal().withMessage("Id is invalid").isInt({min: 1}).withMessage("Id have to be more than 0")
const sortParamsFormat = query("sort").isIn(["id", "userame"]).withMessage("Sort by userame or ID").optional({nullable: true})
const sortByParamsFormat = query("sortBy").isIn(["ASC", "DESC"]).withMessage("Sort type is invalid").optional({nullable: true})
const limitParamsFormat = query("limit").toInt().isDecimal().withMessage("Input must be a number").optional({nullable:true})
const genderFormat = body("gender").isBoolean().withMessage("Gender should be clicked between Male and Female").optional({nullable:true})
const phoneFormat = body("phoneNumber").isMobilePhone().withMessage("Enter the valid Phone Number")
const professionFormat = body("profession").isLength({min: 3, max: 20}).withMessage("Profession shouldn't be too long, too short, or empty")
const nationalityFormat = body("nationality").isLength({min: 3, max: 20}).withMessage("Nationality invalid")
const birthDateFormat = body("birthDate").isDate().withMessage("Birth Date Must be valid date input (ex:YYYY/MM/DD")

// const codeFormat = 
//     body("code").isInt().withMessage("Code must be a number")
//         .isLength({min: 6, max: 6}).withMessage("Code must be 6 character")
//         .custom((value, {request}) => {
//             return value.length === request.body.code.length
//         }).withMessage("Code is Invalid")

const codeFormat = body("code").isLength(6).withMessage("Code must be 6 characters")

// const emailEmptyFormat = body("email").isEmpty().withMessage("Email cannot be empty")
const confirmPasswordFormat = body("confirmPassword").custom((value, {req: request}) => {
    return value === request.body.password
}).withMessage("Confirm Password doesn't match")
//For Formats

const cityIdFormat = body("cityId").custom((value, {req: request}) => {
    if((request >= 1) && (request <=7))  
        return value
}).withMessage("City does not found. cityId must be between 1-7 !!") 

const rules = {
    authLogin: [
        emailFormat,
        passwordFormatLogin
    ],
    createUser: [
        userNameFormat,
        emailFormat,
        strongPassword
    ],
    createCity: [
        nameBodyFormat
    ],
    getAllUsers: [ //agar pada GET ALL USERS, input Sort nya hanya bisa diinputkan ASC atau DESC, lainnya error
        limitParamsFormat,
        sortParamsFormat,
        sortByParamsFormat
    ],
    getAllCities: [ //agar pada GET ALL USERS, input Sort nya hanya bisa diinputkan ASC atau DESC, lainnya error
        limitParamsFormat,
        sortParamsFormat,
        sortByParamsFormat
    ],
    getAllProfiles: [ //agar pada GET ALL USERS, input Sort nya hanya bisa diinputkan ASC atau DESC, lainnya error
        limitParamsFormat,
        sortParamsFormat,
        sortByParamsFormat
    ],
    idParams: [
        idParamsFormat
    ],
    //CATEGORIES
    getOneCategory: [
        idParamsFormat
    ],
    createCategory: [
        nameBodyFormat
    ],
    updateCategory: [
        idParamsFormat,
        nameBodyFormat
    ],
    deleteCategory: [
        idParamsFormat
    ],
    //PAYMENT METHOD
    getOnePayment: [
        idParamsFormat
    ],
    createPayment: [
        nameBodyFormat
    ],
    updatePayment: [
        idParamsFormat,
        nameBodyFormat
    ],
    deletePayment: [
        idParamsFormat
    ],
    //RESERVATION STATUS
    getOneResStatus: [
        idParamsFormat
    ],
    createResStatus: [
        nameBodyFormat
    ],
    updateResStatus: [
        idParamsFormat,
        nameBodyFormat
    ],
    deleteResStatus: [
        idParamsFormat
    ],
    
    createProfile: [
        fullNameFormat,
        phoneFormat,
        genderFormat,
        professionFormat,
        nationalityFormat,
        birthDateFormat

    ],
    resetPassword: [
        codeFormat,
        emailFormat,
        strongPassword,
        confirmPasswordFormat

    ],
    updateProfile: [
        idParamsFormat
    ],
    getAllEvents: [
        idParamsFormat
    ],
    createEvents: [
        cityIdFormat
    ]
    
    // createChangePassword:[
    //     body("oldPassword").isStrongPassword().withMessage("oldPassword must be strong"),
    //     body("currentPassword").isStrongPassword().withMessage("currentPassword must be strong"),
    //     body("newPassword").isStrongPassword().withMessage("newPassword must be strong")
    // ],
}

const validator = (request, response, next) => {
    const errors = validationResult(request)
    try{
        if(!errors.isEmpty()) {
            // fileRemover(request.file)
            throw Error("validation")
        }
        return next()
    }catch(error){
        return response.status(400).json({
            success: false,
            message: "Validation error",
            results: errors.array()
        })
        // return errorHandler(response, error)
    }
}

const validate = (selectedRules) => [rules[selectedRules], validator]

module.exports = validate
