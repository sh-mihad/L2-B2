import { Pool } from "pg";
import { DB_CONNECTION_STRING } from "../constent";
export const pool = new Pool({
  connectionString:DB_CONNECTION_STRING
});

export const initDB = async () => {
  try {
    pool.query(`
         CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(20) NOT NULL,
          email VARCHAR(40) UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role VARCHAR(20) NOT NULL,
          created_at TIMESTAMP DEFAULT now(),
          updated_at TIMESTAMP DEFAULT now()
         )
        `);
    pool.query(`
         CREATE TABLE IF NOT EXISTS issues (
          id SERIAL PRIMARY KEY,
          title VARCHAR(150) NOT NULL,
          description TEXT NOT NULL,
          type VARCHAR(20) NOT NULL ,
          reporter_id INT,
          created_at TIMESTAMP DEFAULT now(),
          updated_at TIMESTAMP DEFAULT now()
         )
        `);
    console.log("db connected successfully done!");
  } catch (err) {
    throw err;
  }
};
