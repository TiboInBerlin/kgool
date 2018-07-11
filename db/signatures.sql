
DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures(
id SERIAL PRIMARY KEY, ---serial to make it start from 1
user_id INTEGER REFERENCES users(id),
--first_name VARCHAR(50) NOT NULL,
--last_name VARCHAR(50) NOT NULL,
signature TEXT NOT NULL,
create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INSTRUCTIONS: in command line:
-- 1 psql -l to list our db
-- 2 create db basejumping-petition : then \dt
-- 3 psql -d petition -f db/schema.sql   f stands for file
-- 4 it will then show CREATE TABLE, then do: psql -d petition
-- 5 \dt
-- 6 SELECT * FROM signatures;
-- 7 We set up our table and we need now to set up the connection.
-- 8 let s go to the db.js file!
