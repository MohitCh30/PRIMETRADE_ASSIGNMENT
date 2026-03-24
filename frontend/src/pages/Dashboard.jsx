import { useEffect, useState } from "react";
import { getTasks } from "../services/taskService";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const username = localStorage.getItem("name") || "User";

  const fetchTasks = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-['Inter'] text-white">
      <nav className="border-b border-zinc-800 bg-[#111111]">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-4">
          <p className="text-lg font-semibold text-white">PrimeTrade</p>
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-400" data-testid="username-display">
              {username}
            </span>
            <button
              className="rounded-md border border-amber-500 px-3 py-1.5 text-sm text-amber-500 hover:bg-amber-500 hover:text-black"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
              data-testid="logout-button"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-4xl px-4 py-8">
        <h1 className="text-xl font-semibold text-white" data-testid="dashboard-heading">
          My Tasks
        </h1>

        <div className="mt-6">
          <TaskForm refresh={fetchTasks} />
          <TaskList tasks={tasks} refresh={fetchTasks} />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
