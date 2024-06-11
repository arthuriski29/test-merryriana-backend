const db = require("../helpers/db.helper")

const table = "profile"

exports.findAll = async function(page, limit, search, sort, sortBy){
    page = parseInt(page) || 1
    limit = parseInt(limit) || 5
    search = search || ""
    sort = sort || "id"
    sortBy = sortBy || "ASC"
    const offset = (page - 1) * limit

    const query = `
    SELECT * FROM "${table}" 
    WHERE "full_name" LIKE $3 
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
    WHERE "id"=$1
    `
    const values = [id]
    const {rows} = await db.query(query, values)
    return rows[0]
}

exports.findOneByUserId = async function(user_id){
    const query = `
    SELECT
    "u"."id",
    "p"."full_name",
    "p"."username",
    "u"."email",
    "p"."job"
    FROM "${table}" "p"
    JOIN "user" "u" ON "u"."id" = "p"."user_id"
    WHERE "p"."user_id"=$1
    GROUP BY "u"."id", "p"."full_name", "p"."username",
    "u"."email",
    "p"."job"
    `
    //Join dari tabel Users , dimana users.id nya = table profile.userId
    //tidak perlu * , ,karena ingin mengambil kolom tertentu saja (bukan semua kolom)

    const values = [user_id]
    const {rows} = await db.query(query, values)
    return rows[0]
}

// exports.findOneById = async function(email){
//     const query = `
//     SELECT * FROM "${table}"
//     WHERE "id"=$1
//     `
//     const values = [email]
//     const {rows} = await db.query(query, values)
//     return rows[0]
// }
 

exports.insert = async function(data){
    const query = `
    INSERT INTO "${table}" 
    ("full_name", "username", "job","user_id") 
    VALUES ($1, $2, $3, $4) RETURNING *
    `  
    const values = [data.full_name, data.username, data.job, data.user_id]   
    const {rows} = await db.query(query, values)
    return rows[0]
}
  
exports.update = async function(id, data){
    const query = `
    UPDATE "${table}" 
    SET 
    "full_name"=COALESCE(NULLIF($2, ''), "full_name"), 
    "username"=COALESCE(NULLIF($3, ''), "username"),
    "job"=COALESCE(NULLIF($4, ''), "job"), 
    "user_id"=COALESCE(NULLIF($5::INTEGER, NULL), "user_id")
    
    WHERE "id"=$1
    RETURNING *
    `
    const values = [id, data.full_name, data.username, data.job, data.user_id]   
    const {rows} = await db.query(query, values)
    return rows[0]
}
exports.updateByUserId = async function(user_id, data){
    const query = `
    UPDATE "${table}" 
    SET
    "full_name"=COALESCE(NULLIF($2, ''), "full_name"), 
    "username"=COALESCE(NULLIF($3, ''), "username"),
    "job"=COALESCE(NULLIF($4, ''), "job")  
    
    WHERE "user_id"=$1
    RETURNING *
    `
    const values = [user_id, data.full_name, data.username, data.job]   
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

