const {
  createTask,
  getTasksByUser,
  getTaskByIdForUser,
  updateTaskForUser,
  deleteTaskForUser,
} = require("../models/taskModel");

const create = (title, description, userId) =>
  createTask(title, description, userId);

const getAll = (userId) => getTasksByUser(userId);

const getById = (id, userId) => getTaskByIdForUser(id, userId);

const update = (id, userId, title, description) =>
  updateTaskForUser(id, userId, title, description);

const remove = (id, userId) => deleteTaskForUser(id, userId);

module.exports = { create, getAll, getById, update, remove };
