const spicedPg = require("spiced-pg");
let db;

if(process.env.DATABASE_URL){
    db = spicedPg(process.env.DATABASE_URL)
}else{
    db = spicedPg(
        "postgres:thibautvalarche:postgres@localhost:5432/basejumpingpetition"
    );
}
