import {usestate} from "react";
import {Plus} from "lucide-react";

function TaskForm({ onAdd }){
    const [form, setForm] = useState({
        title:"",
        description:"",
        priority:"Medium",
        dueDate:""
    });

    const handleChange = (e) =>{
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handlesubmit = async (e) =>{
        e.preventDefault();

        if(!form.title.trim()) return;

        await onAdd({
            ...form,
            dueDate: form.dueDate || null
        });

        setForm({
            title:"",
            description:"",
            priority: "Medium",
            dueDate:"",
        });
    };

    return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h3>Create New Task</h3>

      <input
        name="title"
        placeholder="What needs to be done?"
        value={form.title}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Task description..."
        value={form.description}
        onChange={handleChange}
      />

      <div className="form-row">
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
        >
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>

        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="primary-btn">
        <Plus size={18} />
        Add Task
      </button>
    </form>
  );
}

export default TaskForm;