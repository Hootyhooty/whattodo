import React from 'react';

function Today({ tasks = [], onTaskAction }) {
  const now = new Date(); now.setHours(0,0,0,0);
  const overdue = tasks.filter(t => !t.completed && t.date && t.date < now);
  const todayTasks = tasks.filter(t => !t.completed && t.date && t.date.toDateString() === now.toDateString());

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

  const TaskList = ({ items, hideDate }) => (
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
                {!hideDate && task.date ? task.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                {task.timeInput ? `${!hideDate ? ' • ' : ''}${getTaskTimeRange(task)}` : ''}
              </span>
              <span className="task-category">{task.inboxFilter || ''}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Today</h1>
      </div>
      {overdue.length > 0 && (
        <div>
          <div className="section-title">Overdue</div>
          <TaskList items={overdue} hideDate={false} />
        </div>
      )}
      <div>
        <div className="section-title">Today</div>
        <TaskList items={todayTasks} hideDate={true} />
      </div>
    </div>
  );
}

export default Today;