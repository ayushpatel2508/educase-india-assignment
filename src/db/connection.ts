import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required for Neon connection");
}

const pool: Pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
});

pool.on("error", (err: Error) => {
  console.error("Unexpected error on idle client", err);
});

export default pool;
