DROP TABLE IF EXISTS users;

CREATE TABLE users(
id SERIAL PRIMARY KEY,
first_name VARCHAR(50) NOT NULL,
last_name VARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL UNIQUE,
hashed_password VARCHAR(100) NOT NULL,
create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BE CAREFUL! each time you change this table here, you need to go to command line and use psql!
