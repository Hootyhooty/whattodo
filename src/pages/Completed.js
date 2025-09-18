import React from 'react';

function Completed({ tasks = [] }) {
  const completed = tasks.filter(t => t.completed && t.completedAt);
  const groups = completed.reduce((acc, t) => {
    const key = new Date(t.completedAt);
    key.setHours(0,0,0,0);
    const k = key.toDateString();
    acc[k] = acc[k] || [];
    acc[k].push(t);
    return acc;
  }, {});
  const dates = Object.keys(groups).map(d => new Date(d)).sort((a,b) => b - a);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Completed</h1>
      </div>
      {dates.length === 0 && <div className="empty-state">No completed tasks</div>}
      {dates.map(d => (
        <div key={d.toISOString()}>
          <div className="section-title">{d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
          <ul className="task-list">
            {groups[d.toDateString()].map(task => (
              <li key={task.id} className="task-item">
                <span className="task-circle-btn">✓</span>
                <div className="task-details">
                  <div className="task-row-title">{task.taskName || task.name}</div>
                  <div className="task-row-desc">{task.description || ''}</div>
                  <div className="task-row-datetime">Completed at {new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Completed;