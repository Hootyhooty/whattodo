import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AddTaskModal from './AddTaskModal';

function Sidebar({ onAddTask, tasks = [] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTaskClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleAddTask = (taskData) => {
    onAddTask(taskData);
    setIsModalOpen(false);
  };

  const today = new Date(); today.setHours(0,0,0,0);
  const isToday = (d) => d && d.toDateString() === today.toDateString();
  const isFuture = (d) => d && d >= today;

  const inboxCount = tasks.filter(t => !t.completed).length;
  const overdueCount = tasks.filter(t => !t.completed && t.date && t.date < today).length;
  const todayCount = tasks.filter(t => !t.completed && t.date && isToday(t.date)).length + overdueCount;
  const upcomingCount = tasks.filter(t => !t.completed && t.date && t.date > today).length;

  const homeCount = tasks.filter(t => !t.completed && t.inboxFilter === 'Home' && isFuture(t.date)).length;
  const workCount = tasks.filter(t => !t.completed && t.inboxFilter === 'Work' && isFuture(t.date)).length;
  const eduCount = tasks.filter(t => !t.completed && t.inboxFilter === 'Education' && isFuture(t.date)).length;

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <aside className="sidebar">
      <div className="tab-bar">
        <button className="add-task-btn" onClick={handleAddTaskClick}>+ Add task</button>
        <button className="search-btn">🔍 Search</button>
        <ul className="tab-list">
          <li className={`tab-list-item ${window.location.pathname === '/inbox' ? 'active' : ''}`}>
            <Link to="/inbox" className="option-btn">
              📥 Inbox <span>{inboxCount}</span>
            </Link>
          </li>
          <li className={`tab-list-item ${window.location.pathname === '/today' ? 'active' : ''}`}>
            <Link to="/today" className="option-btn">
              📅 Today <span>{todayCount}</span>
            </Link>
          </li>
          <li className={`tab-list-item ${window.location.pathname === '/upcoming' ? 'active' : ''}`}>
            <Link to="/upcoming" className="option-btn">
              📅 Upcoming <span>{upcomingCount}</span>
            </Link>
          </li>
          <li className={`tab-list-item ${window.location.pathname === '/filters' ? 'active' : ''}`}>
            <Link to="/filters" className="option-btn">
              ⚙️ Filters & Labels
            </Link>
          </li>
          <li className={`tab-list-item ${window.location.pathname === '/completed' ? 'active' : ''}`}>
            <Link to="/completed" className="option-btn">
              ✅ Completed <span>{completedCount}</span>
            </Link>
          </li>
          <li className="project-section">
            My Projects
            <ul className="sub-tab-list">
              <li className={`tab-list-item ${window.location.pathname === '/home' ? 'active' : ''}`}>
                <Link to="/home" className="option-btn">
                  # Home 🏡 <span>{homeCount}</span>
                </Link>
              </li>
              <li className={`tab-list-item ${window.location.pathname === '/mywork' ? 'active' : ''}`}>
                <Link to="/mywork" className="option-btn">
                  # My work 💼 <span>{workCount}</span>
                </Link>
              </li>
              <li className={`tab-list-item ${window.location.pathname === '/education' ? 'active' : ''}`}>
                <Link to="/education" className="option-btn">
                  # Education 🎓 <span>{eduCount}</span>
                </Link>
              </li>
            </ul>
          </li>
        </ul>
        <button className="help-btn">Help & resources</button>
      </div>
      <AddTaskModal isOpen={isModalOpen} onClose={handleModalClose} onAdd={handleAddTask} />
    </aside>
  );
}

export default Sidebar;