import React, { useState } from 'react';
import './calender.css';

const Calendar: React.FC = () => {
  const [selectedDate] = useState(new Date());

  const month = selectedDate.toLocaleString('default', { month: 'long' });
  const year = selectedDate.getFullYear();
  const daysInMonth = new Date(year, selectedDate.getMonth() + 1, 0).getDate();

  const startDay = new Date(year, selectedDate.getMonth(), 1).getDay();

  const daysArray: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) daysArray.push(null);
  for (let i = 1; i <= daysInMonth; i++) daysArray.push(i);

  const today = new Date();
  const isToday = (day: number | null) =>
    day === today.getDate() &&
    selectedDate.getMonth() === today.getMonth() &&
    selectedDate.getFullYear() === today.getFullYear();

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <span>{month} {year}</span>
      </div>

      <div className="calendar-weekdays">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
          <div key={d} className="weekday">{d}</div>
        ))}
      </div>

      <div className="calendar-days">
        {daysArray.map((day, idx) => (
          <div
            key={idx}
            className={`day ${day && isToday(day) ? 'today' : ''}`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
