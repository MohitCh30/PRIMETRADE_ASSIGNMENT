const taskService = require("../services/taskService");

const createTask = async (req, res) => {
  // Only title/description are read from the client. The owner is ALWAYS the
  // authenticated user; any client-supplied user_id/id/role is ignored.
  const { title, description } = req.body;
  const task = await taskService.create(title, description, req.user.id);
  res.status(201).json(task);
};

const getTasks = async (req, res) => {
  const tasks = await taskService.getAll(req.user.id);
  res.json(tasks);
};

const getTask = async (req, res) => {
  const task = await taskService.getById(req.params.id, req.user.id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.json(task);
};

const updateTask = async (req, res) => {
  const { title, description } = req.body;
  const task = await taskService.update(
    req.params.id,
    req.user.id,
    title,
    description
  );
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.json(task);
};

const deleteTask = async (req, res) => {
  const task = await taskService.remove(req.params.id, req.user.id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.json({ message: "Task deleted" });
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
};
