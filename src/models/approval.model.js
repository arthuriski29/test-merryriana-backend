const db = require('../helpers/db.helper')

const tableApr = 'approved_items'
const tableItm = 'item_assesment'


exports.insertToApprovalTable = async function(data) {
  const query = `
  INSERT INTO "${tableApr}" ("invoice_picture", "item_assesment_id") 
  VALUES ($1, $2) 
  RETURNING *
  `  
  const values = [data.invoice_picture, data.item_assesment_id]   
  const {rows} = await db.query(query, values)
  return rows[0]
}

exports.getAllApproval = async function(page, limit, search, sort, sortBy){
  page = parseInt(page) || 1
  limit = parseInt(limit) || 5
  search = search || ""
  sort = sort || "id"
  sortBy = sortBy || "ASC"
  const offset = (page - 1) * limit

  const query = `
  SELECT
    apr.id, 
    apr.invoice_picture,
    apr.item_assesment_id,
    items.name, 
    items.brand, 
    items.quantity, 
    items.description, 
    items.price_per_item, 
    items.total_price, 
    items.requested_by, 
    items.reviewed_by, 
    items.status_id,
    "apr"."createdAt",
    "apr"."updatedAt"
  FROM "${tableApr}" "apr"
  JOIN "${tableItm}" "items" ON apr.item_assesment_id = items.id
  JOIN "user" "u" ON items.reviewed_by = u.id
  WHERE "items"."name" LIKE $3 AND u.role_id=4 AND items.status_id = 2
  ORDER BY "${sort}" ${sortBy} 
  LIMIT $1 OFFSET $2
  `
  const values = [limit, offset, `%${search}%`]
  const {rows} = await db.query(query, values)
  return rows
}