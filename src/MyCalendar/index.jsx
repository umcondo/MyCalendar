import { useCallback, useEffect, useState } from 'react';

import { format, addMonths, subMonths } from 'date-fns';

import axios from 'axios';
import { Calendar } from 'react-calendar';

import CalendarHeader from './components/CalendarHeader';
import CalendarDays from './components/CalendarDays';
import CalendarCells from './components/CalendarCells';

export default function MyCalender() {
	const [currentMonth, setCurrentMonth] = useState(addMonths(new Date(), 3));
	// const [currentMonth, setCurrentMonth] = useState(new Date());
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

	// useEffect(() => {
	// 	console.log(format(currentMonth, 'MM'));
	// 	if (format(currentMonth, 'MM') === '01') {
	// 		const postYear = format(currentMonth, 'yyyy') * 1 - 1 + '';
	// 		setAPIyear((prev) =>
	// 			prev.filter((elm) => elm.year === postYear).length
	// 				? prev
	// 				: [...prev, { year: postYear, get: false }]
	// 		);
	// 	}
	// 	if (format(currentMonth, 'MM') === '12') {
	// 		const nextYear = format(currentMonth, 'yyyy') * 1 + 1 + '';
	// 		setAPIyear((prev) =>
	// 			prev.filter((elm) => elm.year === nextYear).length
	// 				? prev
	// 				: [...prev, { year: nextYear, get: false }]
	// 		);
	// 	}
	// }, [currentMonth]);

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
