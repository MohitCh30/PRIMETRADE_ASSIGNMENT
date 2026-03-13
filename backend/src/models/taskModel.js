const pool = require("../config/db");

const createTask = async (title, description, userId) => {
  const { rows } = await pool.query(
    "INSERT INTO tasks(title,description,user_id) VALUES($1,$2,$3) RETURNING *",
    [title, description, userId]
  );
  return rows[0];
};

const getTasksByUser = async (userId) => {
  const { rows } = await pool.query(
    "SELECT * FROM tasks WHERE user_id=$1",
    [userId]
  );
  return rows;
};

const updateTask = async (id, title, description) => {
  const { rows } = await pool.query(
    "UPDATE tasks SET title=$1,description=$2 WHERE id=$3 RETURNING *",
    [title, description, id]
  );
  return rows[0];
};

const deleteTask = async (id) => {
  await pool.query("DELETE FROM tasks WHERE id=$1", [id]);
};

module.exports = {
  createTask,
  getTasksByUser,
  updateTask,
  deleteTask,
};