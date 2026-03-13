import { deleteTask } from "../services/taskService";

function TaskList({ tasks, refresh }) {

  const handleDelete = async (id) => {
    await deleteTask(id);
    refresh();
  };

  return (
    <div>
      {tasks.map((task) => (
        <div className="task" key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>

          <button onClick={() => handleDelete(task.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default TaskList;