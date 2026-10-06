/// <reference path="../pb_data/types.d.ts" />

// Skema koleksi PocketBase — dipetakan 1:1 dari src/db/schema.ts (Drizzle).
// Field memakai nama camelCase agar JSON REST langsung cocok dengan DTO frontend.

migrate((app) => {
    const ADMIN = '@request.auth.role = "admin"';
    const OWN_OR_ADMIN = '@request.auth.id = id || @request.auth.role = "admin"';

    // PB tidak menambahkan created/updated secara otomatis pada koleksi
    // yang dibuat lewat migrasi JS, jadi daftarkan eksplisit.
    const TIMESTAMPS = [
        { name: "created", type: "autodate", onCreate: true, onUpdate: false },
        { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
    ];

    // Id kustom dari aplikasi lama ("1", "t1", "profile", uuid ber-"-")
    // tidak cocok dengan default id PB ([a-z0-9]{15}) — longgarkan.
    const ID = {
        name: "id",
        type: "text",
        primaryKey: true,
        required: true,
        autogeneratePattern: "[a-z0-9]{15}",
        min: 1,
        max: 0,
        pattern: "",
    };

    function baseCollection(name, fields, extra) {
        return new Collection(Object.assign({
            type: "base",
            name: name,
            listRule: ADMIN,
            viewRule: ADMIN,
            createRule: ADMIN,
            updateRule: ADMIN,
            deleteRule: ADMIN,
            fields: [ID].concat(fields, TIMESTAMPS),
        }, extra || {}));
    }

    function contentCollection(name, fields) {
        return baseCollection(name, fields, {
            listRule: "",
            viewRule: "",
        });
    }

    // --- users (admin auth) ---
    // Instalasi PocketBase baru sudah membuat koleksi "users" bawaan;
    // hapus dulu (masih kosong pada instalasi baru) lalu buat milik kita.
    const existingUsers = (() => {
        try {
            return app.findCollectionByNameOrId("users");
        } catch (e) {
            return null;
        }
    })();
    if (existingUsers) {
        app.delete(existingUsers);
    }

    app.save(new Collection({
        type: "auth",
        name: "users",
        listRule: ADMIN,
        viewRule: OWN_OR_ADMIN,
        createRule: ADMIN,
        updateRule: ADMIN,
        deleteRule: ADMIN,
        passwordAuth: {
            enabled: true,
            identityFields: ["username", "email"],
        },
        fields: [
            { name: "email", type: "email", required: false },
            { name: "username", type: "text", required: true },
            {
                name: "role",
                type: "select",
                values: ["admin"],
                defaultValue: "admin",
                required: true,
                maxSelect: 1,
            },
        ].concat(TIMESTAMPS),
        indexes: ["CREATE UNIQUE INDEX idx_users_username ON users (username)"],
    }));

    // --- clients (client portal auth) ---
    app.save(new Collection({
        type: "auth",
        name: "clients",
        listRule: ADMIN,
        viewRule: OWN_OR_ADMIN,
        createRule: ADMIN,
        updateRule: "@request.auth.id = id || " + ADMIN,
        deleteRule: ADMIN,
        passwordAuth: {
            enabled: true,
            identityFields: ["email"],
        },
        fields: [
            { name: "name", type: "text", required: true },
            { name: "company", type: "text" },
            { name: "phone", type: "text" },
        ].concat(TIMESTAMPS),
    }));

    const clientsId = app.findCollectionByNameOrId("clients").id;

    // --- services ---
    app.save(contentCollection("services", [
        { name: "titleId", type: "text", required: true },
        { name: "titleEn", type: "text", required: true },
        { name: "descId", type: "text", required: true },
        { name: "descEn", type: "text", required: true },
        { name: "iconName", type: "text", required: true },
        { name: "isActive", type: "bool", defaultValue: true },
        { name: "orderIdx", type: "number", required: false, defaultValue: 0 },
    ]));

    // --- portfolios ---
    app.save(contentCollection("portfolios", [
        { name: "titleId", type: "text", required: true },
        { name: "titleEn", type: "text", required: true },
        { name: "descId", type: "text", required: true },
        { name: "descEn", type: "text", required: true },
        { name: "imageUrl", type: "text", required: true },
        { name: "category", type: "text", required: true },
        { name: "clientName", type: "text", required: true },
        { name: "techStack", type: "text", required: true },
        { name: "challenge", type: "text" },
        { name: "solution", type: "text" },
        { name: "results", type: "text" },
        { name: "liveUrl", type: "text" },
        { name: "orderIdx", type: "number", required: false, defaultValue: 0 },
    ]));

    // --- pricing_plans ---
    app.save(contentCollection("pricingPlans", [
        { name: "name", type: "text", required: true },
        { name: "price", type: "text", required: true },
        { name: "featuresJson", type: "text", required: true, defaultValue: "[]" },
        { name: "isPopular", type: "bool", defaultValue: false },
        { name: "type", type: "text", required: true },
        { name: "orderIdx", type: "number", required: false, defaultValue: 0 },
    ]));

    // --- leads ---
    app.save(baseCollection("leads", [
        { name: "clientName", type: "text", required: true },
        { name: "whatsappNumber", type: "text", required: true },
        { name: "company", type: "text", required: true },
        { name: "requirements", type: "text", required: true },
        { name: "estimatedBudget", type: "text", required: true },
        {
            name: "status",
            type: "select",
            values: ["New", "Contacted", "Proposal", "Closed Won", "Closed Lost"],
            defaultValue: "New",
            required: true,
            maxSelect: 1,
        },
    ], { createRule: "" }));

    // --- testimonials ---
    app.save(contentCollection("testimonials", [
        { name: "clientName", type: "text", required: true },
        { name: "role", type: "text", required: true },
        { name: "contentId", type: "text", required: true },
        { name: "contentEn", type: "text", required: true },
        { name: "avatarUrl", type: "text", required: true },
        { name: "orderIdx", type: "number", required: false, defaultValue: 0 },
    ]));

    // --- faqs ---
    app.save(contentCollection("faqs", [
        { name: "questionId", type: "text", required: true },
        { name: "questionEn", type: "text", required: true },
        { name: "answerId", type: "text", required: true },
        { name: "answerEn", type: "text", required: true },
        { name: "orderIdx", type: "number", required: false, defaultValue: 0 },
    ]));

    // --- client_logos ---
    app.save(contentCollection("clientLogos", [
        { name: "name", type: "text", required: true },
        { name: "logoUrl", type: "text", required: true },
        { name: "isActive", type: "bool", defaultValue: true },
        { name: "orderIdx", type: "number", required: false, defaultValue: 0 },
    ]));

    // --- stats ---
    app.save(contentCollection("stats", [
        { name: "labelId", type: "text", required: true },
        { name: "labelEn", type: "text", required: true },
        { name: "value", type: "text", required: true },
        { name: "orderIdx", type: "number", required: false, defaultValue: 0 },
    ]));

    // --- posts ---
    app.save(contentCollection("posts", [
        { name: "slug", type: "text", required: true },
        { name: "titleId", type: "text", required: true },
        { name: "titleEn", type: "text", required: true },
        { name: "excerptId", type: "text", required: true },
        { name: "excerptEn", type: "text", required: true },
        { name: "contentId", type: "text", required: true, max: 500000 },
        { name: "contentEn", type: "text", required: true, max: 500000 },
        { name: "coverImageUrl", type: "text", required: true },
        { name: "category", type: "text", required: true },
        { name: "tags", type: "text", defaultValue: "[]" },
        { name: "isPublished", type: "bool", defaultValue: false },
        { name: "publishedAt", type: "date" },
        { name: "orderIdx", type: "number", required: false, defaultValue: 0 },
    ], {
        indexes: ["CREATE UNIQUE INDEX idx_posts_slug ON posts (slug)"],
    }));

    // --- projects ---
    app.save(baseCollection("projects", [
        {
            name: "clientId",
            type: "relation",
            required: true,
            collectionId: clientsId,
            cascadeDelete: true,
            maxSelect: 1,
        },
        { name: "title", type: "text", required: true },
        { name: "description", type: "text", required: true },
        {
            name: "status",
            type: "select",
            values: ["pending", "in_progress", "review", "done"],
            defaultValue: "pending",
            required: true,
            maxSelect: 1,
        },
        {
            name: "phase",
            type: "select",
            values: ["desain", "development", "testing", "launch"],
            defaultValue: "desain",
            required: true,
            maxSelect: 1,
        },
        { name: "progressPercent", type: "number", required: false, defaultValue: 0 },
        { name: "notes", type: "text" },
        { name: "startedAt", type: "date" },
        { name: "deliveredAt", type: "date" },
    ]));

    const projectsId = app.findCollectionByNameOrId("projects").id;

    // --- project_assets ---
    app.save(baseCollection("projectAssets", [
        {
            name: "projectId",
            type: "relation",
            required: true,
            collectionId: projectsId,
            cascadeDelete: true,
            maxSelect: 1,
        },
        { name: "fileName", type: "text", required: true },
        { name: "fileUrl", type: "text", required: true },
    ]));

    // --- invoices ---
    app.save(baseCollection("invoices", [
        {
            name: "projectId",
            type: "relation",
            required: true,
            collectionId: projectsId,
            cascadeDelete: true,
            maxSelect: 1,
        },
        { name: "amount", type: "number", required: false },
        { name: "description", type: "text", required: true },
        {
            name: "status",
            type: "select",
            values: ["unpaid", "paid", "overdue"],
            defaultValue: "unpaid",
            required: true,
            maxSelect: 1,
        },
        { name: "dueDate", type: "date", required: true },
    ]));

    // --- tickets ---
    app.save(baseCollection("tickets", [
        {
            name: "clientId",
            type: "relation",
            required: true,
            collectionId: clientsId,
            cascadeDelete: true,
            maxSelect: 1,
        },
        { name: "subject", type: "text", required: true },
        { name: "message", type: "text", required: true },
        {
            name: "status",
            type: "select",
            values: ["open", "resolved"],
            defaultValue: "open",
            required: true,
            maxSelect: 1,
        },
    ]));
}, (app) => {
    const names = [
        "tickets", "invoices", "projectAssets", "projects",
        "posts", "stats", "clientLogos", "faqs", "testimonials",
        "leads", "pricingPlans", "portfolios", "services",
        "clients", "users",
    ];
    for (const name of names) {
        try {
            const collection = app.findCollectionByNameOrId(name);
            app.delete(collection);
        } catch (e) {
            // collection tidak ada, abaikan
        }
    }
});
