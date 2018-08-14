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
    const q =
        "select * from users where id = $1;";
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


exports.getEmail = function(email) {
    const q = `SELECT id,email,hashed_password FROM users WHERE email= $1;`;
    const params = [email];
    return db.query(q, params).then(results => {
        return results.rows;
    });
};

exports.updateProducerProfile = function(userId, firmenname, steuernummer) {
    const q = `
    INSERT INTO producers (user_id,firmenname, steuernummer)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id)
    DO UPDATE SET firmenname = $2, steuernummer = $3;
`;
    //remember: we use params to prevent injections from hackers and to insert the vqlues of our sql files into our variables.
    const params = [userId, firmenname, steuernummer];

    return db
        .query(q, params)
        .then(results => {
            return results.rows[0];
        })
        .catch(err => {
            console.log("updating user Sql Error is:" + err);
        });
};
