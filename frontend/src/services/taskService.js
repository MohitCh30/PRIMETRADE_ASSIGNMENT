import API from "../api/api";

export const getTasks = async () => {
  const res = await API.get("/tasks");
  return res.data;
};

export const createTask = async (task) => {
  const res = await API.post("/tasks", task);
  return res.data;
};

export const updateTask = async (id, task) => {
  const res = await API.put(`/tasks/${id}`, task);
  return res.data;
};

export const deleteTask = async (id) => {
  const res = await API.delete(`/tasks/${id}`);
  return res.data;
};