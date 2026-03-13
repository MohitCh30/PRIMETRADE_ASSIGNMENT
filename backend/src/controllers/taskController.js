const taskService = require("../services/taskService");
const createTask = async (req, res) => {
  const { title, description } = req.body;
  const task = await taskService.create(title, description, req.user.id);
  res.status(201).json(task);
};

const getTasks = async (req, res) => {
  const tasks = await taskService.getAll(req.user.id);
  res.json(tasks);
};

const updateTask = async (req, res) => {
  const { title, description } = req.body;
  const task = await taskService.update(req.params.id, title, description);
  res.json(task);
};

const deleteTask = async (req, res) => {
  await taskService.remove(req.params.id);
  res.json({ message: "Task deleted" });
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};