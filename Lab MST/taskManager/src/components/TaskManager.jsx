import React, { useState } from "react";
import { useForm } from "../hooks/useForm";

const TaskManager = () => {
  const { values, handleChange, resetForm } = useForm({
    title: "",
    priority: "Low",
  });

  const [tasks, setTasks] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.title) return; 
    setTasks([...tasks, { title: values.title, priority: values.priority }]);
    resetForm();
  };

  return (
    <div style={{ maxWidth: "400px", margin: "20px auto" }}>
      <h2>Task Manager</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <div>
          <label>Task Title:</label>
          <input
            type="text"
            name="title"
            value={values.title}
            onChange={handleChange}
            placeholder="Enter task title"
            required
          />
        </div>

        <div>
          <label>Priority:</label>
          <select name="priority" value={values.priority} onChange={handleChange}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <button type="submit">Add Task</button>
      </form>

      <h3>Tasks</h3>
      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <table border="1" cellPadding="5" width="100%">
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index}>
                <td>{task.title}</td>
                <td>{task.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TaskManager;