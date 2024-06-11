const db = require('../helpers/db.helper')
const errorHandler = require('../helpers/errorHandler.helper')

const table = 'item_assesment'


exports.insert = async function(data){
  const query = `
  INSERT INTO "${table}" ("name", "quantity", "brand", "description", "price_per_item", "total_price", "requested_by", "status_id") 
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
  RETURNING *
  `  
  const values = [data.name, data.quantity, data.brand, data.description, data.price_per_item, data.total_price, data.requested_by, data.status_id]   
  const {rows} = await db.query(query, values)
  return rows[0]
}

exports.findAll = async function(page, limit, search, sort, sortBy){
  page = parseInt(page) || 1
  limit = parseInt(limit) || 5
  search = search || ""
  sort = sort || "id"
  sortBy = sortBy || "ASC"
  const offset = (page - 1) * limit

  const query = `
  SELECT * FROM "${table}" 
  WHERE "name" LIKE $3 
  ORDER BY "${sort}" ${sortBy} 
  LIMIT $1 OFFSET $2
  `
  const values = [limit, offset, `%${search}%`]
  const {rows} = await db.query(query, values)
  return rows
}

exports.findOneById = async function(id) {
  const query = `
  SELECT * FROM "${table}" 
  WHERE "id" = $1 
  `
  const values = [id]
  const {rows} = await db.query(query, values)
  return rows[0]
}
exports.findOneByIdAndRequestedBy = async function(id, requested_by) {
  const query = `
  SELECT * FROM "${table}" 
  WHERE "id"=$1 AND "requested_by" = $2 
  `
  const values = [id, requested_by]
  const {rows} = await db.query(query, values)
  return rows[0]
}

exports.update = async function(id, data) {
  const query = `
  UPDATE "${table}" 
    SET 
    "name" = COALESCE(NULLIF($2, ''), "name"), 
    "quantity" = COALESCE(NULLIF($3::INTEGER, NULL), "quantity"), 
    "brand" = COALESCE(NULLIF($4, ''), "brand"),
    "description" = COALESCE(NULLIF($5, ''), "description"),
    "price_per_item" = COALESCE(NULLIF($6::INTEGER, NULL), "price_per_item"), 
    "total_price" = COALESCE(NULLIF($7::INTEGER, NULL), "total_price"), 
    "requested_by" = COALESCE(NULLIF($8::INTEGER, NULL), "requested_by"), 
    "reviewed_by" = COALESCE(NULLIF($9::INTEGER, NULL), "reviewed_by"), 
    "status_id" = COALESCE(NULLIF($10::INTEGER, NULL), "status_id"), 
    "updatedAt" = CURRENT_TIMESTAMP 
    WHERE "id"=$1
    RETURNING *
  `
  const values = [id, data.name, data.quantity, data.brand, data.description, data.price_per_item, data.total_price, data.requested_by, data.reviewed_by, data.status_id]
  const {rows} = await db.query(query, values)
  return rows[0]
}
exports.destroy = async function (requested_by, id) {
  const query = `
  DELETE FROM "${table}" 
  WHERE "requested_by"=$1 AND "id"=$2
  RETURNING *
  `
  const values = [requested_by, id]
  const { rows } = await db.query(query, values)
  return rows[0]
}

