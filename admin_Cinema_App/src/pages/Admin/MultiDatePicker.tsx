import React, { useState } from "react";
import "./MultiDatePicker.css";

interface Props {
  onChange: (dates: string[]) => void;
}

const MultiDatePicker: React.FC<Props> = ({ onChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const getDaysInMonth = (month: Date) => {
    const start = new Date(month.getFullYear(), month.getMonth(), 1);
    const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    return { startDay: start.getDay(), totalDays: end.getDate() };
  };

  const handleDayClick = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    const iso = date.toISOString().split("T")[0];

    let updated;

    if (selectedDates.includes(iso)) {
      // remove if clicked again
      updated = selectedDates.filter(d => d !== iso);
    } else {
      // add new date
      updated = [...selectedDates, iso];
    }

    setSelectedDates(updated);
    onChange(updated);
  };

  const { startDay, totalDays } = getDaysInMonth(currentMonth);

  const goPrev = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );

  const goNext = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );

  return (
    <div className="multi-calendar-container">
      <div className="multi-calendar-header">
        <button onClick={goPrev}>◀</button>
        <h3>
          {currentMonth.toLocaleString("en-US", { month: "long" })}{" "}
          {currentMonth.getFullYear()}
        </h3>
        <button onClick={goNext}>▶</button>
      </div>

      <div className="multi-calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
          <div key={d} className="multi-calendar-day-name">{d}</div>
        ))}

        {/* Empty slots before first day */}
        {[...Array(startDay)].map((_, i) => (
          <div key={"empty-" + i} className="multi-calendar-empty"></div>
        ))}

        {/* Days */}
        {Array.from({ length: totalDays }, (_, i) => i + 1).map(day => {
          const iso = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day
          )
            .toISOString()
            .slice(0, 10);

          const isSelected = selectedDates.includes(iso);

          return (
            <div
              key={day}
              className={`multi-calendar-day ${isSelected ? "selected" : ""}`}
              onClick={() => handleDayClick(day)}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="multi-selected-list">
        <h4>Selected Dates:</h4>
        {selectedDates.length === 0 ? (
          <p>No dates selected</p>
        ) : (
          <ul>
            {selectedDates.map(d => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MultiDatePicker;
