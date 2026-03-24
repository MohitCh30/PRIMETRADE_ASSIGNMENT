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
    <div className="mb-6 rounded-lg border border-zinc-800 bg-[#111111] p-6 font-['Inter']">
      <h2 className="text-lg font-semibold text-white">Add Task</h2>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className="mb-1 block text-sm text-zinc-300">Title</label>
          <input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white font-['JetBrains_Mono'] focus:border-transparent focus:ring-2 focus:ring-amber-500"
            data-testid="task-title-input"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-300">Description</label>
          <textarea
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white font-['JetBrains_Mono'] focus:border-transparent focus:ring-2 focus:ring-amber-500"
            data-testid="task-description-input"
            required
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-amber-500 px-4 py-2 font-semibold text-black hover:bg-amber-400"
          data-testid="add-task-button"
        >
          Add Task
        </button>
      </form>
    </div>
  );
}

export default TaskForm;
