
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  CheckCircle,
  Clock,
  ListTodo,
  Search,
  RefreshCw
} from "lucide-react";

import API from "../api";

import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await API.get("/tasks", {
        params: { search, status, priority, sort }
      });

      setTasks(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load tasks"
      );
    } finally {
      setLoading(false);
    }
  }, [search, status, priority, sort]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (taskData) => {
    try {
      await API.post("/tasks", taskData);
      await fetchTasks();
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Could not create task"
      );
    }
  };

  const updateTask = async (id, updates) => {
    try {
      await API.put(`/tasks/${id}`, updates);
      await fetchTasks();
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Could not update task"
      );
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await API.delete(`/tasks/${id}`);
      await fetchTasks();
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Could not delete task"
      );
    }
  };

  const stats = useMemo(() => {
    const total = tasks.length;

    const completed = tasks.filter(
      task => task.status === "Completed"
    ).length;

    const pending = tasks.filter(
      task => task.status === "Pending"
    ).length;

    const overdue = tasks.filter(task =>
      task.status === "Pending" &&
      task.dueDate &&
      new Date(task.dueDate) < new Date(
        new Date().setHours(0, 0, 0, 0)
      )
    ).length;

    return { total, completed, pending, overdue };
  }, [tasks]);

  return (
    <div className="app-container">
      <Navbar />

      <main className="dashboard">
        <div className="dashboard-heading">
          <div>
            <h1>My Dashboard</h1>
            <p>Manage your daily tasks and stay productive.</p>
          </div>

          <button
            className="refresh-btn"
            onClick={fetchTasks}
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* STATISTICS */}

        <div className="stats-grid">
          <div className="stat-card">
            <ListTodo size={25} />
            <p>Total Tasks</p>
            <h2>{stats.total}</h2>
          </div>

          <div className="stat-card">
            <Clock size={25} />
            <p>Pending</p>
            <h2>{stats.pending}</h2>
          </div>

          <div className="stat-card">
            <CheckCircle size={25} />
            <p>Completed</p>
            <h2>{stats.completed}</h2>
          </div>

          <div className="stat-card">
            <Clock size={25} />
            <p>Overdue</p>
            <h2>{stats.overdue}</h2>
          </div>
        </div>

        {/* CREATE TASK */}

        <section className="content-grid">
          <TaskForm onAdd={addTask} />

          <section className="tasks-section">
            <div className="section-heading">
              <h2>My Tasks</h2>
              <span>{stats.total} tasks</span>
            </div>

            {/* SEARCH */}

            <div className="search-box">
              <Search size={19} />

              <input
                placeholder="Search tasks..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* FILTERS */}

            <div className="filters">
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>

              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
              >
                <option value="All">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="dueDate">Due Date</option>
              </select>
            </div>

            {/* TASK LIST */}

            {error && <p className="error">{error}</p>}

            {loading ? (
              <p className="loading">Loading tasks...</p>
            ) : (
              <TaskList
                tasks={tasks}
                onUpdate={updateTask}
                onDelete={deleteTask}
              />
            )}
          </section>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
