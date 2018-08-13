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

exports.createProducer = function(firmenname, steuernummer) {
    const q = `
    INSERT INTO producers (Firmenname, Steuernummer)
    VALUES($1, $2) RETURNING *
    `;
    const params = [firmenname, steuernummer];

    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};
