import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  startOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
} from "date-fns";
import mem from "mem";
import styled from "styled-components";
import axios from "axios";

const CalendarHeader = ({
  currentMonth,
  prevMonth,
  nextMonth,
  onClickToday,
}) => {
  return (
    <div className="calendar__header-wrapper">
      <h1 className="calendar__header-title">
        {`${format(currentMonth, "yyyy")}년 ${format(currentMonth, "M")}월`}
      </h1>

      <div className="calendar__header-btns">
        <button onClick={prevMonth}>{"<"}</button>
        <button onClick={onClickToday}>{"오늘"}</button>
        <button onClick={nextMonth}>{">"}</button>
      </div>
    </div>
  );
};

const CalendarDays = () => {
  const date = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="calendar__days-wrapper row">
      {date.map((day, idx) => (
        <div className="col days" key={idx}>
          {day}
        </div>
      ))}
    </div>
  );
};

const CalendarCells = ({
  currentMonth,
  selectedDate,
  holiday,
  setSelectedDate,
  setSchedule,
  schedule,
}) => {
  const [showModal, setShowModal] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart);

  const endDate = addDays(startDate, 35);

  const scheduleId = useRef(0);

  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const formattedDate = format(day, "d");
      const currentDay = day;
      const dd = format(day, "dd");
      const MM = format(day, "MM");
      const yyyy = format(day, "yyyy");

      days.push(
        <div
          className={`col cell ${
            !isSameMonth(day, monthStart)
              ? "disabled"
              : isSameDay(day, new Date())
              ? "today"
              : format(currentMonth, "M") !== format(day, "M")
              ? "not-valid"
              : "valid"
          }`}
          key={day}
          onClick={() => {
            setSelectedDate(currentDay);
            setShowModal((prev) => !prev);
          }}
        >
          {}
          <span
            className={
              format(currentMonth, "M") !== format(day, "M")
                ? "text not-valid"
                : ""
            }
          >
            {formattedDate === "1"
              ? `${format(day, "M")}월 ${formattedDate}`
              : formattedDate}
          </span>
          {"일"}

          <div className="date-text-wrapper">
            {/* holiday */}
            {holiday.map((elm, idx) => {
              const year = (elm.locdate + "").slice(0, 4);
              const month = (elm.locdate + "").slice(4, 6);
              const date = (elm.locdate + "").slice(6);
              const holidayName = elm.dateName;
              if (date === dd && year === yyyy && month === MM) {
                return (
                  <div className="holiday" key={idx}>
                    {holidayName}
                  </div>
                );
              }
            })}

            {/* schedule */}

            {schedule.map((elm) => {
              if (format(elm.date, "t") === format(currentDay, "t")) {
                return (
                  <div className="schedule" key={elm.scheduleId}>
                    {elm.scheduleText}
                  </div>
                );
              }
            })}
          </div>
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

  return (
    <>
      <div className="calendar__date-wrapper">{rows}</div>
      {showModal && (
        <Modal
          selectedDate={selectedDate}
          setShowModal={setShowModal}
          setSchedule={setSchedule}
          schedule={schedule}
          scheduleId={scheduleId}
        />
      )}
    </>
  );
};

const Modal = ({
  selectedDate,
  setShowModal,
  setSchedule,
  schedule,
  scheduleId,
}) => {
  const [text, setText] = useState("");
  const onChange = useCallback((e) => {
    setText(e.target.value);
  }, []);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setSchedule((prev) => [
        ...prev,
        {
          scheduleId: scheduleId.current++,
          date: selectedDate,
          scheduleText: text,
        },
      ]);
      setShowModal((prev) => !prev);
    },
    [setSchedule, setShowModal, selectedDate, text, scheduleId]
  );

  const onDelete = useCallback(
    (id) => setSchedule((prev) => prev.filter((elm) => elm.scheduleId !== id)),
    [setSchedule]
  );
  return (
    <ModalContainer>
      <div className="modal-wapper">
        <h1>스케줄을 입력해주세요</h1>
        <span>
          {format(selectedDate, "yyyy") +
            format(selectedDate, "MM") +
            format(selectedDate, "dd")}
        </span>
        {schedule
          .filter((elm) => format(elm.date, "t") === format(selectedDate, "t"))
          .map((elm) => (
            <div key={elm.scheduleId}>
              <span>{elm.scheduleId}</span>
              <span>{elm.scheduleText}</span>
              <button
                onClick={() => {
                  onDelete(elm.scheduleId);
                }}
              >
                삭제
              </button>
            </div>
          ))}
        <form onSubmit={onSubmit}>
          <input value={text} onChange={onChange} />

          <button>입력</button>
        </form>
      </div>
      <div
        className="modal-background"
        onClick={() => {
          setShowModal((prev) => !prev);
        }}
      />
    </ModalContainer>
  );
};
const ModalContainer = styled.div`
  .modal-wapper {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 20px;
    background-color: #ececec;
    width: 300px;
    height: 400px;
    padding: 20px;
    box-sizing: border-box;
    z-index: 2;
  }

  .modal-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 1;
  }
`;

const Calendar = styled.div`
  box-sizing: border-box;
  padding: 0 50px;
  width: 100%;
  font-size: 1rem;

  .calendar__header-wrapper {
    position: relative;
  }

  .calendar__header-btns {
    position: absolute;
    right: 10px;
    top: 10px;
  }
  .calendar__header-btns button {
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    cursor: pointer;
  }

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
  .date-text-wrapper {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .holiday {
    background-color: #ffccd9;
    text-align: start;
    color: #000;
    padding-left: 10px;
    border-radius: 5px;
    margin-left: 5px;
  }

  .schedule {
    background-color: #19acf8;

    border-radius: 5px;
    text-align: start;
    color: white;
  }
  .schedule::before {
    content: "•";
    color: white;
  }
  .col.cell {
    padding: 5px;
    padding-right: 10px;
    box-sizing: border-box;
    height: calc(100vw / 14);
    border: 0.5px solid rgba(1, 1, 1, 0.1);
    overflow-y: hidden;
  }
  .col.cell.disabled {
    color: rgba(1, 1, 1, 0.2);
  }

  .col.cell.today {
    position: relative;
  }

  .col.cell.today span {
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
  const [selectedDate, setSelectedDate] = useState();

  const [holiday, setHoliday] = useState([]);

  const [schedule, setSchedule] = useState([]);

  const [APIyear, setAPIyear] = useState([
    { year: format(currentMonth, "yyyy"), get: false },
  ]);

  const prevMonth = useCallback(() => {
    setCurrentMonth(subMonths(currentMonth, 1));
  }, [currentMonth]);

  const nextMonth = useCallback(() => {
    setCurrentMonth(addMonths(currentMonth, 1));
  }, [currentMonth]);

  const onClickToday = useCallback(() => {
    setSelectedDate(new Date());
    setCurrentMonth(new Date());
  }, []);

  //   const getYearHoliday = useCallback(async () => {
  //     const year = APIyear.filter((elm) => !elm.get)[0].year;
  //     try {
  //       const result = await axios.get(
  //         `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?solYear=${year}&numOfRows=100&ServiceKey=Jp1JskGd1jDAmnUl31%2Bb3fqVio0uixSSXJj1dUNAK9UJoWDjyMNfhCC1wr3XTxeQ0WZzq5tjURjIYxPZyuK14g%3D%3D&_type=json`
  //       );
  //       const response = result.data.response.body.items?.item;
  //       setHoliday((prev) => [...prev, ...response]);
  //       setAPIyear((prev) =>
  //         prev.map((elm) =>
  //           elm.year === format(currentMonth, "yyyy")
  //             ? { ...elm, get: true }
  //             : elm
  //         )
  //       );
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }, [APIyear, currentMonth]);

  useEffect(() => {
    if (format(currentMonth, "MM") === "02") {
      const postYear = format(currentMonth, "yyyy") * 1 - 1 + "";
      setAPIyear((prev) =>
        prev.filter((elm) => elm.year === postYear).length
          ? prev
          : [...prev, { year: postYear, get: false }]
      );
    }
    if (format(currentMonth, "MM") === "11") {
      const nextYear = format(currentMonth, "yyyy") * 1 + 1 + "";
      setAPIyear((prev) =>
        prev.filter((elm) => elm.year === nextYear).length
          ? prev
          : [...prev, { year: nextYear, get: false }]
      );
    }
  }, [currentMonth]);
  //   const currentYear = useMemo(
  //     () => format(currentMonth, "yyyy"),
  //     [currentMonth]
  //   );

  // 12월이면 다음해 데이터를 받아온다. 1월이면 전년도 데이터를 받아온다.

  useEffect(() => {
    const getHoliday = mem(
      async () => {
        const year = APIyear.filter((elm) => !elm.get)[0].year;
        if (year) {
          try {
            const result = await axios.get(
              `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?solYear=${year}&numOfRows=100&ServiceKey=Jp1JskGd1jDAmnUl31%2Bb3fqVio0uixSSXJj1dUNAK9UJoWDjyMNfhCC1wr3XTxeQ0WZzq5tjURjIYxPZyuK14g%3D%3D&_type=json`
            );
            const response = result.data.response.body.items?.item;
            setHoliday((prev) => [...prev, ...response]);
            setAPIyear((prev) =>
              prev.map((elm) =>
                elm.year === format(currentMonth, "yyyy")
                  ? { ...elm, get: true }
                  : elm
              )
            );
          } catch (error) {
            console.log(error);
          }
        }
      },
      { maxAge: 1000 }
    );
    // const getHoliday = async () => {
    //   try {
    //     const result = await axios.get(
    //       `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?solYear=${APIyear[0].year}&numOfRows=100&ServiceKey=Jp1JskGd1jDAmnUl31%2Bb3fqVio0uixSSXJj1dUNAK9UJoWDjyMNfhCC1wr3XTxeQ0WZzq5tjURjIYxPZyuK14g%3D%3D&_type=json`
    //     );
    //     const response = result.data.response.body.items?.item;
    //     setHoliday(response);
    //     setAPIyear((prev) =>
    //       prev.map((elm) =>
    //         elm.year === format(currentMonth, "yyyy")
    //           ? { ...elm, get: true }
    //           : elm
    //       )
    //     );
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    getHoliday();
  }, [currentMonth]);

  if (!holiday) {
    return <div>공휴일 데이터 받아오는중...</div>;
  }
  return (
    <Calendar>
      <CalendarHeader
        currentMonth={currentMonth}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
        onClickToday={onClickToday}
      />
      <CalendarDays />
      <CalendarCells
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        // onDateClick={onDateClick}
        setSelectedDate={setSelectedDate}
        holiday={holiday}
        schedule={schedule}
        setSchedule={setSchedule}
      />
    </Calendar>
  );
}
