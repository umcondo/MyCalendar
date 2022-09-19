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
import styled from 'styled-components';
import axios from 'axios';

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
						setShowScheduleAddModal((prev) => !prev);
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
					selectedDate={selectedDate}
					setShowScheduleAddModal={setShowScheduleAddModal}
					setSchedule={setSchedule}
					scheduleId={scheduleId}
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
	const [isUpdate, setIsUpdate] = useState(false);
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
		(e, id) => {
			e.stopPropagation();
			// eslint-disable-next-line no-restricted-globals
			const userSelect = confirm('정말 수정하시겠습니까?');
			if (userSelect) {
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
				setIsUpdate((prev) => !prev);
			}
		},
		[setSchedule, text, title, setCurrentSchedule]
	);
	return (
		<ModalContainer>
			<div className="modal-wrapper">
				<span
					className="modal-close-btn"
					onClick={() => {
						setShowScheduleDetailModal((prev) => !prev);
					}}
				>
					{'✖'}
				</span>
				<div className="modal-content">
					{isUpdate ? (
						<input
							className="modal-title"
							value={title}
							onChange={onChangeTitle}
							placeholder="제목을 입력해주세요"
							autoFocus
						/>
					) : (
						<div className="modal-title">{schedule.scheduleTitle}</div>
					)}

					<div className="modal-date">
						<span>날짜</span>
						<span>
							{`${format(schedule.date, 'yyyy')}년  
								${format(schedule.date, 'MM')}월
								${format(schedule.date, 'dd')}일`}
						</span>
					</div>
					{isUpdate ? (
						<textarea
							className="modal-text"
							value={text}
							onChange={onChangeText}
							placeholder="내용을 입력해주세요"
						/>
					) : (
						<div className="modal-text">{schedule.scheduleText}</div>
					)}

					{isUpdate ? (
						<button
							className="modal-btn update-btn"
							onClick={(e) => {
								onUpdateSchedule(e, schedule.scheduleId);
							}}
						>
							수정완료
						</button>
					) : (
						<button
							className="modal-btn update-btn"
							onClick={() => {
								setIsUpdate((prev) => !prev);
							}}
						>
							수정하기
						</button>
					)}
					<button
						className="modal-btn delete-btn"
						onClick={() => {
							onDeleteSchedule(schedule.scheduleId);
						}}
					>
						스케줄 삭제
					</button>
				</div>
			</div>
			<div
				className="modal-background"
				onClick={() => {
					setShowScheduleDetailModal((prev) => !prev);
				}}
			/>
		</ModalContainer>
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
		<ModalContainer>
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

					<button className="modal-btn">스케줄 등록</button>
				</form>
			</div>
			<div
				className="modal-background"
				onClick={() => {
					setShowScheduleAddModal((prev) => !prev);
				}}
			/>
		</ModalContainer>
	);
};
const ModalContainer = styled.div`
	.modal-close-btn {
		position: absolute;
		top: 10px;
		left: 10px;
		cursor: pointer;
		font-size: 1.5rem;
		box-sizing: border-box;
		width: 40px;
		height: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.modal-wrapper {
		position: absolute;
		top: 40%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #fff;
		width: 500px;
		height: 600px;
		padding: 60px;
		box-sizing: border-box;
		z-index: 2;

		display: flex;
		flex-direction: column;

		margin-left: auto;

		border-radius: 3px;
		box-shadow: rgb(15 15 15 / 2%) 0px 0px 0px 1px,
			rgb(15 15 15 / 3%) 0px 3px 6px, rgb(15 15 15 / 6%) 0px 9px 24px;

		margin-right: auto;
	}

	.modal-content {
		display: flex;
		flex-direction: column;
		gap: 15px;
		width: 100%;
		height: 100%;
		position: relative;
	}
	.modal-title {
		min-height: 28px;
		border: 0;
		font-size: 1.5rem;
	}
	.modal-title::placeholder {
		color: rgba(0, 0, 0, 0.4);
	}
	.modal-date {
		font-size: 0.9rem;
		border-bottom: 1px solid rgba(0, 0, 0, 0.2);
		padding-bottom: 15px;
	}
	.modal-date span:nth-child(1) {
		color: rgba(0, 0, 0, 0.5);
	}
	.modal-date span:nth-child(2) {
		margin-left: 40px;
	}
	.modal-text {
		white-space: pre-wrap;

		font-size: 1rem;

		border: 0;
		height: 250px;
		box-sizing: border-box;
		resize: none;
	}
	.modal-text::placeholder {
		font-size: 1rem;
		color: rgba(0, 0, 0, 0.4);
	}
	.modal-btn {
		background-color: #fff;
		border: 1px solid rgba(0, 0, 0, 0.3);
		padding: 10px 0;
		border-radius: 5px;
		cursor: pointer;
		bottom: -20px;
		position: absolute;
		width: 100%;
	}
	.update-btn {
		position: absolute;
		bottom: 30px;
		width: 100%;
	}
	.delete-btn {
		width: 100%;
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
	input:focus,
	textarea:focus {
		outline: none;
	}
`;

const Calendar = styled.div`
	box-sizing: border-box;
	padding: 0 50px;
	width: 100%;
	font-size: 1rem;
	font-weight: 500;

	.calendar__header-wrapper {
		position: relative;
	}

	.calendar__header-btns {
		display: flex;
		align-items: center;
		position: absolute;
		right: 10px;
		top: 10px;
	}
	.calendar__header-btns button {
		background-color: #fff;
		border: 1px solid rgba(0, 0, 0, 0.3);
		border-radius: 4px;
		cursor: pointer;
		height: 22px;
	}
	.calendar__header-btns .text {
		padding: 0 15px;
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
		cursor: pointer;
	}
	.schedule:hover {
		background-color: skyblue;
	}
	.schedule::before {
		content: '•';
		color: white;
		margin: 0 5px;
	}
	.col.cell {
		padding: 5px;
		padding-right: 10px;
		box-sizing: border-box;
		min-height: calc(100vw / 14);
		border: 0.5px solid rgba(1, 1, 1, 0.1);
	}
	.col.cell.disabled {
		color: rgba(1, 1, 1, 0.2);
	}

	.col.cell.today {
		position: relative;
	}

	.col.cell.today span {
		position: absolute;
		top: 3px;
		right: 27px;
		display: flex;
		align-items: center;
		justify-content: center;

		min-width: 1.6rem;
		text-align: center;
		padding: 2px 4px;
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
	// const [currentMonth, setCurrentMonth] = useState(addMonths(new Date(), 3));
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState();

	const [holiday, setHoliday] = useState([]);
	const [schedule, setSchedule] = useState([]);

	const [APIyear, setAPIyear] = useState([
		{ year: format(currentMonth, 'yyyy'), get: false },
	]);

	const prevMonth = useCallback(() => {
		setCurrentMonth(subMonths(currentMonth, 1));
	}, [currentMonth]);

	const nextMonth = useCallback(() => {
		setCurrentMonth(addMonths(currentMonth, 1));
	}, [currentMonth]);

	const [selectedToday, setSelectedToday] = useState();

	const onClickToday = useCallback(() => {
		setSelectedToday(new Date());
		setCurrentMonth(new Date());
	}, []);

	// 처음 렌더링 시 당해의 데이터를 받아온다.
	// 현재 달이 12월이면 다음해 데이터를 받아온다. 1월이면 전년도 데이터를 받아온다.
	// 데이터를 한번 받아오면 더 받아오지 않는다.

	const getHoliday = useCallback(async () => {
		const year = APIyear.filter((elm) => !elm.get)[0]?.year;
		if (year) {
			try {
				const result = await axios.get(
					`https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?solYear=${year}&numOfRows=100&ServiceKey=Jp1JskGd1jDAmnUl31%2Bb3fqVio0uixSSXJj1dUNAK9UJoWDjyMNfhCC1wr3XTxeQ0WZzq5tjURjIYxPZyuK14g%3D%3D&_type=json`
				);
				const response = result.data.response.body.items?.item;
				setHoliday((prev) => [...prev, ...response]);
				setAPIyear((prev) =>
					prev.map((elm) =>
						elm.year === format(currentMonth, 'yyyy')
							? { ...elm, get: true }
							: elm
					)
				);
			} catch (error) {
				console.log(error);
			}
		}
	}, [currentMonth]);

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
			setAPIyear((prev) =>
				prev.filter((elm) => elm.year === nextYear).length
					? prev
					: [...prev, { year: nextYear, get: false }]
			);
		}

		// mem(getHoliday(), { maxAge: 1000 });
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
				selectedToday={selectedToday}
				setSelectedDate={setSelectedDate}
				holiday={holiday}
				schedule={schedule}
				setSchedule={setSchedule}
			/>
		</Calendar>
	);
}
