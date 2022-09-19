import {
	format,
	isSameMonth,
	isSameDay,
	startOfMonth,
	startOfWeek,
	addDays,
} from 'date-fns';
import { useRef, useState } from 'react';
import Modal from '../Modal';

const CalendarCells = ({
	currentMonth,
	selectedDate,
	holiday,
	selectedToday,
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
			const formattedDate = format(day, 'd');
			const currentDay = day;
			const dd = format(day, 'dd');
			const MM = format(day, 'MM');
			const yyyy = format(day, 'yyyy');

			days.push(
				<div
					className={`col cell ${
						!isSameMonth(day, monthStart)
							? 'disabled'
							: isSameDay(day, selectedToday)
							? 'today'
							: format(currentMonth, 'M') !== format(day, 'M')
							? 'not-valid'
							: 'valid'
					}`}
					key={day}
					onClick={() => {
						setSelectedDate(currentDay);
						setShowModal((prev) => !prev);
					}}
				>
					<span
						className={
							format(currentMonth, 'M') !== format(day, 'M')
								? 'text not-valid'
								: ''
						}
					>
						{formattedDate === '1'
							? `${format(day, 'M')}월 ${formattedDate}`
							: formattedDate}
					</span>
					{'일'}

					<div className="date-text-wrapper">
						{/* holiday */}
						{holiday.map((elm, idx) => {
							const year = (elm.locdate + '').slice(0, 4);
							const month = (elm.locdate + '').slice(4, 6);
							const date = (elm.locdate + '').slice(6);
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
							if (format(elm.date, 't') === format(currentDay, 't')) {
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

export default CalendarCells;
