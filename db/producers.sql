DROP TABLE IF EXISTS producers;

CREATE TABLE producers(
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id) UNIQUE,
Firmenname VARCHAR(50) NOT NULL UNIQUE,
Steuernummer VARCHAR(50) NOT NULL UNIQUE,
logo TEXT,
strasse VARCHAR(200),
nummer INTEGER,
plz INTEGER,
stadt VARCHAR(150),
bundesland VARCHAR(100),
land VARCHAR(100),
telefon VARCHAR(50),
fax VARCHAR(50),
webseite TEXT,
uberuns TEXT,
Katalog TEXT
);
