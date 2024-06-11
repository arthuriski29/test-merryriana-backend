const db = require("../helpers/db.helper")
const table = 'user'

exports.findAll = async function(page, limit, search, sort, sortBy){
    page = parseInt(page) || 1
    limit = parseInt(limit) || 5
    search = search || ""
    sort = sort || "id"
    sortBy = sortBy || "ASC"
    const offset = (page - 1) * limit

    const query = `
    SELECT * FROM "${table}" 
    WHERE "email" LIKE $3 
    ORDER BY "${sort}" ${sortBy} 
    LIMIT $1 OFFSET $2
    `
    const values = [limit, offset, `%${search}%`]
    const {rows} = await db.query(query, values)
    return rows
}

exports.findOne = async function(id){
    const query = `
    SELECT * FROM "${table}"
    WHERE id=$1
    `
    const values = [id]
    const {rows} = await db.query(query, values)
    return rows[0]
}

exports.findOneByEmail = async function(email){
    const query = `
    SELECT * FROM "${table}"
    WHERE email=$1
    `
    const values = [email]
    const {rows} = await db.query(query, values)
    return rows[0]
}
exports.findOneByEmailShowRole = async function(email){
    const query = `
    SELECT 
        "u"."id", 
        "u"."email", 
        "u"."password", 
        "r"."name" as "role"
    FROM "user" "u"
    JOIN "role" "r" ON "u"."role_id" = "r"."id"
    WHERE "u"."email" = $1
    GROUP BY
        "r"."id",
        "u"."id"
    `
    const values = [email]
    const {rows} = await db.query(query, values)
    return rows[0]
}
 

exports.insert = async function(data){
    const query = `
    INSERT INTO "${table}" ("email", "password", "role_id") 
    VALUES ($1, $2, $3) RETURNING *
    `  
    const values = [data.email, data.password, data.role_id]   
    const {rows} = await db.query(query, values)
    return rows[0]
}

exports.update = async function(id, data){
    const query = `
    UPDATE "${table}" 
    SET 
    "email"=COALESCE(NULLIF($2, ''), "email"), 
    "password"=COALESCE(NULLIF($3, ''), "password")
    WHERE "id"=$1
    RETURNING *
    `  
    const values = [id, data.email, data.password]   
    const {rows} = await db.query(query, values)
    return rows[0]
}

exports.destroy = async function(id){
    const query = `
    DELETE FROM "${table}" 
    WHERE "id"=$1
    RETURNING *
    `  
    const values = [id]   
    const {rows} = await db.query(query, values)
    return rows[0]
}

