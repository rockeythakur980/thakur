
import {
  Check,
  Trash2,
  Edit,
  X
} from "lucide-react";

import { useState } from "react";

function TaskList({
  tasks,
  onUpdate,
  onDelete
}) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const startEditing = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
  };

  const saveEdit = async (task) => {
    if (!editTitle.trim()) return;

    await onUpdate(task._id, {
      title: editTitle.trim()
    });

    setEditingId(null);
  };

  return (
    <div className="task-list">
      {tasks.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks found</h3>
          <p>Create a task to get started.</p>
        </div>
      ) : (
        tasks.map((task) => (
          <div className="task-card" key={task._id}>
            <div className="task-info">
              <div className="task-title-row">
                {editingId === task._id ? (
                  <input
                    value={editTitle}
                    onChange={(e) =>
                      setEditTitle(e.target.value)
                    }
                    autoFocus
                  />
                ) : (
                  <h3 className={
                    task.status === "Completed"
                      ? "completed"
                      : ""
                  }>
                    {task.title}
                  </h3>
                )}

                <span
                  className={`priority ${task.priority.toLowerCase()}`}
                >
                  {task.priority}
                </span>
              </div>

              <p>{task.description}</p>

              <small>
                Due: {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "No deadline"}
              </small>

              <small className="status">
                {task.status}
              </small>
            </div>

            <div className="task-actions">
              {editingId === task._id ? (
                <>
                  <button
                    onClick={() => saveEdit(task)}
                    title="Save"
                  >
                    <Check size={18} />
                  </button>

                  <button
                    onClick={() => setEditingId(null)}
                    title="Cancel"
                  >
                    <X size={18} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() =>
                      onUpdate(task._id, {
                        status:
                          task.status === "Completed"
                            ? "Pending"
                            : "Completed"
                      })
                    }
                    title="Toggle completion"
                  >
                    <Check size={18} />
                  </button>

                  <button
                    onClick={() => startEditing(task)}
                    title="Edit task"
                  >
                    <Edit size={18} />
                  </button>
                </>
              )}

              <button
                className="delete-btn"
                onClick={() => onDelete(task._id)}
                title="Delete task"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default TaskList;
