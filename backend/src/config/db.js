const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "primetrade",
  port: process.env.DB_PORT || 5432,
});

pool.on("connect", () => {
  console.log("PostgreSQL connected");
});

module.exports = pool;