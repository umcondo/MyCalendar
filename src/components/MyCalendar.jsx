import { useState } from "react";
import "./../calendar.css";

import { format, addMonths, subMonths } from "date-fns";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { isSameMonth, isSameDay, addDays, parse } from "date-fns";
import styled from "styled-components";

const CalendarHeaderWrapper = styled.div`
  position: relative;

  .calendar__header-btns {
    position: absolute;
    right: 10px;
    top: 10px;
  }
`;
const CalendarHeader = ({ currentMonth, prevMonth, nextMonth }) => {
  return (
    <CalendarHeaderWrapper>
      <h1 className="calendar__header-title">
        {`${format(currentMonth, "yyyy")}년 ${format(currentMonth, "M")}월`}
        {/* <span className="text month">{format(currentMonth, 'M')}월</span> */}
      </h1>

      <div className="calendar__header-btns">
        <button onClick={prevMonth}>{"<"}</button>
        <button>{"오늘"}</button>
        <button onClick={nextMonth}>{">"}</button>
      </div>
    </CalendarHeaderWrapper>
  );
};

const CalendarDaysWrapper = styled.div`
  display: flex;
`;
const CalendarDays = () => {
  const days = [];
  const date = ["일", "월", "화", "수", "목", "금", "토"];

  for (let i = 0; i < 7; i++) {
    days.push(
      <div className="col days" key={i}>
        {date[i]}
      </div>
    );
  }

  return <CalendarDaysWrapper>{days}</CalendarDaysWrapper>;
};

const CalendarCellsWrapper = styled.div``;

const CalendarCells = ({ currentMonth, selectedDate, onDateClick }) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);

  const endDate = endOfWeek(monthEnd);
  //   const endDate = startDate + 35;

  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, "d");
      const cloneDay = day;

      days.push(
        <div
          className={`col cell ${
            !isSameMonth(day, monthStart)
              ? "disabled"
              : isSameDay(day, selectedDate)
              ? "selected"
              : format(currentMonth, "M") !== format(day, "M")
              ? "not-valid"
              : "valid"
          }`}
          key={day}
          onClick={() => onDateClick(parse(cloneDay))}
        >
          <span
            className={
              format(currentMonth, "M") !== format(day, "M")
                ? "text not-valid"
                : ""
            }
          >
            {formattedDate}
          </span>
          {"일"}
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="row" key={day}>
        {days}
      </div>
    );
    days = [];
  }
  return <CalendarCellsWrapper>{rows}</CalendarCellsWrapper>;
};

const Calendar = styled.div`
  box-sizing: border-box;
  padding: 0 50px;
  width: 100%;
  font-size: 1rem;

  .col {
    width: calc(100% / 7);
    text-align: end;
  }
  .col:nth-child(1),
  .col:nth-last-child(1) {
    color: rgba(1, 1, 1, 0.5);
    background-color: #ececec;
  }

  .col.days {
    padding: 5px;
    border-bottom: 1px solid #121212;
    background-color: #fff;
  }

  .col.cell {
    padding: 5px;
    padding-right: 10px;
    box-sizing: border-box;
    height: calc(100vw / 15);
    border: 0.5px solid rgba(1, 1, 1, 0.1);
  }
  .col.cell.disabled {
    color: rgba(1, 1, 1, 0.2);
  }

  .col.cell.selected {
    position: relative;
  }

  .col.cell.selected span {
    position: absolute;
    top: 2px;
    right: 25px;
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    text-align: center;
    padding: 3px;
    box-sizing: border-box;
    color: white;
    background-color: red;
    border-radius: 50%;
  }

  .col.cell:nth-last-child(1) {
    border-right: 0;
  }
  .col.cell:nth-child(1) {
    border-left: 0;
  }

  .row:nth-last-child(1) .col.cell {
    border-bottom: 0;
  }
  .row {
    display: flex;
  }
`;
export default function MyCalender() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  const onDateClick = (day) => {
    setSelectedDate(day);
  };
  return (
    <Calendar>
      <CalendarHeader
        currentMonth={currentMonth}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
      />
      <CalendarDays />
      <CalendarCells
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        onDateClick={onDateClick}
      />
    </Calendar>
  );
}
