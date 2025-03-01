import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;

// Load environment variables from a .env file
dotenv.config();

// Create a Pool instance for connecting to the database
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: 'localhost',
  database: process.env.DB_NAME,
  port: 5432,
});

// Function to connect to the database
const connectToDb = async () => {
  try {
    await pool.connect();
    console.log('Connected to the database.');
  } catch (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }
};

// Export the pool and connectToDb function
export { pool, connectToDb };
