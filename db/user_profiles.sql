DROP TABLE IF EXISTS user_profiles;

CREATE TABLE user_profiles(
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id) UNIQUE,
age INTEGER,
city VARCHAR(50),
url TEXT
);
