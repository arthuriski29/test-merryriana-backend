const errorHandler = require("../helpers/errorHandler.helper")
const itemModel = require("../models/item-assesment.model")
// const approveModel = require("../models/approval.model")
const rejectModel = require("../models/reject-massage.model")

//FOR ALL ROLE REGOISTERED
exports.getAll = async(req, res) => {
  try {
    const{page, limit, search, sort, sortBy,} = req.query
    const data = await itemModel.findAll(page, limit, search, sort, sortBy,)

    if(!data){
      throw Error("data_not_found")
    }
    return res.json({
        success: true,
        message: "List of All Items",
        results: {
          total_item:data.length,
          data
        }
    })


  } catch (err) {
    return errorHandler(res, err)
    
  }
}
exports.getOne = async(req, res) => {
  try {
    const {id} = req.params
    const data = await itemModel.findOneById(id)
    if(!data){
      throw Error("data_not_found")
    }
    return res.json({
        success: true,
        message: "List of All Items",
        results: data
    })

  } catch (err) {
    return errorHandler(res, err)
    
  }
}

// OFFICER
exports.createItemOfficer = async (req, res) => {
  try {

    const {role, id} = req.user
    const {quantity, price_per_item} = req.body
    console.log("quantity", quantity, typeof quantity)

    if(!role) throw new Error('unauthorized_access');
    if(role !==2) throw new Error('role_must_be_officer');

    const parseQty= (parseInt(quantity))

    const totalPrice =  parseQty * (parseInt(price_per_item))
    const createItem = {
      ...req.body,
      quantity: parseQty,
      total_price: totalPrice,
      status_id: 1,
      requested_by: id
    }
    console.log(createItem)
    console.log("createItem.quantity", createItem.quantity, typeof createItem.quantity)

    
    const data = await itemModel.insert(createItem)

    // const results = {

    //   name: data.name,
    //   quantity: data.quantity,
    //   brand: data.brand,
    //   description: data.description,
    //   price_per_item: data.price_per_item,
    //   total_price: data.total_price,
    //   requested_by: data.requested_by,
    //   status_id: data.status_id
    // }

    
    return res.json({
      success: true,
      message: "Create Item success!",
      results: data
    })


  } catch (err) {
  return errorHandler(res, err)
  }
}
exports.getItemOfficer = async(req, res) => {
  try {
    const {role} = req.user
    if(!role) throw new Error('unauthorized_access');
    if(role !==2) throw new Error('role_must_be_officer');

    const{page, limit, search, sort, sortBy,} = req.query
    const data = await itemModel.findAll(page, limit, search, sort, sortBy,)

    if(!data){
      throw Error("data_not_found")
    }
  return res.json({
      success: true,
      message: "List of All Items",
      results: {
        total_item:data.length,
        data
      }
  })


  } catch (err) {
    return errorHandler(res, err)
    
  }
}
exports.getOneItemOfficer = async(req, res) => {
  try {
    const {role} = req.user
    if(!role) throw new Error('unauthorized_access');
    if(role !==2) throw new Error('role_must_be_officer');

    const {id} = req.params
    const data = await itemModel.findOneById(id)
    if(!data){
      throw Error("data_not_found")
    }
    return res.json({
        success: true,
        message: "List of All Items",
        results: data
    })

  } catch (err) {
    return errorHandler(res, err)
    
  }
}
exports.updateItemOfficer = async(req, res) => {
  try {
    const {id: userId, role} = req.user
    const {id: itemId} = req.params

    if(!role) throw new Error('unauthorized_access');
    if(role !==2) throw new Error('role_must_be_officer');
    
    const findItem = await itemModel.findOneByIdAndRequestedBy(itemId, userId)
    console.log(findItem)
    if(!findItem) throw new Error(`item with id: ${itemId}, and requested_by: ${userId} is not found`)
    if(userId !== findItem.requested_by) throw new Error(`user_id must be same with item's requested_by`)
      
    let quantity = req.body.quantity
    let price_per_item = req.body.price_per_item

    if (! ('quantity' in req.body)) {
      quantity = findItem.quantity
    }
    if (! ('price_per_item' in req.body)) {
      price_per_item = findItem.price_per_item
    }

    const parseQty= (parseInt(quantity))
    const newTotalPrice =  parseQty * (parseInt(price_per_item))
    console.log('newTotalPrice', newTotalPrice)

    const dataInput = {
      ...req.body,
      total_price: newTotalPrice
    }
    if(!dataInput) throw new Error('no_update_data_found')
      
    const data = await itemModel.updateOfficer(itemId, dataInput)
    
    return res.json({
      success: true,
      message: `Item ${itemId} updated seccessfully`,
      results: data
    })

  } catch (err) {
    return errorHandler(res, err)
  }
}
exports.deleteItemOfficer = async(req, res) => {
  try {
    const {id: requested_by, role} = req.user
    const {id: itemId} = req.params

    if(!role) throw new Error('unauthorized_access');
    if(role !==2) throw new Error('role_must_be_officer');
    if(!itemId) throw new Error('no_item_selected')

    const item_id = parseInt(itemId)

    const deleteItem = await itemModel.destroy(requested_by, item_id)
    return res.json({
      success: true,
      message: `Item ${itemId} deleted seccessfully`,
      results: deleteItem
    })

    
    
  } catch (err) {
    return errorHandler(res, err)
  }
}

//MANAGER
exports.getAllItemManager = async(req, res) => {
  try {
    console.log("first")
    const {role} = req.user
    if(!role) throw new Error('unauthorized_access');
    if(role !==3) throw new Error('role_must_be_manager');

    const{page, limit, search, sort, sortBy,} = req.query
    const data = await itemModel.findAllForManagerToBeReview(page, limit, search, sort, sortBy,)

    if(!data){
      throw Error("data_not_found")
    }
    return res.json({
        success: true,
        message: "List of All Items",
        results: {
          total_item:data.length,
          data
        }
    })
  } catch (err) {
    return errorHandler(res, err)
  }
}
exports.getOneItemManager = async(req, res) => {
  try {
    const {role} = req.user
    if(!role) throw new Error('unauthorized_access');
    if(role !==3) throw new Error('role_must_be_manager');

    const {id} = req.params
    const data = await itemModel.findOneForManagerToBeReview(id)
    if(!data){
      throw Error("data_not_found_to_be_review")
    }
    return res.json({
        success: true,
        message: "List of All Items",
        results: data
    })

  } catch (err) {
    return errorHandler(res, err)
    
  }
}
exports.giveApprovalManager = async(req ,res) => {
  try {
    const {role, id:userId} = req.user
    if(!role) throw new Error('unauthorized_access');
    if(role !==3) throw new Error('role_must_be_manager');
    
    const {id:itemId} = req.params
    const checkData = await itemModel.findOneForManagerToBeReview(itemId)
    if(!checkData){
      throw Error("data_not_found_to_be_approve")
    }

    const data ={
      reviewed_by:userId, //BY: MANAGER
      status_id: 2, //APPROVED STATUS: APPROVE
    }   //KEMBALIKAN

    const dataUpdate = await itemModel.updateAssesment(itemId, data)
    if(!dataUpdate){
      throw Error("update_approve_manager_failed")
    }
    return res.json({
      success: true,
      message: "List of All Items",
      results: dataUpdate
  })

  } catch (err) {
    return errorHandler(res, err)
  }
}
exports.giveRejectedManager = async(req ,res) => {
  try {
    const {role, id:userId} = req.user
    if(!role) throw new Error('unauthorized_access');
    if(role !==3) throw new Error('role_must_be_manager');
    
    const {id:itemId} = req.params
    const checkData = await itemModel.findOneForManagerToBeReview(itemId)
    if(!checkData){
      throw Error("data_not_found_to_be_reject")
    }

    const data ={
      reviewed_by:userId, //BY: MANAGER
      status_id: 3, //APPROVED STATUS: REJECTED
    }

    const dataUpdate = await itemModel.updateAssesment(itemId, data)
    if(!dataUpdate){
      throw Error("update_reject_manager_failed")
    }
    const dataToReject = {
      message: req.body.message,
      item_assesment_id: itemId
    }
    const toRejected = await rejectModel.insertToRejectTable(dataToReject)
    if(!toRejected){
      throw Error("data_is_not_inserted_to_reject_table")
    }
    return res.json({
      success: true,
      message: "List of All Items",
      results: dataUpdate
  })

  } catch (err) {
    return errorHandler(res, err)
  }
}

//FINANCE
exports.getAllItemFinance = async(req, res) => {
  try {
    const {role} = req.user
    if(!role) throw new Error('unauthorized_access');
    if(role !==4) throw new Error('role_must_be_finance');

    const{page, limit, search, sort, sortBy,} = req.query
    const data = await itemModel.findAllForFinanceToBeReview(page, limit, search, sort, sortBy,)

    if(!data){
      throw Error("data_not_found")
    }
    return res.json({
        success: true,
        message: "List of All Items",
        results: {
          total_item:data.length,
          data
        }
    })
  } catch (err) {
    return errorHandler(res, err)
  }
}
exports.getOneItemFinance = async(req, res) => {
  try {
    const {role} = req.user
    if(!role) throw new Error('unauthorized_access');
    if(role !==4) throw new Error('role_must_be_finance');

    const {id} = req.params
    const data = await itemModel.findOneForFinanceToBeReview(id)
    if(!data){
      throw Error("data_not_found_to_be_review")
    }
    return res.json({
        success: true,
        message: "List of All Items",
        results: data
    })

  } catch (err) {
    return errorHandler(res, err)
    
  }
}



