DROP TABLE IF EXISTS keywords;

CREATE TABLE keywords(
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id) UNIQUE,
keyword1 VARCHAR(50),
keyword2 VARCHAR(50),
keyword3 VARCHAR(50),
keyword4 VARCHAR(50),
keyword5 VARCHAR(50),
keyword6 VARCHAR(50),
keyword7 VARCHAR(50),
keyword8 VARCHAR(50),
keyword9 VARCHAR(50)
);
