const {
  createTask,
  getTasksByUser,
  updateTask,
  deleteTask,
} = require("../models/taskModel");

const create = (title, description, userId) =>
  createTask(title, description, userId);

const getAll = (userId) => getTasksByUser(userId);

const update = (id, title, description) =>
  updateTask(id, title, description);

const remove = (id) => deleteTask(id);

module.exports = { create, getAll, update, remove };