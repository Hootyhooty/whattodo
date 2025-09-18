import React from 'react';

function Home({ tasks = [], onTaskAction }) {
  const today = new Date(); today.setHours(0,0,0,0);
  const parseDuration = (durationStr) => {
    const num = parseFloat(durationStr);
    if (isNaN(num)) return { hours: 0, minutes: 0 };
    const hours = Math.floor(num);
    const minutes = Math.round((num - hours) * 60);
    return { hours, minutes };
  };
  const getTaskTimeRange = (task) => {
    if (task.timeInput && task.durationInput) {
      const startTime = task.timeInput;
      const { hours, minutes } = parseDuration(task.durationInput);
      if (hours === 0 && minutes === 0) return startTime;
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const endHour = (startHour + hours + Math.floor((startMinute + minutes) / 60)) % 24;
      const endMinute = (startMinute + minutes) % 60;
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
      return `${startTime} - ${endTime}`;
    }
    return task.timeInput || '';
  };
  const priorityBadge = (p) => {
    if (!p) return null;
    const map = { 'Priority 1': 'P1', 'Priority 2': 'P2', 'Priority 3': 'P3', 'Priority 4': 'P4' };
    const label = map[p] || p;
    return <span className={`priority-badge ${label.toLowerCase()}`}>{label}</span>;
  };
  const priMap = { 'Priority 1': 1, 'Priority 2': 2, 'Priority 3': 3, 'Priority 4': 4 };
  const timeVal = (t) => {
    if (!t.timeInput) return null;
    const [h, m] = t.timeInput.split(':').map(Number);
    return h * 60 + m;
  };
  const items = tasks
    .filter(t => !t.completed && t.inboxFilter === 'Home' && t.date && t.date >= today)
    .slice()
    .sort((a, b) => {
      const ta = timeVal(a), tb = timeVal(b);
      if (ta !== null && tb !== null && ta !== tb) return ta - tb;
      if (ta !== null && tb === null) return -1;
      if (ta === null && tb !== null) return 1;
      const pa = priMap[a.selectedPriority] || 5;
      const pb = priMap[b.selectedPriority] || 5;
      return pa - pb;
    });
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Home</h1>
      </div>
      <ul className="task-list">
        {items.map(task => (
          <li key={task.id} className="task-item">
            <button className="task-circle-btn" onClick={() => onTaskAction && onTaskAction(task.id, 'complete')}>○</button>
            {priorityBadge(task.selectedPriority)}
            <div className="task-details">
              <div className="task-row-title">{task.taskName || task.name}</div>
              <div className="task-row-desc">{task.description || ''}</div>
              <div className="task-row-datetime">
                <span>
                  {task.date ? task.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                  {task.timeInput ? ` • ${getTaskTimeRange(task)}` : ''}
                </span>
                <span className="task-category">{task.inboxFilter || ''}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {items.length === 0 && <div className="empty-state">No tasks</div>}
    </div>
  );
}

export default Home;