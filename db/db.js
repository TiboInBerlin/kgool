const spicedPg = require("spiced-pg");
let db;

if(process.env.DATABASE_URL){
    db = spicedPg(process.env.DATABASE_URL)
}else{
    db = spicedPg(
        "postgres:thibautvalarche:postgres@localhost:5432/basejumpingpetition"
    );
}

exports.getSigners = function() {
    db
        .query(
            "SELECT users.first_name AS first_name,users.last_name AS last_name,user_profiles.age AS age,user_profiles.city AS city,user_profiles.url AS url FROM signatures JOIN users ON users.id = signatures.user_id LEFT JOIN user_profiles ON signatures.user_id = user_profiles.user_id"
        ) //dbquery returns a promise
        .then(results => {
            console.log(results.rows);
        });
};

exports.getSignature = function(userId) {
    const q = `
SELECT signature FROM signatures WHERE user_id = $1;
`;
    //we use $1 to prevent from sql injections
    // we use `` in order to create multiple lines
    const params = [userId];

    return db.query(q, params).then(results => {
        return results.rows;
    });
};

exports.insertSignature = function(userId, signature) {
    const q = `
INSERT INTO signatures (user_id, signature)
VALUES($1, $2) RETURNING *
`;
    // we use `` in order to create multiple lines
    const params = [userId, signature];

    return db.query(q, params).then(results => {
        return results.rows[0];
    });
    //db.query(q, params);
};

exports.returnUsers = function() {
    const q = `SELECT users.first_name,users.last_name,user_profiles.age,user_profiles.city,user_profiles.url FROM signatures JOIN users ON users.id = signatures.user_id LEFT JOIN user_profiles ON signatures.user_id = user_profiles.user_id`;
    //const q = `SELECT * FROM signatures;`;
    return db.query(q).then(results => {
        return results.rows;
    });
};
//we create this function in order to add the hashed password and other data to our users.sql table
exports.createUser = function(firstName, lastName, email, password) {
    const q = `
INSERT INTO users (first_name, last_name, email, hashed_password)
VALUES($1, $2, $3, $4) RETURNING *
`;
    const params = [firstName, lastName, email, password];

    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};
//we create this function to check the Email that the user wrote and we see if we have it our table, and if yes we return the whole array of the corresponding row.
exports.getEmail = function(email) {
    const q = `SELECT id,email,hashed_password FROM users WHERE email= $1;`;
    const params = [email];
    return db.query(q, params).then(results => {
        return results.rows;
    });
};

exports.insertProfile = function(userId, age, city, url) {
    const q = `
INSERT INTO user_profiles (user_id, age, city, url)
VALUES($1, $2, $3, $4) RETURNING *
`;
    const params = [userId, age, city, url];

    return db
        .query(q, params)
        .then(results => {
            return results.rows[0];
        })
        .catch(err => {
            console.log("insertProfile Sql Error is:" + err);
        });
};

exports.getSignersByCityName = function(cityName) {
    const q =
        "select users.first_name, users.last_name, user_profiles.age, user_profiles.url from users left join user_profiles on user_profiles.user_id = users.id where user_profiles.city = $1;";
    const params = [cityName];
    return db.query(q, params).then(results => {
        return results.rows;
    });
};

exports.getUserInfo = function(userId) {
    const q =
        "select users.first_name, users.last_name, users.email, users.hashed_password, user_profiles.age, user_profiles.city, user_profiles.url from users left join user_profiles on user_profiles.user_id = users.id where users.id = $1;";
    const params = [userId];
    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};

exports.updateUsers = function(
    userId,
    firstName,
    lastName,
    email,
    hashedPassword
) {
    const q = `
UPDATE users SET first_name = $2, last_name = $3, email = $4, hashed_password= $5 WHERE id = $1 RETURNING *;
`;
    //remember: we use params to prevent injections from hackers and to insert the vqlues of our sql files into our variables.
    const params = [userId, firstName, lastName, email, hashedPassword];

    return db
        .query(q, params)
        .then(results => {
            return results.rows[0];
        })
        .catch(err => {
            console.log("updating user Sql Error is:" + err);
        });
};

exports.updateUserProfile = function(userId, age, city, url) {
    const q = `
    INSERT INTO user_profiles (user_id,age, city, url)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id)
    DO UPDATE SET age = $2, city = $3, url = $4;
`;
    //remember: we use params to prevent injections from hackers and to insert the vqlues of our sql files into our variables.
    const params = [userId, age, city, url];

    return db
        .query(q, params)
        .then(results => {
            return results.rows[0];
        })
        .catch(err => {
            console.log("updating user Sql Error is:" + err);
        });
};

exports.deleteSignature = function(userId) {
    const q = `DELETE FROM signatures WHERE user_id = $1;`;
    const params = [userId];

    return db
        .query(q, params)
        .then(results => {
            return results.rows[0];
        })
        .catch(err => {
            console.log("Deleting signature Sql Error is:" + err);
        });
};
