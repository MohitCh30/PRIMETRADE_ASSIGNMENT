import { useEffect, useState } from "react";
import { getTasks } from "../services/taskService";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

function Dashboard() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container">
      <h1>Task Dashboard</h1>

      <TaskForm refresh={fetchTasks} />

      <TaskList tasks={tasks} refresh={fetchTasks} /> 

      <button
  className="btn btn-danger mb-3"
  onClick={() => {
    localStorage.removeItem("token");
    window.location.href = "/";
  }}
>
  Logout
</button>
    </div>
  );
}

export default Dashboard;