import { useState } from "react";
import { deleteTask, updateTask } from "../services/taskService";

function TaskList({ tasks, refresh }) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleDelete = async (id) => {
    await deleteTask(id);
    refresh();
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const handleSave = async (id) => {
    await updateTask(id, { title: editTitle, description: editDescription });
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
    refresh();
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
  };

  return (
    <div className="font-['Inter']">
      {tasks.length === 0 ? (
        <p className="text-sm text-zinc-500" data-testid="empty-state">
          No tasks yet. Add one above.
        </p>
      ) : null}

      {tasks.map((task) => (
        <div
          className="mb-3 rounded-lg border border-zinc-800 bg-[#111111] p-4"
          key={task.id}
          data-testid="task-item"
        >
          {editingId === task.id ? (
            <div className="space-y-3">
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white font-['JetBrains_Mono'] focus:border-transparent focus:ring-2 focus:ring-amber-500"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white font-['JetBrains_Mono'] focus:border-transparent focus:ring-2 focus:ring-amber-500"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSave(task.id)}
                  className="rounded-md bg-amber-500 px-4 py-2 font-semibold text-black hover:bg-amber-400"
                  data-testid="save-task-button"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="rounded-md border border-zinc-600 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800"
                  data-testid="cancel-edit-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="font-medium text-white" data-testid="task-title">
                {task.title}
              </h3>
              <p className="mt-1 text-sm text-zinc-400">{task.description}</p>
              <div className="mt-3 flex items-center gap-4">
                <button
                  onClick={() => handleEdit(task)}
                  className="text-sm text-amber-400 hover:text-amber-300"
                  data-testid="edit-task-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-sm text-red-400 hover:text-red-300"
                  data-testid="delete-task-button"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default TaskList;
