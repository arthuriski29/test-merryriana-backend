const errorHandler = require("../helpers/errorHandler.helper")
const itemModel = require("../models/item-assesment.model")


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
      results: data
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
      
    const data = await itemModel.update(itemId, dataInput)
    
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