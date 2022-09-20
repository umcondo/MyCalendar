import { useCallback, useEffect, useRef, useState } from 'react';

import {
	format,
	addMonths,
	subMonths,
	startOfMonth,
	startOfWeek,
	isSameMonth,
	isSameDay,
	addDays,
} from 'date-fns';

import './../style.css';

const CalendarHeader = ({
	currentMonth,
	prevMonth,
	nextMonth,
	onClickToday,
}) => {
	return (
		<div className="calendar__header-wrapper">
			<h1 className="calendar__header-title">
				{`${format(currentMonth, 'yyyy')}년 ${format(currentMonth, 'M')}월`}
			</h1>

			<div className="calendar__header-btns">
				<button onClick={prevMonth}>{'<'}</button>
				<button className="text" onClick={onClickToday}>
					{'오늘'}
				</button>
				<button onClick={nextMonth}>{'>'}</button>
			</div>
		</div>
	);
};

const CalendarDays = () => {
	const date = ['일', '월', '화', '수', '목', '금', '토'];

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
	selectedToday,
	setSelectedDate,
	setSchedule,
	schedule,
}) => {
	const [showScheduleAddModal, setShowScheduleAddModal] = useState(false);
	const [showScheduleDetailModal, setShowScheduleDetailModal] = useState(false);
	const [currentSchedule, setCurrentSchedule] = useState();
	const scheduleId = useRef(0);

	const monthStart = startOfMonth(currentMonth);
	const startDate = startOfWeek(monthStart);
	const endDate = addDays(startDate, 35);

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
							: ''
					}`}
					key={day}
					onClick={() => {
						setSelectedDate(currentDay);
						setShowScheduleAddModal((prev) => !prev);
					}}
				>
					<span>
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
									<div
										className="schedule"
										key={elm.scheduleId}
										onClick={(e) => {
											e.stopPropagation();
											setShowScheduleDetailModal((prev) => !prev);
											setCurrentSchedule(elm);
										}}
									>
										{elm.scheduleTitle}
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
			{showScheduleDetailModal && (
				<ScheduleDetailModal
					schedule={currentSchedule}
					setShowScheduleDetailModal={setShowScheduleDetailModal}
					setSchedule={setSchedule}
					setCurrentSchedule={setCurrentSchedule}
				/>
			)}

			{showScheduleAddModal && (
				<ScheduleAddModal
					scheduleId={scheduleId}
					selectedDate={selectedDate}
					setShowScheduleAddModal={setShowScheduleAddModal}
					setSchedule={setSchedule}
				/>
			)}
		</>
	);
};

const ScheduleDetailModal = ({
	schedule,
	setShowScheduleDetailModal,
	setSchedule,
	setCurrentSchedule,
}) => {
	const [text, setText] = useState(schedule.scheduleText);
	const [title, setTitle] = useState(schedule.scheduleTitle);

	const onChangeText = useCallback((e) => {
		setText(e.target.value);
	}, []);
	const onChangeTitle = useCallback((e) => {
		setTitle(e.target.value);
	}, []);

	const onDeleteSchedule = useCallback(
		(id) => {
			// eslint-disable-next-line no-restricted-globals
			const userSelect = confirm('정말 삭제하시겠습니까?');
			if (userSelect) {
				setSchedule((prev) => prev.filter((elm) => elm.scheduleId !== id));
				setShowScheduleDetailModal((prev) => !prev);
			}
		},
		[setSchedule, setShowScheduleDetailModal]
	);

	const onUpdateSchedule = useCallback(
		(id) => {
			setSchedule((prev) =>
				prev.map((elm) =>
					elm.scheduleId === id
						? { ...elm, scheduleText: text, scheduleTitle: title }
						: elm
				)
			);
			setCurrentSchedule((prev) => ({
				...prev,
				scheduleText: text,
				scheduleTitle: title,
			}));
		},
		[setSchedule, text, title, setCurrentSchedule]
	);

	return (
		<div className="calendar__modal-container">
			<div className="modal-wrapper">
				<span
					className="modal-close-btn"
					onClick={() => {
						setShowScheduleDetailModal((prev) => !prev);
						onUpdateSchedule(schedule.scheduleId);
					}}
				>
					{'✖'}
				</span>
				<div className="modal-content">
					<input
						type="text"
						className="modal-title"
						value={title}
						onChange={onChangeTitle}
						placeholder="제목을 입력해주세요"
						autoFocus
					/>
					<div className="modal-date">
						<span>날짜</span>
						<span>
							{`${format(schedule.date, 'yyyy')}년  
								${format(schedule.date, 'MM')}월
								${format(schedule.date, 'dd')}일`}
						</span>
					</div>
					<textarea
						className="modal-text"
						value={text}
						onChange={onChangeText}
						placeholder="내용을 입력해주세요"
					/>
					<button
						className="modal-btn delete-btn"
						onClick={() => {
							onDeleteSchedule(schedule.scheduleId);
						}}
					>
						삭제
					</button>
				</div>
			</div>
			<div
				className="modal-background"
				onClick={() => {
					setShowScheduleDetailModal((prev) => !prev);
					onUpdateSchedule(schedule.scheduleId);
				}}
			/>
		</div>
	);
};
const ScheduleAddModal = ({
	selectedDate,
	setShowScheduleAddModal,
	setSchedule,
	scheduleId,
}) => {
	const [text, setText] = useState('');
	const [title, setTitle] = useState('');
	const onChangeText = useCallback((e) => {
		setText(e.target.value);
	}, []);
	const onChangeTitle = useCallback((e) => {
		setTitle(e.target.value);
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
					scheduleTitle: title,
				},
			]);
			setShowScheduleAddModal((prev) => !prev);
		},
		[
			setSchedule,
			setShowScheduleAddModal,
			selectedDate,
			text,
			scheduleId,
			title,
		]
	);

	return (
		<div className="calendar__modal-container">
			<div className="modal-wrapper">
				<span
					className="modal-close-btn"
					onClick={() => {
						setShowScheduleAddModal((prev) => !prev);
					}}
				>
					{'✖'}
				</span>
				<form onSubmit={onSubmit} className="modal-content">
					<input
						type="text"
						className="modal-title"
						value={title}
						onChange={onChangeTitle}
						placeholder="제목을 입력해주세요"
						autoFocus
					/>

					<div className="modal-date">
						<span>날짜</span>
						<span>
							{`${format(selectedDate, 'yyyy')}년  
								${format(selectedDate, 'MM')}월
								${format(selectedDate, 'dd')}일`}
						</span>
					</div>

					<textarea
						className="modal-text"
						value={text}
						onChange={onChangeText}
						placeholder="내용을 입력해주세요"
					/>

					<button className="modal-btn">등록</button>
				</form>
			</div>
			<div
				className="modal-background"
				onClick={() => {
					setShowScheduleAddModal((prev) => !prev);
				}}
			/>
		</div>
	);
};

export default function Calender() {
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState();

	const [holiday, setHoliday] = useState([]);
	const [schedule, setSchedule] = useState([]);

	const [APIyear, setAPIyear] = useState([
		{ year: format(new Date(), 'yyyy'), get: false },
	]);

	const prevMonth = () => {
		setCurrentMonth(subMonths(currentMonth, 1));
	};

	const nextMonth = () => {
		setCurrentMonth(addMonths(currentMonth, 1));
	};

	const [selectedToday, setSelectedToday] = useState();

	const onClickToday = () => {
		setSelectedToday(new Date());
		setCurrentMonth(new Date());
	};

	/* 
	처음 렌더링 시 당해 데이터를 받아온다.
	현재 달이 12월이면 다음해 데이터를 받아온다. 1월이면 전년도 데이터를 받아온다.
	데이터를 한번 받아오면 더 받아오지 않는다.
	*/

	const getHoliday = useCallback(async () => {
		const year = APIyear.filter((elm) => !elm.get)[0]?.year;
		if (year) {
			try {
				setAPIyear((prev) =>
					prev.map((elm) => (elm.year === year ? { ...elm, get: true } : elm))
				);
				const result = await fetch(
					`https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?solYear=${year}&numOfRows=100&ServiceKey=Jp1JskGd1jDAmnUl31%2Bb3fqVio0uixSSXJj1dUNAK9UJoWDjyMNfhCC1wr3XTxeQ0WZzq5tjURjIYxPZyuK14g%3D%3D&_type=json`
				);
				const data = await result.json();
				const response = data.response.body.items?.item;
				setHoliday((prev) => [...prev, ...response]);
			} catch (error) {
				console.log(error);
			}
		}
	}, [APIyear]);

	useEffect(() => {
		if (format(currentMonth, 'MM') === '01') {
			const postYear = format(currentMonth, 'yyyy') * 1 - 1 + '';
			setAPIyear((prev) =>
				prev.filter((elm) => elm.year === postYear).length
					? prev
					: [...prev, { year: postYear, get: false }]
			);
		}

		if (format(currentMonth, 'MM') === '12') {
			const nextYear = format(currentMonth, 'yyyy') * 1 + 1 + '';
			if (nextYear < 2025) {
				setAPIyear((prev) =>
					prev.filter((elm) => elm.year === nextYear).length
						? prev
						: [...prev, { year: nextYear, get: false }]
				);
			}
		}
		getHoliday();
	}, [currentMonth, getHoliday]);

	if (!holiday.length) {
		return <div>공휴일 데이터 받아오는중...</div>;
	}
	return (
		<div className="calendar__container">
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
				selectedToday={selectedToday}
				setSelectedDate={setSelectedDate}
				holiday={holiday}
				schedule={schedule}
				setSchedule={setSchedule}
			/>
		</div>
	);
}
