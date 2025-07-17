import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

// By default, API_BASE is '', but in Docker we can set it to 'http://backend:5000'
const API_BASE = 'http://localhost:5000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    load();
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const load = async () => {
    try {
      const res = await axios.get(`${API_BASE}/tasks`);
      setTasks(res.data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const add = async () => {
    if (!title.trim()) return;
    await axios.post(`${API_BASE}/tasks`, { title, project: 'General' });
    setTitle('');
    load();
  };

  const toggle = async (id, completed) => {
    await axios.put(`${API_BASE}/tasks/${id}`, { completed: !completed });
    load();
  };

  const del = async (id) => {
    await axios.delete(`${API_BASE}/tasks/${id}`);
    load();
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>TaskZen</h2>
      </aside>
      <main>
        <h1>
          Today 
          <span className="datetime"> • {dateTime.toLocaleDateString()} • {dateTime.toLocaleTimeString()}</span>
        </h1>
        <div className="add">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="New task"
          />
          <button onClick={add}>Add</button>
        </div>
        <ul className="tasks">
          {tasks.map(t => (
            <li key={t._id} className={t.completed ? 'done' : ''}>
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => toggle(t._id, t.completed)}
              />
              <span>{t.title}</span>
              <button onClick={() => del(t._id)}>✕</button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
