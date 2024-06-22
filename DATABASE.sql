-- Active: 1680684550212@@127.0.0.1@5432@merry_riana@public
CREATE TABLE "role" (
    "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "name" VARCHAR(255),
    "description" TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NULL
);

CREATE TABLE "user" (
    "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "email" VARCHAR(255) UNIQUE,
    "password" VARCHAR(255),
    "role_id" INTEGER,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NULL
);

CREATE TABLE "forgot_request" (
    "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "email" VARCHAR(255),
    "code" VARCHAR(255),
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NULL
);

CREATE TABLE "status" (
    "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "name" VARCHAR(255),
    "description" TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NULL
);

CREATE TABLE "profile" (
    "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "full_name" VARCHAR(255),
    "username" VARCHAR(255),
    "job" VARCHAR(255),
    "user_id" INTEGER,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NULL
);

CREATE TABLE "item_assesment" (
    "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "name" VARCHAR(255),
    "quantity" INTEGER,
    "brand" VARCHAR(255),
    "description" TEXT,
    "price_per_item" INTEGER,
    "total_price" INTEGER,
    "requested_by" INTEGER,
    "reviewed_by" INTEGER,
    "status_id" INTEGER,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NULL
);

CREATE TABLE "reject_message" (
    "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "message" TEXT,
    "item_assesment_id" INTEGER,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NULL
);

CREATE TABLE "approved_items" (
    "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "invoice_picture" TEXT,
    "item_assesment_id" INTEGER,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NULL
);

SELECT "u"."id", "u"."email", "u"."password", "r"."name" as "role"
FROM "user" "u"
    JOIN "role" "r" ON "u"."role_id" = "r"."id"
WHERE
    "u"."email" = 'admin@mail.com'
    -- GROUP BY
    --     "r"."id",
    --     "u"."id";

SELECT *
FROM "user" "u"
    -- JOIN "role" "r" ON "u"."role_id" = "r"."id"
WHERE
    "email" = 'admin@mail.com'
    -- GROUP BY "r"."id", "u"."id"
;

--TESTES

SELECT "u"."id", "p"."full_name", "p"."username", "u"."email", "p"."job"
FROM "profile" "p"
    JOIN "user" "u" ON "p"."user_id" = "u"."id"
WHERE
    "p"."user_id" = '1'
    -- GROUP BY
    --     "u"."id"

INSERT INTO
    "item_assesment" (
        "name",
        "quantity",
        "brand",
        "description",
        "price_per_item",
        "status_id"
    )
VALUES (
        'Kapal',
        '5',
        'IKEA',
        'BANYAK LAH PITIH KALUA',
        '200000000',
        '1'
    ),
    (
        'Meja',
        '5',
        'IKEA',
        'BANYAK LAH PITIH KALUA',
        '200000',
        '1'
    )

TRUNCATE TABLE "item_assesment" RESTART IDENTITY

SELECT * FROM "item_assesment" WHERE "id" = '1'

UPDATE "item_assesment"
SET
    "updatedAt" = current_timestamp
WHERE
    "id" = '1'

UPDATE "user" SET "role_id" = 4 WHERE "id" = 6;

UPDATE "item_assesment"
SET
    "reviewed_by" = '6', --3 or 6
    "status_id" = '3'
WHERE
    "id" = '9';

--GET ALL ITEM BY ALL ROLE + INFO
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
    "item_assesment" "items"
    LEFT JOIN "user" "u" ON items.reviewed_by = u.id
    LEFT JOIN "role" "r" ON u.role_id = r.id
    LEFT JOIN "status" "s" ON items.status_id = s.id;
-- WHERE
--     u.role_id = 4
--     AND items.status_id = 3;
SELECT COUNT(*) as "item_count"
FROM "item_assesment"
    --CONDITIONAL WHERE REVIEWED IS NULL [UNTUK DIREVIEW MANAGER LIST]
SELECT *
FROM "item_assesment"
WHERE
    "reviewed_by" IS NULL
    -- CONDITIONAL WHERE REVIEWED IS MANAGER (3) [UNTUK DIREVIEW FINANCE LIST]

SELECT items.id, items.name, items.quantity, items.brand, items.description, items.price_per_item, items.total_price, items.requested_by, items.reviewed_by, items.status_id, "items"."createdAt", "items"."updatedAt"
FROM
    "item_assesment" "items"
    JOIN "user" "u" ON items.reviewed_by = u.id
WHERE
    u.role_id = 3
    AND items.status_id = 2;

-- CONDITIONAL WHERE REVIEWED IS FINANCE (4) [UNTUK APPROVAL LIST]
SELECT items.id, items.name, items.brand, items.quantity, items.description, items.price_per_item, items.total_price, items.requested_by, items.reviewed_by, items.status_id
FROM
    "item_assesment" "items"
    JOIN "user" "u" ON items.reviewed_by = u.id
WHERE
    u.role_id = 4;

--###########################--
--##### REJECTION TABLE #####--
--###########################--

--FOR OFFICER
--CONDITION WHERE reviewed_by = user.id dengan role_id = 3 (Manager)
SELECT items.id, items.name, items.brand, items.quantity, items.description, items.price_per_item, items.total_price, items.requested_by, items.reviewed_by, items.status_id
FROM
    "item_assesment" "items"
    JOIN "user" "u" ON items.reviewed_by = u.id
WHERE
    u.role_id = 3
    AND items.status_id = 3;

--FOR MANAGER
--CONDITION WHERE reviewed_by = user.id dengan role_id = 4 (Finance)
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
    r.name as "review_role",
    items.status_id,
    s.name as "status_name"
FROM
    "item_assesment" "items"
    JOIN "user" "u" ON items.reviewed_by = u.id
    JOIN "role" "r" ON u.role_id = r.id
    JOIN "status" "s" ON items.status_id = s.id
WHERE
    u.role_id = 4
    AND items.status_id = 3;

UPDATE "item_assesment"
SET
    "reviewed_by" = 3,
    "status_id" = 2
WHERE
    "id" = 8
RETURNING
    *
    --###### LIHAT APPROVAL TABLE
SELECT apr.id, apr.invoice_picture, apr.item_assesment_id, items.name, items.brand, items.quantity, items.description, items.price_per_item, items.total_price, items.requested_by, items.reviewed_by, items.status_id, "apr"."createdAt", "apr"."updatedAt"
FROM
    "approved_items" "apr"
    JOIN "item_assesment" "items" ON apr.item_assesment_id = items.id
    JOIN "user" "u" ON items.reviewed_by = u.id
WHERE
    u.role_id = 4
    AND items.status_id = 2;

-- FINDALL REJECT
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
    RIGHT JOIN "reject_message" "rej" ON items.id = rej.item_assesment_id
WHERE
    items.id = 4
GROUP BY
    rej.id,
    items.id,
    r.name,
    s.name