import { useState } from "react";
import { createTask } from "../services/taskService";

function TaskForm({ refresh }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createTask({ title, description });

    setTitle("");
    setDescription("");

    refresh();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Task description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;