const db = require('../helpers/db.helper')

const tableRjc = 'reject_message'
const tableItm = 'item_assesment'


exports.insertToRejectTable = async function(data) {
  const query = `
  INSERT INTO "${tableRjc}" ("message", "item_assesment_id") 
  VALUES ($1, $2) 
  RETURNING *
  `  
  const values = [data.message, data.item_assesment_id]   
  const {rows} = await db.query(query, values)
  return rows[0]
}

exports.getAllRejectManager = async function(page, limit, search, sort, sortBy){
  page = parseInt(page) || 1
  limit = parseInt(limit) || 5
  search = search || ""
  sort = sort || "id"
  sortBy = sortBy || "ASC"
  const offset = (page - 1) * limit

  const query = `
  SELECT
    rej.id, 
    rej.invoice_picture,
    rej.item_assesment_id,
    items.name, 
    items.brand, 
    items.quantity, 
    items.description, 
    items.price_per_item, 
    items.total_price, 
    items.requested_by, 
    items.reviewed_by, 
    items.status_id,
    "rej"."createdAt",
    "rej"."updatedAt"
  FROM "${tableRjc}" "rej"
  JOIN "${tableItm}" "items" ON rej.item_assesment_id = items.id
  JOIN "user" "u" ON items.reviewed_by = u.id
  WHERE "items"."name" LIKE $3 AND u.role_id=3 AND items.status_id = 3
  ORDER BY "${sort}" ${sortBy} 
  LIMIT $1 OFFSET $2
  `
  const values = [limit, offset, `%${search}%`]
  const {rows} = await db.query(query, values)
  return rows
}
exports.getAllRejectFinance = async function(page, limit, search, sort, sortBy){
  page = parseInt(page) || 1
  limit = parseInt(limit) || 5
  search = search || ""
  sort = sort || "id"
  sortBy = sortBy || "ASC"
  const offset = (page - 1) * limit

  const query = `
  SELECT
    rej.id, 
    rej.invoice_picture,
    rej.item_assesment_id,
    items.name, 
    items.brand, 
    items.quantity, 
    items.description, 
    items.price_per_item, 
    items.total_price, 
    items.requested_by, 
    items.reviewed_by, 
    items.status_id,
    "rej"."createdAt",
    "rej"."updatedAt"
  FROM "${tableRjc}" "rej"
  JOIN "${tableItm}" "items" ON rej.item_assesment_id = items.id
  JOIN "user" "u" ON items.reviewed_by = u.id
  WHERE "items"."name" LIKE $3 AND u.role_id=4 AND items.status_id = 3
  ORDER BY "${sort}" ${sortBy} 
  LIMIT $1 OFFSET $2
  `
  const values = [limit, offset, `%${search}%`]
  const {rows} = await db.query(query, values)
  return rows
}

exports.getOne = async function(id){
  const query = `
    SELECT
      rej.id,
      items.id as "item_id",
      items.name,
      items.brand,
      items.quantity,
      items.description,
      items.price_per_item,
      items.total_price,
      rej.message "rejection_message",
      items.requested_by,
      items.reviewed_by,
      r.name as "reviewer_role",
      items.status_id,
      s.name as "status_name",
      CASE
          WHEN items.reviewed_by IS NOT NULL THEN CONCAT(
              'status ',
              s.name,
              ', by ',
              r.name
          )
          ELSE CONCAT(
              'status ',
              s.name,
              ', waiting for manager'
          )
      END AS "status_info",
      items."createdAt",
      items."updatedAt"
    FROM
      "item_assesment" "items"
      LEFT JOIN "user" "u" ON items.reviewed_by = u.id
      LEFT JOIN "role" "r" ON u.role_id = r.id
      LEFT JOIN "status" "s" ON items.status_id = s.id
      RIGHT JOIN "reject_message" "rej" ON items.id =rej.item_assesment_id
    WHERE items.id=$1
    GROUP BY rej.id, items.id, r.name, s.name
  `
  const values = [id]
  const {rows} = await db.query(query, values)
  return rows[0]

}

exports.getAll = async function(){
  const query = `
    SELECT
      rej.id,
      items.id as "item_id",
      items.name,
      items.brand,
      items.quantity,
      items.description,
      items.price_per_item,
      items.total_price,
      rej.message "rejection_message",
      items.requested_by,
      items.reviewed_by,
      r.name as "reviewer_role",
      items.status_id,
      s.name as "status_name",
      CASE
          WHEN items.reviewed_by IS NOT NULL THEN CONCAT(
              'status ',
              s.name,
              ', by ',
              r.name
          )
          ELSE CONCAT(
              'status ',
              s.name,
              ', waiting for manager'
          )
      END AS "status_info",
      items."createdAt",
      items."updatedAt"
    FROM
      "item_assesment" "items"
      LEFT JOIN "user" "u" ON items.reviewed_by = u.id
      LEFT JOIN "role" "r" ON u.role_id = r.id
      LEFT JOIN "status" "s" ON items.status_id = s.id
      RIGHT JOIN "reject_message" "rej" ON items.id =rej.item_assesment_id
    GROUP BY rej.id, items.id, r.name, s.name
  `
  // const values = []
  const {rows} = await db.query(query)
  return rows

}