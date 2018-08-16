const spicedPg = require("spiced-pg");
let db;

if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    db = spicedPg("postgres:thibautvalarche:postgres@localhost:5432/kgool");
}

//we create this function in order to add the hashed password and other data to our users.sql table
exports.createUser = function(
    firstName,
    lastName,
    email,
    benutzername,
    password
) {
    const q = `
INSERT INTO users (vorname, nachname, email, benutzername, hashed_password)
VALUES($1, $2, $3, $4, $5) RETURNING *
`;
    const params = [firstName, lastName, email, benutzername, password];

    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};

exports.getBenutzername = function(benutzername) {
    const q = `SELECT id,benutzername,hashed_password FROM users WHERE benutzername= $1;`;
    const params = [benutzername];
    return db.query(q, params).then(results => {
        return results.rows;
    });
};

exports.updateUsers = function(
    userId,
    firstName,
    lastName,
    email,
    benutzername,
    hashedPassword
) {
    const q = `
UPDATE users SET vorname = $2, nachname = $3, email = $4, benutzername = $5, hashed_password= $6 WHERE id = $1 RETURNING *;
`;
    //remember: we use params to prevent injections from hackers and to insert the vqlues of our sql files into our variables.
    const params = [
        userId,
        firstName,
        lastName,
        email,
        benutzername,
        hashedPassword
    ];

    return db
        .query(q, params)
        .then(results => {
            return results.rows[0];
        })
        .catch(err => {
            console.log("updating user Sql Error is:" + err);
        });
};

exports.getUserInfo = function(id) {
    const q = "select * from users where id = $1;";
    const params = [id];
    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};

exports.getProducerInfo = function(userId) {
    const q =
        "select users.vorname, users.nachname, users.email, users.benutzername, users.hashed_password, producers.Firmenname, producers.Steuernummer from users left join producers on producers.user_id = users.id where users.id = $1;";
    const params = [userId];
    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};

exports.createProducer = function(id, firmenname, steuernummer) {
    const q = `
    INSERT INTO producers (user_id, Firmenname, Steuernummer)
    VALUES($1, $2, $3) RETURNING *
    `;
    const params = [id, firmenname, steuernummer];

    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};

exports.updateProducerProfile = function(userId, firmenname, steuernummer) {
    const q = `
    INSERT INTO producers (user_id,Firmenname, Steuernummer)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id)
    DO UPDATE SET Firmenname = $2, Steuernummer = $3;
`;
    //remember: we use params to prevent injections from hackers and to insert the vqlues of our sql files into our variables.
    const params = [userId, firmenname, steuernummer];

    return db
        .query(q, params)
        .then(results => {
            return results.rows[0];
        })
        .catch(err => {
            console.log("updating Producer Profile Sql Error is:" + err);
        });
};

exports.getProducerPresentation = function(userId) {
    const q = `SELECT producers.firmenname, producers.steuernummer, producers.logo, producers.strasse, producers.plz, producers.stadt, producers.bundesland, producers.land, producers.telefon, producers.fax, producers.webseite, producers.uberuns, producers.katalog from users left join producers on producers.user_id = users.id where users.id = $1;`;
    const params = [userId];
    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};

exports.getProducerInfo = function(userId) {
    const q =
        "select users.vorname, users.nachname, users.email, users.benutzername, users.hashed_password, producers.Firmenname, producers.Steuernummer from users left join producers on producers.user_id = users.id where users.id = $1;";
    const params = [userId];
    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};

exports.getProducerKeywords = function(userId) {
    const q =
        "select keywords.keyword1,keywords.keyword2,keywords.keyword3,keywords.keyword4,keywords.keyword5 from users left join keywords on keywords.user_id = users.id where users.id = $1;";
    const params = [userId];
    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};

exports.createProducerPresentation = function(
    userId,
    firmenname,
    steuernummer,
    logo,
    strasse,
    nummer,
    plz,
    stadt,
    bundesland,
    land,
    telefon,
    fax,
    webseite,
    uberuns,
    katalog
) {
    const q = `
        INSERT INTO producers (user_id, Firmenname, Steuernummer, logo, strasse, nummer, plz, stadt, bundesland, land, telefon, fax, webseite, uberuns, Katalog)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (user_id)
        DO UPDATE SET Firmenname = $2, Steuernummer = $3, logo = $4, strasse = $5, nummer =$6, plz = $7, stadt = $8, bundesland = $9, land = $10, telefon = $11, fax = $12, webseite = $13,uberuns = $14, Katalog = $15;
    `;
    //remember: we use params to prevent injections from hackers and to insert the vqlues of our sql files into our variables.
    const params = [
        userId,
        firmenname,
        steuernummer,
        logo,
        strasse,
        nummer,
        plz,
        stadt,
        bundesland,
        land,
        telefon,
        fax,
        webseite,
        uberuns,
        katalog
    ];

    return db
        .query(q, params)
        .then(results => {
            return results.rows[0];
        })
        .catch(err => {
            console.log("updating Producer presentation Sql Error is:" + err);
        });
};

exports.createProducerKeywords = function(
    userId,
    keyword1,
    keyword2,
    keyword3,
    keyword4,
    keyword5
) {
    const q = `
    INSERT INTO keywords (user_id,keyword1, keyword2, keyword3, keyword4, keyword5)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (user_id)
    DO UPDATE SET keyword1 = $2, keyword2 = $3, keyword3 = $4, keyword4 = $5, keyword5 = $6;
`;
    //remember: we use params to prevent injections from hackers and to insert the vqlues of our sql files into our variables.
    const params = [userId, keyword1, keyword2, keyword3, keyword4, keyword5];

    return db
        .query(q, params)
        .then(results => {
            return results.rows[0];
        })
        .catch(err => {
            console.log("updating keywords Sql Error is:" + err);
        });
};

exports.getEmail = function(email) {
    const q = `SELECT id,email,hashed_password FROM users WHERE email= $1;`;
    const params = [email];
    return db.query(q, params).then(results => {
        return results.rows;
    });
};

exports.searchKeywords = function(keyword) {
    const q = `SELECT * FROM keywords WHERE (keyword1 LIKE ('%' || $1 || '%') OR keyword2 LIKE ('%' || $1 || '%') OR keyword3 LIKE ('%' || $1 || '%') OR keyword4 LIKE ('%' || $1 || '%') OR keyword5 LIKE ('%' || $1 || '%'));`;
    const params = [keyword];
    return db
        .query(q, params)
        .then(results => {
            return results.rows;
        })
        .catch(err => {
            console.log("searching keywords Sql Error is:" + err);
        });
};

//USE IT FOR SEARCH 2!!!
exports.getProducersInfosByIds = function(arrayOfIds) {
    const query = `SELECT * FROM producers WHERE user_id = ANY ($1)`;
    return db
        .query(query, [arrayOfIds])
        .then(results => {
            console.log("results row producerinfo", results.rows);
            return results.rows;
        })
        .catch(err => {
            console.log("get producers info keywords Sql Error is:" + err);
        });
};
