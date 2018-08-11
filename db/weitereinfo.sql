DROP TABLE IF EXISTS weitereinfo;

CREATE TABLE weitereinfo(
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id),
strasse VARCHAR(200),
nummer INTEGER,
plz INTEGER,
stadt VARCHAR(150),
bundesland VARCHAR(100),
land VARCHAR(100),
telefon VARCHAR(50),
fax VARCHAR(50),
beruf VARCHAR(150),
webseite TEXT
);
