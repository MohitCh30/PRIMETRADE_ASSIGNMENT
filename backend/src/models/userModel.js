const pool = require("../config/db");

const createUser = async (name, email, passwordHash, role = "user") => {
  const query = `
    INSERT INTO users(name,email,password_hash,role)
    VALUES($1,$2,$3,$4)
    RETURNING id,name,email,role
  `;

  const { rows } = await pool.query(query, [
    name,
    email,
    passwordHash,
    role,
  ]);

  return rows[0];
};

const findUserByEmail = async (email) => {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );
  return rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
};