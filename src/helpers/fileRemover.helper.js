const fs = require("fs")

const fileRemover = (file) => {
    if(file){
        console.log("unlink process")
        const filename = `uploads/${file.filename}`
        console.log(filename)
        fs.unlink(filename, (error)=> {
            try{
                if(error){
                    throw Error(error.message)
                }
            } catch(error){
                console.log(error)
            }
        })
    }
}

module.exports = fileRemover
