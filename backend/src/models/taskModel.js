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

const getTaskByIdForUser = async (id, userId) => {
  const { rows } = await pool.query(
    "SELECT * FROM tasks WHERE id=$1 AND user_id=$2",
    [id, userId]
  );
  return rows[0];
};

const updateTaskForUser = async (id, userId, title, description) => {
  const { rows } = await pool.query(
    "UPDATE tasks SET title=$1,description=$2 WHERE id=$3 AND user_id=$4 RETURNING *",
    [title, description, id, userId]
  );
  return rows[0];
};

const deleteTaskForUser = async (id, userId) => {
  const { rows } = await pool.query(
    "DELETE FROM tasks WHERE id=$1 AND user_id=$2 RETURNING id",
    [id, userId]
  );
  return rows[0];
};

module.exports = {
  createTask,
  getTasksByUser,
  getTaskByIdForUser,
  updateTaskForUser,
  deleteTaskForUser,
};
