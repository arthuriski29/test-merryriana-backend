const errorHandler = require('../helpers/errorHandler.helper');
const approveModel=require('../models/approval.model')
const itemModel=require('../models/item-assesment.model')

exports.getAllDoneApprove = async(req, res) => {
  try {
    // const {id} = req.user
    // if(!id) throw new Error('unauthorized_access');
    // if(role !==4) throw new Error('role_must_be_finance');

    const{page, limit, search, sort, sortBy,} = req.query
    const data = await approveModel.getAllApproval(page, limit, search, sort, sortBy,)

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

exports.actionApprovalFinance = async(req ,res) => {
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
      status_id: 2, //APPROVED STATUS: APPROVE
    }

    const dataUpdate = await itemModel.updateAssesment(itemId, data)
    if(!dataUpdate){
      throw Error("update_approve_to_finance_failed")
    }



    const dataToApprove = {
      ...req.body,
      item_assesment_id: dataUpdate.id

    }
    
    if (req.file) {
      dataToApprove.invoice_picture = req.file.path
    }
    if (!dataToApprove.invoice_picture) {
      throw Error("invoice_picture_not_found")
    }
    
    const dataApproved = await approveModel.insertToApprovalTable(dataToApprove)
    if(!dataApproved){
      throw Error("approve_data_failed")
    }

    return res.json({
      success: true,
      message: "List of All Items",
      results: dataApproved
  })

  } catch (err) {
    return errorHandler(res, err)
  }
}