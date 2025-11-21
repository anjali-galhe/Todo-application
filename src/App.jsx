import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState({ title: "", completed: false });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/todos")
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      fetch(`http://localhost:5000/todos/${editId}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      }).then(() => {
        setTodos(todos.map(t =>
          t.id === editId ? { id: editId, ...form } : t
        ));
        setEditId(null);
        setForm({ title: "", completed: false });
      });
    } 
    
    else {
      fetch("http://localhost:5000/todos", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      })
        .then(res => res.json())
        .then(newTodo => {
          setTodos([...todos, newTodo]);
          setForm({ title: "", completed: false });
        });
    }
  };

  const handleEdit = (todo) => {
    setEditId(todo.id);
    setForm({ title: todo.title, completed: todo.completed });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/todos/${id}`, {
      method: "DELETE",
    }).then(() => {
      setTodos(todos.filter(t => t.id !== id));
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  return (
    <div className="main-wrapper">
      <div className="container">

        <h2 className="top-h">{editId ? "Edit Goal" : "Add Goal"}</h2>

        <form onSubmit={handleSubmit}>
          <input className="input"
            name="title"
            placeholder="Enter todo..."
            value={form.title}
            onChange={handleChange}
            required
          />

          <label>
            <input className="checkbox"
              type="checkbox"
              name="completed"
              checked={form.completed}
              onChange={handleChange}
            />
            Completed
          </label>

          <button type="submit">
            {editId ? "Update" : "Add"}
          </button>
        </form>

        <hr />

        <h2>LIST OF GOALS</h2>

        {todos.map(todo => (
          <div className="user-card" key={todo.id}>
            <span>
              <strong>{todo.title}</strong> — 
              {todo.completed ? " Completed🎉🎉" : " Not Completed ⏳"}
            </span>

            <div>
              <button className="edit" onClick={() => handleEdit(todo)}>Edit</button>
              <button className="delete" onClick={() => handleDelete(todo.id)}>Delete</button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default App;
