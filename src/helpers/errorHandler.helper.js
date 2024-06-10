const errorHandler = (res, err) => {
    
    return res.json({
        success: false, 
        message: `${err}`
    })
}

module.exports = errorHandler
