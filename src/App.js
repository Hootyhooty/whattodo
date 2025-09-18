import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Inbox from './pages/Inbox';
import Today from './pages/Today';
import Upcoming from './pages/Upcoming';
import Filters from './pages/Filters';
import Completed from './pages/Completed';
import Home from './pages/Home';
import MyWork from './pages/MyWork';
import Education from './pages/Education';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);

  const generateOccurrences = (baseTask, repeatChoice) => {
    const occurrences = [];
    const baseDate = baseTask.selectedDate || new Date();
    const count = 4; // generate next 4 occurrences
    for (let i = 1; i <= count; i++) {
      const d = new Date(baseDate);
      if (repeatChoice === 'Daily') d.setDate(d.getDate() + i);
      if (repeatChoice === 'Weekly') d.setDate(d.getDate() + 7 * i);
      if (repeatChoice === 'Monthly') d.setMonth(d.getMonth() + i);
      occurrences.push({ ...baseTask, id: Date.now() + i, date: d, selectedDate: d, completed: false });
    }
    return occurrences;
  };

  const handleAddTask = (taskData) => {
    const baseDate = taskData.selectedDate || new Date();
    const newTask = {
      ...taskData,
      id: Date.now(),
      completed: false,
      completedAt: null,
      date: baseDate,
    };
    const newTasks = [newTask];
    if (taskData.repeatChoice) {
      newTasks.push(...generateOccurrences(newTask, taskData.repeatChoice));
    }
    setTasks(prev => [...prev, ...newTasks]);
    console.log('Task(s) added:', newTasks);
  };

  const handleTaskAction = (taskId, action) => {
    if (action === 'complete') {
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, completed: true, completedAt: new Date() } : task
      ));
      console.log(`Task ${taskId} marked as completed`);
    } else if (action === 'remove') {
      setTasks(tasks.filter(task => task.id !== taskId));
      console.log(`Task ${taskId} removed`);
    }
  };

  return (
    <Router>
      <div className="container">
        <Sidebar onAddTask={handleAddTask} tasks={tasks} />
        <main className="main-content">
          <Routes>
            <Route path="/inbox" element={<Inbox tasks={tasks} onTaskAction={handleTaskAction} />} />
            <Route path="/today" element={<Today tasks={tasks} onTaskAction={handleTaskAction} />} />
            <Route path="/upcoming" element={<Upcoming tasks={tasks} onTaskAction={handleTaskAction} />} />
            <Route path="/filters" element={<Filters tasks={tasks} onTaskAction={handleTaskAction} />} />
            <Route path="/completed" element={<Completed tasks={tasks} onTaskAction={handleTaskAction} />} />
            <Route path="/home" element={<Home tasks={tasks} onTaskAction={handleTaskAction} />} />
            <Route path="/mywork" element={<MyWork tasks={tasks} onTaskAction={handleTaskAction} />} />
            <Route path="/education" element={<Education tasks={tasks} onTaskAction={handleTaskAction} />} />
            <Route path="/" element={<Inbox tasks={tasks} onTaskAction={handleTaskAction} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;