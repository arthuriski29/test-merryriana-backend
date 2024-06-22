const db = require('../helpers/db.helper')

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
  limit = parseInt(limit) || 1000
  search = search || ""
  sort = sort || "id"
  sortBy = sortBy || "ASC"
  const offset = (page - 1) * limit

  const query = `
    SELECT
      items.id,
      items.name,
      items.brand,
      items.quantity,
      items.description,
      items.price_per_item,
      items.total_price,
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
      "${table}" "items"
      LEFT JOIN "user" "u" ON items.reviewed_by = u.id
      LEFT JOIN "role" "r" ON u.role_id = r.id
      LEFT JOIN "status" "s" ON items.status_id = s.id
  WHERE "items"."name" LIKE $3 
  ORDER BY "items"."${sort}" ${sortBy} 
  LIMIT $1 OFFSET $2
  `
  const values = [limit, offset, `%${search}%`]
  const {rows} = await db.query(query, values)
  return rows
}
exports.findAllForManager = async function(page, limit, search, sort, sortBy){
  page = parseInt(page) || 1
  limit = parseInt(limit) || 1000
  search = search || ""
  sort = sort || "id"
  sortBy = sortBy || "ASC"
  const offset = (page - 1) * limit

  const query = `
  SELECT * FROM "${table}" 
  WHERE "name" LIKE $3 AND "reviewed_by"=NULL
  ORDER BY "${sort}" ${sortBy} 
  LIMIT $1 OFFSET $2
  `
  const values = [limit, offset, `%${search}%`]
  const {rows} = await db.query(query, values)
  return rows
}


exports.findOneById = async function(id) {
  const query = `
  SELECT
    items.id,
    items.name,
    items.brand,
    items.quantity,
    items.description,
    items.price_per_item,
    items.total_price,
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
    "${table}" "items"
    LEFT JOIN "user" "u" ON items.reviewed_by = u.id
    LEFT JOIN "role" "r" ON u.role_id = r.id
    LEFT JOIN "status" "s" ON items.status_id = s.id
  WHERE "items"."id" = $1 
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
exports.findOneByIdAndReviwedBy = async function(id, reviewed_by) {
  const query = `
  SELECT * FROM "${table}" 
  WHERE "id"=$1 AND "reviewed_by" = $2 
  `
  const values = [id, reviewed_by]
  const {rows} = await db.query(query, values)
  return rows[0]
}

exports.updateOfficer = async function(id, data) {
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
    "reviewed_by" = NULL, 
    "status_id" = COALESCE(NULLIF($9::INTEGER, NULL), "status_id"), 
    "updatedAt" = CURRENT_TIMESTAMP 
    WHERE "id"=$1
    RETURNING *
  `
  const values = [id, data.name, data.quantity, data.brand, data.description, data.price_per_item, data.total_price, data.requested_by, data.status_id]
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

// --ASSESMENT UPDATE
exports.updateAssesment = async function(id, data) {
  const query = `
  UPDATE "${table}" 
    SET 
    "reviewed_by" = COALESCE(NULLIF($2::INTEGER, NULL), "reviewed_by"), 
    "status_id" = COALESCE(NULLIF($3::INTEGER, NULL), "status_id"), 
    "updatedAt" = CURRENT_TIMESTAMP
    WHERE "id"=$1
    RETURNING *
  `
  const values = [id, data.reviewed_by, data.status_id]
  const {rows} = await db.query(query, values)
  return rows[0]
}


// TO BE REVIEW BY MANAGER

exports.findAllForManagerToBeReview = async function(page, limit, search, sort, sortBy){
  page = parseInt(page) || 1
  limit = parseInt(limit) || 1000
  search = search || ""
  sort = sort || "id"
  sortBy = sortBy || "ASC"
  const offset = (page - 1) * limit

  const query = `
  SELECT
      items.id,
      items.name,
      items.brand,
      items.quantity,
      items.description,
      items.price_per_item,
      items.total_price,
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
      "${table}" "items"
      LEFT JOIN "user" "u" ON items.reviewed_by = u.id
      LEFT JOIN "role" "r" ON u.role_id = r.id
      LEFT JOIN "status" "s" ON items.status_id = s.id
  WHERE "items"."name" LIKE $3 AND "items"."reviewed_by" IS NULL AND "items"."status_id"='1'
  ORDER BY "items"."${sort}" ${sortBy} 
  LIMIT $1 OFFSET $2
  `
  const values = [limit, offset, `%${search}%`]
  const {rows} = await db.query(query, values)
  return rows
}
exports.findOneForManagerToBeReview = async function(id){
  const query = `
  SELECT * FROM "${table}" 
  WHERE "id"=$1 AND "reviewed_by" IS NULL AND "status_id"='1'
  `
  const values = [id]
  const {rows} = await db.query(query, values)
  return rows[0]
}

exports.findDoneReviewManager = async function(page, limit, search, sort, sortBy){
  page = parseInt(page) || 1
  limit = parseInt(limit) || 1000
  search = search || ""
  sort = sort || "id"
  sortBy = sortBy || "ASC"
  const offset = (page - 1) * limit

  const query = `
  SELECT
    items.id,
    items.name,
    items.brand,
    items.quantity,
    items.description,
    items.price_per_item,
    items.total_price,
    items.requested_by,
    items.reviewed_by,
    items.status_id
  FROM "${table}" "items"
  JOIN "user" "u" ON items.reviewed_by=u.id
  WHERE "items"."name" LIKE $3 AND u.role_id=3
  ORDER BY "${sort}" ${sortBy} 
  LIMIT $1 OFFSET $2
  `
  const values = [limit, offset, `%${search}%`]
  const {rows} = await db.query(query, values)
  return rows
}

// TO BE REVIEW BY FINANCE
exports.findAllForFinanceToBeReview = async function(page, limit, search, sort, sortBy){
  page = parseInt(page) || 1
  limit = parseInt(limit) || 1000
  search = search || ""
  sort = sort || "id"
  sortBy = sortBy || "ASC"
  const offset = (page - 1) * limit

  const query = `
  SELECT
    items.id, 
    items.name, 
    items.quantity, 
    items.brand, 
    items.description, 
    items.price_per_item, 
    items.total_price, 
    items.requested_by, 
    items.reviewed_by, 
    items.status_id,
    "items"."createdAt",
    "items"."updatedAt"
  FROM "${table}" "items"
  JOIN "user" "u" ON items.reviewed_by = u.id
  WHERE "items"."name" LIKE $3 AND u.role_id=3 AND items.status_id = 2
  ORDER BY "${sort}" ${sortBy} 
  LIMIT $1 OFFSET $2
  `
  const values = [limit, offset, `%${search}%`]
  const {rows} = await db.query(query, values)
  return rows
}
exports.findOneForFinanceToBeReview = async function(id){
  const query = `SELECT
    items.id, 
    items.name, 
    items.quantity, 
    items.brand, 
    items.description, 
    items.price_per_item, 
    items.total_price, 
    items.requested_by, 
    items.reviewed_by, 
    items.status_id,
    "items"."createdAt",
    "items"."updatedAt"
  FROM "${table}" "items"
  JOIN "user" "u" ON items.reviewed_by = u.id 
  WHERE items.id=$1 AND  u.role_id = 3 AND items.status_id='2'
  `
  const values = [id]
  const {rows} = await db.query(query, values)
  return rows[0]
}


//APPROVAL TABLE

// exports.findAllForManagerToBeReview = async function(page, limit, search, sort, sortBy){
//   page = parseInt(page) || 1
//   limit = parseInt(limit) || 1000
//   search = search || ""
//   sort = sort || "id"
//   sortBy = sortBy || "ASC"
//   const offset = (page - 1) * limit

//   const query = `
//   SELECT * FROM "${table}" 
//   WHERE "name" LIKE $3 AND "reviewed_by" IS NULL
//   ORDER BY "${sort}" ${sortBy} 
//   LIMIT $1 OFFSET $2
//   `
//   const values = [limit, offset, `%${search}%`]
//   const {rows} = await db.query(query, values)
//   return rows
// }
