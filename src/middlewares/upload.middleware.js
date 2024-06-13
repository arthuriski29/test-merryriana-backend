const multer = require("multer")
const cloudinary = require("cloudinary").v2
const { CloudinaryStorage } = require("multer-storage-cloudinary")

cloudinary.config({
    cloud_name: "dxs0yxeyr",
    api_key: "236157336681252",
    api_secret: "V2uHsegpJtBpFlUl3WSwkxdCL0I"
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "demo/fajarfath",
        format: async (req, file) => "png", // supports promises as well
        public_id: (req, file) => {
            const filename = new Date().getTime().toString()
            return filename
        },
    },
})


const limits = {
    fileSize: 1*1024 *1024  //mjd 1 MBytes dari Bytes
}

const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/
    const mimeType = fileTypes.test(file.mimetype)
    if(!mimeType){
        cb(Error("fileformat_error"))
    }
    cb(null, true)
}

const upload = multer({storage, limits, fileFilter})

const uploadMiddleware = (field) => {
    const uploadField = upload.single(field)
    return (request, response, next) => {
        uploadField(request, response, (error)=> {
            if(error){
                if(error.message === "fileformat_error"){
                    return response.status(400).json({
                        status: false,
                        message: "File format invalid"
                    })
                }
                return response.status(400).json({
                    status: false,
                    message: "File too large"
                })
            }
            return next()
        })
    }
}

module.exports = uploadMiddleware
