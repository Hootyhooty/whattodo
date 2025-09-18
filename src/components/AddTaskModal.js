import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function AddTaskModal({ isOpen, onClose, onAdd }) {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedReminder, setSelectedReminder] = useState('');
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [isRepeatDropdownOpen, setIsRepeatDropdownOpen] = useState(false);
  const [timeInput, setTimeInput] = useState('');
  const [durationInput, setDurationInput] = useState('');
  const [timeError, setTimeError] = useState('');
  const [durationError, setDurationError] = useState('');
  const [inboxFilter, setInboxFilter] = useState(null);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [repeatChoice, setRepeatChoice] = useState('');

  const dateDropdownRef = useRef(null);
  const priorityDropdownRef = useRef(null);
  const reminderDropdownRef = useRef(null);
  const timeDropdownRef = useRef(null);
  const repeatDropdownRef = useRef(null);
  const inboxDropdownRef = useRef(null);
  const contentRef = useRef(null);

  const handleCancel = () => {
    onClose();
    setTaskName('');
    setDescription('');
    setSelectedDate(null);
    setSelectedPriority('');
    setSelectedReminder('');
    setTimeInput('');
    setDurationInput('');
    setTimeError('');
    setDurationError('');
    setInboxFilter(null);
    setIsInboxOpen(false);
    setRepeatChoice('');
  };

  const handleAdd = () => {
    if (taskName.trim()) {
      onAdd({ taskName, description, selectedDate, selectedPriority, selectedReminder, timeInput, durationInput, inboxFilter, repeatChoice });
      handleCancel();
    }
  };

  const getDayName = (date) => (date ? date.toLocaleDateString('en-US', { weekday: 'long' }) : '');
  const getFormattedDate = (date) => (date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '');
  const getDateButtonText = (date) => {
    if (!date) return 'Date';
    const now = new Date();
    now.setHours(0,0,0,0);
    const tomorrowDate = new Date(now);
    tomorrowDate.setDate(now.getDate() + 1);
    if (date.toDateString() === now.toDateString()) return 'Today';
    if (date.toDateString() === tomorrowDate.toDateString()) return 'Tomorrow';
    return getDayName(date);
  };

  const updateTaskNameWithDate = () => {};
  const updateTaskNameWithPriority = () => {};
  const updateTaskNameWithTime = () => {};

  const parseTime = (timeStr) => {
    if (!timeStr) return '';
    const time = timeStr.trim().toLowerCase().replace(/\s+/g, '');
    const militaryRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (militaryRegex.test(time)) {
      const [hours, minutes] = time.split(':').map(Number);
      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
    }
    const amPmRegex = /^([1-9]|1[0-2])(am|pm)?$/;
    if (amPmRegex.test(time)) {
      let hours = parseInt(time.replace(/(am|pm)/, ''));
      const isPM = time.includes('pm');
      if (isPM && hours !== 12) hours += 12;
      if (!isPM && hours === 12) hours = 0;
      return `${hours.toString().padStart(2, '0')}:00`;
    }
    return null;
  };

  const parseDuration = (durationStr) => {
    const num = parseFloat(durationStr);
    if (isNaN(num)) return 0;
    const hours = Math.floor(num);
    const minutes = Math.round((num - hours) * 60);
    return { hours, minutes };
  };

  const getTimeRange = () => {
    if (!timeInput || !durationInput) return '';
    const startTime = parseTime(timeInput);
    if (!startTime) return '';
    const { hours, minutes } = parseDuration(durationInput);
    if (hours === 0 && minutes === 0) return startTime;
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const endHour = (startHour + hours + Math.floor((startMinute + minutes) / 60)) % 24;
    const endMinute = (startMinute + minutes) % 60;
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    return `${startTime} - ${endTime}`;
  };

  const handleTimeChange = (e) => {
    e.stopPropagation();
    const value = e.target.value;
    setTimeInput(value);
    setTimeError('');
  };

  const handleDurationChange = (e) => {
    e.stopPropagation();
    const value = e.target.value;
    setDurationInput(value);
    setDurationError('');
  };

  const handleTimeAdd = () => {
    const parsedTime = parseTime(timeInput);
    const num = parseFloat(durationInput);
    if (!parsedTime) {
      setTimeError('Please enter a valid time (e.g., 0:00-23:59, 1am-12pm)');
    } else if (isNaN(num)) {
      setDurationError('Please enter a valid number');
    } else {
      setTimeInput(parsedTime);
      setDurationInput(num.toString());
      setTimeError('');
      setDurationError('');
      setIsTimeDropdownOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contentRef.current && !contentRef.current.contains(event.target)) {
        setIsDateDropdownOpen(false);
        setIsPriorityOpen(false);
        setIsReminderOpen(false);
        setIsTimeDropdownOpen(false);
        setIsRepeatDropdownOpen(false);
        setIsInboxOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dayColors = { 'Sunday': '#ffcccc', 'Monday': '#ffffcc', 'Tuesday': '#ff69b4', 'Wednesday': '#ccffcc', 'Thursday': '#ffebcc', 'Friday': '#cce5ff', 'Saturday': '#e6ccff' };
  const priorityColors = { 'Priority 1': '#ffcccc', 'Priority 2': '#cce5ff', 'Priority 3': '#ccffcc', 'Priority 4': '#ffffcc' };
  const reminderColors = { 'Before 1 hour': '#ffcccc', 'Before 30 minutes': '#cce5ff', 'Before 5 minutes': '#ccffcc', 'On time': '#ffffcc' };

  const reminderOptions = ['Before 1 hour', 'Before 30 minutes', 'Before 5 minutes', 'On time'];

  const isTimeFilled = parseTime(timeInput) && !timeError && !durationError;
  const isDateAndTimeFilled = selectedDate && isTimeFilled && taskName.trim();

  let headerContent = 'Add task';
  if (selectedDate || selectedPriority || isTimeFilled) {
    const priorityPart = selectedPriority ? <span style={{ color: priorityColors[selectedPriority] || '#757575' }}>{selectedPriority.replace('Priority ', 'P')} </span> : null;
    const datePart = selectedDate ? <span style={{ color: dayColors[getDayName(selectedDate)] || '#757575' }}>{getFormattedDate(selectedDate)}</span> : null;
    const timePart = isTimeFilled ? <span style={{ color: '#28a745' }}>{` ${getTimeRange()}`}</span> : null;
    headerContent = (<>{priorityPart}{datePart}{timePart}</>);
  } else if (selectedReminder) {
    headerContent = <span style={{ color: reminderColors[selectedReminder] || '#757575' }}>{selectedReminder.replace('Before ', '').replace(' minutes', 'm').replace(' hour', 'hr').replace('On', 'on')}</span>;
  } else if (inboxFilter) {
    headerContent = <span style={{ color: '#ffcccc' }}>{"Inbox - " + inboxFilter}</span>;
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => {
      setIsDateDropdownOpen(false);
      setIsPriorityOpen(false);
      setIsReminderOpen(false);
      setIsTimeDropdownOpen(false);
      setIsRepeatDropdownOpen(false);
      setIsInboxOpen(false);
    }}>
      <div className="modal-content" ref={contentRef} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ margin: '0 0 30px', fontSize: '2em', textAlign: 'center' }}>{headerContent}</h2>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Task name"
          className="task-input"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="description-input"
        />
        <div className="modal-options row">
          <div className="dropdown">
            <button
              className={`option-btn ${selectedDate ? 'selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsDateDropdownOpen(true);
              }}
              style={{
                backgroundColor: selectedDate ? dayColors[getDayName(selectedDate)] : '',
                color: selectedDate ? '#000' : ''
              }}
            >
              📅 {getDateButtonText(selectedDate)}
            </button>
            {isDateDropdownOpen && (
              <div className="date-dropdown" ref={dateDropdownRef}>
                <div className="calendar-wrapper">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      setIsDateDropdownOpen(false);
                    }}
                    onClickOutside={() => setIsDateDropdownOpen(false)}
                    popperPlacement="bottom-start"
                    inline={true}
                    calendarClassName="custom-calendar"
                    minDate={new Date()}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="dropdown">
            <button
              className={`option-btn ${selectedPriority ? 'selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsPriorityOpen(true);
              }}
              style={{
                backgroundColor: selectedPriority ? priorityColors[selectedPriority] : '',
                color: selectedPriority ? '#000' : ''
              }}
            >
              🔼 {selectedPriority ? selectedPriority.replace('Priority ', 'P') : 'Priority'}
            </button>
            {isPriorityOpen && (
              <div className="dropdown-content" ref={priorityDropdownRef}>
                {['Priority 1', 'Priority 2', 'Priority 3', 'Priority 4'].map((priority) => (
                  <div
                    key={priority}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPriority(priority);
                      setIsPriorityOpen(false);
                    }}
                  >
                    {priority}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="dropdown">
            <button
              className={`option-btn ${isTimeFilled ? 'time-filled' : ''} ${timeInput || durationInput ? 'selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsTimeDropdownOpen(true);
              }}
              style={{ zIndex: 1005 }}
            >
              ⏰ Time
            </button>
            {isTimeDropdownOpen && (
              <div className="time-dropdown" ref={timeDropdownRef} onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={timeInput}
                  onChange={handleTimeChange}
                  placeholder="Enter time (e.g., 0:00-23:59, 1am-12pm)"
                  className="time-input"
                />
                {timeError && <span className="error">{timeError}</span>}
                <input
                  type="text"
                  value={durationInput}
                  onChange={handleDurationChange}
                  placeholder="Enter duration (e.g., 0, 1, 1.5)"
                  className="duration-input"
                />
                {durationError && <span className="error">{durationError}</span>}
                <button className={`add-time-btn ${!timeError && !durationError && timeInput ? 'active' : ''}`} onClick={() => { handleTimeAdd(); setIsTimeDropdownOpen(false); }}>Add</button>
              </div>
            )}
          </div>
          <div className="dropdown">
            <button
              className={`option-btn ${selectedReminder ? 'selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsReminderOpen(true);
              }}
              style={{
                backgroundColor: selectedReminder ? reminderColors[selectedReminder] : '',
                color: selectedReminder ? '#000' : ''
              }}
            >
              ⏰ {selectedReminder ? selectedReminder.replace('Before ', '').replace(' minutes', 'm').replace(' hour', 'hr').replace('On', 'on') : 'Reminders'}
            </button>
            {isReminderOpen && (
              <div className="dropdown-content" ref={reminderDropdownRef}>
                {reminderOptions.map((reminder) => (
                  <div
                    key={reminder}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedReminder(reminder);
                      setIsReminderOpen(false);
                    }}
                  >
                    {reminder}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="dropdown">
            <button
              className={`option-btn ${repeatChoice ? 'selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsRepeatDropdownOpen(true);
              }}
            >
              🔁 {repeatChoice || 'Repeat'}
            </button>
            {isRepeatDropdownOpen && (
              <div className="dropdown-content" ref={repeatDropdownRef}>
                <div onClick={(e) => { e.stopPropagation(); setRepeatChoice('Daily'); setIsRepeatDropdownOpen(false); }}>Daily</div>
                <div onClick={(e) => { e.stopPropagation(); setRepeatChoice('Weekly'); setIsRepeatDropdownOpen(false); }}>Weekly</div>
                <div onClick={(e) => { e.stopPropagation(); setRepeatChoice('Monthly'); setIsRepeatDropdownOpen(false); }}>Monthly</div>
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <div className="dropdown">
            <button
              className={`option-btn ${inboxFilter ? 'selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsInboxOpen(!isInboxOpen);
              }}
            >
              📥 {inboxFilter ? `Inbox - ${inboxFilter}` : 'Inbox'}
            </button>
            {isInboxOpen && (
              <div className="dropdown-content" ref={inboxDropdownRef}>
                <div onClick={(e) => { e.stopPropagation(); setInboxFilter('Home'); setIsInboxOpen(false); }}>Home</div>
                <div onClick={(e) => { e.stopPropagation(); setInboxFilter('Work'); setIsInboxOpen(false); }}>Work</div>
                <div onClick={(e) => { e.stopPropagation(); setInboxFilter('Education'); setIsInboxOpen(false); }}>Education</div>
              </div>
            )}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
            <button className={`add-btn ${isDateAndTimeFilled ? 'active' : ''}`} onClick={handleAdd} disabled={!isDateAndTimeFilled}>Add task</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTaskModal;