import React, { useState, useMemo } from 'react';
import './Upcoming.css';

function UpcomingPage({ tasks, onTaskAction }) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  function getWeekStart(date) {
    const start = new Date(date);
    const day = start.getDay();
    const diff = (day === 0 ? -6 : 1 - day);
    start.setDate(start.getDate() + diff);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(today));
  const [calendarMonth, setCalendarMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const nextWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(newWeekStart.getDate() + 7);
    setCurrentWeekStart(newWeekStart);
    setCalendarMonth(new Date(newWeekStart.getFullYear(), newWeekStart.getMonth(), 1));
  };

  const prevWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(newWeekStart.getDate() - 7);
    setCurrentWeekStart(newWeekStart);
    setCalendarMonth(new Date(newWeekStart.getFullYear(), newWeekStart.getMonth(), 1));
  };

  const weekDays = useMemo(() => {
    const days = [];
    let d = new Date(currentWeekStart);
    for (let i = 0; i < 7; i++) {
      days.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    return days;
  }, [currentWeekStart]);

  const displayedMonth = useMemo(() => (
    currentWeekStart.toLocaleString('en-US', { month: 'long', year: 'numeric' })
  ), [currentWeekStart]);

  const overdueTasks = useMemo(() => (
    tasks.filter(t => t.date < today && !t.completed)
  ), [tasks, today]);

  const weekTasksByDay = useMemo(() => {
    const groups = {};
    weekDays.forEach(day => {
      const key = day.toDateString();
      groups[key] = [];
    });
    tasks.forEach(t => {
      if (t.completed) return;
      const key = t.date.toDateString();
      if (groups[key]) groups[key].push(t);
    });
    return groups;
  }, [tasks, weekDays]);

  const handleAction = (taskId, action) => {
    if (onTaskAction) onTaskAction(taskId, action);
  };

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

  const buildCalendarGrid = useMemo(() => {
    const firstOfMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
    const startDay = firstOfMonth.getDay();
    const offset = (startDay === 0 ? -6 : 1 - startDay);
    const gridStart = new Date(firstOfMonth);
    gridStart.setDate(firstOfMonth.getDate() + offset);
    const days = [];
    let d = new Date(gridStart);
    for (let i = 0; i < 42; i++) {
      days.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    return days;
  }, [calendarMonth]);

  const isSameDay = (a, b) => a.toDateString() === b.toDateString();
  const isInSameWeek = (date, weekStart) => {
    const start = new Date(weekStart);
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);
    return date >= start && date <= end;
  };

  const goPrevMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1));
  };
  const goNextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1));
  };

  const onSelectCalendarDate = (date) => {
    setCurrentWeekStart(getWeekStart(date));
    setCalendarMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  return (
    <div className="upcoming-page">
      <div className="upcoming-layout">
        <aside className="calendar-pane">
          <div className="calendar-header">
            <button className="nav-btn" onClick={goPrevMonth} aria-label="Previous month">‹</button>
            <div className="calendar-title">{calendarMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</div>
            <button className="nav-btn" onClick={goNextMonth} aria-label="Next month">›</button>
          </div>
          <div className="calendar-grid">
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
              <div key={d} className="calendar-dow">{d}</div>
            ))}
            {buildCalendarGrid.map((d, idx) => {
              const inMonth = d.getMonth() === calendarMonth.getMonth();
              const isTodayCell = isSameDay(d, today);
              const inSelectedWeek = isInSameWeek(d, currentWeekStart);
              return (
                <button
                  key={idx}
                  className={
                    'calendar-cell' +
                    (inMonth ? '' : ' dim') +
                    (isTodayCell ? ' today' : '') +
                    (inSelectedWeek ? ' in-week' : '')
                  }
                  onClick={() => onSelectCalendarDate(d)}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </aside>

        <section className="content-pane">
          <div className="content-header">
            <h1>Upcoming</h1>
            <div className="week-controls">
              <button className="nav-btn" onClick={prevWeek} aria-label="Previous week">‹</button>
              <div className="current-month">{displayedMonth}</div>
              <button className="nav-btn" onClick={nextWeek} aria-label="Next week">›</button>
            </div>
          </div>

          {overdueTasks.length > 0 && (
            <div className="overdue-section">
              <div className="section-title">Overdue</div>
              {overdueTasks.map(task => (
                <div key={task.id} className="task-item">
                  <button
                    className="task-circle"
                    onClick={() => handleAction(task.id, 'remove')}
                    aria-label="Remove task"
                  >
                    ○
                  </button>
                  <div className="task-details">
                    <div className="task-title">{task.name}</div>
                    <div className="task-date-time">
                      {task.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {task.timeInput && ` - ${getTaskTimeRange(task)}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="week-strip">
            {weekDays.map((day, index) => {
              const isTodayVal = isSameDay(day, today);
              return (
                <div key={index} className={'week-strip-day' + (isTodayVal ? ' today' : '')}>
                  <div className="wday-name">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  <div className="wday-date">{day.getDate()}</div>
                </div>
              );
            })}
          </div>

          <div className="week-list">
            {weekDays.map((day, idx) => {
              const key = day.toDateString();
              const dayTasks = (weekTasksByDay[key] || []).slice().sort((a, b) => {
                const parseTime = (t) => {
                  if (!t.timeInput) return null;
                  const [h, m] = t.timeInput.split(':').map(Number);
                  return h * 60 + m;
                };
                const ta = parseTime(a);
                const tb = parseTime(b);
                if (ta !== null && tb !== null && ta !== tb) return ta - tb;
                if (ta !== null && tb === null) return -1;
                if (ta === null && tb !== null) return 1;
                const priMap = { 'Priority 1': 1, 'Priority 2': 2, 'Priority 3': 3, 'Priority 4': 4 };
                const pa = priMap[a.selectedPriority] || 5;
                const pb = priMap[b.selectedPriority] || 5;
                return pa - pb;
              });
              return (
                <div key={idx} className="day-group">
                  <div className="day-group-header">
                    <div className="day-label">
                      {day.toLocaleDateString('en-US', { weekday: 'long' })}
                    </div>
                    <div className="day-date">
                      {day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  {dayTasks.length === 0 ? (
                    <div className="empty-state">No tasks</div>
                  ) : (
                    dayTasks.map(task => (
                      <div key={task.id} className="task-item">
                        <button
                          className="task-circle"
                          onClick={() => handleAction(task.id, 'remove')}
                          aria-label="Remove task"
                        >
                          ○
                        </button>
                        <span className={`priority-badge ${task.selectedPriority ? (task.selectedPriority.replace('Priority ','P').toLowerCase()) : ''}`}>{task.selectedPriority ? task.selectedPriority.replace('Priority ','P') : ''}</span>
                        <div className="task-details">
                          <div className="task-title">{task.taskName || task.name}</div>
                          <div className="task-row-desc">{task.description || ''}</div>
                          <div className="task-date-time">
                            {task.timeInput ? getTaskTimeRange(task) : ''}
                            <span className="task-category">{task.inboxFilter || ''}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export default UpcomingPage;