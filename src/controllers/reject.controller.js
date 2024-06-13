const errorHandler = require('../helpers/errorHandler.helper');
// const approveModel=require('../models/approval.model')
const rejectModel=require('../models/reject-massage.model')
const itemModel=require('../models/item-assesment.model')


// ALL REJECT DATA
exports.getAllDoneReject = async(req, res) => {
  try {
    // const {id} = req.user
    // if(!id) throw new Error('unauthorized_access');
    // if(role !==4) throw new Error('role_must_be_finance');

    // const{page, limit, search, sort, sortBy,} = req.query
    const data = await rejectModel.getAll()

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
// FOR OFFICER --BY MANAGER
exports.getAllForOfficer = async(req, res) => {
  try {
    const {id, role} = req.user
    if(!id) throw new Error('unauthorized_access');
    if(role !==2) throw new Error('role_must_be_officer');

    const{page, limit, search, sort, sortBy,} = req.query
    const data = await rejectModel.getAllRejectManager(page, limit, search, sort, sortBy,)

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

// FOR MANAGER --BY FINANCE
exports.getAllForManager = async(req, res) => {
  try {
    const {id, role} = req.user
    if(!id) throw new Error('unauthorized_access');
    if(role !==3) throw new Error('role_must_be_manager');

    const{page, limit, search, sort, sortBy,} = req.query
    const data = await rejectModel.getAllRejectFinance(page, limit, search, sort, sortBy,)

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


//MANAGER REJECT ACTION
exports.actionRejectedManager = async(req ,res) => {
  try {
    const {role, id:userId} = req.user
    if(!role) throw new Error('unauthorized_access');
    if(role !==3) throw new Error('role_must_be_manager');
    
    const {id:itemId} = req.params
    const checkData = await itemModel.findOneById(itemId)
    if(!checkData){
      throw Error("item_not_found")
    }

    const data ={
      reviewed_by:userId, //BY: MANAGER
      status_id: 3, //APPROVED STATUS: REJECTED
    }

    const dataUpdate = await itemModel.updateAssesment(itemId, data)
    if(!dataUpdate){
      throw Error("update_approve_manager_failed")
    }
    const dataToReject = {
      message: req.body.message,
      item_assesment_id: itemId
    }
    const toRejected = await rejectModel.insertToRejectTable(dataToReject)
    if(!toRejected){
      throw Error("data_is_not_inserted_to_reject_table")
    }

    const showUpdated = await rejectModel.getOne(itemId)
    return res.json({
      success: true,
      message: "List of All Items",
      results: showUpdated
  })

  } catch (err) {
    return errorHandler(res, err)
  }
}
//MANAGER REJECT ACTION
exports.actionRejectedFinance = async(req ,res) => {
  try {
    const {role, id:userId} = req.user
    if(!role) throw new Error('unauthorized_access');
    if(role !==4) throw new Error('role_must_be_finance');
    
    const {id:itemId} = req.params
    const checkData = await itemModel.findOneById(itemId)
    if(!checkData){
      throw Error("item_not_found")
    }

    const data ={
      reviewed_by:userId, //BY: MANAGER
      status_id: 3, //APPROVED STATUS: REJECTED
    }

    const dataUpdate = await itemModel.updateAssesment(itemId, data)
    if(!dataUpdate){
      throw Error("update_approve_manager_failed")
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